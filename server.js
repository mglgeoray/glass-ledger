const http = require("node:http");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = resolveDataDirectory();
const STORE_FILE = path.join(DATA_DIR, "store.runtime.json");
const CREDENTIALS_FILE = path.join(DATA_DIR, "credentials.runtime.json");
const PORT = Number(process.env.PORT || 3187);
const HOST = process.env.HOST || "0.0.0.0";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ONE_MB = 1024 * 1024;
const SCHEMA_VERSION = 5;
const DEFAULT_ADMIN_CODE = "Sun60077779";
const DEFAULT_MANAGER_CODE = "viewer123";
const DEFAULT_EDITOR_CODE = "editor123";
const DEFAULT_MANAGER_NAME = "Борлуулагч 1";
const LOGIN_MAX_ATTEMPTS = getEnvPositiveInteger("GLASS_LEDGER_LOGIN_MAX_ATTEMPTS", 8);
const LOGIN_WINDOW_MS = getEnvPositiveInteger("GLASS_LEDGER_LOGIN_WINDOW_MINUTES", 15) * 60 * 1000;
const LOGIN_BLOCK_MS = getEnvPositiveInteger("GLASS_LEDGER_LOGIN_BLOCK_MINUTES", 15) * 60 * 1000;
const INSECURE_ACCESS_CODES = new Set([DEFAULT_ADMIN_CODE, DEFAULT_MANAGER_CODE, DEFAULT_EDITOR_CODE]);

const sessions = new Map();
const loginAttempts = new Map();
let storeCache;
let credentialsCache;
let writeQueue = Promise.resolve();

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function asBadRequest(operation) {
  try {
    return operation();
  } catch (error) {
    error.statusCode = error.statusCode || 400;
    throw error;
  }
}

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function resolveDataDirectory() {
  const explicitDataDir = String(process.env.GLASS_LEDGER_DATA_DIR || "").trim();
  if (explicitDataDir) {
    return path.resolve(explicitDataDir);
  }

  const railwayVolumeMountPath = String(process.env.RAILWAY_VOLUME_MOUNT_PATH || "").trim();
  if (railwayVolumeMountPath) {
    return path.resolve(railwayVolumeMountPath);
  }

  return path.join(ROOT_DIR, "data");
}

function getEnvPositiveInteger(name, fallbackValue) {
  const rawValue = String(process.env[name] || "").trim();
  if (!rawValue) {
    return fallbackValue;
  }

  const parsed = Number.parseInt(rawValue, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallbackValue;
}

function isProductionLikeRuntime() {
  const nodeEnv = String(process.env.NODE_ENV || "").trim().toLowerCase();
  return (
    nodeEnv === "production" ||
    Boolean(String(process.env.RAILWAY_PROJECT_ID || "").trim()) ||
    Boolean(String(process.env.RAILWAY_ENVIRONMENT || "").trim()) ||
    Boolean(String(process.env.RAILWAY_PUBLIC_DOMAIN || "").trim())
  );
}

function allowInsecureDefaultCredentials() {
  return String(process.env.GLASS_LEDGER_ALLOW_INSECURE_DEFAULTS || "").trim() === "1";
}

function isPlaceholderAccessCode(value) {
  const normalized = String(value || "").trim().toUpperCase();
  return normalized.includes("CHANGE_THIS") || normalized.includes("CHANGE_ME") || normalized.includes("YOUR_");
}

function isInsecureAccessCode(value) {
  const normalized = String(value || "").trim();
  return !normalized || normalized.length < 8 || INSECURE_ACCESS_CODES.has(normalized) || isPlaceholderAccessCode(normalized);
}

function collectCredentialSecurityIssues(credentials) {
  const issues = [];
  if (isInsecureAccessCode(credentials.adminCode)) {
    issues.push("ADMIN код сул эсвэл default утгатай байна.");
  }

  for (const account of credentials.managerAccounts || []) {
    if (isInsecureAccessCode(account.accessCode)) {
      issues.push(`Борлуулагч "${account.name}"-ийн код сул эсвэл default утгатай байна.`);
    }
  }

  return issues;
}

function enforceCredentialSecurity(credentials) {
  if (!isProductionLikeRuntime() || allowInsecureDefaultCredentials()) {
    return;
  }

  const issues = collectCredentialSecurityIssues(credentials);
  if (!issues.length) {
    return;
  }

  throw new Error(
    `Security check failed for public deployment.\n${issues.join("\n")}\nSet strong values in GLASS_LEDGER_ADMIN_CODE and manager access codes before starting the app.`,
  );
}

function buildDefaultStore() {
  return {
    schemaVersion: SCHEMA_VERSION,
    products: [
      {
        id: "glass-1370x2200x4",
        name: "1370 x 2200 x 4 мм",
        defaultPiecesPerCrate: 82,
      },
      {
        id: "glass-1500x2000x4",
        name: "1500 x 2000 x 4 мм",
        defaultPiecesPerCrate: 82,
      },
    ],
    entries: [],
    importBatches: [],
    damageRecords: [],
    materialPurchases: [],
    salaryRecords: [],
    invoiceSettings: buildDefaultInvoiceSettings(),
  };
}

function buildDefaultInvoiceSettings() {
  return {
    companyName: "Шилний данс",
    phone: "",
    bankName: "",
    bankAccount: "",
    logoText: "ШД",
    qrText: "",
    footerNote: "Худалдан авалт хийсэнд баярлалаа.",
  };
}

function buildDefaultCredentials() {
  const seededManagerCode = String(process.env.GLASS_LEDGER_MANAGER_CODE || process.env.GLASS_LEDGER_VIEWER_CODE || "").trim();
  const seededManagerName = normalizeUserDisplayName(process.env.GLASS_LEDGER_MANAGER_NAME || DEFAULT_MANAGER_NAME) || DEFAULT_MANAGER_NAME;

  return {
    adminCode:
      String(process.env.GLASS_LEDGER_ADMIN_CODE || process.env.GLASS_LEDGER_EDITOR_CODE || "").trim() ||
      (isProductionLikeRuntime() ? "" : DEFAULT_ADMIN_CODE),
    managerAccounts: seededManagerCode
      ? [
          {
            id: crypto.randomUUID(),
            name: seededManagerName,
            accessCode: seededManagerCode,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
      : isProductionLikeRuntime()
        ? []
        : [
            {
              id: crypto.randomUUID(),
              name: seededManagerName,
              accessCode: DEFAULT_MANAGER_CODE,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
  };
}

function normalizeCredentials(rawCredentials) {
  const defaults = buildDefaultCredentials();
  const raw = rawCredentials && typeof rawCredentials === "object" ? rawCredentials : {};

  let managerAccounts = [];
  if (Array.isArray(raw.managerAccounts)) {
    managerAccounts = raw.managerAccounts;
  } else if (Array.isArray(raw.managers)) {
    managerAccounts = raw.managers;
  } else {
    const legacyManagerCode = String(raw.managerCode || raw.viewerCode || "").trim();
    if (legacyManagerCode) {
      managerAccounts = [
        {
          id: crypto.randomUUID(),
          name: normalizeUserDisplayName(raw.managerName || DEFAULT_MANAGER_NAME) || DEFAULT_MANAGER_NAME,
          accessCode: legacyManagerCode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  }

  const normalizedManagerAccounts = managerAccounts
    .map(normalizeStoredManagerAccount)
    .filter(Boolean);

  return {
    adminCode: String(raw.adminCode || raw.editorCode || defaults.adminCode).trim(),
    managerAccounts: normalizedManagerAccounts.length ? normalizedManagerAccounts : defaults.managerAccounts,
  };
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "").trim());
}

function toMoneyNumber(value) {
  const parsed = Number.parseFloat(String(value ?? 0));
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return Number(parsed.toFixed(2));
}

function toPositiveInteger(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function normalizeUserDisplayName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 60);
}

function maskSecret(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "(empty)";
  }

  if (text.length <= 4) {
    return "*".repeat(text.length);
  }

  if (text.length <= 8) {
    return `${text.slice(0, 1)}${"*".repeat(text.length - 2)}${text.slice(-1)}`;
  }

  return `${text.slice(0, 3)}${"*".repeat(Math.max(2, text.length - 5))}${text.slice(-2)}`;
}

function normalizeStoredManagerAccount(rawAccount) {
  if (!rawAccount || typeof rawAccount !== "object") {
    return null;
  }

  const name = normalizeUserDisplayName(rawAccount.name || rawAccount.displayName || "");
  const accessCode = String(rawAccount.accessCode || rawAccount.code || "").trim();
  if (!name || !accessCode) {
    return null;
  }

  return {
    id: String(rawAccount.id || crypto.randomUUID()),
    name,
    accessCode,
    createdAt: String(rawAccount.createdAt || new Date().toISOString()),
    updatedAt: String(rawAccount.updatedAt || rawAccount.createdAt || new Date().toISOString()),
  };
}

function normalizeProduct(rawProduct, fallbackProduct) {
  const product = rawProduct && typeof rawProduct === "object" ? rawProduct : {};
  const fallback = fallbackProduct || {};
  const id = String(product.id || fallback.id || crypto.randomUUID()).trim();
  const name = normalizeProductName(product.name || fallback.name || id) || id;
  const defaultPiecesPerCrate =
    toPositiveInteger(product.defaultPiecesPerCrate ?? product.piecesPerCrate ?? fallback.defaultPiecesPerCrate) ||
    82;

  return {
    id,
    name,
    defaultPiecesPerCrate,
  };
}

function normalizeProductName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function buildCostFields(source = {}) {
  return {
    importCost: toMoneyNumber(source.importCost ?? 0) ?? 0,
    taxCost: toMoneyNumber(source.taxCost ?? 0) ?? 0,
    transportCost: toMoneyNumber(source.transportCost ?? 0) ?? 0,
    wageCost: toMoneyNumber(source.wageCost ?? 0) ?? 0,
    otherCost: toMoneyNumber(source.otherCost ?? 0) ?? 0,
  };
}

function getBatchTotalCost(batch) {
  return Number(
    (
      Number(batch.importCost || 0) +
      Number(batch.taxCost || 0) +
      Number(batch.transportCost || 0) +
      Number(batch.wageCost || 0) +
      Number(batch.otherCost || 0)
    ).toFixed(2),
  );
}

function normalizeStoredPayment(rawPayment, fallbackDate) {
  if (!rawPayment || typeof rawPayment !== "object") {
    return null;
  }

  const method = rawPayment.method === "cash" || rawPayment.method === "bank" ? rawPayment.method : null;
  const date = String(rawPayment.date || fallbackDate || "").trim();
  const amount = toMoneyNumber(rawPayment.amount ?? 0);
  const note = String(rawPayment.note || "").trim();

  if (!method || !isIsoDate(date) || amount === null || amount <= 0) {
    return null;
  }

  return {
    id: String(rawPayment.id || crypto.randomUUID()),
    date,
    method,
    amount,
    note,
  };
}

function normalizeStoredEntry(rawEntry) {
  const entry = rawEntry && typeof rawEntry === "object" ? rawEntry : {};
  const fallbackDate = String(entry.date || "").trim();

  return {
    id: String(entry.id || crypto.randomUUID()),
    productId: String(entry.productId || "").trim(),
    date: fallbackDate,
    customer: String(entry.customer || "").trim(),
    quantity: Number.parseInt(String(entry.quantity ?? 0), 10) || 0,
    unitPrice: toMoneyNumber(entry.unitPrice ?? 0) ?? 0,
    totalAmount: toMoneyNumber(entry.totalAmount ?? 0) ?? 0,
    crateLabel: String(entry.crateLabel || "").trim(),
    note: String(entry.note || "").trim(),
    recordedByName: normalizeUserDisplayName(entry.recordedByName || entry.createdByName || entry.managerName || "ADMIN") || "ADMIN",
    recordedByRole: String(entry.recordedByRole || entry.createdByRole || "admin").trim() || "admin",
    payments: Array.isArray(entry.payments)
      ? entry.payments
          .map((payment) => normalizeStoredPayment(payment, fallbackDate))
          .filter(Boolean)
      : [],
    createdAt: String(entry.createdAt || new Date().toISOString()),
    updatedAt: String(entry.updatedAt || entry.createdAt || new Date().toISOString()),
  };
}

function normalizeStoredImportBatch(rawBatch, products) {
  if (!rawBatch || typeof rawBatch !== "object") {
    return null;
  }

  const productId = String(rawBatch.productId || "").trim();
  if (!findProduct(products, productId)) {
    return null;
  }

  const date = String(rawBatch.date || "").trim();
  const crates = toPositiveInteger(rawBatch.crates);
  const piecesPerCrate = toPositiveInteger(rawBatch.piecesPerCrate);

  if (!isIsoDate(date) || !crates || !piecesPerCrate) {
    return null;
  }

  const totalPieces = crates * piecesPerCrate;
  const costs = buildCostFields(rawBatch);

  return {
    id: String(rawBatch.id || crypto.randomUUID()),
    productId,
    date,
    supplier: String(rawBatch.supplier || "").trim(),
    crates,
    piecesPerCrate,
    totalPieces,
    ...costs,
    note: String(rawBatch.note || "").trim(),
    createdAt: String(rawBatch.createdAt || new Date().toISOString()),
    updatedAt: String(rawBatch.updatedAt || rawBatch.createdAt || new Date().toISOString()),
  };
}

function normalizeStoredDamageRecord(rawRecord, products) {
  if (!rawRecord || typeof rawRecord !== "object") {
    return null;
  }

  const productId = String(rawRecord.productId || "").trim();
  if (!findProduct(products, productId)) {
    return null;
  }

  const date = String(rawRecord.date || "").trim();
  const quantity = toPositiveInteger(rawRecord.quantity);
  const reason = String(rawRecord.reason || "").trim();

  if (!isIsoDate(date) || !quantity || !["broken", "damaged", "shortage", "other"].includes(reason)) {
    return null;
  }

  return {
    id: String(rawRecord.id || crypto.randomUUID()),
    productId,
    date,
    quantity,
    reason,
    note: String(rawRecord.note || "").trim(),
    createdAt: String(rawRecord.createdAt || new Date().toISOString()),
    updatedAt: String(rawRecord.updatedAt || rawRecord.createdAt || new Date().toISOString()),
  };
}

function normalizeStoredMaterialPurchase(rawPurchase) {
  if (!rawPurchase || typeof rawPurchase !== "object") {
    return null;
  }

  const amount = toMoneyNumber(rawPurchase.amount ?? 0);
  const date = String(rawPurchase.date || "").trim();
  const itemName = String(rawPurchase.itemName || "").trim();
  const quantityText = String(rawPurchase.quantityText || "").trim();
  const supplier = String(rawPurchase.supplier || "").trim();
  const note = String(rawPurchase.note || "").trim();

  if (!itemName || !isIsoDate(date) || amount === null || amount <= 0) {
    return null;
  }

  return {
    id: String(rawPurchase.id || crypto.randomUUID()),
    date,
    itemName,
    quantityText,
    amount,
    supplier,
    note,
    createdAt: String(rawPurchase.createdAt || new Date().toISOString()),
    updatedAt: String(rawPurchase.updatedAt || rawPurchase.createdAt || new Date().toISOString()),
  };
}

function normalizeStoredSalaryRecord(rawRecord) {
  if (!rawRecord || typeof rawRecord !== "object") {
    return null;
  }

  const amount = toMoneyNumber(rawRecord.amount ?? 0);
  const date = String(rawRecord.date || "").trim();
  const employeeName = String(rawRecord.employeeName || "").trim();
  const role = String(rawRecord.role || "").trim();
  const period = String(rawRecord.period || "").trim();
  const note = String(rawRecord.note || "").trim();

  if (!employeeName || !isIsoDate(date) || amount === null || amount <= 0) {
    return null;
  }

  return {
    id: String(rawRecord.id || crypto.randomUUID()),
    date,
    employeeName,
    role,
    period,
    amount,
    note,
    createdAt: String(rawRecord.createdAt || new Date().toISOString()),
    updatedAt: String(rawRecord.updatedAt || rawRecord.createdAt || new Date().toISOString()),
  };
}

function normalizeInvoiceSettings(rawSettings) {
  const defaults = buildDefaultInvoiceSettings();
  const settings = rawSettings && typeof rawSettings === "object" ? rawSettings : {};

  return {
    companyName: String(settings.companyName || defaults.companyName).trim() || defaults.companyName,
    phone: String(settings.phone || "").trim(),
    bankName: String(settings.bankName || "").trim(),
    bankAccount: String(settings.bankAccount || "").trim(),
    logoText: String(settings.logoText || defaults.logoText).trim().slice(0, 6) || defaults.logoText,
    qrText: String(settings.qrText || "").trim(),
    footerNote: String(settings.footerNote || defaults.footerNote).trim() || defaults.footerNote,
  };
}

function getSortedProductDefaults() {
  return buildDefaultStore().products;
}

function normalizeProducts(rawProducts) {
  const rawList = Array.isArray(rawProducts) ? rawProducts : [];
  const sourceProducts = rawList.length ? rawList : getSortedProductDefaults();
  const normalized = [];
  const seen = new Set();

  for (const rawProduct of sourceProducts) {
    const candidateId = String(rawProduct?.id || "").trim();
    if (!candidateId || seen.has(candidateId)) {
      continue;
    }

    normalized.push(
      normalizeProduct(rawProduct, {
        id: candidateId,
        name: String(rawProduct?.name || candidateId).trim(),
        defaultPiecesPerCrate: 82,
      }),
    );
    seen.add(candidateId);
  }

  return normalized.length ? normalized : getSortedProductDefaults().map((product) => normalizeProduct(product, product));
}

function getEarliestEntryDate(entries, productId) {
  const matchedDates = entries
    .filter((entry) => entry.productId === productId && isIsoDate(entry.date))
    .map((entry) => entry.date)
    .sort();

  return matchedDates[0] || todayIsoDate();
}

function buildLegacyImportBatches(store, products, entries) {
  const legacyProducts = Array.isArray(store?.products) ? store.products : [];
  const legacyCosts = store?.productCosts && typeof store.productCosts === "object" ? store.productCosts : {};

  return products
    .map((product) => {
      const legacyProduct = legacyProducts.find((item) => item && item.id === product.id);
      const crates = toPositiveInteger(legacyProduct?.crates);
      const piecesPerCrate = toPositiveInteger(legacyProduct?.piecesPerCrate ?? product.defaultPiecesPerCrate);

      if (!crates || !piecesPerCrate) {
        return null;
      }

      const costs = buildCostFields(legacyCosts[product.id]);
      return {
        id: crypto.randomUUID(),
        productId: product.id,
        date: getEarliestEntryDate(entries, product.id),
        supplier: "",
        crates,
        piecesPerCrate,
        totalPieces: crates * piecesPerCrate,
        ...costs,
        note: "Анхны үлдэгдлийг хуучин тохиргооноос автоматаар шилжүүлэв.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    })
    .filter(Boolean);
}

function normalizeStore(store) {
  const products = normalizeProducts(store?.products);
  const entries = Array.isArray(store?.entries) ? store.entries.map(normalizeStoredEntry) : [];

  let importBatches = Array.isArray(store?.importBatches)
    ? store.importBatches.map((batch) => normalizeStoredImportBatch(batch, products)).filter(Boolean)
    : [];

  if (store?.schemaVersion !== SCHEMA_VERSION && !importBatches.length) {
    importBatches = buildLegacyImportBatches(store, products, entries);
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    products,
    entries,
    importBatches,
    damageRecords: Array.isArray(store?.damageRecords)
      ? store.damageRecords.map((record) => normalizeStoredDamageRecord(record, products)).filter(Boolean)
      : [],
    materialPurchases: Array.isArray(store?.materialPurchases)
      ? store.materialPurchases.map(normalizeStoredMaterialPurchase).filter(Boolean)
      : [],
    salaryRecords: Array.isArray(store?.salaryRecords)
      ? store.salaryRecords.map(normalizeStoredSalaryRecord).filter(Boolean)
      : [],
    invoiceSettings: normalizeInvoiceSettings(store?.invoiceSettings),
  };
}

async function ensureJsonFile(filePath, fallbackValue) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  await fs.writeFile(filePath, `${JSON.stringify(fallbackValue, null, 2)}\n`, "utf8");
  return fallbackValue;
}

async function getStore() {
  if (!storeCache) {
    storeCache = normalizeStore(await ensureJsonFile(STORE_FILE, buildDefaultStore()));
  }
  return storeCache;
}

async function getCredentials() {
  if (!credentialsCache) {
    credentialsCache = normalizeCredentials(await ensureJsonFile(CREDENTIALS_FILE, buildDefaultCredentials()));
    enforceCredentialSecurity(credentialsCache);
  }
  return credentialsCache;
}

async function persistCredentials() {
  const credentials = await getCredentials();

  writeQueue = writeQueue
    .catch(() => {})
    .then(async () => {
      await fs.writeFile(CREDENTIALS_FILE, `${JSON.stringify(credentials, null, 2)}\n`, "utf8");
    });

  return writeQueue;
}

async function persistStore() {
  const store = await getStore();

  writeQueue = writeQueue
    .catch(() => {})
    .then(async () => {
      await fs.writeFile(STORE_FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
    });

  return writeQueue;
}

function buildSecurityHeaders() {
  return {
    "Referrer-Policy": "same-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };
}

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    ...buildSecurityHeaders(),
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function sendError(response, statusCode, message, extraHeaders = {}) {
  sendJson(response, statusCode, { error: message }, extraHeaders);
}

function parseCookies(request) {
  const header = request.headers.cookie;
  if (!header) {
    return {};
  }

  return header
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce((result, chunk) => {
      const separatorIndex = chunk.indexOf("=");
      if (separatorIndex === -1) {
        return result;
      }

      const key = chunk.slice(0, separatorIndex);
      const value = chunk.slice(separatorIndex + 1);
      result[key] = decodeURIComponent(value);
      return result;
    }, {});
}

function getClientAddress(request) {
  const forwardedFor = String(request.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  const remoteAddress = String(request.socket?.remoteAddress || "").trim();
  return (forwardedFor || remoteAddress || "unknown").replace(/^::ffff:/, "");
}

function clearExpiredLoginAttempts(now = Date.now()) {
  for (const [address, state] of loginAttempts.entries()) {
    const shouldDrop = state.blockedUntil <= now && now - state.lastAttemptAt > LOGIN_WINDOW_MS;
    if (shouldDrop) {
      loginAttempts.delete(address);
    }
  }
}

function getLoginBlockRemainingMs(request) {
  clearExpiredLoginAttempts();
  const state = loginAttempts.get(getClientAddress(request));
  if (!state || state.blockedUntil <= Date.now()) {
    return 0;
  }

  return Math.max(0, state.blockedUntil - Date.now());
}

function registerFailedLogin(request) {
  const now = Date.now();
  const address = getClientAddress(request);
  const existingState = loginAttempts.get(address);
  const state =
    existingState && now - existingState.firstAttemptAt <= LOGIN_WINDOW_MS
      ? existingState
      : { count: 0, firstAttemptAt: now, lastAttemptAt: now, blockedUntil: 0 };

  if (state.blockedUntil > now) {
    state.lastAttemptAt = now;
    loginAttempts.set(address, state);
    return;
  }

  state.count += 1;
  state.lastAttemptAt = now;

  if (state.count >= LOGIN_MAX_ATTEMPTS) {
    state.count = 0;
    state.firstAttemptAt = now;
    state.blockedUntil = now + LOGIN_BLOCK_MS;
  }

  loginAttempts.set(address, state);
}

function clearLoginThrottle(request) {
  loginAttempts.delete(getClientAddress(request));
}

function createSession(role, displayName, accountId) {
  const token = crypto.randomUUID();
  sessions.set(token, {
    token,
    role,
    displayName: normalizeUserDisplayName(displayName),
    accountId: accountId ? String(accountId) : "",
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  return token;
}

function clearExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(token);
    }
  }
}

function getSession(request) {
  clearExpiredSessions();
  const cookies = parseCookies(request);
  const token = cookies.glass_ledger_session;
  if (!token) {
    return null;
  }

  const session = sessions.get(token);
  if (!session) {
    return null;
  }

  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }

  return session;
}

function clearSession(token) {
  if (token) {
    sessions.delete(token);
  }
}

function isSecureRequest(request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim()
    .toLowerCase();

  return forwardedProto === "https";
}

function setSessionCookie(request, response, role, displayName, accountId) {
  const token = createSession(role, displayName, accountId);
  response.setHeader(
    "Set-Cookie",
    `glass_ledger_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(
      SESSION_TTL_MS / 1000,
    )}${isSecureRequest(request) ? "; Secure" : ""}`,
  );
}

function clearSessionCookie(request, response) {
  response.setHeader(
    "Set-Cookie",
    `glass_ledger_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${isSecureRequest(request) ? "; Secure" : ""}`,
  );
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;

    request.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > ONE_MB) {
        reject(createHttpError(413, "Payload is too large."));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(createHttpError(400, "Invalid JSON payload."));
      }
    });

    request.on("error", reject);
  });
}

function sortEntries(entries) {
  return [...entries].sort((left, right) => {
    const leftKey = `${left.date}|${left.createdAt}|${left.id}`;
    const rightKey = `${right.date}|${right.createdAt}|${right.id}`;
    return leftKey.localeCompare(rightKey);
  });
}

function sortImportBatches(batches) {
  return [...batches].sort((left, right) => {
    const leftKey = `${left.date}|${left.updatedAt}|${left.id}`;
    const rightKey = `${right.date}|${right.updatedAt}|${right.id}`;
    return rightKey.localeCompare(leftKey);
  });
}

function sortDamageRecords(records) {
  return [...records].sort((left, right) => {
    const leftKey = `${left.date}|${left.updatedAt}|${left.id}`;
    const rightKey = `${right.date}|${right.updatedAt}|${right.id}`;
    return rightKey.localeCompare(leftKey);
  });
}

function sortMaterialPurchases(purchases) {
  return [...purchases].sort((left, right) => {
    const leftKey = `${left.date}|${left.updatedAt}|${left.id}`;
    const rightKey = `${right.date}|${right.updatedAt}|${right.id}`;
    return rightKey.localeCompare(leftKey);
  });
}

function sortSalaryRecords(records) {
  return [...records].sort((left, right) => {
    const leftKey = `${left.date}|${left.updatedAt}|${left.id}`;
    const rightKey = `${right.date}|${right.updatedAt}|${right.id}`;
    return rightKey.localeCompare(leftKey);
  });
}

function sortManagerAccounts(managerAccounts) {
  return [...managerAccounts].sort((left, right) => {
    const leftKey = `${left.name}|${left.updatedAt}|${left.id}`;
    const rightKey = `${right.name}|${right.updatedAt}|${right.id}`;
    return leftKey.localeCompare(rightKey);
  });
}

function findProduct(products, productId) {
  return products.find((product) => product.id === productId);
}

function getEntryPaidAmount(entry) {
  return (Array.isArray(entry.payments) ? entry.payments : []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function getSoldQuantity(entries, productId, excludedEntryId) {
  return entries
    .filter((entry) => entry.productId === productId && entry.id !== excludedEntryId)
    .reduce((sum, entry) => sum + entry.quantity, 0);
}

function getImportedStats(store, productId, excludedBatchId) {
  return store.importBatches
    .filter((batch) => batch.productId === productId && batch.id !== excludedBatchId)
    .reduce(
      (summary, batch) => {
        summary.crates += batch.crates;
        summary.pieces += batch.totalPieces;
        return summary;
      },
      { crates: 0, pieces: 0 },
    );
}

function getDamagedQuantity(records, productId, excludedDamageId) {
  return records
    .filter((record) => record.productId === productId && record.id !== excludedDamageId)
    .reduce((sum, record) => sum + record.quantity, 0);
}

function getInventoryStatsForProduct(store, productId) {
  const batches = store.importBatches.filter((batch) => batch.productId === productId);
  const entries = store.entries.filter((entry) => entry.productId === productId);
  const damages = store.damageRecords.filter((record) => record.productId === productId);
  const importedCrates = batches.reduce((sum, batch) => sum + batch.crates, 0);
  const importedPieces = batches.reduce((sum, batch) => sum + batch.totalPieces, 0);
  const soldPieces = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const damagedPieces = damages.reduce((sum, record) => sum + record.quantity, 0);
  const remainingPieces = Math.max(0, importedPieces - soldPieces - damagedPieces);
  const billed = Number(entries.reduce((sum, entry) => sum + Number(entry.totalAmount || 0), 0).toFixed(2));
  const collected = Number(entries.reduce((sum, entry) => sum + getEntryPaidAmount(entry), 0).toFixed(2));
  const receivable = Number((billed - collected).toFixed(2));
  const latestBatch = sortImportBatches(batches)[0] || null;
  const salesProgress = importedPieces ? (soldPieces / importedPieces) * 100 : 0;
  const stockUseProgress = importedPieces ? ((soldPieces + damagedPieces) / importedPieces) * 100 : 0;

  return {
    batchCount: batches.length,
    importedCrates,
    importedPieces,
    soldPieces,
    damagedPieces,
    remainingPieces,
    billed,
    collected,
    receivable,
    salesProgress: Number(salesProgress.toFixed(2)),
    stockUseProgress: Number(stockUseProgress.toFixed(2)),
    latestImportDate: latestBatch?.date || "",
    latestPiecesPerCrate: latestBatch?.piecesPerCrate || 0,
  };
}

function getProfitSummaryForProduct(store, productId) {
  const stats = getInventoryStatsForProduct(store, productId);
  const batches = store.importBatches.filter((batch) => batch.productId === productId);
  const totalImportCost = Number(batches.reduce((sum, batch) => sum + getBatchTotalCost(batch), 0).toFixed(2));
  const pieceCost = stats.importedPieces ? totalImportCost / stats.importedPieces : 0;
  const soldCost = pieceCost * stats.soldPieces;
  const damageCost = pieceCost * stats.damagedPieces;
  const remainingCost = pieceCost * stats.remainingPieces;
  const grossProfit = stats.billed - soldCost - damageCost;
  const netProfit = grossProfit;
  const marginPercent = stats.billed > 0 ? (netProfit / stats.billed) * 100 : 0;

  return {
    totalImportedPieces: stats.importedPieces,
    totalImportCost: Number(totalImportCost.toFixed(2)),
    pieceCost: Number(pieceCost.toFixed(2)),
    soldCost: Number(soldCost.toFixed(2)),
    damageCost: Number(damageCost.toFixed(2)),
    remainingCost: Number(remainingCost.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    salaryExpense: 0,
    netProfit: Number(netProfit.toFixed(2)),
    marginPercent: Number(marginPercent.toFixed(2)),
    billed: stats.billed,
  };
}

function getSalaryExpenseTotal(store) {
  return Number(
    (Array.isArray(store.salaryRecords) ? store.salaryRecords : [])
      .reduce((sum, record) => sum + Number(record.amount || 0), 0)
      .toFixed(2),
  );
}

function buildBusinessSummary(store) {
  const inventoryStats = store.products.map((product) => getInventoryStatsForProduct(store, product.id));
  const billed = Number(inventoryStats.reduce((sum, stats) => sum + Number(stats.billed || 0), 0).toFixed(2));
  const collected = Number(inventoryStats.reduce((sum, stats) => sum + Number(stats.collected || 0), 0).toFixed(2));
  const receivable = Number(inventoryStats.reduce((sum, stats) => sum + Number(stats.receivable || 0), 0).toFixed(2));
  const profitSummaries = store.products.map((product) => getProfitSummaryForProduct(store, product.id));
  const grossProfit = Number(profitSummaries.reduce((sum, summary) => sum + Number(summary.grossProfit || 0), 0).toFixed(2));
  const salaryExpense = getSalaryExpenseTotal(store);
  const netProfit = Number((grossProfit - salaryExpense).toFixed(2));

  return {
    billed,
    collected,
    receivable,
    grossProfit,
    salaryExpense,
    netProfit,
  };
}

function buildInventoryStatsMap(store) {
  const result = {};
  for (const product of store.products) {
    result[product.id] = getInventoryStatsForProduct(store, product.id);
  }
  return result;
}

function buildProfitSummariesMap(store) {
  const result = {};
  for (const product of store.products) {
    result[product.id] = getProfitSummaryForProduct(store, product.id);
  }
  return result;
}

function getProductUsageSummary(store, productId, excludedEntryId, excludedBatchId, excludedDamageId) {
  return {
    entries: store.entries.filter((entry) => entry.productId === productId && entry.id !== excludedEntryId),
    importBatches: store.importBatches.filter((batch) => batch.productId === productId && batch.id !== excludedBatchId),
    damageRecords: store.damageRecords.filter((record) => record.productId === productId && record.id !== excludedDamageId),
  };
}

function validatePayments(paymentsPayload, totalAmount, fallbackDate) {
  if (paymentsPayload === undefined || paymentsPayload === null) {
    return [];
  }

  if (!Array.isArray(paymentsPayload)) {
    throw new Error("Төлбөрийн мэдээлэл буруу байна.");
  }

  const payments = paymentsPayload
    .map((rawPayment, index) => {
      const payment = rawPayment && typeof rawPayment === "object" ? rawPayment : {};
      const date = String(payment.date || fallbackDate || "").trim();
      const method = String(payment.method || "").trim();
      const note = String(payment.note || "").trim();
      const amountText = String(payment.amount ?? "").trim();
      const hasValue = date || method || note || amountText;

      if (!hasValue) {
        return null;
      }

      if (!["cash", "bank"].includes(method)) {
        throw new Error(`${index + 1}-р төлбөрийн хэлбэрийг сонгоно уу.`);
      }

      if (!isIsoDate(date)) {
        throw new Error(`${index + 1}-р төлбөрийн огноог зөв оруулна уу.`);
      }

      const amount = toMoneyNumber(amountText);
      if (amount === null || amount <= 0) {
        throw new Error(`${index + 1}-р төлбөрийн дүн 0-ээс их байх ёстой.`);
      }

      return {
        id: String(payment.id || crypto.randomUUID()),
        date,
        method,
        amount,
        note,
      };
    })
    .filter(Boolean);

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  if (totalPaid - totalAmount > 0.009) {
    throw new Error("Төлсөн дүн нийт үнийн дүнгээс их байж болохгүй.");
  }

  return payments;
}

function validateEntry(payload, store, existingEntryId) {
  const productId = String(payload.productId || "").trim();
  const date = String(payload.date || "").trim();
  const customer = String(payload.customer || "").trim();
  const crateLabel = String(payload.crateLabel || "").trim();
  const note = String(payload.note || "").trim();
  const quantity = Number.parseInt(String(payload.quantity ?? ""), 10);
  const unitPrice = toMoneyNumber(payload.unitPrice ?? 0);
  const totalAmount =
    payload.totalAmount === undefined || payload.totalAmount === null || payload.totalAmount === ""
      ? unitPrice === null
        ? null
        : Number((quantity * unitPrice).toFixed(2))
      : toMoneyNumber(payload.totalAmount);

  if (!productId) {
    throw new Error("Шилний төрлөө сонгоно уу.");
  }

  const product = findProduct(store.products, productId);
  if (!product) {
    throw new Error("Сонгосон шилний төрөл олдсонгүй.");
  }

  if (!isIsoDate(date)) {
    throw new Error("Огноогоо зөв оруулна уу.");
  }

  if (!customer) {
    throw new Error("Худалдан авагчийн нэрийг оруулна уу.");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Тоо ширхэг нь 1-ээс их бүхэл тоо байх ёстой.");
  }

  if (unitPrice === null || totalAmount === null) {
    throw new Error("Үнэ, дүнгийн утга буруу байна.");
  }

  const imported = getImportedStats(store, productId).pieces;
  const soldWithoutCurrent = getSoldQuantity(store.entries, productId, existingEntryId);
  const damaged = getDamagedQuantity(store.damageRecords, productId);
  const available = imported - soldWithoutCurrent - damaged;

  if (quantity > available) {
    throw new Error(`Үлдэгдэл хүрэлцэхгүй байна. Одоогийн боломжит үлдэгдэл: ${available} ширхэг.`);
  }

  const payments = validatePayments(payload.payments, totalAmount, date);

  return {
    productId,
    date,
    customer,
    quantity,
    unitPrice,
    totalAmount,
    crateLabel,
    note,
    payments,
  };
}

function validateImportBatch(payload, store, existingBatchId) {
  const productId = String(payload.productId || "").trim();
  const date = String(payload.date || "").trim();
  const supplier = String(payload.supplier || "").trim();
  const crates = toPositiveInteger(payload.crates);
  const piecesPerCrate = toPositiveInteger(payload.piecesPerCrate);
  const note = String(payload.note || "").trim();
  const costs = buildCostFields(payload);

  if (!productId) {
    throw new Error("Импортын төрлийг сонгоно уу.");
  }

  const product = findProduct(store.products, productId);
  if (!product) {
    throw new Error("Сонгосон шилний төрөл олдсонгүй.");
  }

  if (!isIsoDate(date)) {
    throw new Error("Импортын огноог зөв оруулна уу.");
  }

  if (!crates) {
    throw new Error("Импортолсон авдрын тоог оруулна уу.");
  }

  if (!piecesPerCrate) {
    throw new Error("1 авдарт хэдэн ширхэг байгааг оруулна уу.");
  }

  if (Object.values(costs).some((value) => value === null)) {
    throw new Error("Импортын зардлын утгууд буруу байна.");
  }

  const totalPieces = crates * piecesPerCrate;
  const otherImported = getImportedStats(store, productId, existingBatchId).pieces;
  const sold = getSoldQuantity(store.entries, productId);
  const damaged = getDamagedQuantity(store.damageRecords, productId);

  if (otherImported + totalPieces < sold + damaged) {
    throw new Error("Энэ өөрчлөлт хийвэл борлуулсан болон гэмтэлд хасагдсан ширхэгээ нөхөх импорт хүрэлцэхгүй болно.");
  }

  return {
    productId,
    date,
    supplier,
    crates,
    piecesPerCrate,
    totalPieces,
    ...costs,
    note,
  };
}

function validateDamageRecord(payload, store, existingDamageId) {
  const productId = String(payload.productId || "").trim();
  const date = String(payload.date || "").trim();
  const quantity = toPositiveInteger(payload.quantity);
  const reason = String(payload.reason || "").trim();
  const note = String(payload.note || "").trim();

  if (!productId) {
    throw new Error("Гэмтлийн төрлийн бүтээгдэхүүнийг сонгоно уу.");
  }

  const product = findProduct(store.products, productId);
  if (!product) {
    throw new Error("Сонгосон шилний төрөл олдсонгүй.");
  }

  if (!isIsoDate(date)) {
    throw new Error("Гэмтлийн огноог зөв оруулна уу.");
  }

  if (!quantity) {
    throw new Error("Гэмтэлтэй ширхэгийн тоог оруулна уу.");
  }

  if (!["broken", "damaged", "shortage", "other"].includes(reason)) {
    throw new Error("Гэмтлийн төрлийг сонгоно уу.");
  }

  const imported = getImportedStats(store, productId).pieces;
  const sold = getSoldQuantity(store.entries, productId);
  const otherDamaged = getDamagedQuantity(store.damageRecords, productId, existingDamageId);
  const available = imported - sold - otherDamaged;

  if (quantity > available) {
    throw new Error(`Гэмтэлд бүртгэх боломжит үлдэгдэл хүрэлцэхгүй байна. Боломжит үлдэгдэл: ${available} ширхэг.`);
  }

  return {
    productId,
    date,
    quantity,
    reason,
    note,
  };
}

function validateMaterialPurchase(payload) {
  const date = String(payload.date || "").trim();
  const itemName = String(payload.itemName || "").trim();
  const quantityText = String(payload.quantityText || "").trim();
  const supplier = String(payload.supplier || "").trim();
  const note = String(payload.note || "").trim();
  const amount = toMoneyNumber(payload.amount ?? 0);

  if (!isIsoDate(date)) {
    throw new Error("Худалдан авалтын огноог зөв оруулна уу.");
  }

  if (!itemName) {
    throw new Error("Бараа материалын нэрийг оруулна уу.");
  }

  if (amount === null || amount <= 0) {
    throw new Error("Худалдан авалтын дүн 0-ээс их байх ёстой.");
  }

  return {
    date,
    itemName,
    quantityText,
    amount,
    supplier,
    note,
  };
}

function validateSalaryRecord(payload) {
  const date = String(payload.date || "").trim();
  const employeeName = String(payload.employeeName || "").trim();
  const role = String(payload.role || "").trim();
  const period = String(payload.period || "").trim();
  const note = String(payload.note || "").trim();
  const amount = toMoneyNumber(payload.amount ?? 0);

  if (!isIsoDate(date)) {
    throw new Error("Цалингийн огноог зөв оруулна уу.");
  }

  if (!employeeName) {
    throw new Error("Ажилтны нэрийг оруулна уу.");
  }

  if (amount === null || amount <= 0) {
    throw new Error("Цалингийн дүн 0-ээс их байх ёстой.");
  }

  return {
    date,
    employeeName,
    role,
    period,
    amount,
    note,
  };
}

function validateInvoiceSettings(payload) {
  const settings = normalizeInvoiceSettings(payload);
  if (!settings.companyName) {
    throw new Error("Компанийн нэрийг оруулна уу.");
  }

  return settings;
}

function validateProduct(payload, store, existingProductId) {
  const name = normalizeProductName(payload.name);
  const defaultPiecesPerCrate = toPositiveInteger(payload.defaultPiecesPerCrate ?? payload.piecesPerCrate);

  if (!name) {
    throw new Error("Шилний төрлийн нэрийг оруулна уу.");
  }

  if (!defaultPiecesPerCrate) {
    throw new Error("1 авдарт байх ширхэгийг 1-ээс их бүхэл тоогоор оруулна уу.");
  }

  const duplicateName = store.products.find((product) => product.id !== existingProductId && product.name === name);
  if (duplicateName) {
    throw new Error("Ийм нэртэй шилний төрөл аль хэдийн бүртгэлтэй байна.");
  }

  return {
    name,
    defaultPiecesPerCrate,
  };
}

function findManagerAccountByCode(credentials, accessCode) {
  return credentials.managerAccounts.find((account) => account.accessCode === accessCode) || null;
}

function findManagerAccountById(credentials, accountId) {
  return credentials.managerAccounts.find((account) => account.id === accountId) || null;
}

function validateManagerAccount(payload, credentials, existingManagerId) {
  const name = normalizeUserDisplayName(payload.name || payload.displayName || "");
  const accessCode = String(payload.accessCode || payload.code || "").trim();

  if (!name) {
    throw new Error("Борлуулагчийн нэрийг оруулна уу.");
  }

  if (isInsecureAccessCode(accessCode)) {
    throw new Error("Борлуулагчийн нэвтрэх код хамгийн багадаа 8 тэмдэгттэй, default биш, таахад хэцүү байх ёстой.");
  }

  if (accessCode === credentials.adminCode) {
    throw new Error("ADMIN кодтой ижил борлуулагчийн код ашиглаж болохгүй.");
  }

  const duplicateCode = credentials.managerAccounts.find(
    (account) => account.id !== existingManagerId && account.accessCode === accessCode,
  );
  if (duplicateCode) {
    throw new Error("Ийм нэвтрэх кодтой борлуулагч аль хэдийн байна.");
  }

  const duplicateName = credentials.managerAccounts.find((account) => account.id !== existingManagerId && account.name === name);
  if (duplicateName) {
    throw new Error("Ийм нэртэй борлуулагч аль хэдийн байна.");
  }

  return {
    name,
    accessCode,
  };
}

async function serveStaticAsset(requestPath, response) {
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const resolvedPath = path.join(PUBLIC_DIR, path.normalize(safePath));

  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    sendError(response, 403, "Forbidden");
    return;
  }

  try {
    const fileContents = await fs.readFile(resolvedPath);
    const extension = path.extname(resolvedPath);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
      ...buildSecurityHeaders(),
    });
    response.end(fileContents);
  } catch (error) {
    if (error.code === "ENOENT") {
      if (path.extname(requestPath)) {
        sendError(response, 404, "File not found.");
        return;
      }

      const fallback = await fs.readFile(path.join(PUBLIC_DIR, "index.html"));
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
        ...buildSecurityHeaders(),
      });
      response.end(fallback);
      return;
    }

    throw error;
  }
}

function buildBootstrapPayload(sessionOrRole, store, credentials) {
  const role = typeof sessionOrRole === "string" ? sessionOrRole : sessionOrRole?.role || "guest";
  const displayName =
    typeof sessionOrRole === "string"
      ? role === "admin"
        ? "ADMIN"
        : ""
      : normalizeUserDisplayName(sessionOrRole?.displayName || "");
  const canViewLedger = role === "admin" || role === "manager";
  const isAdmin = role === "admin";

  return {
    role,
    currentUser: {
      role,
      displayName,
    },
    products: store.products,
    entries: canViewLedger ? sortEntries(store.entries) : [],
    managerAccounts: isAdmin ? sortManagerAccounts(credentials?.managerAccounts || []) : [],
    importBatches: isAdmin ? sortImportBatches(store.importBatches) : [],
    damageRecords: isAdmin ? sortDamageRecords(store.damageRecords) : [],
    materialPurchases: canViewLedger ? sortMaterialPurchases(store.materialPurchases) : [],
    salaryRecords: isAdmin ? sortSalaryRecords(store.salaryRecords) : [],
    invoiceSettings: canViewLedger ? store.invoiceSettings : normalizeInvoiceSettings({}),
    inventoryStats: canViewLedger ? buildInventoryStatsMap(store) : {},
    profitSummaries: isAdmin ? buildProfitSummariesMap(store) : {},
    businessSummary: isAdmin ? buildBusinessSummary(store) : {},
    defaults: {
      adminLabel: "ADMIN",
      managerLabel: "Борлуулагч",
    },
  };
}

async function requireAuthenticatedRole(request, response, acceptedRoles) {
  const session = getSession(request);
  if (!session || !acceptedRoles.includes(session.role)) {
    sendError(response, 401, "Нэвтрэх эрх шаардлагатай байна.");
    return null;
  }

  if (session.role === "manager") {
    const credentials = await getCredentials();
    const managerAccount = findManagerAccountById(credentials, session.accountId);
    if (!managerAccount) {
      clearSession(session.token);
      clearSessionCookie(request, response);
      sendError(response, 401, "Таны борлуулагчийн эрх хүчингүй болсон байна. Дахин нэвтэрнэ үү.");
      return null;
    }

    session.displayName = managerAccount.name;
  }

  return session;
}

async function sendEditorPayload(response, session, store, statusCode = 200) {
  const credentials = await getCredentials();
  sendJson(response, statusCode, buildBootstrapPayload(session, store, credentials));
}

async function handleApiRequest(request, response, url) {
  const pathname = url.pathname;

  if (request.method === "GET" && pathname === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  const store = await getStore();
  const credentials = await getCredentials();

  if (request.method === "GET" && pathname === "/api/bootstrap") {
    const session = getSession(request);
    if (session?.role === "manager") {
      const managerAccount = findManagerAccountById(credentials, session.accountId);
      if (!managerAccount) {
        clearSession(session.token);
        clearSessionCookie(request, response);
        sendJson(response, 200, buildBootstrapPayload("guest", store, credentials));
        return;
      }

      session.displayName = managerAccount.name;
    }

    sendJson(response, 200, buildBootstrapPayload(session || "guest", store, credentials));
    return;
  }

  if (request.method === "POST" && pathname === "/api/login") {
    const blockRemainingMs = getLoginBlockRemainingMs(request);
    if (blockRemainingMs > 0) {
      sendError(
        response,
        429,
        `Олон удаа буруу код оруулсан байна. ${Math.ceil(blockRemainingMs / 60000)} минутын дараа дахин оролдоно уу.`,
        { "Retry-After": String(Math.ceil(blockRemainingMs / 1000)) },
      );
      return;
    }

    const body = await readRequestBody(request);
    const accessCode = String(body.code || "").trim();

    let role = null;
    let sessionDisplayName = "";
    let accountId = "";
    if (accessCode && accessCode === credentials.adminCode) {
      role = "admin";
      sessionDisplayName = "ADMIN";
    } else {
      const managerAccount = accessCode ? findManagerAccountByCode(credentials, accessCode) : null;
      if (managerAccount) {
        role = "manager";
        sessionDisplayName = managerAccount.name;
        accountId = managerAccount.id;
      }
    }

    if (!role) {
      registerFailedLogin(request);
      sendError(response, 401, "Нэвтрэх код буруу байна.");
      return;
    }

    clearLoginThrottle(request);
    setSessionCookie(request, response, role, sessionDisplayName, accountId);
    sendJson(response, 200, { role, currentUser: { role, displayName: sessionDisplayName } });
    return;
  }

  if (request.method === "POST" && pathname === "/api/logout") {
    const session = getSession(request);
    clearSession(session?.token);
    clearSessionCookie(request, response);
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && pathname === "/api/manager-accounts") {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const body = await readRequestBody(request);
    const normalizedManager = asBadRequest(() => validateManagerAccount(body, credentials));
    const timestamp = new Date().toISOString();

    credentials.managerAccounts.push({
      id: crypto.randomUUID(),
      ...normalizedManager,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await persistCredentials();
    await sendEditorPayload(response, session, store, 201);
    return;
  }

  if (request.method === "PUT" && pathname.startsWith("/api/manager-accounts/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const managerId = decodeURIComponent(pathname.replace("/api/manager-accounts/", ""));
    const managerIndex = credentials.managerAccounts.findIndex((account) => account.id === managerId);
    if (managerIndex === -1) {
      sendError(response, 404, "Борлуулагчийн эрх олдсонгүй.");
      return;
    }

    const body = await readRequestBody(request);
    const normalizedManager = asBadRequest(() => validateManagerAccount(body, credentials, managerId));

    credentials.managerAccounts[managerIndex] = {
      ...credentials.managerAccounts[managerIndex],
      ...normalizedManager,
      updatedAt: new Date().toISOString(),
    };

    await persistCredentials();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "DELETE" && pathname.startsWith("/api/manager-accounts/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const managerId = decodeURIComponent(pathname.replace("/api/manager-accounts/", ""));
    const initialLength = credentials.managerAccounts.length;
    credentials.managerAccounts = credentials.managerAccounts.filter((account) => account.id !== managerId);

    if (credentials.managerAccounts.length === initialLength) {
      sendError(response, 404, "Устгах борлуулагч олдсонгүй.");
      return;
    }

    await persistCredentials();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "PUT" && pathname === "/api/invoice-settings") {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const body = await readRequestBody(request);
    store.invoiceSettings = asBadRequest(() => validateInvoiceSettings(body));
    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "POST" && pathname === "/api/products") {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const body = await readRequestBody(request);
    const normalizedProduct = asBadRequest(() => validateProduct(body, store));

    store.products.push({
      id: crypto.randomUUID(),
      ...normalizedProduct,
    });

    await persistStore();
    await sendEditorPayload(response, session, store, 201);
    return;
  }

  if (request.method === "PUT" && pathname.startsWith("/api/products/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const productId = decodeURIComponent(pathname.replace("/api/products/", ""));
    const productIndex = store.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      sendError(response, 404, "Засах шилний төрөл олдсонгүй.");
      return;
    }

    const body = await readRequestBody(request);
    const normalizedProduct = asBadRequest(() => validateProduct(body, store, productId));

    store.products[productIndex] = {
      ...store.products[productIndex],
      ...normalizedProduct,
    };

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "DELETE" && pathname.startsWith("/api/products/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const productId = decodeURIComponent(pathname.replace("/api/products/", ""));
    const product = findProduct(store.products, productId);
    if (!product) {
      sendError(response, 404, "Устгах шилний төрөл олдсонгүй.");
      return;
    }

    if (store.products.length <= 1) {
      sendError(response, 400, "Хамгийн сүүлийн шилний төрлийг шууд устгах боломжгүй. Эхлээд шинэ төрөл нэмнэ үү.");
      return;
    }

    const usage = getProductUsageSummary(store, productId);
    if (usage.entries.length || usage.importBatches.length || usage.damageRecords.length) {
      sendError(
        response,
        400,
        "Энэ шилний төрлөөр борлуулалт, импорт эсвэл гэмтлийн бүртгэл байгаа тул устгах боломжгүй.",
      );
      return;
    }

    store.products = store.products.filter((item) => item.id !== productId);
    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "POST" && pathname === "/api/entries") {
    const session = await requireAuthenticatedRole(request, response, ["admin", "manager"]);
    if (!session) {
      return;
    }

    const body = await readRequestBody(request);
    const normalized = asBadRequest(() => validateEntry(body, store));
    const timestamp = new Date().toISOString();

    store.entries.push({
      id: crypto.randomUUID(),
      ...normalized,
      recordedByName: session.role === "admin" ? "ADMIN" : normalizeUserDisplayName(session.displayName || "") || "Борлуулагч",
      recordedByRole: session.role,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await persistStore();
    await sendEditorPayload(response, session, store, 201);
    return;
  }

  if (request.method === "PUT" && pathname.startsWith("/api/entries/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const entryId = decodeURIComponent(pathname.replace("/api/entries/", ""));
    const entryIndex = store.entries.findIndex((entry) => entry.id === entryId);
    if (entryIndex === -1) {
      sendError(response, 404, "Бичлэг олдсонгүй.");
      return;
    }

    const body = await readRequestBody(request);
    const normalized = asBadRequest(() => validateEntry(body, store, entryId));

    store.entries[entryIndex] = {
      ...store.entries[entryIndex],
      ...normalized,
      updatedAt: new Date().toISOString(),
    };

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "DELETE" && pathname.startsWith("/api/entries/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const entryId = decodeURIComponent(pathname.replace("/api/entries/", ""));
    const initialLength = store.entries.length;
    store.entries = store.entries.filter((entry) => entry.id !== entryId);

    if (store.entries.length === initialLength) {
      sendError(response, 404, "Устгах бичлэг олдсонгүй.");
      return;
    }

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "POST" && pathname === "/api/import-batches") {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const body = await readRequestBody(request);
    const normalized = asBadRequest(() => validateImportBatch(body, store));
    const timestamp = new Date().toISOString();

    store.importBatches.push({
      id: crypto.randomUUID(),
      ...normalized,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await persistStore();
    await sendEditorPayload(response, session, store, 201);
    return;
  }

  if (request.method === "PUT" && pathname.startsWith("/api/import-batches/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const batchId = decodeURIComponent(pathname.replace("/api/import-batches/", ""));
    const batchIndex = store.importBatches.findIndex((batch) => batch.id === batchId);
    if (batchIndex === -1) {
      sendError(response, 404, "Импортын мөр олдсонгүй.");
      return;
    }

    const body = await readRequestBody(request);
    const normalized = asBadRequest(() => validateImportBatch(body, store, batchId));

    store.importBatches[batchIndex] = {
      ...store.importBatches[batchIndex],
      ...normalized,
      updatedAt: new Date().toISOString(),
    };

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "DELETE" && pathname.startsWith("/api/import-batches/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const batchId = decodeURIComponent(pathname.replace("/api/import-batches/", ""));
    const batch = store.importBatches.find((item) => item.id === batchId);
    if (!batch) {
      sendError(response, 404, "Устгах импортын мөр олдсонгүй.");
      return;
    }

    const otherImported = getImportedStats(store, batch.productId, batchId).pieces;
    const sold = getSoldQuantity(store.entries, batch.productId);
    const damaged = getDamagedQuantity(store.damageRecords, batch.productId);
    if (otherImported < sold + damaged) {
      sendError(response, 400, "Энэ импортын мөрийг устгавал борлуулалт болон гэмтлийн үлдэгдэл сөрөг болно.");
      return;
    }

    store.importBatches = store.importBatches.filter((item) => item.id !== batchId);
    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "POST" && pathname === "/api/damage-records") {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const body = await readRequestBody(request);
    const normalized = asBadRequest(() => validateDamageRecord(body, store));
    const timestamp = new Date().toISOString();

    store.damageRecords.push({
      id: crypto.randomUUID(),
      ...normalized,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await persistStore();
    await sendEditorPayload(response, session, store, 201);
    return;
  }

  if (request.method === "PUT" && pathname.startsWith("/api/damage-records/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const damageId = decodeURIComponent(pathname.replace("/api/damage-records/", ""));
    const damageIndex = store.damageRecords.findIndex((record) => record.id === damageId);
    if (damageIndex === -1) {
      sendError(response, 404, "Гэмтлийн мөр олдсонгүй.");
      return;
    }

    const body = await readRequestBody(request);
    const normalized = asBadRequest(() => validateDamageRecord(body, store, damageId));

    store.damageRecords[damageIndex] = {
      ...store.damageRecords[damageIndex],
      ...normalized,
      updatedAt: new Date().toISOString(),
    };

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "DELETE" && pathname.startsWith("/api/damage-records/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const damageId = decodeURIComponent(pathname.replace("/api/damage-records/", ""));
    const initialLength = store.damageRecords.length;
    store.damageRecords = store.damageRecords.filter((record) => record.id !== damageId);

    if (store.damageRecords.length === initialLength) {
      sendError(response, 404, "Устгах гэмтлийн мөр олдсонгүй.");
      return;
    }

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "POST" && pathname === "/api/material-purchases") {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const body = await readRequestBody(request);
    const purchase = asBadRequest(() => validateMaterialPurchase(body));
    const timestamp = new Date().toISOString();

    store.materialPurchases.push({
      id: crypto.randomUUID(),
      ...purchase,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await persistStore();
    await sendEditorPayload(response, session, store, 201);
    return;
  }

  if (request.method === "PUT" && pathname.startsWith("/api/material-purchases/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const purchaseId = decodeURIComponent(pathname.replace("/api/material-purchases/", ""));
    const purchaseIndex = store.materialPurchases.findIndex((purchase) => purchase.id === purchaseId);
    if (purchaseIndex === -1) {
      sendError(response, 404, "Худалдан авалтын бүртгэл олдсонгүй.");
      return;
    }

    const body = await readRequestBody(request);
    const purchase = asBadRequest(() => validateMaterialPurchase(body));

    store.materialPurchases[purchaseIndex] = {
      ...store.materialPurchases[purchaseIndex],
      ...purchase,
      updatedAt: new Date().toISOString(),
    };

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "DELETE" && pathname.startsWith("/api/material-purchases/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const purchaseId = decodeURIComponent(pathname.replace("/api/material-purchases/", ""));
    const initialLength = store.materialPurchases.length;
    store.materialPurchases = store.materialPurchases.filter((purchase) => purchase.id !== purchaseId);

    if (store.materialPurchases.length === initialLength) {
      sendError(response, 404, "Устгах худалдан авалтын мөр олдсонгүй.");
      return;
    }

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "POST" && pathname === "/api/salary-records") {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const body = await readRequestBody(request);
    const salaryRecord = asBadRequest(() => validateSalaryRecord(body));
    const timestamp = new Date().toISOString();

    store.salaryRecords.push({
      id: crypto.randomUUID(),
      ...salaryRecord,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await persistStore();
    await sendEditorPayload(response, session, store, 201);
    return;
  }

  if (request.method === "PUT" && pathname.startsWith("/api/salary-records/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const salaryId = decodeURIComponent(pathname.replace("/api/salary-records/", ""));
    const salaryIndex = store.salaryRecords.findIndex((record) => record.id === salaryId);
    if (salaryIndex === -1) {
      sendError(response, 404, "Цалингийн бүртгэл олдсонгүй.");
      return;
    }

    const body = await readRequestBody(request);
    const salaryRecord = asBadRequest(() => validateSalaryRecord(body));

    store.salaryRecords[salaryIndex] = {
      ...store.salaryRecords[salaryIndex],
      ...salaryRecord,
      updatedAt: new Date().toISOString(),
    };

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  if (request.method === "DELETE" && pathname.startsWith("/api/salary-records/")) {
    const session = await requireAuthenticatedRole(request, response, ["admin"]);
    if (!session) {
      return;
    }

    const salaryId = decodeURIComponent(pathname.replace("/api/salary-records/", ""));
    const initialLength = store.salaryRecords.length;
    store.salaryRecords = store.salaryRecords.filter((record) => record.id !== salaryId);

    if (store.salaryRecords.length === initialLength) {
      sendError(response, 404, "Устгах цалингийн мөр олдсонгүй.");
      return;
    }

    await persistStore();
    await sendEditorPayload(response, session, store);
    return;
  }

  sendError(response, 404, "API endpoint олдсонгүй.");
}

function getLanUrls() {
  const interfaces = os.networkInterfaces();
  const urls = [`http://localhost:${PORT}`];

  for (const addresses of Object.values(interfaces)) {
    for (const address of addresses || []) {
      if (address.family === "IPv4" && !address.internal) {
        urls.push(`http://${address.address}:${PORT}`);
      }
    }
  }

  return [...new Set(urls)];
}

function describeDataLocation() {
  if (!fsSync.existsSync(DATA_DIR)) {
    return DATA_DIR;
  }

  return path.resolve(DATA_DIR);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApiRequest(request, response, url);
      return;
    }

    await serveStaticAsset(url.pathname, response);
  } catch (error) {
    console.error(error);
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    sendError(response, statusCode, statusCode < 500 ? error.message : "Сервер дээр алдаа гарлаа.");
  }
});

async function startServer() {
  try {
    const credentials = await getCredentials();
    server.listen(PORT, HOST, () => {
      console.log("Glass ledger app is running.");
      console.log(`Data directory: ${describeDataLocation()}`);
      console.log(`ADMIN code configured: ${maskSecret(credentials.adminCode)}`);
      console.log(`Manager accounts configured: ${credentials.managerAccounts.length}`);
      console.log(`Schema version: ${SCHEMA_VERSION}`);
      for (const url of getLanUrls()) {
        console.log(`Open: ${url}`);
      }
    });
  } catch (error) {
    console.error("Unable to start Glass ledger app.");
    console.error(error.message || error);
    process.exit(1);
  }
}

startServer();
