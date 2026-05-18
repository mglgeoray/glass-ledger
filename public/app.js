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
  invoiceSettings: {},
  inventoryStats: {},
  profitSummaries: {},
  businessSummary: {},
  activeProductId: null,
  dashboardPeriod: "today",
};

let paymentDraftSeed = 0;

const elements = {
  addEntryButton: document.querySelector("#addEntryButton"),
  addPaymentPartButton: document.querySelector("#addPaymentPartButton"),
  authLayer: document.querySelector("#authLayer"),
  billedValue: document.querySelector("#billedValue"),
  cashFormulaText: document.querySelector("#cashFormulaText"),
  cashFormulaValue: document.querySelector("#cashFormulaValue"),
  cancelModalButton: document.querySelector("#cancelModalButton"),
  closeModalButton: document.querySelector("#closeModalButton"),
  collectedValue: document.querySelector("#collectedValue"),
  customerInput: document.querySelector("#customerInput"),
  customerSummaryText: document.querySelector("#customerSummaryText"),
  customerTableBody: document.querySelector("#customerTableBody"),
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
  dashboardGrossProfit: document.querySelector("#dashboardGrossProfit"),
  dashboardLowStockCount: document.querySelector("#dashboardLowStockCount"),
  dashboardLowStockText: document.querySelector("#dashboardLowStockText"),
  dashboardNetProfit: document.querySelector("#dashboardNetProfit"),
  dashboardPanel: document.querySelector("#dashboardPanel"),
  dashboardPeriodCollected: document.querySelector("#dashboardPeriodCollected"),
  dashboardPeriodCount: document.querySelector("#dashboardPeriodCount"),
  dashboardPeriodDamage: document.querySelector("#dashboardPeriodDamage"),
  dashboardPeriodDamageCost: document.querySelector("#dashboardPeriodDamageCost"),
  dashboardPeriodPaidCount: document.querySelector("#dashboardPeriodPaidCount"),
  dashboardPeriodSales: document.querySelector("#dashboardPeriodSales"),
  dashboardPeriodTabs: document.querySelector("#dashboardPeriodTabs"),
  dashboardReceivable: document.querySelector("#dashboardReceivable"),
  dashboardReceivableCount: document.querySelector("#dashboardReceivableCount"),
  dashboardRemainingCost: document.querySelector("#dashboardRemainingCost"),
  dashboardRemainingPieces: document.querySelector("#dashboardRemainingPieces"),
  dashboardSalaryExpense: document.querySelector("#dashboardSalaryExpense"),
  dashboardSalesLabel: document.querySelector("#dashboardSalesLabel"),
  dateInput: document.querySelector("#dateInput"),
  editorZoneEyebrow: document.querySelector("#editorZoneEyebrow"),
  editorZoneTitle: document.querySelector("#editorZoneTitle"),
  editorZoneCopy: document.querySelector("#editorZoneCopy"),
  editorZone: document.querySelector("#editorZone"),
  entryForm: document.querySelector("#entryForm"),
  entryId: document.querySelector("#entryId"),
  entryCardList: document.querySelector("#entryCardList"),
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
  latestImportText: document.querySelector("#latestImportText"),
  latestImportValue: document.querySelector("#latestImportValue"),
  latestSaleText: document.querySelector("#latestSaleText"),
  latestSaleValue: document.querySelector("#latestSaleValue"),
  invoiceBankAccountInput: document.querySelector("#invoiceBankAccountInput"),
  invoiceBankNameInput: document.querySelector("#invoiceBankNameInput"),
  invoiceCompanyNameInput: document.querySelector("#invoiceCompanyNameInput"),
  invoiceFooterNoteInput: document.querySelector("#invoiceFooterNoteInput"),
  invoiceLogoTextInput: document.querySelector("#invoiceLogoTextInput"),
  invoicePhoneInput: document.querySelector("#invoicePhoneInput"),
  invoiceQrTextInput: document.querySelector("#invoiceQrTextInput"),
  invoiceSettingsForm: document.querySelector("#invoiceSettingsForm"),
  invoiceSettingsMessage: document.querySelector("#invoiceSettingsMessage"),
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
  moneySummaryText: document.querySelector("#moneySummaryText"),
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
  profitSnapshotCard: document.querySelector("#profitSnapshotCard"),
  profitSnapshotFill: document.querySelector("#profitSnapshotFill"),
  profitSnapshotText: document.querySelector("#profitSnapshotText"),
  profitSnapshotValue: document.querySelector("#profitSnapshotValue"),
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
  quickAddEntryButton: document.querySelector("#quickAddEntryButton"),
  receivableValue: document.querySelector("#receivableValue"),
  sellerQuickHint: document.querySelector("#sellerQuickHint"),
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
  sellerReceivableCount: document.querySelector("#sellerReceivableCount"),
  sellerReceivableList: document.querySelector("#sellerReceivableList"),
  salaryExpenseValue: document.querySelector("#salaryExpenseValue"),
  sellerStockPills: document.querySelector("#sellerStockPills"),
  sellerStockText: document.querySelector("#sellerStockText"),
  sellerTodayCount: document.querySelector("#sellerTodayCount"),
  sellerTodayList: document.querySelector("#sellerTodayList"),
  soldCostValue: document.querySelector("#soldCostValue"),
  soldValue: document.querySelector("#soldValue"),
  stockFormulaText: document.querySelector("#stockFormulaText"),
  stockFormulaValue: document.querySelector("#stockFormulaValue"),
  stockSummaryText: document.querySelector("#stockSummaryText"),
  taxCostInput: document.querySelector("#taxCostInput"),
  toolbarCopy: document.querySelector("#toolbarCopy"),
  transportCostInput: document.querySelector("#transportCostInput"),
  unitPriceInput: document.querySelector("#unitPriceInput"),
  crateInput: document.querySelector("#crateInput"),
  wageCostInput: document.querySelector("#wageCostInput"),
  damageCostValue: document.querySelector("#damageCostValue"),
  adminOnlyPanels: Array.from(document.querySelectorAll("[data-admin-only]")),
  aging0To7: document.querySelector("#aging0To7"),
  aging8To30: document.querySelector("#aging8To30"),
  aging31Plus: document.querySelector("#aging31Plus"),
  attentionList: document.querySelector("#attentionList"),
  attentionSummaryText: document.querySelector("#attentionSummaryText"),
};

const collapsiblePanels = [
  {
    id: "dashboard",
    selector: "#dashboardPanel",
    headerSelector: ".dashboard-header",
    title: "Удирдлагын самбар",
  },
  {
    id: "summary",
    selector: "#summaryGrid",
    title: "Бүтээгдэхүүний самбар",
  },
  {
    id: "editor",
    selector: "#editorZone",
    headerSelector: ".editor-zone-header",
    title: "Санхүүгийн хэсэг",
  },
  {
    id: "entries",
    selector: ".table-card",
    title: "Борлуулалтын жагсаалт",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  initializeCollapsiblePanels();
  refreshBootstrap();
});

function bindEvents() {
  elements.loginForm.addEventListener("submit", handleLoginSubmit);
  elements.logoutButton.addEventListener("click", handleLogout);
  elements.addEntryButton.addEventListener("click", openNewEntryModal);
  elements.quickAddEntryButton.addEventListener("click", openNewEntryModal);
  elements.sellerStockPills?.addEventListener("click", handleSellerStockPillClick);
  elements.dashboardPeriodTabs.addEventListener("click", handleDashboardPeriodClick);
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
  elements.invoiceSettingsForm?.addEventListener("submit", handleInvoiceSettingsSubmit);
  document.addEventListener("click", handlePanelToggleClick);

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

function initializeCollapsiblePanels() {
  for (const config of collapsiblePanels) {
    const panel = document.querySelector(config.selector);
    if (!panel || panel.dataset.collapsibleReady === "true") {
      continue;
    }

    panel.dataset.collapsePanel = config.id;
    const header = ensureCollapseHeader(panel, config);
    const button = document.createElement("button");
    button.className = "panel-toggle";
    button.type = "button";
    button.dataset.collapseToggle = config.id;
    button.innerHTML = '<span class="panel-toggle-text">Хураах</span><span class="panel-toggle-arrow" aria-hidden="true">⌄</span>';
    header.append(button);

    const isCollapsed = localStorage.getItem(getCollapseStorageKey(config.id)) === "collapsed";
    setPanelCollapsed(panel, button, isCollapsed);

    panel.dataset.collapsibleReady = "true";
  }
}

function handlePanelToggleClick(event) {
  const button = event.target.closest("[data-collapse-toggle]");
  if (!button) {
    return;
  }

  const panel = document.querySelector(`[data-collapse-panel="${button.dataset.collapseToggle}"]`);
  if (!panel) {
    return;
  }

  setPanelCollapsed(panel, button, !panel.classList.contains("is-collapsed"));
}

function ensureCollapseHeader(panel, config) {
  const existingHeader = config.headerSelector ? panel.querySelector(config.headerSelector) : null;
  if (existingHeader) {
    existingHeader.classList.add("panel-collapse-header");
    return existingHeader;
  }

  const header = document.createElement("div");
  header.className = "panel-generated-header panel-collapse-header";
  header.innerHTML = `<h2>${escapeHtml(config.title)}</h2>`;
  panel.prepend(header);
  return header;
}

function setPanelCollapsed(panel, button, isCollapsed) {
  panel.classList.toggle("is-collapsed", isCollapsed);
  button.setAttribute("aria-expanded", String(!isCollapsed));
  button.querySelector(".panel-toggle-text").textContent = isCollapsed ? "Дэлгэх" : "Хураах";
  localStorage.setItem(getCollapseStorageKey(panel.dataset.collapsePanel), isCollapsed ? "collapsed" : "expanded");
}

function getCollapseStorageKey(panelId) {
  return `glassLedger:panel:${panelId}`;
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
  state.invoiceSettings = payload.invoiceSettings || {};
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
  return isAdmin();
}

function render() {
  renderRole();
  renderTabs();
  renderInventoryMeta();
  renderSellerWorkspace();
  renderDashboard();
  renderSummary();
  renderOverviewNotes();
  renderProgress();
  renderProfitSnapshot();
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
  elements.quickAddEntryButton.disabled = canCreateSalesEntry() && !canOpenNewSalesEntry();

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
    elements.sellerQuickHint.textContent = activeStats?.remainingPieces > 0
      ? `Одоогийн боломжит үлдэгдэл: ${formatNumber(activeStats.remainingPieces)} ширхэг.`
      : "Энэ төрөл дээр үлдэгдэл алга байна. ADMIN импорт нэмсний дараа борлуулалт бүртгэнэ.";
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

  if (isManager()) {
    elements.productMeta.textContent = `Үлдэгдэл: ${formatNumber(stats.remainingPieces)} ширхэг.`;
    return;
  }

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
  const canViewDashboard = isAdmin();
  elements.dashboardPanel.classList.toggle("hidden", !canViewDashboard);
  if (!canViewDashboard) {
    return;
  }

  const metrics = buildDashboardMetrics();
  const period = metrics.periods[state.dashboardPeriod] || metrics.periods.today;
  elements.dashboardSalesLabel.textContent = `${getDashboardPeriodLabel(state.dashboardPeriod)} борлуулалт`;
  elements.dashboardPeriodSales.textContent = `${formatMoney(period.sales)} ₮`;
  elements.dashboardPeriodCount.textContent = `${formatNumber(period.salesCount)} мөр`;
  elements.dashboardPeriodCollected.textContent = `${formatMoney(period.collected)} ₮`;
  elements.dashboardPeriodPaidCount.textContent = `${formatNumber(period.paymentCount)} төлөлт`;
  elements.dashboardPeriodDamage.textContent = `${formatNumber(period.damagedPieces)} ш`;
  elements.dashboardPeriodDamageCost.textContent = `${formatMoney(period.damageCost)} ₮ өртөг`;
  elements.dashboardReceivable.textContent = `${formatMoney(metrics.receivableTotal)} ₮`;
  elements.dashboardReceivableCount.textContent = `${formatNumber(metrics.receivableEntryCount)} мөр`;
  elements.dashboardGrossProfit.textContent = `${formatMoney(metrics.grossProfit)} ₮`;
  elements.dashboardSalaryExpense.textContent = `${formatMoney(metrics.salaryExpense)} ₮`;
  elements.dashboardNetProfit.textContent = `${formatMoney(metrics.netProfit)} ₮`;
  elements.dashboardNetProfit.style.color = metrics.netProfit < 0 ? "var(--danger)" : "var(--accent)";
  elements.dashboardLowStockCount.textContent = formatNumber(metrics.stockAlerts.length);
  elements.dashboardLowStockText.textContent = metrics.stockAlerts.length ? "Нөөц шалгах шаардлагатай" : "Бүх төрөл хэвийн";
  elements.dashboardRemainingPieces.textContent = `${formatNumber(metrics.remainingPieces)} ш`;
  elements.dashboardRemainingCost.textContent = `${formatMoney(metrics.remainingCost)} ₮ өртөг`;
  elements.dashboardHint.textContent = isManager()
    ? "Борлуулагчид авлага болон нөөцийн анхааруулга төвлөрч харагдана."
    : "Борлуулалт, авлага, нийт цалин, ашиг болон нөөцийн эрсдэл нэг дор харагдана.";

  for (const button of elements.dashboardPeriodTabs.querySelectorAll("[data-dashboard-period]")) {
    button.classList.toggle("active", button.dataset.dashboardPeriod === state.dashboardPeriod);
  }

  renderReceivableDashboard(metrics.receivables);
  renderAgingSummary(metrics.aging);
  renderAttentionItems(metrics.attentionItems);
  renderCustomerRegistry(metrics.customers);
}

function renderReceivableDashboard(receivables) {
  const total = receivables.reduce((sum, item) => sum + item.amount, 0);
  elements.receivableSummaryText.textContent = receivables.length
    ? `${formatNumber(receivables.length)} харилцагч • ${formatMoney(total)} ₮`
    : "Авлага алга байна.";

  if (!receivables.length) {
    elements.receivableTableBody.innerHTML = '<tr class="empty-state"><td colspan="5">Авлагатай харилцагч алга байна.</td></tr>';
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
          <td>${escapeHtml(getReceivableAgeLabel(item.maxAgeDays))}</td>
        </tr>
      `,
    )
    .join("");
}

function renderAgingSummary(aging) {
  elements.aging0To7.textContent = `${formatMoney(aging.current)} ₮`;
  elements.aging8To30.textContent = `${formatMoney(aging.mid)} ₮`;
  elements.aging31Plus.textContent = `${formatMoney(aging.old)} ₮`;
}

function renderAttentionItems(items) {
  elements.attentionSummaryText.textContent = items.length
    ? `${formatNumber(items.length)} анхаарах зүйл байна.`
    : "Анхаарах зүйл алга.";

  if (!items.length) {
    elements.attentionList.innerHTML = '<p class="alert-empty">Одоогоор анхаарах зүйл алга байна.</p>';
    return;
  }

  elements.attentionList.innerHTML = items
    .map(
      (item) => `
        <div class="alert-item ${item.level === "danger" ? "danger" : ""}">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.detail)}</span>
        </div>
      `,
    )
    .join("");
}

function renderSellerWorkspace() {
  if (!elements.sellerReceivableList || !isManager()) {
    return;
  }

  const product = getActiveProduct();
  const entries = product ? getEntriesForProduct(product.id) : [];
  const today = getTodayDateValue();
  const todayEntries = entries.filter((entry) => entry.date === today).slice(-5).reverse();
  const receivableEntries = entries
    .filter((entry) => getEntryReceivableAmount(entry) > 0.009)
    .sort((left, right) => {
      const leftKey = `${left.date}|${left.createdAt}|${left.id}`;
      const rightKey = `${right.date}|${right.createdAt}|${right.id}`;
      return rightKey.localeCompare(leftKey);
    })
    .slice(0, 6);

  const totalReceivable = receivableEntries.reduce((sum, entry) => sum + getEntryReceivableAmount(entry), 0);
  const stats = product ? getInventoryStats(product.id) : { remainingPieces: 0 };

  elements.sellerReceivableCount.textContent = `${formatMoney(totalReceivable)} ₮`;
  elements.sellerTodayCount.textContent = `${formatNumber(todayEntries.length)} мөр`;
  elements.sellerStockText.textContent = `${formatNumber(stats.remainingPieces)} ш`;
  elements.sellerReceivableList.innerHTML = renderSellerMiniEntryList(
    receivableEntries,
    "Одоогоор авлагатай мөр алга байна.",
  );
  elements.sellerTodayList.innerHTML = renderSellerMiniEntryList(
    todayEntries,
    "Өнөөдөр борлуулалт алга байна.",
  );
  elements.sellerStockPills.innerHTML = state.products
    .map((item) => {
      const itemStats = getInventoryStats(item.id);
      const isActive = item.id === state.activeProductId;
      return `
        <button class="seller-stock-pill ${isActive ? "active" : ""}" type="button" data-product-id="${item.id}">
          <span>${escapeHtml(item.name)}</span>
          <strong>${formatNumber(itemStats.remainingPieces)} ш</strong>
        </button>
      `;
    })
    .join("");
}

function renderSellerMiniEntryList(entries, emptyText) {
  if (!entries.length) {
    return `<p class="seller-empty">${escapeHtml(emptyText)}</p>`;
  }

  return entries
    .map((entry) => {
      const receivableAmount = getEntryReceivableAmount(entry);
      return `
        <article class="seller-mini-entry">
          <div>
            <strong>${escapeHtml(entry.customer)}</strong>
            <span>${escapeHtml(entry.date)} · ${formatNumber(entry.quantity)} ш</span>
          </div>
          <strong class="${receivableAmount <= 0 ? "success-text" : "warning-text"}">${formatMoney(receivableAmount)} ₮</strong>
        </article>
      `;
    })
    .join("");
}

function renderCustomerRegistry(customers) {
  if (!elements.customerSummaryText || !elements.customerTableBody) {
    return;
  }

  const totalReceivable = customers.reduce((sum, customer) => sum + customer.receivable, 0);
  elements.customerSummaryText.textContent = customers.length
    ? `${formatNumber(customers.length)} харилцагч · ${formatMoney(totalReceivable)} ₮ авлага`
    : "Харилцагч алга байна.";

  if (!customers.length) {
    elements.customerTableBody.innerHTML = '<tr class="empty-state"><td colspan="5">Борлуулалтын мөрөөс харилцагчийн бүртгэл автоматаар үүснэ.</td></tr>';
    return;
  }

  elements.customerTableBody.innerHTML = customers
    .map(
      (customer) => `
        <tr>
          <td>${escapeHtml(customer.name)}</td>
          <td class="money-cell">${formatMoney(customer.total)}</td>
          <td class="money-cell">${formatMoney(customer.paid)}</td>
          <td class="money-cell">${formatMoney(customer.receivable)}</td>
          <td>${escapeHtml(customer.latestDate || "—")}</td>
        </tr>
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

function renderOverviewNotes() {
  const product = getActiveProduct();
  if (!product || state.role === "guest") {
    elements.stockSummaryText.textContent = "Импорт бүртгэгдмэгц нийт нөөц, ашиглагдсан тоо, үлдэгдэл энд харагдана.";
    elements.stockFormulaValue.textContent = "0 ш";
    elements.stockFormulaText.textContent = "Үлдэгдэл = Нийт импорт - Борлуулсан - Гэмтэл";
    elements.latestImportValue.textContent = "—";
    elements.latestImportText.textContent = "Импортын эхний batch бүртгэгдээгүй байна.";
    elements.moneySummaryText.textContent = "Нийт дүн, төлсөн, авлагын тооцоо борлуулалтын мөр бүрээс автоматаар гарна.";
    elements.cashFormulaValue.textContent = "0 ₮";
    elements.cashFormulaText.textContent = "Авлага = Нийт дүн - Төлсөн";
    elements.latestSaleValue.textContent = "—";
    elements.latestSaleText.textContent = "Борлуулалтын мөр ороогүй байна.";
    return;
  }

  const stats = getInventoryStats(product.id);
  const batches = getImportBatchesForProduct(product.id);
  const entries = getEntriesForProduct(product.id);
  const latestImport = batches[0] || null;
  const latestSale = entries[entries.length - 1] || null;

  elements.stockSummaryText.textContent = `${formatNumber(stats.batchCount)} batch • ${formatNumber(
    stats.importedCrates,
  )} авдар • ${formatNumber(stats.remainingPieces)} ширхэг үлдэгдэлтэй байна.`;
  elements.stockFormulaValue.textContent = `${formatNumber(stats.remainingPieces)} ш`;
  elements.stockFormulaText.textContent = `${formatNumber(stats.importedPieces)} импорт - ${formatNumber(
    stats.soldPieces,
  )} борлуулалт - ${formatNumber(stats.damagedPieces)} гэмтэл`;

  if (latestImport) {
    elements.latestImportValue.textContent = latestImport.date;
    elements.latestImportText.textContent = `${formatNumber(latestImport.crates)} авдар • ${formatNumber(
      latestImport.totalPieces,
    )} ширхэг • ${formatMoney(getImportBatchTotalCost(latestImport))} ₮`;
  } else {
    elements.latestImportValue.textContent = "—";
    elements.latestImportText.textContent = "Импортын эхний batch бүртгэгдээгүй байна.";
  }

  if (isAdmin()) {
    elements.moneySummaryText.textContent = `${formatNumber(entries.length)} борлуулалтын мөр • ${formatMoney(
      stats.collected,
    )} ₮ төлөгдсөн • ${formatMoney(stats.receivable)} ₮ нээлттэй авлагатай байна.`;
    elements.cashFormulaText.textContent = `${formatMoney(stats.billed)} нийт дүн - ${formatMoney(stats.collected)} төлсөн`;
  } else {
    elements.moneySummaryText.textContent = `${formatNumber(entries.length)} борлуулалтын мөр • ${formatMoney(
      stats.receivable,
    )} ₮ нээлттэй авлагатай байна.`;
    elements.cashFormulaText.textContent = "Нээлттэй төлбөртэй мөрүүдийн үлдэгдэл дүн";
  }

  elements.cashFormulaValue.textContent = `${formatMoney(stats.receivable)} ₮`;

  if (latestSale) {
    elements.latestSaleValue.textContent = latestSale.date;
    elements.latestSaleText.textContent = isAdmin()
      ? `${latestSale.customer} • ${formatNumber(latestSale.quantity)} ш • ${formatMoney(latestSale.totalAmount)} ₮`
      : `${latestSale.customer} • ${formatNumber(latestSale.quantity)} ш`;
  } else {
    elements.latestSaleValue.textContent = "—";
    elements.latestSaleText.textContent = "Борлуулалтын мөр ороогүй байна.";
  }
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

function renderProfitSnapshot() {
  const showSnapshot = isAdmin();
  elements.profitSnapshotCard.hidden = !showSnapshot;

  if (!showSnapshot) {
    return;
  }

  const product = getActiveProduct();
  const summary = product ? getProfitSummary(product.id) : buildEmptyProfitSummary();
  const progress = Math.min(Math.max(summary.marginPercent, 0), 100);

  elements.profitSnapshotValue.textContent = `${formatMoney(summary.netProfit)} ₮`;
  elements.profitSnapshotValue.style.color = summary.netProfit < 0 ? "var(--danger)" : "var(--accent)";
  elements.profitSnapshotFill.style.width = `${progress}%`;
  elements.profitSnapshotFill.style.background =
    summary.netProfit < 0
      ? "linear-gradient(90deg, var(--danger), var(--warning))"
      : "linear-gradient(90deg, var(--warm), var(--accent))";

  if (!summary.totalImportedPieces && !summary.totalImportCost) {
    elements.profitSnapshotText.textContent =
      "Импортын өртөг бүртгэгдээгүй байна. Эхлээд import batch оруулж 1 ширхэгийн өртгөө тогтооно.";
    return;
  }

  elements.profitSnapshotText.textContent = `1 ш өртөг ${formatMoney(summary.pieceCost)} ₮ • борлуулсан өртөг ${formatMoney(
    summary.soldCost,
  )} ₮ • цэвэр ашиг ${formatMoney(summary.netProfit)} ₮`;
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
  populateInvoiceSettingsForm();

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
  elements.salaryExpenseValue.textContent = `${formatMoney(state.businessSummary?.salaryExpense || 0)} ₮`;
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
    )} ₮ гэмтлийн өртөг хасагдаж, энэ төрлийн ашиг ${formatMoney(summary.netProfit)} ₮ болж байна. Цалин нийт бизнесийн ашиг дээр тусдаа хасагдана.`;
  } else if (summary.netProfit >= 0) {
    elements.profitHint.textContent = `Одоогийн борлуулалтаар энэ төрөл ${formatMoney(summary.netProfit)} ₮ ашигтай байна. Цалин бүх төрөлд хамаарах ерөнхий зардал тул dashboard дээр нийт ашиг дээрээс хасагдана. Үлдэгдэл нөөцийн өртөг ${formatMoney(
      summary.remainingCost,
    )} ₮ гэж тооцогдож байна.`;
  } else {
    elements.profitHint.textContent = `Одоогийн борлуулалтаар энэ төрөл ${formatMoney(Math.abs(summary.netProfit))} ₮ алдагдалтай байна. Импортын өртөг болон борлуулалтын үнээ шалгана уу.`;
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
    renderEntryCards([]);
    return;
  }

  if (state.role === "guest") {
    elements.entryTableBody.innerHTML =
      '<tr class="empty-state"><td colspan="13">Өгөгдөл харахын тулд нэвтэрнэ үү.</td></tr>';
    renderEntryCards([]);
    return;
  }

  const productEntries = getEntriesForProduct(product.id);
  if (!productEntries.length) {
    elements.entryTableBody.innerHTML = `<tr class="empty-state"><td colspan="${visibleColumnCount}">${
      canCreateSalesEntry() ? "Борлуулалтын мөр алга байна. Шинэ мөр нэмээд эхэлнэ үү." : "Одоогоор борлуулалтын бүртгэл алга байна."
    }</td></tr>`;
    renderEntryCards([]);
    return;
  }

  renderEntryCards(productEntries);

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

function renderEntryCards(entries) {
  if (!elements.entryCardList) {
    return;
  }

  if (state.role === "guest") {
    elements.entryCardList.innerHTML = "";
    return;
  }

  if (!entries.length) {
    elements.entryCardList.innerHTML = `<article class="entry-mobile-card empty-card">${
      canCreateSalesEntry() ? "Шинэ борлуулалт нэмээд эхэлнэ үү." : "Одоогоор борлуулалтын бүртгэл алга байна."
    }</article>`;
    return;
  }

  elements.entryCardList.innerHTML = entries
    .map((entry, index) => {
      const receivableAmount = getEntryReceivableAmount(entry);
      const paidAmount = getEntryPaidAmount(entry);
      const actionCell = isAdmin()
        ? `<button class="inline-button" type="button" data-action="edit-entry" data-entry-id="${entry.id}">Засах</button>`
        : "";

      return `
        <article class="entry-mobile-card">
          <div class="entry-card-top">
            <strong>${index + 1}. ${escapeHtml(entry.customer)}</strong>
            <span>${escapeHtml(entry.date)}</span>
          </div>
          <div class="entry-card-grid">
            <div><span>Тоо</span><strong>${formatNumber(entry.quantity)} ш</strong></div>
            <div><span>Нэгж үнэ</span><strong>${formatMoney(entry.unitPrice)} ₮</strong></div>
            <div><span>Авлага</span><strong class="${receivableAmount <= 0 ? "success-text" : "warning-text"}">${formatMoney(receivableAmount)} ₮</strong></div>
            ${
              isManager()
                ? ""
                : `<div><span>Төлсөн</span><strong>${formatMoney(paidAmount)} ₮</strong></div>`
            }
          </div>
          <div class="entry-card-foot">
            <span>${escapeHtml(entry.crateLabel || "Авдаргүй")}</span>
            ${actionCell}
          </div>
        </article>
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

function getDateFromInput(value) {
  const [year, month, day] = String(value || "").split("-").map((part) => Number.parseInt(part, 10));
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function getDaysBetween(startDateText, endDateText) {
  const start = getDateFromInput(startDateText);
  const end = getDateFromInput(endDateText);
  if (!start || !end) {
    return 0;
  }

  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86400000));
}

function isDateInDashboardPeriod(dateText, periodKey, todayText) {
  const date = getDateFromInput(dateText);
  const today = getDateFromInput(todayText);
  if (!date || !today) {
    return false;
  }

  const diffDays = Math.floor((today.getTime() - date.getTime()) / 86400000);
  if (periodKey === "today") {
    return diffDays === 0;
  }
  if (periodKey === "week") {
    return diffDays >= 0 && diffDays <= 6;
  }
  if (periodKey === "month") {
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
  }
  if (periodKey === "year") {
    return date.getFullYear() === today.getFullYear();
  }

  return false;
}

function createEmptyPeriodMetric() {
  return {
    sales: 0,
    salesCount: 0,
    collected: 0,
    paymentCount: 0,
    damagedPieces: 0,
    damageCost: 0,
  };
}

function getDashboardPeriodLabel(periodKey) {
  const labels = {
    today: "Өнөөдрийн",
    week: "7 хоногийн",
    month: "Энэ сарын",
    year: "Энэ жилийн",
  };

  return labels[periodKey] || labels.today;
}

function getReceivableAgeLabel(ageDays) {
  if (ageDays <= 7) {
    return "0-7 хоног";
  }
  if (ageDays <= 30) {
    return "8-30 хоног";
  }
  return "31+ хоног";
}

function buildDashboardMetrics() {
  const today = getTodayDateValue();
  const periodKeys = ["today", "week", "month", "year"];
  const periods = Object.fromEntries(periodKeys.map((key) => [key, createEmptyPeriodMetric()]));
  const receivableMap = new Map();
  const customerMap = new Map();
  const stockAlerts = [];
  const aging = { current: 0, mid: 0, old: 0 };
  const damageByProduct = new Map();
  let receivableTotal = 0;
  let receivableEntryCount = 0;
  let remainingPieces = 0;
  let remainingCost = 0;

  for (const entry of state.entries) {
    const totalAmount = Number(entry.totalAmount || 0);
    const paidAmount = getEntryPaidAmount(entry);
    const customerName = entry.customer || "Нэргүй харилцагч";
    const customerProfile = customerMap.get(customerName) || {
      name: customerName,
      total: 0,
      paid: 0,
      receivable: 0,
      latestDate: entry.date || "",
    };
    customerProfile.total += totalAmount;
    customerProfile.paid += paidAmount;
    customerProfile.receivable += Math.max(0, totalAmount - paidAmount);
    customerProfile.latestDate = String(entry.date || "").localeCompare(customerProfile.latestDate) > 0 ? entry.date : customerProfile.latestDate;
    customerMap.set(customerName, customerProfile);

    for (const periodKey of periodKeys) {
      if (isDateInDashboardPeriod(entry.date, periodKey, today)) {
        periods[periodKey].sales += totalAmount;
        periods[periodKey].salesCount += 1;
      }
    }

    const receivable = getEntryReceivableAmount(entry);
    if (receivable > 0.009) {
      const ageDays = getDaysBetween(entry.date, today);
      receivableTotal += receivable;
      receivableEntryCount += 1;
      if (ageDays <= 7) {
        aging.current += receivable;
      } else if (ageDays <= 30) {
        aging.mid += receivable;
      } else {
        aging.old += receivable;
      }

      const customer = entry.customer || "Нэргүй харилцагч";
      const existing = receivableMap.get(customer) || {
        customer,
        amount: 0,
        count: 0,
        latestDate: entry.date || "",
        maxAgeDays: 0,
      };
      existing.amount += receivable;
      existing.count += 1;
      existing.latestDate = String(entry.date || "").localeCompare(existing.latestDate) > 0 ? entry.date : existing.latestDate;
      existing.maxAgeDays = Math.max(existing.maxAgeDays, ageDays);
      receivableMap.set(customer, existing);
    }

    for (const payment of getEntryPayments(entry)) {
      for (const periodKey of periodKeys) {
        if (isDateInDashboardPeriod(payment.date || entry.date, periodKey, today)) {
          periods[periodKey].collected += Number(payment.amount || 0);
          periods[periodKey].paymentCount += 1;
        }
      }
    }
  }

  for (const product of state.products) {
    const stats = getInventoryStats(product.id);
    const summary = getProfitSummary(product.id);
    const threshold = Math.max(Number(product.defaultPiecesPerCrate || 0), 1);
    remainingPieces += Number(stats.remainingPieces || 0);
    remainingCost += Number(summary.remainingCost || 0);

    if (stats.importedPieces > 0 && stats.remainingPieces <= threshold) {
      stockAlerts.push({
        productName: product.name,
        remainingPieces: stats.remainingPieces,
        threshold,
      });
    }
  }

  for (const record of state.damageRecords) {
    const product = state.products.find((item) => item.id === record.productId);
    const productName = product?.name || record.productId || "Тодорхойгүй төрөл";
    const currentDamage = damageByProduct.get(productName) || 0;
    damageByProduct.set(productName, currentDamage + Number(record.quantity || 0));

    const summary = getProfitSummary(record.productId);
    const damageCostPerPiece = Number(summary.pieceCost || 0);
    for (const periodKey of periodKeys) {
      if (isDateInDashboardPeriod(record.date, periodKey, today)) {
        periods[periodKey].damagedPieces += Number(record.quantity || 0);
        periods[periodKey].damageCost += Number(record.quantity || 0) * damageCostPerPiece;
      }
    }
  }

  const receivables = [...receivableMap.values()]
    .map((item) => ({ ...item, amount: Number(item.amount.toFixed(2)) }))
    .sort((left, right) => right.amount - left.amount || right.latestDate.localeCompare(left.latestDate));
  const customers = [...customerMap.values()]
    .map((item) => ({
      ...item,
      total: Number(item.total.toFixed(2)),
      paid: Number(item.paid.toFixed(2)),
      receivable: Number(item.receivable.toFixed(2)),
    }))
    .sort((left, right) => right.receivable - left.receivable || right.latestDate.localeCompare(left.latestDate));

  stockAlerts.sort((left, right) => left.remainingPieces - right.remainingPieces || left.productName.localeCompare(right.productName));
  const oldReceivables = receivables.filter((item) => item.maxAgeDays > 30);
  const highDamageItems = [...damageByProduct.entries()]
    .filter(([, quantity]) => quantity >= 10)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3);
  const attentionItems = [
    ...stockAlerts.map((alert) => ({
      level: alert.remainingPieces <= 0 ? "danger" : "warning",
      title: alert.productName,
      detail: `${formatNumber(alert.remainingPieces)} ширхэг үлдсэн • босго ${formatNumber(alert.threshold)} ширхэг`,
    })),
    ...oldReceivables.slice(0, 3).map((item) => ({
      level: "danger",
      title: `${item.customer} авлага`,
      detail: `${formatMoney(item.amount)} ₮ • ${getReceivableAgeLabel(item.maxAgeDays)}`,
    })),
    ...highDamageItems.map(([productName, quantity]) => ({
      level: "warning",
      title: `${productName} гэмтэл өндөр`,
      detail: `${formatNumber(quantity)} ширхэг нийт гэмтэл бүртгэгдсэн`,
    })),
  ].slice(0, 8);

  for (const period of Object.values(periods)) {
    period.sales = Number(period.sales.toFixed(2));
    period.collected = Number(period.collected.toFixed(2));
    period.damageCost = Number(period.damageCost.toFixed(2));
  }

  return {
    periods,
    receivableTotal: Number(receivableTotal.toFixed(2)),
    receivableEntryCount,
    receivables,
    customers,
    aging: {
      current: Number(aging.current.toFixed(2)),
      mid: Number(aging.mid.toFixed(2)),
      old: Number(aging.old.toFixed(2)),
    },
    stockAlerts,
    attentionItems,
    remainingPieces,
    remainingCost: Number(remainingCost.toFixed(2)),
    grossProfit: Number(state.businessSummary?.grossProfit || 0),
    salaryExpense: Number(state.businessSummary?.salaryExpense || 0),
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

function populateInvoiceSettingsForm() {
  if (!elements.invoiceSettingsForm) {
    return;
  }

  const settings = state.invoiceSettings || {};
  elements.invoiceCompanyNameInput.value = settings.companyName || "";
  elements.invoicePhoneInput.value = settings.phone || "";
  elements.invoiceBankNameInput.value = settings.bankName || "";
  elements.invoiceBankAccountInput.value = settings.bankAccount || "";
  elements.invoiceLogoTextInput.value = settings.logoText || "";
  elements.invoiceQrTextInput.value = settings.qrText || "";
  elements.invoiceFooterNoteInput.value = settings.footerNote || "";
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

function handleDashboardPeriodClick(event) {
  const button = event.target.closest("[data-dashboard-period]");
  if (!button) {
    return;
  }

  state.dashboardPeriod = button.dataset.dashboardPeriod || "today";
  renderDashboard();
}

function handleSellerStockPillClick(event) {
  const button = event.target.closest("[data-product-id]");
  if (!button) {
    return;
  }

  state.activeProductId = button.dataset.productId;
  render();
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

async function handleInvoiceSettingsSubmit(event) {
  event.preventDefault();
  setInlineMessage(elements.invoiceSettingsMessage, "", false);

  const payload = {
    companyName: elements.invoiceCompanyNameInput.value.trim(),
    phone: elements.invoicePhoneInput.value.trim(),
    bankName: elements.invoiceBankNameInput.value.trim(),
    bankAccount: elements.invoiceBankAccountInput.value.trim(),
    logoText: elements.invoiceLogoTextInput.value.trim(),
    qrText: elements.invoiceQrTextInput.value.trim(),
    footerNote: elements.invoiceFooterNoteInput.value.trim(),
  };

  try {
    const payloadResponse = await apiFetch("/api/invoice-settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    applyBootstrapPayload(payloadResponse);
    setInlineMessage(elements.invoiceSettingsMessage, "Баримтын тохиргоо хадгалагдлаа.", false, true);
  } catch (error) {
    setInlineMessage(elements.invoiceSettingsMessage, error.message, true);
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

