const currencyFormatter = new Intl.NumberFormat("mn-MN", {
  maximumFractionDigits: 2,
});

const state = {
  role: "guest",
  currentUserName: "",
  managerAccounts: [],
  products: [],
  entries: [],
  importBatches: [],
  damageRecords: [],
  materialPurchases: [],
  salaryRecords: [],
  inventoryStats: {},
  profitSummaries: {},
  businessSummary: {},
  activeProductId: null,
};

let paymentDraftSeed = 0;

const elements = {
  addEntryButton: document.querySelector("#addEntryButton"),
  addPaymentPartButton: document.querySelector("#addPaymentPartButton"),
  authLayer: document.querySelector("#authLayer"),
  billedValue: document.querySelector("#billedValue"),
  cancelModalButton: document.querySelector("#cancelModalButton"),
  closeModalButton: document.querySelector("#closeModalButton"),
  collectedValue: document.querySelector("#collectedValue"),
  customerInput: document.querySelector("#customerInput"),
  damageDateInput: document.querySelector("#damageDateInput"),
  damageForm: document.querySelector("#damageForm"),
  damageMessage: document.querySelector("#damageMessage"),
  damageNoteInput: document.querySelector("#damageNoteInput"),
  damageQuantityInput: document.querySelector("#damageQuantityInput"),
  damageReasonInput: document.querySelector("#damageReasonInput"),
  damageRecordId: document.querySelector("#damageRecordId"),
  damageSummaryText: document.querySelector("#damageSummaryText"),
  damageTableBody: document.querySelector("#damageTableBody"),
  damagedValue: document.querySelector("#damagedValue"),
  dashboardHint: document.querySelector("#dashboardHint"),
  dashboardLowStockCount: document.querySelector("#dashboardLowStockCount"),
  dashboardLowStockText: document.querySelector("#dashboardLowStockText"),
  dashboardMonthCount: document.querySelector("#dashboardMonthCount"),
  dashboardMonthSales: document.querySelector("#dashboardMonthSales"),
  dashboardNetProfit: document.querySelector("#dashboardNetProfit"),
  dashboardPanel: document.querySelector("#dashboardPanel"),
  dashboardReceivable: document.querySelector("#dashboardReceivable"),
  dashboardReceivableCount: document.querySelector("#dashboardReceivableCount"),
  dashboardTodayCount: document.querySelector("#dashboardTodayCount"),
  dashboardTodaySales: document.querySelector("#dashboardTodaySales"),
  dateInput: document.querySelector("#dateInput"),
  editorZoneEyebrow: document.querySelector("#editorZoneEyebrow"),
  editorZoneTitle: document.querySelector("#editorZoneTitle"),
  editorZoneCopy: document.querySelector("#editorZoneCopy"),
  editorZone: document.querySelector("#editorZone"),
  entryForm: document.querySelector("#entryForm"),
  entryId: document.querySelector("#entryId"),
  entryMessage: document.querySelector("#entryMessage"),
  entryModal: document.querySelector("#entryModal"),
  entryTableBody: document.querySelector("#entryTableBody"),
  formAvailableStock: document.querySelector("#formAvailableStock"),
  formPaidAmount: document.querySelector("#formPaidAmount"),
  formReceivableAmount: document.querySelector("#formReceivableAmount"),
  formTotalAmount: document.querySelector("#formTotalAmount"),
  grossProfitValue: document.querySelector("#grossProfitValue"),
  importedCostValue: document.querySelector("#importedCostValue"),
  importedValue: document.querySelector("#importedValue"),
  importBatchForm: document.querySelector("#importBatchForm"),
  importBatchId: document.querySelector("#importBatchId"),
  importBatchTableBody: document.querySelector("#importBatchTableBody"),
  importCostInput: document.querySelector("#importCostInput"),
  importCratesInput: document.querySelector("#importCratesInput"),
  importDateInput: document.querySelector("#importDateInput"),
  importMessage: document.querySelector("#importMessage"),
  importNoteInput: document.querySelector("#importNoteInput"),
  importPieceCostPreview: document.querySelector("#importPieceCostPreview"),
  importPiecesPerCrateInput: document.querySelector("#importPiecesPerCrateInput"),
  importSummaryText: document.querySelector("#importSummaryText"),
  importSupplierInput: document.querySelector("#importSupplierInput"),
  importTotalCostPreview: document.querySelector("#importTotalCostPreview"),
  importTotalPiecesPreview: document.querySelector("#importTotalPiecesPreview"),
  loginCode: document.querySelector("#loginCode"),
  loginForm: document.querySelector("#loginForm"),
  loginMessage: document.querySelector("#loginMessage"),
  logoutButton: document.querySelector("#logoutButton"),
  managerAccountForm: document.querySelector("#managerAccountForm"),
  managerAccountId: document.querySelector("#managerAccountId"),
  managerCodeInput: document.querySelector("#managerCodeInput"),
  managerMessage: document.querySelector("#managerMessage"),
  managerNameInput: document.querySelector("#managerNameInput"),
  managerSummaryText: document.querySelector("#managerSummaryText"),
  managerTableBody: document.querySelector("#managerTableBody"),
  materialPurchaseForm: document.querySelector("#materialPurchaseForm"),
  materialPurchaseId: document.querySelector("#materialPurchaseId"),
  materialPurchaseTableBody: document.querySelector("#materialPurchaseTableBody"),
  modalTitle: document.querySelector("#modalTitle"),
  netProfitValue: document.querySelector("#netProfitValue"),
  noteInput: document.querySelector("#noteInput"),
  otherCostInput: document.querySelector("#otherCostInput"),
  paymentList: document.querySelector("#paymentList"),
  pieceCostValue: document.querySelector("#pieceCostValue"),
  productForm: document.querySelector("#productForm"),
  productIdInput: document.querySelector("#productIdInput"),
  productMeta: document.querySelector("#productMeta"),
  productMessage: document.querySelector("#productMessage"),
  productNameInput: document.querySelector("#productNameInput"),
  productPiecesPerCrateInput: document.querySelector("#productPiecesPerCrateInput"),
  productSelect: document.querySelector("#productSelect"),
  productSummaryText: document.querySelector("#productSummaryText"),
  productTableBody: document.querySelector("#productTableBody"),
  productTabs: document.querySelector("#productTabs"),
  productTitle: document.querySelector("#productTitle"),
  profitHint: document.querySelector("#profitHint"),
  profitMarginValue: document.querySelector("#profitMarginValue"),
  profitProgressFill: document.querySelector("#profitProgressFill"),
  progressCaption: document.querySelector("#progressCaption"),
  progressFill: document.querySelector("#progressFill"),
  progressValue: document.querySelector("#progressValue"),
  purchaseActionHeader: document.querySelector("#purchaseActionHeader"),
  purchaseAmountInput: document.querySelector("#purchaseAmountInput"),
  purchaseDateInput: document.querySelector("#purchaseDateInput"),
  purchaseItemInput: document.querySelector("#purchaseItemInput"),
  purchaseMessage: document.querySelector("#purchaseMessage"),
  purchaseNoteInput: document.querySelector("#purchaseNoteInput"),
  purchaseQuantityInput: document.querySelector("#purchaseQuantityInput"),
  purchaseReadonlyHint: document.querySelector("#purchaseReadonlyHint"),
  purchaseSummaryText: document.querySelector("#purchaseSummaryText"),
  purchaseSupplierInput: document.querySelector("#purchaseSupplierInput"),
  quantityInput: document.querySelector("#quantityInput"),
  receivableValue: document.querySelector("#receivableValue"),
  receivableSummaryText: document.querySelector("#receivableSummaryText"),
  receivableTableBody: document.querySelector("#receivableTableBody"),
  recorderHint: document.querySelector("#recorderHint"),
  recorderNameInput: document.querySelector("#recorderNameInput"),
  remainingCostValue: document.querySelector("#remainingCostValue"),
  remainingValue: document.querySelector("#remainingValue"),
  resetDamageButton: document.querySelector("#resetDamageButton"),
  resetImportBatchButton: document.querySelector("#resetImportBatchButton"),
  resetManagerButton: document.querySelector("#resetManagerButton"),
  resetProductButton: document.querySelector("#resetProductButton"),
  resetPurchaseButton: document.querySelector("#resetPurchaseButton"),
  resetSalaryButton: document.querySelector("#resetSalaryButton"),
  roleChip: document.querySelector("#roleChip"),
  salaryAmountInput: document.querySelector("#salaryAmountInput"),
  salaryDateInput: document.querySelector("#salaryDateInput"),
  salaryEmployeeInput: document.querySelector("#salaryEmployeeInput"),
  salaryForm: document.querySelector("#salaryForm"),
  salaryMessage: document.querySelector("#salaryMessage"),
  salaryNoteInput: document.querySelector("#salaryNoteInput"),
  salaryPeriodInput: document.querySelector("#salaryPeriodInput"),
  salaryRecordId: document.querySelector("#salaryRecordId"),
  salaryRoleInput: document.querySelector("#salaryRoleInput"),
  salarySummaryText: document.querySelector("#salarySummaryText"),
  salaryTableBody: document.querySelector("#salaryTableBody"),
  saveEntryButton: document.querySelector("#saveEntryButton"),
  salaryExpenseValue: document.querySelector("#salaryExpenseValue"),
  soldCostValue: document.querySelector("#soldCostValue"),
  soldValue: document.querySelector("#soldValue"),
  stockAlertList: document.querySelector("#stockAlertList"),
  stockAlertSummaryText: document.querySelector("#stockAlertSummaryText"),
  taxCostInput: document.querySelector("#taxCostInput"),
  toolbarCopy: document.querySelector("#toolbarCopy"),
  transportCostInput: document.querySelector("#transportCostInput"),
  unitPriceInput: document.querySelector("#unitPriceInput"),
  crateInput: document.querySelector("#crateInput"),
  wageCostInput: document.querySelector("#wageCostInput"),
  damageCostValue: document.querySelector("#damageCostValue"),
  adminOnlyPanels: Array.from(document.querySelectorAll("[data-admin-only]")),
};

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  refreshBootstrap();
});

function bindEvents() {
  elements.loginForm.addEventListener("submit", handleLoginSubmit);
  elements.logoutButton.addEventListener("click", handleLogout);
  elements.addEntryButton.addEventListener("click", openNewEntryModal);
  elements.addPaymentPartButton.addEventListener("click", handleAddPaymentPart);
  elements.cancelModalButton.addEventListener("click", closeEntryModal);
  elements.closeModalButton.addEventListener("click", closeEntryModal);
  elements.resetImportBatchButton.addEventListener("click", () => resetImportForm(true));
  elements.resetDamageButton.addEventListener("click", () => resetDamageForm(true));
  elements.resetManagerButton.addEventListener("click", () => resetManagerAccountForm(true));
  elements.resetProductButton.addEventListener("click", () => resetProductForm(true));
  elements.resetPurchaseButton.addEventListener("click", () => resetMaterialPurchaseForm(true));
  elements.resetSalaryButton.addEventListener("click", () => resetSalaryForm(true));

  elements.entryModal.addEventListener("click", (event) => {
    if (event.target === elements.entryModal) {
      closeEntryModal();
    }
  });

  elements.productTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-id]");
    if (!button) {
      return;
    }

    state.activeProductId = button.dataset.productId;
    resetImportForm(false);
    resetDamageForm(false);
    render();
  });

  elements.entryForm.addEventListener("submit", handleEntrySubmit);
  elements.entryTableBody.addEventListener("click", handleEntryTableAction);
  elements.paymentList.addEventListener("click", handlePaymentListClick);
  elements.paymentList.addEventListener("input", updateFormSummary);
  elements.paymentList.addEventListener("change", updateFormSummary);

  elements.importBatchForm.addEventListener("submit", handleImportBatchSubmit);
  elements.importBatchTableBody.addEventListener("click", handleImportBatchTableAction);
  elements.damageForm.addEventListener("submit", handleDamageSubmit);
  elements.damageTableBody.addEventListener("click", handleDamageTableAction);
  elements.managerAccountForm.addEventListener("submit", handleManagerAccountSubmit);
  elements.managerTableBody.addEventListener("click", handleManagerTableAction);
  elements.productForm.addEventListener("submit", handleProductSubmit);
  elements.productTableBody.addEventListener("click", handleProductTableAction);
  elements.materialPurchaseForm.addEventListener("submit", handleMaterialPurchaseSubmit);
  elements.materialPurchaseTableBody.addEventListener("click", handleMaterialPurchaseTableAction);
  elements.salaryForm.addEventListener("submit", handleSalarySubmit);
  elements.salaryTableBody.addEventListener("click", handleSalaryTableAction);

  for (const input of [elements.productSelect, elements.quantityInput, elements.unitPriceInput, elements.dateInput]) {
    input.addEventListener("input", updateFormSummary);
    input.addEventListener("change", updateFormSummary);
  }

  for (const input of [
    elements.importDateInput,
    elements.importSupplierInput,
    elements.importCratesInput,
    elements.importPiecesPerCrateInput,
    elements.importCostInput,
    elements.taxCostInput,
    elements.transportCostInput,
    elements.wageCostInput,
    elements.otherCostInput,
    elements.importNoteInput,
  ]) {
    input.addEventListener("input", updateImportPreview);
    input.addEventListener("change", updateImportPreview);
  }
}

async function apiFetch(url, options = {}) {
  const init = {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, init);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(payload.error || "Алдаа гарлаа.");
    error.status = response.status;
    throw error;
  }

  return payload;
}

async function refreshBootstrap() {
  try {
    const payload = await apiFetch("/api/bootstrap");
    applyBootstrapPayload(payload);
  } catch (error) {
    showToolbarMessage(error.message, true);
  }
}

function applyBootstrapPayload(payload) {
  state.role = payload.role || "guest";
  state.currentUserName = payload.currentUser?.displayName || "";
  state.managerAccounts = payload.managerAccounts || [];
  state.products = payload.products || [];
  state.entries = payload.entries || [];
  state.importBatches = payload.importBatches || [];
  state.damageRecords = payload.damageRecords || [];
  state.materialPurchases = payload.materialPurchases || [];
  state.salaryRecords = payload.salaryRecords || [];
  state.inventoryStats = payload.inventoryStats || {};
  state.profitSummaries = payload.profitSummaries || {};
  state.businessSummary = payload.businessSummary || {};

  if (!state.products.length) {
    state.activeProductId = null;
  } else if (!state.activeProductId || !state.products.some((item) => item.id === state.activeProductId)) {
    state.activeProductId = state.products[0].id;
  }

  render();
}

function isAdmin() {
  return state.role === "admin";
}

function isManager() {
  return state.role === "manager";
}

function canCreateSalesEntry() {
  return isAdmin() || isManager();
}

function getActiveInventoryStats() {
  return state.activeProductId ? getInventoryStats(state.activeProductId) : null;
}

function canOpenNewSalesEntry() {
  const stats = getActiveInventoryStats();
  return canCreateSalesEntry() && Boolean(stats) && stats.remainingPieces > 0;
}

function canViewMaterialPurchases() {
  return isAdmin() || isManager();
}

function render() {
  renderRole();
  renderTabs();
  renderInventoryMeta();
  renderDashboard();
  renderSummary();
  renderProgress();
  renderEntryTable();
  populateProductSelect();
  renderEditorPanels();
}

function renderRole() {
  const labels = {
    guest: "Зочин",
    manager: state.currentUserName ? `Борлуулагч · ${state.currentUserName}` : "Борлуулагч",
    admin: "ADMIN",
  };

  elements.roleChip.textContent = labels[state.role] || "Зочин";
  elements.logoutButton.hidden = state.role === "guest";
  elements.authLayer.classList.toggle("hidden", state.role !== "guest");
  document.body.classList.toggle("locked", state.role === "guest");
  document.body.classList.toggle("seller-view", isManager());
  elements.addEntryButton.hidden = !canCreateSalesEntry();
  elements.addEntryButton.disabled = canCreateSalesEntry() && !canOpenNewSalesEntry();

  const activeStats = getActiveInventoryStats();
  if (canCreateSalesEntry() && activeStats && activeStats.remainingPieces <= 0) {
    elements.addEntryButton.title = activeStats.importedPieces
      ? "Үлдэгдэл дууссан тул энэ төрөл дээр шинэ борлуулалт нэмэх боломжгүй."
      : "Эхлээд энэ шилний төрөл дээр импортын мөр бүртгэнэ үү.";
  } else {
    elements.addEntryButton.title = "";
  }

  if (isAdmin()) {
    if (activeStats && activeStats.remainingPieces <= 0) {
      showToolbarMessage(
        activeStats.importedPieces
          ? "Энэ шилний төрөл дээр үлдэгдэл дууссан байна. Дахин импорт бүртгэсний дараа борлуулалт нэмнэ."
          : "Энэ шилний төрөл дээр импорт бүртгэгдээгүй байна. Эхлээд импортын мөр нэмээд дараа нь борлуулалт оруулна.",
        true,
      );
    } else {
      showToolbarMessage("Та ADMIN эрхтэй нэвтэрсэн байна. Импорт, гэмтэл, борлуулалт, материалын мэдээлэл болон борлуулагчийн эрхүүдийг бүрэн удирдаж болно.");
    }
  } else if (isManager()) {
    if (activeStats && activeStats.remainingPieces <= 0) {
      showToolbarMessage(
        activeStats.importedPieces
          ? "Энэ төрөл дээр үлдэгдэл дууссан байна. ADMIN дахин импорт бүртгэсний дараа борлуулалт нэмнэ."
          : "Энэ төрөл дээр импорт бүртгэгдээгүй байна. ADMIN эхлээд импортын мөр нэмэх шаардлагатай.",
        true,
      );
    } else {
      showToolbarMessage("Та борлуулагчаар нэвтэрсэн байна. Шинэ борлуулалтын мэдээлэл оруулах боломжтой.");
    }
  } else {
    showToolbarMessage("Кодоор нэвтэрч байж үлдэгдэл, борлуулалтын мэдээллийг харна.");
  }
}

function renderTabs() {
  if (!state.products.length) {
    elements.productTabs.innerHTML = "";
    return;
  }

  elements.productTabs.innerHTML = state.products
    .map(
      (product) => `
        <button
          class="tab-button ${product.id === state.activeProductId ? "active" : ""}"
          type="button"
          data-product-id="${product.id}"
        >
          ${escapeHtml(product.name)}
        </button>
      `,
    )
    .join("");
}

function renderInventoryMeta() {
  const product = getActiveProduct();
  if (!product) {
    elements.productTitle.textContent = "Шилний төрөл";
    elements.productMeta.textContent = "Импортын эхний мөрөө оруулмагц нийт нөөц энд харагдана.";
    return;
  }

  const stats = getInventoryStats(product.id);
  elements.productTitle.textContent = product.name;

  if (!stats.importedPieces) {
    elements.productMeta.textContent = `Одоогоор импорт бүртгэгдээгүй. 1 авдарт анхны санал болгох утга: ${formatNumber(
      product.defaultPiecesPerCrate || 82,
    )} ширхэг.`;
    return;
  }

  const metaParts = [
    `${formatNumber(stats.batchCount)} import batch`,
    `${formatNumber(stats.importedCrates)} авдар`,
    `${formatNumber(stats.importedPieces)} ширхэг`,
  ];

  if (stats.latestPiecesPerCrate) {
    metaParts.push(`сүүлд ${formatNumber(stats.latestPiecesPerCrate)} ш/авдар`);
  }

  if (stats.latestImportDate) {
    metaParts.push(`сүүлчийн импорт ${escapeHtml(stats.latestImportDate)}`);
  }

  elements.productMeta.textContent = metaParts.join(" • ");
}

function renderDashboard() {
  const canViewDashboard = isAdmin() || isManager();
  elements.dashboardPanel.classList.toggle("hidden", !canViewDashboard);
  if (!canViewDashboard) {
    return;
  }

  const metrics = buildDashboardMetrics();
  elements.dashboardTodaySales.textContent = `${formatMoney(metrics.todaySales)} ₮`;
  elements.dashboardTodayCount.textContent = `${formatNumber(metrics.todayCount)} мөр`;
  elements.dashboardMonthSales.textContent = `${formatMoney(metrics.monthSales)} ₮`;
  elements.dashboardMonthCount.textContent = `${formatNumber(metrics.monthCount)} мөр`;
  elements.dashboardReceivable.textContent = `${formatMoney(metrics.receivableTotal)} ₮`;
  elements.dashboardReceivableCount.textContent = `${formatNumber(metrics.receivableEntryCount)} мөр`;
  elements.dashboardNetProfit.textContent = `${formatMoney(metrics.netProfit)} ₮`;
  elements.dashboardNetProfit.style.color = metrics.netProfit < 0 ? "var(--danger)" : "var(--accent)";
  elements.dashboardLowStockCount.textContent = formatNumber(metrics.stockAlerts.length);
  elements.dashboardLowStockText.textContent = metrics.stockAlerts.length ? "Нөөц шалгах шаардлагатай" : "Бүх төрөл хэвийн";
  elements.dashboardHint.textContent = isManager()
    ? "Борлуулагчид авлага болон нөөцийн анхааруулга төвлөрч харагдана."
    : "Борлуулалт, авлага, ашиг болон нөөцийн эрсдэл нэг дор харагдана.";

  renderReceivableDashboard(metrics.receivables);
  renderStockAlerts(metrics.stockAlerts);
}

function renderReceivableDashboard(receivables) {
  const total = receivables.reduce((sum, item) => sum + item.amount, 0);
  elements.receivableSummaryText.textContent = receivables.length
    ? `${formatNumber(receivables.length)} харилцагч • ${formatMoney(total)} ₮`
    : "Авлага алга байна.";

  if (!receivables.length) {
    elements.receivableTableBody.innerHTML = '<tr class="empty-state"><td colspan="4">Авлагатай харилцагч алга байна.</td></tr>';
    return;
  }

  elements.receivableTableBody.innerHTML = receivables
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.customer)}</td>
          <td class="money-cell">${formatMoney(item.amount)}</td>
          <td class="quantity-cell">${formatNumber(item.count)}</td>
          <td>${escapeHtml(item.latestDate)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderStockAlerts(alerts) {
  elements.stockAlertSummaryText.textContent = alerts.length
    ? `${formatNumber(alerts.length)} төрлийн нөөц анхаарах түвшинд байна.`
    : "Анхаарах зүйл алга.";

  if (!alerts.length) {
    elements.stockAlertList.innerHTML = '<p class="alert-empty">Нөөцийн доод түвшинд хүрсэн шил алга байна.</p>';
    return;
  }

  elements.stockAlertList.innerHTML = alerts
    .map(
      (alert) => `
        <div class="alert-item ${alert.remainingPieces <= 0 ? "danger" : ""}">
          <strong>${escapeHtml(alert.productName)}</strong>
          <span>${formatNumber(alert.remainingPieces)} ширхэг үлдсэн • босго ${formatNumber(alert.threshold)} ширхэг</span>
        </div>
      `,
    )
    .join("");
}

function renderSummary() {
  const product = getActiveProduct();
  if (!product || state.role === "guest") {
    elements.importedValue.textContent = "0";
    elements.soldValue.textContent = "0";
    elements.damagedValue.textContent = "0";
    elements.remainingValue.textContent = "0";
    elements.billedValue.textContent = "0";
    elements.collectedValue.textContent = "0";
    elements.receivableValue.textContent = "0";
    return;
  }

  const stats = getInventoryStats(product.id);
  elements.importedValue.textContent = formatNumber(stats.importedPieces);
  elements.soldValue.textContent = formatNumber(stats.soldPieces);
  elements.damagedValue.textContent = formatNumber(stats.damagedPieces);
  elements.remainingValue.textContent = formatNumber(stats.remainingPieces);
  elements.billedValue.textContent = formatMoney(stats.billed);
  elements.collectedValue.textContent = formatMoney(stats.collected);
  elements.receivableValue.textContent = formatMoney(stats.receivable);
}

function renderProgress() {
  const product = getActiveProduct();
  if (!product || state.role === "guest") {
    elements.progressValue.textContent = "0%";
    elements.progressFill.style.width = "0%";
    elements.progressCaption.textContent = "Импортын нөөц орж ирмэгц борлуулалтын явц энд харагдана.";
    return;
  }

  const stats = getInventoryStats(product.id);
  elements.progressValue.textContent = `${stats.salesProgress.toFixed(1)}%`;
  elements.progressFill.style.width = `${Math.min(stats.salesProgress, 100)}%`;

  if (!stats.importedPieces) {
    elements.progressCaption.textContent = "Импортын эхний мөрийг оруулмагц борлуулсан болон гэмтлийн явц автоматаар бодогдоно.";
    return;
  }

  elements.progressCaption.textContent = `Борлуулсан ${formatNumber(stats.soldPieces)} ширхэг. Гэмтэлтэй/хагарсан ${formatNumber(
    stats.damagedPieces,
  )} ширхэгийг нэмбэл нийт ${stats.stockUseProgress.toFixed(1)}% ашиглагдсан байна.`;
}

function renderEditorZoneHeader() {
  if (isAdmin()) {
    elements.editorZoneEyebrow.textContent = "ЗАСВАРЛАГЧИЙН САНХҮҮ";
    elements.editorZoneTitle.textContent = "Импорт, гэмтэл, өртөг ба ашиг";
    elements.editorZoneCopy.textContent =
      "Импортын мөр бүр дээр авдар, 1 авдарт ширхэг, импортын зардлаа гараар бүртгэнэ. Нөөц дуусаагүй байхад дахин импорт хийвэл шинэ batch болж нэмэгдээд, үлдэгдэл болон ашигийн тооцоо автоматаар уялдана. Бараа материалын тусдаа худалдан авалт нь ашиг, алдагдлын тооцоонд орохгүй.";
    return;
  }

  if (isManager()) {
    elements.editorZoneEyebrow.textContent = "БОРЛУУЛАГЧИЙН ХАРАХ ХЭСЭГ";
    elements.editorZoneTitle.textContent = "Бараа материалын худалдан авалтын архив";
    elements.editorZoneCopy.textContent =
      "Борлуулагч энэ хэсгээс тусдаа бараа материалын худалдан авалтын жагсаалтыг харах бөгөөд засвар оруулахгүй. Импорт, гэмтэл, өртөг, борлуулагчийн эрх болон шилний төрлийг зөвхөн ADMIN удирдана.";
    return;
  }

  elements.editorZoneEyebrow.textContent = "ЗАСВАРЛАГЧИЙН САНХҮҮ";
  elements.editorZoneTitle.textContent = "Импорт, гэмтэл, өртөг ба ашиг";
  elements.editorZoneCopy.textContent =
    "Импорт, бараа материал, өртөг болон ашигийн хэсгийг харахын тулд эрхтэй кодоор нэвтэрнэ үү.";
}

function renderEditorPanels() {
  const canViewPurchases = canViewMaterialPurchases();
  const isAdminUser = isAdmin();
  elements.editorZone.classList.toggle("hidden", !canViewPurchases);
  renderEditorZoneHeader();

  for (const panel of elements.adminOnlyPanels) {
    panel.hidden = !isAdminUser;
  }

  elements.materialPurchaseForm.hidden = !isAdminUser;
  elements.purchaseActionHeader.hidden = !isAdminUser;
  elements.purchaseReadonlyHint.hidden = !isManager();

  if (!canViewPurchases) {
    return;
  }

  renderMaterialPurchaseTable();

  if (!isAdminUser) {
    return;
  }

  renderProductTable();
  renderProfitPanel();
  renderManagerAccounts();
  renderImportBatchTable();
  renderDamageTable();
  renderSalaryTable();

  if (!elements.productIdInput.value) {
    resetProductForm(false);
  }

  if (!elements.managerAccountId.value) {
    resetManagerAccountForm(false);
  }

  if (!elements.importBatchId.value) {
    resetImportForm(false);
  } else {
    updateImportPreview();
  }

  if (!elements.damageRecordId.value) {
    resetDamageForm(false);
  }

  if (!elements.purchaseDateInput.value) {
    resetMaterialPurchaseForm(false);
  }

  if (!elements.salaryDateInput.value) {
    resetSalaryForm(false);
  }
}

function renderProductTable() {
  elements.productSummaryText.textContent = state.products.length
    ? `Нийт ${state.products.length} шилний төрөл бүртгэлтэй байна.`
    : "Одоогоор шилний төрөл бүртгэлгүй байна.";

  if (!state.products.length) {
    elements.productTableBody.innerHTML =
      '<tr class="empty-state"><td colspan="4">Шинэ шилний төрлөө эндээс нэмнэ үү.</td></tr>';
    return;
  }

  elements.productTableBody.innerHTML = state.products
    .map((product) => {
      const stats = getInventoryStats(product.id);
      const isActiveProduct = product.id === state.activeProductId;

      return `
        <tr>
          <td>${isActiveProduct ? "<strong>" : ""}${escapeHtml(product.name)}${isActiveProduct ? "</strong>" : ""}</td>
          <td class="quantity-cell">${formatNumber(product.defaultPiecesPerCrate)}</td>
          <td>${formatNumber(stats.remainingPieces)} ш үлдэгдэл</td>
          <td>
            <div class="row-actions">
              <button class="inline-button" type="button" data-action="edit-product" data-product-id="${product.id}">Засах</button>
              <button class="inline-button danger" type="button" data-action="delete-product" data-product-id="${product.id}">Устгах</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderProfitPanel() {
  const product = getActiveProduct();
  const summary = product ? getProfitSummary(product.id) : buildEmptyProfitSummary();

  elements.importedCostValue.textContent = `${formatMoney(summary.totalImportCost)} ₮`;
  elements.pieceCostValue.textContent = `${formatMoney(summary.pieceCost)} ₮`;
  elements.soldCostValue.textContent = `${formatMoney(summary.soldCost)} ₮`;
  elements.damageCostValue.textContent = `${formatMoney(summary.damageCost)} ₮`;
  elements.remainingCostValue.textContent = `${formatMoney(summary.remainingCost)} ₮`;
  elements.grossProfitValue.textContent = `${formatMoney(summary.grossProfit)} ₮`;
  elements.salaryExpenseValue.textContent = `${formatMoney(summary.salaryExpense)} ₮`;
  elements.netProfitValue.textContent = `${formatMoney(summary.netProfit)} ₮`;
  elements.netProfitValue.style.color = summary.netProfit < 0 ? "var(--danger)" : "var(--accent)";
  elements.profitMarginValue.textContent = `${summary.marginPercent.toFixed(1)}%`;
  elements.profitProgressFill.style.width = `${Math.min(Math.max(summary.marginPercent, 0), 100)}%`;
  elements.profitProgressFill.style.background =
    summary.netProfit < 0
      ? "linear-gradient(90deg, var(--danger), var(--warning))"
      : "linear-gradient(90deg, var(--warm), var(--accent))";

  if (!summary.totalImportedPieces && !summary.totalImportCost) {
    elements.profitHint.textContent = "Импортын мөрүүдээ бүртгэсний дараа 1 ширхэгийн өртөг, үлдэгдэл нөөцийн өртөг, ашиг автоматаар гарна.";
  } else if (!summary.billed) {
    elements.profitHint.textContent = "Импортын өртөг бүртгэгдсэн байна. Борлуулалт ормогц ашиг болон гэмтлийн өртөг автоматаар шинэчлэгдэнэ.";
  } else if (summary.damageCost > 0) {
    elements.profitHint.textContent = `Борлуулалтын дүнгээс ${formatMoney(summary.soldCost)} ₮ борлуулсан өртөг, ${formatMoney(
      summary.damageCost,
    )} ₮ гэмтлийн өртөг, ${formatMoney(summary.salaryExpense)} ₮ цалингийн зардал хасагдаж, цэвэр ашиг ${formatMoney(summary.netProfit)} ₮ болж байна.`;
  } else if (summary.netProfit >= 0) {
    elements.profitHint.textContent = `Одоогийн борлуулалтаар ${formatMoney(summary.netProfit)} ₮ цэвэр ашигтай байна. Цалин ${formatMoney(
      summary.salaryExpense,
    )} ₮-өөр хувь тэнцүүлэн шингэсэн. Үлдэгдэл нөөцийн өртөг ${formatMoney(
      summary.remainingCost,
    )} ₮ гэж тооцогдож байна.`;
  } else {
    elements.profitHint.textContent = `Одоогийн борлуулалтаар ${formatMoney(Math.abs(summary.netProfit))} ₮ алдагдалтай байна. Импортын өртөг, цалин болон борлуулалтын үнээ шалгана уу.`;
  }
}

function renderManagerAccounts() {
  const managers = getManagerAccounts();
  elements.managerSummaryText.textContent = managers.length
    ? `Нийт ${managers.length} борлуулагчийн эрх үүссэн байна.`
    : "Одоогоор нэмэгдсэн борлуулагчийн эрх алга байна.";

  if (!managers.length) {
    elements.managerTableBody.innerHTML =
      '<tr class="empty-state"><td colspan="4">Эндээс борлуулагчийн нэр, код үүсгээд борлуулалтын мэдээлэл оруулах эрх олгоно.</td></tr>';
    return;
  }

  elements.managerTableBody.innerHTML = managers
    .map(
      (manager) => `
        <tr>
          <td>${escapeHtml(manager.name)}</td>
          <td>${escapeHtml(manager.accessCode)}</td>
          <td>${escapeHtml((manager.createdAt || "").slice(0, 10) || "—")}</td>
          <td>
            <div class="row-actions">
              <button class="inline-button" type="button" data-action="edit-manager" data-manager-id="${manager.id}">Засах</button>
              <button class="inline-button danger" type="button" data-action="delete-manager" data-manager-id="${manager.id}">Устгах</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderImportBatchTable() {
  const productId = state.activeProductId;
  const batches = getImportBatchesForProduct(productId);
  const totalCost = batches.reduce((sum, batch) => sum + getImportBatchTotalCost(batch), 0);
  const totalPieces = batches.reduce((sum, batch) => sum + Number(batch.totalPieces || 0), 0);
  elements.importSummaryText.textContent = batches.length
    ? `Нийт ${batches.length} batch • ${formatNumber(totalPieces)} ширхэг • ${formatMoney(totalCost)} ₮`
    : "Одоогоор импортын мөр алга байна.";

  if (!batches.length) {
    elements.importBatchTableBody.innerHTML =
      '<tr class="empty-state"><td colspan="9">Импортын эхний мөрөө оруулна уу. Дараагийн импорт бүр шинэ batch болон өмнөх үлдэгдэл дээр нэмэгдэнэ.</td></tr>';
    return;
  }

  elements.importBatchTableBody.innerHTML = batches
    .map((batch) => {
      const totalCostForBatch = getImportBatchTotalCost(batch);
      const pieceCost = batch.totalPieces ? totalCostForBatch / batch.totalPieces : 0;

      return `
        <tr>
          <td>${escapeHtml(batch.date)}</td>
          <td>${escapeHtml(batch.supplier || "—")}</td>
          <td class="quantity-cell">${formatNumber(batch.crates)}</td>
          <td class="quantity-cell">${formatNumber(batch.piecesPerCrate)}</td>
          <td class="quantity-cell">${formatNumber(batch.totalPieces)}</td>
          <td class="money-cell">${formatMoney(totalCostForBatch)}</td>
          <td class="money-cell">${formatMoney(pieceCost)}</td>
          <td>${escapeHtml(batch.note || "—")}</td>
          <td>
            <div class="row-actions">
              <button class="inline-button" type="button" data-action="edit-import" data-batch-id="${batch.id}">Засах</button>
              <button class="inline-button danger" type="button" data-action="delete-import" data-batch-id="${batch.id}">Устгах</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderDamageTable() {
  const productId = state.activeProductId;
  const records = getDamageRecordsForProduct(productId);
  const totalQuantity = records.reduce((sum, record) => sum + Number(record.quantity || 0), 0);
  elements.damageSummaryText.textContent = records.length
    ? `Нийт ${records.length} мөр • ${formatNumber(totalQuantity)} ширхэг гэмтэлд хасагдсан`
    : "Гэмтлийн бүртгэл ороогүй байна.";

  if (!records.length) {
    elements.damageTableBody.innerHTML =
      '<tr class="empty-state"><td colspan="5">Гэмтэлтэй эсвэл хагарсан шил гарвал энд бүртгэнэ. Үлдэгдлээс автоматаар хасагдана.</td></tr>';
    return;
  }

  elements.damageTableBody.innerHTML = records
    .map(
      (record) => `
        <tr>
          <td>${escapeHtml(record.date)}</td>
          <td class="quantity-cell">${formatNumber(record.quantity)}</td>
          <td>${escapeHtml(getDamageReasonLabel(record.reason))}</td>
          <td>${escapeHtml(record.note || "—")}</td>
          <td>
            <div class="row-actions">
              <button class="inline-button" type="button" data-action="edit-damage" data-damage-id="${record.id}">Засах</button>
              <button class="inline-button danger" type="button" data-action="delete-damage" data-damage-id="${record.id}">Устгах</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderMaterialPurchaseTable() {
  const purchases = getMaterialPurchases();
  const showActions = isAdmin();
  const columnCount = showActions ? 7 : 6;
  const totalAmount = purchases.reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0);
  elements.purchaseSummaryText.textContent = `Нийт ${purchases.length} мөр · ${formatMoney(totalAmount)} ₮`;

  if (!purchases.length) {
    elements.materialPurchaseTableBody.innerHTML =
      `<tr class="empty-state"><td colspan="${columnCount}">Тусдаа бараа материалын худалдан авалтын бүртгэл алга байна.</td></tr>`;
    return;
  }

  elements.materialPurchaseTableBody.innerHTML = purchases
    .map(
      (purchase) => `
        <tr>
          <td>${escapeHtml(purchase.date)}</td>
          <td>${escapeHtml(purchase.itemName)}</td>
          <td>${escapeHtml(purchase.quantityText || "—")}</td>
          <td class="money-cell">${formatMoney(purchase.amount)}</td>
          <td>${escapeHtml(purchase.supplier || "—")}</td>
          <td>${escapeHtml(purchase.note || "—")}</td>
          ${
            showActions
              ? `
          <td>
            <div class="row-actions">
              <button class="inline-button" type="button" data-action="edit-purchase" data-purchase-id="${purchase.id}">Засах</button>
              <button class="inline-button danger" type="button" data-action="delete-purchase" data-purchase-id="${purchase.id}">Устгах</button>
            </div>
          </td>
          `
              : ""
          }
        </tr>
      `,
    )
    .join("");
}

function renderSalaryTable() {
  const records = getSalaryRecords();
  const totalAmount = records.reduce((sum, record) => sum + Number(record.amount || 0), 0);
  const netProfit = Number(state.businessSummary?.netProfit || 0);
  elements.salarySummaryText.textContent = `Нийт ${records.length} мөр · ${formatMoney(totalAmount)} ₮ · Цалингийн дараах ашиг ${formatMoney(netProfit)} ₮`;

  if (!records.length) {
    elements.salaryTableBody.innerHTML =
      '<tr class="empty-state"><td colspan="7">Цалингийн бүртгэл одоогоор алга байна.</td></tr>';
    return;
  }

  elements.salaryTableBody.innerHTML = records
    .map(
      (record) => `
        <tr>
          <td>${escapeHtml(record.date)}</td>
          <td>${escapeHtml(record.employeeName)}</td>
          <td>${escapeHtml(record.role || "—")}</td>
          <td>${escapeHtml(record.period || "—")}</td>
          <td class="money-cell">${formatMoney(record.amount)}</td>
          <td>${escapeHtml(record.note || "—")}</td>
          <td>
            <div class="row-actions">
              <button class="inline-button" type="button" data-action="edit-salary" data-salary-id="${record.id}">Засах</button>
              <button class="inline-button danger" type="button" data-action="delete-salary" data-salary-id="${record.id}">Устгах</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderEntryTable() {
  const product = getActiveProduct();
  const visibleColumnCount = isManager() ? 10 : 13;
  if (!product) {
    elements.entryTableBody.innerHTML =
      `<tr class="empty-state"><td colspan="${visibleColumnCount}">Бүтээгдэхүүний мэдээлэл байхгүй байна.</td></tr>`;
    return;
  }

  if (state.role === "guest") {
    elements.entryTableBody.innerHTML =
      '<tr class="empty-state"><td colspan="13">Өгөгдөл харахын тулд нэвтэрнэ үү.</td></tr>';
    return;
  }

  const productEntries = getEntriesForProduct(product.id);
  if (!productEntries.length) {
    elements.entryTableBody.innerHTML = `<tr class="empty-state"><td colspan="${visibleColumnCount}">${
      canCreateSalesEntry() ? "Борлуулалтын мөр алга байна. Шинэ мөр нэмээд эхэлнэ үү." : "Одоогоор борлуулалтын бүртгэл алга байна."
    }</td></tr>`;
    return;
  }

  elements.entryTableBody.innerHTML = productEntries
    .map((entry, index) => {
      const paidAmount = getEntryPaidAmount(entry);
      const receivableAmount = getEntryReceivableAmount(entry);
      const actionCell =
        isAdmin()
          ? `
            <div class="row-actions">
              <button class="inline-button" type="button" data-action="edit-entry" data-entry-id="${entry.id}">Засах</button>
              <button class="inline-button danger" type="button" data-action="delete-entry" data-entry-id="${entry.id}">Устгах</button>
            </div>
          `
          : "—";

      return `
        <tr>
          <td class="table-number">${index + 1}</td>
          <td>${escapeHtml(entry.date)}</td>
          <td>${escapeHtml(entry.recordedByName || "ADMIN")}</td>
          <td>${escapeHtml(entry.customer)}</td>
          <td class="quantity-cell">${formatNumber(entry.quantity)}</td>
          <td class="money-cell">${formatMoney(entry.unitPrice)}</td>
          ${
            isManager()
              ? ""
              : `
          <td class="money-cell">${formatMoney(entry.totalAmount)}</td>
          <td class="money-cell">${formatMoney(paidAmount)}</td>
          `
          }
          <td class="balance-cell ${receivableAmount <= 0 ? "is-settled" : ""}">${formatMoney(receivableAmount)}</td>
          ${isManager() ? "" : `<td>${renderPaymentBreakdown(entry)}</td>`}
          <td>${escapeHtml(entry.crateLabel || "—")}</td>
          <td>${escapeHtml(entry.note || "—")}</td>
          <td>${actionCell}</td>
        </tr>
      `;
    })
    .join("");
}

function renderPaymentBreakdown(entry) {
  const payments = getEntryPayments(entry);
  if (!payments.length) {
    return '<span class="payment-breakdown-empty">Төлбөр ороогүй</span>';
  }

  return `
    <div class="payment-breakdown">
      ${payments
        .map(
          (payment) => `
            <div class="payment-breakdown-item">
              <strong>${getPaymentMethodLabel(payment.method)} · ${formatMoney(payment.amount)} ₮</strong>
              <span>${escapeHtml(payment.date)}${payment.note ? ` · ${escapeHtml(payment.note)}` : ""}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function populateProductSelect() {
  elements.productSelect.innerHTML = state.products
    .map((product) => `<option value="${product.id}">${escapeHtml(product.name)}</option>`)
    .join("");
}

function getActiveProduct() {
  return state.products.find((product) => product.id === state.activeProductId) || null;
}

function getInventoryStats(productId) {
  return (
    state.inventoryStats[productId] || {
      batchCount: 0,
      importedCrates: 0,
      importedPieces: 0,
      soldPieces: 0,
      damagedPieces: 0,
      remainingPieces: 0,
      billed: 0,
      collected: 0,
      receivable: 0,
      salesProgress: 0,
      stockUseProgress: 0,
      latestImportDate: "",
      latestPiecesPerCrate: 0,
    }
  );
}

function buildEmptyProfitSummary() {
  return {
    totalImportedPieces: 0,
    totalImportCost: 0,
    pieceCost: 0,
    soldCost: 0,
    damageCost: 0,
    remainingCost: 0,
    grossProfit: 0,
    salaryExpense: 0,
    netProfit: 0,
    marginPercent: 0,
    billed: 0,
  };
}

function getProfitSummary(productId) {
  return state.profitSummaries[productId] || buildEmptyProfitSummary();
}

function getEntriesForProduct(productId) {
  return [...state.entries]
    .filter((entry) => entry.productId === productId)
    .sort((left, right) => {
      const leftKey = `${left.date}|${left.createdAt}|${left.id}`;
      const rightKey = `${right.date}|${right.createdAt}|${right.id}`;
      return leftKey.localeCompare(rightKey);
    });
}

function getImportBatchesForProduct(productId) {
  return [...state.importBatches]
    .filter((batch) => batch.productId === productId)
    .sort((left, right) => {
      const leftKey = `${left.date}|${left.updatedAt}|${left.id}`;
      const rightKey = `${right.date}|${right.updatedAt}|${right.id}`;
      return rightKey.localeCompare(leftKey);
    });
}

function getDamageRecordsForProduct(productId) {
  return [...state.damageRecords]
    .filter((record) => record.productId === productId)
    .sort((left, right) => {
      const leftKey = `${left.date}|${left.updatedAt}|${left.id}`;
      const rightKey = `${right.date}|${right.updatedAt}|${right.id}`;
      return rightKey.localeCompare(leftKey);
    });
}

function getManagerAccounts() {
  return [...state.managerAccounts].sort((left, right) => {
    const leftKey = `${left.name}|${left.updatedAt || ""}|${left.id}`;
    const rightKey = `${right.name}|${right.updatedAt || ""}|${right.id}`;
    return leftKey.localeCompare(rightKey);
  });
}

function getMaterialPurchases() {
  return [...state.materialPurchases].sort((left, right) => {
    const leftKey = `${left.date}|${left.updatedAt}|${left.id}`;
    const rightKey = `${right.date}|${right.updatedAt}|${right.id}`;
    return rightKey.localeCompare(leftKey);
  });
}

function getSalaryRecords() {
  return [...state.salaryRecords].sort((left, right) => {
    const leftKey = `${left.date}|${left.updatedAt}|${left.id}`;
    const rightKey = `${right.date}|${right.updatedAt}|${right.id}`;
    return rightKey.localeCompare(leftKey);
  });
}

function getImportBatchTotalCost(batch) {
  return (
    Number(batch.importCost || 0) +
    Number(batch.taxCost || 0) +
    Number(batch.transportCost || 0) +
    Number(batch.wageCost || 0) +
    Number(batch.otherCost || 0)
  );
}

function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentMonthValue() {
  return getTodayDateValue().slice(0, 7);
}

function buildDashboardMetrics() {
  const today = getTodayDateValue();
  const month = getCurrentMonthValue();
  const receivableMap = new Map();
  const stockAlerts = [];
  let todaySales = 0;
  let todayCount = 0;
  let monthSales = 0;
  let monthCount = 0;
  let receivableTotal = 0;
  let receivableEntryCount = 0;

  for (const entry of state.entries) {
    const totalAmount = Number(entry.totalAmount || 0);
    if (entry.date === today) {
      todaySales += totalAmount;
      todayCount += 1;
    }

    if (String(entry.date || "").slice(0, 7) === month) {
      monthSales += totalAmount;
      monthCount += 1;
    }

    const receivable = getEntryReceivableAmount(entry);
    if (receivable > 0.009) {
      receivableTotal += receivable;
      receivableEntryCount += 1;
      const customer = entry.customer || "Нэргүй харилцагч";
      const existing = receivableMap.get(customer) || {
        customer,
        amount: 0,
        count: 0,
        latestDate: entry.date || "",
      };
      existing.amount += receivable;
      existing.count += 1;
      existing.latestDate = String(entry.date || "").localeCompare(existing.latestDate) > 0 ? entry.date : existing.latestDate;
      receivableMap.set(customer, existing);
    }
  }

  for (const product of state.products) {
    const stats = getInventoryStats(product.id);
    const threshold = Math.max(Number(product.defaultPiecesPerCrate || 0), 1);
    if (stats.importedPieces > 0 && stats.remainingPieces <= threshold) {
      stockAlerts.push({
        productName: product.name,
        remainingPieces: stats.remainingPieces,
        threshold,
      });
    }
  }

  const receivables = [...receivableMap.values()]
    .map((item) => ({ ...item, amount: Number(item.amount.toFixed(2)) }))
    .sort((left, right) => right.amount - left.amount || right.latestDate.localeCompare(left.latestDate));

  stockAlerts.sort((left, right) => left.remainingPieces - right.remainingPieces || left.productName.localeCompare(right.productName));

  return {
    todaySales: Number(todaySales.toFixed(2)),
    todayCount,
    monthSales: Number(monthSales.toFixed(2)),
    monthCount,
    receivableTotal: Number(receivableTotal.toFixed(2)),
    receivableEntryCount,
    receivables,
    stockAlerts,
    netProfit: Number(state.businessSummary?.netProfit || 0),
  };
}

function getEntryPayments(entry) {
  return Array.isArray(entry.payments) ? entry.payments : [];
}

function getEntryPaidAmount(entry) {
  return getEntryPayments(entry).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function getEntryReceivableAmount(entry) {
  return Number(entry.totalAmount || 0) - getEntryPaidAmount(entry);
}

function createPaymentDraft(payment = {}) {
  paymentDraftSeed += 1;
  return {
    id: payment.id || `payment-draft-${paymentDraftSeed}`,
    date: payment.date || elements.dateInput.value || getTodayDateValue(),
    method: payment.method || "cash",
    amount: payment.amount ?? "",
    note: payment.note || "",
  };
}

function updateRecorderContext() {
  if (!elements.recorderNameInput || !elements.recorderHint) {
    return;
  }

  const recorderName = isManager() ? state.currentUserName || "Борлуулагч" : "ADMIN";
  elements.recorderNameInput.value = recorderName;
  elements.recorderHint.textContent = isManager()
    ? "ADMIN-аас үүсгэсэн таны эрхийн нэр энэ борлуулалтын мөр дээр автоматаар хадгалагдана."
    : "ADMIN бүх борлуулалтын мөрийг нэмж, засаж, устгаж чадна.";
}

function renderPaymentRows(payments) {
  if (!payments.length) {
    elements.paymentList.innerHTML =
      '<p class="payment-empty">Одоогоор төлбөр оруулаагүй байна. Хэрэв 2-3 хувааж төлсөн бол мөр нэмээд тус бүрийг нь оруулна уу.</p>';
    return;
  }

  elements.paymentList.innerHTML = payments
    .map(
      (payment) => `
        <div class="payment-row" data-payment-row-id="${escapeHtml(payment.id)}">
          <label>
            Төлбөрийн огноо
            <input type="date" data-payment-field="date" value="${escapeHtml(payment.date || "")}" />
          </label>
          <label>
            Хэлбэр
            <select data-payment-field="method">
              <option value="cash" ${payment.method === "cash" ? "selected" : ""}>Бэлэн</option>
              <option value="bank" ${payment.method === "bank" ? "selected" : ""}>Данс</option>
            </select>
          </label>
          <label>
            Дүн
            <input type="number" min="0" step="0.01" data-payment-field="amount" value="${escapeHtml(
              payment.amount === "" ? "" : String(payment.amount),
            )}" placeholder="0" />
          </label>
          <label>
            Тайлбар
            <input type="text" data-payment-field="note" value="${escapeHtml(payment.note || "")}" placeholder="Жишээ: 2-р хэсэг" />
          </label>
          <button class="payment-row-remove" type="button" data-action="remove-payment-row" data-payment-row-id="${escapeHtml(
            payment.id,
          )}" aria-label="Төлбөрийн мөр устгах">×</button>
        </div>
      `,
    )
    .join("");
}

function readPaymentDraftsFromDom() {
  return [...elements.paymentList.querySelectorAll("[data-payment-row-id]")].map((row) => ({
    id: row.dataset.paymentRowId,
    date: row.querySelector('[data-payment-field="date"]')?.value || "",
    method: row.querySelector('[data-payment-field="method"]')?.value || "cash",
    amount: row.querySelector('[data-payment-field="amount"]')?.value || "",
    note: row.querySelector('[data-payment-field="note"]')?.value || "",
  }));
}

function collectPaymentsFromForm() {
  return readPaymentDraftsFromDom()
    .filter((payment) => {
      const hasAmount = String(payment.amount || "").trim() !== "";
      const hasNote = String(payment.note || "").trim() !== "";
      return hasAmount || hasNote;
    })
    .map((payment) => ({
      id: payment.id,
      date: payment.date,
      method: payment.method,
      amount: payment.amount,
      note: String(payment.note || "").trim(),
    }));
}

function openNewEntryModal() {
  if (!canCreateSalesEntry()) {
    return;
  }

  if (!canOpenNewSalesEntry()) {
    const stats = getActiveInventoryStats();
    showToolbarMessage(
      stats?.importedPieces
        ? "Үлдэгдэл хүрэлцэхгүй байна. Энэ төрөл дээр дахин импорт бүртгээд борлуулалт нэмнэ үү."
        : "Борлуулалт нэмэхийн өмнө энэ шилний төрөл дээр импортын мөр бүртгэнэ үү.",
      true,
    );
    return;
  }

  const today = getTodayDateValue();
  elements.entryForm.reset();
  elements.entryId.value = "";
  elements.modalTitle.textContent = "Шинэ мөр нэмэх";
  elements.dateInput.value = today;
  elements.productSelect.value = state.activeProductId || state.products[0]?.id || "";
  updateRecorderContext();
  setInlineMessage(elements.entryMessage, "", false);
  renderPaymentRows([createPaymentDraft({ date: today, method: "cash" })]);
  updateFormSummary();
  elements.entryModal.classList.remove("hidden");
}

function openEditEntryModal(entryId) {
  if (!isAdmin()) {
    return;
  }

  const entry = state.entries.find((item) => item.id === entryId);
  if (!entry) {
    return;
  }

  elements.entryId.value = entry.id;
  elements.productSelect.value = entry.productId;
  elements.dateInput.value = entry.date;
  elements.customerInput.value = entry.customer;
  elements.quantityInput.value = entry.quantity;
  elements.unitPriceInput.value = entry.unitPrice;
  elements.crateInput.value = entry.crateLabel || "";
  elements.noteInput.value = entry.note || "";
  elements.modalTitle.textContent = "Борлуулалтын мөр засах";
  updateRecorderContext();
  setInlineMessage(elements.entryMessage, "", false);

  const paymentDrafts = getEntryPayments(entry).length
    ? getEntryPayments(entry).map((payment) => createPaymentDraft(payment))
    : [createPaymentDraft({ date: entry.date, method: "cash" })];

  renderPaymentRows(paymentDrafts);
  updateFormSummary();
  elements.entryModal.classList.remove("hidden");
}

function closeEntryModal() {
  elements.entryModal.classList.add("hidden");
}

function openImportBatchEdit(batchId) {
  const batch = state.importBatches.find((item) => item.id === batchId);
  if (!batch) {
    return;
  }

  state.activeProductId = batch.productId;
  elements.importBatchId.value = batch.id;
  elements.importDateInput.value = batch.date;
  elements.importSupplierInput.value = batch.supplier || "";
  elements.importCratesInput.value = batch.crates;
  elements.importPiecesPerCrateInput.value = batch.piecesPerCrate;
  elements.importCostInput.value = batch.importCost;
  elements.taxCostInput.value = batch.taxCost;
  elements.transportCostInput.value = batch.transportCost;
  elements.wageCostInput.value = batch.wageCost;
  elements.otherCostInput.value = batch.otherCost;
  elements.importNoteInput.value = batch.note || "";
  setInlineMessage(elements.importMessage, "", false);
  updateImportPreview();
  render();
}

function resetImportForm(clearMessage) {
  const activeProduct = getActiveProduct();
  elements.importBatchForm.reset();
  elements.importBatchId.value = "";
  elements.importDateInput.value = getTodayDateValue();
  elements.importPiecesPerCrateInput.value = activeProduct?.defaultPiecesPerCrate || 82;
  if (clearMessage) {
    setInlineMessage(elements.importMessage, "", false);
  }
  updateImportPreview();
}

function openProductEdit(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) {
    return;
  }

  state.activeProductId = product.id;
  elements.productIdInput.value = product.id;
  elements.productNameInput.value = product.name;
  elements.productPiecesPerCrateInput.value = product.defaultPiecesPerCrate;
  setInlineMessage(elements.productMessage, "", false);
  render();
}

function resetProductForm(clearMessage) {
  elements.productForm.reset();
  elements.productIdInput.value = "";
  elements.productPiecesPerCrateInput.value = getActiveProduct()?.defaultPiecesPerCrate || 82;
  if (clearMessage) {
    setInlineMessage(elements.productMessage, "", false);
  }
}

function openManagerAccountEdit(managerId) {
  const manager = state.managerAccounts.find((item) => item.id === managerId);
  if (!manager) {
    return;
  }

  elements.managerAccountId.value = manager.id;
  elements.managerNameInput.value = manager.name;
  elements.managerCodeInput.value = manager.accessCode;
  setInlineMessage(elements.managerMessage, "", false);
}

function resetManagerAccountForm(clearMessage) {
  elements.managerAccountForm.reset();
  elements.managerAccountId.value = "";
  if (clearMessage) {
    setInlineMessage(elements.managerMessage, "", false);
  }
}

function openDamageEdit(damageId) {
  const record = state.damageRecords.find((item) => item.id === damageId);
  if (!record) {
    return;
  }

  state.activeProductId = record.productId;
  elements.damageRecordId.value = record.id;
  elements.damageDateInput.value = record.date;
  elements.damageQuantityInput.value = record.quantity;
  elements.damageReasonInput.value = record.reason;
  elements.damageNoteInput.value = record.note || "";
  setInlineMessage(elements.damageMessage, "", false);
  render();
}

function resetDamageForm(clearMessage) {
  elements.damageForm.reset();
  elements.damageRecordId.value = "";
  elements.damageDateInput.value = getTodayDateValue();
  elements.damageReasonInput.value = "broken";
  if (clearMessage) {
    setInlineMessage(elements.damageMessage, "", false);
  }
}

function resetMaterialPurchaseForm(clearMessage) {
  elements.materialPurchaseForm.reset();
  elements.materialPurchaseId.value = "";
  elements.purchaseDateInput.value = getTodayDateValue();
  if (clearMessage) {
    setInlineMessage(elements.purchaseMessage, "", false);
  }
}

function openMaterialPurchaseEdit(purchaseId) {
  const purchase = state.materialPurchases.find((item) => item.id === purchaseId);
  if (!purchase) {
    return;
  }

  elements.materialPurchaseId.value = purchase.id;
  elements.purchaseDateInput.value = purchase.date;
  elements.purchaseItemInput.value = purchase.itemName;
  elements.purchaseQuantityInput.value = purchase.quantityText || "";
  elements.purchaseAmountInput.value = purchase.amount;
  elements.purchaseSupplierInput.value = purchase.supplier || "";
  elements.purchaseNoteInput.value = purchase.note || "";
  setInlineMessage(elements.purchaseMessage, "", false);
}

function resetSalaryForm(clearMessage) {
  elements.salaryForm.reset();
  elements.salaryRecordId.value = "";
  elements.salaryDateInput.value = getTodayDateValue();
  if (clearMessage) {
    setInlineMessage(elements.salaryMessage, "", false);
  }
}

function openSalaryEdit(salaryId) {
  const record = state.salaryRecords.find((item) => item.id === salaryId);
  if (!record) {
    return;
  }

  elements.salaryRecordId.value = record.id;
  elements.salaryDateInput.value = record.date;
  elements.salaryEmployeeInput.value = record.employeeName;
  elements.salaryRoleInput.value = record.role || "";
  elements.salaryPeriodInput.value = record.period || "";
  elements.salaryAmountInput.value = record.amount;
  elements.salaryNoteInput.value = record.note || "";
  setInlineMessage(elements.salaryMessage, "", false);
}

function handleAddPaymentPart() {
  const drafts = readPaymentDraftsFromDom();
  drafts.push(createPaymentDraft({ date: elements.dateInput.value || getTodayDateValue() }));
  renderPaymentRows(drafts);
  updateFormSummary();
}

function handlePaymentListClick(event) {
  const button = event.target.closest('[data-action="remove-payment-row"]');
  if (!button) {
    return;
  }

  const targetId = button.dataset.paymentRowId;
  const drafts = readPaymentDraftsFromDom().filter((payment) => payment.id !== targetId);
  renderPaymentRows(drafts);
  updateFormSummary();
}

function updateFormSummary() {
  const productId = elements.productSelect.value;
  const product = state.products.find((item) => item.id === productId);
  if (!product) {
    elements.formAvailableStock.textContent = "0 ширхэг";
    elements.formTotalAmount.textContent = "0 ₮";
    elements.formPaidAmount.textContent = "0 ₮";
    elements.formReceivableAmount.textContent = "0 ₮";
    return;
  }

  const editingId = elements.entryId.value.trim();
  const imported = getInventoryStats(productId).importedPieces;
  const damaged = getInventoryStats(productId).damagedPieces;
  const soldWithoutCurrent = state.entries
    .filter((entry) => entry.productId === productId && entry.id !== editingId)
    .reduce((sum, entry) => sum + entry.quantity, 0);
  const available = imported - damaged - soldWithoutCurrent;
  const quantity = Number.parseInt(elements.quantityInput.value || "0", 10) || 0;
  const unitPrice = Number.parseFloat(elements.unitPriceInput.value || "0") || 0;
  const totalAmount = quantity * unitPrice;
  const paidAmount = collectPaymentsFromForm().reduce((sum, payment) => {
    const amount = Number.parseFloat(String(payment.amount || 0));
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
  const receivableAmount = totalAmount - paidAmount;

  elements.formAvailableStock.textContent = `${formatNumber(Math.max(0, available))} ширхэг`;
  elements.formTotalAmount.textContent = `${formatMoney(totalAmount)} ₮`;
  elements.formPaidAmount.textContent = `${formatMoney(paidAmount)} ₮`;
  elements.formReceivableAmount.textContent = `${formatMoney(receivableAmount)} ₮`;
  elements.formPaidAmount.className = paidAmount > 0 ? "success-text" : "";
  elements.formReceivableAmount.className = receivableAmount <= 0 ? "success-text" : "warning-text";
  elements.formAvailableStock.className = available > 0 ? "success-text" : "warning-text";
  if (elements.saveEntryButton) {
    elements.saveEntryButton.disabled = available <= 0;
  }
}

function updateImportPreview() {
  const crates = Number.parseInt(elements.importCratesInput.value || "0", 10) || 0;
  const piecesPerCrate = Number.parseInt(elements.importPiecesPerCrateInput.value || "0", 10) || 0;
  const totalPieces = crates * piecesPerCrate;
  const totalCost =
    readMoneyInput(elements.importCostInput) +
    readMoneyInput(elements.taxCostInput) +
    readMoneyInput(elements.transportCostInput) +
    readMoneyInput(elements.wageCostInput) +
    readMoneyInput(elements.otherCostInput);
  const pieceCost = totalPieces ? totalCost / totalPieces : 0;

  elements.importTotalPiecesPreview.textContent = formatNumber(totalPieces);
  elements.importTotalCostPreview.textContent = `${formatMoney(totalCost)} ₮`;
  elements.importPieceCostPreview.textContent = `${formatMoney(pieceCost)} ₮`;
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  setInlineMessage(elements.loginMessage, "", false);

  try {
    await apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        code: elements.loginCode.value,
      }),
    });

    elements.loginCode.value = "";
    await refreshBootstrap();
  } catch (error) {
    setInlineMessage(elements.loginMessage, error.message, true);
  }
}

async function handleLogout() {
  await apiFetch("/api/logout", { method: "POST" });
  closeEntryModal();
  await refreshBootstrap();
}

async function handleEntrySubmit(event) {
  event.preventDefault();
  setInlineMessage(elements.entryMessage, "", false);

  const payload = {
    productId: elements.productSelect.value,
    date: elements.dateInput.value,
    customer: elements.customerInput.value.trim(),
    quantity: elements.quantityInput.value,
    unitPrice: elements.unitPriceInput.value || 0,
    crateLabel: elements.crateInput.value.trim(),
    note: elements.noteInput.value.trim(),
    payments: collectPaymentsFromForm(),
  };

  const entryId = elements.entryId.value.trim();
  const endpoint = entryId ? `/api/entries/${entryId}` : "/api/entries";
  const method = entryId ? "PUT" : "POST";

  try {
    state.activeProductId = payload.productId;
    const payloadResponse = await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    applyBootstrapPayload(payloadResponse);
    closeEntryModal();
  } catch (error) {
    setInlineMessage(elements.entryMessage, error.message, true);
  }
}

async function handleImportBatchSubmit(event) {
  event.preventDefault();
  setInlineMessage(elements.importMessage, "", false);

  const payload = {
    productId: state.activeProductId,
    date: elements.importDateInput.value,
    supplier: elements.importSupplierInput.value.trim(),
    crates: elements.importCratesInput.value,
    piecesPerCrate: elements.importPiecesPerCrateInput.value,
    importCost: elements.importCostInput.value || 0,
    taxCost: elements.taxCostInput.value || 0,
    transportCost: elements.transportCostInput.value || 0,
    wageCost: elements.wageCostInput.value || 0,
    otherCost: elements.otherCostInput.value || 0,
    note: elements.importNoteInput.value.trim(),
  };

  const batchId = elements.importBatchId.value.trim();
  const endpoint = batchId ? `/api/import-batches/${batchId}` : "/api/import-batches";
  const method = batchId ? "PUT" : "POST";

  try {
    const payloadResponse = await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    applyBootstrapPayload(payloadResponse);
    resetImportForm(false);
    setInlineMessage(elements.importMessage, "Импортын мөр хадгалагдлаа.", false, true);
  } catch (error) {
    setInlineMessage(elements.importMessage, error.message, true);
  }
}

async function handleDamageSubmit(event) {
  event.preventDefault();
  setInlineMessage(elements.damageMessage, "", false);

  const payload = {
    productId: state.activeProductId,
    date: elements.damageDateInput.value,
    quantity: elements.damageQuantityInput.value,
    reason: elements.damageReasonInput.value,
    note: elements.damageNoteInput.value.trim(),
  };

  const damageId = elements.damageRecordId.value.trim();
  const endpoint = damageId ? `/api/damage-records/${damageId}` : "/api/damage-records";
  const method = damageId ? "PUT" : "POST";

  try {
    const payloadResponse = await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    applyBootstrapPayload(payloadResponse);
    resetDamageForm(false);
    setInlineMessage(elements.damageMessage, "Гэмтлийн мөр хадгалагдлаа.", false, true);
  } catch (error) {
    setInlineMessage(elements.damageMessage, error.message, true);
  }
}

async function handleProductSubmit(event) {
  event.preventDefault();
  setInlineMessage(elements.productMessage, "", false);

  const payload = {
    name: elements.productNameInput.value.trim(),
    defaultPiecesPerCrate: elements.productPiecesPerCrateInput.value,
  };

  const productId = elements.productIdInput.value.trim();
  const endpoint = productId ? `/api/products/${productId}` : "/api/products";
  const method = productId ? "PUT" : "POST";

  try {
    const payloadResponse = await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    applyBootstrapPayload(payloadResponse);
    const savedProduct =
      payloadResponse.products?.find((item) => item.id === productId) ||
      payloadResponse.products?.find((item) => item.name === payload.name);
    if (savedProduct) {
      state.activeProductId = savedProduct.id;
      render();
    }
    resetProductForm(false);
    setInlineMessage(elements.productMessage, "Шилний төрөл хадгалагдлаа.", false, true);
  } catch (error) {
    setInlineMessage(elements.productMessage, error.message, true);
  }
}

async function handleManagerAccountSubmit(event) {
  event.preventDefault();
  setInlineMessage(elements.managerMessage, "", false);

  const payload = {
    name: elements.managerNameInput.value.trim(),
    accessCode: elements.managerCodeInput.value.trim(),
  };

  const managerId = elements.managerAccountId.value.trim();
  const endpoint = managerId ? `/api/manager-accounts/${managerId}` : "/api/manager-accounts";
  const method = managerId ? "PUT" : "POST";

  try {
    const payloadResponse = await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    applyBootstrapPayload(payloadResponse);
    resetManagerAccountForm(false);
    setInlineMessage(elements.managerMessage, "Борлуулагчийн эрх хадгалагдлаа.", false, true);
  } catch (error) {
    setInlineMessage(elements.managerMessage, error.message, true);
  }
}

async function handleMaterialPurchaseSubmit(event) {
  event.preventDefault();
  setInlineMessage(elements.purchaseMessage, "", false);

  const payload = {
    date: elements.purchaseDateInput.value,
    itemName: elements.purchaseItemInput.value.trim(),
    quantityText: elements.purchaseQuantityInput.value.trim(),
    amount: elements.purchaseAmountInput.value,
    supplier: elements.purchaseSupplierInput.value.trim(),
    note: elements.purchaseNoteInput.value.trim(),
  };

  const purchaseId = elements.materialPurchaseId.value.trim();
  const endpoint = purchaseId ? `/api/material-purchases/${purchaseId}` : "/api/material-purchases";
  const method = purchaseId ? "PUT" : "POST";

  try {
    const payloadResponse = await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    applyBootstrapPayload(payloadResponse);
    resetMaterialPurchaseForm(false);
    setInlineMessage(elements.purchaseMessage, "Худалдан авалтын мөр хадгалагдлаа.", false, true);
  } catch (error) {
    setInlineMessage(elements.purchaseMessage, error.message, true);
  }
}

async function handleSalarySubmit(event) {
  event.preventDefault();
  setInlineMessage(elements.salaryMessage, "", false);

  const payload = {
    date: elements.salaryDateInput.value,
    employeeName: elements.salaryEmployeeInput.value.trim(),
    role: elements.salaryRoleInput.value.trim(),
    period: elements.salaryPeriodInput.value.trim(),
    amount: elements.salaryAmountInput.value,
    note: elements.salaryNoteInput.value.trim(),
  };

  const salaryId = elements.salaryRecordId.value.trim();
  const endpoint = salaryId ? `/api/salary-records/${salaryId}` : "/api/salary-records";
  const method = salaryId ? "PUT" : "POST";

  try {
    const payloadResponse = await apiFetch(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    applyBootstrapPayload(payloadResponse);
    resetSalaryForm(false);
    setInlineMessage(elements.salaryMessage, "Цалингийн мөр хадгалагдлаа.", false, true);
  } catch (error) {
    setInlineMessage(elements.salaryMessage, error.message, true);
  }
}

async function handleManagerTableAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const managerId = button.dataset.managerId;

  if (action === "edit-manager" && managerId) {
    openManagerAccountEdit(managerId);
    return;
  }

  if (action === "delete-manager" && managerId) {
    const accepted = window.confirm("Энэ борлуулагчийн эрхийг устгахдаа итгэлтэй байна уу?");
    if (!accepted) {
      return;
    }

    try {
      const payload = await apiFetch(`/api/manager-accounts/${managerId}`, { method: "DELETE" });
      applyBootstrapPayload(payload);
      resetManagerAccountForm(false);
    } catch (error) {
      setInlineMessage(elements.managerMessage, error.message, true);
    }
  }
}

async function handleProductTableAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const productId = button.dataset.productId;

  if (action === "edit-product" && productId) {
    openProductEdit(productId);
    return;
  }

  if (action === "delete-product" && productId) {
    const accepted = window.confirm("Энэ шилний төрлийг устгахдаа итгэлтэй байна уу?");
    if (!accepted) {
      return;
    }

    try {
      const payload = await apiFetch(`/api/products/${productId}`, { method: "DELETE" });
      applyBootstrapPayload(payload);
      resetProductForm(false);
    } catch (error) {
      setInlineMessage(elements.productMessage, error.message, true);
    }
  }
}

async function handleEntryTableAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const entryId = button.dataset.entryId;

  if (action === "edit-entry" && entryId && isAdmin()) {
    openEditEntryModal(entryId);
    return;
  }

  if (action === "delete-entry" && entryId && isAdmin()) {
    const accepted = window.confirm("Энэ борлуулалтын мөрийг устгахдаа итгэлтэй байна уу?");
    if (!accepted) {
      return;
    }

    try {
      const payload = await apiFetch(`/api/entries/${entryId}`, { method: "DELETE" });
      applyBootstrapPayload(payload);
    } catch (error) {
      showToolbarMessage(error.message, true);
    }
  }
}

async function handleImportBatchTableAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const batchId = button.dataset.batchId;

  if (action === "edit-import" && batchId) {
    openImportBatchEdit(batchId);
    return;
  }

  if (action === "delete-import" && batchId) {
    const accepted = window.confirm("Энэ импортын мөрийг устгахдаа итгэлтэй байна уу?");
    if (!accepted) {
      return;
    }

    try {
      const payload = await apiFetch(`/api/import-batches/${batchId}`, { method: "DELETE" });
      applyBootstrapPayload(payload);
      resetImportForm(false);
    } catch (error) {
      setInlineMessage(elements.importMessage, error.message, true);
    }
  }
}

async function handleDamageTableAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const damageId = button.dataset.damageId;

  if (action === "edit-damage" && damageId) {
    openDamageEdit(damageId);
    return;
  }

  if (action === "delete-damage" && damageId) {
    const accepted = window.confirm("Энэ гэмтлийн мөрийг устгахдаа итгэлтэй байна уу?");
    if (!accepted) {
      return;
    }

    try {
      const payload = await apiFetch(`/api/damage-records/${damageId}`, { method: "DELETE" });
      applyBootstrapPayload(payload);
      resetDamageForm(false);
    } catch (error) {
      setInlineMessage(elements.damageMessage, error.message, true);
    }
  }
}

async function handleMaterialPurchaseTableAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const purchaseId = button.dataset.purchaseId;

  if (action === "edit-purchase" && purchaseId) {
    openMaterialPurchaseEdit(purchaseId);
    return;
  }

  if (action === "delete-purchase" && purchaseId) {
    const accepted = window.confirm("Энэ худалдан авалтын мөрийг устгахдаа итгэлтэй байна уу?");
    if (!accepted) {
      return;
    }

    try {
      const payload = await apiFetch(`/api/material-purchases/${purchaseId}`, { method: "DELETE" });
      applyBootstrapPayload(payload);
      resetMaterialPurchaseForm(false);
    } catch (error) {
      setInlineMessage(elements.purchaseMessage, error.message, true);
    }
  }
}

async function handleSalaryTableAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const salaryId = button.dataset.salaryId;

  if (action === "edit-salary" && salaryId) {
    openSalaryEdit(salaryId);
    return;
  }

  if (action === "delete-salary" && salaryId) {
    const accepted = window.confirm("Энэ цалингийн мөрийг устгахдаа итгэлтэй байна уу?");
    if (!accepted) {
      return;
    }

    try {
      const payload = await apiFetch(`/api/salary-records/${salaryId}`, { method: "DELETE" });
      applyBootstrapPayload(payload);
      resetSalaryForm(false);
    } catch (error) {
      setInlineMessage(elements.salaryMessage, error.message, true);
    }
  }
}

function showToolbarMessage(message, isError = false) {
  elements.toolbarCopy.textContent = message;
  elements.toolbarCopy.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function setInlineMessage(element, message, isError, isSuccess = false) {
  element.textContent = message;
  element.style.color = !message ? "var(--muted)" : isError ? "var(--danger)" : isSuccess ? "var(--accent)" : "var(--muted)";
}

function readMoneyInput(element) {
  const value = Number.parseFloat(element.value || "0");
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
}

function getPaymentMethodLabel(method) {
  return method === "bank" ? "Данс" : "Бэлэн";
}

function getDamageReasonLabel(reason) {
  const labels = {
    broken: "Хагарсан",
    damaged: "Гэмтэлтэй",
    shortage: "Дутуу / алдагдал",
    other: "Бусад",
  };

  return labels[reason] || "Бусад";
}

function formatMoney(value) {
  return currencyFormatter.format(Number(value || 0));
}

function formatNumber(value) {
  return currencyFormatter.format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
