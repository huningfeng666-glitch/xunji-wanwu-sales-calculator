window.ProductProvider = (function createProductProvider() {
  const STORAGE_PRODUCTS = "xj-sales-calculator-products-v1";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readSavedProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_PRODUCTS);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const products = Array.isArray(parsed) ? parsed : parsed.products;
      return Array.isArray(products) && products.length ? clone(products) : null;
    } catch (error) {
      console.warn("ProductProvider.fetchProducts 读取本地产品失败，已使用默认产品库。", error);
      return null;
    }
  }

  function fallbackProducts() {
    return clone((window.DEFAULT_DATA && window.DEFAULT_DATA.products) || []);
  }

  function fetchProducts() {
    return readSavedProducts() || fallbackProducts();
  }

  function saveAllProducts(products) {
    const nextProducts = clone(Array.isArray(products) ? products : []);
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(nextProducts));
    return nextProducts;
  }

  function saveProduct(product, previousId) {
    const nextProduct = clone(product);
    const products = fetchProducts();
    const targetId = previousId || nextProduct.id;
    const existingIndex = products.findIndex((item) => item.id === targetId);
    if (existingIndex >= 0) {
      products[existingIndex] = nextProduct;
    } else {
      products.push(nextProduct);
    }
    saveAllProducts(products);
    return nextProduct;
  }

  function deleteProductById(productId) {
    const products = fetchProducts().filter((product) => product.id !== productId);
    return saveAllProducts(products);
  }

  function syncFromFeishu() {
    console.warn("ProductProvider.syncFromFeishu 预留接口，尚未实现。");
    return fetchProducts();
  }

  function setDataSource() {
    console.warn("ProductProvider.setDataSource 预留接口，尚未实现。");
  }

  return {
    fetchProducts,
    saveProduct,
    deleteProductById,
    saveAllProducts,
    syncFromFeishu,
    setDataSource
  };
})();

(function runSalesCalculator() {
  const STORAGE_RULES = "xj-sales-calculator-rules-v1";
  const STORAGE_RULES_BACKUPS = "xj-sales-calculator-rules-backups-v1";
  const STORAGE_STATE = "xj-sales-calculator-state-v1";
  const STORAGE_RECORDS = "xj-sales-calculator-records-v1";
  const STORAGE_SCENIC_SPOTS = "xj-sales-calculator-scenic-spots-v1";
  const STORAGE_FULFILLMENT = "xj-sales-calculator-fulfillment-v1";
  const STORAGE_UI_LAYOUT = "xj-sales-calculator-ui-layout-v1";
  const STORAGE_UI_LAYOUT_BACKUPS = "xj-sales-calculator-ui-layout-backups-v1";
  const STORAGE_ACCOUNT_SESSION = "xj-sales-calculator-account-session-v1";
  const STORAGE_ACCOUNTS = "xj-sales-calculator-accounts-v1";
  const STORAGE_ACCOUNT_SEED_VERSION = "xj-sales-calculator-account-seed-version-v1";
  const STORAGE_CRM_WORKSPACE = "xj-sales-calculator-crm-workspace-v1";
  const STORAGE_CRM_ACTIVITY = "xj-sales-calculator-crm-activity-v1";
  const WORKSPACE_BACKUP_VERSION = "xj-sales-workspace-backup-v1";
  const latestStageWeights = { T0: 50, T1: 45, T2: 5 };
  const RULE_BACKUP_LIMIT = 20;
  const UI_LAYOUT_BACKUP_LIMIT = 20;
  let lastPersistedRulesSnapshot = null;
  let lastPersistedUiLayoutSnapshot = null;
  const permissionActions = [
    { key: "view", label: "查看" },
    { key: "edit", label: "编辑" },
    { key: "approve", label: "审批" },
    { key: "admin", label: "管理" }
  ];
  const permissionModules = [
    { key: "crm", label: "销售CRM", detail: "客户、机会、订单与门店销售总览" },
    { key: "accounts", label: "账号管理", detail: "账号、角色和权限配置" },
    { key: "customers", label: "客户客资", detail: "客户资料、联系人和来源" },
    { key: "opportunities", label: "点位机会", detail: "公海、认领、报备和商务推进" },
    { key: "contracts", label: "合同", detail: "合同制作、审核、签约归档" },
    { key: "orders", label: "订单/MES", detail: "采购、打样、生产、出库" },
    { key: "fulfillment", label: "发货落地", detail: "发货、签收、上架和异常" },
    { key: "storeSales", label: "门店销售", detail: "回款、动销、补货和复盘" },
    { key: "rules", label: "规则参数", detail: "评级、提成、采购和价带规则" }
  ];
  const rolePermissionMatrix = {
    管理员: {
      crm: ["view", "edit", "approve", "admin"],
      accounts: ["view", "edit", "approve", "admin"],
      customers: ["view", "edit", "approve", "admin"],
      opportunities: ["view", "edit", "approve", "admin"],
      contracts: ["view", "edit", "approve", "admin"],
      orders: ["view", "edit", "approve", "admin"],
      fulfillment: ["view", "edit", "approve", "admin"],
      storeSales: ["view", "edit", "approve", "admin"],
      rules: ["view", "edit", "approve", "admin"]
    },
    销售主管: {
      crm: ["view", "edit", "approve"],
      accounts: ["view"],
      customers: ["view", "edit", "approve"],
      opportunities: ["view", "edit", "approve"],
      contracts: ["view", "edit", "approve"],
      orders: ["view", "edit", "approve"],
      fulfillment: ["view", "edit"],
      storeSales: ["view", "edit"],
      rules: ["view"]
    },
    销售: {
      crm: ["view", "edit"],
      accounts: [],
      customers: ["view", "edit"],
      opportunities: ["view", "edit"],
      contracts: ["view", "edit"],
      orders: ["view", "edit"],
      fulfillment: ["view", "edit"],
      storeSales: ["view", "edit"],
      rules: ["view"]
    },
    渠道: {
      crm: ["view", "edit"],
      accounts: [],
      customers: ["view", "edit"],
      opportunities: ["view", "edit"],
      contracts: ["view"],
      orders: ["view"],
      fulfillment: ["view"],
      storeSales: ["view", "edit"],
      rules: []
    },
    运营: {
      crm: ["view", "edit"],
      accounts: ["view"],
      customers: ["view"],
      opportunities: ["view"],
      contracts: ["view"],
      orders: ["view", "edit"],
      fulfillment: ["view", "edit", "approve"],
      storeSales: ["view", "edit"],
      rules: ["view"]
    }
  };
  const ACCOUNT_SEED_VERSION = "20260707-initial-accounts-v2";
  const defaultRolePasswords = {
    管理员: "XJadmin2026!",
    销售: "XJsales2026!",
    渠道: "XJchannel2026!",
    销售主管: "XJmanager2026!",
    运营: "XJops2026!"
  };
  const defaultAccounts = [
    { id: "admin", loginName: "admin", password: defaultRolePasswords["管理员"], name: "管理员", role: "管理员", team: "经营管理", dataScope: "all", status: "启用", phone: "", note: "初始管理员账号，可管理账号、规则和全量数据", permissions: permissionsForRole("管理员") },
    { id: "sales", loginName: "sales", password: defaultRolePasswords["销售"], name: "销售账号", role: "销售", team: "销售一组", dataScope: "self", status: "启用", phone: "", note: "初始销售账号，用于点位填报、评级测算和机会跟进", permissions: permissionsForRole("销售") },
    { id: "channel", loginName: "channel", password: defaultRolePasswords["渠道"], name: "渠道账号", role: "渠道", team: "渠道伙伴", dataScope: "self", status: "启用", phone: "", note: "初始渠道账号，用于渠道线索、客户和动销回填", permissions: permissionsForRole("渠道") }
  ];
  const accountRoleList = ["销售", "渠道", "销售主管", "运营", "管理员"];
  const ACCOUNT_LOCK_THRESHOLD = 5;
  const ACCOUNT_LOCK_MINUTES = 15;
  const PASSWORD_MIN_LENGTH = 8;
  const accountDataScopeOptions = [
    { value: "self", label: "本人数据", detail: "只看本人负责或未分配的数据" },
    { value: "team", label: "团队数据", detail: "看本人团队及本人负责的数据" },
    { value: "all", label: "全部数据", detail: "看全工作台数据" }
  ];
  const accountRolePolicyDescriptions = {
    销售: "负责自己点位的客户、评级、合同、订单、发货和门店销售跟进，可看规则不可改规则。",
    渠道: "外部渠道聚焦线索、客户和动销回填，合同、订单、发货默认只读。",
    销售主管: "查看团队漏斗，审批报备、合同和订单关键节点，不直接管理账号。",
    运营: "承接订单/MES、发货落地和动销数据，对销售机会与合同以查看为主。",
    管理员: "拥有账号、权限、规则和全链路数据管理权限，用于系统配置和兜底治理。"
  };

  const defaultUiLayout = {
    density: "compact",
    scenarioLayout: "normal",
    topAreaSize: "normal",
    summaryCardSize: "normal",
    subtabSize: "normal",
    showStickySummary: true,
    showResultsPanel: true,
    showScoreBreakdown: true,
    showRiskPanel: true,
    mainViewOrder: ["crm", "records", "scenario", "scenic-db", "fulfillment", "products", "pricing", "cost", "settings", "accounts"],
    panelOrder: {
      cost: ["product", "cost", "result"],
      pricing: ["channel", "result"],
      commission: ["channel", "result"]
    },
    scenarioSectionOrder: ["basic", "t0", "t1", "t2", "veto", "save"],
    texts: {
      appTitle: "寻迹万物销售测算台",
      appSubtitle: "销售经营 · 点位评级 · 商品价格 · 履约动销 · 系统管理 · 账号管理",
      topSave: "保存测算",
      uiEdit: "编辑UI",
      mainTabCrm: "管理驾驶舱",
      mainTabScenario: "场景评级",
      mainTabScenicDb: "景区库",
      mainTabCost: "成本库",
      mainTabPricing: "定价测算",
      mainTabRecords: "点位机会",
      mainTabFulfillment: "点位落地",
      mainTabProducts: "产品库",
      mainTabSettings: "规则参数",
      mainTabAccounts: "账号管理",
      mobileTabCrm: "经营",
      mobileTabScenario: "评级",
      mobileTabScenicDb: "景区",
      mobileTabCost: "成本库",
      mobileTabPricing: "定价",
      mobileTabRecords: "机会",
      mobileTabFulfillment: "落地",
      mobileTabProducts: "商品",
      mobileTabSettings: "管理",
      mobileTabAccounts: "账号",
      panelCrm: "销售CRM全链路",
      scenarioInfoTab: "景区信息",
      businessTab: "商务条件",
      commissionTab: "模拟提成奖金",
      historyTab: "历史测算",
      panelScenarioParams: "景区参数",
      panelScenarioResults: "评级结果",
      panelBusinessGuidance: "指导商务条件",
      panelScenarioChannel: "实际/拟谈商务条件",
      panelScenarioCommission: "模拟提成奖金",
      panelScenarioHistory: "历史测算",
      panelScenicDb: "景区基础库",
      scenicDbHeadTitle: "全国景区公开基础库",
      scenicDbHeadIntro: "底库按父级景区与子级片区/点位管理；父级做目的地线索，正式测算优先选择子级经营场景。",
      scenicDbCountNote: "当前底库用于销售检索和公开适配初筛；父级客流不得直接继承到子级片区，2025客流未核样本需进入商务前替换为官方或运营方口径。",
      panelProductChoice: "产品选择",
      panelCostComponents: "成本组件",
      panelCostResults: "结果",
      panelPricingChannel: "渠道参数",
      panelPricingResults: "定价结果",
      panelRecords: "点位机会",
      panelFulfillment: "点位落地",
      fulfillmentHeadTitle: "已签点位落地同步台账",
      fulfillmentHeadIntro: "来源为库管供应组飞书归档；库管证据只读，销售补录上架、动销和现场问题。",
      panelProducts: "产品库",
      panelSettings: "规则参数",
      panelAccounts: "账号管理",
      crmHeadTitle: "销售全链路CRM工作台",
      crmHeadIntro: "从客户客资、场景评级、机会跟进、合同制作、订单/MES、发货落地到门店销售数据，沉淀为同一条销售链路。",
      stickyGradeLabel: "当前评级",
      stickyScoreLabel: "T0/T1/T2",
      stickyBusinessLabel: "指导商务条件",
      stickyCommissionLabel: "模拟提成"
    }
  };

  const mainViewMeta = {
    crm: { textKey: "mainTabCrm", mobileTextKey: "mobileTabCrm", fallback: "管理驾驶舱" },
    scenario: { textKey: "mainTabScenario", mobileTextKey: "mobileTabScenario", fallback: "场景评级" },
    "scenic-db": { textKey: "mainTabScenicDb", mobileTextKey: "mobileTabScenicDb", fallback: "景区库" },
    cost: { textKey: "mainTabCost", mobileTextKey: "mobileTabCost", fallback: "成本库" },
    pricing: { textKey: "mainTabPricing", mobileTextKey: "mobileTabPricing", fallback: "定价测算" },
    records: { textKey: "mainTabRecords", mobileTextKey: "mobileTabRecords", fallback: "点位机会" },
    fulfillment: { textKey: "mainTabFulfillment", mobileTextKey: "mobileTabFulfillment", fallback: "点位落地" },
    products: { textKey: "mainTabProducts", mobileTextKey: "mobileTabProducts", fallback: "产品库" },
    settings: { textKey: "mainTabSettings", mobileTextKey: "mobileTabSettings", fallback: "规则参数" },
    accounts: { textKey: "mainTabAccounts", mobileTextKey: "mobileTabAccounts", fallback: "账号管理" }
  };
  const crmPanelMeta = {
    dashboard: { label: "管理驾驶舱", detail: "全链路风险、漏斗、经营简报和点位闭环" },
    customers: { label: "客户客资", detail: "客户资料、联系人、来源、负责人和跟进排期", collection: "customers" },
    contracts: { label: "合同管理", detail: "合同制作、审核、签约归档、应收回款和合同草稿", collection: "contracts" },
    orders: { label: "订单/MES", detail: "采购、打样、生产、质检、出库和发货落地", collection: "orders" },
    storeSales: { label: "门店销售", detail: "销售额、回款、动销率、复盘和补货订单", collection: "storeSales" }
  };
  const viewPermissionRules = {
    crm: [{ module: "crm" }],
    scenario: [{ module: "opportunities" }, { module: "crm" }],
    "scenic-db": [{ module: "opportunities" }, { module: "crm" }],
    records: [{ module: "opportunities" }],
    fulfillment: [{ module: "fulfillment" }],
    products: [{ module: "crm" }, { module: "rules" }],
    pricing: [{ module: "crm" }, { module: "rules" }],
    cost: [{ module: "rules" }],
    settings: [{ module: "rules" }],
    accounts: [{ module: "accounts" }]
  };
  const loggedOutVisibleViews = ["scenario", "scenic-db"];

  const panelOrderMeta = {
    cost: {
      title: "成本测算模块顺序",
      items: {
        product: { textKey: "panelProductChoice", fallback: "产品选择" },
        cost: { textKey: "panelCostComponents", fallback: "成本组件" },
        result: { textKey: "panelCostResults", fallback: "结果" }
      }
    },
    pricing: {
      title: "定价测算模块顺序",
      items: {
        channel: { textKey: "panelPricingChannel", fallback: "渠道参数" },
        result: { textKey: "panelPricingResults", fallback: "定价结果" }
      }
    },
    commission: {
      title: "模拟提成模块顺序",
      items: {
        channel: { textKey: "panelScenarioChannel", fallback: "实际/拟谈商务条件" },
        result: { textKey: "panelScenarioCommission", fallback: "模拟提成奖金" }
      }
    }
  };

  const sectionMeta = {
    price: {
      index: "01",
      title: "基础",
      label: "成本与价带",
      detail: "管理保留、成本价带、场景建议价",
      groups: ["基础参数", "成本价带", "场景价带"]
    },
    grade: {
      index: "02",
      title: "评级",
      label: "S/A/B/C/D",
      detail: "等级阈值、扣点、计售比、铺货、商务指导",
      groups: ["等级硬参数", "商务指导"]
    },
    scoring: {
      index: "03",
      title: "评分",
      label: "T0/T1/T2/红线",
      detail: "文化客群、商业转化、官方资源、红线否决",
      groups: ["T0适配", "T1转化", "T2资源", "红线"]
    },
    purchase: {
      index: "04",
      title: "采购",
      label: "采购/寄售政策",
      detail: "单款数量折扣、总采政策、标准采购边界",
      groups: ["单款阶梯", "总采政策"]
    },
    commission: {
      index: "05",
      title: "提成",
      label: "提成/回款/风控",
      detail: "寄售回款、商务提升、采购阶梯、拓展奖金、回款风控",
      groups: ["寄售提成", "采购阶梯", "拓展奖金", "回款风控"]
    },
    sellThrough: {
      index: "06",
      title: "动销",
      label: "动销评级",
      detail: "寄售动销激励、售罄率评级、复盘动作",
      groups: ["寄售激励", "动销评级"]
    }
  };

  const tenPointScoringKeys = [
    "scenicType", "tileRelevance", "commemorationMind", "youngSpread", "culturalEndorsement",
    "visitors", "ticket", "location", "store", "display", "businessTerms", "cooperationEfficiency",
    "officialCooperation", "coBrandAuth", "marketingResources", "decorationResources", "manpowerResources", "officialTrafficResources"
  ];

  const scenicVerificationData = window.SCENIC_VERIFICATION_DATA || { meta: {}, spots: {} };
  const fulfillmentGeneratedData = window.FULFILLMENT_DATA || { meta: {}, records: [] };
  let data = XJCore.clone(window.DEFAULT_DATA);
  const savedRules = loadJson(STORAGE_RULES);
  if (savedRules && (!savedRules.scoring || savedRules.scoring.officialCooperation)) {
    data.rules = mergeRules(data.rules, savedRules);
  }
  data.rules = applyRuleMigrations(data.rules, savedRules);
  lastPersistedRulesSnapshot = XJCore.clone(data.rules);
  data.products = normalizeProducts(window.ProductProvider.fetchProducts());
  data.scenicSpots = applyScenicDataMigrations(normalizeScenicSpots(loadJson(STORAGE_SCENIC_SPOTS) || data.scenicSpots || []));
  data.fulfillmentRecords = mergeFulfillmentSalesFields(
    normalizeFulfillmentRecords(defaultFulfillmentRecords()),
    normalizeFulfillmentRecords(loadJson(STORAGE_FULFILLMENT) || [])
  );

  let state = loadJson(STORAGE_STATE) || XJCore.clone(data.defaultInputs);
  state = normalizeState(state);
  let accounts = normalizeAccounts(loadSeededAccounts());
  let accountSession = normalizeAccountSession(loadJson(STORAGE_ACCOUNT_SESSION));
  let crmWorkspace = normalizeCrmWorkspace(loadJson(STORAGE_CRM_WORKSPACE));
  let crmActivityLog = normalizeCrmActivityLog(loadJson(STORAGE_CRM_ACTIVITY));
  let records = loadJson(STORAGE_RECORDS) || [];
  let activeRecordPanels = {};
  let activeRecordView = "pool";
  let activeView = "scenario";
  let activeScenarioPanel = "save";
  let activeProductPanel = "category";
  let activePricingMode = "consignment";
  let activeUiEditorSection = "style";
  let activeCrmPanel = "dashboard";
  let activeCrmDraftId = "";
  let activeCrmPointName = "";
  let crmSearch = "";
  let crmOwnerFilter = "";
  let crmCollectionFilter = "all";
  let crmSearchComposing = false;
  let crmSearchRenderTimer = 0;
  let activeRuleSection = (data.rules.ui.ruleOrder || Object.keys(sectionMeta))[0] || "price";
  let editingProductId = null;
  let uiEditMode = false;
  let uiEditScope = "";
  let uiLayout = normalizeUiLayout(loadJson(STORAGE_UI_LAYOUT));
  lastPersistedUiLayoutSnapshot = XJCore.clone(uiLayout);
  let scenicSearch = "";
  let scenicTypeFilter = "";
  let scenicGradeFilter = "";
  let scenicProvinceFilter = "";
  let scenicPriorityFilter = "";
  let scenicT0Filter = "";
  let scenicTileFilter = "";
  let scenicDataStatusFilter = "";
  let scenicVerificationFilter = "";
  let scenicSortMode = "scoreDesc";
  let scenicVisibleLimit = 80;
  let scenicSearchComposing = false;
  let scenicSearchRenderTimer = 0;
  let fulfillmentSearch = "";
  let fulfillmentStatusFilter = "";
  let fulfillmentTypeFilter = "";
  let fulfillmentReceiptFilter = "";
  let fulfillmentShelfFilter = "";
  let fulfillmentIssueFilter = "";
  let fulfillmentActiveId = "";
  let fulfillmentSearchComposing = false;
  let fulfillmentSearchRenderTimer = 0;
  let skuSearch = "";
  let skuCategoryFilter = "";
  let skuSeriesFilter = "";
  let skuSpecFilter = "";
  let skuTypeFilter = "";
  let skuCraftFilter = "";
  let skuRegionFilter = "";
  let skuRetailFilter = "";
  let accountLoginError = "";
  let accountPasswordPanelOpen = false;
  let accountPasswordChangeError = "";
  const skuData = window.SKU_DATA || { meta: { rowCount: 0, categoryCount: 0 }, categories: [], rows: [] };

  function loadJson(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function storageText(key) {
    try {
      return localStorage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }

  function setStorageText(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (error) {
      console.warn("写入本地账号版本失败。", error);
    }
  }

  function removeStorageItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("清理本地账号会话失败。", error);
    }
  }

  function permissionTemplate(allowed = {}) {
    return permissionModules.reduce((permissions, module) => {
      const actions = Array.isArray(allowed[module.key]) ? allowed[module.key] : [];
      permissions[module.key] = permissionActions.reduce((scope, action) => {
        scope[action.key] = actions.includes(action.key);
        return scope;
      }, {});
      return permissions;
    }, {});
  }

  function permissionsForRole(role) {
    return permissionTemplate(rolePermissionMatrix[role] || rolePermissionMatrix["销售"]);
  }

  function defaultAccountPassword(role) {
    return defaultRolePasswords[role] || defaultRolePasswords["销售"];
  }

  function accountLockUntilTime(account) {
    const locked = new Date(account && account.lockedUntil || "");
    return Number.isNaN(locked.getTime()) ? 0 : locked.getTime();
  }

  function accountIsLocked(account) {
    return accountLockUntilTime(account) > Date.now();
  }

  function accountLockLabel(account) {
    if (!accountIsLocked(account)) return "";
    return new Date(accountLockUntilTime(account)).toLocaleString("zh-CN", { hour12: false });
  }

  function passwordLooksWeak(password) {
    const text = String(password || "");
    if (text.length < PASSWORD_MIN_LENGTH) return true;
    const hasLetter = /[A-Za-z]/.test(text);
    const hasNumber = /\d/.test(text);
    const hasSymbol = /[^A-Za-z0-9]/.test(text);
    return [hasLetter, hasNumber, hasSymbol].filter(Boolean).length < 2;
  }

  function accountUsesDefaultPassword(account) {
    return String(account && account.password || "") === String(defaultAccountPassword(account && account.role));
  }

  function temporaryAccountPassword(account) {
    const seed = Math.random().toString(36).slice(2, 8).toUpperCase();
    const prefix = String(account && account.role || "XJ").slice(0, 2).toUpperCase();
    return `XJ${prefix}${seed}!`;
  }

  function accountSecurityHealth(account) {
    if (accountIsLocked(account)) return { label: "已锁定", tone: "weak", detail: `锁定至 ${accountLockLabel(account)}` };
    if (account && Number(account.failedLoginCount) > 0) return { label: "登录异常", tone: "medium", detail: `失败 ${Number(account.failedLoginCount)} 次` };
    if (account && account.mustChangePassword) return { label: "需改密", tone: "medium", detail: "下次登录后应先修改口令" };
    if (accountUsesDefaultPassword(account)) return { label: "默认口令", tone: "medium", detail: "建议管理员重置或本人修改" };
    if (passwordLooksWeak(account && account.password)) return { label: "弱口令", tone: "medium", detail: `建议至少${PASSWORD_MIN_LENGTH}位并包含字母/数字/符号` };
    return { label: "安全正常", tone: "strong", detail: account && account.passwordUpdatedAt ? `更新于 ${account.passwordUpdatedAt}` : "口令已自定义" };
  }

  function isLegacyDefaultAccountSet(input) {
    if (!Array.isArray(input) || !input.length) return false;
    const legacyIds = new Set(["admin", "manager", "sales-east", "sales-south", "channel-a", "ops"]);
    const hasOnlyLegacyAccounts = input.every((account) => {
      const id = String(account && account.id || "");
      const loginName = String(account && account.loginName || "");
      return legacyIds.has(id) || legacyIds.has(loginName);
    });
    const hasLegacyPassword = input.some((account) => ["admin123", "123456"].includes(String(account && account.password || "")));
    return hasOnlyLegacyAccounts && hasLegacyPassword;
  }

  function loadSeededAccounts() {
    const savedAccounts = loadJson(STORAGE_ACCOUNTS);
    const seedVersion = storageText(STORAGE_ACCOUNT_SEED_VERSION);
    const shouldUseDefaults = !Array.isArray(savedAccounts) || !savedAccounts.length;
    const shouldMigrateLegacyDefaults = seedVersion !== ACCOUNT_SEED_VERSION && isLegacyDefaultAccountSet(savedAccounts);
    if (shouldUseDefaults || shouldMigrateLegacyDefaults) {
      setStorageText(STORAGE_ACCOUNT_SEED_VERSION, ACCOUNT_SEED_VERSION);
      saveJson(STORAGE_ACCOUNTS, defaultAccounts);
      if (shouldMigrateLegacyDefaults) removeStorageItem(STORAGE_ACCOUNT_SESSION);
      return defaultAccounts;
    }
    if (seedVersion !== ACCOUNT_SEED_VERSION) setStorageText(STORAGE_ACCOUNT_SEED_VERSION, ACCOUNT_SEED_VERSION);
    return savedAccounts;
  }

  function normalizePermissions(input, role) {
    const defaults = permissionsForRole(role);
    const incoming = input && typeof input === "object" ? input : {};
    permissionModules.forEach((module) => {
      const value = incoming[module.key];
      if (typeof value === "boolean") {
        defaults[module.key].view = value;
        defaults[module.key].edit = defaults[module.key].edit && value;
        defaults[module.key].approve = defaults[module.key].approve && value;
        defaults[module.key].admin = defaults[module.key].admin && value;
        return;
      }
      if (value && typeof value === "object") {
        permissionActions.forEach((action) => {
          if (value[action.key] !== undefined) defaults[module.key][action.key] = Boolean(value[action.key]);
        });
      }
    });
    return defaults;
  }

  function defaultAccountDataScope(role) {
    if (role === "管理员" || role === "运营") return "all";
    if (role === "销售主管") return "team";
    return "self";
  }

  function normalizeAccountDataScope(value, role) {
    return accountDataScopeOptions.some((option) => option.value === value) ? value : defaultAccountDataScope(role);
  }

  function accountDataScopeLabel(value) {
    const option = accountDataScopeOptions.find((item) => item.value === value);
    return option ? option.label : accountDataScopeLabel(defaultAccountDataScope("销售"));
  }

  function normalizeAccountRecord(account, index = 0) {
    const raw = account && typeof account === "object" ? account : {};
    const role = accountRoleList.includes(raw.role) ? raw.role : "销售";
    const id = String(raw.id || raw.loginName || `account-${Date.now().toString(36)}-${index}`);
    return {
      id,
      loginName: String(raw.loginName || id),
      name: String(raw.name || raw.operatorName || "未命名账号"),
      role,
      team: String(raw.team || ""),
      dataScope: normalizeAccountDataScope(raw.dataScope, role),
      status: raw.status === "停用" ? "停用" : "启用",
      password: String(raw.password || defaultAccountPassword(role)),
      phone: String(raw.phone || ""),
      note: String(raw.note || ""),
      permissions: normalizePermissions(raw.permissions, role),
      failedLoginCount: Number(raw.failedLoginCount || 0),
      lockedUntil: String(raw.lockedUntil || ""),
      mustChangePassword: raw.mustChangePassword === true || raw.mustChangePassword === "true",
      passwordUpdatedAt: String(raw.passwordUpdatedAt || ""),
      lastLoginAt: String(raw.lastLoginAt || ""),
      lastLoginResult: String(raw.lastLoginResult || ""),
      createdAt: raw.createdAt || new Date().toLocaleString("zh-CN", { hour12: false }),
      updatedAt: raw.updatedAt || ""
    };
  }

  function normalizeAccounts(input) {
    const base = Array.isArray(input) && input.length ? input : defaultAccounts;
    const normalized = base.map((account, index) => normalizeAccountRecord(account, index));
    if (!normalized.some((account) => account.role === "管理员")) {
      normalized.unshift(normalizeAccountRecord(defaultAccounts[0], 0));
    }
    return normalized;
  }

  function normalizeAccountSession(input) {
    const incoming = input && typeof input === "object" ? input : {};
    const preset = (accounts || defaultAccounts).find((account) => account.id === incoming.id);
    const sessionMeta = {
      authenticated: Boolean(incoming.authenticated),
      loginAt: String(incoming.loginAt || ""),
      lastLoginAt: String(incoming.lastLoginAt || "")
    };
    if (preset && !incoming.customized) return { ...normalizeAccountRecord(preset), ...sessionMeta };
    const role = accountRoleList.includes(incoming.role) ? incoming.role : "销售";
    return {
      id: String(incoming.id || ""),
      loginName: String(incoming.loginName || incoming.id || ""),
      name: String(incoming.name || ""),
      role,
      team: String(incoming.team || ""),
      dataScope: normalizeAccountDataScope(incoming.dataScope, role),
      status: incoming.status === "停用" ? "停用" : "启用",
      password: String(incoming.password || defaultAccountPassword(role)),
      phone: String(incoming.phone || ""),
      note: String(incoming.note || ""),
      permissions: normalizePermissions(incoming.permissions, role),
      failedLoginCount: Number(incoming.failedLoginCount || 0),
      lockedUntil: String(incoming.lockedUntil || ""),
      mustChangePassword: incoming.mustChangePassword === true || incoming.mustChangePassword === "true",
      passwordUpdatedAt: String(incoming.passwordUpdatedAt || ""),
      lastLoginResult: String(incoming.lastLoginResult || ""),
      customized: Boolean(incoming.customized),
      ...sessionMeta
    };
  }

  function persistAccounts() {
    saveJson(STORAGE_ACCOUNTS, accounts);
  }

  function persistAccountSession() {
    saveJson(STORAGE_ACCOUNT_SESSION, accountSession);
  }

  function currentAccount() {
    return normalizeAccountSession(accountSession);
  }

  function hasAccount() {
    const account = currentAccount();
    return Boolean(account.authenticated && account.name && account.role && account.status !== "停用");
  }

  function currentAccountName() {
    return String(currentAccount().name || "").trim();
  }

  function currentAccountRole() {
    return currentAccount().role || "销售";
  }

  function currentAccountDataScope() {
    const account = currentAccount();
    if (!hasAccount()) return "self";
    return normalizeAccountDataScope(account.dataScope, account.role);
  }

  function currentAccountScopeText() {
    if (!hasAccount()) return "未登录";
    const account = currentAccount();
    const scope = currentAccountDataScope();
    if (scope === "all") return "全量数据";
    if (scope === "team") return `${account.team || "所在团队"}数据`;
    return "本人数据";
  }

  function opportunityVisibleScopeText() {
    if (!hasAccount()) return "公海预览";
    const scope = currentAccountDataScope();
    if (scope === "all") return "全量+公海";
    if (scope === "team") return "团队+公海";
    return "自己+公海";
  }

  function opportunityFunnelLabel() {
    if (!hasAccount()) return "我的漏斗";
    const scope = currentAccountDataScope();
    if (scope === "all") return "全量漏斗";
    if (scope === "team") return "团队漏斗";
    return "我的漏斗";
  }

  function accountCanViewAll(account = currentAccount()) {
    if (!account || account.status === "停用") return false;
    return account.role === "管理员" || normalizeAccountDataScope(account.dataScope, account.role) === "all";
  }

  function accountCanViewTeam(account = currentAccount()) {
    if (!account || account.status === "停用") return false;
    const scope = normalizeAccountDataScope(account.dataScope, account.role);
    return scope === "team" || scope === "all" || account.role === "管理员";
  }

  function accountCanApprove() {
    return accountCanModuleAction("opportunities", "approve") || ["管理员", "销售主管"].includes(currentAccountRole());
  }

  function accountHasPermission(moduleKey, actionKey = "view", account = currentAccount()) {
    if (!account || !account.authenticated || account.status === "停用" || !String(account.name || "").trim()) return false;
    if (account.role === "管理员") return true;
    const permissions = normalizePermissions(account.permissions, account.role);
    return Boolean(permissions[moduleKey] && permissions[moduleKey][actionKey]);
  }

  function accountCanModuleAction(moduleKey, actionKey = "view") {
    if (accountHasPermission(moduleKey, actionKey)) return true;
    if (actionKey !== "admin" && accountHasPermission(moduleKey, "admin")) return true;
    const crmScopedModules = ["customers", "opportunities", "contracts", "orders", "fulfillment", "storeSales"];
    return crmScopedModules.includes(moduleKey) && accountHasPermission("crm", "admin");
  }

  function accountTeamMatchesOwner(account, ownerTeam) {
    const accountTeam = String(account && account.team || "").trim();
    const targetTeam = String(ownerTeam || "").trim();
    if (!accountTeam || !targetTeam) return false;
    if (accountTeam === targetTeam) return true;
    return ["全国渠道", "全国销售", "经营管理"].includes(accountTeam);
  }

  function accountByIdentity(id, name) {
    const accountId = String(id || "").trim();
    const accountName = String(name || "").trim();
    return accounts.find((account) => accountId && account.id === accountId)
      || accounts.find((account) => accountName && account.name === accountName)
      || null;
  }

  function ownerIdentityFromRow(row) {
    const source = row && typeof row === "object" ? row : {};
    const id = String(source.opportunityOwnerId || source.ownerId || source.accountId || source.actorId || "").trim();
    const name = String(source.opportunityOwner || source.ownerName || source.operatorName || source.salesOwner || source.actorName || "").trim();
    const matchedAccount = accountByIdentity(id, name);
    return {
      id: id || (matchedAccount ? matchedAccount.id : ""),
      name: name || (matchedAccount ? matchedAccount.name : ""),
      team: String(source.opportunityTeam || source.ownerTeam || source.accountTeam || (matchedAccount ? matchedAccount.team : "") || "").trim()
    };
  }

  function accountOwnsIdentity(identity, account = currentAccount()) {
    if (!account || account.status === "停用") return false;
    if (!identity) return false;
    return Boolean(identity.id && identity.id === account.id)
      || Boolean(identity.name && identity.name === account.name);
  }

  function accountCanSeeOwnerIdentity(identity, account = currentAccount()) {
    if (!hasAccount()) return false;
    if (accountCanViewAll(account)) return true;
    if (!identity || !identity.id && !identity.name && !identity.team) return true;
    if (accountOwnsIdentity(identity, account)) return true;
    return accountCanViewTeam(account) && accountTeamMatchesOwner(account, identity.team);
  }

  function canAccessView(viewName) {
    if (!mainViewMeta[viewName]) return true;
    if (!hasAccount()) return loggedOutVisibleViews.includes(viewName);
    const rules = viewPermissionRules[viewName];
    if (!rules || !rules.length) return true;
    return rules.some((rule) => accountHasPermission(rule.module, rule.action || "view"));
  }

  function firstAccessibleView(preferred = activeView) {
    const candidates = [preferred, "crm", "scenario"].concat(uiLayout.mainViewOrder || [], Object.keys(mainViewMeta));
    const seen = new Set();
    return candidates.find((viewName) => {
      if (!viewName || seen.has(viewName)) return false;
      seen.add(viewName);
      return canAccessView(viewName);
    }) || "scenario";
  }

  function accountMatchesRecord(record) {
    return accountCanSeeOwnerIdentity(ownerIdentityFromRow(record));
  }

  function accountOwnsRecord(record) {
    return accountOwnsIdentity(ownerIdentityFromRow(record));
  }

  function accountCanEditOpportunity(record) {
    ensureOpportunityFields(record);
    if (!hasAccount()) return false;
    if (!accountCanModuleAction("opportunities", "edit")) return false;
    return isPublicOpportunity(record) || accountCanViewAll() || accountMatchesRecord(record);
  }

  function accountCanDeleteRecord(record) {
    return accountCanModuleAction("opportunities", "admin") || accountOwnsRecord(record) && accountCanModuleAction("opportunities", "edit");
  }

  function accountSelectOptions() {
    return [{ value: "", label: "选择账号" }]
      .concat(accounts.filter((account) => account.status !== "停用").map((account) => ({ value: account.id, label: `${account.name} · ${account.role} · ${account.loginName}` })));
  }

  function syncOperatorFromAccount() {
    if (!hasAccount()) return;
    state.operatorName = currentAccountName();
    persistState();
  }

  function switchAccount(accountId, authenticated = false) {
    if (!accountId) {
      accountSession = normalizeAccountSession({});
    } else {
      const account = accounts.find((item) => item.id === accountId);
      accountSession = normalizeAccountSession(account ? {
        ...account,
        authenticated,
        loginAt: authenticated ? new Date().toLocaleString("zh-CN", { hour12: false }) : ""
      } : {});
    }
    persistAccountSession();
    syncOperatorFromAccount();
    renderAccountBar();
    renderScenarioControls();
    updateCalculatedViews();
    renderRecords();
    renderCrmWorkspace();
    renderAccountAdmin();
    renderContextToolbar();
    if (!canAccessView(activeView)) setActiveView(firstAccessibleView());
    applyUiLayout();
  }

  function loginAccount(accountId, password) {
    const account = accounts.find((item) => item.id === accountId);
    if (!account) {
      accountLoginError = "请选择账号";
      renderAccountBar();
      return;
    }
    if (account.status === "停用") {
      accountLoginError = "账号已停用，请联系管理员";
      renderAccountBar();
      return;
    }
    if (accountIsLocked(account)) {
      accountLoginError = `账号暂时锁定，${accountLockLabel(account)} 后再试`;
      renderAccountBar();
      return;
    }
    if (String(password || "") !== String(account.password || defaultAccountPassword(account.role))) {
      account.failedLoginCount = Number(account.failedLoginCount || 0) + 1;
      account.lastLoginResult = "失败";
      if (account.failedLoginCount >= ACCOUNT_LOCK_THRESHOLD) {
        account.lockedUntil = new Date(Date.now() + ACCOUNT_LOCK_MINUTES * 60000).toISOString();
        accountLoginError = `口令错误 ${ACCOUNT_LOCK_THRESHOLD} 次，账号已锁定 ${ACCOUNT_LOCK_MINUTES} 分钟`;
      } else {
        accountLoginError = `口令不正确，还可尝试 ${ACCOUNT_LOCK_THRESHOLD - account.failedLoginCount} 次`;
      }
      touchAccount(account);
      persistAccounts();
      appendCrmActivity({
        type: "账号权限",
        title: "账号登录失败",
        detail: `${account.name} · 失败 ${account.failedLoginCount} 次${account.lockedUntil ? " · 已锁定" : ""}`,
        targetType: "account",
        targetId: account.id,
        ownerId: account.id,
        ownerName: account.name,
        tone: account.lockedUntil ? "weak" : "medium"
      });
      renderAccountBar();
      return;
    }
    accountLoginError = "";
    account.failedLoginCount = 0;
    account.lockedUntil = "";
    account.lastLoginAt = new Date().toLocaleString("zh-CN", { hour12: false });
    account.lastLoginResult = "成功";
    persistAccounts();
    switchAccount(account.id, true);
    if (account.mustChangePassword) {
      accountPasswordPanelOpen = true;
      accountPasswordChangeError = "管理员要求修改口令后继续使用。";
      renderAccountBar();
    }
    appendCrmActivity({
      type: "账号权限",
      title: "账号登录",
      detail: `${account.name} 登录工作台`,
      targetType: "account",
      targetId: account.id,
      ownerId: account.id,
      ownerName: account.name,
      tone: "neutral"
    });
  }

  function logoutAccount() {
    if (hasAccount()) {
      appendCrmActivity({
        type: "账号权限",
        title: "账号退出",
        detail: `${currentAccountName()} 退出工作台`,
        targetType: "account",
        targetId: currentAccount().id,
        tone: "neutral"
      });
    }
    accountLoginError = "";
    switchAccount("", false);
  }

  function currentManagedAccount() {
    const account = currentAccount();
    return accounts.find((item) => item.id === account.id) || null;
  }

  function changeCurrentAccountPassword() {
    const account = currentManagedAccount();
    if (!account || !hasAccount()) {
      accountPasswordChangeError = "请先登录账号。";
      renderAccountBar();
      return;
    }
    const oldPassword = (qs("#currentPasswordInput") || {}).value || "";
    const nextPassword = (qs("#newPasswordInput") || {}).value || "";
    const confirmPassword = (qs("#confirmPasswordInput") || {}).value || "";
    if (String(oldPassword) !== String(account.password || defaultAccountPassword(account.role))) {
      accountPasswordChangeError = "当前口令不正确。";
      renderAccountBar();
      return;
    }
    if (nextPassword !== confirmPassword) {
      accountPasswordChangeError = "两次新口令不一致。";
      renderAccountBar();
      return;
    }
    if (passwordLooksWeak(nextPassword)) {
      accountPasswordChangeError = `新口令至少${PASSWORD_MIN_LENGTH}位，并建议包含字母/数字/符号中的两类。`;
      renderAccountBar();
      return;
    }
    account.password = nextPassword;
    account.mustChangePassword = false;
    account.failedLoginCount = 0;
    account.lockedUntil = "";
    account.passwordUpdatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    touchAccount(account);
    persistAccounts();
    accountSession = normalizeAccountSession({
      ...account,
      authenticated: true,
      loginAt: accountSession.loginAt || new Date().toLocaleString("zh-CN", { hour12: false })
    });
    persistAccountSession();
    accountPasswordPanelOpen = false;
    accountPasswordChangeError = "";
    appendCrmActivity({
      type: "账号权限",
      title: "修改本人口令",
      detail: `${account.name} 已修改登录口令`,
      targetType: "account",
      targetId: account.id,
      ownerId: account.id,
      ownerName: account.name,
      tone: "medium"
    });
    renderAccountBar();
    renderAccountAdmin();
    flashContextToolbar("口令已修改");
  }

  function resetManagedAccountPassword(index) {
    if (!accountHasPermission("accounts", "admin")) {
      alert("当前账号没有重置口令权限。");
      return;
    }
    const account = accounts[index];
    if (!account) return;
    const nextPassword = temporaryAccountPassword(account);
    account.password = nextPassword;
    account.mustChangePassword = true;
    account.failedLoginCount = 0;
    account.lockedUntil = "";
    account.passwordUpdatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    touchAccount(account);
    persistAccounts();
    appendCrmActivity({
      type: "账号权限",
      title: "重置账号口令",
      detail: `${account.name} · 临时口令 ${nextPassword} · 已要求下次改密`,
      targetType: "account",
      targetId: account.id,
      ownerId: account.id,
      ownerName: account.name,
      tone: "medium"
    });
    if (account.id === accountSession.id) {
      accountSession = normalizeAccountSession({
        ...account,
        authenticated: hasAccount(),
        loginAt: accountSession.loginAt
      });
      persistAccountSession();
    }
    renderAccountAdmin();
    renderAccountBar();
    flashContextToolbar(`已重置 ${account.name} 口令`);
  }

  function unlockManagedAccount(index) {
    if (!accountHasPermission("accounts", "admin")) {
      alert("当前账号没有解锁账号权限。");
      return;
    }
    const account = accounts[index];
    if (!account) return;
    account.failedLoginCount = 0;
    account.lockedUntil = "";
    account.lastLoginResult = "";
    touchAccount(account);
    persistAccounts();
    appendCrmActivity({
      type: "账号权限",
      title: "解锁账号",
      detail: `${account.name} 已清除登录失败锁定`,
      targetType: "account",
      targetId: account.id,
      ownerId: account.id,
      ownerName: account.name,
      tone: "medium"
    });
    renderAccountAdmin();
    renderAccountBar();
  }

  function impersonateManagedAccount(accountId) {
    if (!accountHasPermission("accounts", "admin")) {
      alert("当前账号没有模拟登录权限。");
      return;
    }
    const fromAccount = currentAccount();
    const target = accounts.find((account) => account.id === accountId);
    if (!target || target.status === "停用") {
      alert("目标账号不存在或已停用。");
      return;
    }
    switchAccount(target.id, true);
    appendCrmActivity({
      type: "账号权限",
      title: "管理员模拟登录",
      detail: `${fromAccount.name || "管理员"} 切换为 ${target.name}`,
      targetType: "account",
      targetId: target.id,
      ownerId: target.id,
      ownerName: target.name,
      tone: "medium"
    });
  }

  function updateAccountField(fieldName, value) {
    accountSession = normalizeAccountSession({
      ...accountSession,
      [fieldName]: value,
      customized: !accounts.some((account) => account.id === accountSession.id && account[fieldName] === value)
    });
    persistAccountSession();
    syncOperatorFromAccount();
    updateSaveRecordButtons();
    renderRecords();
    renderCrmWorkspace();
    renderAccountAdmin();
    renderContextToolbar();
  }

  function crmDefaultWorkspace() {
    return {
      customers: [
        {
          id: "CUST-WUZHEN",
          name: "乌镇文旅/乌陶坊",
          type: "景区/运营方",
          source: "已落地点位",
          region: "浙江嘉兴",
          ownerId: "sales",
          ownerName: "销售账号",
          contactName: "待补",
          contactRole: "运营/门店",
          phone: "",
          wechat: "",
          status: "合作中",
          nextAction: "补齐门店销售数据与复盘",
          nextActionAt: "",
          note: "标杆点位，应沉淀合同、发货、动销和补货节奏。"
        },
        {
          id: "CUST-YAOHU",
          name: "宜兴窑湖小镇",
          type: "景区/运营方",
          source: "发货归档",
          region: "江苏宜兴",
          ownerId: "sales",
          ownerName: "销售账号",
          contactName: "待补",
          contactRole: "招商/运营",
          phone: "",
          wechat: "",
          status: "落地中",
          nextAction: "核对发货清单和签收凭证",
          nextActionAt: "",
          note: "已见签收和物料资料，需销售补录上架状态。"
        }
      ],
      contracts: [
        { id: "CON-WUZHEN", customerId: "CUST-WUZHEN", pointName: "乌镇乌陶坊", type: "寄售/联名", status: "待补合同", ownerId: "sales", ownerName: "销售账号", amount: 0, paidAmount: 0, receivableDueDate: "", paymentStatus: "待确认", invoiceStatus: "待补开票信息", signDate: "", template: "景区寄售合作协议", nextAction: "补授权与联名边界", note: "" }
      ],
      orders: [
        { id: "ORD-WUZHEN-001", customerId: "CUST-WUZHEN", pointName: "乌镇乌陶坊", orderType: "寄售铺货", mesStatus: "已发货/待动销复盘", ownerId: "sales", ownerName: "销售账号", amount: 0, quantity: 0, skuPlan: "历史发货批次待补：需补录SKU名称、单款数量、69码和图片链接", designRequirement: "沿用乌镇主题素材，待补打样确认记录", receiverInfo: "待补收货人/电话", deliveryAddress: "待补门店/仓库地址", launchDate: "", dueDate: "", note: "发货批次来自点位落地台账" }
      ],
      storeSales: [
        { id: "SALE-WUZHEN", customerId: "CUST-WUZHEN", pointName: "乌镇乌陶坊", month: "2026-07", salesAmount: 0, receiptAmount: 0, salesCostAmount: 0, soldQty: 0, stockQty: 0, suggestedReplenishmentQty: 0, grossProfitAmount: 0, estimatedCommission: 0, sellThroughRate: 0, replenishmentPriority: "待判断", reviewOwner: "销售账号", reviewDueDate: "", replenishmentAdvice: "待录入门店销售数据", reviewStatus: "待复盘", reviewedAt: "", ownerId: "sales", ownerName: "销售账号", note: "" }
      ]
    };
  }

  function normalizeLegacyCrmOwner(row) {
    const legacyOwnerIds = new Set(["sales-east", "sales-south", "manager"]);
    const legacyOwnerNames = new Set(["销售A", "销售B", "销售主管"]);
    if (legacyOwnerIds.has(String(row.ownerId || "")) || legacyOwnerNames.has(String(row.ownerName || ""))) {
      return { ...row, ownerId: "sales", ownerName: "销售账号" };
    }
    return row;
  }

  function normalizeCrmWorkspace(input) {
    const defaults = crmDefaultWorkspace();
    const source = input && typeof input === "object" ? input : {};
    const normalizeRows = (rows, fallbackRows) => (Array.isArray(rows) && rows.length ? rows : fallbackRows).map((row, index) => ({
      id: String(row.id || `CRM-${Date.now().toString(36)}-${index}`),
      ...row
    })).map(normalizeLegacyCrmOwner);
    return {
      customers: normalizeRows(source.customers, defaults.customers),
      contracts: normalizeRows(source.contracts, defaults.contracts),
      orders: normalizeRows(source.orders, defaults.orders),
      storeSales: normalizeRows(source.storeSales, defaults.storeSales)
    };
  }

  function persistCrmWorkspace() {
    saveJson(STORAGE_CRM_WORKSPACE, crmWorkspace);
  }

  function normalizeCrmActivityLog(input) {
    return (Array.isArray(input) ? input : []).map((item, index) => {
      const raw = item && typeof item === "object" ? item : {};
      return {
        id: String(raw.id || `ACT-${Date.now().toString(36)}-${index}`),
        time: String(raw.time || new Date().toLocaleString("zh-CN", { hour12: false })),
        actorId: String(raw.actorId || ""),
        actorName: String(raw.actorName || "系统"),
        actorRole: String(raw.actorRole || ""),
        type: String(raw.type || "动态"),
        title: String(raw.title || "工作台更新"),
        detail: String(raw.detail || ""),
        pointName: String(raw.pointName || ""),
        recordId: String(raw.recordId || ""),
        targetType: String(raw.targetType || ""),
        targetId: String(raw.targetId || ""),
        ownerId: String(raw.ownerId || ""),
        ownerName: String(raw.ownerName || ""),
        tone: String(raw.tone || "neutral")
      };
    }).slice(0, 300);
  }

  function persistCrmActivityLog() {
    saveJson(STORAGE_CRM_ACTIVITY, crmActivityLog);
  }

  function appendCrmActivity(entry = {}) {
    const account = currentAccount();
    const activity = {
      id: `ACT-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
      time: new Date().toLocaleString("zh-CN", { hour12: false }),
      actorId: account.id || "",
      actorName: account.name || "系统",
      actorRole: account.role || "",
      type: entry.type || "动态",
      title: entry.title || "工作台更新",
      detail: entry.detail || "",
      pointName: entry.pointName || "",
      recordId: entry.recordId || "",
      targetType: entry.targetType || "",
      targetId: entry.targetId || "",
      ownerId: entry.ownerId || account.id || "",
      ownerName: entry.ownerName || account.name || "",
      tone: entry.tone || "neutral"
    };
    crmActivityLog = [activity].concat(crmActivityLog).slice(0, 300);
    persistCrmActivityLog();
    return activity;
  }

  function activityVisible(activity) {
    if (accountCanViewAll()) return true;
    if (!hasAccount()) return false;
    const account = currentAccount();
    if (activity.actorId === account.id || activity.ownerId === account.id) return true;
    if (activity.actorName === account.name || activity.ownerName === account.name) return true;
    if (activity.recordId) {
      const record = records.find((item) => item.id === activity.recordId);
      if (record && accountMatchesRecord(record)) return true;
    }
    return accountCanSeeOwnerIdentity(ownerIdentityFromRow(activity));
  }

  function recentCrmActivities(limit = 8, predicate = null) {
    return crmActivityLog
      .filter(activityVisible)
      .filter((activity) => !predicate || predicate(activity))
      .slice(0, limit);
  }

  function renderActivityFeed(activities, emptyText = "暂无动态") {
    return `<div class="crm-activity-list">
      ${activities.map((activity) => `<article class="crm-activity-item ${escapeHtml(activity.tone || "neutral")}">
        <span>${escapeHtml(activity.time)}</span>
        <strong>${escapeHtml(activity.title)}</strong>
        <small>${escapeHtml([activity.type, activity.actorName, activity.pointName].filter(Boolean).join(" · "))}</small>
        ${activity.detail ? `<em>${escapeHtml(activity.detail)}</em>` : ""}
      </article>`).join("") || `<p class="empty">${escapeHtml(emptyText)}</p>`}
    </div>`;
  }

  function stableJson(value) {
    return JSON.stringify(value || null);
  }

  function pushRulesBackup(entry) {
    if (!entry || !entry.rules) return;
    try {
      const backups = loadJson(STORAGE_RULES_BACKUPS);
      const nextBackups = Array.isArray(backups) ? backups : [];
      saveJson(STORAGE_RULES_BACKUPS, [{
        ...entry,
        savedAt: entry.savedAt || new Date().toISOString(),
        rules: XJCore.clone(entry.rules)
      }].concat(nextBackups).slice(0, RULE_BACKUP_LIMIT));
    } catch (error) {
      console.warn("规则备份失败，已继续使用当前规则。", error);
    }
  }

  function backupRulesBeforeMigration(sourceRules, reason, targetVersion) {
    if (!sourceRules) return;
    const sourceVersion = sourceRules.ui && sourceRules.ui.scoringModelVersion;
    pushRulesBackup({
      reason,
      fromVersion: sourceVersion || "",
      toVersion: targetVersion || "",
      rules: sourceRules
    });
  }

  function pushUiLayoutBackup(entry) {
    if (!entry || !entry.uiLayout) return;
    try {
      const backups = loadJson(STORAGE_UI_LAYOUT_BACKUPS);
      const nextBackups = Array.isArray(backups) ? backups : [];
      saveJson(STORAGE_UI_LAYOUT_BACKUPS, [{
        ...entry,
        savedAt: entry.savedAt || new Date().toISOString(),
        uiLayout: XJCore.clone(entry.uiLayout)
      }].concat(nextBackups).slice(0, UI_LAYOUT_BACKUP_LIMIT));
    } catch (error) {
      console.warn("UI配置备份失败，已继续使用当前UI。", error);
    }
  }

  function normalizeUiLayout(input) {
    const layout = { ...defaultUiLayout, ...(input || {}) };
    const sizeValue = (value) => ["compact", "normal", "large"].includes(value) ? value : "normal";
    const mergeOrder = (savedOrder, allowedOrder) => {
      const saved = Array.isArray(savedOrder) ? savedOrder : [];
      return saved
        .filter((key) => allowedOrder.includes(key))
        .concat(allowedOrder.filter((key) => !saved.includes(key)));
    };
    const panelOrder = {};
    Object.keys(defaultUiLayout.panelOrder).forEach((key) => {
      panelOrder[key] = mergeOrder(layout.panelOrder && layout.panelOrder[key], defaultUiLayout.panelOrder[key]);
    });
    const texts = { ...defaultUiLayout.texts, ...(layout.texts || {}) };
    if (texts.appSubtitle === "成本 · 场景评级 · 定价 · 采购/寄售 · 提成") texts.appSubtitle = defaultUiLayout.texts.appSubtitle;
    if (texts.mainTabCrm === "销售CRM") texts.mainTabCrm = "管理驾驶舱";
    if (texts.mobileTabCrm === "CRM") texts.mobileTabCrm = "经营";
    if (texts.mobileTabScenario === "场景") texts.mobileTabScenario = "评级";
    if (texts.mobileTabProducts === "产品") texts.mobileTabProducts = "商品";
    if (texts.mobileTabSettings === "规则") texts.mobileTabSettings = "管理";
    if (texts.mainTabCost === "成本测算") texts.mainTabCost = "成本库";
    if (texts.mobileTabCost === "成本") texts.mobileTabCost = "成本库";
    if (texts.mainTabRecords === "测算记录") texts.mainTabRecords = "点位机会";
    if (texts.panelRecords === "测算记录") texts.panelRecords = "点位机会";
    return {
      ...layout,
      density: layout.density === "comfortable" ? "comfortable" : "compact",
      scenarioLayout: layout.scenarioLayout === "reverse" ? "reverse" : "normal",
      topAreaSize: sizeValue(layout.topAreaSize),
      summaryCardSize: sizeValue(layout.summaryCardSize),
      subtabSize: sizeValue(layout.subtabSize),
      showStickySummary: layout.showStickySummary !== false,
      showResultsPanel: layout.showResultsPanel !== false,
      showScoreBreakdown: layout.showScoreBreakdown !== false,
      showRiskPanel: layout.showRiskPanel !== false,
      mainViewOrder: mergeOrder(layout.mainViewOrder, defaultUiLayout.mainViewOrder),
      panelOrder,
      scenarioSectionOrder: mergeOrder(layout.scenarioSectionOrder, defaultUiLayout.scenarioSectionOrder),
      texts
    };
  }

  function mergeRules(base, saved) {
    const merged = XJCore.clone(base);
    Object.keys(saved || {}).forEach((key) => {
      if (Array.isArray(saved[key])) {
        merged[key] = saved[key];
      } else if (saved[key] && typeof saved[key] === "object" && !Array.isArray(saved[key])) {
        merged[key] = { ...(merged[key] || {}), ...saved[key] };
      } else {
        merged[key] = saved[key];
      }
    });
    return merged;
  }

  function scoringGroupMax(group, fallback = 10) {
    if (Number(group && group.max) > 0) return Number(group.max);
    const values = [];
    if (Array.isArray(group && group.options)) values.push(...group.options.map((item) => Number(item.score) || 0));
    if (Array.isArray(group && group.thresholds)) values.push(...group.thresholds.map((item) => Number(item.score) || 0));
    if (group && group.freeScore !== undefined) values.push(Number(group.freeScore) || 0);
    const max = Math.max(0, ...values);
    return max > 0 ? max : fallback;
  }

  function scaleScoreToTen(value, sourceMax) {
    if (sourceMax <= 0) return Number(value) || 0;
    return Math.round(((Number(value) || 0) / sourceMax * 10 + Number.EPSILON) * 10) / 10;
  }

  function scoringNeedsTenPointRepair(scoring) {
    return tenPointScoringKeys.some((key) => {
      const group = scoring && scoring[key];
      return !group || Number(group.max) !== 10;
    });
  }

  function mergeRuleOrder(savedOrder, defaultOrder) {
    const saved = Array.isArray(savedOrder) ? savedOrder : [];
    const allowed = Array.isArray(defaultOrder) ? defaultOrder : Object.keys(sectionMeta);
    return saved
      .filter((key) => allowed.includes(key))
      .concat(allowed.filter((key) => !saved.includes(key)));
  }

  function defaultPurchaseTiers() {
    return XJCore.clone((window.DEFAULT_DATA.rules && window.DEFAULT_DATA.rules.purchaseTiers) || []);
  }

  function defaultGradeCaps() {
    return XJCore.clone((window.DEFAULT_DATA.rules && window.DEFAULT_DATA.rules.gradeCaps) || {});
  }

  function normalizeGradeCaps(gradeCaps) {
    return {
      ...defaultGradeCaps(),
      ...(gradeCaps || {}),
      enabled: gradeCaps && gradeCaps.enabled === true
    };
  }

  function normalizeQuantityPurchaseTiers(tiers, forceDefault = false) {
    const source = Array.isArray(tiers) ? tiers : [];
    const hasLegacyTypeFields = source.some((tier) => tier && (tier.productClass !== undefined || tier.productType !== undefined));
    if (forceDefault || !source.length || hasLegacyTypeFields) return defaultPurchaseTiers();
    return source.map((tier) => ({
      minQty: Number(tier.minQty) || 0,
      maxQty: Number(tier.maxQty) || 999999,
      name: String(tier.name || "数量阶梯"),
      discount: Number(tier.discount) || 0,
      manualPrice: tier.manualPrice === undefined ? null : tier.manualPrice,
      useManualPrice: tier.useManualPrice === true,
      enabled: tier.enabled !== false
    })).sort((a, b) => a.minQty - b.minQty);
  }

  function normalizedStageWeights(scoring, defaultScoring, forceLatestStageWeights) {
    const configured = (scoring && scoring.stageWeights) || {};
    const hasAllWeights = ["T0", "T1", "T2"].every((key) => Number(configured[key]) > 0);
    if (forceLatestStageWeights || !hasAllWeights) {
      return XJCore.clone((defaultScoring && defaultScoring.stageWeights) || latestStageWeights);
    }
    return ["T0", "T1", "T2"].reduce((weights, key) => {
      weights[key] = Number(configured[key]) || 0;
      return weights;
    }, {});
  }

  function normalizeTenPointScoring(scoring, defaultScoring, options = {}) {
    const nextScoring = XJCore.clone(scoring || defaultScoring || {});
    tenPointScoringKeys.forEach((key) => {
      const defaultGroup = defaultScoring && defaultScoring[key];
      const group = nextScoring[key] ? XJCore.clone(nextScoring[key]) : XJCore.clone(defaultGroup || {});
      const fallbackMax = scoringGroupMax(defaultGroup, 10);
      const sourceMax = scoringGroupMax(group, fallbackMax);
      if (sourceMax !== 10) {
        if (Array.isArray(group.options)) {
          group.options = group.options.map((item) => ({ ...item, score: scaleScoreToTen(item.score, sourceMax) }));
        }
        if (Array.isArray(group.thresholds)) {
          group.thresholds = group.thresholds.map((item) => ({ ...item, score: scaleScoreToTen(item.score, sourceMax) }));
        }
        if (group.freeScore !== undefined) group.freeScore = scaleScoreToTen(group.freeScore, sourceMax);
      }
      group.max = 10;
      nextScoring[key] = group;
    });
    nextScoring.stageWeights = normalizedStageWeights(nextScoring, defaultScoring, options.forceLatestStageWeights);
    if (!nextScoring.vetoRules && defaultScoring.vetoRules) nextScoring.vetoRules = XJCore.clone(defaultScoring.vetoRules);
    if (!nextScoring.scenicLevel && defaultScoring.scenicLevel) nextScoring.scenicLevel = XJCore.clone(defaultScoring.scenicLevel);
    return nextScoring;
  }

  function applyRuleMigrations(rules, sourceRules) {
    const nextRules = XJCore.clone(rules);
    const defaultRules = window.DEFAULT_DATA.rules;
    const latestVersion = defaultRules.ui && defaultRules.ui.scoringModelVersion;
    const currentVersion = nextRules.ui && nextRules.ui.scoringModelVersion;
    const latestPurchaseTierVersion = defaultRules.ui && defaultRules.ui.purchaseTierModelVersion;
    const sourcePurchaseTierVersion = sourceRules && sourceRules.ui && sourceRules.ui.purchaseTierModelVersion;
    const sourceExpansionBonuses = (sourceRules && sourceRules.expansionBonuses) || {};
    const migratedExpansionBonuses = { ...(defaultRules.expansionBonuses || {}), ...sourceExpansionBonuses };
    Object.entries((sourceRules && sourceRules.gradeParams) || {}).forEach(([grade, params]) => {
      if (params && params.bonus !== undefined && sourceExpansionBonuses[grade] === undefined) migratedExpansionBonuses[grade] = Number(params.bonus) || 0;
    });
    const needsModelMigration = Boolean(latestVersion && currentVersion !== latestVersion);
    const needsScoreRepair = scoringNeedsTenPointRepair(nextRules.scoring);
    const needsPurchaseTierMigration = Boolean(sourceRules && latestPurchaseTierVersion && sourcePurchaseTierVersion !== latestPurchaseTierVersion);
    const needsGradeCapMigration = Boolean(sourceRules && !sourceRules.gradeCaps);
    if (needsModelMigration || needsScoreRepair) {
      backupRulesBeforeMigration(
        sourceRules,
        needsModelMigration ? "评分模型升级前备份" : "评分10分制修复前备份",
        latestVersion
      );
      nextRules.scoring = normalizeTenPointScoring(nextRules.scoring, defaultRules.scoring, {
        forceLatestStageWeights: needsModelMigration
      });
      nextRules.expansionBonuses = migratedExpansionBonuses;
      nextRules.ui = {
        ...(nextRules.ui || {}),
        scoringModelVersion: latestVersion,
        scoringModelName: defaultRules.ui.scoringModelName,
        scoringModelNote: defaultRules.ui.scoringModelNote,
        ruleOrder: mergeRuleOrder(nextRules.ui && nextRules.ui.ruleOrder, defaultRules.ui.ruleOrder)
      };
      if (sourceRules) saveJson(STORAGE_RULES, nextRules);
    }
    if (needsGradeCapMigration) {
      nextRules.gradeCaps = defaultGradeCaps();
      if (sourceRules) saveJson(STORAGE_RULES, nextRules);
    } else {
      nextRules.gradeCaps = normalizeGradeCaps(nextRules.gradeCaps);
    }
    if (needsPurchaseTierMigration) {
      pushRulesBackup({
        reason: "采购阶梯切换为单款数量折扣前备份",
        fromVersion: sourcePurchaseTierVersion || "",
        toVersion: latestPurchaseTierVersion,
        rules: sourceRules
      });
      nextRules.purchaseTiers = normalizeQuantityPurchaseTiers(nextRules.purchaseTiers, true);
      nextRules.ui = {
        ...(nextRules.ui || {}),
        purchaseTierModelVersion: latestPurchaseTierVersion
      };
      saveJson(STORAGE_RULES, nextRules);
    }
    return nextRules;
  }

  function normalizeScenarioLabels(scenario) {
    const nextScenario = { ...(scenario || {}) };
    if (nextScenario.businessTerms === "优：低扣点/短账期/无进场费") {
      nextScenario.businessTerms = "优：采购/保证金覆盖/短账期/无进场费";
    }
    if (nextScenario.businessTerms === "中：扣点需谈判" || nextScenario.businessTerms === "严：授权与准入门槛高") {
      nextScenario.businessTerms = "中：扣点需谈判，账期/保底待确认";
    }
    return nextScenario;
  }

  function scoringOptionKeys() {
    const scoring = data.rules && data.rules.scoring ? data.rules.scoring : {};
    return Object.keys(scoring).filter((key) => Array.isArray(scoring[key] && scoring[key].options));
  }

  function canonicalOptionValue(key, value) {
    const group = data.rules.scoring && data.rules.scoring[key];
    if (!group || !Array.isArray(group.options)) return value;
    const target = String(value ?? "");
    const option = group.options.find((item) => {
      if (String(item.label) === target) return true;
      return Array.isArray(item.aliases) && item.aliases.some((alias) => String(alias) === target);
    });
    return option ? option.label : value;
  }

  function canonicalScenarioOptions(scenario) {
    const nextScenario = { ...(scenario || {}) };
    scoringOptionKeys().forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(nextScenario, key)) {
        nextScenario[key] = canonicalOptionValue(key, nextScenario[key]);
      }
    });
    return nextScenario;
  }

  function normalizeState(input) {
    const baseInputs = XJCore.clone(data.defaultInputs);
    const { costOverrides: _defaultCostOverrides, ...cleanDefaults } = baseInputs;
    const { costOverrides: _savedCostOverrides, ...cleanInput } = input || {};
    const productId = data.products.some((product) => product.id === cleanInput.productId) ? cleanInput.productId : data.products[0].id;
    return {
      ...cleanDefaults,
      ...cleanInput,
      productId,
      scenario: canonicalScenarioOptions(normalizeScenarioLabels({ ...data.defaultInputs.scenario, ...(cleanInput.scenario || {}) })),
      channel: { ...data.defaultInputs.channel, ...(cleanInput.channel || {}) }
    };
  }

  function persistState() {
    saveJson(STORAGE_STATE, state);
  }

  function persistRules(reason = "规则参数修改") {
    const nextRules = XJCore.clone(data.rules);
    if (lastPersistedRulesSnapshot && stableJson(lastPersistedRulesSnapshot) !== stableJson(nextRules)) {
      pushRulesBackup({
        reason,
        fromVersion: lastPersistedRulesSnapshot.ui && lastPersistedRulesSnapshot.ui.scoringModelVersion || "",
        toVersion: nextRules.ui && nextRules.ui.scoringModelVersion || "",
        rules: lastPersistedRulesSnapshot
      });
    }
    saveJson(STORAGE_RULES, nextRules);
    lastPersistedRulesSnapshot = XJCore.clone(nextRules);
  }

  function replaceProducts(products) {
    data.products = normalizeProducts(products);
    window.ProductProvider.saveAllProducts(data.products);
    return data.products;
  }

  function persistRecords() {
    saveJson(STORAGE_RECORDS, records);
  }

  function persistScenicSpots() {
    saveJson(STORAGE_SCENIC_SPOTS, data.scenicSpots);
  }

  function persistFulfillmentRecords() {
    saveJson(STORAGE_FULFILLMENT, data.fulfillmentRecords);
  }

  function defaultFulfillmentRecords() {
    const generatedRecords = fulfillmentGeneratedData && Array.isArray(fulfillmentGeneratedData.records)
      ? fulfillmentGeneratedData.records
      : [];
    if (generatedRecords.length) return generatedRecords;
    return (window.DEFAULT_DATA && window.DEFAULT_DATA.fulfillmentRecords) || [];
  }

  function fulfillmentSyncLabel() {
    const meta = fulfillmentGeneratedData && fulfillmentGeneratedData.meta ? fulfillmentGeneratedData.meta : {};
    if (meta.generatedAt) return `${meta.generatedAt}自动同步`;
    if (meta.note) return meta.note;
    return "等待每日自动扫描";
  }

  function mergeFulfillmentSalesFields(baseRecords, savedRecords) {
    const salesFields = ["orderId", "customerId", "ownerId", "ownerName", "ownerTeam", "skuPlan", "designRequirement", "receiverInfo", "deliveryAddress", "launchDate", "salesShelfStatus", "salesShelfDate", "salesSellStatus", "salesOwner", "salesNote", "salesUpdatedAt"];
    const savedMap = new Map((savedRecords || []).map((record) => [record.id, record]));
    const baseIds = new Set((baseRecords || []).map((record) => record.id));
    const merged = (baseRecords || []).map((record) => {
      const saved = savedMap.get(record.id);
      if (!saved) return record;
      const next = { ...record };
      salesFields.forEach((fieldName) => {
        if (Object.prototype.hasOwnProperty.call(saved, fieldName)) next[fieldName] = saved[fieldName];
      });
      return next;
    });
    (savedRecords || []).forEach((record) => {
      if (!baseIds.has(record.id)) {
        merged.push({ ...record, syncSource: record.syncSource || "本地补录" });
      }
    });
    return merged;
  }

  function persistUiLayout(reason = "UI配置修改") {
    const nextUiLayout = normalizeUiLayout(uiLayout);
    if (lastPersistedUiLayoutSnapshot && stableJson(lastPersistedUiLayoutSnapshot) !== stableJson(nextUiLayout)) {
      pushUiLayoutBackup({
        reason,
        uiLayout: lastPersistedUiLayoutSnapshot
      });
    }
    saveJson(STORAGE_UI_LAYOUT, nextUiLayout);
    uiLayout = XJCore.clone(nextUiLayout);
    lastPersistedUiLayoutSnapshot = XJCore.clone(nextUiLayout);
  }

  function scenicVerificationForSpot(spot) {
    const payload = scenicVerificationData.spots || {};
    const id = spot && spot.id;
    return id && payload[id] ? payload[id] : {};
  }

  function normalizeScenicSpot(spot) {
    const fallback = data.defaultInputs.scenario;
    const verification = scenicVerificationForSpot(spot);
    const text = (value, backup = "") => String(value === undefined || value === null ? backup : value).trim();
    const list = (value) => {
      if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean);
      return text(value).split(/[，,、/]/).map((item) => item.trim()).filter(Boolean);
    };
    function mapAudience(value) {
      const raw = text(value);
      if (raw.includes("弱") || raw.includes("老年") || raw.includes("低价团")) return "弱：老年香客/低价团为主";
      if (raw.includes("中高") || raw.includes("亲子")) return "中高：亲子/年轻/城市漫游客混合";
      if (raw.includes("中：") || raw.includes("团队") || raw.includes("本地")) return "中：团队游或本地休闲为主";
      if (raw.includes("强") || raw.includes("打卡") || raw.includes("小红书") || raw.includes("传播")) return "强：外地游客+年轻审美客群多";
      return text(value, fallback.youngSpread);
    }
    function mapTile(value) {
      const raw = text(value);
      if (raw.includes("极强")) return "极强：游客一眼能理解卖瓦片";
      if (raw.includes("强") || raw.includes("古建") || raw.includes("屋檐") || raw.includes("瓦檐")) return "强：有古建/屋檐/街巷可讲";
      if (raw.includes("中")) return "中：需通过地方故事转译";
      if (raw.includes("弱")) return "弱：主要靠产品颜值解释";
      if (raw.includes("无")) return "无：基本没有自然关联";
      return text(value, fallback.tileRelevance);
    }
    function mapMind(value) {
      const raw = text(value);
      if (raw.includes("强") || raw.includes("祈福") || raw.includes("纪念")) return "强：旅行纪念/祈福购买动机明确";
      if (raw.includes("中高") || raw.includes("伴手礼") || raw.includes("城市礼物")) return "中高：有伴手礼或城市礼物心智";
      if (raw.includes("中")) return "中：需现场陈列唤起";
      if (raw.includes("弱")) return "弱：游客主要不是来买纪念品";
      if (raw.includes("无")) return "无：产品心智错位";
      return text(value, fallback.commemorationMind);
    }
    function mapCultural(value) {
      const raw = text(value);
      if (raw.includes("国家") || raw.includes("世界") || raw.includes("5A") || raw.includes("文保") || raw.includes("非遗")) return "国家级/世界遗产/文保/非遗背书";
      if (raw.includes("省") || raw.includes("市") || raw.includes("历史街区") || raw.includes("地标")) return "省市级文化/历史街区背书";
      if (raw.includes("故事") || raw.includes("文化") || raw.includes("遗存")) return "有地方故事但官方标签弱";
      return raw.includes("无") ? "几乎无文化背书" : text(value, fallback.culturalEndorsement);
    }
    function mapBusiness(value) {
      const raw = text(value);
      if (raw.includes("采购") || raw.includes("保证金") || raw.includes("短账期") || raw.includes("无进场费")) return "优：采购/保证金覆盖/短账期/无进场费";
      if (raw.includes("拓市场") || raw.includes("免设计") || raw.includes("样品") || raw.includes("寄卖")) return "早期拓市场试点：寄卖/免设计/样品支持，复盘周期明确";
      if (raw.includes("低扣点") && (raw.includes("数据") || raw.includes("回款") || raw.includes("位置"))) return "优惠换资源：低扣点但位置/数据/回款未锁";
      if (raw.includes("差") || raw.includes("高扣点") || raw.includes("保底") || raw.includes("进场费")) return "差：高扣点/保底/进场费";
      if (raw.includes("不可") || raw.includes("亏损")) return "不可接受：测算亏损";
      return raw.includes("中") || raw.includes("谈判") || raw.includes("严") ? "中：扣点需谈判，账期/保底待确认" : text(value, fallback.businessTerms);
    }
    function mapCooperation(value) {
      const raw = text(value);
      if (raw.includes("高") || raw.includes("快速") || raw.includes("决策链短")) return "高：决策链短/配合强";
      if (raw.includes("混乱") || raw.includes("撤场")) return "混乱：随时可能撤场";
      if (raw.includes("低") || raw.includes("慢") || raw.includes("长")) return "低：响应慢/多头沟通";
      return raw.includes("中") || raw.includes("需走") || raw.includes("决策链") ? "中：需走景区/运营决策链" : text(value, fallback.cooperationEfficiency);
    }
    function mapOfficialCooperation(value) {
      const raw = text(value || spot.officialCooperation || spot.authSupport);
      if (raw.includes("官方授权") || raw.includes("官方直签")) return "官方直签/官方体系内合作";
      if (raw.includes("官方背书") || raw.includes("运营方") || raw.includes("总包")) return "官方认可的运营方/总包合作";
      if (raw.includes("门店")) return "景区内门店合作，可争取官方背书";
      if (raw.includes("无授权") || raw.includes("无官方")) return "纯门店合作，无官方关系";
      return text(value, fallback.officialCooperation);
    }
    function mapCoBrandAuth(value) {
      const raw = text(value || spot.coBrandAuth || spot.authSupport);
      if (raw.includes("官方授权") || raw.includes("联名")) return "可签官方授权联名并使用名称/LOGO/地标";
      if (raw.includes("官方背书") || raw.includes("地标") || raw.includes("名称")) return "可用景区名称/地标元素但不做正式联名";
      if (raw.includes("不允许")) return "不允许使用名称/地标元素";
      return raw.includes("无授权") ? "仅允许泛城市/泛文化表达" : text(value, fallback.coBrandAuth);
    }
    function mapMarketing(value) {
      const raw = text(value || spot.marketingResources || spot.promotionSupport);
      if (raw.includes("高") || raw.includes("官号/导览") || raw.includes("游客中心")) return "高：官号/活动/导览/游客中心可露出";
      if (raw.includes("中") || raw.includes("申请")) return "中：部分活动或官号资源可申请";
      if (raw.includes("无")) return "无营销资源";
      return raw.includes("低") || raw.includes("自带") ? "低：主要靠门店和自带内容" : text(value, fallback.marketingResources);
    }
    function mapDecoration(value) {
      const raw = text(value || spot.decorationResources || spot.displaySupport);
      if (raw.includes("装补") || raw.includes("提供展柜") || raw.includes("灯光")) return "高：装补/展柜/灯光/墙面资源明确";
      if (raw.includes("可谈") || raw.includes("部分")) return "中：可提供部分展柜或陈列物料";
      if (raw.includes("无")) return "无装补或物料支持";
      return raw.includes("常规") ? "低：仅给普通货架" : text(value, fallback.decorationResources);
    }
    function mapManpower(value) {
      const raw = text(value || spot.manpowerResources);
      if (raw.includes("高") || raw.includes("导购") || raw.includes("讲解") || raw.includes("数据")) return "高：导购/讲解/活动执行/销售数据可配合";
      if (raw.includes("无")) return "无：完全自运营";
      return raw.includes("中") || raw.includes("活动") ? "中：节点活动可临时配合" : text(value, fallback.manpowerResources);
    }
    function mapTraffic(value) {
      const raw = text(value || spot.officialTrafficResources || spot.promotionSupport);
      if (raw.includes("高") || raw.includes("联票") || raw.includes("导览")) return "高：官网/小程序/联票/导览可导流";
      if (raw.includes("中") || raw.includes("活动")) return "中：线上入口或活动页可尝试";
      return raw.includes("无") || raw.includes("低") ? "无线上或联票资源" : text(value, fallback.officialTrafficResources);
    }
    return canonicalScenarioOptions({
      id: text(spot.id) || `S${String(Date.now()).slice(-6)}`,
      name: text(spot.name || spot.spotName, fallback.spotName),
      nodeType: text(spot.nodeType || spot.granularity, "spot"),
      nodeTypeLabel: text(spot.nodeTypeLabel || spot.granularityLabel, "子级点位"),
      parentId: text(spot.parentId),
      parentName: text(spot.parentName),
      subAreaName: text(spot.subAreaName),
      operatingScene: text(spot.operatingScene),
      visitorProfile: text(spot.visitorProfile || spot.touristRatio),
      dataGranularity: text(spot.dataGranularity, "单点/片区"),
      inheritWarning: text(spot.inheritWarning),
      province: text(spot.province),
      city: text(spot.city, fallback.city),
      region: text(spot.region),
      priorityTier: text(spot.priorityTier, "待分级"),
      fitTags: list(spot.fitTags),
      scenicLevel: text(spot.scenicLevel, fallback.scenicLevel),
      annualVisitors: Number(spot.annualVisitors || 0),
      annualVisitorsUnknown: Boolean(spot.annualVisitorsUnknown || text(spot.annualVisitors).includes("不清楚")),
      dataYear: Number(spot.dataYear || fallback.dataYear || 2025),
      visitorDataBasis: text(spot.visitorDataBasis, "待补公开数据"),
      ticketMode: text(spot.ticketMode, fallback.ticketMode),
      ticketPrice: Number(spot.ticketPrice || 0),
      ticketPriceUnknown: Boolean(spot.ticketPriceUnknown || text(spot.ticketPrice).includes("不清楚")),
      scenicType: text(spot.scenicType, fallback.scenicType),
      tileRelevance: mapTile(spot.tileRelevance),
      commemorationMind: mapMind(spot.commemorationMind),
      youngSpread: mapAudience(spot.youngSpread),
      culturalEndorsement: mapCultural(spot.culturalEndorsement),
      location: "",
      store: "",
      display: "",
      businessTerms: "",
      cooperationEfficiency: "",
      officialCooperation: "",
      coBrandAuth: "",
      marketingResources: "",
      decorationResources: "",
      manpowerResources: "",
      officialTrafficResources: "",
      productSeries: text(spot.productSeries),
      dataStatus: text(spot.dataStatus, "待复核"),
      sourceName: text(spot.sourceName),
      sourceUrl: text(spot.sourceUrl),
      sourceCheckedAt: text(spot.sourceCheckedAt),
      verificationStatus: text(verification.verificationStatus || spot.verificationStatus, "needs_recheck"),
      verificationStatusLabel: text(verification.verificationStatusLabel || spot.verificationStatusLabel, "待多渠道复核"),
      verificationSourceCount: Number(verification.verificationSourceCount || spot.verificationSourceCount || 0),
      verificationChannels: list(verification.verificationChannels || spot.verificationChannels),
      verificationCheckedAt: text(verification.verificationCheckedAt || spot.verificationCheckedAt || spot.sourceCheckedAt),
      verificationNote: text(verification.verificationNote || spot.verificationNote),
      verificationWarnings: list(verification.verificationWarnings || spot.verificationWarnings),
      dataTrustLevel: text(verification.dataTrustLevel || spot.dataTrustLevel, "仅作销售线索"),
      trafficVerified: Boolean(verification.trafficVerified || spot.trafficVerified),
      businessDataUsable: Boolean(verification.businessDataUsable || spot.businessDataUsable),
      unknownFields: list(spot.unknownFields),
      note: text(spot.note)
    });
  }

  function normalizeScenicSpots(spots) {
    const used = new Set();
    return (Array.isArray(spots) ? spots : []).map((spot) => {
      const normalized = normalizeScenicSpot(spot);
      let id = normalized.id;
      let suffix = 2;
      while (used.has(id)) {
        id = `${normalized.id}-${suffix}`;
        suffix += 1;
      }
      used.add(id);
      return { ...normalized, id };
    });
  }

  function normalizeFulfillmentRecord(record) {
    const text = (value, fallback = "") => String(value === undefined || value === null ? fallback : value).trim();
    const list = (value) => {
      if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean);
      return text(value).split(/[，,、]/).map((item) => item.trim()).filter(Boolean);
    };
    const id = text(record.id || record.code) || `L${Date.now().toString(36)}`;
    return {
      id,
      code: text(record.code, id),
      orderId: text(record.orderId),
      customerId: text(record.customerId),
      ownerId: text(record.ownerId),
      ownerName: text(record.ownerName),
      ownerTeam: text(record.ownerTeam),
      pointName: text(record.pointName || record.name, "未命名点位"),
      folderName: text(record.folderName),
      cooperationType: text(record.cooperationType, "待核"),
      sourceFolderToken: text(record.sourceFolderToken),
      sourceFolderUrl: text(record.sourceFolderUrl),
      lastFileDate: text(record.lastFileDate),
      shipmentStatus: text(record.shipmentStatus, "资料缺失"),
      receiptStatus: text(record.receiptStatus, "资料缺失"),
      displayStatus: text(record.displayStatus, "待核"),
      shipmentBatchCount: Number(record.shipmentBatchCount || 0),
      shipmentQuantity: record.shipmentQuantity === null || record.shipmentQuantity === undefined || record.shipmentQuantity === "" ? null : Number(record.shipmentQuantity),
      shipmentQuantityNote: text(record.shipmentQuantityNote, "数量待核"),
      evidenceFiles: list(record.evidenceFiles),
      exceptionTags: list(record.exceptionTags),
      salesShelfStatus: text(record.salesShelfStatus, "待补录"),
      salesShelfDate: text(record.salesShelfDate),
      salesSellStatus: text(record.salesSellStatus, "待补录"),
      salesOwner: text(record.salesOwner),
      salesNote: text(record.salesNote),
      salesUpdatedAt: text(record.salesUpdatedAt),
      skuPlan: text(record.skuPlan),
      designRequirement: text(record.designRequirement),
      receiverInfo: text(record.receiverInfo),
      deliveryAddress: text(record.deliveryAddress),
      launchDate: text(record.launchDate),
      syncSource: text(record.syncSource, "库管供应组/瓦片点位发货清单"),
      syncCheckedAt: text(record.syncCheckedAt, "2026-07-07")
    };
  }

  function normalizeFulfillmentRecords(recordsInput) {
    const used = new Set();
    return (Array.isArray(recordsInput) ? recordsInput : []).map((record) => {
      const normalized = normalizeFulfillmentRecord(record);
      let id = normalized.id;
      let suffix = 2;
      while (used.has(id)) {
        id = `${normalized.id}-${suffix}`;
        suffix += 1;
      }
      used.add(id);
      return { ...normalized, id };
    });
  }

  function applyScenicDataMigrations(spots) {
    const defaultSpots = (window.DEFAULT_DATA && window.DEFAULT_DATA.scenicSpots) || [];
    const defaultById = new Map(defaultSpots.map((spot) => [spot.id, spot]));
    const migrated = spots.map((spot) => {
      const seed = defaultById.get(spot.id);
      if (!seed || seed.dataYear !== 2025) return spot;
      const shouldUseSeed = !spot.dataYear || spot.dataYear < 2025 || !String(spot.dataStatus || "").includes("已核");
      if (!shouldUseSeed) return spot;
      return normalizeScenicSpot({
        ...spot,
        annualVisitors: seed.annualVisitors,
        dataYear: seed.dataYear,
        visitorDataBasis: seed.visitorDataBasis,
        dataStatus: seed.dataStatus,
        annualVisitorsUnknown: seed.annualVisitorsUnknown,
        ticketMode: seed.ticketMode,
        ticketPrice: seed.ticketPrice,
        ticketPriceUnknown: seed.ticketPriceUnknown,
        verificationStatus: seed.verificationStatus,
        verificationStatusLabel: seed.verificationStatusLabel,
        verificationSourceCount: seed.verificationSourceCount,
        verificationChannels: seed.verificationChannels,
        verificationCheckedAt: seed.verificationCheckedAt,
        verificationNote: seed.verificationNote,
        verificationWarnings: seed.verificationWarnings,
        dataTrustLevel: seed.dataTrustLevel,
        trafficVerified: seed.trafficVerified,
        businessDataUsable: seed.businessDataUsable,
        unknownFields: seed.unknownFields,
        sourceName: seed.sourceName,
        sourceUrl: seed.sourceUrl,
        sourceCheckedAt: seed.sourceCheckedAt,
        note: seed.note
      });
    });
    const existingIds = new Set(migrated.map((spot) => spot.id));
    const legacyWuzhenIndex = migrated.findIndex((spot) => spot.id === "S001" && !spot.nodeType && String(spot.name || "").includes("西栅/东栅"));
    if (legacyWuzhenIndex >= 0 && defaultById.has("S001")) {
      migrated[legacyWuzhenIndex] = normalizeScenicSpot(defaultById.get("S001"));
    }
    const missingDefaultSpots = defaultSpots
      .filter((spot) => spot.id && !existingIds.has(spot.id))
      .map((spot) => normalizeScenicSpot(spot));
    if (missingDefaultSpots.length) {
      return migrated.concat(missingDefaultSpots);
    }
    return migrated;
  }

  function replaceScenicSpots(spots) {
    data.scenicSpots = normalizeScenicSpots(spots);
    persistScenicSpots();
    return data.scenicSpots;
  }

  function scenarioFromScenicSpot(spot) {
    const vetoDefaults = {};
    (data.rules.scoring.vetoRules || []).forEach((item) => {
      vetoDefaults[item.key] = false;
    });
    return {
      ...state.scenario,
      ...vetoDefaults,
      spotName: spot.name,
      scenicNodeType: spot.nodeType,
      scenicParentName: spot.parentName,
      scenicSubAreaName: spot.subAreaName,
      scenicOperatingScene: spot.operatingScene,
      scenicDataGranularity: spot.dataGranularity,
      city: spot.city,
      scenicLevel: spot.scenicLevel,
      annualVisitors: spot.annualVisitors,
      dataYear: spot.dataYear,
      visitorDataBasis: spot.visitorDataBasis,
      ticketMode: spot.ticketMode,
      ticketPrice: spot.ticketPrice,
      scenicType: spot.scenicType,
      tileRelevance: spot.tileRelevance,
      commemorationMind: spot.commemorationMind,
      youngSpread: spot.youngSpread,
      culturalEndorsement: spot.culturalEndorsement
    };
  }

  function publicScenarioForScenicSpot(spot) {
    return {
      ...data.defaultInputs.scenario,
      spotName: spot.name,
      scenicNodeType: spot.nodeType,
      scenicParentName: spot.parentName,
      scenicSubAreaName: spot.subAreaName,
      scenicOperatingScene: spot.operatingScene,
      scenicDataGranularity: spot.dataGranularity,
      city: spot.city,
      scenicLevel: spot.scenicLevel,
      annualVisitors: spot.annualVisitors,
      dataYear: spot.dataYear,
      visitorDataBasis: spot.visitorDataBasis,
      ticketMode: spot.ticketMode,
      ticketPrice: spot.ticketPrice,
      scenicType: spot.scenicType,
      tileRelevance: spot.tileRelevance,
      commemorationMind: spot.commemorationMind,
      youngSpread: spot.youngSpread,
      culturalEndorsement: spot.culturalEndorsement
    };
  }

  function applyScenicSpot(spotId) {
    const spot = data.scenicSpots.find((item) => item.id === spotId);
    if (!spot) return;
    state.scenario = scenarioFromScenicSpot(spot);
    persistState();
    renderApp();
    setActiveView("scenario");
  }

  function normalizeProduct(product) {
    const fallback = window.DEFAULT_DATA.products[0];
    const components = {};
    Object.keys(XJCore.componentLabels).forEach((key) => {
      components[key] = Number(product.components && product.components[key] !== undefined ? product.components[key] : 0);
    });
    const normalized = {
      id: String(product.id || "").trim() || nextProductId(),
      name: String(product.name || fallback.name).trim(),
      structure: String(product.structure || "1+X+N").trim(),
      spec: String(product.spec || "").trim(),
      bodyType: String(product.bodyType || product.productType || "手绘款").trim(),
      productClass: String(product.productClass || "大瓦").trim(),
      productType: String(product.productType || "手绘款").trim(),
      carrier: String(product.carrier || "").trim(),
      packageType: String(product.packageType || "").trim(),
      note: String(product.note || "").trim(),
      components
    };
    return {
      ...normalized,
      costPriceBands: XJCore.productCostPriceBands(data.rules, { ...normalized, costPriceBands: product.costPriceBands }),
      scenarioPriceBands: alignScenarioBandsWithGrades(XJCore.productScenarioPriceBands(data.rules, { ...normalized, scenarioPriceBands: product.scenarioPriceBands }))
    };
  }

  function normalizeProducts(products) {
    const used = new Set();
    return products.map((product) => {
      const normalized = normalizeProduct(product);
      let id = normalized.id;
      let suffix = 2;
      while (used.has(id)) {
        id = `${normalized.id}-${suffix}`;
        suffix += 1;
      }
      used.add(id);
      return { ...normalized, id };
    });
  }

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function money(value) {
    const number = XJCore.round(value, 2);
    return `¥${number.toLocaleString("zh-CN", { minimumFractionDigits: number % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
  }

  function percent(value) {
    return `${XJCore.pct(value)}%`;
  }

  function numberInput(attrs) {
    const step = attrs.step || "1";
    const min = attrs.min !== undefined ? ` min="${attrs.min}"` : "";
    const max = attrs.max !== undefined ? ` max="${attrs.max}"` : "";
    return `<input type="number" step="${step}"${min}${max} value="${escapeHtml(attrs.value)}" ${attrs.attr}>`;
  }

  function selectInput(value, options, attr) {
    return `<select ${attr}>${options.map((option) => {
      const selected = String(option.value) === String(value) ? " selected" : "";
      return `<option value="${escapeHtml(option.value)}"${selected}>${escapeHtml(option.label)}</option>`;
    }).join("")}</select>`;
  }

  function field(label, control, extra = "") {
    return `<label class="field"><span>${escapeHtml(label)}</span>${control}${extra ? `<small>${escapeHtml(extra)}</small>` : ""}</label>`;
  }

  const ruleSectionFieldMap = {
    price: ["highPriceCostShare", "managementReserveRate", "costPriceBands", "scenarioPriceBands"],
    grade: ["gradeParams", "gradeCaps"],
    scoring: ["scoring"],
    purchase: ["purchaseTiers", "totalPurchasePolicies"],
    commission: ["commissionRates", "consignmentCommissionBaseRate", "consignmentCommissionUpliftRate", "repeatCustomerFactor", "expansionBonuses", "purchaseCommissionTiers", "dataQualityFactors", "paymentFactors", "depositFactors"],
    sellThrough: ["consignmentIncentives", "sellThroughFactors"]
  };

  function scenarioPanelLabel(panel = activeScenarioPanel) {
    const labels = {
      save: uiLayout.texts.scenarioInfoTab || "景区信息",
      business: uiLayout.texts.businessTab || "商务条件",
      commission: uiLayout.texts.commissionTab || "模拟提成奖金",
      history: uiLayout.texts.historyTab || "历史测算"
    };
    return labels[panel] || panel;
  }

  function productPanelLabel(panel = activeProductPanel) {
    const labels = { category: "产品类别", sku: "SKU总表", measured: "测算产品" };
    return labels[panel] || panel;
  }

  function crmPanelKeys() {
    return Object.keys(crmPanelMeta);
  }

  function crmPanelLabel(panel = activeCrmPanel) {
    return (crmPanelMeta[panel] && crmPanelMeta[panel].label) || "管理驾驶舱";
  }

  function crmPanelDetail(panel = activeCrmPanel) {
    return (crmPanelMeta[panel] && crmPanelMeta[panel].detail) || "销售经营二级页";
  }

  function crmPanelCollection(panel = activeCrmPanel) {
    return crmPanelMeta[panel] && crmPanelMeta[panel].collection || "";
  }

  function crmPanelForCollection(collection) {
    return crmPanelKeys().find((key) => crmPanelMeta[key].collection === collection) || "dashboard";
  }

  function setActiveCrmPanel(panelName, options = {}) {
    const nextPanel = crmPanelMeta[panelName] ? panelName : "dashboard";
    activeCrmPanel = nextPanel;
    if (options.syncFilter !== false) {
      crmCollectionFilter = crmPanelCollection(nextPanel) || "all";
    }
  }

  function layoutDesignTargets() {
    const crmTargets = crmPanelKeys().map((panel) => ({
      group: "销售经营",
      view: "crm",
      crmPanel: panel,
      title: crmPanelLabel(panel),
      detail: crmPanelDetail(panel)
    }));
    const crmTargetByPanel = crmTargets.reduce((targets, target) => {
      targets[target.crmPanel] = target;
      return targets;
    }, {});
    return [
      crmTargetByPanel.dashboard,
      crmTargetByPanel.customers,
      { group: "销售经营", view: "records", title: "点位机会", detail: "机会池、公海认领、商务条件和模拟提成展开页" },
      crmTargetByPanel.contracts,
      crmTargetByPanel.orders,
      crmTargetByPanel.storeSales,
      { group: "点位评级", view: "scenario", scenarioPanel: "save", title: "场景评级", detail: "景区信息、实时摘要、右侧评级结果" },
      { group: "点位评级", view: "scenic-db", title: "景区库", detail: "基础库说明、筛选区、景区卡片列表" },
      { group: "履约动销", view: "fulfillment", title: "点位落地", detail: "已签点位发货、签收、上架和动销状态同步" },
      { group: "商品价格", view: "products", productPanel: "category", title: "产品库 · 产品类别", detail: "产品类别二级页和分类卡片" },
      { group: "商品价格", view: "products", productPanel: "sku", title: "产品库 · SKU总表", detail: "SKU筛选、列表和图片信息" },
      { group: "商品价格", view: "products", productPanel: "measured", title: "产品库 · 测算产品", detail: "测算产品表单、成本组件和价带配置" },
      { group: "商品价格", view: "pricing", title: "定价测算", detail: "渠道参数、成本摘要、场景摘要和定价结果" },
      { group: "商品价格", view: "cost", title: "成本库", detail: "产品选择、成本组件和成本结果" },
      { group: "系统管理", view: "settings", title: "规则参数", detail: "规则域、参数表格和当前规则页" },
      { group: "账号管理", view: "accounts", title: "账号权限", detail: "账号、角色、状态和模块权限" }
    ];
  }

  function currentContextInfo() {
    if (activeView === "crm") {
      return { host: "crm", scopeKey: `crm:${activeCrmPanel}`, title: `销售经营 · ${crmPanelLabel()}`, detail: crmPanelDetail(), saveLabel: `保存${crmPanelLabel()}`, exportLabel: "导出CRM", importLabel: "", exportable: true, importable: false };
    }
    if (activeView === "scenario") {
      return {
        host: "scenario",
        scopeKey: `scenario:${activeScenarioPanel}`,
        title: `场景评级 · ${scenarioPanelLabel()}`,
        detail: "当前页只保存景区评级填报；商务条件和提成测算进入点位机会查看",
        saveLabel: "保存测算",
        exportLabel: "导出本次测算",
        importLabel: "",
        exportable: true,
        importable: false
      };
    }
    if (activeView === "scenic-db") {
      return { host: "scenic-db", scopeKey: "scenic-db", title: "景区库", detail: "当前页只保存、导入和导出景区基础库", saveLabel: "保存景区库", exportLabel: "导出景区库", importLabel: "导入景区库", exportable: true, importable: true };
    }
    if (activeView === "cost") {
      return { host: "cost", scopeKey: "cost", title: "成本库", detail: "当前页只保存当前产品与成本测算参数", saveLabel: "保存成本页", exportLabel: "导出成本测算", importLabel: "", exportable: true, importable: false };
    }
    if (activeView === "pricing") {
      return { host: "pricing", scopeKey: "pricing", title: "定价测算", detail: "当前页只保存当前定价测算参数", saveLabel: "保存定价页", exportLabel: "导出定价测算", importLabel: "", exportable: true, importable: false };
    }
    if (activeView === "records") {
      return { host: "records", scopeKey: "records", title: "点位机会", detail: "当前页只保存和导出机会池、认领报备与测算记录", saveLabel: "保存机会池", exportLabel: "导出机会池", importLabel: "", exportable: true, importable: false };
    }
    if (activeView === "fulfillment") {
      return { host: "fulfillment", scopeKey: "fulfillment", title: "点位落地", detail: "当前页只保存销售补录的上架、动销和现场问题；库管发货/签收证据保持只读", saveLabel: "保存落地状态", exportLabel: "导出落地台账", importLabel: "导入落地台账", exportable: true, importable: true };
    }
    if (activeView === "products") {
      const productSaveLabel = activeProductPanel === "measured" && editingProductId ? "保存当前产品" : "保存当前产品页";
      return { host: "products", scopeKey: `products:${activeProductPanel}`, title: `产品库 · ${productPanelLabel()}`, detail: activeProductPanel === "sku" ? "当前页只导出SKU总表；SKU同步来源不在此手动导入" : "当前页只保存、导入和导出当前产品子页数据", saveLabel: productSaveLabel, exportLabel: activeProductPanel === "sku" ? "导出SKU总表" : "导出产品库", importLabel: "导入产品库", exportable: true, importable: activeProductPanel !== "sku" };
    }
    if (activeView === "settings") {
      const meta = sectionMeta[activeRuleSection] || sectionMeta.price;
      return { host: "settings", scopeKey: `settings:${activeRuleSection}`, title: `规则参数 · 一级域 ${meta.index} ${meta.title}`, detail: "当前页只保存、导入和导出当前规则域", saveLabel: "保存当前规则域", exportLabel: "导出当前规则域", importLabel: "导入当前规则域", exportable: true, importable: true };
    }
    if (activeView === "accounts") {
      return { host: "accounts", scopeKey: "accounts", title: "账号管理", detail: "当前页只保存账号、角色和权限配置", saveLabel: "保存账号权限", exportLabel: "导出账号权限", importLabel: "", exportable: true, importable: false };
    }
    return { host: activeView, scopeKey: activeView, title: activeView, detail: "当前页数据", saveLabel: "保存本页", exportLabel: "导出本页", importLabel: "", exportable: false, importable: false };
  }

  function currentUiScopeKey() {
    return currentContextInfo().scopeKey;
  }

  function closeUiEditorIfScopeChanged() {
    if (!uiEditMode) return;
    if (uiEditScope && uiEditScope !== currentUiScopeKey()) {
      uiEditMode = false;
      uiEditScope = "";
      renderUiEditor();
    }
  }

  function renderContextToolbar() {
    const context = currentContextInfo();
    qsa(".context-toolbar-host").forEach((host) => { host.innerHTML = ""; });
    const host = qs(`[data-context-host="${context.host}"]`);
    if (!host) return;
    const saveBlockMessage = scenarioSaveBlockMessage();
    const saveDisabled = activeView === "scenario" && Boolean(saveBlockMessage);
    host.innerHTML = `
      <div class="context-toolbar" data-context-scope="${escapeHtml(context.scopeKey)}">
        <div class="context-toolbar-copy">
          <strong>${escapeHtml(context.title)}</strong>
          <span>${escapeHtml(context.detail)}</span>
          <em id="contextToolbarStatus"></em>
        </div>
        <div class="context-toolbar-actions">
          <button type="button" class="primary${saveDisabled ? " disabled" : ""}" data-context-action="save"${saveDisabled ? ` disabled title="${escapeHtml(saveBlockMessage)}"` : ""}>${escapeHtml(context.saveLabel)}</button>
          ${context.exportable ? `<button type="button" data-context-action="export">${escapeHtml(context.exportLabel)}</button>` : ""}
          ${context.importable ? `<label class="import-label context-import-label">${escapeHtml(context.importLabel)}<input type="file" data-context-import accept="application/json,.json"></label>` : ""}
        </div>
      </div>`;
  }

  function nextProductId() {
    let max = 0;
    data.products.forEach((product) => {
      const matched = /^P(\d+)$/i.exec(product.id);
      if (matched) max = Math.max(max, Number(matched[1]));
    });
    return `P${String(max + 1).padStart(3, "0")}`;
  }

  function blankProduct(seed = {}) {
    return normalizeProduct({
      id: nextProductId(),
      name: "新产品",
      structure: "1+X+N",
      spec: "大瓦6x8",
      bodyType: "手绘款",
      productClass: "大瓦",
      productType: "手绘款",
      carrier: "冰箱贴",
      packageType: "挂钩式",
      note: "",
      components: {
        tile: 1.8,
        uv: 1,
        handPaint: 6,
        craft: 0,
        carrier: 1,
        package: 1,
        customAuth: 0.7,
        loss: 3,
        logistics: 0.5
      },
      ...seed
    });
  }

  function productField(name, value, label, type = "text", extraAttrs = "") {
    return field(label, `<input type="${type}" value="${escapeHtml(value)}" data-product-field="${escapeHtml(name)}" ${extraAttrs}>`);
  }

  function productSelect(name, value, label, options) {
    return field(label, selectInput(value, options.map((option) => ({ value: option, label: option })), `data-product-field="${escapeHtml(name)}"`));
  }

  function productCostBandRow(band) {
    return `<tr data-product-cost-band>
      <td><input type="number" step="0.1" min="0" value="${escapeHtml(band.maxCost)}" data-product-cost-band-field="maxCost"></td>
      <td><input type="number" step="1" min="0" value="${escapeHtml(band.retail)}" data-product-cost-band-field="retail"></td>
      <td><input type="text" value="${escapeHtml(band.label || band.retail)}" data-product-cost-band-field="label"></td>
      <td><button type="button" class="rule-delete-btn" data-delete-product-band="cost">删除</button></td>
    </tr>`;
  }

  function productScenarioBandRow(band, index = 0) {
    const grade = band.grade || ruleGradeOrder()[index] || "";
    const minScore = grade ? gradeThreshold(grade, band.minScore) : Number(band.minScore) || 0;
    return `<tr data-product-scenario-band>
      <td>${scenarioBandGradeLabel({ ...band, grade, minScore }, index)}<input type="hidden" value="${escapeHtml(minScore)}" data-product-scenario-band-field="minScore"><input type="hidden" value="${escapeHtml(grade)}" data-product-scenario-band-field="grade"></td>
      <td><input type="number" step="1" min="0" value="${escapeHtml(band.retail)}" data-product-scenario-band-field="retail"></td>
      <td><input type="text" value="${escapeHtml(band.label || band.retail)}" data-product-scenario-band-field="label"></td>
      <td><button type="button" class="rule-delete-btn" data-delete-product-band="scenario">删除</button></td>
    </tr>`;
  }

  function currentResult() {
    return XJCore.calculate(data, state);
  }

  function ruleGradeOrder() {
    return XJCore.getGradeOrder ? XJCore.getGradeOrder(data.rules) : XJCore.gradeOrder;
  }

  function pricingModeOptions(mode) {
    const names = Object.keys(data.rules.commissionRates);
    return names.filter((name) => mode === "consignment" ? name.includes("寄售") : !name.includes("寄售"));
  }

  function ensurePricingModeState() {
    const options = pricingModeOptions(activePricingMode);
    if (!options.length || options.includes(state.channel.mode)) return;
    state.channel.mode = options[0];
    persistState();
  }

  function renderAccountBar() {
    const account = currentAccount();
    const activePreset = accounts.some((item) => item.id === account.id) ? account.id : "";
    const loginText = hasAccount() ? `${account.role} · ${account.team || "未分组"} · ${currentAccountScopeText()}` : "未登录";
    const security = accountSecurityHealth(account);
    if (!hasAccount()) {
      setHtml("accountBar", `
        <div class="account-card logged-out">
          <div class="account-card-head">
            <span>账号登录</span>
            <strong>未登录</strong>
            <small>admin/XJadmin2026! · sales/XJsales2026! · channel/XJchannel2026!</small>
          </div>
          <div class="account-login-fields">
            ${selectInput(activePreset, accountSelectOptions(), 'id="accountPresetSelect" aria-label="选择账号"')}
            <input type="password" id="accountPasswordInput" value="" placeholder="登录口令" aria-label="登录口令">
            <button type="button" class="primary" data-login-submit>登录</button>
            ${accountLoginError ? `<em>${escapeHtml(accountLoginError)}</em>` : `<em>本地演示口令，正式多人使用需接飞书身份或后端。</em>`}
          </div>
        </div>
      `);
      return;
    }
    setHtml("accountBar", `
      <div class="account-card${hasAccount() ? "" : " logged-out"}">
        <div class="account-card-head">
          <span>当前账号</span>
          <strong>${escapeHtml(hasAccount() ? account.name : "未登录")}</strong>
          <small>${escapeHtml(loginText)} · ${escapeHtml(security.label)}</small>
        </div>
        <div class="account-session-actions">
          <span>${escapeHtml(account.loginName)} · ${escapeHtml(account.loginAt || "刚刚登录")}</span>
          ${accountHasPermission("accounts", "view") ? `<button type="button" data-view-target="accounts">账号管理</button>` : ""}
          <button type="button" data-toggle-password-panel>${accountPasswordPanelOpen ? "收起改密" : "修改口令"}</button>
          <button type="button" data-logout-account>退出</button>
        </div>
        ${accountPasswordPanelOpen ? `<div class="account-password-panel">
          <input type="password" id="currentPasswordInput" placeholder="当前口令" aria-label="当前口令">
          <input type="password" id="newPasswordInput" placeholder="新口令" aria-label="新口令">
          <input type="password" id="confirmPasswordInput" placeholder="确认新口令" aria-label="确认新口令">
          <button type="button" class="primary" data-change-password-submit>确认修改</button>
          <em>${escapeHtml(accountPasswordChangeError || security.detail)}</em>
        </div>` : ""}
      </div>
    `);
  }

  function permissionGateHtml(title, detail) {
    return `<div class="permission-gate">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(detail)}</span>
      <small>请切换到有权限的账号，或让管理员在“账号管理”里开放权限。</small>
    </div>`;
  }

  function crmOwnerVisible(row) {
    return accountCanSeeOwnerIdentity(ownerIdentityFromRow(row));
  }

  function crmOwnerMatchesFilter(row) {
    if (!crmOwnerFilter) return true;
    if (!row) return false;
    const owner = accounts.find((account) => account.id === crmOwnerFilter);
    const ownerName = owner ? owner.name : crmOwnerFilter;
    return row.ownerId === crmOwnerFilter
      || row.ownerName === ownerName
      || row.accountId === crmOwnerFilter
      || row.operatorName === ownerName
      || row.opportunityOwnerId === crmOwnerFilter
      || row.opportunityOwner === ownerName
      || row.salesOwner === ownerName;
  }

  function crmRowSearchText(collection, row) {
    const customerName = row && row.customerId ? crmCustomerName(row.customerId) : "";
    return [
      collection,
      customerName,
      row && Object.values(row).filter((value) => value !== null && value !== undefined && typeof value !== "object").join(" ")
    ].join(" ").toLowerCase();
  }

  function crmSearchMatches(collection, row) {
    const keyword = crmSearch.trim().toLowerCase();
    if (!keyword) return true;
    return crmRowSearchText(collection, row).includes(keyword);
  }

  function crmFiltersActive() {
    return Boolean(crmSearch.trim() || crmOwnerFilter || crmCollectionFilter !== "all");
  }

  function crmRowMatchesFilters(collection, row) {
    return crmOwnerVisible(row) && crmOwnerMatchesFilter(row) && crmSearchMatches(collection, row);
  }

  function crmRows(collection) {
    const rows = crmWorkspace[collection] || [];
    return rows.filter((row) => crmRowMatchesFilters(collection, row));
  }

  function crmCurrency(value) {
    return money(Number(value) || 0);
  }

  function crmDateStatus(dateValue) {
    if (!dateValue) return { label: "未排期", days: 9999, tone: "neutral" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return { label: "日期待核", days: 9999, tone: "neutral" };
    const days = Math.round((date - today) / 86400000);
    if (days < 0) return { label: `逾期${Math.abs(days)}天`, days, tone: "weak" };
    if (days === 0) return { label: "今天", days, tone: "mid-high" };
    if (days <= 3) return { label: `${days}天内`, days, tone: "medium" };
    return { label: `${days}天后`, days, tone: "neutral" };
  }

  function crmDatePlusDays(dateValue, days) {
    const base = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
    if (Number.isNaN(base.getTime())) return "";
    base.setDate(base.getDate() + days);
    return base.toISOString().slice(0, 10);
  }

  function contractReceivableRemaining(contract) {
    return Math.max(0, (Number(contract && contract.amount) || 0) - (Number(contract && contract.paidAmount) || 0));
  }

  function contractPaymentStatus(contract) {
    const remaining = contractReceivableRemaining(contract);
    const paid = Number(contract && contract.paidAmount) || 0;
    const amount = Number(contract && contract.amount) || 0;
    if (!amount && !paid) return contract && contract.paymentStatus || "待确认";
    if (remaining <= 0 && amount > 0) return "已回款";
    if (paid > 0) return "部分回款";
    const due = crmDateStatus(contract && contract.receivableDueDate);
    if (due.days < 0) return "逾期未回款";
    return contract && contract.paymentStatus && contract.paymentStatus !== "待确认" ? contract.paymentStatus : "待回款";
  }

  function contractPaymentTone(contract) {
    const status = contractPaymentStatus(contract);
    if (status === "已回款") return "strong";
    if (status === "部分回款") return "medium";
    if (status === "逾期未回款") return "weak";
    return "neutral";
  }

  function saleGrossProfit(sale) {
    return Number(sale && sale.grossProfitAmount) || Math.max(0, (Number(sale && sale.receiptAmount) || 0) - (Number(sale && sale.salesCostAmount) || 0));
  }

  function saleEstimatedCommission(sale) {
    if (sale && Number(sale.estimatedCommission)) return Number(sale.estimatedCommission);
    return Math.round((Number(sale && sale.receiptAmount) || 0) * 0.1);
  }

  function saleReviewModel(sale) {
    const sellThrough = Number(sale && sale.sellThroughRate) || 0;
    const receiptAmount = Number(sale && sale.receiptAmount) || 0;
    const salesAmount = Number(sale && sale.salesAmount) || 0;
    const soldQty = Number(sale && sale.soldQty) || 0;
    const stockQty = Number(sale && sale.stockQty) || 0;
    const derivedSellThrough = stockQty > 0 ? Math.min(100, Math.round((soldQty / Math.max(stockQty, 1)) * 100)) : 0;
    const effectiveSellThrough = sellThrough || derivedSellThrough;
    const suggestedQty = stockQty || soldQty
      ? Math.max(20, Math.ceil(Math.max(soldQty, stockQty * 0.4) / 10) * 10)
      : 0;
    if (!salesAmount && !receiptAmount && !effectiveSellThrough && !soldQty) {
      return {
        status: "待录入",
        priority: "待录入",
        canReplenish: false,
        nextReviewDays: 1,
        suggestedQty: 0,
        advice: "待录入销售、回款、销量和动销数据后复盘",
        summary: "数据未完整"
      };
    }
    if (effectiveSellThrough >= 80 && (receiptAmount >= 5000 || soldQty >= 30)) {
      return {
        status: "已复盘",
        priority: "高优先级",
        canReplenish: true,
        nextReviewDays: 3,
        suggestedQty: suggestedQty || 20,
        advice: `强补货：动销${effectiveSellThrough}% / 回款${crmCurrency(receiptAmount)}，优先补畅销SKU并锁定下批交期`,
        summary: "高动销高优先级补货"
      };
    }
    if (effectiveSellThrough >= 65 || receiptAmount >= 10000) {
      return {
        status: "已复盘",
        priority: "建议补货",
        canReplenish: true,
        nextReviewDays: 7,
        suggestedQty: suggestedQty || 20,
        advice: `建议补货：动销${effectiveSellThrough}% / 回款${crmCurrency(receiptAmount)}，按近7-14天节奏补畅销SKU`,
        summary: "建议进入补货"
      };
    }
    if (effectiveSellThrough >= 35 || receiptAmount > 0 || salesAmount > 0 || soldQty > 0) {
      return {
        status: "已复盘",
        priority: "先复盘",
        canReplenish: false,
        nextReviewDays: 7,
        suggestedQty: 0,
        advice: `先复盘：动销${effectiveSellThrough}% / 回款${crmCurrency(receiptAmount)}，先看陈列、客流和话术再决定小批补货`,
        summary: "需优化陈列/话术后再判断"
      };
    }
    return {
      status: "已复盘",
      priority: "暂不补货",
      canReplenish: false,
      nextReviewDays: 14,
      suggestedQty: 0,
      advice: "暂不补货：动销和回款不足，先检查陈列、客流入口、价格带和导购话术",
      summary: "暂不补货"
    };
  }

  function saleReviewPriority(sale) {
    if (sale && sale.replenishmentPriority && !["待判断", "待录入"].includes(sale.replenishmentPriority)) return sale.replenishmentPriority;
    return saleReviewModel(sale).priority;
  }

  function crmTaskPanel(type) {
    if (type === "客户客资") return "customers";
    if (type === "合同" || type === "合同回款") return "contracts";
    if (type === "订单/MES") return "orders";
    if (type === "门店销售") return "storeSales";
    return "dashboard";
  }

  function crmTaskMatchesPanel(item, panel) {
    if (!panel || panel === "dashboard") return true;
    return item.panel === panel;
  }

  function crmTaskCard(item) {
    const canEditTask = item.targetType === "records"
      ? accountCanModuleAction("opportunities", "edit")
      : crmCanEditCollection(item.targetType);
    const targetAttrs = [
      `data-crm-task-type="${escapeHtml(item.targetType || "")}"`,
      `data-crm-task-id="${escapeHtml(item.targetId || "")}"`,
      `data-crm-task-kind="${escapeHtml(item.taskKind || "")}"`,
      `data-crm-task-panel="${escapeHtml(item.panel || crmTaskPanel(item.type))}"`
    ].join(" ");
    return `<article class="crm-task-card ${escapeHtml(item.tone || "neutral")}" data-crm-task-card ${targetAttrs}>
      <div class="crm-task-main">
        <span>${escapeHtml(item.type)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.detail)}</small>
        <em>${escapeHtml(item.dueLabel || "未排期")}</em>
      </div>
      <div class="crm-task-actions">
        <button type="button" data-crm-task-open${item.targetId ? "" : " disabled"}>处理</button>
        <button type="button" data-crm-task-postpone="3"${item.targetId && canEditTask ? "" : " disabled"}>顺延3天</button>
      </div>
    </article>`;
  }

  function crmStageFromRecord(record) {
    if (!record) return "未评级";
    ensureOpportunityFields(record);
    const status = record.opportunityStatus || "公海线索";
    if (status.includes("公海")) return "客户线索";
    if (status === "已认领" || status === "报备待审" || status === "报备驳回/补充材料" || status === "报备通过") return "评级/报备";
    if (status === "商务洽谈" || status === "条件审批") return "合同商务";
    if (status.includes("签约") || status === "运营中") return "订单/运营";
    return status;
  }

  function crmActionItems(options = {}) {
    const items = [];
    crmRows("customers").forEach((customer) => {
      const due = crmDateStatus(customer.nextActionAt);
      const health = customerLeadHealth(customer);
      if (health.actionable || customer.nextAction || due.days <= 3) {
        items.push({
          type: "客户客资",
          targetType: "customers",
          targetId: customer.id || "",
          taskKind: "followup",
          panel: "customers",
          title: customer.name || "未命名客户",
          detail: `${health.label} · ${customer.nextAction || health.detail || "补齐联系人、来源和下一步动作"}`,
          dueLabel: customer.nextActionAt ? due.label : health.detail,
          dueDays: customer.nextActionAt ? due.days : health.tone === "weak" ? -1 : 7,
          tone: health.actionable ? health.tone : due.tone
        });
      }
    });
    records
      .filter((record) => accountCanViewAll() || isPublicOpportunity(record) || accountMatchesRecord(record))
      .forEach((record) => {
        ensureOpportunityFields(record);
        const due = crmDateStatus(record.opportunityNextActionAt || record.opportunityProtectionUntil);
        if (record.opportunityNextAction || due.days <= 3 || record.opportunityStatus === "报备待审") {
          items.push({
            type: "点位机会",
            targetType: "records",
            targetId: record.id || "",
            taskKind: "opportunity",
            panel: "records",
            title: record.spotName || record.opportunityPointScope || "未命名点位",
            detail: `${record.opportunityStatus || "未跟进"} · ${record.opportunityNextAction || "补齐下一步动作和证据"}`,
            dueLabel: due.label,
            dueDays: due.days,
            tone: record.opportunityStatus === "报备待审" ? "mid-high" : due.tone
          });
        }
      });
    crmRows("contracts").forEach((contract) => {
      const due = crmDateStatus(contract.signDate);
      if (!["已签约", "归档"].includes(contract.status)) {
        items.push({
          type: "合同",
          targetType: "contracts",
          targetId: contract.id || "",
          taskKind: "contract",
          panel: "contracts",
          title: contract.pointName || contract.template || "未命名合同",
          detail: `${contract.status || "待制作"} · ${contract.nextAction || "制作/审核/发送合同"}`,
          dueLabel: contract.signDate ? due.label : "待定稿",
          dueDays: contract.signDate ? due.days : 30,
          tone: contract.status === "法务/商务审核" ? "medium" : due.tone
        });
      }
      const paymentStatus = contractPaymentStatus(contract);
      const paymentDue = crmDateStatus(contract.receivableDueDate);
      if (["已签约", "归档"].includes(contract.status) && paymentStatus !== "已回款") {
        items.push({
          type: "合同回款",
          targetType: "contracts",
          targetId: contract.id || "",
          taskKind: "payment",
          panel: "contracts",
          title: contract.pointName || contract.template || "未命名合同",
          detail: `${paymentStatus} · 剩余应收${crmCurrency(contractReceivableRemaining(contract))}`,
          dueLabel: contract.receivableDueDate ? paymentDue.label : "待排回款日",
          dueDays: contract.receivableDueDate ? paymentDue.days : 14,
          tone: paymentStatus === "逾期未回款" ? "weak" : paymentDue.tone
        });
      }
    });
    crmRows("orders").forEach((order) => {
      const due = crmDateStatus(order.dueDate);
      if (!["已完成"].includes(order.mesStatus)) {
        items.push({
          type: "订单/MES",
          targetType: "orders",
          targetId: order.id || "",
          taskKind: "delivery",
          panel: "orders",
          title: order.pointName || order.orderType || "未命名订单",
          detail: `${order.mesStatus || "待下单"} · ${order.quantity || 0}件 · ${crmCurrency(order.amount)}`,
          dueLabel: due.label,
          dueDays: due.days,
          tone: order.mesStatus === "待下单" ? "mid-high" : due.tone
        });
      }
    });
    crmRows("storeSales").forEach((sale) => {
      const sellThrough = Number(sale.sellThroughRate) || 0;
      const review = saleReviewModel(sale);
      const due = crmDateStatus(sale.reviewDueDate);
      if (review.priority === "待录入" || sale.reviewStatus !== "已生成补货订单" && (due.days <= 3 || review.canReplenish)) {
        items.push({
          type: "门店销售",
          targetType: "storeSales",
          targetId: sale.id || "",
          taskKind: "review",
          panel: "storeSales",
          title: sale.pointName || "未命名门店",
          detail: `${sale.month || "本月"} · ${review.priority} · 回款${crmCurrency(sale.receiptAmount)} · 动销${sellThrough || 0}%`,
          dueLabel: sale.reviewDueDate ? due.label : review.priority === "待录入" ? "待录入" : "需复盘",
          dueDays: sale.reviewDueDate ? due.days : review.priority === "待录入" ? 1 : review.nextReviewDays,
          tone: review.priority === "待录入" ? "weak" : review.canReplenish ? "mid-high" : "medium"
        });
      }
    });
    const limit = Number(options.limit) > 0 ? Number(options.limit) : 8;
    return items
      .filter((item) => crmTaskMatchesPanel(item, options.panel))
      .sort((left, right) => (left.dueDays || 0) - (right.dueDays || 0))
      .slice(0, limit);
  }

  function crmRiskItems(lifecycleRows) {
    const risks = [];
    crmRows("customers")
      .map((customer) => ({ customer, health: customerLeadHealth(customer) }))
      .filter(({ health }) => health.actionable)
      .slice(0, 4)
      .forEach(({ customer, health }) => {
        risks.push({
          type: "客资治理",
          title: customer.name || "未命名客户",
          detail: `${health.label} · ${health.detail}`,
          tone: health.tone
        });
      });
    lifecycleRows.forEach((row) => {
      if (row.opportunity !== "未建机会" && row.contract === "待合同") {
        risks.push({ type: "断点", title: row.pointName, detail: "已有机会但未生成合同", tone: "weak" });
      }
      if (row.contract !== "待合同" && row.order === "待订单") {
        risks.push({ type: "断点", title: row.pointName, detail: "已有合同但未生成订单/MES", tone: "medium" });
      }
      if (row.order !== "待订单" && row.sales === "待销售数据") {
        risks.push({ type: "落地", title: row.pointName, detail: "已有订单但未建门店销售跟踪", tone: "medium" });
      }
    });
    data.fulfillmentRecords
      .filter(fulfillmentVisibleToAccount)
      .filter((record) => (record.exceptionTags || []).length)
      .slice(0, 4)
      .forEach((record) => {
        risks.push({ type: "发货异常", title: record.pointName, detail: (record.exceptionTags || []).join("；"), tone: "weak" });
      });
    crmRows("contracts").forEach((contract) => {
      const paymentStatus = contractPaymentStatus(contract);
      if (paymentStatus === "逾期未回款" || contractReceivableRemaining(contract) > 0 && ["已签约", "归档"].includes(contract.status)) {
        risks.push({ type: "合同应收", title: contract.pointName || "未命名合同", detail: `${paymentStatus} · 剩余应收${crmCurrency(contractReceivableRemaining(contract))}`, tone: paymentStatus === "逾期未回款" ? "weak" : "medium" });
      }
      if (contract.invoiceStatus === "开票异常") {
        risks.push({ type: "开票异常", title: contract.pointName || "未命名合同", detail: contract.invoiceInfo || "开票信息待核", tone: "weak" });
      }
    });
    crmRows("storeSales").forEach((sale) => {
      const review = saleReviewModel(sale);
      if (review.priority === "待录入" || review.priority === "先复盘" || review.priority === "暂不补货") {
        risks.push({ type: "动销复盘", title: sale.pointName || "未命名门店", detail: `${sale.month || "本月"} · ${review.priority} · ${review.advice}`, tone: review.priority === "待录入" ? "weak" : "medium" });
      }
    });
    return risks.slice(0, 8);
  }

  function renderCrmPanelTaskQueue(panel) {
    if (!panel || panel === "dashboard") return "";
    const tasks = crmActionItems({ panel, limit: 5 });
    return `<section class="crm-section crm-panel-task-queue">
      <div class="crm-section-head">
        <div><strong>${escapeHtml(crmPanelLabel(panel))}待办</strong><span>${escapeHtml(crmPanelDetail(panel))}</span></div>
      </div>
      <div class="crm-task-list compact">${tasks.map(crmTaskCard).join("") || `<p class="empty">当前子页暂无待办。需要推进时，补下一步动作和日期即可进入队列。</p>`}</div>
    </section>`;
  }

  function crmPriorityMeta(item) {
    const dueDays = Number(item && item.dueDays);
    const isWeak = item && item.tone === "weak";
    if (Number.isFinite(dueDays) && dueDays < 0 || isWeak) return { level: "P0", tone: "weak", label: "立即处理" };
    if (Number.isFinite(dueDays) && dueDays <= 1 || item && item.tone === "mid-high") return { level: "P1", tone: "mid-high", label: "今天推进" };
    if (Number.isFinite(dueDays) && dueDays <= 3 || item && item.tone === "medium") return { level: "P2", tone: "medium", label: "三天内" };
    return { level: "P3", tone: "neutral", label: "排期跟进" };
  }

  function crmSuggestedAction(item) {
    if (!item) return "补齐下一步动作和负责人";
    if (item.targetType === "customers") return "确认联系人、角色、联系方式和首次跟进日期";
    if (item.targetType === "records") {
      if (item.taskKind === "opportunity") return "补证据、更新报备状态，并明确下一次沟通动作";
      return "推进点位机会到合同、订单或动销下一环节";
    }
    if (item.targetType === "contracts") {
      if (item.taskKind === "payment") return "核对回款节点、开票信息和对账责任人";
      return "确认合同主体、授权边界、扣点/账期和签约日期";
    }
    if (item.targetType === "orders") return "补齐SKU、数量、收货信息，并推进MES状态";
    if (item.targetType === "storeSales") return "录入销售额、回款、库存和动销率，判断是否补货";
    return item.detail || "补齐下一步动作";
  }

  function renderCrmPriorityQueue() {
    const tasks = crmActionItems({ limit: 12 });
    const buckets = {
      overdue: tasks.filter((item) => Number(item.dueDays) < 0).length,
      today: tasks.filter((item) => Number(item.dueDays) >= 0 && Number(item.dueDays) <= 1).length,
      week: tasks.filter((item) => Number(item.dueDays) > 1 && Number(item.dueDays) <= 7).length,
      unplanned: tasks.filter((item) => !item.dueLabel || item.dueLabel === "未排期" || String(item.dueLabel).includes("待")).length
    };
    const rows = tasks.slice(0, 6).map((item) => {
      const priority = crmPriorityMeta(item);
      const targetAttrs = [
        `data-crm-task-type="${escapeHtml(item.targetType || "")}"`,
        `data-crm-task-id="${escapeHtml(item.targetId || "")}"`,
        `data-crm-task-kind="${escapeHtml(item.taskKind || "")}"`,
        `data-crm-task-panel="${escapeHtml(item.panel || crmTaskPanel(item.type))}"`
      ].join(" ");
      return `<article class="crm-priority-row ${escapeHtml(priority.tone)}" data-crm-task-card ${targetAttrs}>
        <b>${escapeHtml(priority.level)}</b>
        <div>
          <span>${escapeHtml(item.type || "待办")} · ${escapeHtml(priority.label)} · ${escapeHtml(item.dueLabel || "未排期")}</span>
          <strong>${escapeHtml(item.title || "未命名事项")}</strong>
          <small>${escapeHtml(crmSuggestedAction(item))}</small>
        </div>
        <button type="button" data-crm-task-open${item.targetId ? "" : " disabled"}>处理</button>
      </article>`;
    }).join("");
    return `<section class="crm-section crm-priority-queue">
      <div class="crm-section-head">
        <div><strong>今日优先级队列</strong><span>按逾期、今天、三天内和未排期自动排序，销售打开后先处理这里</span></div>
      </div>
      <div class="crm-priority-stats">
        <div><span>逾期</span><strong>${buckets.overdue}</strong></div>
        <div><span>今天</span><strong>${buckets.today}</strong></div>
        <div><span>7天内</span><strong>${buckets.week}</strong></div>
        <div><span>待排期</span><strong>${buckets.unplanned}</strong></div>
      </div>
      <div class="crm-priority-list">${rows || `<p class="empty">当前没有优先待办。给客户、机会、合同或订单补下一步日期后会自动进入队列。</p>`}</div>
    </section>`;
  }

  function crmTaskDescriptorFromButton(button) {
    const card = button && button.closest("[data-crm-task-card]");
    return {
      targetType: card ? card.dataset.crmTaskType || "" : "",
      targetId: card ? card.dataset.crmTaskId || "" : "",
      taskKind: card ? card.dataset.crmTaskKind || "" : "",
      panel: card ? card.dataset.crmTaskPanel || "" : ""
    };
  }

  function crmTaskTarget(descriptor) {
    if (!descriptor || !descriptor.targetType || !descriptor.targetId) return null;
    if (descriptor.targetType === "records") return records.find((record) => record.id === descriptor.targetId) || null;
    const rows = crmWorkspace[descriptor.targetType] || [];
    return rows.find((row) => row.id === descriptor.targetId) || null;
  }

  function crmTaskTitleForTarget(target) {
    return target && (target.pointName || target.name || target.spotName || target.opportunityPointScope || target.orderType || target.template) || "未命名待办";
  }

  function crmFutureDate(currentDate, days) {
    const status = crmDateStatus(currentDate);
    return crmDatePlusDays(status.days > 0 ? currentDate : "", days);
  }

  function openCrmTask(descriptor) {
    const target = crmTaskTarget(descriptor);
    if (!target) {
      flashContextToolbar("这条待办关联的数据不存在，可能已被删除或被筛选隐藏。");
      return;
    }
    if (descriptor.targetType === "records") {
      const index = records.findIndex((record) => record.id === descriptor.targetId);
      activeRecordView = isPublicOpportunity(target) ? "pool" : accountOwnsRecord(target) ? "mine" : "funnel";
      if (index >= 0) activeRecordPanels[recordKey(target, index)] = "claim";
      renderRecords();
      setActiveView("records");
      flashContextToolbar("已打开点位机会跟进页");
      return;
    }
    setActiveCrmPanel(descriptor.panel || crmPanelForCollection(descriptor.targetType));
    setActiveView("crm");
    renderCrmWorkspace();
    flashContextToolbar(`已打开${crmPanelLabel(activeCrmPanel)}页`);
  }

  function postponeCrmTask(descriptor, days = 3) {
    const target = crmTaskTarget(descriptor);
    if (!target) {
      flashContextToolbar("这条待办关联的数据不存在，无法顺延。");
      return;
    }
    const canEditTask = descriptor.targetType === "records"
      ? accountCanModuleAction("opportunities", "edit")
      : crmCanEditCollection(descriptor.targetType);
    if (!canEditTask) {
      alert("当前账号没有顺延这条待办的编辑权限。");
      return;
    }
    const nextDate = (() => {
      if (descriptor.targetType === "customers") {
        target.nextActionAt = crmFutureDate(target.nextActionAt, days);
        if (!target.nextAction) target.nextAction = "补齐联系人、点位信息和下一步动作";
        target.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
        return target.nextActionAt;
      }
      if (descriptor.targetType === "records") {
        target.opportunityNextActionAt = crmFutureDate(target.opportunityNextActionAt, days);
        if (!target.opportunityNextAction) target.opportunityNextAction = "补齐下一步动作和证据";
        return target.opportunityNextActionAt;
      }
      if (descriptor.targetType === "contracts") {
        if (descriptor.taskKind === "payment") {
          target.receivableDueDate = crmFutureDate(target.receivableDueDate, days);
          if (!target.nextAction) target.nextAction = "跟进回款节点和开票资料";
          return target.receivableDueDate;
        }
        target.signDate = crmFutureDate(target.signDate, days);
        if (!target.nextAction) target.nextAction = "跟进合同主体、授权边界和签约反馈";
        return target.signDate;
      }
      if (descriptor.targetType === "orders") {
        target.dueDate = crmFutureDate(target.dueDate, days);
        if (!target.note) target.note = "已顺延交付跟进日期";
        return target.dueDate;
      }
      if (descriptor.targetType === "storeSales") {
        target.reviewDueDate = crmFutureDate(target.reviewDueDate, days);
        if (!target.replenishmentAdvice) target.replenishmentAdvice = "已顺延销售复盘日期";
        return target.reviewDueDate;
      }
      return "";
    })();
    if (descriptor.targetType === "records") {
      persistRecords();
    } else {
      persistCrmWorkspace();
    }
    appendCrmActivity({
      type: "待办",
      title: "顺延待办",
      detail: `${crmTaskTitleForTarget(target)} · 顺延${days}天至 ${nextDate || "待排期"}`,
      pointName: target.pointName || target.spotName || target.opportunityPointScope || target.name || "",
      recordId: descriptor.targetType === "records" ? target.id : "",
      targetType: descriptor.targetType,
      targetId: descriptor.targetId,
      ownerId: target.ownerId || target.opportunityOwnerId || target.accountId || "",
      ownerName: target.ownerName || target.opportunityOwner || target.operatorName || "",
      tone: "neutral"
    });
    renderCrmWorkspace();
    if (activeView === "records") renderRecords();
    flashContextToolbar(`已顺延至 ${nextDate || "待排期"}`);
  }

  function crmFunnelMeta() {
    return [
      { key: "lead", label: "客户线索", cta: "新建评级", view: "scenario", detail: "先补客户、点位和基础评分" },
      { key: "rating", label: "评级/报备", cta: "进机会池", view: "records", detail: "认领、报备、补证据和下一步动作" },
      { key: "contract", label: "合同商务", cta: "看合同", view: "crm", detail: "制作合同、确认授权、账期和商务条件" },
      { key: "order", label: "订单/MES", cta: "看订单", view: "crm", detail: "下单、打样、生产、质检和出库" },
      { key: "landing", label: "发货/动销", cta: "落地台账", view: "fulfillment", detail: "签收、上架、销售回款和补货复盘" }
    ];
  }

  function crmFunnelStage(row) {
    if (!row || row.opportunity === "未建机会") return "lead";
    if (row.contract === "待合同") return "rating";
    if (row.order === "待订单") return "contract";
    if (row.fulfillment === "待发货") return "order";
    return "landing";
  }

  function crmFunnelAction(row) {
    if (!row || row.opportunity === "未建机会") return "新建评级并保存为点位机会";
    if (row.contract === "待合同") return "从机会池生成合同草稿";
    if (row.order === "待订单") return "生成订单/MES并补首批SKU";
    if (row.fulfillment === "待发货") return "跟进生产、发货和签收凭证";
    if (row.sales === "待销售数据") return "录入门店销售、回款和动销率";
    return "复盘补货和二次采购";
  }

  function crmFunnelTone(row) {
    if (!row) return "neutral";
    if (row.contract === "待合同" && row.opportunity !== "未建机会") return "weak";
    if (row.order === "待订单" && row.contract !== "待合同") return "medium";
    if (row.sales === "待销售数据" && row.fulfillment !== "待发货") return "medium";
    return "neutral";
  }

  function renderCrmFunnelBoard(lifecycleRows) {
    const metas = crmFunnelMeta();
    const grouped = metas.reduce((map, meta) => {
      map[meta.key] = lifecycleRows.filter((row) => crmFunnelStage(row) === meta.key);
      return map;
    }, {});
    return `<section class="crm-section crm-funnel-board">
      <div class="crm-section-head">
        <div>
          <strong>销售漏斗</strong>
          <span>按点位生命周期自动归位，销售只看下一步卡点</span>
        </div>
      </div>
      <div class="crm-funnel-lanes">
        ${metas.map((meta) => {
          const rows = grouped[meta.key] || [];
          return `<div class="crm-funnel-lane">
            <div class="crm-funnel-lane-head">
              <strong>${escapeHtml(meta.label)}</strong>
              <span>${rows.length}</span>
            </div>
            <small>${escapeHtml(meta.detail)}</small>
            <div class="crm-funnel-cards">
              ${rows.slice(0, 5).map((row) => `<article class="crm-funnel-card ${crmFunnelTone(row)}">
                <strong>${escapeHtml(row.pointName)}</strong>
                <span>${escapeHtml(crmFunnelAction(row))}</span>
                <small>${escapeHtml(row.customer || "待绑定客户")} · ${escapeHtml(row.owner || "待认领")}</small>
              </article>`).join("") || `<p class="empty">暂无${escapeHtml(meta.label)}点位</p>`}
            </div>
            <button type="button" data-view-target="${escapeHtml(meta.view)}">${escapeHtml(meta.cta)}</button>
          </div>`;
        }).join("")}
      </div>
    </section>`;
  }

  function crmPointKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function crmPointMatches(left, right) {
    const leftKey = crmPointKey(left);
    const rightKey = crmPointKey(right);
    if (!leftKey || !rightKey) return false;
    return leftKey === rightKey || leftKey.length >= 4 && rightKey.includes(leftKey) || rightKey.length >= 4 && leftKey.includes(rightKey);
  }

  function crmIdentityKey(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
  }

  function crmPhoneKey(value) {
    return String(value || "").replace(/[^\d+]/g, "");
  }

  function crmCustomerIdentityTokens(customer) {
    const tokens = [];
    const phone = crmPhoneKey(customer && customer.phone);
    const wechat = crmIdentityKey(customer && customer.wechat);
    const name = crmIdentityKey(customer && customer.name);
    const region = crmIdentityKey(customer && customer.region);
    if (phone.length >= 6) tokens.push(`phone:${phone}`);
    if (wechat.length >= 3) tokens.push(`wechat:${wechat}`);
    if (name.length >= 2) tokens.push(`name:${name}${region ? `@${region}` : ""}`);
    return tokens;
  }

  function crmCustomerIdentityOverlaps(left, right) {
    if (!left || !right || left === right) return false;
    const leftTokens = new Set(crmCustomerIdentityTokens(left));
    const rightTokens = crmCustomerIdentityTokens(right);
    if (rightTokens.some((token) => leftTokens.has(token))) return true;
    const leftRegion = crmIdentityKey(left.region);
    const rightRegion = crmIdentityKey(right.region);
    if (leftRegion && rightRegion && leftRegion !== rightRegion) return false;
    return crmPointMatches(left.name, right.name);
  }

  function customerDuplicateGroup(customer) {
    if (!customer) return [];
    return (crmWorkspace.customers || [])
      .filter((item) => item && item !== customer && crmOwnerVisible(item) && crmCustomerIdentityOverlaps(customer, item))
      .slice(0, 5);
  }

  function customerContactReady(customer) {
    return Boolean(customer && customer.contactName && (customer.phone || customer.wechat));
  }

  function customerHasOwner(customer) {
    const identity = ownerIdentityFromRow(customer);
    return Boolean(identity.id || identity.name);
  }

  function customerLeadHealth(customer) {
    const duplicates = customerDuplicateGroup(customer);
    const due = crmDateStatus(customer && customer.nextActionAt);
    const existing = existingOpportunityForCustomer(customer);
    if (duplicates.length) {
      return { label: "疑似重复", tone: "weak", detail: `匹配${duplicates.length}条客资`, actionable: true, duplicates, due };
    }
    if (due.days < 0) {
      return { label: "跟进逾期", tone: "weak", detail: due.label, actionable: true, duplicates, due };
    }
    if (!customerHasOwner(customer)) {
      return { label: "待分配", tone: "medium", detail: "未绑定负责人", actionable: true, duplicates, due };
    }
    if (!customerContactReady(customer)) {
      return { label: "资料缺口", tone: "medium", detail: "缺联系人/电话微信", actionable: true, duplicates, due };
    }
    if (!customer.nextActionAt) {
      return { label: "待排跟进", tone: "medium", detail: "未设置下一步日期", actionable: true, duplicates, due };
    }
    if (existing.record) {
      return { label: "已建机会", tone: "mid-high", detail: existing.record.opportunityStatus || "跟进中", actionable: false, duplicates, due };
    }
    return { label: "客资健康", tone: "strong", detail: due.label, actionable: false, duplicates, due };
  }

  function crmRecordPointName(record) {
    return record && (record.spotName || record.opportunityPointScope || "");
  }

  function crmVisibleOpportunities() {
    return records.filter((record) =>
      (accountCanViewAll() || isPublicOpportunity(record) || accountMatchesRecord(record))
      && crmOwnerMatchesFilter(record)
      && crmSearchMatches("opportunities", record)
    );
  }

  function crmVisibleOpportunityEntries() {
    return records
      .map((record, index) => ({ record, index }))
      .filter(({ record }) => accountCanViewAll() || isPublicOpportunity(record) || accountMatchesRecord(record));
  }

  function crmPointBundle(row) {
    const pointName = row && row.pointName;
    const opportunityEntries = crmVisibleOpportunityEntries().filter(({ record }) => crmPointMatches(crmRecordPointName(record), pointName));
    const contracts = crmRows("contracts").filter((contract) => crmPointMatches(contract.pointName, pointName));
    const orders = crmRows("orders").filter((order) => crmPointMatches(order.pointName, pointName));
    const fulfillments = data.fulfillmentRecords
      .filter(fulfillmentVisibleToAccount)
      .filter((record) => crmPointMatches(record.pointName, pointName));
    const sales = crmRows("storeSales").filter((sale) => crmPointMatches(sale.pointName, pointName));
    return {
      opportunity: opportunityEntries[0] ? opportunityEntries[0].record : null,
      opportunityIndex: opportunityEntries[0] ? opportunityEntries[0].index : -1,
      contract: contracts[0] || null,
      order: orders[0] || null,
      fulfillment: fulfillments[0] || null,
      sale: sales[0] || null
    };
  }

  function crmClosureStages(row) {
    return [
      { key: "opportunity", label: "评级/机会", text: row.opportunity, done: row.opportunity !== "未建机会" },
      { key: "contract", label: "合同", text: row.contract, done: row.contract !== "待合同" },
      { key: "order", label: "订单/MES", text: row.order, done: row.order !== "待订单" },
      { key: "fulfillment", label: "发货", text: row.fulfillment, done: row.fulfillment !== "待发货" },
      { key: "sales", label: "门店销售", text: row.sales, done: row.sales !== "待销售数据" }
    ];
  }

  function crmClosureModel(row) {
    const bundle = crmPointBundle(row);
    const stages = crmClosureStages(row);
    const doneCount = stages.filter((stage) => stage.done).length;
    const percentValue = Math.round(doneCount / stages.length * 100);
    return {
      row,
      bundle,
      stages,
      doneCount,
      percentValue,
      tone: percentValue >= 80 ? "strong" : percentValue >= 50 ? "medium" : "weak",
      nextAction: crmFunnelAction(row)
    };
  }

  function crmClosurePipelinePermission(action) {
    if (action === "contract") return accountCanModuleAction("contracts", "edit");
    if (action === "order") return accountCanModuleAction("orders", "edit");
    if (action === "sales") return accountCanModuleAction("storeSales", "edit");
    return true;
  }

  function crmClosurePrimaryAction(model) {
    const bundle = model.bundle || {};
    const index = Number(bundle.opportunityIndex);
    if (!bundle.opportunity || index < 0) {
      return { label: "新建评级", view: "scenario", disabled: false };
    }
    if (!bundle.contract) {
      return { label: "生成合同", action: "contract", index, disabled: !crmClosurePipelinePermission("contract") };
    }
    if (!bundle.order) {
      return { label: "生成订单/MES", action: "order", index, disabled: !crmClosurePipelinePermission("order") };
    }
    if (!bundle.sale) {
      return { label: "建销售跟踪", action: "sales", index, disabled: !crmClosurePipelinePermission("sales") };
    }
    return { label: "看发货/动销", view: "fulfillment", disabled: false };
  }

  function crmClosureActionButton(action) {
    if (action.view) {
      return `<button type="button" class="primary" data-view-target="${escapeHtml(action.view)}">${escapeHtml(action.label)}</button>`;
    }
    return `<button type="button" class="primary" data-crm-closure-action="${escapeHtml(action.action)}" data-record-index="${action.index}"${action.disabled ? " disabled" : ""}>${escapeHtml(action.label)}</button>`;
  }

  function renderCrmClosureBoard(lifecycleRows) {
    const models = lifecycleRows
      .map(crmClosureModel)
      .sort((left, right) => left.percentValue - right.percentValue || String(left.row.pointName).localeCompare(String(right.row.pointName), "zh-CN"))
      .slice(0, 12);
    const avg = models.length ? Math.round(models.reduce((sum, model) => sum + model.percentValue, 0) / models.length) : 0;
    return `<section class="crm-section crm-closure-board">
      <div class="crm-section-head">
        <div>
          <strong>点位360闭环</strong>
          <span>从评级到合同、订单/MES、发货和门店销售，按点位检查缺口</span>
        </div>
        <div class="crm-closure-score"><span>样本完整度</span><strong>${avg}%</strong></div>
      </div>
      <div class="crm-closure-grid">
        ${models.map((model) => {
          const contract = model.bundle.contract;
          const primaryAction = crmClosurePrimaryAction(model);
          const activities = recentCrmActivities(2, (activity) => crmPointMatches(activity.pointName, model.row.pointName));
          return `<article class="crm-closure-card ${model.tone}">
            <div class="crm-closure-card-head">
              <div>
                <strong>${escapeHtml(model.row.pointName)}</strong>
                <span>${escapeHtml(model.row.customer || "待绑定客户")} · ${escapeHtml(model.row.owner || "待认领")}</span>
              </div>
              <b>${model.percentValue}%</b>
            </div>
            <div class="crm-closure-steps">
              ${model.stages.map((stage) => `<div class="${stage.done ? "done" : "missing"}">
                <i>${stage.done ? "已" : "缺"}</i>
                <span>${escapeHtml(stage.label)}</span>
                <small>${escapeHtml(stage.text || "待补")}</small>
              </div>`).join("")}
            </div>
            <div class="crm-closure-next">
              <span>下一步</span>
              <strong>${escapeHtml(model.nextAction)}</strong>
            </div>
            ${activities.length ? `<div class="crm-closure-activity">${renderActivityFeed(activities, "暂无动态")}</div>` : ""}
            <div class="crm-closure-actions">
              <button type="button" data-crm-point-open="${escapeHtml(model.row.pointName)}">点位档案</button>
              <button type="button" data-view-target="records">机会</button>
              ${crmClosureActionButton(primaryAction)}
              ${contract ? `<button type="button" data-crm-draft="${escapeHtml(contract.id)}">合同草稿</button>` : ""}
              <button type="button" data-view-target="fulfillment">发货/动销</button>
            </div>
          </article>`;
        }).join("") || `<p class="empty">暂无点位链路数据，先保存评级或新增CRM记录。</p>`}
      </div>
    </section>`;
  }

  function crmPointProfileLine(label, value, detail = "") {
    return `<div class="crm-point-profile-line">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "待补")}</strong>
      ${detail ? `<small>${escapeHtml(detail)}</small>` : ""}
    </div>`;
  }

  function crmPointProfilePanel(title, status, rows, actionHtml = "") {
    return `<article class="crm-point-profile-panel">
      <div class="crm-point-profile-panel-head">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(status || "待补")}</span>
      </div>
      <div class="crm-point-profile-lines">${rows.join("")}</div>
      ${actionHtml ? `<div class="crm-point-profile-actions">${actionHtml}</div>` : ""}
    </article>`;
  }

  function renderCrmPointProfile(lifecycleRows) {
    if (!activeCrmPointName) return "";
    const row = lifecycleRows.find((item) => crmPointMatches(item.pointName, activeCrmPointName));
    if (!row) {
      return `<section class="crm-section crm-point-profile">
        <div class="crm-section-head">
          <div><strong>点位全链路档案</strong><span>未找到“${escapeHtml(activeCrmPointName)}”的当前可见数据</span></div>
          <button type="button" data-crm-point-close>关闭</button>
        </div>
        <p class="empty">可能被筛选条件隐藏，或当前账号没有权限查看该点位。</p>
      </section>`;
    }
    const model = crmClosureModel(row);
    const bundle = model.bundle || {};
    const opportunity = bundle.opportunity || {};
    const contract = bundle.contract || {};
    const order = bundle.order || {};
    const fulfillment = bundle.fulfillment || {};
    const sale = bundle.sale || {};
    const activities = recentCrmActivities(6, (activity) => crmPointMatches(activity.pointName, row.pointName));
    const panels = [
      crmPointProfilePanel("客户/机会", row.opportunity, [
        crmPointProfileLine("客户", row.customer || opportunity.customerName || "待绑定客户", opportunity.opportunityPointScope || ""),
        crmPointProfileLine("负责人", row.owner || opportunity.opportunityOwner || "待认领", opportunity.opportunityTeam || ""),
        crmPointProfileLine("下一步", opportunity.opportunityNextAction || crmFunnelAction(row), opportunity.opportunityNextActionAt || opportunity.opportunityProtectionUntil || "")
      ], `<button type="button" data-view-target="records">打开机会</button>`),
      crmPointProfilePanel("合同商务", row.contract, [
        crmPointProfileLine("合同状态", contract.status || "待生成合同", contract.contractNo || ""),
        crmPointProfileLine("合同金额", contract.amount ? crmCurrency(contract.amount) : "待确认", contract.type || ""),
        crmPointProfileLine("应收回款", contract.id ? `${contractPaymentStatus(contract)} · 剩余${crmCurrency(contractReceivableRemaining(contract))}` : "待确认", contract.receivableDueDate || "")
      ], `${contract.id ? `<button type="button" data-crm-draft="${escapeHtml(contract.id)}">合同草稿</button>` : ""}<button type="button" data-crm-panel-target="contracts">合同页</button>`),
      crmPointProfilePanel("订单/MES", row.order, [
        crmPointProfileLine("MES状态", order.mesStatus || "待生成订单", order.orderType || ""),
        crmPointProfileLine("订单金额", order.amount ? crmCurrency(order.amount) : "待确认", `${Number(order.quantity) || 0} 件`),
        crmPointProfileLine("交付节点", order.dueDate || "待排期", order.skuPlan || "SKU明细待补")
      ], `<button type="button" data-crm-panel-target="orders">订单页</button>`),
      crmPointProfilePanel("发货落地", row.fulfillment, [
        crmPointProfileLine("落地状态", fulfillment.id ? fulfillmentLandingStatus(fulfillment) : "待发货", fulfillment.receiptStatus || ""),
        crmPointProfileLine("上架/签收", fulfillment.salesShelfStatus || "待补", fulfillment.salesShelfDate || fulfillment.lastFileDate || ""),
        crmPointProfileLine("现场问题", (fulfillment.exceptionTags || []).join("、") || "暂无异常", fulfillment.salesNote || "")
      ], `<button type="button" data-view-target="fulfillment">落地台账</button>`),
      crmPointProfilePanel("门店销售", row.sales, [
        crmPointProfileLine("销售月份", sale.month || "待建销售跟踪", saleReviewPriority(sale)),
        crmPointProfileLine("销售/回款", sale.id ? `${crmCurrency(sale.salesAmount)} / ${crmCurrency(sale.receiptAmount)}` : "待录入", `提成${crmCurrency(saleEstimatedCommission(sale))}`),
        crmPointProfileLine("补货判断", sale.id ? saleReviewModel(sale).advice : "待上线后录入动销", sale.reviewDueDate || "")
      ], `<button type="button" data-crm-panel-target="storeSales">销售页</button>`)
    ];
    return `<section class="crm-section crm-point-profile">
      <div class="crm-section-head">
        <div>
          <strong>点位全链路档案</strong>
          <span>${escapeHtml(row.pointName)} · ${model.doneCount}/5 环节完成 · 下一步：${escapeHtml(model.nextAction)}</span>
        </div>
        <div class="crm-point-profile-head-actions">
          <b>${model.percentValue}%</b>
          <button type="button" data-crm-point-close>关闭</button>
        </div>
      </div>
      <div class="crm-point-profile-steps">
        ${model.stages.map((stage) => `<div class="${stage.done ? "done" : "missing"}">
          <span>${escapeHtml(stage.label)}</span>
          <strong>${stage.done ? "已完成" : "待补齐"}</strong>
          <small>${escapeHtml(stage.text || "待补")}</small>
        </div>`).join("")}
      </div>
      <div class="crm-point-profile-grid">${panels.join("")}</div>
      <div class="crm-point-profile-activity">
        <strong>最近动态</strong>
        ${renderActivityFeed(activities, "暂无该点位动态")}
      </div>
    </section>`;
  }

  function crmBriefMetrics(lifecycleRows) {
    const models = lifecycleRows.map(crmClosureModel);
    const avgClosure = models.length ? Math.round(models.reduce((sum, model) => sum + model.percentValue, 0) / models.length) : 0;
    const visibleFulfillment = data.fulfillmentRecords.filter(fulfillmentVisibleToAccount);
    const customers = crmRows("customers");
    const contracts = crmRows("contracts");
    const storeSales = crmRows("storeSales");
    const duplicateCustomerIds = new Set();
    customers.forEach((customer) => {
      if (customerDuplicateGroup(customer).length) duplicateCustomerIds.add(customer.id);
    });
    return {
      customers: customers.length,
      opportunities: crmVisibleOpportunities().length,
      contracts: contracts.length,
      orders: crmRows("orders").length,
      fulfillments: visibleFulfillment.length,
      sales: storeSales.length,
      customerContactReady: customers.filter(customerContactReady).length,
      duplicateCustomers: duplicateCustomerIds.size,
      unassignedCustomers: customers.filter((customer) => !customerHasOwner(customer)).length,
      customerOverdue: customers.filter((customer) => crmDateStatus(customer.nextActionAt).days < 0).length,
      avgClosure,
      receivable: contracts.reduce((sum, contract) => sum + contractReceivableRemaining(contract), 0),
      receipt: storeSales.reduce((sum, sale) => sum + (Number(sale.receiptAmount) || 0), 0),
      estimatedCommission: storeSales.reduce((sum, sale) => sum + saleEstimatedCommission(sale), 0),
      stageCounts: {
        opportunity: lifecycleRows.filter((row) => row.opportunity !== "未建机会").length,
        contract: lifecycleRows.filter((row) => row.contract !== "待合同").length,
        order: lifecycleRows.filter((row) => row.order !== "待订单").length,
        fulfillment: lifecycleRows.filter((row) => row.fulfillment !== "待发货").length,
        sales: lifecycleRows.filter((row) => row.sales !== "待销售数据").length
      },
      incompletePoints: models
        .filter((model) => model.percentValue < 100)
        .sort((left, right) => left.percentValue - right.percentValue)
        .slice(0, 5)
    };
  }

  function crmBriefBullet(items, formatter, emptyText) {
    return items.length ? items.map((item, index) => `${index + 1}. ${formatter(item)}`) : [`- ${emptyText}`];
  }

  function buildCrmBriefText(lifecycleRows = crmLifecycleRows()) {
    const metrics = crmBriefMetrics(lifecycleRows);
    const actionItems = crmActionItems();
    const riskItems = crmRiskItems(lifecycleRows);
    const activities = recentCrmActivities(5);
    const account = currentAccount();
    const generatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    const lines = [
      `寻迹万物销售CRM简报｜${generatedAt}`,
      `账号：${hasAccount() ? `${account.name}（${account.role} · ${account.team || "未分组"}）` : "未登录"}`,
      "",
      "一、全链路数据",
      `客户客资 ${metrics.customers}｜评级/机会 ${metrics.opportunities}｜合同 ${metrics.contracts}｜订单/MES ${metrics.orders}｜发货落地 ${metrics.fulfillments}｜门店销售 ${metrics.sales}`,
      `客资治理：完整 ${metrics.customerContactReady}/${metrics.customers}｜重复 ${metrics.duplicateCustomers}｜未分配 ${metrics.unassignedCustomers}｜逾期 ${metrics.customerOverdue}`,
      `点位闭环完整度 ${metrics.avgClosure}%｜已到合同 ${metrics.stageCounts.contract}｜已到订单 ${metrics.stageCounts.order}｜已到发货 ${metrics.stageCounts.fulfillment}｜已有门店销售 ${metrics.stageCounts.sales}`,
      `经营口径：合同剩余应收 ${crmCurrency(metrics.receivable)}｜门店回款 ${crmCurrency(metrics.receipt)}｜销售提成估算 ${crmCurrency(metrics.estimatedCommission)}`,
      "",
      "二、下一步待办",
      ...crmBriefBullet(actionItems.slice(0, 6), (item) => `[${item.type}] ${item.title}｜${item.detail}｜${item.dueLabel || "未排期"}`, "暂无待办"),
      "",
      "三、风险与断点",
      ...crmBriefBullet(riskItems.slice(0, 6), (item) => `[${item.type}] ${item.title}｜${item.detail}`, "暂无明显断点"),
      "",
      "四、重点缺口点位",
      ...crmBriefBullet(metrics.incompletePoints, (model) => `${model.row.pointName}｜完整度${model.percentValue}%｜下一步：${model.nextAction}`, "暂无缺口点位"),
      "",
      "五、最近动态",
      ...crmBriefBullet(activities, (activity) => `[${activity.type}] ${activity.title}｜${activity.pointName || activity.targetType || "工作台"}｜${activity.actorName}｜${activity.time}`, "暂无动态")
    ];
    return lines.join("\n");
  }

  function renderCrmBriefPanel(lifecycleRows) {
    const metrics = crmBriefMetrics(lifecycleRows);
    const briefText = buildCrmBriefText(lifecycleRows);
    return `<section class="crm-section crm-brief-panel">
      <div class="crm-section-head">
        <div>
          <strong>销售简报</strong>
          <span>自动汇总客户、机会、合同、订单、发货和门店销售，用于早晚会复盘</span>
        </div>
        <div class="crm-brief-actions">
          <button type="button" class="primary" data-crm-brief-copy>复制简报</button>
          <button type="button" data-crm-brief-export>导出TXT</button>
        </div>
      </div>
      <div class="crm-brief-metrics">
        <div><span>闭环完整度</span><strong>${metrics.avgClosure}%</strong></div>
        <div><span>待办</span><strong>${crmActionItems().length}</strong></div>
        <div><span>风险</span><strong>${crmRiskItems(lifecycleRows).length}</strong></div>
        <div><span>客资异常</span><strong>${metrics.duplicateCustomers + metrics.unassignedCustomers + metrics.customerOverdue}</strong></div>
        <div><span>缺口点位</span><strong>${metrics.incompletePoints.length}</strong></div>
      </div>
      <pre class="crm-brief-preview">${escapeHtml(briefText)}</pre>
    </section>`;
  }

  function crmPercent(numerator, denominator) {
    if (!denominator) return "0%";
    return `${Math.round((Number(numerator) || 0) / denominator * 100)}%`;
  }

  function crmOpportunityOverdue(record) {
    const due = crmDateStatus(record && (record.opportunityNextActionAt || record.opportunityProtectionUntil));
    return due.days < 0;
  }

  function crmOwnerLabelFromIdentity(identity) {
    if (!identity) return "待分配";
    return identity.name || identity.id || "待分配";
  }

  function crmVisibleOpportunityRecords() {
    return crmVisibleOpportunities().filter((record) => !isPublicOpportunity(record));
  }

  function crmAlertTone(count, highThreshold = 1) {
    if (!count) return "strong";
    if (count >= highThreshold) return "weak";
    return "medium";
  }

  function crmManagementAlerts() {
    const visibleOpportunities = crmVisibleOpportunities();
    const activeOpportunities = visibleOpportunities.filter((record) => !isPublicOpportunity(record));
    const contracts = crmRows("contracts");
    const orders = crmRows("orders");
    const storeSales = crmRows("storeSales");
    const fulfillmentRows = data.fulfillmentRecords.filter(fulfillmentVisibleToAccount);
    const customerRows = crmRows("customers");
    const accountIssues = accountHasPermission("accounts", "view")
      ? accounts
        .map((account) => ({ permission: accountPermissionHealth(account), security: accountSecurityHealth(account) }))
        .filter((item) => ["weak", "medium"].includes(item.permission.tone) || ["weak", "medium"].includes(item.security.tone)).length
      : 0;
    const customerIssues = customerRows.filter((customer) => customerLeadHealth(customer).actionable).length;
    const pendingApprovals = visibleOpportunities.filter((record) => record.opportunityStatus === "报备待审").length;
    const rejectedReports = visibleOpportunities.filter((record) => record.opportunityStatus === "报备驳回/补充材料").length;
    const overdueOpportunities = activeOpportunities.filter(crmOpportunityOverdue).length;
    const overdueReceivable = contracts.filter((contract) => contractPaymentStatus(contract) === "逾期未回款");
    const remainingReceivable = contracts.reduce((sum, contract) => sum + contractReceivableRemaining(contract), 0);
    const orderDelays = orders.filter((order) => order.mesStatus !== "已完成" && crmDateStatus(order.dueDate).days < 0).length;
    const fulfillmentIssues = fulfillmentRows.filter((record) => (record.exceptionTags || []).length).length;
    const replenishmentReady = storeSales.filter((sale) => {
      const review = saleReviewModel(sale);
      return !existingReplenishmentOrderForSale(sale) && (review.canReplenish || Number(sale.suggestedReplenishmentQty) > 0);
    }).length;
    const salesDataMissing = storeSales.filter((sale) => saleReviewModel(sale).priority === "待录入").length;
    return [
      {
        key: "accounts",
        label: "账号权限",
        value: accountHasPermission("accounts", "view") ? accountIssues : "无权限",
        detail: accountHasPermission("accounts", "view") ? "锁定、缺权限或异常高权限" : "当前账号不可见",
        tone: accountHasPermission("accounts", "view") ? crmAlertTone(accountIssues) : "neutral",
        view: "accounts"
      },
      { key: "customers", label: "客资治理", value: customerIssues, detail: "重复、未分配、缺联系人或逾期", tone: crmAlertTone(customerIssues, 3), view: "crm", panel: "customers" },
      { key: "approval", label: "报备审批", value: pendingApprovals, detail: `${rejectedReports} 条驳回待补`, tone: crmAlertTone(pendingApprovals, 2), view: "records" },
      { key: "opportunity", label: "机会逾期", value: overdueOpportunities, detail: "下一步日期或保护期已过", tone: crmAlertTone(overdueOpportunities), view: "records" },
      { key: "receivable", label: "合同应收", value: overdueReceivable.length, detail: `剩余应收 ${crmCurrency(remainingReceivable)}`, tone: crmAlertTone(overdueReceivable.length), view: "crm", panel: "contracts" },
      { key: "orders", label: "订单延期", value: orderDelays, detail: "MES交付日期已过且未完成", tone: crmAlertTone(orderDelays), view: "crm", panel: "orders" },
      { key: "fulfillment", label: "发货异常", value: fulfillmentIssues, detail: "签收、上架、凭证或现场异常", tone: crmAlertTone(fulfillmentIssues), view: "fulfillment" },
      { key: "sales", label: "补货机会", value: replenishmentReady, detail: `${salesDataMissing} 条门店销售待录入`, tone: replenishmentReady ? "mid-high" : salesDataMissing ? "medium" : "strong", view: "crm", panel: "storeSales" }
    ];
  }

  function crmNumberRate(value, base) {
    const denominator = Number(base) || 0;
    if (!denominator) return 0;
    return Math.max(0, Math.min(100, Math.round((Number(value) || 0) / denominator * 100)));
  }

  function crmPipelineGaps(lifecycleRows) {
    const rows = Array.isArray(lifecycleRows) ? lifecycleRows : [];
    const hasOpportunity = (row) => row && row.opportunity !== "未建机会";
    const hasContract = (row) => row && row.contract !== "待合同";
    const hasOrder = (row) => row && row.order !== "待订单";
    const hasFulfillment = (row) => row && row.fulfillment !== "待发货";
    const hasSales = (row) => row && row.sales !== "待销售数据";
    const missingOpportunity = rows.filter((row) => !hasOpportunity(row) && (hasContract(row) || hasOrder(row) || hasFulfillment(row) || hasSales(row)));
    const missingContract = rows.filter((row) => !hasContract(row) && (hasOrder(row) || hasFulfillment(row) || hasSales(row)));
    const missingOrder = rows.filter((row) => !hasOrder(row) && (hasFulfillment(row) || hasSales(row)));
    const missingSales = rows.filter((row) => hasFulfillment(row) && !hasSales(row));
    const brokenPointNames = new Set([].concat(missingOpportunity, missingContract, missingOrder).map((row) => row.pointName || ""));
    return {
      missingOpportunity,
      missingContract,
      missingOrder,
      missingSales,
      totalBreaks: brokenPointNames.size,
      totalGapItems: missingOpportunity.length + missingContract.length + missingOrder.length,
      summary: [
        { label: "缺机会", value: missingOpportunity.length, detail: "已有下游记录但未补评级/机会" },
        { label: "缺合同", value: missingContract.length, detail: "已有订单/发货/销售但未补合同" },
        { label: "缺订单", value: missingOrder.length, detail: "已有发货/销售但未补订单/MES" },
        { label: "待销售", value: missingSales.length, detail: "已发货但未录门店销售" }
      ]
    };
  }

  function renderCrmDashboardSnapshot(lifecycleRows) {
    const metrics = crmBriefMetrics(lifecycleRows);
    const actionCount = crmActionItems().length;
    const riskCount = crmRiskItems(lifecycleRows).length;
    const activeOpportunities = crmVisibleOpportunityRecords().filter((record) =>
      ["报备通过", "商务洽谈", "条件审批", "已签约/待落地", "运营中"].includes(record.opportunityStatus)
    ).length;
    const signedContracts = crmRows("contracts").filter((contract) => ["已签约", "归档"].includes(contract.status)).length;
    const gaps = crmPipelineGaps(lifecycleRows);
    const metricCards = [
      { icon: "链", label: "点位闭环", value: `${metrics.avgClosure}%`, detail: `${metrics.stageCounts.sales}/${Math.max(lifecycleRows.length, 0)} 个点位已到门店销售`, tone: metrics.avgClosure >= 80 ? "strong" : metrics.avgClosure >= 50 ? "medium" : "weak", progress: metrics.avgClosure },
      { icon: "机", label: "活跃机会", value: String(activeOpportunities), detail: `${metrics.opportunities} 条机会，${actionCount} 个待办`, tone: actionCount ? "medium" : "strong", progress: crmNumberRate(activeOpportunities, Math.max(metrics.opportunities, 1)) },
      { icon: "款", label: "合同应收", value: crmCurrency(metrics.receivable), detail: `${signedContracts}/${metrics.contracts} 份合同已签/归档`, tone: metrics.receivable > 0 ? "mid-high" : "strong", progress: crmNumberRate(signedContracts, Math.max(metrics.contracts, 1)) },
      { icon: "销", label: "门店回款", value: crmCurrency(metrics.receipt), detail: `提成估算 ${crmCurrency(metrics.estimatedCommission)}，风险 ${riskCount}`, tone: riskCount ? "medium" : "strong", progress: crmNumberRate(metrics.stageCounts.sales, Math.max(metrics.stageCounts.fulfillment, 1)) },
      { icon: "断", label: "断层点位", value: String(gaps.totalBreaks), detail: `${gaps.totalGapItems} 个前序补录项，${gaps.missingSales.length} 条待录销售`, tone: gaps.totalBreaks ? "weak" : "strong", progress: gaps.totalBreaks ? crmNumberRate(Math.max(lifecycleRows.length - gaps.totalBreaks, 0), Math.max(lifecycleRows.length, 1)) : 100 }
    ];
    const funnelStages = [
      { label: "评级/机会", count: metrics.stageCounts.opportunity, detail: "进入销售漏斗", gap: gaps.missingOpportunity.length, gapLabel: `${gaps.missingOpportunity.length} 条下游缺机会` },
      { label: "合同", count: metrics.stageCounts.contract, detail: "已生成合同", gap: gaps.missingContract.length, gapLabel: `${gaps.missingContract.length} 条下游缺合同` },
      { label: "订单/MES", count: metrics.stageCounts.order, detail: "已建订单", gap: gaps.missingOrder.length, gapLabel: `${gaps.missingOrder.length} 条发货/销售缺订单` },
      { label: "发货落地", count: metrics.stageCounts.fulfillment, detail: "已有落地记录", gap: 0 },
      { label: "门店销售", count: metrics.stageCounts.sales, detail: "已有销售数据", gap: gaps.missingSales.length, gapLabel: `${gaps.missingSales.length} 条待录销售` }
    ];
    const maxStageCount = Math.max(...funnelStages.map((stage) => stage.count), 1);
    const totalPoints = Math.max(lifecycleRows.length, 1);
    return `<section class="crm-section crm-dashboard-snapshot">
      <div class="crm-section-head">
        <div>
          <strong>核心经营指标</strong>
          <span>管理驾驶舱第一屏只放最该关注的结果指标、风险、销售漏斗和数据断层。</span>
        </div>
      </div>
      <div class="crm-dashboard-metrics">
        ${metricCards.map((card) => `<article class="crm-dashboard-metric ${escapeHtml(card.tone)}">
          <div class="crm-dashboard-metric-head">
            <span class="crm-dashboard-icon" aria-hidden="true">${escapeHtml(card.icon)}</span>
            <div><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong></div>
          </div>
          <small>${escapeHtml(card.detail)}</small>
          <div class="crm-dashboard-bar"><i style="width:${card.progress}%"></i></div>
        </article>`).join("")}
      </div>
      <div class="crm-dashboard-visual">
        <div class="crm-dashboard-funnel-head">
          <strong>销售漏斗</strong>
          <span>${lifecycleRows.length} 个点位样本；条形宽度按当前阶段最大值归一，断层单独提示。</span>
        </div>
        <div class="crm-dashboard-funnel">
          ${funnelStages.map((stage, index) => {
            const widthRate = crmNumberRate(stage.count, maxStageCount);
            const coverageRate = crmNumberRate(stage.count, totalPoints);
            const previousCount = index ? funnelStages[index - 1].count : totalPoints;
            const stepRate = crmNumberRate(Math.min(stage.count, previousCount), Math.max(previousCount, 1));
            const gapText = stage.gap ? ` · ${stage.gapLabel || `${stage.gap} 条需补前序`}` : "";
            return `<div class="crm-dashboard-funnel-step${stage.gap ? " has-gap" : ""}" style="--funnel-width:${Math.max(widthRate, 8)}%">
              <div><strong>${escapeHtml(stage.label)}</strong><span>${stage.count}</span></div>
              <i></i>
              <small>${coverageRate}% 点位覆盖 · ${stepRate}% 环节承接 · ${escapeHtml(stage.detail)}${escapeHtml(gapText)}</small>
            </div>`;
          }).join("")}
        </div>
        <div class="crm-dashboard-gap-list">
          ${gaps.summary.map((item) => `<div class="${item.value ? "weak" : "strong"}">
            <span>${escapeHtml(item.label)}</span>
            <strong>${item.value}</strong>
            <small>${escapeHtml(item.detail)}</small>
          </div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderCrmExecutiveDashboard() {
    const alerts = crmManagementAlerts();
    const urgentCount = alerts.filter((item) => ["weak", "mid-high"].includes(item.tone) && Number(item.value) > 0).length;
    return `<section class="crm-executive-dashboard">
      <div class="crm-executive-head">
        <div>
          <strong>管理驾驶舱</strong>
          <span>${escapeHtml(currentAccountScopeText())}口径下，集中查看权限、报备、回款、订单、发货和动销风险。</span>
        </div>
        <b>${urgentCount} 项需处理</b>
      </div>
      <div class="crm-executive-grid">
        ${alerts.map((item) => `<button type="button" class="crm-executive-card ${escapeHtml(item.tone)}" data-view-target="${escapeHtml(item.view)}"${item.panel ? ` data-crm-panel-target="${escapeHtml(item.panel)}"` : ""}>
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(String(item.value))}</strong>
          <small>${escapeHtml(item.detail)}</small>
        </button>`).join("")}
      </div>
    </section>`;
  }

  function crmManagementMetrics(lifecycleRows) {
    const opportunities = crmVisibleOpportunityRecords();
    const customers = crmRows("customers");
    const contracts = crmRows("contracts");
    const orders = crmRows("orders");
    const storeSales = crmRows("storeSales");
    const fulfillmentRows = data.fulfillmentRecords.filter(fulfillmentVisibleToAccount);
    const signedContracts = contracts.filter((contract) => ["已签约", "归档"].includes(contract.status)).length;
    const duplicateCustomerIds = new Set();
    customers.forEach((customer) => {
      if (customerDuplicateGroup(customer).length) duplicateCustomerIds.add(customer.id);
    });
    const quality = {
      opportunityTotal: opportunities.length,
      nextActionReady: opportunities.filter((record) => record.opportunityNextAction || record.opportunityNextActionAt).length,
      overdue: opportunities.filter(crmOpportunityOverdue).length,
      noOwner: crmVisibleOpportunities().filter((record) => !ownerIdentityFromRow(record).name && !isPublicOpportunity(record)).length,
      customerContactReady: customers.filter(customerContactReady).length,
      customerTotal: customers.length,
      duplicateCustomers: duplicateCustomerIds.size,
      unassignedCustomers: customers.filter((customer) => !customerHasOwner(customer)).length,
      customerOverdue: customers.filter((customer) => crmDateStatus(customer.nextActionAt).days < 0).length
    };
    const conversion = [
      { label: "机会到合同", value: lifecycleRows.filter((row) => row.contract !== "待合同").length, base: Math.max(lifecycleRows.filter((row) => row.opportunity !== "未建机会").length, 0), note: "已生成合同" },
      { label: "合同到订单", value: lifecycleRows.filter((row) => row.order !== "待订单").length, base: contracts.length, note: "已建订单/MES" },
      { label: "订单到发货", value: lifecycleRows.filter((row) => row.fulfillment !== "待发货").length, base: orders.length, note: "有发货落地记录" },
      { label: "发货到销售", value: lifecycleRows.filter((row) => row.sales !== "待销售数据").length, base: fulfillmentRows.length, note: "已有门店销售数据" },
      { label: "合同签约", value: signedContracts, base: contracts.length, note: "已签约/归档" }
    ];
    const ownerMap = new Map();
    const ensureOwner = (identity) => {
      const label = crmOwnerLabelFromIdentity(identity);
      if (!ownerMap.has(label)) {
        ownerMap.set(label, {
          label,
          team: identity && identity.team || "",
          opportunities: 0,
          active: 0,
          contracts: 0,
          orders: 0,
          receipt: 0,
          receivable: 0,
          overdue: 0
        });
      }
      return ownerMap.get(label);
    };
    opportunities.forEach((record) => {
      const row = ensureOwner(ownerIdentityFromRow(record));
      row.opportunities += 1;
      if (["报备通过", "商务洽谈", "条件审批", "已签约/待落地", "运营中"].includes(record.opportunityStatus)) row.active += 1;
      if (crmOpportunityOverdue(record)) row.overdue += 1;
    });
    contracts.forEach((contract) => {
      const row = ensureOwner(ownerIdentityFromRow(contract));
      row.contracts += 1;
      row.receivable += contractReceivableRemaining(contract);
      if (contractPaymentStatus(contract) === "逾期未回款") row.overdue += 1;
    });
    orders.forEach((order) => { ensureOwner(ownerIdentityFromRow(order)).orders += 1; });
    storeSales.forEach((sale) => { ensureOwner(ownerIdentityFromRow(sale)).receipt += Number(sale.receiptAmount) || 0; });
    return {
      conversion,
      quality,
      owners: Array.from(ownerMap.values())
        .sort((left, right) => right.active - left.active || right.opportunities - left.opportunities || right.receivable - left.receivable || right.receipt - left.receipt)
        .slice(0, 8)
    };
  }

  function renderCrmManagementDashboard(lifecycleRows) {
    const metrics = crmManagementMetrics(lifecycleRows);
    return `<section class="crm-section crm-management-dashboard">
      <div class="crm-section-head">
        <div>
          <strong>销售管理看板</strong>
          <span>${escapeHtml(currentAccountScopeText())}口径下的漏斗转化、动作质量和负责人推进情况</span>
        </div>
      </div>
      <div class="crm-conversion-grid">
        ${metrics.conversion.map((item) => `<div>
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(crmPercent(item.value, item.base))}</strong>
          <small>${item.value}/${item.base} · ${escapeHtml(item.note)}</small>
        </div>`).join("")}
      </div>
      <div class="crm-management-grid">
        <div class="crm-quality-panel">
          <h3>动作质量</h3>
          <div class="crm-quality-list">
            <div><span>下一步覆盖</span><strong>${escapeHtml(crmPercent(metrics.quality.nextActionReady, metrics.quality.opportunityTotal))}</strong><small>${metrics.quality.nextActionReady}/${metrics.quality.opportunityTotal} 条机会有动作</small></div>
            <div><span>逾期机会</span><strong>${metrics.quality.overdue}</strong><small>下一步日期或保护期已过</small></div>
            <div><span>未分配机会</span><strong>${metrics.quality.noOwner}</strong><small>需认领或指派负责人</small></div>
            <div><span>客资完整</span><strong>${escapeHtml(crmPercent(metrics.quality.customerContactReady, metrics.quality.customerTotal))}</strong><small>${metrics.quality.customerContactReady}/${metrics.quality.customerTotal} 有联系人+联系方式</small></div>
            <div><span>重复客资</span><strong>${metrics.quality.duplicateCustomers}</strong><small>按电话/微信/名称区域识别</small></div>
            <div><span>未分配客资</span><strong>${metrics.quality.unassignedCustomers}</strong><small>需销售申领或主管分配</small></div>
            <div><span>客资逾期</span><strong>${metrics.quality.customerOverdue}</strong><small>下一步日期已过</small></div>
          </div>
        </div>
        <div class="crm-owner-panel">
          <h3>负责人推进</h3>
          <div class="crm-owner-table">
            <div class="crm-owner-row head"><span>负责人</span><span>机会</span><span>活跃</span><span>合同</span><span>订单</span><span>应收</span><span>回款</span><span>逾期</span></div>
            ${metrics.owners.map((owner) => `<div class="crm-owner-row">
              <strong>${escapeHtml(owner.label)}<small>${escapeHtml(owner.team || "未分组")}</small></strong>
              <span>${owner.opportunities}</span>
              <span>${owner.active}</span>
              <span>${owner.contracts}</span>
              <span>${owner.orders}</span>
              <span>${escapeHtml(crmCurrency(owner.receivable))}</span>
              <span>${escapeHtml(crmCurrency(owner.receipt))}</span>
              <span class="${owner.overdue ? "weak" : ""}">${owner.overdue}</span>
            </div>`).join("") || `<p class="empty">暂无负责人数据</p>`}
          </div>
        </div>
      </div>
    </section>`;
  }

  function copyCrmBrief() {
    const text = buildCrmBriefText();
    const onSuccess = () => {
      flashContextToolbar("已复制销售简报");
      appendCrmActivity({
        type: "销售简报",
        title: "复制销售简报",
        detail: "复制当前CRM全链路简报",
        targetType: "crmBrief",
        tone: "neutral"
      });
      renderCrmWorkspace();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        copyTextFallback(text);
        onSuccess();
      });
      return;
    }
    copyTextFallback(text);
    onSuccess();
  }

  function exportCrmBrief() {
    const text = buildCrmBriefText();
    const date = new Date().toISOString().slice(0, 10);
    downloadText(`寻迹万物销售CRM简报-${date}.txt`, text);
    flashContextToolbar("已导出销售简报");
    appendCrmActivity({
      type: "销售简报",
      title: "导出销售简报",
      detail: "导出当前CRM全链路简报",
      targetType: "crmBrief",
      tone: "neutral"
    });
    renderCrmWorkspace();
  }

  function renderCrmOperatingCenter(lifecycleRows) {
    const actionItems = crmActionItems();
    const riskItems = crmRiskItems(lifecycleRows);
    const activities = recentCrmActivities(8);
    const stageCounts = [
      ["线索/评级", lifecycleRows.filter((row) => row.opportunity !== "未建机会").length],
      ["合同商务", lifecycleRows.filter((row) => row.contract !== "待合同").length],
      ["订单/MES", lifecycleRows.filter((row) => row.order !== "待订单").length],
      ["发货落地", lifecycleRows.filter((row) => row.fulfillment !== "待发货").length],
      ["门店销售", lifecycleRows.filter((row) => row.sales !== "待销售数据").length]
    ];
    return `<section class="crm-section crm-command-center">
      <div class="crm-section-head">
        <div><strong>销售作战台</strong><span>把客户、机会、合同、订单、发货和门店销售压成每天要推进的动作</span></div>
      </div>
      <div class="crm-stage-grid">
        ${stageCounts.map(([label, count]) => `<div><span>${escapeHtml(label)}</span><strong>${count}</strong></div>`).join("")}
      </div>
      <div class="crm-action-grid">
        <div>
          <h3>下一步待办</h3>
          <div class="crm-task-list">${actionItems.map(crmTaskCard).join("") || `<p class="empty">暂无待办，给客户、机会或订单补一个下一步日期。</p>`}</div>
        </div>
        <div>
          <h3>风险提醒</h3>
          <div class="crm-task-list">${riskItems.map(crmTaskCard).join("") || `<p class="empty">暂无明显断点。</p>`}</div>
        </div>
      </div>
      <div class="crm-activity-feed">
        <h3>最近动态</h3>
        ${renderActivityFeed(activities, "暂无CRM动态")}
      </div>
    </section>`;
  }

  function crmLifecycleRows() {
    const opportunityRows = crmVisibleOpportunities();
    const contractRows = crmRows("contracts");
    const orderRows = crmRows("orders");
    const salesRows = crmRows("storeSales");
    const fulfillmentRows = data.fulfillmentRecords.filter((record) =>
      fulfillmentVisibleToAccount(record)
      && crmOwnerMatchesFilter(record)
      && crmSearchMatches("fulfillment", record)
    );
    const byPoint = new Map();
    const ensurePoint = (name) => {
      const key = String(name || "未命名点位").trim() || "未命名点位";
      if (!byPoint.has(key)) {
        byPoint.set(key, {
          pointName: key,
          customer: "",
          rating: "待评级",
          opportunity: "未建机会",
          contract: "待合同",
          order: "待订单",
          fulfillment: "待发货",
          sales: "待销售数据",
          owner: ""
        });
      }
      return byPoint.get(key);
    };
    opportunityRows.forEach((record) => {
      const row = ensurePoint(record.spotName || record.opportunityPointScope);
      row.rating = record.grade || "已测算";
      row.opportunity = `${crmStageFromRecord(record)} · ${record.opportunityStatus || "未跟进"}`;
      row.owner = record.opportunityOwner || record.operatorName || row.owner;
    });
    contractRows.forEach((contract) => {
      const row = ensurePoint(contract.pointName);
      row.customer = crmCustomerName(contract.customerId) || row.customer;
      row.contract = `${contract.status || "待合同"} · ${contractPaymentStatus(contract)} · ${crmCurrency(contractReceivableRemaining(contract))}`;
      row.owner = contract.ownerName || row.owner;
    });
    orderRows.forEach((order) => {
      const row = ensurePoint(order.pointName);
      row.customer = crmCustomerName(order.customerId) || row.customer;
      row.order = `${order.mesStatus || "待生产"} · ${crmCurrency(order.amount)}`;
      row.owner = order.ownerName || row.owner;
    });
    fulfillmentRows.forEach((record) => {
      const row = ensurePoint(record.pointName);
      row.fulfillment = `${fulfillmentLandingStatus(record)} · ${record.receiptStatus || "签收待核"}`;
      row.owner = record.salesOwner || row.owner;
    });
    salesRows.forEach((sale) => {
      const row = ensurePoint(sale.pointName);
      row.customer = crmCustomerName(sale.customerId) || row.customer;
      row.sales = `${sale.month || "本月"} · ${saleReviewPriority(sale)} · 回款${crmCurrency(sale.receiptAmount)} · 提成${crmCurrency(saleEstimatedCommission(sale))}`;
      row.owner = sale.ownerName || row.owner;
    });
    const keyword = crmSearch.trim().toLowerCase();
    return Array.from(byPoint.values())
      .filter((row) => {
        if (!keyword) return true;
        return Object.values(row).join(" ").toLowerCase().includes(keyword);
      })
      .slice(0, 80);
  }

  function crmCustomerName(customerId) {
    const customer = crmWorkspace.customers.find((item) => item.id === customerId);
    return customer ? customer.name : "";
  }

  function crmCollectionModule(collection) {
    if (collection === "customers") return "customers";
    if (collection === "contracts") return "contracts";
    if (collection === "orders") return "orders";
    if (collection === "storeSales") return "storeSales";
    return "crm";
  }

  function crmCanViewCollection(collection) {
    const moduleKey = crmCollectionModule(collection);
    return accountCanModuleAction(moduleKey, "view");
  }

  function crmCanEditCollection(collection) {
    const moduleKey = crmCollectionModule(collection);
    return accountCanModuleAction(moduleKey, "edit");
  }

  function crmCanAdminCollection(collection) {
    const moduleKey = crmCollectionModule(collection);
    return accountCanModuleAction(moduleKey, "admin");
  }

  function crmFieldDisabledAttr(collection) {
    return crmCanEditCollection(collection) ? "" : " disabled";
  }

  function crmFieldAttrs(collection, index, fieldName, value) {
    return `data-crm-field data-crm-collection="${escapeHtml(collection)}" data-crm-index="${index}" data-crm-key="${escapeHtml(fieldName)}" data-crm-original="${escapeHtml(value ?? "")}"`;
  }

  function crmInput(collection, index, fieldName, value, type = "text", extra = "") {
    return `<input type="${type}" value="${escapeHtml(value ?? "")}" ${crmFieldAttrs(collection, index, fieldName, value)} ${extra}${crmFieldDisabledAttr(collection)}>`;
  }

  function crmSelect(collection, index, fieldName, value, options) {
    return selectInput(value, options.map((option) => typeof option === "string" ? { value: option, label: option } : option), `${crmFieldAttrs(collection, index, fieldName, value)}${crmFieldDisabledAttr(collection)}`);
  }

  function crmTextarea(collection, index, fieldName, value) {
    return `<textarea rows="2" ${crmFieldAttrs(collection, index, fieldName, value)}${crmFieldDisabledAttr(collection)}>${escapeHtml(value || "")}</textarea>`;
  }

  function renderCrmTable(collection, title, columns, rows, canEdit) {
    if (!crmCanViewCollection(collection)) return "";
    const canEditCollection = canEdit && crmCanEditCollection(collection);
    const canDeleteCollection = canEditCollection && crmCanAdminCollection(collection);
    const sourceRows = crmWorkspace[collection] || [];
    const allowedRows = new Set(Array.isArray(rows) ? rows : sourceRows);
    const visibleIndexes = sourceRows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => allowedRows.has(row) && crmOwnerVisible(row));
    return `<section class="crm-section">
      <div class="crm-section-head">
        <div>
          <strong>${escapeHtml(title)}</strong>
          <span>${visibleIndexes.length} 条</span>
        </div>
        ${canEditCollection ? `<button type="button" class="primary" data-add-crm-row="${escapeHtml(collection)}">新增</button>` : `<span class="permission-note">只读</span>`}
      </div>
      <div class="crm-table" style="--crm-cols: ${columns.length + (canDeleteCollection ? 1 : 0)}">
        <div class="crm-table-head">
          ${columns.map((column) => `<span>${escapeHtml(column.label)}</span>`).join("")}
          ${canDeleteCollection ? "<span>操作</span>" : ""}
        </div>
        ${visibleIndexes.map(({ row, index }) => `<div class="crm-table-row">
          ${columns.map((column) => `<div>${column.render(row, index)}</div>`).join("")}
          ${canDeleteCollection ? `<div><button type="button" class="rule-delete-btn" data-delete-crm-row="${escapeHtml(collection)}" data-crm-index="${index}">删除</button></div>` : ""}
        </div>`).join("") || `<p class="empty">暂无${escapeHtml(title)}数据</p>`}
      </div>
    </section>`;
  }

  function renderCrmDraftPreview() {
    const contract = crmWorkspace.contracts.find((item) => item.id === activeCrmDraftId);
    if (!contract || !crmOwnerVisible(contract)) return "";
    const draftText = ensureContractDraft(contract);
    return `<section class="crm-section crm-draft-preview">
      <div class="crm-section-head">
        <div>
          <strong>合同草稿</strong>
          <span>${escapeHtml(contract.contractNo || contract.id)} · ${escapeHtml(contract.pointName || "未命名点位")}</span>
        </div>
        <div class="crm-draft-actions">
          <button type="button" data-crm-draft-copy>复制草稿</button>
          <button type="button" data-crm-draft-export>导出TXT</button>
          <button type="button" data-crm-draft-close>收起</button>
        </div>
      </div>
      <pre>${escapeHtml(draftText)}</pre>
    </section>`;
  }

  function activeCrmDraftContract() {
    const contract = crmWorkspace.contracts.find((item) => item.id === activeCrmDraftId);
    return contract && crmOwnerVisible(contract) ? contract : null;
  }

  function copyTextFallback(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "readonly");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function copyActiveCrmDraft() {
    const contract = activeCrmDraftContract();
    if (!contract) {
      alert("请先打开一份合同草稿。");
      return;
    }
    const draftText = ensureContractDraft(contract);
    const onSuccess = () => {
      flashContextToolbar("已复制合同草稿");
      appendCrmActivity({
        type: "合同",
        title: "复制合同草稿",
        detail: `${contract.pointName || "未命名点位"} · ${contract.contractNo || contract.id}`,
        pointName: contract.pointName || "",
        targetType: "contract",
        targetId: contract.id || "",
        ownerId: contract.ownerId || "",
        ownerName: contract.ownerName || "",
        tone: "neutral"
      });
      renderCrmWorkspace();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(draftText).then(onSuccess).catch(() => {
        copyTextFallback(draftText);
        onSuccess();
      });
      return;
    }
    copyTextFallback(draftText);
    onSuccess();
  }

  function exportActiveCrmDraft() {
    const contract = activeCrmDraftContract();
    if (!contract) {
      alert("请先打开一份合同草稿。");
      return;
    }
    const draftText = ensureContractDraft(contract);
    const safeName = `${contract.contractNo || contract.id || "contract"}-${contract.pointName || "合同草稿"}`.replace(/[\\/:*?"<>|\s]+/g, "-");
    downloadText(`${safeName}.txt`, draftText);
    flashContextToolbar("已导出合同草稿");
    appendCrmActivity({
      type: "合同",
      title: "导出合同草稿",
      detail: `${contract.pointName || "未命名点位"} · ${contract.contractNo || contract.id}`,
      pointName: contract.pointName || "",
      targetType: "contract",
      targetId: contract.id || "",
      ownerId: contract.ownerId || "",
      ownerName: contract.ownerName || "",
      tone: "neutral"
    });
    renderCrmWorkspace();
  }

  function crmCollectionOptions() {
    return [
      { value: "all", label: "全部模块" },
      { value: "customers", label: "客户客资" },
      { value: "contracts", label: "合同" },
      { value: "orders", label: "订单/MES" },
      { value: "storeSales", label: "门店销售" }
    ];
  }

  function crmCollectionVisible(collection) {
    const panelCollection = crmPanelCollection();
    if (panelCollection && panelCollection !== collection) return false;
    if (!crmCanViewCollection(collection)) return false;
    return crmCollectionFilter === "all" || crmCollectionFilter === collection;
  }

  function renderCrmPanelTabs(counts) {
    const countByPanel = (panel) => {
      if (panel === "dashboard") return counts.total || 0;
      if (panel === "customers") return counts.customers || 0;
      if (panel === "contracts") return counts.contracts || 0;
      if (panel === "orders") return counts.orders || 0;
      if (panel === "storeSales") return counts.sales || 0;
      return 0;
    };
    return `<nav class="crm-panel-tabs" aria-label="销售经营二级页">
      ${crmPanelKeys().map((panel) => `<button type="button" class="${activeCrmPanel === panel ? "active" : ""}" data-crm-panel-target="${escapeHtml(panel)}">
        <span>${escapeHtml(crmPanelLabel(panel))}</span>
        <small>${countByPanel(panel)}</small>
      </button>`).join("")}
    </nav>`;
  }

  function renderCrmFilters(ownerOptions, counts) {
    const ownerFilterOptions = [{ value: "", label: "全部负责人" }].concat(ownerOptions);
    const activeLabels = [
      crmSearch.trim() ? `关键词：${crmSearch.trim()}` : "",
      crmOwnerFilter ? `负责人：${(ownerOptions.find((option) => option.value === crmOwnerFilter) || {}).label || crmOwnerFilter}` : "",
      crmCollectionFilter !== "all" ? `模块：${(crmCollectionOptions().find((option) => option.value === crmCollectionFilter) || {}).label || crmCollectionFilter}` : ""
    ].filter(Boolean);
    return `<section class="crm-filter-bar">
      <div class="crm-filter-main">
        <label class="field">
          <span>搜索点位/客户/状态</span>
          <input id="crmSearchInput" type="search" value="${escapeHtml(crmSearch)}" placeholder="如：乌镇、补货、已发货、销售账号">
        </label>
        <label class="field">
          <span>负责人</span>
          ${selectInput(crmOwnerFilter, ownerFilterOptions, 'id="crmOwnerFilter"')}
        </label>
        <label class="field">
          <span>模块</span>
          ${selectInput(crmCollectionFilter, crmCollectionOptions(), 'id="crmCollectionFilter"')}
        </label>
      </div>
      <div class="crm-filter-side">
        <strong>${counts.total}</strong>
        <span>${activeLabels.length ? escapeHtml(activeLabels.join(" · ")) : "当前显示全部可见CRM数据"}</span>
        <button type="button" data-crm-filter-reset${crmFiltersActive() ? "" : " disabled"}>清空筛选</button>
      </div>
    </section>`;
  }

  function renderCrmWorkspace() {
    const container = qs("#crmWorkspaceBody");
    if (!container) return;
    if (!accountHasPermission("crm", "view")) {
      container.innerHTML = permissionGateHtml("没有销售CRM权限", "销售CRM包含客户资料、商务推进、订单和门店销售数据。");
      return;
    }
    const canEdit = true;
    const visibleCustomers = crmRows("customers");
    const visibleContracts = crmRows("contracts");
    const visibleOrders = crmRows("orders");
    const visibleSales = crmRows("storeSales");
    const visibleFulfillment = data.fulfillmentRecords.filter((record) =>
      fulfillmentVisibleToAccount(record)
      && crmOwnerMatchesFilter(record)
      && crmSearchMatches("fulfillment", record)
    );
    const visibleOpportunities = crmVisibleOpportunities();
    const lifecycleRows = crmLifecycleRows();
    const ownerOptions = accounts.filter((account) => account.status !== "停用").map((account) => ({ value: account.id, label: `${account.name} · ${account.role}` }));
    const customerOptions = crmWorkspace.customers.map((customer) => ({ value: customer.id, label: customer.name }));
    const filteredCrmTotal = visibleCustomers.length + visibleOpportunities.length + visibleContracts.length + visibleOrders.length + visibleFulfillment.length + visibleSales.length;
    const canCreateOpportunity = accountCanModuleAction("opportunities", "edit");
    const canCreateOrder = crmCanEditCollection("orders");
    const canCreateFulfillment = accountCanModuleAction("fulfillment", "edit");
    const canCreateSales = crmCanEditCollection("storeSales");
    const customerColumns = [
      { label: "客户/类型", render: (row, index) => `${crmInput("customers", index, "name", row.name)}${crmSelect("customers", index, "type", row.type, ["景区/运营方", "门店/经销商", "渠道伙伴", "品牌客户", "政府/文旅单位"])}` },
      { label: "来源/区域", render: (row, index) => `${crmInput("customers", index, "source", row.source)}${crmInput("customers", index, "region", row.region)}` },
      { label: "联系人", render: (row, index) => `${crmInput("customers", index, "contactName", row.contactName)}${crmSelect("customers", index, "contactRole", row.contactRole, opportunityContactRoleOptions())}` },
      { label: "电话/微信", render: (row, index) => `${crmInput("customers", index, "phone", row.phone, "tel")}${crmInput("customers", index, "wechat", row.wechat)}` },
      { label: "负责人/状态", render: (row, index) => `${crmSelect("customers", index, "ownerId", row.ownerId, ownerOptions)}${crmSelect("customers", index, "status", row.status, ["新线索", "已触达", "评级中", "商务中", "合作中", "流失/搁置"])}` },
      { label: "健康/分配", render: (row, index) => {
        const health = customerLeadHealth(row);
        const isMine = accountOwnsIdentity(ownerIdentityFromRow(row));
        const canAssign = canAssignCustomerToCurrentAccount(row);
        const duplicateText = health.duplicates.length ? ` · 重复：${health.duplicates.map((item) => item.name || "未命名").join("、")}` : "";
        return `<div class="crm-inline-actions crm-lead-health-actions">
          <span class="account-health-chip ${escapeHtml(health.tone)}">${escapeHtml(health.label)}</span>
          <button type="button" data-crm-customer-assign="${index}"${canAssign && !isMine ? "" : " disabled"}>${isMine ? "已归我" : "分配给我"}</button>
          <button type="button" data-crm-customer-sla="${index}"${crmCanEditCollection("customers") ? "" : " disabled"}>排跟进</button>
          <small>${escapeHtml(`${health.detail}${duplicateText}`)}</small>
        </div>`;
      } },
      { label: "下一步/备注", render: (row, index) => `${crmInput("customers", index, "nextAction", row.nextAction)}${crmInput("customers", index, "nextActionAt", row.nextActionAt, "date")}${crmTextarea("customers", index, "note", row.note)}` },
      { label: "机会动作", render: (row, index) => {
        const existing = existingOpportunityForCustomer(row);
        return `<div class="crm-inline-actions">
          <button type="button" class="${existing.record ? "" : "primary"}" data-crm-customer-opportunity="${index}"${canCreateOpportunity ? "" : " disabled"}>${existing.record ? "查看机会" : "生成机会"}</button>
          <small>${existing.record ? escapeHtml(existing.record.opportunityStatus || "已有机会") : "从客户客资入库"}</small>
        </div>`;
      } }
    ];
    const contractColumns = [
      { label: "点位/客户", render: (row, index) => `${crmInput("contracts", index, "pointName", row.pointName)}${crmSelect("contracts", index, "customerId", row.customerId, customerOptions)}` },
      { label: "类型/状态", render: (row, index) => `${crmSelect("contracts", index, "type", row.type, ["采购供货", "寄售合作", "授权联名", "定制开发", "框架协议"])}${crmSelect("contracts", index, "status", row.status, ["待制作", "法务/商务审核", "已发对方", "已签约", "归档", "作废"])}` },
      { label: "主体/授权", render: (row, index) => `${crmInput("contracts", index, "subjectName", row.subjectName || crmCustomerName(row.customerId))}${crmTextarea("contracts", index, "authorizationScope", row.authorizationScope)}` },
      { label: "金额/账期", render: (row, index) => `${crmInput("contracts", index, "amount", row.amount, "number", 'min="0" step="100"')}${crmInput("contracts", index, "settlementCycle", row.settlementCycle)}` },
      { label: "应收/回款", render: (row, index) => `${crmInput("contracts", index, "paidAmount", row.paidAmount || 0, "number", 'min="0" step="100"')}${crmInput("contracts", index, "receivableDueDate", row.receivableDueDate, "date")}${crmSelect("contracts", index, "paymentStatus", row.paymentStatus || contractPaymentStatus(row), ["待确认", "待回款", "部分回款", "已回款", "逾期未回款"])}` },
      { label: "保证金/开票", render: (row, index) => `${crmInput("contracts", index, "depositAmount", row.depositAmount || 0, "number", 'min="0" step="100"')}${crmSelect("contracts", index, "invoiceStatus", row.invoiceStatus || "待补开票信息", ["待补开票信息", "无需开票", "待开票", "已开票", "开票异常"])}${crmInput("contracts", index, "invoiceInfo", row.invoiceInfo)}` },
      { label: "模板/交付", render: (row, index) => `${crmInput("contracts", index, "template", row.template)}${crmTextarea("contracts", index, "deliveryTerms", row.deliveryTerms)}${crmInput("contracts", index, "nextAction", row.nextAction)}` },
      { label: "编号/推进", render: (row, index) => {
        const existingOrder = existingOrderForContract(row);
        const workflowAction = contractWorkflowAction(row);
        const canWorkflow = canRunContractWorkflow(workflowAction);
        return `${crmInput("contracts", index, "contractNo", row.contractNo || row.id)}
          <div class="crm-inline-actions">
            <button type="button" data-crm-draft="${escapeHtml(row.id)}">${activeCrmDraftId === row.id ? "收起草稿" : "查看草稿"}</button>
            ${workflowAction ? `<button type="button" class="${workflowAction.action === "sign" ? "primary" : ""}" data-crm-contract-workflow="${escapeHtml(workflowAction.action)}" data-crm-index="${index}"${canWorkflow ? "" : " disabled"}>${escapeHtml(workflowAction.label)}</button>` : ""}
            <button type="button" class="${existingOrder ? "" : "primary"}" data-crm-contract-order="${index}"${canCreateOrder ? "" : " disabled"}>${existingOrder ? "查看订单" : "生成订单/MES"}</button>
            <small>${workflowAction ? escapeHtml(`下一步：${workflowAction.nextStatus}`) : existingOrder ? escapeHtml(existingOrder.mesStatus || "已有订单") : "合同已完成流转"}</small>
          </div>`;
      } }
    ];
    const orderColumns = [
      { label: "点位/客户", render: (row, index) => `${crmInput("orders", index, "pointName", row.pointName)}${crmSelect("orders", index, "customerId", row.customerId, customerOptions)}` },
      { label: "订单类型", render: (row, index) => crmSelect("orders", index, "orderType", row.orderType, ["采购订单", "寄售铺货", "样品打样", "补货订单", "定制开发"]) },
      { label: "MES状态", render: (row, index) => crmSelect("orders", index, "mesStatus", row.mesStatus, ["待下单", "设计/打样", "待生产", "生产中", "质检/包装", "已出库", "已发货", "已完成"]) },
      { label: "金额/数量", render: (row, index) => `${crmInput("orders", index, "amount", row.amount, "number", 'min="0" step="100"')}${crmInput("orders", index, "quantity", row.quantity, "number", 'min="0" step="1"')}` },
      { label: "SKU/打样", render: (row, index) => `${crmTextarea("orders", index, "skuPlan", row.skuPlan)}${crmTextarea("orders", index, "designRequirement", row.designRequirement)}` },
      { label: "收货/交付", render: (row, index) => `${crmInput("orders", index, "receiverInfo", row.receiverInfo)}${crmInput("orders", index, "deliveryAddress", row.deliveryAddress)}${crmInput("orders", index, "launchDate", row.launchDate, "date")}` },
      { label: "交付日/备注", render: (row, index) => `${crmInput("orders", index, "dueDate", row.dueDate, "date")}${crmTextarea("orders", index, "note", row.note)}` },
      { label: "落地/销售", render: (row, index) => {
        const existingFulfillment = existingFulfillmentForOrder(row);
        const existingSales = existingSalesForOrder(row);
        const workflowAction = orderWorkflowAction(row);
        const canWorkflow = canRunOrderWorkflow(workflowAction);
        return `<div class="crm-inline-actions">
          ${workflowAction ? `<button type="button" class="${workflowAction.action === "ship" ? "primary" : ""}" data-crm-order-workflow="${escapeHtml(workflowAction.action)}" data-crm-index="${index}"${canWorkflow ? "" : " disabled"}>${escapeHtml(workflowAction.label)}</button>` : ""}
          <button type="button" class="${existingFulfillment ? "" : "primary"}" data-crm-order-fulfillment="${index}"${canCreateFulfillment ? "" : " disabled"}>${existingFulfillment ? "查看发货" : "建发货落地"}</button>
          <button type="button" class="${existingSales ? "" : "primary"}" data-crm-order-sales="${index}"${canCreateSales ? "" : " disabled"}>${existingSales ? "查看销售" : "建门店销售"}</button>
          <small>${workflowAction ? escapeHtml(`MES下一步：${workflowAction.nextStatus}`) : existingFulfillment ? escapeHtml(`${fulfillmentLandingStatus(existingFulfillment)} · ${existingFulfillment.receiptStatus || "签收待核"}`) : existingSales ? escapeHtml(`${existingSales.month || "未填月份"} · 动销${existingSales.sellThroughRate || 0}%`) : "先补发货签收，再跟回款/动销"}</small>
        </div>`;
      } }
    ];
    const salesColumns = [
      { label: "点位/月份", render: (row, index) => `${crmInput("storeSales", index, "pointName", row.pointName)}${crmInput("storeSales", index, "month", row.month, "month")}` },
      { label: "销售/回款", render: (row, index) => `${crmInput("storeSales", index, "salesAmount", row.salesAmount, "number", 'min="0" step="100"')}${crmInput("storeSales", index, "receiptAmount", row.receiptAmount, "number", 'min="0" step="100"')}` },
      { label: "毛利/提成", render: (row, index) => `${crmInput("storeSales", index, "grossProfitAmount", row.grossProfitAmount || saleGrossProfit(row), "number", 'min="0" step="100"')}${crmInput("storeSales", index, "estimatedCommission", row.estimatedCommission || saleEstimatedCommission(row), "number", 'min="0" step="10"')}` },
      { label: "销量/库存", render: (row, index) => `${crmInput("storeSales", index, "soldQty", row.soldQty || 0, "number", 'min="0" step="1"')}${crmInput("storeSales", index, "stockQty", row.stockQty || 0, "number", 'min="0" step="1"')}` },
      { label: "动销率%", render: (row, index) => `${crmInput("storeSales", index, "sellThroughRate", row.sellThroughRate, "number", 'min="0" max="100" step="1"')}${crmInput("storeSales", index, "suggestedReplenishmentQty", row.suggestedReplenishmentQty || saleReviewModel(row).suggestedQty, "number", 'min="0" step="1"')}` },
      { label: "复盘责任", render: (row, index) => `${crmSelect("storeSales", index, "replenishmentPriority", row.replenishmentPriority || saleReviewPriority(row), ["待判断", "待录入", "先复盘", "建议补货", "高优先级", "暂不补货"])}${crmInput("storeSales", index, "reviewOwner", row.reviewOwner || row.ownerName)}${crmInput("storeSales", index, "reviewDueDate", row.reviewDueDate, "date")}` },
      { label: "补货/复盘", render: (row, index) => {
        const existingOrder = existingReplenishmentOrderForSale(row);
        const review = saleReviewModel(row);
        const canReplenish = canCreateOrder && (review.canReplenish || Number(row.suggestedReplenishmentQty) > 0);
        const statusText = `${row.reviewStatus || review.status} · ${review.priority}`;
        return `${crmTextarea("storeSales", index, "replenishmentAdvice", row.replenishmentAdvice)}
          <div class="crm-inline-actions">
            <button type="button" data-crm-sales-review="${index}"${canCreateSales ? "" : " disabled"}>生成复盘</button>
            <button type="button" class="${existingOrder ? "" : "primary"}" data-crm-sales-replenish="${index}"${canReplenish || existingOrder ? "" : " disabled"}>${existingOrder ? "查看补货订单" : "生成补货订单"}</button>
            <small>${escapeHtml(`${statusText} · ${review.advice}`)}</small>
          </div>`;
      } }
    ];
    const crmPanelCounts = {
      customers: visibleCustomers.length,
      opportunities: visibleOpportunities.length,
      contracts: visibleContracts.length,
      orders: visibleOrders.length,
      fulfillment: visibleFulfillment.length,
      sales: visibleSales.length,
      total: filteredCrmTotal
    };
    const crmDashboardBody = `
      ${renderCrmExecutiveDashboard()}
      ${renderCrmDashboardSnapshot(lifecycleRows)}
      ${renderCrmPriorityQueue()}
      ${renderCrmPointProfile(lifecycleRows)}
      ${renderCrmManagementDashboard(lifecycleRows)}
      ${renderCrmOperatingCenter(lifecycleRows)}
      ${renderCrmBriefPanel(lifecycleRows)}
      ${renderCrmFunnelBoard(lifecycleRows)}
      ${renderCrmClosureBoard(lifecycleRows)}
      <section class="crm-section">
        <div class="crm-section-head">
          <div><strong>销售链路看板</strong><span>按点位串联客户、评级、合同、订单、发货和门店销售</span></div>
        </div>
        <div class="crm-lifecycle">
          <div class="crm-lifecycle-head"><span>点位</span><span>客户</span><span>评级/机会</span><span>合同</span><span>订单/MES</span><span>发货</span><span>门店销售</span><span>负责人</span><span>档案</span></div>
          ${lifecycleRows.map((row) => `<div class="crm-lifecycle-row">
            <strong>${escapeHtml(row.pointName)}</strong>
            <span>${escapeHtml(row.customer || "待绑定客户")}</span>
            <span>${escapeHtml(row.opportunity)}<small>${escapeHtml(row.rating)}</small></span>
            <span>${escapeHtml(row.contract)}</span>
            <span>${escapeHtml(row.order)}</span>
            <span>${escapeHtml(row.fulfillment)}</span>
            <span>${escapeHtml(row.sales)}</span>
            <span>${escapeHtml(row.owner || "待认领")}</span>
            <span><button type="button" data-crm-point-open="${escapeHtml(row.pointName)}">打开</button></span>
          </div>`).join("") || `<p class="empty">暂无链路数据，先保存一个点位评级。</p>`}
        </div>
      </section>`;
    const crmPanelBodies = {
      dashboard: crmDashboardBody,
      customers: crmCollectionVisible("customers") ? `${renderCrmPanelTaskQueue("customers")}${renderCrmTable("customers", "客户客资", customerColumns, visibleCustomers, canEdit)}` : "",
      contracts: crmCollectionVisible("contracts") ? `${renderCrmPanelTaskQueue("contracts")}${renderCrmTable("contracts", "合同制作/归档", contractColumns, visibleContracts, canEdit)}${renderCrmDraftPreview()}` : "",
      orders: crmCollectionVisible("orders") ? `${renderCrmPanelTaskQueue("orders")}${renderCrmTable("orders", "订单/MES", orderColumns, visibleOrders, canEdit)}` : "",
      storeSales: crmCollectionVisible("storeSales") ? `${renderCrmPanelTaskQueue("storeSales")}${renderCrmTable("storeSales", "门店销售数据", salesColumns, visibleSales, canEdit)}` : ""
    };
    const activeCrmBody = crmPanelBodies[activeCrmPanel] || crmDashboardBody;
    container.innerHTML = `
      <div class="crm-hero">
        <div>
          <strong>${escapeHtml(uiLayout.texts.crmHeadTitle)}</strong>
          <span>${escapeHtml(uiLayout.texts.crmHeadIntro)}</span>
        </div>
        <div class="crm-hero-actions">
          <button type="button" data-view-target="scenario">新建评级</button>
          <button type="button" data-view-target="records">机会池</button>
          <button type="button" data-view-target="fulfillment">落地台账</button>
        </div>
      </div>
      ${renderCrmPanelTabs(crmPanelCounts)}
      ${renderCrmFilters(ownerOptions, { total: filteredCrmTotal })}
      ${activeCrmBody || `<p class="empty">当前子页暂无可显示数据。</p>`}
    `;
  }

  function permissionCheckbox(account, moduleKey, actionKey, accountIndex, disabled) {
    const permissions = normalizePermissions(account.permissions, account.role);
    const checked = permissions[moduleKey] && permissions[moduleKey][actionKey] ? " checked" : "";
    return `<label class="permission-check">
      <input type="checkbox"${checked}${disabled ? " disabled" : ""} data-account-permission data-account-index="${accountIndex}" data-permission-module="${escapeHtml(moduleKey)}" data-permission-action="${escapeHtml(actionKey)}">
      <span>${escapeHtml(permissionActions.find((item) => item.key === actionKey).label)}</span>
    </label>`;
  }

  function permissionEnabledCount(permissions) {
    return permissionModules.reduce((sum, module) => {
      const modulePermissions = permissions[module.key] || {};
      return sum + permissionActions.filter((action) => modulePermissions[action.key]).length;
    }, 0);
  }

  function permissionTotalCount() {
    return permissionModules.length * permissionActions.length;
  }

  function accountTemplateDiffCount(account) {
    const actual = normalizePermissions(account.permissions, account.role);
    const template = permissionsForRole(account.role);
    return permissionModules.reduce((sum, module) => {
      return sum + permissionActions.filter((action) => Boolean(actual[module.key][action.key]) !== Boolean(template[module.key][action.key])).length;
    }, 0);
  }

  function requiredModulesForRole(role) {
    if (role === "管理员") return permissionModules.map((module) => module.key);
    if (role === "运营") return ["crm", "orders", "fulfillment", "storeSales"];
    if (role === "渠道") return ["crm", "customers", "opportunities", "storeSales"];
    return ["crm", "customers", "opportunities", "contracts", "orders", "fulfillment", "storeSales"];
  }

  function accountPermissionHealth(account) {
    const permissions = normalizePermissions(account.permissions, account.role);
    const gaps = requiredModulesForRole(account.role).filter((moduleKey) => !permissions[moduleKey] || !permissions[moduleKey].view);
    const diffCount = accountTemplateDiffCount(account);
    const hasAccountAdminRisk = account.role !== "管理员" && permissions.accounts && permissions.accounts.admin;
    const dataScope = normalizeAccountDataScope(account.dataScope, account.role);
    const hasBroadDataRisk = dataScope === "all" && !["管理员", "运营"].includes(account.role);
    const security = accountSecurityHealth(account);
    if (account.status === "停用") return { label: "停用", tone: "weak", detail: "账号不可登录，不参与销售分配", gaps, diffCount };
    if (security.tone === "weak") return { label: security.label, tone: "weak", detail: security.detail, gaps, diffCount };
    if (hasAccountAdminRisk) return { label: "高权限", tone: "weak", detail: "非管理员拥有账号管理权限，需复核", gaps, diffCount };
    if (hasBroadDataRisk) return { label: "数据过宽", tone: "medium", detail: "非管理/运营账号可见全量数据，需复核", gaps, diffCount };
    if (security.tone === "medium") return { label: security.label, tone: "medium", detail: security.detail, gaps, diffCount };
    if (gaps.length) return { label: "缺权限", tone: "medium", detail: `缺少 ${gaps.map((key) => (permissionModules.find((module) => module.key === key) || {}).label || key).join("、")}`, gaps, diffCount };
    if (diffCount) return { label: "自定义", tone: "mid-high", detail: `与${account.role}模板有${diffCount}项差异`, gaps, diffCount };
    return { label: "标准", tone: "strong", detail: "匹配角色权限模板", gaps, diffCount };
  }

  function renderAccountPolicyBoard() {
    return `<section class="account-policy-board">
      <div class="account-policy-head">
        <div><strong>角色策略</strong><span>按平台常见RBAC拆分职责：先按角色给模板，再允许管理员按账号微调。</span></div>
      </div>
      <div class="account-role-cards">
        ${accountRoleList.map((role) => {
          const template = permissionsForRole(role);
          const enabledCount = permissionEnabledCount(template);
          const enabledModules = permissionModules
            .filter((module) => permissionActions.some((action) => template[module.key][action.key]))
            .map((module) => module.label);
          return `<article class="account-role-card">
            <div><strong>${escapeHtml(role)}</strong><span>${accounts.filter((account) => account.role === role).length} 个账号</span></div>
            <p>${escapeHtml(accountRolePolicyDescriptions[role] || "")}</p>
            <small>${enabledCount}/${permissionTotalCount()} 权限点 · 默认${escapeHtml(accountDataScopeLabel(defaultAccountDataScope(role)))} · ${escapeHtml(enabledModules.join("、") || "无模块")}</small>
          </article>`;
        }).join("")}
      </div>
    </section>`;
  }

  function renderAccountGovernanceBoard() {
    const healthRows = accounts.map((account) => ({ account, health: accountPermissionHealth(account) }));
    const issueCount = healthRows.filter(({ health }) => health.tone === "weak" || health.tone === "medium").length;
    const customCount = healthRows.filter(({ health }) => health.diffCount).length;
    return `<section class="account-governance-board">
      <div class="account-policy-head">
        <div><strong>权限体检</strong><span>用于发现停用账号、异常高权限、销售链路缺权限和偏离角色模板的账号。</span></div>
        <div class="account-governance-summary">
          <span>需复核 ${issueCount}</span>
          <span>自定义 ${customCount}</span>
        </div>
      </div>
      <div class="account-health-list">
        ${healthRows.map(({ account, health }) => {
          const permissions = normalizePermissions(account.permissions, account.role);
          return `<article class="account-health-card ${escapeHtml(health.tone)}">
            <div>
              <strong>${escapeHtml(account.name)}</strong>
              <span>${escapeHtml(account.role)} · ${escapeHtml(account.team || "未分组")} · ${escapeHtml(accountDataScopeLabel(account.dataScope))}</span>
            </div>
            <b>${escapeHtml(health.label)}</b>
            <small>${escapeHtml(health.detail)}</small>
            <em>${permissionEnabledCount(permissions)}/${permissionTotalCount()} 权限点</em>
          </article>`;
        }).join("")}
      </div>
    </section>`;
  }

  function renderAccountAuditTrail() {
    const activities = recentCrmActivities(10, (activity) => activity.type === "账号权限" || activity.targetType === "account");
    return `<section class="account-audit-trail">
      <div class="account-audit-head"><strong>权限审计</strong><span>记录账号、角色、状态和权限变更</span></div>
      ${renderActivityFeed(activities, "暂无账号权限变更记录")}
    </section>`;
  }

  function permissionModuleLabel(moduleKey) {
    const module = permissionModules.find((item) => item.key === moduleKey);
    return module ? module.label : moduleKey;
  }

  function renderAccountNavigationMap() {
    const navMap = [
      {
        group: "销售经营",
        detail: "销售每天推进的主链路，按二级页拆成不同权限模块。",
        pages: [
          { name: "管理驾驶舱", modules: ["crm"], note: "总览和经营风险" },
          { name: "客户客资", modules: ["crm", "customers"], note: "客户资料与分配" },
          { name: "点位机会", modules: ["opportunities"], note: "公海、认领、报备" },
          { name: "合同管理", modules: ["contracts"], note: "合同制作与签约审批" },
          { name: "订单/MES", modules: ["orders"], note: "下单、生产、出库" },
          { name: "门店销售", modules: ["storeSales"], note: "销售回款、动销和补货" }
        ]
      },
      {
        group: "点位评级",
        detail: "评级页负责测算和机会入库，景区库只做公开底库。",
        pages: [
          { name: "场景评级", modules: ["opportunities", "crm"], note: "保存后进入点位机会" },
          { name: "景区库", modules: ["opportunities", "crm"], note: "公开数据检索和预填" }
        ]
      },
      {
        group: "履约动销",
        detail: "已签点位的发货、签收、上架和异常补录。",
        pages: [
          { name: "点位落地", modules: ["fulfillment"], note: "库管同步只读，销售补录" }
        ]
      },
      {
        group: "商品价格",
        detail: "产品资料、SKU、成本和定价能力。",
        pages: [
          { name: "产品库", modules: ["crm", "rules"], note: "产品类别、SKU、测算产品" },
          { name: "定价测算", modules: ["crm", "rules"], note: "渠道价与场景价" },
          { name: "成本库", modules: ["rules"], note: "成本组件与价带" }
        ]
      },
      {
        group: "系统/账号",
        detail: "平台规则和人员权限，默认只给管理角色。",
        pages: [
          { name: "规则参数", modules: ["rules"], note: "评分、采购、提成规则" },
          { name: "账号权限", modules: ["accounts"], note: "账号、角色、权限和审计" }
        ]
      }
    ];
    return `<section class="account-nav-map">
      <div class="account-policy-head">
        <div><strong>导航与权限映射</strong><span>管理员配置账号时，先看页面归属，再决定开放查看、编辑、审批或管理权限。</span></div>
      </div>
      <div class="account-nav-grid">
        ${navMap.map((group) => `<article class="account-nav-card">
          <div>
            <strong>${escapeHtml(group.group)}</strong>
            <span>${escapeHtml(group.detail)}</span>
          </div>
          <ul>
            ${group.pages.map((page) => `<li>
              <b>${escapeHtml(page.name)}</b>
              <small>${escapeHtml(page.modules.map(permissionModuleLabel).join(" + "))}</small>
              <em>${escapeHtml(page.note)}</em>
            </li>`).join("")}
          </ul>
        </article>`).join("")}
      </div>
    </section>`;
  }

  function renderAccountAdmin() {
    const container = qs("#accountAdminBody");
    if (!container) return;
    if (!accountHasPermission("accounts", "view")) {
      container.innerHTML = permissionGateHtml("没有账号管理权限", "账号管理包含团队账号、角色、停用和模块权限。");
      return;
    }
    const canEdit = accountHasPermission("accounts", "edit");
    const canAdmin = accountHasPermission("accounts", "admin");
    container.innerHTML = `
      <div class="account-admin-head">
        <div>
          <strong>账号权限管理</strong>
          <span>本地RBAC模型：账号状态、登录口令、角色、团队、模块权限均可配置。全量备份包含本地演示口令，仅供内部保存。</span>
        </div>
        <div class="account-admin-actions">
          ${canEdit ? `<button type="button" class="primary" data-add-account>新增账号</button><button type="button" data-reset-accounts>恢复默认账号</button>` : ""}
          ${canAdmin ? `<button type="button" data-export-workspace-backup>导出全量备份</button><label class="import-label">恢复全量备份<input type="file" data-import-workspace-backup accept="application/json,.json"></label>` : ""}
        </div>
      </div>
      <section class="account-admin-stats">
        <div><span>账号总数</span><strong>${accounts.length}</strong></div>
        <div><span>启用</span><strong>${accounts.filter((account) => account.status !== "停用").length}</strong></div>
        <div><span>管理员</span><strong>${accounts.filter((account) => account.role === "管理员").length}</strong></div>
        <div><span>锁定/改密</span><strong>${accounts.filter(accountIsLocked).length}/${accounts.filter((account) => account.mustChangePassword).length}</strong></div>
      </section>
      ${renderAccountNavigationMap()}
      ${renderAccountPolicyBoard()}
      ${renderAccountGovernanceBoard()}
      ${renderAccountAuditTrail()}
      <div class="account-admin-list">
        ${accounts.map((account, index) => {
          const isCurrent = account.id === currentAccount().id;
          const disabled = canEdit ? "" : " disabled";
          const health = accountPermissionHealth(account);
          const security = accountSecurityHealth(account);
          return `<article class="account-admin-card${isCurrent ? " active" : ""}">
            <div class="account-admin-card-head">
              <div>
                <strong>${escapeHtml(account.name)}</strong>
                <span>${escapeHtml(account.loginName)} · ${escapeHtml(account.role)} · ${escapeHtml(account.status)} · ${escapeHtml(accountDataScopeLabel(account.dataScope))}</span>
                <small class="account-health-chip ${escapeHtml(health.tone)}">${escapeHtml(health.label)} · ${escapeHtml(health.detail)}</small>
                <small class="account-health-chip ${escapeHtml(security.tone)}">${escapeHtml(security.label)} · ${escapeHtml(security.detail)}</small>
              </div>
              <div class="account-admin-card-actions">
                ${canAdmin ? `<button type="button" data-login-account="${escapeHtml(account.id)}">模拟登录</button><button type="button" data-reset-account-password="${index}">重置口令</button>${accountIsLocked(account) || Number(account.failedLoginCount) ? `<button type="button" data-unlock-account="${index}">解锁</button>` : ""}` : ""}
                ${canEdit ? `<button type="button" data-reset-account-permissions="${index}">套用角色模板</button>${account.role !== "管理员" ? `<button type="button" class="rule-delete-btn" data-delete-account="${index}">删除</button>` : ""}` : ""}
              </div>
            </div>
            <div class="account-admin-fields">
              ${field("登录名", `<input type="text" value="${escapeHtml(account.loginName)}" ${accountFieldAttrs(index, "loginName", account.loginName, disabled)}>`)}
              ${field("姓名", `<input type="text" value="${escapeHtml(account.name)}" ${accountFieldAttrs(index, "name", account.name, disabled)}>`)}
              ${field("角色", selectInput(account.role, accountRoleList.map((role) => ({ value: role, label: role })), accountFieldAttrs(index, "role", account.role, disabled)))}
              ${field("团队", `<input type="text" value="${escapeHtml(account.team)}" ${accountFieldAttrs(index, "team", account.team, disabled)}>`)}
              ${field("数据范围", selectInput(account.dataScope || defaultAccountDataScope(account.role), accountDataScopeOptions.map((option) => ({ value: option.value, label: option.label })), accountFieldAttrs(index, "dataScope", account.dataScope || defaultAccountDataScope(account.role), disabled)), (accountDataScopeOptions.find((option) => option.value === account.dataScope) || {}).detail || "控制CRM与机会池可见范围")}
              ${field("状态", selectInput(account.status, [{ value: "启用", label: "启用" }, { value: "停用", label: "停用" }], accountFieldAttrs(index, "status", account.status, disabled)))}
              ${field("登录口令", `<input type="password" value="${escapeHtml(account.password || defaultAccountPassword(account.role))}" ${accountFieldAttrs(index, "password", account.password || defaultAccountPassword(account.role), disabled)}>`, "本地演示口令，可重置为临时口令")}
              ${field("下次改密", selectInput(account.mustChangePassword ? "true" : "false", [{ value: "false", label: "不要求" }, { value: "true", label: "要求改密" }], accountFieldAttrs(index, "mustChangePassword", account.mustChangePassword ? "true" : "false", disabled)))}
              ${field("手机", `<input type="text" value="${escapeHtml(account.phone || "")}" ${accountFieldAttrs(index, "phone", account.phone || "", disabled)}>`, account.lastLoginAt ? `最近登录 ${account.lastLoginAt}` : "尚未登录")}
              ${field("登录安全", `<input type="text" value="${escapeHtml(accountIsLocked(account) ? `锁定至 ${accountLockLabel(account)}` : `失败 ${Number(account.failedLoginCount || 0)} 次`)}" disabled>`, account.lastLoginResult ? `最近结果 ${account.lastLoginResult}` : "暂无异常")}
              ${field("备注", `<input type="text" value="${escapeHtml(account.note || "")}" ${accountFieldAttrs(index, "note", account.note || "", disabled)}>`)}
            </div>
            <div class="permission-matrix">
              <div class="permission-matrix-head"><span>模块</span>${permissionActions.map((action) => `<span>${escapeHtml(action.label)}</span>`).join("")}</div>
              ${permissionModules.map((module) => `<div class="permission-matrix-row">
                <div><strong>${escapeHtml(module.label)}</strong><small>${escapeHtml(module.detail)}</small></div>
                ${permissionActions.map((action) => permissionCheckbox(account, module.key, action.key, index, !canEdit || account.role === "管理员" && action.key !== "view")).join("")}
              </div>`).join("")}
            </div>
          </article>`;
        }).join("")}
      </div>
    `;
  }

  function accountFieldAttrs(index, key, value, disabled = "") {
    return `data-account-field data-account-index="${index}" data-account-key="${escapeHtml(key)}" data-account-original="${escapeHtml(value ?? "")}"${disabled}`;
  }

  function enabledAdminCount(excludeId = "") {
    return accounts.filter((account) =>
      account.id !== excludeId
      && account.role === "管理员"
      && account.status !== "停用"
    ).length;
  }

  function protectAdminAccountChange(account, key, nextValue, target) {
    if (!account) return false;
    const isSelf = account.id && account.id === currentAccount().id;
    const isActiveAdmin = account.role === "管理员" && account.status !== "停用";
    const removingAdminRole = key === "role" && account.role === "管理员" && nextValue !== "管理员";
    const disablingAdmin = key === "status" && isActiveAdmin && nextValue === "停用";
    if (!removingAdminRole && !disablingAdmin) return false;
    if (isSelf) {
      alert("不能降权或停用当前登录的管理员账号。请使用另一个管理员账号操作。");
      target.value = account[key];
      return true;
    }
    if (enabledAdminCount(account.id) <= 0) {
      alert("至少需要保留一个启用的管理员账号。");
      target.value = account[key];
      return true;
    }
    return false;
  }

  function touchAccount(account) {
    account.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  }

  function updateManagedAccountField(target, options = {}) {
    if (!accountHasPermission("accounts", "edit")) {
      alert("当前账号没有编辑账号权限。");
      renderAccountAdmin();
      return;
    }
    const shouldLog = options.log !== false;
    const shouldRender = options.render !== false;
    const index = Number(target.dataset.accountIndex);
    const key = target.dataset.accountKey;
    const account = accounts[index];
    if (!account || !key) return;
    if (protectAdminAccountChange(account, key, target.value, target)) return;
    const previous = Object.prototype.hasOwnProperty.call(target.dataset, "accountOriginal")
      ? target.dataset.accountOriginal
      : account[key];
    if (key === "dataScope") {
      account[key] = normalizeAccountDataScope(target.value, account.role);
    } else if (key === "mustChangePassword") {
      account[key] = target.value === "true";
    } else {
      account[key] = target.value;
    }
    if (key === "role") {
      account.permissions = permissionsForRole(account.role);
      account.dataScope = defaultAccountDataScope(account.role);
    }
    if (key === "password") {
      account.passwordUpdatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
      account.failedLoginCount = 0;
      account.lockedUntil = "";
      account.mustChangePassword = false;
    }
    touchAccount(account);
    accounts = normalizeAccounts(accounts);
    persistAccounts();
    if (shouldLog && String(previous ?? "") !== String(target.value ?? "")) {
      appendCrmActivity({
        type: "账号权限",
        title: "修改账号字段",
        detail: `${account.name} · ${key}: ${previous || "空"} -> ${account[key] || "空"}`,
        targetType: "account",
        targetId: account.id,
        ownerId: account.id,
        ownerName: account.name,
        tone: key === "status" || key === "role" ? "medium" : "neutral"
      });
      target.dataset.accountOriginal = String(account[key] ?? "");
    }
    if (account.id === accountSession.id) {
      accountSession = normalizeAccountSession({
        ...account,
        authenticated: hasAccount() && account.status !== "停用",
        loginAt: accountSession.loginAt
      });
      persistAccountSession();
      if (shouldRender) renderAccountBar();
    }
    if (shouldRender) {
      renderAccountAdmin();
      renderRecords();
      renderCrmWorkspace();
    }
  }

  function updateManagedAccountPermission(target) {
    if (!accountHasPermission("accounts", "edit")) {
      alert("当前账号没有编辑账号权限。");
      renderAccountAdmin();
      return;
    }
    const index = Number(target.dataset.accountIndex);
    const account = accounts[index];
    const moduleKey = target.dataset.permissionModule;
    const actionKey = target.dataset.permissionAction;
    if (!account || !moduleKey || !actionKey) return;
    account.permissions = normalizePermissions(account.permissions, account.role);
    account.permissions[moduleKey][actionKey] = target.checked;
    if (actionKey !== "view" && target.checked) account.permissions[moduleKey].view = true;
    if (actionKey === "view" && !target.checked) {
      account.permissions[moduleKey].edit = false;
      account.permissions[moduleKey].approve = false;
      account.permissions[moduleKey].admin = false;
    }
    touchAccount(account);
    persistAccounts();
    appendCrmActivity({
      type: "账号权限",
      title: "修改模块权限",
      detail: `${account.name} · ${moduleKey}/${actionKey} ${target.checked ? "开启" : "关闭"}`,
      targetType: "account",
      targetId: account.id,
      ownerId: account.id,
      ownerName: account.name,
      tone: "medium"
    });
    if (account.id === accountSession.id) {
      accountSession = normalizeAccountSession({
        ...account,
        authenticated: hasAccount() && account.status !== "停用",
        loginAt: accountSession.loginAt
      });
      persistAccountSession();
    }
    renderAccountAdmin();
    renderAccountBar();
    renderContextToolbar();
  }

  function resetManagedAccountPermissions(index) {
    if (!accountHasPermission("accounts", "edit")) {
      alert("当前账号没有编辑账号权限。");
      return;
    }
    const account = accounts[index];
    if (!account) return;
    account.permissions = permissionsForRole(account.role);
    account.dataScope = defaultAccountDataScope(account.role);
    touchAccount(account);
    persistAccounts();
    appendCrmActivity({
      type: "账号权限",
      title: "套用角色模板",
      detail: `${account.name} · 已恢复为${account.role}标准权限`,
      targetType: "account",
      targetId: account.id,
      ownerId: account.id,
      ownerName: account.name,
      tone: "medium"
    });
    if (account.id === accountSession.id) {
      accountSession = normalizeAccountSession({
        ...account,
        authenticated: hasAccount() && account.status !== "停用",
        loginAt: accountSession.loginAt
      });
      persistAccountSession();
    }
    renderAccountAdmin();
    renderAccountBar();
    renderContextToolbar();
    renderRecords();
    renderCrmWorkspace();
  }

  function addManagedAccount() {
    if (!accountHasPermission("accounts", "edit")) {
      alert("当前账号没有新增账号权限。");
      return;
    }
    const id = `account-${Date.now().toString(36)}`;
    const tempPassword = temporaryAccountPassword({ role: "销售" });
    const nextAccount = normalizeAccountRecord({
      id,
      loginName: id,
      name: "新销售账号",
      role: "销售",
      team: currentAccount().team || "",
      status: "启用",
      password: tempPassword,
      mustChangePassword: true,
      passwordUpdatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      note: "新建账号",
      permissions: permissionsForRole("销售")
    }, accounts.length);
    accounts.push(nextAccount);
    persistAccounts();
    appendCrmActivity({
      type: "账号权限",
      title: "新增账号",
      detail: `${nextAccount.name} · ${nextAccount.role} · 临时口令 ${nextAccount.password} · 首次登录需改密`,
      targetType: "account",
      targetId: nextAccount.id,
      ownerId: nextAccount.id,
      ownerName: nextAccount.name,
      tone: "mid-high"
    });
    renderAccountAdmin();
    renderAccountBar();
  }

  function deleteManagedAccount(index) {
    if (!accountHasPermission("accounts", "edit")) {
      alert("当前账号没有删除账号权限。");
      return;
    }
    const account = accounts[index];
    if (!account || account.role === "管理员") {
      alert("管理员账号不能删除。");
      return;
    }
    if (!window.confirm(`确认删除账号“${account.name}”？`)) return;
    accounts.splice(index, 1);
    persistAccounts();
    appendCrmActivity({
      type: "账号权限",
      title: "删除账号",
      detail: `${account.name} · ${account.role}`,
      targetType: "account",
      targetId: account.id,
      ownerId: account.id,
      ownerName: account.name,
      tone: "weak"
    });
    if (accountSession.id === account.id) {
      accountSession = normalizeAccountSession({});
      persistAccountSession();
    }
    renderAccountAdmin();
    renderAccountBar();
    renderRecords();
    renderCrmWorkspace();
  }

  function resetManagedAccounts() {
    if (!accountHasPermission("accounts", "edit")) {
      alert("当前账号没有重置账号权限。");
      return;
    }
    if (!window.confirm("确认恢复默认账号和默认权限？现有自定义账号会被覆盖。")) return;
    accounts = normalizeAccounts(defaultAccounts);
    persistAccounts();
    setStorageText(STORAGE_ACCOUNT_SEED_VERSION, ACCOUNT_SEED_VERSION);
    appendCrmActivity({
      type: "账号权限",
      title: "恢复默认账号",
      detail: "管理员恢复默认账号和默认权限",
      targetType: "account",
      tone: "weak"
    });
    accountSession = normalizeAccountSession({
      ...accounts[0],
      authenticated: true,
      loginAt: new Date().toLocaleString("zh-CN", { hour12: false })
    });
    persistAccountSession();
    syncOperatorFromAccount();
    renderAccountAdmin();
    renderAccountBar();
    renderRecords();
    renderCrmWorkspace();
  }

  function crmDefaultRow(collection) {
    const account = currentAccount();
    const ownerPayload = { ownerId: account.id || "", ownerName: account.name || "", ownerTeam: account.team || "" };
    const firstCustomer = crmWorkspace.customers[0] || {};
    if (collection === "customers") {
      return {
        id: `CUST-${Date.now().toString(36)}`,
        name: "新客户/新客资",
        type: "景区/运营方",
        source: "销售新增",
        region: "",
        ...ownerPayload,
        contactName: "",
        contactRole: "待确认",
        phone: "",
        wechat: "",
        status: "新线索",
        nextAction: "补齐联系人与点位信息",
        nextActionAt: crmDatePlusDays("", 3),
        note: ""
      };
    }
    if (collection === "contracts") {
      return {
        id: `CON-${Date.now().toString(36)}`,
        customerId: firstCustomer.id || "",
        pointName: "",
        type: "采购供货",
        status: "待制作",
        ...ownerPayload,
        subjectName: firstCustomer.name || "",
        authorizationScope: "待确认景区名称、地标元素、联名露出和使用周期",
        settlementCycle: "待确认账期与对账周期",
        depositAmount: 0,
        invoiceInfo: "待补开票信息",
        invoiceStatus: "待补开票信息",
        paidAmount: 0,
        receivableDueDate: "",
        paymentStatus: "待确认",
        deliveryTerms: "首批SKU、数量、打样确认、发货时间、收货人和签收凭证待确认",
        amount: 0,
        signDate: "",
        template: "景区合作协议",
        nextAction: "生成合同初稿",
        note: ""
      };
    }
    if (collection === "orders") {
      return {
        id: `ORD-${Date.now().toString(36)}`,
        customerId: firstCustomer.id || "",
        pointName: "",
        orderType: "采购订单",
        mesStatus: "待下单",
        ...ownerPayload,
        amount: 0,
        quantity: 0,
        skuPlan: "待补首批SKU、单款数量、69码和图片链接",
        designRequirement: "待确认画面素材、打样要求、包装贴标和出样节点",
        receiverInfo: "待补收货人/电话",
        deliveryAddress: "待补收货地址/交付门店",
        launchDate: "",
        dueDate: "",
        note: ""
      };
    }
    return { id: `SALE-${Date.now().toString(36)}`, customerId: firstCustomer.id || "", pointName: "", month: new Date().toISOString().slice(0, 7), salesAmount: 0, receiptAmount: 0, salesCostAmount: 0, soldQty: 0, stockQty: 0, suggestedReplenishmentQty: 0, grossProfitAmount: 0, estimatedCommission: 0, sellThroughRate: 0, replenishmentPriority: "待判断", reviewOwner: ownerPayload.ownerName || "", reviewDueDate: "", replenishmentAdvice: "待录入销售数据", reviewStatus: "待复盘", reviewedAt: "", replenishmentOrderId: "", ...ownerPayload, note: "" };
  }

  function addCrmRow(collection) {
    if (!crmCanEditCollection(collection)) {
      alert(`当前账号没有新增${crmPanelLabel(crmPanelForCollection(collection))}权限。`);
      return;
    }
    if (!crmWorkspace[collection]) return;
    const row = crmDefaultRow(collection);
    crmWorkspace[collection].unshift(row);
    persistCrmWorkspace();
    appendCrmActivity({
      type: collection === "contracts" ? "合同" : collection === "orders" ? "订单/MES" : collection === "storeSales" ? "门店销售" : "客户客资",
      title: "新增CRM记录",
      detail: row.pointName || row.name || row.orderType || row.month || "新记录",
      pointName: row.pointName || row.name || "",
      targetType: collection,
      targetId: row.id || "",
      ownerId: row.ownerId || "",
      ownerName: row.ownerName || "",
      tone: "neutral"
    });
    renderCrmWorkspace();
  }

  function deleteCrmRow(collection, index) {
    if (!crmCanAdminCollection(collection)) {
      alert(`当前账号没有删除${crmPanelLabel(crmPanelForCollection(collection))}权限。`);
      return;
    }
    if (!crmWorkspace[collection] || !crmWorkspace[collection][index]) return;
    const row = crmWorkspace[collection][index];
    crmWorkspace[collection].splice(index, 1);
    persistCrmWorkspace();
    appendCrmActivity({
      type: collection === "contracts" ? "合同" : collection === "orders" ? "订单/MES" : collection === "storeSales" ? "门店销售" : "客户客资",
      title: "删除CRM记录",
      detail: row.pointName || row.name || row.orderType || row.month || "已删除记录",
      pointName: row.pointName || row.name || "",
      targetType: collection,
      targetId: row.id || "",
      ownerId: row.ownerId || "",
      ownerName: row.ownerName || "",
      tone: "weak"
    });
    renderCrmWorkspace();
  }

  function updateCrmField(target, options = {}) {
    const shouldLog = options.log !== false;
    const collection = target.dataset.crmCollection;
    if (!crmCanEditCollection(collection)) {
      alert(`当前账号没有编辑${crmPanelLabel(crmPanelForCollection(collection))}权限。`);
      renderCrmWorkspace();
      return;
    }
    const index = Number(target.dataset.crmIndex);
    const key = target.dataset.crmKey;
    const row = crmWorkspace[collection] && crmWorkspace[collection][index];
    if (!row || !key) return;
    const previous = Object.prototype.hasOwnProperty.call(target.dataset, "crmOriginal")
      ? target.dataset.crmOriginal
      : row[key];
    row[key] = target.type === "number" ? Number(target.value) : target.value;
    if (key === "ownerId") {
      const owner = accounts.find((account) => account.id === target.value);
      row.ownerName = owner ? owner.name : row.ownerName;
      row.ownerTeam = owner ? owner.team : row.ownerTeam;
    }
    if (collection === "contracts" && ["amount", "paidAmount", "receivableDueDate"].includes(key)) {
      row.paymentStatus = contractPaymentStatus({ ...row, paymentStatus: "待确认" });
    }
    if (collection === "storeSales" && ["salesAmount", "receiptAmount", "salesCostAmount", "soldQty", "stockQty", "sellThroughRate"].includes(key)) {
      if (["soldQty", "stockQty"].includes(key) && Number(row.stockQty) > 0) {
        row.sellThroughRate = Math.min(100, Math.round((Number(row.soldQty) || 0) / Number(row.stockQty) * 100));
      }
      const review = saleReviewModel(row);
      if (!Number(row.grossProfitAmount)) row.grossProfitAmount = saleGrossProfit(row);
      if (!Number(row.estimatedCommission)) row.estimatedCommission = saleEstimatedCommission(row);
      if (!row.replenishmentPriority || ["待判断", "待录入"].includes(row.replenishmentPriority)) row.replenishmentPriority = review.priority;
      if (!Number(row.suggestedReplenishmentQty)) row.suggestedReplenishmentQty = review.suggestedQty;
      if (!row.replenishmentAdvice || ["待录入销售数据", "待录入门店销售数据"].includes(row.replenishmentAdvice) || String(row.replenishmentAdvice).includes("上线后按周")) {
        row.replenishmentAdvice = review.advice;
      }
    }
    row.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    persistCrmWorkspace();
    const trackedCrmFieldKeys = [
      "status", "mesStatus", "salesAmount", "receiptAmount", "sellThroughRate", "nextAction", "nextActionAt",
      "name", "type", "source", "region", "ownerId", "ownerName", "contactName", "contactRole", "phone", "wechat", "note",
      "subjectName", "authorizationScope", "settlementCycle", "depositAmount", "invoiceInfo", "invoiceStatus", "paidAmount", "receivableDueDate", "paymentStatus", "deliveryTerms",
      "amount", "quantity", "skuPlan", "designRequirement", "receiverInfo", "deliveryAddress", "launchDate", "signDate",
      "grossProfitAmount", "estimatedCommission", "soldQty", "stockQty", "suggestedReplenishmentQty", "replenishmentPriority", "reviewOwner", "reviewDueDate", "reviewStatus", "reviewedAt"
    ];
    if (shouldLog && trackedCrmFieldKeys.includes(key) && String(previous ?? "") !== String(row[key] ?? "")) {
      appendCrmActivity({
        type: collection === "contracts" ? "合同" : collection === "orders" ? "订单/MES" : collection === "storeSales" ? "门店销售" : "客户客资",
        title: "更新CRM字段",
        detail: `${key}: ${previous || "空"} -> ${row[key] || "空"}`,
        pointName: row.pointName || row.name || "",
        targetType: collection,
        targetId: row.id || "",
        ownerId: row.ownerId || "",
        ownerName: row.ownerName || "",
        tone: "neutral"
      });
      target.dataset.crmOriginal = String(target.type === "number" ? row[key] : target.value ?? "");
    }
  }

  function renderApp() {
    renderAccountBar();
    renderProductCards();
    renderCostEditor();
    renderScenarioControls();
    renderScenicDatabase();
    renderPricing();
    renderSettings();
    renderProductLibrary();
    renderRecords();
    renderFulfillment();
    renderCrmWorkspace();
    renderAccountAdmin();
    renderUiEditor();
    updateCalculatedViews();
    setActiveView(activeView);
    setActiveScenarioPanel(activeScenarioPanel);
    setActiveProductPanel(activeProductPanel);
    renderContextToolbar();
    applyUiLayout();
  }

  function renderProductCards() {
    const result = currentResult();
    const html = data.products.map((product) => {
      const productResult = XJCore.calculate(data, { productId: product.id, scenario: state.scenario, channel: state.channel });
      const active = product.id === result.cost.product.id ? " active" : "";
      return `
        <button class="product-card${active}" draggable="true" data-product-card="${escapeHtml(product.id)}">
          <span class="product-id">${escapeHtml(product.id)}</span>
          <strong>${escapeHtml(product.name)}</strong>
          <span>${escapeHtml(product.spec)} · ${escapeHtml(product.productType)}</span>
          <b>${money(productResult.cost.totalCost)} / ${money(productResult.cost.minRetail)}</b>
        </button>`;
    }).join("");
    qs("#productPalette").innerHTML = html;
  }

  function renderCostEditor() {
    const result = currentResult();
    const product = result.cost.product;
    const componentRows = Object.entries(XJCore.componentLabels).map(([key, label]) => {
      const value = result.cost.components[key];
      return `
        <dt>${escapeHtml(label)}</dt>
        <dd>${money(value)}</dd>`;
    }).join("");

    qs("#dropZone").innerHTML = `
      <div class="drop-product">
        <span class="product-id">${escapeHtml(product.id)}</span>
        <div>
          <strong>${escapeHtml(product.name)}</strong>
          <small>${escapeHtml(product.structure)} · ${escapeHtml(product.carrier)} · ${escapeHtml(product.packageType)}</small>
        </div>
      </div>`;

    qs("#costEditor").innerHTML = `
      <div style="grid-column: 1 / -1; background: #f5f5f5; border-radius: 8px; padding: 12px;">
        <dl>
          ${componentRows}
        </dl>
        <a href="#" id="editProductFromCost">编辑产品 →</a>
      </div>`;
  }

  function optionList(group) {
    return group.options.map((item) => ({ value: item.label, label: `${item.label} · 组内${item.score}分` }));
  }

  function scenicSearchText(spot) {
    return [
      spot.id,
      spot.name,
      spot.nodeTypeLabel,
      spot.parentName,
      spot.subAreaName,
      spot.operatingScene,
      spot.visitorProfile,
      spot.dataGranularity,
      spot.inheritWarning,
      spot.city,
      spot.province,
      spot.region,
      spot.priorityTier,
      spot.scenicLevel,
      spot.scenicType,
      Array.isArray(spot.fitTags) ? spot.fitTags.join(" ") : spot.fitTags,
      spot.productSeries,
      spot.dataYear,
      spot.dataStatus,
      spot.verificationStatusLabel,
      spot.dataTrustLevel,
      Array.isArray(spot.verificationChannels) ? spot.verificationChannels.join(" ") : spot.verificationChannels,
      spot.note
    ].join(" ").toLowerCase();
  }

  function scenicNodeBadge(spot) {
    const type = spot.nodeType || "spot";
    const label = spot.nodeTypeLabel || (type === "parent" ? "父级景区" : "子级点位");
    const className = type === "parent" ? "medium" : type === "zone" ? "strong" : "neutral";
    return `<span class="stage-pill ${className}">${escapeHtml(label)}</span>`;
  }

  function scenicHierarchyText(spot) {
    if (spot.parentName && spot.subAreaName) return `${spot.parentName} / ${spot.subAreaName}`;
    if (spot.parentName) return `${spot.parentName} / ${spot.name}`;
    return spot.name || "";
  }

  function scenicVisitorsShortLabel(spot) {
    if (spot.annualVisitorsUnknown) return "客流不清楚";
    return `${spot.annualVisitors || 0}万人`;
  }

  function scenicVisitorsLabel(spot) {
    if (spot.annualVisitorsUnknown) {
      return `不清楚 · ${spot.visitorDataBasis || "待销售/运营方复核"}`;
    }
    return `${spot.annualVisitors || 0}万人 · ${spot.visitorDataBasis || "待补公开数据"}`;
  }

  function scenicTicketLabel(spot) {
    if (spot.ticketPriceUnknown || spot.ticketMode === "待核") return `${spot.ticketMode || "待核"} · 不清楚`;
    return `${spot.ticketMode || "待核"} · ${money(spot.ticketPrice || 0)}`;
  }

  function scenicUnknownFieldsLabel(spot) {
    return (spot.unknownFields || []).filter(Boolean).join("、");
  }

  function scenicMatchesForQuery(query, limit = 5) {
    const keyword = String(query || "").trim().toLowerCase();
    if (keyword.length < 2) return [];
    return data.scenicSpots
      .filter((spot) => scenicSearchText(spot).includes(keyword))
      .sort((left, right) => {
        const leftParent = left.nodeType === "parent" ? 1 : 0;
        const rightParent = right.nodeType === "parent" ? 1 : 0;
        return leftParent - rightParent || Number(right.annualVisitors || 0) - Number(left.annualVisitors || 0);
      })
      .slice(0, limit);
  }

  function inlineScenicMatchesHtml(query) {
    const keyword = String(query || "").trim();
    if (keyword.length < 2) {
      return `<div class="inline-scenic-empty">先手动输入景区/点位名称，输入 2 个字后会检索库内样本。</div>`;
    }
    const matches = scenicMatchesForQuery(keyword);
    if (!matches.length) {
      return `<div class="inline-scenic-empty">库内暂无匹配样本，可继续手动填报；后续补库后会自动命中。</div>`;
    }
    return `<div class="inline-scenic-list">${matches.map((spot) => {
      const result = XJCore.calculate(data, { scenario: publicScenarioForScenicSpot(spot), productId: state.productId, channel: state.channel });
      const t0Band = scenicScoreBand("T0", result.scenario.t0Score);
      const spotName = spot.name || spot.spotName || "未命名景区";
      const visitorLine = `${spot.dataYear || 2025}年 · ${scenicVisitorsShortLabel(spot)}`;
      return `<button type="button" class="inline-scenic-match" data-inline-apply-scenic="${escapeHtml(spot.id)}" aria-label="套用景区：${escapeHtml(spotName)}">
        <span class="product-id">${escapeHtml(spot.id)}</span>
        <div class="inline-scenic-main">
          <span class="inline-scenic-kicker">${escapeHtml(spot.nodeTypeLabel || "匹配景区")}</span>
          <strong class="inline-scenic-name">${escapeHtml(spotName)}</strong>
          <small>${escapeHtml([scenicHierarchyText(spot), spot.city || spot.province, spot.scenicLevel, spot.scenicType].filter(Boolean).join(" · "))}</small>
          <em>${escapeHtml(visitorLine)}</em>
        </div>
        ${scenicNodeBadge(spot)}
        <span class="stage-pill ${scenicBandClass(t0Band)}">公开T0 ${escapeHtml(t0Band)} · ${escapeHtml(result.scenario.t0Score)}分</span>
      </button>`;
    }).join("")}</div>`;
  }

  function renderInlineScenicMatches() {
    const element = qs("#inlineScenicMatches");
    if (element) element.innerHTML = inlineScenicMatchesHtml(state.scenario.spotName);
  }

  function renderUiEditor() {
    const sizeOptions = [
      { value: "compact", label: "小" },
      { value: "normal", label: "中" },
      { value: "large", label: "大" }
    ];
    const context = currentContextInfo();
    const textField = (key, label) => field(label, `<input type="text" value="${escapeHtml(uiLayout.texts[key] || "")}" data-ui-text="${escapeHtml(key)}">`);
    const textAreaField = (key, label) => field(label, `<textarea rows="3" data-ui-text="${escapeHtml(key)}">${escapeHtml(uiLayout.texts[key] || "")}</textarea>`);
    const moveButton = (label, attrs) => `<button type="button" class="ui-order-btn" ${attrs}>${escapeHtml(label)}</button>`;
    const editorCard = (title, description, body) => `<section class="ui-editor-card">
      <div class="ui-editor-card-head">
        <strong>${escapeHtml(title)}</strong>
        ${description ? `<span>${escapeHtml(description)}</span>` : ""}
      </div>
      <div class="ui-editor-card-body">${body}</div>
    </section>`;
    const editorPanel = (key, body) => `<div class="ui-editor-panel" data-ui-editor-panel="${escapeHtml(key)}"${activeUiEditorSection === key ? "" : " hidden"}>${body}</div>`;
    const panelOrderRows = (scope) => {
      const meta = panelOrderMeta[scope];
      const order = uiLayout.panelOrder[scope] || [];
      return `<div class="ui-order-group">
        <strong>${escapeHtml(meta.title)}</strong>
        ${order.map((key, index) => {
          const item = meta.items[key] || {};
          const label = uiLayout.texts[item.textKey] || item.fallback || key;
          return `<div class="ui-order-row">
            <span>${escapeHtml(label)}</span>
            <div>
              ${moveButton("上移", `data-ui-panel-move="${escapeHtml(key)}" data-panel-scope="${escapeHtml(scope)}" data-direction="up"${index === 0 ? " disabled" : ""}`)}
              ${moveButton("下移", `data-ui-panel-move="${escapeHtml(key)}" data-panel-scope="${escapeHtml(scope)}" data-direction="down"${index === order.length - 1 ? " disabled" : ""}`)}
            </div>
          </div>`;
        }).join("")}
      </div>`;
    };
    const ruleOrderRows = () => {
      const order = (data.rules.ui.ruleOrder || Object.keys(sectionMeta)).filter((key) => sectionMeta[key]);
      return `<div class="ui-order-group">
        <strong>规则域顺序</strong>
        ${order.map((key, index) => {
          const meta = sectionMeta[key];
          return `<div class="ui-order-row">
            <span>${escapeHtml(`一级域 ${meta.index} · ${meta.title}`)}</span>
            <div>
              ${moveButton("上移", `data-ui-rule-move="${escapeHtml(key)}" data-direction="up"${index === 0 ? " disabled" : ""}`)}
              ${moveButton("下移", `data-ui-rule-move="${escapeHtml(key)}" data-direction="down"${index === order.length - 1 ? " disabled" : ""}`)}
            </div>
          </div>`;
        }).join("")}
      </div>`;
    };
    const layoutTargetsByGroup = layoutDesignTargets().reduce((groups, target) => {
      const group = target.group || "未归类";
      if (!groups.some((item) => item.group === group)) groups.push({ group, targets: [] });
      groups.find((item) => item.group === group).targets.push(target);
      return groups;
    }, []);
    const navGroupPurposes = {
      销售经营: "销售日常推进主链路：客户、机会、合同、订单和门店销售都归在这里。",
      点位评级: "点位是否值得进入商务漏斗，景区基础库只提供公开底库，不承载销售填报结果。",
      履约动销: "已签点位的发货、签收、上架、现场异常和动销跟踪。",
      商品价格: "产品资料、SKU、成本价带、场景价带和定价测算。",
      系统管理: "规则参数、评分口径和业务策略配置。",
      账号管理: "账号、角色、权限、数据范围和权限审计。"
    };
    const layoutBlueprintCards = layoutTargetsByGroup.map((groupItem) => `
      <article class="layout-blueprint-card">
        <div>
          <strong>${escapeHtml(groupItem.group)}</strong>
          <span>${escapeHtml(navGroupPurposes[groupItem.group] || "按业务边界集中管理，不和其他模块混放。")}</span>
        </div>
        <ul>
          ${groupItem.targets.map((target) => `<li><b>${escapeHtml(target.title)}</b><small>${escapeHtml(target.detail)}</small></li>`).join("")}
        </ul>
      </article>
    `).join("");
    const layoutTargetCards = layoutTargetsByGroup.map((groupItem) => `
      <div class="layout-target-group">
        <strong class="layout-target-group-title">${escapeHtml(groupItem.group)}</strong>
        ${groupItem.targets.map((target) => {
          const isCurrent = activeView === target.view
            && (!target.crmPanel || activeCrmPanel === target.crmPanel)
            && (!target.scenarioPanel || activeScenarioPanel === target.scenarioPanel)
            && (!target.productPanel || activeProductPanel === target.productPanel);
          const attrs = [
            `data-layout-design-view="${escapeHtml(target.view)}"`,
            target.crmPanel ? `data-layout-design-crm-panel="${escapeHtml(target.crmPanel)}"` : "",
            target.scenarioPanel ? `data-layout-design-scenario-panel="${escapeHtml(target.scenarioPanel)}"` : "",
            target.productPanel ? `data-layout-design-product-panel="${escapeHtml(target.productPanel)}"` : ""
          ].filter(Boolean).join(" ");
          return `<button type="button" class="layout-target-card${isCurrent ? " active" : ""}" ${attrs}>
            <strong>${escapeHtml(target.title)}</strong>
            <span>${escapeHtml(target.detail)}</span>
            <em>${isCurrent ? "当前页面" : "跳转设计"}</em>
          </button>`;
        }).join("")}
      </div>
    `).join("");
    const scenarioSectionLabels = {
      basic: "基础信息与检索",
      t0: "T0 文化/客群",
      t1: "T1 商业转化",
      t2: "T2 官方资源",
      veto: "红线校验",
      save: "保存测算"
    };
    const scenarioOrderRows = uiLayout.scenarioSectionOrder.map((key, index) => `<div class="ui-order-row">
      <span>${escapeHtml(scenarioSectionLabels[key] || key)}</span>
      <div>
        ${moveButton("上移", `data-scenario-move="${escapeHtml(key)}" data-direction="up"${index === 0 ? " disabled" : ""}`)}
        ${moveButton("下移", `data-scenario-move="${escapeHtml(key)}" data-direction="down"${index === uiLayout.scenarioSectionOrder.length - 1 ? " disabled" : ""}`)}
      </div>
    </div>`).join("");
    const copyFieldsForContext = () => {
      if (activeView === "scenario") {
        const panelFieldMap = {
          save: [["scenarioInfoTab", "二级名称"], ["panelScenarioParams", "面板：景区参数"], ["panelScenarioResults", "面板：评级结果"], ["stickyGradeLabel", "摘要：等级"], ["stickyScoreLabel", "摘要：分数"], ["stickyBusinessLabel", "摘要：商务"], ["stickyCommissionLabel", "摘要：提成"]],
          business: [["businessTab", "二级名称"], ["panelBusinessGuidance", "面板：指导商务"]],
          commission: [["commissionTab", "二级名称"], ["panelScenarioChannel", "面板：拟谈条件"], ["panelScenarioCommission", "面板：提成奖金"]],
          history: [["historyTab", "二级名称"], ["panelScenarioHistory", "面板：历史测算"]]
        };
        return panelFieldMap[activeScenarioPanel] || [];
      }
      if (activeView === "crm") return [["panelCrm", "面板标题"], ["crmHeadTitle", "CRM标题"], ["crmHeadIntro", "CRM说明", "textarea"]];
      if (activeView === "scenic-db") return [["panelScenicDb", "面板标题"], ["scenicDbHeadTitle", "景区库标题"], ["scenicDbHeadIntro", "景区库说明", "textarea"], ["scenicDbCountNote", "计数说明", "textarea"]];
      if (activeView === "cost") return [["panelProductChoice", "面板：产品选择"], ["panelCostComponents", "面板：成本组件"], ["panelCostResults", "面板：成本结果"]];
      if (activeView === "pricing") return [["panelPricingChannel", "面板：渠道参数"], ["panelPricingResults", "面板：定价结果"]];
      if (activeView === "records") return [["panelRecords", "面板标题"]];
      if (activeView === "fulfillment") return [["panelFulfillment", "面板标题"], ["fulfillmentHeadTitle", "落地台账标题"], ["fulfillmentHeadIntro", "落地台账说明", "textarea"]];
      if (activeView === "products") return [["panelProducts", "面板标题"]];
      if (activeView === "settings") return [["panelSettings", "面板标题"]];
      if (activeView === "accounts") return [["panelAccounts", "面板标题"]];
      return [];
    };
    const copyBody = copyFieldsForContext().map(([key, label, kind]) => (
      kind === "textarea" ? textAreaField(key, label) : textField(key, label)
    )).join("");
    const styleCards = [];
    if (activeView === "scenario") {
      styleCards.push(editorCard("当前场景页显示", "只影响场景评级当前页面区域", `
        <div class="ui-field-grid">
          ${field("摘要卡大小", selectInput(uiLayout.summaryCardSize, sizeOptions, 'data-ui-layout="summaryCardSize"'))}
          ${field("二级按钮大小", selectInput(uiLayout.subtabSize, sizeOptions, 'data-ui-layout="subtabSize"'))}
          ${activeScenarioPanel === "save" ? field("景区信息布局", selectInput(uiLayout.scenarioLayout, [
            { value: "normal", label: "左填报 / 右结果" },
            { value: "reverse", label: "左结果 / 右填报" }
          ], 'data-ui-layout="scenarioLayout"')) : ""}
        </div>
      `));
      if (activeScenarioPanel === "save") {
        styleCards.push(editorCard("当前页显示内容", "只控制景区信息页的结果模块", `
          <div class="ui-check-grid">
            <label class="ui-check"><input type="checkbox" ${uiLayout.showStickySummary ? "checked" : ""} data-ui-toggle="showStickySummary"><span>置顶实时摘要</span></label>
            <label class="ui-check"><input type="checkbox" ${uiLayout.showResultsPanel ? "checked" : ""} data-ui-toggle="showResultsPanel"><span>右侧评级结果</span></label>
            <label class="ui-check"><input type="checkbox" ${uiLayout.showScoreBreakdown ? "checked" : ""} data-ui-toggle="showScoreBreakdown"><span>评分拆解</span></label>
            <label class="ui-check"><input type="checkbox" ${uiLayout.showRiskPanel ? "checked" : ""} data-ui-toggle="showRiskPanel"><span>风险提示</span></label>
          </div>
        `));
      }
    }
    if (activeView === "products") {
      styleCards.push(editorCard("当前产品页二级栏", "只调整产品库二级按钮尺寸", `
        <div class="ui-field-grid">${field("二级按钮大小", selectInput(uiLayout.subtabSize, sizeOptions, 'data-ui-layout="subtabSize"'))}</div>
      `));
    }
    const orderCards = [];
    if (activeView === "scenario" && activeScenarioPanel === "save") {
      orderCards.push(editorCard("景区信息模块顺序", "只调整景区信息页内部填报模块顺序", `<div class="ui-order-list"><div class="ui-order-group">${scenarioOrderRows}</div></div>`));
    }
    if (activeView === "scenario" && activeScenarioPanel === "commission") {
      orderCards.push(editorCard("模拟提成模块顺序", "只调整模拟提成页左右模块", `<div class="ui-order-list">${panelOrderRows("commission")}</div>`));
    }
    if (activeView === "cost") orderCards.push(editorCard("成本测算模块顺序", "只调整成本测算页模块", `<div class="ui-order-list">${panelOrderRows("cost")}</div>`));
    if (activeView === "pricing") orderCards.push(editorCard("定价测算模块顺序", "只调整定价测算页模块", `<div class="ui-order-list">${panelOrderRows("pricing")}</div>`));
    if (activeView === "settings") orderCards.push(editorCard("规则域排列", "只调整规则参数页里的规则域顺序", `<div class="ui-order-list">${ruleOrderRows()}</div>`));
    const panels = [
      { key: "pages", label: "页面", body: `${editorCard("一级/二级功能地图", "后续功能按这张业务边界归类，避免把功能堆在同一页", `<div class="layout-blueprint-grid">${layoutBlueprintCards}</div>`)}${editorCard("选择页面布局", "点选后会跳转到对应页面，并只编辑该页面UI", `<div class="layout-target-grid">${layoutTargetCards}</div>`)}` },
      { key: "copy", label: "文案", body: copyBody ? editorCard("当前页文案", "只修改当前二级页面相关文案", `<div class="ui-field-grid">${copyBody}</div>`) : "" },
      { key: "style", label: "样式", body: styleCards.join("") },
      { key: "order", label: "模块", body: orderCards.join("") }
    ].filter((item) => item.body);
    if (!panels.some((item) => item.key === activeUiEditorSection)) {
      activeUiEditorSection = panels[0] ? panels[0].key : "copy";
    }
    const uiEditorTabs = panels.map((item) => `<button type="button" class="${activeUiEditorSection === item.key ? "active" : ""}" data-ui-editor-section="${escapeHtml(item.key)}">${escapeHtml(item.label)}</button>`).join("");
    const scopedPanels = panels.map((item) => editorPanel(item.key, item.body)).join("");
    setHtml("uiEditorDrawer", `
      <div class="ui-editor-head">
        <div>
          <strong>${escapeHtml(context.title)}</strong>
          <span>当前只编辑这一页的UI配置</span>
        </div>
        <button type="button" id="closeUiEditorBtn">退出</button>
      </div>
      <nav class="ui-editor-tabs" aria-label="UI编辑类别">${uiEditorTabs}</nav>
      <div class="ui-editor-body">${scopedPanels || `<div class="ui-editor-help"><strong>当前页暂无可编辑UI项</strong><span>可以切换到其他二级页面再编辑。</span></div>`}</div>
    `);
  }

  function applyNavigationPermissions() {
    qsa("[data-view-target]").forEach((button) => {
      const allowed = canAccessView(button.dataset.viewTarget);
      button.hidden = !allowed;
      button.disabled = !allowed;
      button.setAttribute("aria-disabled", allowed ? "false" : "true");
    });
    qsa("[data-nav-group][data-nav-views]").forEach((group) => {
      const views = String(group.dataset.navViews || "").split(/\s+/).filter(Boolean);
      const visibleViews = views.filter(canAccessView);
      group.dataset.navVisibleViews = visibleViews.join(" ");
      group.hidden = visibleViews.length === 0;
      const trigger = group.querySelector("[data-nav-primary]");
      if (trigger) {
        trigger.hidden = visibleViews.length === 0;
        trigger.disabled = visibleViews.length === 0;
        trigger.setAttribute("aria-disabled", visibleViews.length ? "false" : "true");
      }
      if (!visibleViews.length) group.classList.remove("open", "active");
    });
    qsa("[data-layout-design-view]").forEach((button) => {
      const allowed = canAccessView(button.dataset.layoutDesignView);
      button.hidden = !allowed;
      button.disabled = !allowed;
      button.setAttribute("aria-disabled", allowed ? "false" : "true");
    });
    const layoutGroup = qs("[data-layout-nav]");
    if (layoutGroup) {
      const hasVisibleLayoutTarget = qsa("[data-layout-design-view]").some((button) => !button.hidden);
      layoutGroup.hidden = !hasVisibleLayoutTarget;
      const trigger = layoutGroup.querySelector("[data-layout-open]");
      if (trigger) {
        trigger.hidden = !hasVisibleLayoutTarget;
        trigger.disabled = !hasVisibleLayoutTarget;
        trigger.setAttribute("aria-disabled", hasVisibleLayoutTarget ? "false" : "true");
      }
    }
  }

  function applyUiLayout() {
    document.body.classList.toggle("ui-edit-mode", uiEditMode);
    document.body.dataset.uiDensity = uiLayout.density;
    document.body.dataset.topAreaSize = uiLayout.topAreaSize;
    document.body.dataset.summaryCardSize = uiLayout.summaryCardSize;
    document.body.dataset.subtabSize = uiLayout.subtabSize;
    const uiText = (key) => uiLayout.texts[key] || defaultUiLayout.texts[key] || "";
    const drawer = qs("#uiEditorDrawer");
    if (drawer) drawer.hidden = !uiEditMode;
    const appTitle = qs(".brand h1");
    if (appTitle) appTitle.textContent = uiText("appTitle");
    const appSubtitle = qs(".brand p");
    if (appSubtitle) appSubtitle.textContent = uiText("appSubtitle");
    qsa("[data-save-record]").forEach((button) => {
      button.textContent = uiText("topSave");
    });
    qsa("[data-view-target]").forEach((button) => {
      const viewName = button.dataset.viewTarget;
      const meta = mainViewMeta[viewName] || {};
      const isMainNav = Boolean(button.closest(".view-tabs"));
      const isMobileNav = button.classList.contains("mobile-tab");
      if (!isMainNav && !isMobileNav) {
        button.style.order = "";
        return;
      }
      const orderIndex = uiLayout.mainViewOrder.indexOf(viewName);
      button.style.order = orderIndex >= 0 ? String(orderIndex) : "";
      if (isMobileNav) {
        const label = button.querySelector(".mobile-tab-label");
        if (label) label.textContent = uiText(meta.mobileTextKey) || button.dataset.navLabel || meta.fallback || viewName;
      } else {
        button.textContent = button.dataset.crmPanelTarget
          ? crmPanelLabel(button.dataset.crmPanelTarget)
          : button.dataset.navLabel || uiText(meta.textKey) || meta.fallback || viewName;
      }
    });
    applyNavigationPermissions();
    qsa("[data-ui-panel-title]").forEach((panel) => {
      const heading = panel.querySelector(".panel-head h2");
      const label = uiText(panel.dataset.uiPanelTitle);
      if (heading && label) heading.textContent = label;
    });
    Object.keys(uiLayout.panelOrder || {}).forEach((scope) => {
      const order = uiLayout.panelOrder[scope] || [];
      qsa(`[data-ui-panel-scope="${scope}"]`).forEach((panel) => {
        const orderIndex = order.indexOf(panel.dataset.uiPanelKey);
        panel.style.order = orderIndex >= 0 ? String(orderIndex) : "";
      });
    });
    const tabLabels = {
      save: uiText("scenarioInfoTab"),
      business: uiText("businessTab"),
      commission: uiText("commissionTab"),
      history: uiText("historyTab")
    };
    qsa("[data-scenario-panel]").forEach((button) => {
      button.textContent = tabLabels[button.dataset.scenarioPanel] || button.textContent;
    });
    qsa("[data-layout-open], [data-layout-nav]").forEach((element) => {
      element.classList.toggle("active", uiEditMode);
    });
    const stickySummary = qs("#scenarioStickySummary");
    if (stickySummary) stickySummary.hidden = !uiLayout.showStickySummary;
    const scenarioWorkspace = qs('[data-scenario-panel-view="save"] .workspace-scenario');
    if (scenarioWorkspace) {
      scenarioWorkspace.classList.toggle("layout-reverse", uiLayout.scenarioLayout === "reverse");
      scenarioWorkspace.classList.toggle("results-hidden", !uiLayout.showResultsPanel);
    }
    const scenarioResultCard = qs('[data-scenario-panel-view="save"] .results-panel');
    if (scenarioResultCard) scenarioResultCard.hidden = !uiLayout.showResultsPanel;
    const scoreBlock = qs("#scoreBreakdown") ? qs("#scoreBreakdown").closest(".result-block") : null;
    if (scoreBlock) scoreBlock.hidden = !uiLayout.showScoreBreakdown;
    const riskBlock = qs("#riskPanel") ? qs("#riskPanel").closest(".result-block") : null;
    if (riskBlock) riskBlock.hidden = !uiLayout.showRiskPanel;
    updateScenarioStickyTop();
  }

  function updateScenarioStickyTop() {
    const topbar = qs(".topbar");
    if (!topbar) return;
    const bottom = topbar.getBoundingClientRect().bottom;
    document.documentElement.style.setProperty("--scenario-sticky-top", `${Math.max(0, Math.ceil(bottom))}px`);
  }

  function renderScenarioControls() {
    const s = state.scenario;
    const scoring = data.rules.scoring;
    const scenarioSection = (key, title, items) => `
      <section class="scenario-form-section" data-scenario-section="${escapeHtml(key)}">
        <div class="form-section-title">
          <span>${escapeHtml(title)}</span>
          ${uiEditMode ? `<div class="scenario-section-actions">
            <button type="button" data-scenario-move="${escapeHtml(key)}" data-direction="up">上移</button>
            <button type="button" data-scenario-move="${escapeHtml(key)}" data-direction="down">下移</button>
            <button type="button" class="scenario-drag-handle" draggable="true" data-scenario-drag="${escapeHtml(key)}">拖动</button>
          </div>` : ""}
        </div>
        <div class="scenario-section-grid">${items.join("")}</div>
      </section>
    `;
    const vetoFields = (scoring.vetoRules || []).map((item) => `
      <label class="check-field">
        <input type="checkbox" ${s[item.key] ? "checked" : ""} data-scenario="${escapeHtml(item.key)}">
        <span>${escapeHtml(item.label)}</span>
      </label>
    `).join("");
    const sections = {
      basic: scenarioSection("basic", "景区库与基础信息", [
        field("景区/点位名称", `<input type="search" value="${escapeHtml(s.spotName)}" data-scenario="spotName" placeholder="手动输入，如：乌镇、西湖、夫子庙">`, "先手动输入，系统会检索库内样本；套用后仍可修改"),
        `<div class="inline-scenic-matches" id="inlineScenicMatches">${inlineScenicMatchesHtml(s.spotName)}</div>`,
        field("父级景区", `<input type="text" value="${escapeHtml(s.scenicParentName || "")}" data-scenario="scenicParentName" placeholder="如：乌镇">`, "用于区分同一目的地下的不同片区"),
        field("子级片区/点位", `<input type="text" value="${escapeHtml(s.scenicSubAreaName || "")}" data-scenario="scenicSubAreaName" placeholder="如：西栅、东栅、南栅、出口文创店">`),
        field("经营场景", `<input type="text" value="${escapeHtml(s.scenicOperatingScene || "")}" data-scenario="scenicOperatingScene" placeholder="如：核心收费夜游、团队游入口、免费老街">`),
        field("数据粒度", `<input type="text" value="${escapeHtml(s.scenicDataGranularity || "")}" data-scenario="scenicDataGranularity" placeholder="父级目的地/子级片区/具体门店">`, "正式测算建议细化到子级片区或具体门店"),
        field("城市", `<input type="text" value="${escapeHtml(s.city || "")}" data-scenario="city">`),
        field("景区等级", selectInput(s.scenicLevel, optionList(scoring.scenicLevel), 'data-scenario="scenicLevel"')),
        field("年客流量(万人)", numberInput({ value: s.annualVisitors, min: 0, step: 10, attr: 'data-scenario="annualVisitors"' })),
        field("数据年份", numberInput({ value: s.dataYear || 2025, min: 2020, step: 1, attr: 'data-scenario="dataYear"' }), "优先使用2025年度数据，缺口先标待复核"),
        field("客流数据口径", `<input type="text" value="${escapeHtml(s.visitorDataBasis || "")}" data-scenario="visitorDataBasis">`, "注明年度、假日、城市口径或待复核"),
        field("收费状态", selectInput(s.ticketMode, [{ value: "收费", label: "收费" }, { value: "免费", label: "免费" }, { value: "混合", label: "混合" }, { value: "待核", label: "待核" }], 'data-scenario="ticketMode"')),
        field("门票金额", numberInput({ value: s.ticketPrice, min: 0, step: 1, attr: 'data-scenario="ticketPrice"' }))
      ]),
      t0: scenarioSection("t0", "T0 文化与客群适配", [
        field("景区文化类型", selectInput(s.scenicType, optionList(scoring.scenicType), 'data-scenario="scenicType"')),
        field("瓦/古建/屋檐关联", selectInput(s.tileRelevance, optionList(scoring.tileRelevance), 'data-scenario="tileRelevance"')),
        field("旅行纪念/祈福心智", selectInput(s.commemorationMind, optionList(scoring.commemorationMind), 'data-scenario="commemorationMind"')),
        field("客群匹配/传播", selectInput(s.youngSpread, optionList(scoring.youngSpread), 'data-scenario="youngSpread"')),
        field("官方文化背书", selectInput(s.culturalEndorsement, optionList(scoring.culturalEndorsement), 'data-scenario="culturalEndorsement"'))
      ]),
      t1: scenarioSection("t1", "T1 商业转化与合作执行", [
        field("店铺位置/动线", selectInput(s.location, optionList(scoring.location), 'data-scenario="location"')),
        field("店型匹配", selectInput(s.store, optionList(scoring.store), 'data-scenario="store"')),
        field("店内空间/陈列资源", selectInput(s.display, optionList(scoring.display), 'data-scenario="display"')),
        field("商务条件", selectInput(s.businessTerms, optionList(scoring.businessTerms), 'data-scenario="businessTerms"')),
        field("对方态度/推进效率", selectInput(s.cooperationEfficiency, optionList(scoring.cooperationEfficiency), 'data-scenario="cooperationEfficiency"'))
      ]),
      t2: scenarioSection("t2", "T2 官方合作与资源支持", [
        field("官方合作深度", selectInput(s.officialCooperation, optionList(scoring.officialCooperation), 'data-scenario="officialCooperation"')),
        field("官方授权联名", selectInput(s.coBrandAuth, optionList(scoring.coBrandAuth), 'data-scenario="coBrandAuth"')),
        field("官方营销资源", selectInput(s.marketingResources, optionList(scoring.marketingResources), 'data-scenario="marketingResources"')),
        field("装补/物料资源", selectInput(s.decorationResources, optionList(scoring.decorationResources), 'data-scenario="decorationResources"')),
        field("官方人力资源", selectInput(s.manpowerResources, optionList(scoring.manpowerResources), 'data-scenario="manpowerResources"')),
        field("官网/联票/导流资源", selectInput(s.officialTrafficResources, optionList(scoring.officialTrafficResources), 'data-scenario="officialTrafficResources"'))
      ]),
      veto: scenarioSection("veto", "一票否决", [
        `<div class="veto-grid">${vetoFields}</div>`
      ]),
      save: scenarioSection("save", "保存测算", [
        `<div class="save-gate">
          ${field("当前账号", `<input type="text" value="${escapeHtml(currentAccountName())}" readonly placeholder="先在顶部选择账号">`, "保存后进入该账号的点位机会")}
          <button type="button" class="primary" data-save-record>保存测算</button>
          <small id="saveRecordHint"></small>
        </div>`
      ])
    };
    qs("#scenarioControls").innerHTML = uiLayout.scenarioSectionOrder.map((key) => sections[key] || "").join("");
  }

  function scenicScoreBand(stage, score) {
    const value = Number(score) || 0;
    const thresholds = XJCore.stageScoreBandThresholds
      ? XJCore.stageScoreBandThresholds(data.rules.scoring, stage)
      : (stage === "T2" ? [3, 2, 1.5] : (stage === "T1" ? [38.25, 30.6, 22.5] : [42.5, 35, 27.5]));
    if (value >= thresholds[0]) return "强";
    if (value >= thresholds[1]) return "中高";
    if (value >= thresholds[2]) return "中";
    return "弱";
  }

  function scenicBandClass(band) {
    return {
      "强": "strong",
      "中高": "mid-high",
      "中": "medium",
      "弱": "weak"
    }[band] || "weak";
  }

  function uniqueScenicOptions(getter) {
    return Array.from(new Set(data.scenicSpots.map(getter).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), "zh-CN"));
  }

  function scenicSelect(value, placeholder, options, id) {
    return selectInput(value, [{ value: "", label: placeholder }].concat(options.map((item) => ({ value: item, label: item }))), `id="${id}"`);
  }

  function scenicStagePill(stage, score, band) {
    return `<span class="stage-pill ${scenicBandClass(band)}">${escapeHtml(stage)} ${escapeHtml(band)} · ${escapeHtml(score)}分</span>`;
  }

  function scenicVerificationClass(status) {
    if (status === "multi_channel_verified") return "strong";
    if (status === "official_list_verified") return "medium";
    if (status === "needs_recheck") return "weak";
    return "neutral";
  }

  function renderScenicDatabase() {
    const container = qs("#scenicDatabaseBody");
    if (!container) return;
    const typeOptions = uniqueScenicOptions((spot) => spot.scenicType);
    const gradeOptions = uniqueScenicOptions((spot) => spot.scenicLevel);
    const provinceOptions = uniqueScenicOptions((spot) => spot.province);
    const priorityOptions = uniqueScenicOptions((spot) => spot.priorityTier);
    const tileOptions = uniqueScenicOptions((spot) => spot.tileRelevance);
    const dataStatusOptions = uniqueScenicOptions((spot) => spot.dataStatus);
    const verificationOptions = uniqueScenicOptions((spot) => spot.verificationStatusLabel);
    const keyword = scenicSearch.trim().toLowerCase();
    const enriched = data.scenicSpots.map((spot) => {
      const result = XJCore.calculate(data, { scenario: publicScenarioForScenicSpot(spot), productId: state.productId, channel: state.channel });
      return {
        spot,
        result,
        t0Band: scenicScoreBand("T0", result.scenario.t0Score)
      };
    });
    const filtered = enriched.filter(({ spot, t0Band }) => {
      const matchesKeyword = !keyword || scenicSearchText(spot).includes(keyword);
      const matchesType = !scenicTypeFilter || spot.scenicType === scenicTypeFilter;
      const matchesGrade = !scenicGradeFilter || spot.scenicLevel === scenicGradeFilter;
      const matchesProvince = !scenicProvinceFilter || spot.province === scenicProvinceFilter;
      const matchesPriority = !scenicPriorityFilter || spot.priorityTier === scenicPriorityFilter;
      const matchesT0 = !scenicT0Filter || t0Band === scenicT0Filter;
      const matchesTile = !scenicTileFilter || spot.tileRelevance === scenicTileFilter;
      const matchesStatus = !scenicDataStatusFilter || spot.dataStatus === scenicDataStatusFilter;
      const matchesVerification = !scenicVerificationFilter || spot.verificationStatusLabel === scenicVerificationFilter;
      return matchesKeyword && matchesType && matchesGrade && matchesProvince && matchesPriority && matchesT0 && matchesTile && matchesStatus && matchesVerification;
    });
    filtered.sort((left, right) => {
      const publicFitDiff = right.result.scenario.t0Score - left.result.scenario.t0Score;
      if (scenicSortMode === "visitorsDesc") return right.spot.annualVisitors - left.spot.annualVisitors || publicFitDiff;
      if (scenicSortMode === "provinceAsc") return String(left.spot.province).localeCompare(String(right.spot.province), "zh-CN") || publicFitDiff;
      return publicFitDiff || right.spot.annualVisitors - left.spot.annualVisitors;
    });
    const visibleFiltered = filtered.slice(0, scenicVisibleLimit);
    const hiddenFilteredCount = Math.max(filtered.length - visibleFiltered.length, 0);
    const strongT0Count = filtered.filter((item) => item.t0Band === "强").length;
    const multiVerifiedCount = filtered.filter((item) => item.spot.verificationStatus === "multi_channel_verified").length;
    const officialListCount = filtered.filter((item) => item.spot.verificationStatus === "official_list_verified").length;
    const needCheckCount = filtered.length - multiVerifiedCount - officialListCount;
    const parentCount = filtered.filter((item) => item.spot.nodeType === "parent").length;
    const childCount = filtered.length - parentCount;
    container.innerHTML = `
      <div class="scenic-db-head">
        <div>
          <strong>${escapeHtml(uiLayout.texts.scenicDbHeadTitle)}</strong>
          <span>${escapeHtml(uiLayout.texts.scenicDbHeadIntro)}</span>
        </div>
        <div class="scenic-stat-grid">
          <div><span>当前样本</span><b>${filtered.length}/${data.scenicSpots.length}</b></div>
          <div><span>父级/子级</span><b>${parentCount}/${childCount}</b></div>
          <div><span>公开适配强匹配</span><b>${strongT0Count}</b></div>
          <div><span>多渠道已核</span><b>${multiVerifiedCount}</b></div>
        </div>
      </div>
      <div class="scenic-data-notice">
        景区库按“父级景区 → 子级片区/点位”管理。父级只做目的地线索和公开背书，正式测算优先选择西栅、东栅、南栅这类子级经营场景；店位、店型、陈列空间、商务条件、官方资源仍由销售在“场景评级”里填报。
      </div>
      <div class="library-toolbar scenic-toolbar">
        <input type="search" id="scenicSearchInput" value="${escapeHtml(scenicSearch)}" placeholder="搜索父级景区、子级片区、城市、类型">
        ${scenicSelect(scenicProvinceFilter, "全部省份", provinceOptions, "scenicProvinceFilter")}
        ${scenicSelect(scenicTypeFilter, "全部类型", typeOptions, "scenicTypeFilter")}
        ${scenicSelect(scenicGradeFilter, "全部景区等级", gradeOptions, "scenicGradeFilter")}
        ${scenicSelect(scenicPriorityFilter, "全部管理优先级", priorityOptions, "scenicPriorityFilter")}
        ${selectInput(scenicT0Filter, [{ value: "", label: "公开适配全部" }, { value: "强", label: "公开适配强" }, { value: "中高", label: "公开适配中高" }, { value: "中", label: "公开适配中" }, { value: "弱", label: "公开适配弱" }], 'id="scenicT0Filter"')}
        ${scenicSelect(scenicTileFilter, "瓦文化关联", tileOptions, "scenicTileFilter")}
        ${scenicSelect(scenicDataStatusFilter, "数据状态", dataStatusOptions, "scenicDataStatusFilter")}
        ${scenicSelect(scenicVerificationFilter, "核验状态", verificationOptions, "scenicVerificationFilter")}
        ${selectInput(scenicSortMode, [
          { value: "scoreDesc", label: "按公开适配排序" },
          { value: "visitorsDesc", label: "按客流排序" },
          { value: "t0Desc", label: "按公开适配排序" },
          { value: "provinceAsc", label: "按省份排序" }
        ], 'id="scenicSortMode"')}
        <button type="button" id="clearScenicFiltersBtn">清空筛选</button>
        <button type="button" id="exportScenicSpotsBtn">导出景区库</button>
        <label class="import-label">
          导入景区库
          <input type="file" id="importScenicSpotsInput" accept="application/json,.json">
        </label>
        <button type="button" id="resetScenicSpotsBtn">恢复默认库</button>
      </div>
      <div class="scenic-count">当前筛选 ${filtered.length} / ${data.scenicSpots.length} 个样本，已显示 ${visibleFiltered.length} 个。${escapeHtml(uiLayout.texts.scenicDbCountNote)}</div>
      <div class="scenic-list">
        ${visibleFiltered.map(({ spot, result: spotResult, t0Band }) => {
          const tags = Array.isArray(spot.fitTags) ? spot.fitTags : [];
          const statusText = String(spot.dataStatus || "待复核");
          const readyText = statusText.includes("不清楚") ? "2025不清楚" : statusText.includes("已核") ? "2025客流已核" : "2025口径待核";
          const unknownFields = scenicUnknownFieldsLabel(spot);
          return `<article class="scenic-card">
            <div class="scenic-card-main">
              <span class="product-id">${escapeHtml(spot.id)}</span>
              <div>
                <h3>${escapeHtml(spot.name)}</h3>
                <p>${escapeHtml([scenicHierarchyText(spot), spot.region, spot.province, spot.city, spot.scenicLevel, spot.scenicType].filter(Boolean).join(" · "))}</p>
              </div>
              <div class="scenic-card-badges">
                <span>${escapeHtml(spot.priorityTier || "待分级")}</span>
              </div>
            </div>
            <div class="stage-pills">
              ${scenicNodeBadge(spot)}
              ${scenicStagePill("公开适配", spotResult.scenario.t0Score, t0Band)}
              <span class="stage-pill neutral">非最终评级</span>
              <span class="stage-pill ${scenicVerificationClass(spot.verificationStatus)}">${escapeHtml(spot.verificationStatusLabel)}</span>
              <span class="stage-pill neutral">${escapeHtml(readyText)}</span>
              <span class="stage-pill neutral">店位/商务由销售填报</span>
            </div>
            ${tags.length ? `<div class="fit-tags">${tags.slice(0, 6).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
            <dl>
              <dt>父级/子级</dt><dd>${escapeHtml(scenicHierarchyText(spot) || "未分层")}</dd>
              <dt>经营场景</dt><dd>${escapeHtml(spot.operatingScene || "待销售细化到具体店位")}</dd>
              <dt>数据粒度</dt><dd>${escapeHtml(spot.dataGranularity || "单点/片区")}</dd>
              <dt>数据年份</dt><dd>${escapeHtml(spot.dataYear || 2025)}年</dd>
              <dt>公开适配分</dt><dd>${escapeHtml(spotResult.scenario.t0Score)}分 · 仅用于销售检索和初筛，最终评级看当次店位/商务/资源填报</dd>
              <dt>客流</dt><dd>${escapeHtml(scenicVisitorsLabel(spot))}</dd>
              <dt>门票</dt><dd>${escapeHtml(scenicTicketLabel(spot))}</dd>
              ${unknownFields ? `<dt>不清楚</dt><dd>${escapeHtml(unknownFields)}</dd>` : ""}
              <dt>类型</dt><dd>${escapeHtml(spot.scenicType)}</dd>
              <dt>瓦文化</dt><dd>${escapeHtml(spot.tileRelevance)}</dd>
              <dt>购买心智</dt><dd>${escapeHtml(spot.commemorationMind)}</dd>
              <dt>客群传播</dt><dd>${escapeHtml(spot.youngSpread)}</dd>
              <dt>客群备注</dt><dd>${escapeHtml(spot.visitorProfile || "待销售复核")}</dd>
              <dt>文化背书</dt><dd>${escapeHtml(spot.culturalEndorsement)}</dd>
              <dt>数据状态</dt><dd>${escapeHtml(spot.dataStatus || "待复核")}</dd>
              ${spot.inheritWarning ? `<dt>继承警示</dt><dd>${escapeHtml(spot.inheritWarning)}</dd>` : ""}
              <dt>核验</dt><dd>${escapeHtml(spot.verificationStatusLabel || "待多渠道复核")} · ${escapeHtml(spot.verificationSourceCount || 0)}源 · ${escapeHtml(spot.dataTrustLevel || "仅作销售线索")}</dd>
              <dt>核验渠道</dt><dd>${escapeHtml((spot.verificationChannels || []).join("；") || "待补")}</dd>
              <dt>核验时间</dt><dd>${escapeHtml(spot.verificationCheckedAt || spot.sourceCheckedAt || "待补")}</dd>
              ${(spot.verificationWarnings || []).length ? `<dt>核验警示</dt><dd>${escapeHtml(spot.verificationWarnings.join("；"))}</dd>` : ""}
              <dt>来源</dt><dd>${spot.sourceUrl ? `<a href="${escapeHtml(spot.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(spot.sourceName || spot.sourceUrl)}</a>` : escapeHtml(spot.sourceName || "待补")}</dd>
              <dt>备注</dt><dd>${escapeHtml(spot.note || "无")}</dd>
            </dl>
            <div class="row-actions">
              <button type="button" class="primary" data-apply-scenic="${escapeHtml(spot.id)}">带入公开信息</button>
            </div>
          </article>`;
        }).join("") || `<p class="empty">没有匹配的景区样本</p>`}
      </div>
      ${hiddenFilteredCount ? `<div class="scenic-load-more"><button type="button" class="primary" id="loadMoreScenicBtn">加载更多 ${Math.min(80, hiddenFilteredCount)} 条</button><span>还有 ${hiddenFilteredCount} 条未显示，继续缩小筛选可更快定位。</span></div>` : ""}
    `;
    bindScenicImport();
  }

  function scheduleScenicDatabaseRender() {
    if (scenicSearchRenderTimer) window.clearTimeout(scenicSearchRenderTimer);
    scenicSearchRenderTimer = window.setTimeout(() => {
      scenicSearchRenderTimer = 0;
      renderScenicDatabase();
    }, 120);
  }

  function fulfillmentLandingStatus(record) {
    if (record.salesSellStatus === "已动销") return "已动销";
    if (record.salesShelfStatus === "已上架开售") return "已上架开售";
    if (record.receiptStatus === "已签收") return "已签收待上架";
    if (record.shipmentStatus === "已发货") return "已发货待签收";
    if (record.shipmentStatus === "资料缺失") return "资料缺失";
    return "待发货";
  }

  function fulfillmentTone(status) {
    if (status === "已动销" || status === "已上架开售") return "strong";
    if (status === "已签收待上架" || status === "已签收") return "medium";
    if (status === "已发货待签收" || status === "待签收") return "weak";
    if (status === "资料缺失") return "weak";
    return "neutral";
  }

  function fulfillmentVisibleToAccount(record) {
    return accountCanSeeOwnerIdentity(ownerIdentityFromRow(record));
  }

  function fulfillmentSearchText(record) {
    return [
      record.id,
      record.code,
      record.pointName,
      record.folderName,
      record.cooperationType,
      record.shipmentStatus,
      record.receiptStatus,
      record.displayStatus,
      record.salesShelfStatus,
      record.salesSellStatus,
      record.salesOwner,
      record.salesNote,
      record.shipmentQuantityNote,
      record.skuPlan,
      record.designRequirement,
      record.receiverInfo,
      record.deliveryAddress,
      record.launchDate,
      Array.isArray(record.exceptionTags) ? record.exceptionTags.join(" ") : record.exceptionTags,
      Array.isArray(record.evidenceFiles) ? record.evidenceFiles.join(" ") : record.evidenceFiles
    ].join(" ").toLowerCase();
  }

  function uniqueFulfillmentOptions(getter) {
    return Array.from(new Set(data.fulfillmentRecords.map(getter).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), "zh-CN"));
  }

  function fulfillmentSelect(value, placeholder, options, id) {
    return selectInput(value, [{ value: "", label: placeholder }].concat(options.map((item) => ({ value: item, label: item }))), `id="${id}"`);
  }

  function fulfillmentPill(label, tone = "neutral") {
    return `<span class="stage-pill ${escapeHtml(tone)}">${escapeHtml(label)}</span>`;
  }

  function fulfillmentStatusOptions() {
    return ["待发货", "资料缺失", "已发货待签收", "已签收待上架", "已上架开售", "已动销"];
  }

  function renderFulfillment() {
    const container = qs("#fulfillmentBody");
    if (!container) return;
    if (!accountHasPermission("fulfillment", "view")) {
      container.innerHTML = permissionGateHtml("没有点位落地权限", "点位落地包含发货、签收、上架、动销和现场异常数据。");
      return;
    }
    const keyword = fulfillmentSearch.trim().toLowerCase();
    const statusOptions = fulfillmentStatusOptions();
    const typeOptions = uniqueFulfillmentOptions((record) => record.cooperationType);
    const receiptOptions = uniqueFulfillmentOptions((record) => record.receiptStatus);
    const shelfOptions = uniqueFulfillmentOptions((record) => record.salesShelfStatus);
    const visibleFulfillmentRecords = data.fulfillmentRecords.filter(fulfillmentVisibleToAccount);
    const enriched = visibleFulfillmentRecords.map((record) => ({
      record,
      status: fulfillmentLandingStatus(record)
    }));
    const filtered = enriched.filter(({ record, status }) => {
      const hasIssue = (record.exceptionTags || []).length > 0;
      const matchesKeyword = !keyword || fulfillmentSearchText(record).includes(keyword);
      const matchesStatus = !fulfillmentStatusFilter || status === fulfillmentStatusFilter;
      const matchesType = !fulfillmentTypeFilter || record.cooperationType === fulfillmentTypeFilter;
      const matchesReceipt = !fulfillmentReceiptFilter || record.receiptStatus === fulfillmentReceiptFilter;
      const matchesShelf = !fulfillmentShelfFilter || record.salesShelfStatus === fulfillmentShelfFilter;
      const matchesIssue = !fulfillmentIssueFilter || (fulfillmentIssueFilter === "有异常" ? hasIssue : !hasIssue);
      return matchesKeyword && matchesStatus && matchesType && matchesReceipt && matchesShelf && matchesIssue;
    });
    filtered.sort((left, right) => {
      const statusWeight = { "资料缺失": 0, "待发货": 1, "已发货待签收": 2, "已签收待上架": 3, "已上架开售": 4, "已动销": 5 };
      return (statusWeight[left.status] || 0) - (statusWeight[right.status] || 0)
        || String(right.record.lastFileDate || "").localeCompare(String(left.record.lastFileDate || ""))
        || String(left.record.code).localeCompare(String(right.record.code), "zh-CN");
    });
    const countBy = (status) => enriched.filter((item) => item.status === status).length;
    const issueCount = enriched.filter((item) => (item.record.exceptionTags || []).length).length;
    const signedCount = enriched.filter((item) => item.record.receiptStatus === "已签收").length;
    const shippedCount = enriched.filter((item) => item.record.shipmentStatus === "已发货").length;
    container.innerHTML = `
      <div class="fulfillment-head scenic-db-head">
        <div>
          <strong>${escapeHtml(uiLayout.texts.fulfillmentHeadTitle)}</strong>
          <span>${escapeHtml(uiLayout.texts.fulfillmentHeadIntro)}</span>
        </div>
        <div class="scenic-stat-grid">
          <div><span>可见点位</span><b>${visibleFulfillmentRecords.length}</b></div>
          <div><span>已发货</span><b>${shippedCount}</b></div>
          <div><span>已签收</span><b>${signedCount}</b></div>
          <div><span>异常/待核</span><b>${issueCount}</b></div>
        </div>
      </div>
      <div class="scenic-data-notice fulfillment-notice">
        库管状态来自飞书归档文件名与在线表格抽样：发货、签收、软陈和话术卡只读展示；销售只补录上架、动销、负责人和现场问题。未见凭证不等于未发生，统一标为待核。
      </div>
      <div class="fulfillment-kpi-grid">
        ${metricCard("待发货/资料缺失", String(countBy("待发货") + countBy("资料缺失")), "订单已建或文件夹为空，待补发货凭证", "warn")}
        ${metricCard("发货待签收", String(countBy("已发货待签收")), "有清单，未见签收凭证", "accent")}
        ${metricCard("签收待上架", String(countBy("已签收待上架")), "库管签收完成，等销售补现场", "ok")}
        ${metricCard("已上架/动销", String(countBy("已上架开售") + countBy("已动销")), "销售已补录落地进展", "profit")}
      </div>
      <div class="library-toolbar fulfillment-toolbar">
        <input type="search" id="fulfillmentSearchInput" value="${escapeHtml(fulfillmentSearch)}" placeholder="搜索点位、编号、发货清单、签收回执">
        ${fulfillmentSelect(fulfillmentStatusFilter, "全部落地状态", statusOptions, "fulfillmentStatusFilter")}
        ${fulfillmentSelect(fulfillmentTypeFilter, "全部合作类型", typeOptions, "fulfillmentTypeFilter")}
        ${fulfillmentSelect(fulfillmentReceiptFilter, "全部签收状态", receiptOptions, "fulfillmentReceiptFilter")}
        ${fulfillmentSelect(fulfillmentShelfFilter, "全部上架状态", shelfOptions, "fulfillmentShelfFilter")}
        ${selectInput(fulfillmentIssueFilter, [{ value: "", label: "异常全部" }, { value: "有异常", label: "只看异常/待核" }, { value: "无异常", label: "只看无异常" }], 'id="fulfillmentIssueFilter"')}
        <button type="button" id="clearFulfillmentFiltersBtn">清空筛选</button>
        <button type="button" id="exportFulfillmentBtn">导出落地台账</button>
        <button type="button" id="resetFulfillmentBtn">恢复默认台账</button>
      </div>
      <div class="scenic-count">当前筛选 ${filtered.length} / ${visibleFulfillmentRecords.length} 个可见点位（全库 ${data.fulfillmentRecords.length}）。同步来源：库管供应组 / 瓦片点位发货清单；当前为${escapeHtml(fulfillmentSyncLabel())}。</div>
      <div class="fulfillment-list">
        ${filtered.map(({ record, status }) => renderFulfillmentCard(record, status)).join("") || `<p class="empty">没有匹配的点位落地记录</p>`}
      </div>
    `;
  }

  function renderFulfillmentCard(record, status) {
    const quantity = record.shipmentQuantity === null ? "待解析" : `${record.shipmentQuantity}件`;
    const issues = record.exceptionTags || [];
    const evidence = record.evidenceFiles || [];
    const active = fulfillmentActiveId === record.id;
    const hasOrderDelivery = record.skuPlan || record.designRequirement || record.receiverInfo || record.deliveryAddress || record.launchDate;
    const shelfOptions = ["待补录", "未上架", "已上架开售", "暂缓上架", "撤场"];
    const sellOptions = ["待补录", "未动销", "已动销", "动销弱", "待复盘"];
    return `<article class="fulfillment-card">
      <div class="fulfillment-card-head">
        <div class="fulfillment-title">
          <span class="product-id">${escapeHtml(record.code)}</span>
          <div>
            <h3>${escapeHtml(record.pointName)}</h3>
            <p>${escapeHtml(record.folderName || record.pointName)}</p>
          </div>
        </div>
        <div class="stage-pills">
          ${fulfillmentPill(status, fulfillmentTone(status))}
          ${fulfillmentPill(record.cooperationType, "neutral")}
          ${issues.length ? fulfillmentPill(`异常 ${issues.length}`, "weak") : fulfillmentPill("无异常标签", "strong")}
        </div>
      </div>
      <div class="fulfillment-grid">
        <div><span>发货</span><strong>${escapeHtml(record.shipmentStatus)}</strong><small>${escapeHtml(record.shipmentBatchCount)}批 · ${escapeHtml(quantity)}</small></div>
        <div><span>签收</span><strong>${escapeHtml(record.receiptStatus)}</strong><small>${escapeHtml(record.lastFileDate || "无更新时间")}</small></div>
        <div><span>软陈/资料</span><strong>${escapeHtml(record.displayStatus)}</strong><small>${escapeHtml(record.shipmentQuantityNote)}</small></div>
        <div><span>销售现场</span><strong>${escapeHtml(record.salesShelfStatus)}</strong><small>${escapeHtml(record.salesSellStatus)}</small></div>
      </div>
      ${hasOrderDelivery ? `<div class="fulfillment-order-grid">
        <div><span>订单SKU</span><strong>${escapeHtml(record.skuPlan || "待补")}</strong></div>
        <div><span>打样/设计</span><strong>${escapeHtml(record.designRequirement || "待补")}</strong></div>
        <div><span>收货信息</span><strong>${escapeHtml(record.receiverInfo || "待补")}</strong></div>
        <div><span>交付地点</span><strong>${escapeHtml(record.deliveryAddress || "待补")}</strong><small>${escapeHtml(record.launchDate ? `目标上架 ${record.launchDate}` : "目标上架待补")}</small></div>
      </div>` : ""}
      <div class="fulfillment-sales-grid">
        ${field("上架状态", selectInput(record.salesShelfStatus, shelfOptions.map((item) => ({ value: item, label: item })), `data-fulfillment-id="${escapeHtml(record.id)}" data-fulfillment-field="salesShelfStatus"`))}
        ${field("上架日期", `<input type="date" value="${escapeHtml(record.salesShelfDate || "")}" data-fulfillment-id="${escapeHtml(record.id)}" data-fulfillment-field="salesShelfDate">`)}
        ${field("动销状态", selectInput(record.salesSellStatus, sellOptions.map((item) => ({ value: item, label: item })), `data-fulfillment-id="${escapeHtml(record.id)}" data-fulfillment-field="salesSellStatus"`))}
        ${field("负责人", `<input type="text" value="${escapeHtml(record.salesOwner || "")}" data-fulfillment-id="${escapeHtml(record.id)}" data-fulfillment-field="salesOwner" placeholder="销售/渠道姓名">`)}
        ${field("现场问题/备注", `<textarea rows="2" data-fulfillment-id="${escapeHtml(record.id)}" data-fulfillment-field="salesNote" placeholder="如：已上架但陈列偏角落、待补照片、需补货">${escapeHtml(record.salesNote || "")}</textarea>`)}
      </div>
      <div class="row-actions fulfillment-actions">
        ${record.sourceFolderUrl ? `<a href="${escapeHtml(record.sourceFolderUrl)}" target="_blank" rel="noopener">打开飞书文件夹</a>` : ""}
        <button type="button" data-fulfillment-detail="${escapeHtml(record.id)}">${active ? "收起详情" : "查看证据"}</button>
      </div>
      ${active ? `<div class="fulfillment-detail">
        ${resultBlock("库管归档证据", evidence.length ? `<ul>${evidence.map((name) => `<li>${escapeHtml(name)}</li>`).join("")}</ul>` : "暂无文件证据")}
        ${resultBlock("待核/异常", issues.length ? `<div class="fit-tags">${issues.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : "暂无异常标签")}
        ${resultBlock("订单交付信息", dlRows([
          ["订单SKU", escapeHtml(record.skuPlan || "待补")],
          ["打样/设计", escapeHtml(record.designRequirement || "待补")],
          ["收货人/电话", escapeHtml(record.receiverInfo || "待补")],
          ["交付地点", escapeHtml(record.deliveryAddress || "待补")],
          ["目标上架", escapeHtml(record.launchDate || "待补")]
        ]))}
        ${resultBlock("同步信息", dlRows([
          ["同步来源", escapeHtml(record.syncSource)],
          ["校验时间", escapeHtml(record.syncCheckedAt)],
          ["文件夹Token", escapeHtml(record.sourceFolderToken || "无")],
          ["销售更新", escapeHtml(record.salesUpdatedAt || "尚未补录")]
        ]))}
      </div>` : ""}
    </article>`;
  }

  function scheduleFulfillmentRender() {
    if (fulfillmentSearchRenderTimer) window.clearTimeout(fulfillmentSearchRenderTimer);
    fulfillmentSearchRenderTimer = window.setTimeout(() => {
      fulfillmentSearchRenderTimer = 0;
      renderFulfillment();
    }, 120);
  }

  function renderPricing() {
    ensurePricingModeState();
    const result = currentResult();
    const c = state.channel;
    const modeOptions = pricingModeOptions(activePricingMode).map((name) => ({ value: name, label: name }));
    const priceOptions = [{ value: 0, label: `自动推荐 · ${money(result.pricing.suggestedRetail)}` }].concat(
      data.rules.priceOptions.map((price) => ({ value: price, label: money(price) }))
    );
    const gradeOptions = [{ value: "", label: `自动 · ${result.scenario.grade}` }].concat(
      ruleGradeOrder().map((grade) => ({ value: grade, label: grade }))
    );
    const policyOptions = [
      { value: "标准商务条件", label: "标准商务条件" },
      { value: "试点优惠政策", label: "试点优惠政策" },
      { value: "资源置换政策", label: "资源置换政策" }
    ];
    const commonControls = [
      field("合作模式", selectInput(c.mode, modeOptions, 'data-channel="mode"')),
      field("点位等级", selectInput(c.gradeOverride, gradeOptions, 'data-channel="gradeOverride"')),
      field("零售价", selectInput(c.retailOverride, priceOptions, 'data-channel="retailOverride"'))
    ];
    const consignmentControls = commonControls.concat([
      field("政策类型", selectInput(c.policyType || "标准商务条件", policyOptions, 'data-channel="policyType"'), "区分长期标准、早期试点和资源置换"),
      field("实际/拟谈扣点(%)", numberInput({ value: c.negotiatedDeduction, min: 0, max: 85, step: 1, attr: 'data-channel="negotiatedDeduction" placeholder="空=等级基准"' }), `等级基准 ${percent(result.business.baselineDeduction)}`),
      field("最高3个月销售回款额", numberInput({ value: c.top3SalesReceipt, min: 0, step: 100, attr: 'data-channel="top3SalesReceipt" placeholder="空=月销售额×3"' }), "上线后6个月内最高3个月"),
      field("本点位销售商务成本", numberInput({ value: c.pointBusinessCost, min: 0, step: 100, attr: 'data-channel="pointBusinessCost"' }), "从最高3个月回款额中扣除"),
      field("辅助月销售额", numberInput({ value: c.monthlySales, min: 0, step: 100, attr: 'data-channel="monthlySales"' }), "未填最高3个月时按×3估算"),
      field("铺货数量", numberInput({ value: c.stockQty, min: 0, step: 1, attr: 'data-channel="stockQty"' })),
      field("当月销售数量", numberInput({ value: c.soldQty, min: 0, step: 1, attr: 'data-channel="soldQty"' })),
      field("保证金", numberInput({ value: c.deposit, min: 0, step: 100, attr: 'data-channel="deposit"' }))
    ]);
    const procurementControls = commonControls.concat([
      field("采购数量", numberInput({ value: c.purchaseQty, min: 0, step: 1, attr: 'data-channel="purchaseQty"' })),
      field("总采购量", numberInput({ value: c.totalPurchaseQty, min: 0, step: 1, attr: 'data-channel="totalPurchaseQty"' })),
      field("采购回款额", numberInput({ value: c.purchaseReceiptAmount, min: 0, step: 100, attr: 'data-channel="purchaseReceiptAmount" placeholder="空=标准采购小计"' }), "按单次采购回款额匹配提成阶梯"),
      field("客户类型", selectInput(c.customerType || "新客户", [{ value: "新客户", label: "新客户/首次采购" }, { value: "老客户", label: "老客户/复购采购" }], 'data-channel="customerType"'), `老客户系数 ${percent(data.rules.repeatCustomerFactor || 0.5)}`),
      field("产品大类", selectInput(c.productClassOverride, [{ value: "", label: `自动 · ${result.cost.product.productClass}` }, { value: "大瓦", label: "大瓦" }, { value: "小瓦", label: "小瓦" }], 'data-channel="productClassOverride"')),
      field("产品类型", selectInput(c.productTypeOverride, [{ value: "", label: `自动 · ${result.cost.product.productType}` }, { value: "手绘款", label: "手绘款" }, { value: "工艺款", label: "工艺款" }], 'data-channel="productTypeOverride"'))
    ]);
    const activeControls = activePricingMode === "consignment" ? consignmentControls : procurementControls;
    const controlsHtml = `
      <div class="secondary-tabs sub-nav pricing-sub-nav">
        <button type="button" class="sub-tab ${activePricingMode === "consignment" ? "active" : ""}" data-pricing-mode="consignment">寄售</button>
        <button type="button" class="sub-tab ${activePricingMode === "procurement" ? "active" : ""}" data-pricing-mode="procurement">采购</button>
      </div>
      ${activeControls.join("")}
    `;
    setHtml("channelControls", controlsHtml);
    setHtml("scenarioChannelControls", controlsHtml);
  }

  function metricCard(label, value, note, tone = "", options = {}) {
    const className = tone ? ` ${tone}` : "";
    const valueHtml = options.valueHtml ? value : escapeHtml(value);
    return `<article class="metric-card${className}">
      <span>${escapeHtml(label)}</span>
      <strong>${valueHtml}</strong>
      <small>${escapeHtml(note)}</small>
    </article>`;
  }

  function gradeBadge(grade) {
    const displayGrade = ruleGradeOrder().includes(grade) ? grade : (grade || "C");
    const classGrade = /^[A-Za-z0-9_-]+$/.test(String(displayGrade)) ? displayGrade : "custom";
    return `<span class="grade-badge grade-${escapeHtml(classGrade)}">${escapeHtml(displayGrade)}</span>`;
  }

  function dlRows(rows) {
    return `<dl>${rows.map(([label, value]) => `
      <dt>${escapeHtml(label)}</dt>
      <dd>${typeof value === "string" ? value : escapeHtml(value)}</dd>
    `).join("")}</dl>`;
  }

  function resultBlock(title, body, collapsed = false) {
    return `<section class="result-block${collapsed ? " collapsed" : ""}">
      <h3 onclick="this.parentElement.classList.toggle('collapsed')">${escapeHtml(title)}</h3>
      <div class="result-body">${body}</div>
    </section>`;
  }

  function policyTypeCards(activeType) {
    const policies = [
      {
        key: "标准商务条件",
        title: "标准商务条件",
        detail: "可长期复用，重点看扣点、账期、保证金、铺货上限和复盘机制。"
      },
      {
        key: "试点优惠政策",
        title: "试点优惠政策",
        detail: "用于早期进点和验证动销，必须有试点周期、复盘口径和退出机制。"
      },
      {
        key: "资源置换政策",
        title: "资源置换政策",
        detail: "低扣点或寄售支持必须换取授权、主陈列、官号、导流、数据或回款保障。"
      }
    ];
    const selected = activeType || "标准商务条件";
    return `<div class="policy-type-grid">${policies.map((item) => `
      <article class="policy-card${item.key === selected ? " active" : ""}">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.detail)}</span>
      </article>
    `).join("")}</div>`;
  }

  function factorText(value) {
    return `x${XJCore.round(Number(value) || 0, 2)}`;
  }

  function setHtml(id, html) {
    const element = qs(`#${id}`);
    if (element) element.innerHTML = html;
  }

  function hasOperatorName() {
    return hasAccount() || String(state.operatorName || "").trim().length > 0;
  }

  function isScenarioReadyForCalculation(scenario = state.scenario) {
    return String((scenario && scenario.spotName) || "").trim().length > 0;
  }

  function scenarioSaveBlockMessage() {
    if (!isScenarioReadyForCalculation()) return "请先填写景区/点位名称后再测算";
    if (!hasAccount()) return "请先在顶部选择或填写当前销售账号";
    return "";
  }

  function updateSaveRecordButtons() {
    const blockMessage = scenarioSaveBlockMessage();
    const ready = !blockMessage;
    qsa('[data-context-action="save"], [data-save-record]').forEach((button) => {
      const isScenarioContextSave = button.matches('[data-context-action="save"]') && activeView === "scenario";
      if (button.matches('[data-context-action="save"]') && !isScenarioContextSave) return;
      button.disabled = !ready;
      button.classList.toggle("disabled", !ready);
      button.title = ready ? "保存当前测算" : blockMessage;
    });
    setHtml("saveRecordHint", ready ? saveCollisionHintText() : `${escapeHtml(blockMessage)}，保存按钮才会启用。`);
  }

  function renderScenarioStickySummary(result) {
    const businessParam = result.business.gradeParam || result.pricing.gradeParam || result.scenario.gradeParam;
    const effectiveGrade = result.business.effectiveGrade || result.pricing.effectiveGrade || result.scenario.grade;
    setHtml("scenarioStickySummary", `
      <div class="live-rating-card grade-${escapeHtml(result.scenario.grade)}">
        <span>${escapeHtml(uiLayout.texts.stickyGradeLabel)}</span>
        ${gradeBadge(result.scenario.grade)}
        <strong>${XJCore.round(result.scenario.score, 1)}分</strong>
      </div>
      <div class="live-rating-card">
        <span>${escapeHtml(uiLayout.texts.stickyScoreLabel)}</span>
        <strong>${escapeHtml(`${result.scenario.t0Score}/${result.scenario.t1Score}/${result.scenario.t2Score}`)}</strong>
        <small>${escapeHtml(result.scenario.funnelAction)}</small>
      </div>
      <div class="live-rating-card">
        <span>${escapeHtml(uiLayout.texts.stickyBusinessLabel)}</span>
        <strong>${escapeHtml(`${effectiveGrade}级 · 扣点 <= ${percent(businessParam.deduction)}`)}</strong>
        <small>${escapeHtml(businessParam.mode)}</small>
      </div>
      <div class="live-rating-card">
        <span>${escapeHtml(uiLayout.texts.stickyCommissionLabel)}</span>
        <strong>${money(result.commission.monthlyCommission)}</strong>
        <small>${escapeHtml(`${result.commission.scheme} · 拓展奖金 ${money(result.commission.bonus)}`)}</small>
      </div>
    `);
  }

  function pendingScenarioBlockHtml() {
    return resultBlock("待测算", dlRows([
      ["当前状态", "待测算"],
      ["需要填写", "景区/点位名称"],
      ["说明", "左侧填写景区/点位名称或从景区库套用后，系统会自动生成评级、商务条件和提成测算。"]
    ]));
  }

  function renderScenarioPendingOutputs(result) {
    setHtml("scenarioStickySummary", `
      <div class="live-rating-card pending">
        <span>${escapeHtml(uiLayout.texts.stickyGradeLabel)}</span>
        ${gradeBadge("待测算")}
        <strong>待测算</strong>
      </div>
      <div class="live-rating-card pending">
        <span>${escapeHtml(uiLayout.texts.stickyScoreLabel)}</span>
        <strong>待测算</strong>
        <small>填写景区/点位名称后开始</small>
      </div>
      <div class="live-rating-card pending">
        <span>${escapeHtml(uiLayout.texts.stickyBusinessLabel)}</span>
        <strong>待测算</strong>
        <small>评级生成后显示指导商务条件</small>
      </div>
      <div class="live-rating-card pending">
        <span>${escapeHtml(uiLayout.texts.stickyCommissionLabel)}</span>
        <strong>待测算</strong>
        <small>商务条件填写后测算奖金</small>
      </div>
    `);
    setHtml("scenarioSummaryStrip", `
      ${metricCard("综合评级", gradeBadge("待测算"), "请先填写景区/点位名称", "pending", { valueHtml: true })}
      ${metricCard("T0/T1/T2", "待测算", "左侧数据未填入", "pending")}
      ${metricCard("授权联名", "待测算", "填写后判断授权口径", "pending")}
      ${metricCard("合作模式", "待测算", "评级生成后匹配商务条件", "pending")}
    `);
    setHtml("scenarioResultsPanel", pendingScenarioBlockHtml());
    setHtml("scoreBreakdown", `<div class="pending-state">待测算：请先填写景区/点位名称。</div>`);
    setHtml("riskPanel", dlRows([
      ["场景风险", "待测算"],
      ["授权判断", "待测算"],
      ["定价判断", "待测算"],
      ["采购校验", "待测算"],
      ["提成预警", "待测算"]
    ]));
    setHtml("businessGuidanceBody", pendingScenarioBlockHtml());
    setHtml("scenarioCommissionSummaryStrip", `
      ${metricCard("预计奖金", "待测算", "填写景区/点位名称后开始", "pending")}
      ${metricCard("测算提成", "待测算", "商务条件未生成", "pending")}
      ${metricCard("提成占回款", "待测算", "回款口径待填写", "pending")}
      ${metricCard("拓展奖金", "待测算", "评级待生成", "pending")}
      ${metricCard("商务提升激励", "待测算", "实际商务条件待填写", "pending")}
    `);
    setHtml("scenarioCommissionResultsPanel", pendingScenarioBlockHtml());
    setHtml("pricingSummaryStrip", `
      ${metricCard("有效等级", gradeBadge("待测算"), "场景评级待生成", "pending", { valueHtml: true })}
      ${metricCard("建议零售价", "待测算", "依赖场景评级", "pending")}
      ${metricCard("可分配毛利", "待测算", "依赖商务条件", "pending")}
      ${metricCard("采购校验", "待测算", "依赖场景与采购数量", "pending")}
    `);
    setHtml("pricingScenarioSummary", dlRows([
      ["场景评级", gradeBadge("待测算")],
      ["综合分", "待测算"],
      ["产品场景价带", "待测算"],
      ["合作模式", "待测算"],
      ["风险", "待测算"]
    ]));
    setHtml("pricingResultsPanel", pendingScenarioBlockHtml());
    const product = result.cost.product;
    setHtml("pricingCostSummary", dlRows([
      ["产品", `${escapeHtml(product.id)} · ${escapeHtml(product.name)}`],
      ["总成本", money(result.cost.totalCost)],
      ["成本底线", money(result.cost.minRetail)],
      ["成本占比", "待测算"],
      ["产品口径", `${escapeHtml(result.productClass)} · ${escapeHtml(result.productType)}`]
    ]));
  }

  function businessGuidanceHtml(result) {
    const param = result.business.gradeParam || result.pricing.gradeParam || result.scenario.gradeParam;
    const effectiveGrade = result.business.effectiveGrade || result.pricing.effectiveGrade || result.scenario.grade;
    const gradeNote = effectiveGrade === result.scenario.grade
      ? "按场景评级自动匹配规则参数"
      : `场景评级 ${result.scenario.grade}，当前按 ${effectiveGrade} 级规则参数`;
    return `
      <div class="business-guidance-hero">
        <div>
          <span>当前有效等级</span>
          <strong>${gradeBadge(effectiveGrade)} ${XJCore.round(result.scenario.score, 1)}分</strong>
          <small>${escapeHtml(gradeNote)}</small>
        </div>
        <div>
          <span>建议扣点上限</span>
          <strong>${percent(param.deduction)}</strong>
          <small>${escapeHtml(`规则参数：我方基准结算 ${percent(param.baseSettlementRatio)}，最低 ${percent(param.minSettlementRatio)}`)}</small>
        </div>
        <div>
          <span>建议合作模式</span>
          <strong>${escapeHtml(param.mode)}</strong>
          <small>${escapeHtml(`铺货上限 ${param.stockLimit} 片`)}</small>
        </div>
      </div>
      <div class="business-guidance-grid">
        ${resultBlock("商务条件", dlRows([
          ["当前有效等级", gradeBadge(effectiveGrade)],
          ["政策类型", escapeHtml(result.business.policyType)],
          ["推荐合作", escapeHtml(param.mode)],
          ["规则扣点上限", `不高于 ${percent(param.deduction)}`],
          ["我方基准结算比例", percent(param.baseSettlementRatio)],
          ["我方最低结算比例", percent(param.minSettlementRatio)],
          ["当前测算扣点", percent(result.business.negotiatedDeduction)],
          ["当前测算结算比例", percent(result.pricing.activeSettlementRatio)],
          ["铺货上限", `${escapeHtml(param.stockLimit)}片`],
          ["审批要求", escapeHtml(param.approval)],
          ["补充说明", escapeHtml(param.commercialTerms)]
        ]))}
        ${resultBlock("产品与价格", dlRows([
          ["建议价带", escapeHtml(param.priceRange)],
          ["建议产品线", escapeHtml(param.productSeries)],
          ["投入强度", escapeHtml(param.investment)],
          ["下一步动作", escapeHtml(param.nextAction)]
        ]))}
        ${resultBlock("本次谈判重点", dlRows([
          ["授权联名", escapeHtml(result.inputs.scenario.coBrandAuth)],
          ["官方资源", escapeHtml(result.inputs.scenario.marketingResources)],
          ["陈列空间", escapeHtml(result.inputs.scenario.display)],
          ["推进效率", escapeHtml(result.inputs.scenario.cooperationEfficiency)],
          ["风险提示", escapeHtml(result.scenario.risk)]
        ]))}
      </div>
      ${resultBlock("政策类型口径", policyTypeCards(result.business.policyType))}
    `;
  }

  function renderBusinessGuidance(result) {
    setHtml("businessGuidanceBody", businessGuidanceHtml(result));
  }

  function commissionDetailRows(result) {
    const isConsignment = String(result.commission.mode).includes("寄售");
    return isConsignment ? [
      ["最高3个月回款额", money(result.commission.top3SalesReceipt)],
      ["本点位商务成本", money(result.commission.pointBusinessCost)],
      ["基础提成率", percent(result.commission.commissionRate)],
      ["基础提成", money(result.commission.consignmentBaseCommission)],
      ["标准条件回款额", money(result.commission.standardReceipt)],
      ["超标准回款额", money(result.commission.extraReceipt)],
      ["商务提升激励比例", percent(result.commission.upliftRate)],
      ["商务提升激励", money(result.commission.consignmentUpliftCommission)],
      ["提成占回款比例", percent(result.commission.commissionShareOfReceipt)]
    ] : [
      ["采购回款额", money(result.commission.purchaseReceiptAmount)],
      ["匹配阶梯", escapeHtml(result.commission.purchaseCommissionTier ? result.commission.purchaseCommissionTier.name : "未匹配")],
      ["阶梯提点", percent(result.commission.purchaseCommissionRate)],
      ["客户类型", escapeHtml(result.commission.customerType)],
      ["客户系数", factorText(result.commission.customerFactor)],
      ["采购提成", money(result.commission.purchaseCommission)],
      ["提成占回款比例", percent(result.commission.commissionShareOfReceipt)]
    ];
  }

  function formulaList(items) {
    return `<ol class="formula-list">${items.map((item, index) => `
      <li>
        <span>${index + 1}</span>
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.detail)}</small>
        </div>
      </li>
    `).join("")}</ol>`;
  }

  function formulaOverview(items) {
    return `<div class="formula-overview">${items.map((item) => `
      <div>
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <small>${escapeHtml(item.note)}</small>
      </div>
    `).join("")}</div>`;
  }

  function commissionFormulaHtml(result) {
    const isConsignment = String(result.commission.mode).includes("寄售");
    if (isConsignment) {
      const baseAmount = Math.max(0, result.commission.top3SalesReceipt - result.commission.pointBusinessCost);
      return `<div class="commission-formula">
        ${formulaOverview([
          { label: "销售看这个", value: percent(result.commission.commissionShareOfReceipt), note: "测算提成 ÷ 最高3个月回款额" },
          { label: "基础提成率", value: percent(result.commission.commissionRate), note: "作用于扣除商务成本后的回款" },
          { label: "商务提升比例", value: percent(result.commission.upliftRate), note: "只作用于超标准回款额" }
        ])}
        ${formulaList([
          {
            title: "基础提成 = max(0, 最高3个月回款额 - 本点位商务成本) × 基础提成率",
            detail: `代入：max(0, ${money(result.commission.top3SalesReceipt)} - ${money(result.commission.pointBusinessCost)}) = ${money(baseAmount)}；${money(baseAmount)} × ${percent(result.commission.commissionRate)} = ${money(result.commission.consignmentBaseCommission)}`
          },
          {
            title: "标准条件回款额 = 最高3个月回款额 × 等级基准结算比例 ÷ 实际结算比例",
            detail: `代入：${money(result.commission.top3SalesReceipt)} × ${percent(result.business.baselineSettlementRatio)} ÷ ${percent(result.pricing.activeSettlementRatio)} = ${money(result.commission.standardReceipt)}`
          },
          {
            title: "商务提升激励 = max(0, 最高3个月回款额 - 标准条件回款额) × 商务提升比例",
            detail: `代入：${money(result.commission.extraReceipt)} × ${percent(result.commission.upliftRate)} = ${money(result.commission.consignmentUpliftCommission)}`
          },
          {
            title: "测算提成 = 基础提成 + 商务提升激励",
            detail: `代入：${money(result.commission.consignmentBaseCommission)} + ${money(result.commission.consignmentUpliftCommission)} = ${money(result.commission.monthlyCommission)}；占回款 ${percent(result.commission.commissionShareOfReceipt)}`
          }
        ])}
      </div>`;
    }
    return `<div class="commission-formula">
      ${formulaOverview([
        { label: "销售看这个", value: percent(result.commission.commissionShareOfReceipt), note: "采购提成 ÷ 采购回款额" },
        { label: "采购阶梯提点", value: percent(result.commission.purchaseCommissionRate), note: result.commission.purchaseCommissionTier ? result.commission.purchaseCommissionTier.name : "未匹配阶梯" },
        { label: "客户系数", value: factorText(result.commission.customerFactor), note: result.commission.customerType }
      ])}
      ${formulaList([
        {
          title: "采购提成 = 采购回款额 × 阶梯提点 × 客户系数",
          detail: `代入：${money(result.commission.purchaseReceiptAmount)} × ${percent(result.commission.purchaseCommissionRate)} × ${factorText(result.commission.customerFactor)} = ${money(result.commission.purchaseCommission)}`
        },
        {
          title: "测算提成 = 采购提成",
          detail: `代入：${money(result.commission.purchaseCommission)}；占回款 ${percent(result.commission.commissionShareOfReceipt)}`
        },
        {
          title: "预计奖金 = 测算提成 + 拓展奖金",
          detail: `代入：${money(result.commission.monthlyCommission)} + ${money(result.commission.bonus)} = ${money(result.commission.income)}`
        }
      ])}
    </div>`;
  }

  function commissionSummaryHtml(result) {
    const isConsignment = String(result.commission.mode).includes("寄售");
    return `
      ${metricCard("预计奖金", money(result.commission.income), `测算提成+拓展奖金`, "profit")}
      ${metricCard("测算提成", money(result.commission.monthlyCommission), result.commission.scheme, "accent")}
      ${metricCard("提成占回款", percent(result.commission.commissionShareOfReceipt), isConsignment ? `${money(result.commission.monthlyCommission)} / ${money(result.commission.top3SalesReceipt)}` : `${money(result.commission.purchaseCommission)} / ${money(result.commission.purchaseReceiptAmount)}`, "ok")}
      ${metricCard("拓展奖金", money(result.commission.bonus), `一级域05 · 按${result.pricing.effectiveGrade}级`, `grade-${result.pricing.effectiveGrade}`)}
      ${metricCard(isConsignment ? "商务提升激励" : "采购提点", isConsignment ? money(result.commission.consignmentUpliftCommission) : percent(result.commission.purchaseCommissionRate), isConsignment ? `超标准回款 ${money(result.commission.extraReceipt)}` : `${escapeHtml(result.commission.customerType)} · ${factorText(result.commission.customerFactor)}`, result.business.deltaMonthlyCommission >= 0 ? "ok" : "warn")}
    `;
  }

  function commissionResultsHtml(result) {
    const isConsignment = String(result.commission.mode).includes("寄售");
    return `
      <section class="commission-note">
        <strong>填写口径</strong>
        <span>寄售/保证金寄售统一按上线后6个月内最高3个月销售回款额测算；采购按单次采购回款额阶梯测算，老客户复购按规则参数里的客户系数折算。</span>
      </section>
      ${resultBlock("奖金/提成结果", dlRows([
        ["当前有效等级", gradeBadge(result.pricing.effectiveGrade)],
        ["提成口径", escapeHtml(result.commission.scheme)],
        ["测算提成", money(result.commission.monthlyCommission)],
        ["拓展奖金", money(result.commission.bonus)],
        ["奖金估算", money(result.commission.income)]
      ]))}
      ${resultBlock("提成比例与计算公式", commissionFormulaHtml(result))}
      ${resultBlock(isConsignment ? "寄售回款提成明细" : "采购回款提成明细", dlRows(commissionDetailRows(result)))}
      ${resultBlock("商务条件变化", dlRows([
        ["政策类型", escapeHtml(result.business.policyType)],
        ["等级基准扣点", percent(result.business.baselineDeduction)],
        ["实际/拟谈扣点", percent(result.business.negotiatedDeduction)],
        ["结算比例变化", percent(result.business.deltaSettlementRatio)],
        ["提成变化", money(result.business.deltaMonthlyCommission)],
        ["提成预警", escapeHtml(result.commission.warning)]
      ]))}
    `;
  }

  function renderScenarioCommission(result) {
    setHtml("scenarioCommissionSummaryStrip", commissionSummaryHtml(result));
    setHtml("scenarioCommissionResultsPanel", commissionResultsHtml(result));
  }

  function ensureResultChrome() {
    ["costSummaryStrip", "scenarioSummaryStrip", "pricingSummaryStrip", "scenarioCommissionSummaryStrip"].forEach((id) => {
      const element = qs(`#${id}`);
      if (element) element.classList.add("summary-strip");
    });
    ["costBreakdown", "scoreBreakdown", "riskPanel", "pricingCostSummary", "pricingScenarioSummary"].forEach((id) => {
      const element = qs(`#${id}`);
      if (element) element.classList.add("result-body");
    });
    const scoreBreakdown = qs("#scoreBreakdown");
    if (scoreBreakdown) scoreBreakdown.classList.add("score-breakdown");
    qsa(".result-block > h3").forEach((heading) => {
      heading.setAttribute("onclick", "this.parentElement.classList.toggle('collapsed')");
    });
  }

  function updateCalculatedViews() {
    const result = currentResult();
    const businessParam = result.business.gradeParam || result.pricing.gradeParam || result.scenario.gradeParam;
    const effectiveGrade = result.business.effectiveGrade || result.pricing.effectiveGrade || result.scenario.grade;
    ensureResultChrome();
    updateSaveRecordButtons();

    setHtml("costSummaryStrip", `
      ${metricCard("当前产品", result.cost.product.name, `${result.cost.product.id} · ${result.cost.product.spec}`, "accent")}
      ${metricCard("总成本", money(result.cost.totalCost), `产品最低价 ${money(result.cost.minRetail)}`, "profit")}
      ${metricCard("成本占比", percent(result.pricing.costShare), `按零售价 ${money(result.pricing.retail)}`, result.pricing.costShare > 0.4 ? "warn" : "ok")}
      ${metricCard("产品成本价带", money(result.cost.minRetail), result.cost.priceBandLabel, "accent")}
    `);

    setHtml("costResultsPanel", `
      ${resultBlock("成本结论", dlRows([
        ["产品口径", `${escapeHtml(result.cost.product.productClass)} · ${escapeHtml(result.cost.product.productType)}`],
        ["产品结构", escapeHtml(result.cost.product.structure)],
        ["包装/载体", `${escapeHtml(result.cost.product.packageType)} · ${escapeHtml(result.cost.product.carrier)}`],
        ["最低建议价", money(result.cost.minRetail)],
        ["备注", escapeHtml(result.cost.product.note || "无")]
      ]))}
      ${resultBlock("成本对定价影响", dlRows([
        ["当前零售价", money(result.pricing.retail)],
        ["成本占比", percent(result.pricing.costShare)],
        ["我方回款/片", money(result.pricing.settlement)],
        ["单片毛利", money(result.pricing.grossMargin)],
        ["判断", escapeHtml(result.pricing.judgement)]
      ]))}
    `);

    setHtml("costBreakdown", dlRows(Object.entries(result.cost.components).map(([key, value]) => [
      result.cost.componentLabels[key] || key,
      money(value)
    ]).concat([
      ["合计", money(result.cost.totalCost)]
    ])));

    if (!isScenarioReadyForCalculation(result.inputs.scenario)) {
      renderScenarioPendingOutputs(result);
      return;
    }

    renderScenarioStickySummary(result);
    renderBusinessGuidance(result);
    renderScenarioCommission(result);

    setHtml("scenarioSummaryStrip", `
      ${metricCard("综合评级", gradeBadge(result.scenario.grade), `${XJCore.round(result.scenario.score, 1)}分 · ${result.scenario.risk}`, `grade-${result.scenario.grade}`, { valueHtml: true })}
      ${metricCard("T0/T1/T2", `${result.scenario.t0Score}/${result.scenario.t1Score}/${result.scenario.t2Score}`, result.scenario.funnelAction, "accent")}
      ${metricCard("授权联名", result.scenario.needAuth, result.inputs.scenario.coBrandAuth, result.scenario.needAuth.startsWith("是") ? "warn" : "ok")}
      ${metricCard("合作模式", businessParam.mode, `${effectiveGrade}级 · 规则扣点<=${percent(businessParam.deduction)}`, `grade-${effectiveGrade}`)}
    `);

    setHtml("scenarioResultsPanel", `
      ${resultBlock("场景判断", dlRows([
        ["点位/门店", escapeHtml(result.inputs.scenario.spotName)],
        ["数据年份", `${escapeHtml(result.inputs.scenario.dataYear || 2025)}年`],
        ["测算等级", gradeBadge(result.scenario.grade)],
        ["综合分", `${XJCore.round(result.scenario.score, 1)}分`],
        ["漏斗动作", escapeHtml(result.scenario.funnelAction)],
        ["产品场景价带", money(result.scenario.recommendedRetail)],
        ["铺货上限", `${escapeHtml(businessParam.stockLimit)}片`]
      ]))}
      ${resultBlock("关键参数", dlRows([
        ["景区等级", escapeHtml(result.inputs.scenario.scenicLevel)],
        ["年客流量", `${escapeHtml(result.inputs.scenario.annualVisitors)}万人`],
        ["收费状态", `${escapeHtml(result.inputs.scenario.ticketMode)} · ${money(result.inputs.scenario.ticketPrice)}`],
        ["店位/空间", `${escapeHtml(result.inputs.scenario.location)} · ${escapeHtml(result.inputs.scenario.display)}`],
        ["商务/态度", `${escapeHtml(result.inputs.scenario.businessTerms)} · ${escapeHtml(result.inputs.scenario.cooperationEfficiency)}`],
        ["官方资源", `${escapeHtml(result.inputs.scenario.officialCooperation)} · ${escapeHtml(result.inputs.scenario.marketingResources)}`]
      ]))}
    `);

    setHtml("scoreBreakdown", result.scenario.breakdown.map((item) => {
      const width = item.max ? Math.max(0, Math.min(100, (Number(item.score) / Number(item.max)) * 100)) : 0;
      const rawTitle = item.rawScore !== undefined && item.rawMax !== undefined ? ` title="组内分 ${escapeHtml(item.rawScore)}/${escapeHtml(item.rawMax)}"` : "";
      return `<div class="score-row">
        <span>${escapeHtml(item.stage ? `${item.stage} ${item.label}` : item.label)}</span>
        <div class="score-track"><i style="width:${width}%"></i></div>
        <b${rawTitle}>${escapeHtml(item.score)}分</b>
      </div>`;
    }).join(""));

    setHtml("riskPanel", dlRows([
      ["场景风险", escapeHtml(result.scenario.risk)],
      ["授权判断", escapeHtml(result.scenario.needAuth)],
      ["定价判断", escapeHtml(result.pricing.judgement)],
      ["采购校验", `${escapeHtml(result.purchase.status)} · ${escapeHtml(result.purchase.ruleText)}`],
      ["提成预警", escapeHtml(result.commission.warning)]
    ]));

    setHtml("pricingSummaryStrip", `
      ${metricCard("有效等级", gradeBadge(result.pricing.effectiveGrade), `场景等级 ${result.scenario.grade}`, `grade-${result.pricing.effectiveGrade}`, { valueHtml: true })}
      ${metricCard("建议零售价", money(result.pricing.retail), `自动建议 ${money(result.pricing.suggestedRetail)}`, "accent")}
      ${metricCard("可分配毛利", money(result.pricing.distributableMargin), `管理保留 ${money(result.pricing.managementReserve)}`, "profit")}
      ${metricCard("采购校验", result.purchase.status, `${money(result.purchase.finalUnitPrice)} / 片`, result.purchase.status === "需下调" ? "warn" : "ok")}
    `);

    setHtml("pricingCostSummary", dlRows([
      ["产品", `${escapeHtml(result.cost.product.id)} · ${escapeHtml(result.cost.product.name)}`],
      ["总成本", money(result.cost.totalCost)],
      ["成本底线", money(result.cost.minRetail)],
      ["成本占比", percent(result.pricing.costShare)],
      ["产品口径", `${escapeHtml(result.productClass)} · ${escapeHtml(result.productType)}`]
    ]));

    setHtml("pricingScenarioSummary", dlRows([
      ["场景评级", gradeBadge(result.scenario.grade)],
      ["综合分", `${XJCore.round(result.scenario.score, 1)}分`],
      ["产品场景价带", money(result.scenario.recommendedRetail)],
      ["合作模式", escapeHtml(businessParam.mode)],
      ["风险", escapeHtml(result.scenario.risk)]
    ]));

    const pricingResults = resultBlock("定价结果", dlRows([
      ["当前零售价", money(result.pricing.retail)],
      ["我方回款/片", money(result.pricing.settlement)],
      ["单片毛利", money(result.pricing.grossMargin)],
      ["毛利率", percent(result.pricing.grossMarginRate)],
      ["计售比", percent(result.pricing.activeSettlementRatio)],
      ["判断", escapeHtml(result.pricing.judgement)]
    ]));

    const procurementBlock = activePricingMode === "procurement"
      ? resultBlock("采购校验", dlRows([
          ["匹配阶梯", escapeHtml(result.purchase.tier ? result.purchase.tier.name : "未匹配")],
          ["阶梯采购价", money(result.purchase.tierUnitPrice)],
          ["标准条件上限", money(result.baselineConsignment.capUnitPrice)],
          ["最终采购单价", money(result.purchase.finalUnitPrice)],
          ["最终采购小计", money(result.purchase.finalTotal)],
          ["总采政策", escapeHtml(result.purchase.totalPolicy.name)],
          ["采购提成阶梯", escapeHtml(result.commission.purchaseCommissionTier ? result.commission.purchaseCommissionTier.name : "未匹配")]
        ]))
      : "";

    const commissionBlock = resultBlock("提成", dlRows([
      ["提成口径", escapeHtml(result.commission.scheme)],
      ["测算提成", money(result.commission.monthlyCommission)],
      ["拓展奖金", money(result.commission.bonus)],
      ["奖金估算", money(result.commission.income)],
      ["回款口径", String(result.commission.mode).includes("寄售") ? money(result.commission.top3SalesReceipt) : money(result.commission.purchaseReceiptAmount)],
      ["预警", escapeHtml(result.commission.warning)]
    ]));

    const businessBlock = resultBlock("商务条件提升测算", dlRows([
      ["规则扣点上限", percent(result.business.ruleDeduction)],
      ["规则基准结算比例", percent(result.business.ruleBaseSettlementRatio)],
      ["规则最低结算比例", percent(result.business.ruleMinSettlementRatio)],
      ["当前基准扣点", percent(result.business.baselineDeduction)],
      ["当前测算扣点", percent(result.business.negotiatedDeduction)],
      ["结算比例变化", percent(result.business.deltaSettlementRatio)],
      ["月摊费用", money(result.business.fixedFeeMonthly)],
      ["单片可分配毛利变化", money(result.business.deltaDistributableMargin)],
      ["提成变化", money(result.business.deltaMonthlyCommission)]
    ]));

    setHtml("pricingResultsPanel", `
      ${pricingResults}
      ${procurementBlock}
      ${businessBlock}
      ${commissionBlock}
    `);
  }

  function renderRuleBoard() {
    const order = (data.rules.ui.ruleOrder || Object.keys(sectionMeta)).filter((key) => sectionMeta[key]);
    if (!order.includes(activeRuleSection)) activeRuleSection = order[0] || "price";
    return order.map((key) => {
      const meta = sectionMeta[key];
      const active = key === activeRuleSection ? " active" : "";
      return `<button class="rule-card${active}" type="button" draggable="true" data-rule-card="${escapeHtml(key)}" aria-pressed="${key === activeRuleSection ? "true" : "false"}">
        <span>一级域 ${escapeHtml(meta.index)} · ${escapeHtml(meta.title)}</span>
        <strong>${escapeHtml(meta.label)}</strong>
        <small>${escapeHtml(meta.detail)}</small>
        <em>${meta.groups.map((group) => `<i>${escapeHtml(group)}</i>`).join("")}</em>
      </button>`;
    }).join("");
  }

  function renderSettings() {
    if (!accountHasPermission("rules", "view")) {
      qs("#ruleBoard").innerHTML = "";
      qs("#settingsBody").innerHTML = permissionGateHtml("没有规则参数权限", "规则参数包含评级、商务条件、采购折扣和提成口径。");
      return;
    }
    const order = (data.rules.ui.ruleOrder || Object.keys(sectionMeta)).filter((key) => sectionMeta[key]);
    if (!order.includes(activeRuleSection)) activeRuleSection = order[0] || "price";
    qs("#ruleBoard").innerHTML = renderRuleBoard();
    const activeMeta = sectionMeta[activeRuleSection];
    const activeBody = (() => {
      if (activeRuleSection === "price") return renderPriceSettings();
      if (activeRuleSection === "grade") return renderGradeSettings();
      if (activeRuleSection === "scoring") return renderScoringSettings();
      if (activeRuleSection === "purchase") return renderPurchaseSettings();
      if (activeRuleSection === "commission") return renderCommissionSettings();
      if (activeRuleSection === "sellThrough") return renderSellThroughSettings();
      return "";
    })();
    qs("#settingsBody").innerHTML = `
      <section class="settings-note">
        <strong>${escapeHtml(data.rules.ui.scoringModelName || "参数归属")}</strong>
        <span>${escapeHtml(data.rules.ui.scoringModelNote || "规则参数库按“一级规则域 → 二级参数组 → 具体参数项”管理；景区公开数据在“景区基础库”，销售当次店位/商务/资源填报在“场景评级”，最终测算沉淀在“点位机会”。")} <a href="./docs/rule-parameter-operating-strategy.md" target="_blank" rel="noopener">查看经营口径说明</a></span>
        <em>当前：一级域 ${escapeHtml(activeMeta.index)} · ${escapeHtml(activeMeta.title)} / ${escapeHtml(activeMeta.label)}</em>
      </section>
      ${activeBody}`;
  }

  function settingInput(path, value, step = "1", min = "") {
    const minAttr = min !== "" ? ` min="${min}"` : "";
    return `<input type="number" step="${step}"${minAttr} value="${escapeHtml(value)}" data-rule-path="${escapeHtml(path)}">`;
  }

  function settingText(path, value) {
    return `<input value="${escapeHtml(value)}" data-rule-path="${escapeHtml(path)}">`;
  }

  function settingsSection(key, body) {
    const meta = sectionMeta[key];
    return `<section class="settings-section" data-rule-section="${escapeHtml(key)}">
      <div class="settings-section-head">
        <span>一级域 ${escapeHtml(meta.index)}</span>
        <div>
          <h2>${escapeHtml(meta.title)} · ${escapeHtml(meta.label)}</h2>
          <p>${escapeHtml(meta.detail)}</p>
        </div>
      </div>
      <div class="settings-subsection-stack">${body}</div>
    </section>`;
  }

  function settingsSubsection(level, title, description, body) {
    return `<section class="settings-subsection">
      <div class="settings-subsection-title">
        <span>${escapeHtml(level)}</span>
        <div>
          <h3>${escapeHtml(title)}</h3>
          ${description ? `<p>${escapeHtml(description)}</p>` : ""}
        </div>
      </div>
      <div class="settings-subsection-body">${body}</div>
    </section>`;
  }

  function ruleAddButton(target, label = "新增") {
    return `<button type="button" class="rule-add-btn" data-rule-add="${escapeHtml(target)}">${escapeHtml(label)}</button>`;
  }

  function ruleDeleteButton(target, indexOrKey, label = "删除") {
    return `<button type="button" class="rule-delete-btn" data-rule-delete="${escapeHtml(target)}" data-rule-delete-key="${escapeHtml(indexOrKey)}">${escapeHtml(label)}</button>`;
  }

  function ruleActions(target, label = "新增") {
    return `<div class="settings-actions">${ruleAddButton(target, label)}</div>`;
  }

  function ruleValueAt(path) {
    return String(path).split(".").reduce((cursor, key) => cursor && cursor[key], data.rules);
  }

  function setRuleValueAt(path, value) {
    const parts = String(path).split(".");
    let cursor = data.rules;
    for (let index = 0; index < parts.length - 1; index += 1) {
      cursor = cursor[parts[index]];
    }
    cursor[parts[parts.length - 1]] = value;
  }

  function nextRuleName(base, used) {
    let index = 1;
    let name = `${base}${index}`;
    while (used.includes(name)) {
      index += 1;
      name = `${base}${index}`;
    }
    return name;
  }

  function cloneRuleItem(target) {
    if (target === "costPriceBands") return { maxCost: 30, retail: 89, label: "新成本价带" };
    if (target === "scenarioPriceBands") {
      const index = (data.rules.scenarioPriceBands || []).length;
      const grade = ruleGradeOrder()[index] || "";
      const threshold = grade && data.rules.gradeParams && data.rules.gradeParams[grade] ? data.rules.gradeParams[grade].threshold : 0;
      return { grade, minScore: threshold, retail: 79, label: grade ? `${grade}级场景价带` : "新场景价带" };
    }
    if (target.endsWith(".options")) return { label: "新选项", score: 0 };
    if (target === "scoring.visitors.thresholds") return { min: 0, score: 0, label: "新客流档" };
    if (target === "scoring.ticket.thresholds") return { min: 0, score: 0, label: "新票价档" };
    if (target === "scoring.vetoRules") {
      const usedKeys = (data.rules.scoring.vetoRules || []).map((item) => item.key);
      return { key: nextRuleName("vetoCustom", usedKeys), label: "新红线规则" };
    }
    if (target === "purchaseTiers") return { minQty: 0, maxQty: 49, name: "新增数量阶梯", discount: 1, manualPrice: null, useManualPrice: false, enabled: true };
    if (target === "totalPurchasePolicies") return { minQty: 0, maxQty: 99, name: "新增总采政策", action: "填写政策动作" };
    if (target === "consignmentIncentives") return { minSales: 0, maxSales: 99999, decrease: 0, name: "新增寄售激励" };
    if (target === "purchaseCommissionTiers") return { minAmount: 0, maxAmount: 999999, rate: 0.03, name: "新增采购提成阶梯" };
    if (target === "sellThroughFactors") return { minRate: 0, factor: 1, status: "新增状态", action: "填写处理建议" };
    if (target === "depositFactors") return { minCoverage: 0, factor: 1 };
    return {};
  }

  function cloneGradeParam(seed = {}) {
    return {
      threshold: 0,
      deduction: 0.3,
      baseSettlementRatio: 0.7,
      minSettlementRatio: 0.65,
      stockLimit: 0,
      mode: "新增等级合作模式",
      priceRange: "待设置",
      productSeries: "待设置",
      investment: "待设置",
      nextAction: "待设置",
      commercialTerms: "待设置",
      approval: "待设置",
      ...seed
    };
  }

  function gradeThreshold(grade, fallback = 0) {
    const param = data.rules.gradeParams && data.rules.gradeParams[grade];
    return param && param.threshold !== undefined ? Number(param.threshold) || 0 : Number(fallback) || 0;
  }

  function alignScenarioBandsWithGrades(bands) {
    const grades = ruleGradeOrder();
    const source = Array.isArray(bands) ? bands : [];
    return source.map((band, index) => {
      const grade = band.grade || grades[index] || "";
      return {
        ...band,
        grade,
        minScore: grade ? gradeThreshold(grade, band.minScore) : Number(band.minScore) || 0
      };
    });
  }

  function scenarioBandGradeLabel(band, index) {
    const grade = band.grade || ruleGradeOrder()[index] || "";
    const score = grade ? gradeThreshold(grade, band.minScore) : Number(band.minScore) || 0;
    return `<strong>${escapeHtml(grade || "自定义")}</strong><small>${escapeHtml(score)}分线</small>`;
  }

  function objectFactorTable(target, titleLabel, valueLabel, baseName) {
    const items = data.rules[target] || {};
    const keys = Object.keys(items);
    return `
      ${ruleActions(target, `新增${titleLabel}`)}
      <table class="config-table">
        <thead><tr><th>${escapeHtml(titleLabel)}</th><th>${escapeHtml(valueLabel)}</th><th>操作</th></tr></thead>
        <tbody>${keys.map((key) => `
          <tr>
            <td><input value="${escapeHtml(key)}" data-rule-map-key="${escapeHtml(target)}" data-rule-map-old-key="${escapeHtml(key)}" data-rule-map-base="${escapeHtml(baseName)}"></td>
            <td>${settingInput(`${target}.${key}`, items[key], "0.01", "0")}</td>
            <td>${ruleDeleteButton(target, key)}</td>
          </tr>`).join("")}</tbody>
      </table>`;
  }

  function expansionBonusTable() {
    const items = data.rules.expansionBonuses || {};
    const keys = Object.keys(items);
    return `
      ${ruleActions("expansionBonuses", "新增拓展奖金等级")}
      <table class="config-table">
        <thead><tr><th>等级</th><th>拓展奖金</th><th>操作</th></tr></thead>
        <tbody>${keys.map((key) => `
          <tr>
            <td><input value="${escapeHtml(key)}" data-rule-map-key="expansionBonuses" data-rule-map-old-key="${escapeHtml(key)}" data-rule-map-base="新等级"></td>
            <td>${settingInput(`expansionBonuses.${key}`, items[key], "100", "0")}</td>
            <td>${ruleDeleteButton("expansionBonuses", key)}</td>
          </tr>`).join("")}</tbody>
      </table>`;
  }

  function renderPriceSettings() {
    data.rules.scenarioPriceBands = alignScenarioBandsWithGrades(data.rules.scenarioPriceBands);
    return settingsSection("price", `
      ${settingsSubsection("二级 1", "基础参数", "影响自动定价、可分配毛利和商务测算的全局参数", `
        <div class="settings-grid">
        ${field("高价带成本占比", settingInput("highPriceCostShare", data.rules.highPriceCostShare, "0.01", "0"), "仅当产品成本高于所有成本价带时启用，用成本÷该比例反推最低零售价")}
        ${field("管理保留比例", settingInput("managementReserveRate", data.rules.managementReserveRate, "0.01", "0"), "从零售价中预留管理/运营空间，影响可分配毛利和提成测算")}
        </div>
      `)}
      ${settingsSubsection("二级 2", "默认成本价带模板", "产品未单独配置成本价带时使用；影响产品最低建议零售价、低于成本价带判断和自动建议价下限", `
        ${ruleActions("costPriceBands", "新增成本价带")}
        <table class="config-table">
          <thead><tr><th>成本上限</th><th>建议零售价</th><th>标签</th><th>操作</th></tr></thead>
          <tbody>${data.rules.costPriceBands.map((band, index) => `
            <tr>
              <td>${settingInput(`costPriceBands.${index}.maxCost`, band.maxCost, "0.1", "0")}</td>
              <td>${settingInput(`costPriceBands.${index}.retail`, band.retail, "1", "0")}</td>
              <td>${settingText(`costPriceBands.${index}.label`, band.label)}</td>
              <td>${ruleDeleteButton("costPriceBands", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
      ${settingsSubsection("二级 3", "默认场景价带模板", "分数线自动跟随一级域02评级标准；影响场景建议价、自动建议零售价、后续毛利/采购/提成测算", `
        ${ruleActions("scenarioPriceBands", "新增场景价带")}
        <table class="config-table">
          <thead><tr><th>评级分线</th><th>建议零售价</th><th>标签</th><th>操作</th></tr></thead>
          <tbody>${data.rules.scenarioPriceBands.map((band, index) => `
            <tr>
              <td>${scenarioBandGradeLabel(band, index)}<input type="hidden" data-rule-path="scenarioPriceBands.${index}.minScore" value="${escapeHtml(band.minScore)}"></td>
              <td>${settingInput(`scenarioPriceBands.${index}.retail`, band.retail, "1", "0")}</td>
              <td>${settingText(`scenarioPriceBands.${index}.label`, band.label)}</td>
              <td>${ruleDeleteButton("scenarioPriceBands", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
    `);
  }

  function renderGradeSettings() {
    data.rules.gradeCaps = normalizeGradeCaps(data.rules.gradeCaps);
    const cap = data.rules.gradeCaps;
    return settingsSection("grade", `
      ${settingsSubsection("二级 1", "等级硬参数", "决定 S/A/B/C/D 评级、基准扣点、计售比和铺货上限", `
        ${ruleActions("gradeParams", "新增等级")}
        <table class="config-table">
          <thead><tr><th>等级</th><th>分数线</th><th>景区扣点</th><th>基础计售比</th><th>最低计售比</th><th>铺货上限</th><th>操作</th></tr></thead>
          <tbody>${ruleGradeOrder().map((grade) => {
            const item = data.rules.gradeParams[grade];
            return `<tr>
              <td><input class="grade-key-input" value="${escapeHtml(grade)}" data-rule-grade-rename="${escapeHtml(grade)}"></td>
              <td>${settingInput(`gradeParams.${grade}.threshold`, item.threshold, "1", "0")}</td>
              <td>${settingInput(`gradeParams.${grade}.deduction`, item.deduction, "0.01", "0")}</td>
              <td>${settingInput(`gradeParams.${grade}.baseSettlementRatio`, item.baseSettlementRatio, "0.01", "0")}</td>
              <td>${settingInput(`gradeParams.${grade}.minSettlementRatio`, item.minSettlementRatio, "0.01", "0")}</td>
              <td>${settingInput(`gradeParams.${grade}.stockLimit`, item.stockLimit, "100", "0")}</td>
              <td>${ruleDeleteButton("gradeParams", grade)}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      `)}
      ${settingsSubsection("二级 2", "等级商务指导", "销售在商务条件页看到的合作模式、产品线和下一步动作", `
        ${ruleActions("gradeParams", "新增等级")}
        <table class="config-table xwide">
          <thead><tr><th>等级</th><th>合作模式</th><th>建议价带</th><th>建议产品线</th><th>投入强度</th><th>下一步动作</th><th>商务说明</th><th>审批要求</th><th>操作</th></tr></thead>
          <tbody>${ruleGradeOrder().map((grade) => {
            const item = data.rules.gradeParams[grade];
            return `<tr>
              <td><b>${grade}</b></td>
              <td>${settingText(`gradeParams.${grade}.mode`, item.mode)}</td>
              <td>${settingText(`gradeParams.${grade}.priceRange`, item.priceRange)}</td>
              <td>${settingText(`gradeParams.${grade}.productSeries`, item.productSeries)}</td>
              <td>${settingText(`gradeParams.${grade}.investment`, item.investment)}</td>
              <td>${settingText(`gradeParams.${grade}.nextAction`, item.nextAction)}</td>
              <td>${settingText(`gradeParams.${grade}.commercialTerms`, item.commercialTerms)}</td>
              <td>${settingText(`gradeParams.${grade}.approval`, item.approval)}</td>
              <td>${ruleDeleteButton("gradeParams", grade)}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      `)}
      ${settingsSubsection("二级 3", "等级封顶规则", "默认关闭：综合分达到分数线即按分线评级；打开后才按T0/T1/T2弱项把等级封顶", `
        <div class="settings-grid">
          ${field("启用弱项封顶", `<input type="checkbox" ${cap.enabled ? "checked" : ""} data-rule-path="gradeCaps.enabled">`, "关闭时，92.6分会直接按S/A/B/C/D分数线评级")}
          ${field("T0/T1基础线比例", settingInput("gradeCaps.t0t1BaseRatio", cap.t0t1BaseRatio, "0.01", "0"), "低于该比例时封到基础等级")}
          ${field("T0/T1轻试线比例", settingInput("gradeCaps.t0t1LightRatio", cap.t0t1LightRatio, "0.01", "0"), "低于该比例时封到轻试等级")}
          ${field("T0/T1样板线比例", settingInput("gradeCaps.t0t1SampleRatio", cap.t0t1SampleRatio, "0.01", "0"), "低于该比例时不能做高等级样板")}
          ${field("T2资源线比例", settingInput("gradeCaps.t2ResourceRatio", cap.t2ResourceRatio, "0.01", "0"), "低于该比例时官方资源偏弱")}
          ${field("T2样板线比例", settingInput("gradeCaps.t2SampleRatio", cap.t2SampleRatio, "0.01", "0"), "低于该比例时不足以做S级样板")}
        </div>
        <table class="config-table">
          <thead><tr><th>触发条件</th><th>最高等级</th><th>说明</th></tr></thead>
          <tbody>
            <tr>
              <td>T0/T1 未过基础线</td>
              <td>${settingText("gradeCaps.t0t1BaseMaxGrade", cap.t0t1BaseMaxGrade)}</td>
              <td>文化适配或商业转化低于基础线</td>
            </tr>
            <tr>
              <td>T0/T1 仅适合轻试</td>
              <td>${settingText("gradeCaps.t0t1LightMaxGrade", cap.t0t1LightMaxGrade)}</td>
              <td>可以测试，但不应按高等级投入</td>
            </tr>
            <tr>
              <td>T0/T1 未达样板强度</td>
              <td>${settingText("gradeCaps.t0t1SampleMaxGrade", cap.t0t1SampleMaxGrade)}</td>
              <td>不适合作为强样板推进</td>
            </tr>
            <tr>
              <td>T2 官方/资源支持弱</td>
              <td>${settingText("gradeCaps.t2ResourceMaxGrade", cap.t2ResourceMaxGrade)}</td>
              <td>官方合作、授权、营销或导流资源不足</td>
            </tr>
            <tr>
              <td>T2 暂不足以做S级样板</td>
              <td>${settingText("gradeCaps.t2SampleMaxGrade", cap.t2SampleMaxGrade)}</td>
              <td>能推进，但不建议直接按S级样板投入</td>
            </tr>
          </tbody>
        </table>
      `)}
    `);
  }

  function renderScoringSettings() {
    const scoring = data.rules.scoring;
    scoring.stageWeights = scoring.stageWeights || { T0: 50, T1: 45, T2: 5 };
    const stageWeightTotal = ["T0", "T1", "T2"].reduce((sum, key) => sum + Number(scoring.stageWeights[key] || 0), 0);
    const scoreOptionBlock = (key) => {
      const group = scoring[key];
      return `<div class="score-config-block">
        <h3>${escapeHtml(group.label)}${group.max !== undefined ? `<small>满分 ${escapeHtml(group.max)}</small>` : ""}</h3>
        ${ruleActions(`scoring.${key}.options`, "新增选项")}
        ${group.options.map((option, index) => `
          <label class="score-option-row">
            ${settingText(`scoring.${key}.options.${index}.label`, option.label)}
            ${settingInput(`scoring.${key}.options.${index}.score`, option.score, "0.1")}
            ${ruleDeleteButton(`scoring.${key}.options`, index)}
          </label>
        `).join("")}
      </div>`;
    };
    const t0Groups = ["scenicType", "tileRelevance", "commemorationMind", "youngSpread", "culturalEndorsement"];
    const t1OperationGroups = ["location", "store", "display", "businessTerms", "cooperationEfficiency"];
    const t2Groups = ["officialCooperation", "coBrandAuth", "marketingResources", "decorationResources", "manpowerResources", "officialTrafficResources"];
    return settingsSection("scoring", `
      ${settingsSubsection("二级 1", "T0/T1/T2 大类权重", `当前输入合计 ${stageWeightTotal}；系统会按相对权重自动折算为100分，默认 T0=50、T1=45、T2=5`, `
        <div class="settings-grid">
          ${field("T0 文化适配权重", settingInput("scoring.stageWeights.T0", scoring.stageWeights.T0, "1", "0"), "天然适不适合卖瓦片文创")}
          ${field("T1 商业转化权重", settingInput("scoring.stageWeights.T1", scoring.stageWeights.T1, "1", "0"), "能不能卖、能不能管、能不能复盘")}
          ${field("T2 官方资源权重", settingInput("scoring.stageWeights.T2", scoring.stageWeights.T2, "1", "0"), "能不能做样板、联名和放大")}
        </div>
      `)}
      ${settingsSubsection("二级 2", "T0 文化与客群适配", "判断这个点位是否天然适合“一片瓦，记住一座城”；下方为组内分，最终折算进T0权重", `
        <div class="score-config">${t0Groups.map(scoreOptionBlock).join("")}</div>
      `)}
      ${settingsSubsection("二级 3", "T1 公开基础与商业转化", "公开基础数据只做初筛；店位、店型、空间、商务和态度由销售填报；下方为组内分，最终折算进T1权重", `
        <div class="score-config">
          <div class="score-config-block">
            <h3>${escapeHtml(scoring.visitors.label)}<small>满分 ${escapeHtml(scoring.visitors.max)}</small></h3>
            ${ruleActions("scoring.visitors.thresholds", "新增客流档")}
            ${scoring.visitors.thresholds.map((item, index) => `
              <label class="score-option-row threshold-row">
                ${settingText(`scoring.visitors.thresholds.${index}.label`, item.label)}
                ${settingInput(`scoring.visitors.thresholds.${index}.min`, item.min, "1", "0")}
                ${settingInput(`scoring.visitors.thresholds.${index}.score`, item.score, "0.1")}
                ${ruleDeleteButton("scoring.visitors.thresholds", index)}
              </label>
            `).join("")}
          </div>
          <div class="score-config-block">
            <h3>${escapeHtml(scoring.ticket.label)}<small>满分 ${escapeHtml(scoring.ticket.max)}</small></h3>
            <label><span>免费</span>${settingInput("scoring.ticket.freeScore", scoring.ticket.freeScore, "0.1")}</label>
            ${ruleActions("scoring.ticket.thresholds", "新增票价档")}
            ${scoring.ticket.thresholds.map((item, index) => `
              <label class="score-option-row threshold-row">
                ${settingText(`scoring.ticket.thresholds.${index}.label`, item.label)}
                ${settingInput(`scoring.ticket.thresholds.${index}.min`, item.min, "1", "0")}
                ${settingInput(`scoring.ticket.thresholds.${index}.score`, item.score, "0.1")}
                ${ruleDeleteButton("scoring.ticket.thresholds", index)}
              </label>
            `).join("")}
          </div>
          ${t1OperationGroups.map(scoreOptionBlock).join("")}
        </div>
      `)}
      ${settingsSubsection("二级 4", "T2 官方资源与授权", "官方合作、联名授权、营销资源、装补、人力和导流资源；下方为组内分，最终折算进T2权重", `
        <div class="score-config">${t2Groups.map(scoreOptionBlock).join("")}</div>
      `)}
      ${settingsSubsection("二级 5", "红线否决项", "销售勾选红线后，评级会被压低或直接提示不建议推进", `
        ${ruleActions("scoring.vetoRules", "新增红线")}
        <table class="config-table">
          <thead><tr><th>红线键</th><th>销售端显示文案</th><th>操作</th></tr></thead>
          <tbody>${(scoring.vetoRules || []).map((item, index) => `
            <tr>
              <td>${settingText(`scoring.vetoRules.${index}.key`, item.key)}</td>
              <td>${settingText(`scoring.vetoRules.${index}.label`, item.label)}</td>
              <td>${ruleDeleteButton("scoring.vetoRules", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
    `);
  }

  function renderPurchaseSettings() {
    return settingsSection("purchase", `
      ${settingsSubsection("二级 1", "单款采购阶梯", "只按单款采购数量计算折扣，不再区分产品大类和产品类型", `
        ${ruleActions("purchaseTiers", "新增数量阶梯")}
        <table class="config-table wide">
          <thead><tr><th>数量下限</th><th>数量上限</th><th>阶梯</th><th>折扣系数</th><th>启用</th><th>操作</th></tr></thead>
          <tbody>${data.rules.purchaseTiers.map((tier, index) => `
            <tr>
              <td>${settingInput(`purchaseTiers.${index}.minQty`, tier.minQty, "1", "0")}</td>
              <td>${settingInput(`purchaseTiers.${index}.maxQty`, tier.maxQty, "1", "0")}</td>
              <td>${settingText(`purchaseTiers.${index}.name`, tier.name)}</td>
              <td>${settingInput(`purchaseTiers.${index}.discount`, tier.discount, "0.01", "0")}</td>
              <td><input type="checkbox" ${tier.enabled ? "checked" : ""} data-rule-path="purchaseTiers.${index}.enabled"></td>
              <td>${ruleDeleteButton("purchaseTiers", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
      ${settingsSubsection("二级 2", "总采政策", "根据整单总采购量给出物料、样品、返利或专项政策", `
        ${ruleActions("totalPurchasePolicies", "新增总采政策")}
        <table class="config-table">
          <thead><tr><th>总量下限</th><th>总量上限</th><th>政策名称</th><th>执行动作</th><th>操作</th></tr></thead>
          <tbody>${data.rules.totalPurchasePolicies.map((item, index) => `
            <tr>
              <td>${settingInput(`totalPurchasePolicies.${index}.minQty`, item.minQty, "1", "0")}</td>
              <td>${settingInput(`totalPurchasePolicies.${index}.maxQty`, item.maxQty, "1", "0")}</td>
              <td>${settingText(`totalPurchasePolicies.${index}.name`, item.name)}</td>
              <td>${settingText(`totalPurchasePolicies.${index}.action`, item.action)}</td>
              <td>${ruleDeleteButton("totalPurchasePolicies", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
    `);
  }

  function renderCommissionSettings() {
    return settingsSection("commission", `
      ${settingsSubsection("二级 1", "寄售回款提成", "保证金寄售和普通寄售统一按上线后6个月内最高3个月销售回款额计提", `
        <div class="settings-grid">
          ${field("寄售基础提成率", settingInput("consignmentCommissionBaseRate", data.rules.consignmentCommissionBaseRate, "0.01", "0"), "标准条件：最高3个月回款额-本点位商务成本")}
          ${field("商务提升激励比例", settingInput("consignmentCommissionUpliftRate", data.rules.consignmentCommissionUpliftRate, "0.01", "0"), "高于标准商务条件部分")}
        </div>
      `)}
      ${settingsSubsection("二级 2", "采购回款提成阶梯", "采购按单次采购回款额匹配阶梯；老客户复购再乘以客户系数", `
        <div class="settings-grid">
          ${field("老客户提成系数", settingInput("repeatCustomerFactor", data.rules.repeatCustomerFactor, "0.01", "0"), "新客户=100%，老客户按此系数")}
        </div>
        ${ruleActions("purchaseCommissionTiers", "新增采购提成阶梯")}
        <table class="config-table">
          <thead><tr><th>回款下限</th><th>回款上限</th><th>提点比例</th><th>阶梯名称</th><th>操作</th></tr></thead>
          <tbody>${data.rules.purchaseCommissionTiers.map((item, index) => `
            <tr>
              <td>${settingInput(`purchaseCommissionTiers.${index}.minAmount`, item.minAmount, "100", "0")}</td>
              <td>${settingInput(`purchaseCommissionTiers.${index}.maxAmount`, item.maxAmount, "100", "0")}</td>
              <td>${settingInput(`purchaseCommissionTiers.${index}.rate`, item.rate, "0.01", "0")}</td>
              <td>${settingText(`purchaseCommissionTiers.${index}.name`, item.name)}</td>
              <td>${ruleDeleteButton("purchaseCommissionTiers", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
      ${settingsSubsection("二级 3", "拓展奖金", "新点位拓展奖金统一放在提成域，不再放在评级域", `
        ${expansionBonusTable()}
      `)}
      ${settingsSubsection("二级 4", "数据质量与回款风控", "用于核算风险提示，不参与V5回款提成主公式", `
        ${objectFactorTable("dataQualityFactors", "数据质量", "系数", "新增数据质量")}
        ${objectFactorTable("paymentFactors", "回款账期", "系数", "新增账期")}
        ${ruleActions("depositFactors", "新增保证金档")}
        <table class="config-table">
          <thead><tr><th>保证金覆盖率下限</th><th>系数</th><th>操作</th></tr></thead>
          <tbody>${data.rules.depositFactors.map((item, index) => `
            <tr>
              <td>${settingInput(`depositFactors.${index}.minCoverage`, item.minCoverage, "0.01", "0")}</td>
              <td>${settingInput(`depositFactors.${index}.factor`, item.factor, "0.1", "0")}</td>
              <td>${ruleDeleteButton("depositFactors", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
    `);
  }

  function renderSellThroughSettings() {
    return settingsSection("sellThrough", `
      ${settingsSubsection("二级 1", "寄售动销激励", "按预计月销规模调低寄售结算上限或给出样板激励", `
        ${ruleActions("consignmentIncentives", "新增寄售激励")}
        <table class="config-table">
          <thead><tr><th>月销下限</th><th>月销上限</th><th>结算下调</th><th>激励名称</th><th>操作</th></tr></thead>
          <tbody>${data.rules.consignmentIncentives.map((item, index) => `
            <tr>
              <td>${settingInput(`consignmentIncentives.${index}.minSales`, item.minSales, "1", "0")}</td>
              <td>${settingInput(`consignmentIncentives.${index}.maxSales`, item.maxSales, "1", "0")}</td>
              <td>${settingInput(`consignmentIncentives.${index}.decrease`, item.decrease, "0.01", "0")}</td>
              <td>${settingText(`consignmentIncentives.${index}.name`, item.name)}</td>
              <td>${ruleDeleteButton("consignmentIncentives", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
      ${settingsSubsection("二级 2", "动销评级", "按售罄率判断优秀、健康、观察、低效和无效，并给出复盘动作", `
        ${ruleActions("sellThroughFactors", "新增动销档")}
        <table class="config-table">
          <thead><tr><th>动销率下限</th><th>评级状态</th><th>动销系数</th><th>处理建议</th><th>操作</th></tr></thead>
          <tbody>${data.rules.sellThroughFactors.map((item, index) => `
            <tr>
              <td>${settingInput(`sellThroughFactors.${index}.minRate`, item.minRate, "0.01", "0")}</td>
              <td>${settingText(`sellThroughFactors.${index}.status`, item.status)}</td>
              <td>${settingInput(`sellThroughFactors.${index}.factor`, item.factor, "0.1", "0")}</td>
              <td>${settingText(`sellThroughFactors.${index}.action`, item.action)}</td>
              <td>${ruleDeleteButton("sellThroughFactors", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
    `);
  }

  function skuMetaNote() {
    const meta = skuData.meta || {};
    const syncedAt = meta.syncedAt ? String(meta.syncedAt).replace("T", " ").replace("+08:00", "") : "未同步";
    return `<section class="sku-source-note">
      <strong>SKU总表</strong>
      <span>${escapeHtml(meta.sourceTitle || "飞书SKU总表")} · ${escapeHtml(meta.rowCount || 0)}条SKU · ${escapeHtml(meta.categoryCount || 0)}个产品类别 · 产品图${escapeHtml(meta.productImageCount || 0)}张 · 69码图${escapeHtml(meta.barcodeImageCount || 0)}张 · 更新 ${escapeHtml(syncedAt)}</span>
    </section>`;
  }

  function skuSearchText(item) {
    return [
      item.id,
      item.productCode,
      item.name,
      item.productSeries,
      item.styleRegion,
      item.spec,
      item.skuProductType,
      item.craftType,
      item.barcode,
      item.categoryName
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function filteredSkuRows() {
    const keyword = skuSearch.trim().toLowerCase();
    return (skuData.rows || []).filter((item) => {
      const matchesCategory = !skuCategoryFilter || item.categoryKey === skuCategoryFilter;
      const matchesSeries = !skuSeriesFilter || item.productSeries === skuSeriesFilter;
      const matchesSpec = !skuSpecFilter || item.spec === skuSpecFilter;
      const matchesType = !skuTypeFilter || item.skuProductType === skuTypeFilter;
      const matchesCraft = !skuCraftFilter || item.craftType === skuCraftFilter;
      const matchesRegion = !skuRegionFilter || item.styleRegion === skuRegionFilter;
      const matchesRetail = !skuRetailFilter || String(item.suggestedRetail || "") === skuRetailFilter;
      const matchesKeyword = !keyword || skuSearchText(item).includes(keyword);
      return matchesCategory && matchesSeries && matchesSpec && matchesType && matchesCraft && matchesRegion && matchesRetail && matchesKeyword;
    });
  }

  function skuOptionList(field, label) {
    const values = Array.from(new Set((skuData.rows || []).map((item) => item[field]).filter((value) => value !== undefined && value !== null && String(value).trim() !== "")));
    values.sort((left, right) => String(left).localeCompare(String(right), "zh-CN", { numeric: true }));
    return [{ value: "", label }].concat(values.map((value) => ({ value: String(value), label: String(value) })));
  }

  function skuImage(src, alt, kind) {
    if (!src) return `<span class="sku-image-empty">未同步</span>`;
    return `<img class="sku-image ${kind === "barcode" ? "barcode" : ""}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy">`;
  }

  function renderSkuCategories() {
    const categories = skuData.categories || [];
    const cards = categories.map((category) => `
      <article class="sku-category-card">
        <div>
          <span>${escapeHtml(category.productSeries)}</span>
          <strong>${escapeHtml(category.spec)} · ${escapeHtml(category.skuProductType)}</strong>
          <small>${escapeHtml(category.craftType)} · ${escapeHtml(category.productClass)} · ${escapeHtml(category.count)}个SKU</small>
        </div>
        <b>${escapeHtml(category.retailRange ? `${category.retailRange}元` : "未定价")}</b>
        <p>${escapeHtml((category.sampleNames || []).join("、"))}</p>
        <button type="button" data-sku-category="${escapeHtml(category.key)}">查看SKU</button>
      </article>
    `).join("");
    return `
      ${skuMetaNote()}
      <div class="sku-category-grid">${cards || `<p class="empty">暂无SKU类别数据</p>`}</div>
    `;
  }

  function renderSkuTable() {
    const categoryOptions = [{ value: "", label: "全部产品类别" }].concat((skuData.categories || []).map((category) => ({
      value: category.key,
      label: `${category.productSeries} / ${category.spec} / ${category.skuProductType} / ${category.craftType}`
    })));
    const rows = filteredSkuRows();
    const tableRows = rows.map((item) => `
      <tr>
        <td><strong>${escapeHtml(item.id)}</strong><br><small>${escapeHtml(item.productCode || "")}</small></td>
        <td>${skuImage(item.productImagePath, `${item.name} 产品图`, "product")}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.productSeries)}<br><small>${escapeHtml(item.styleRegion || "")}</small></td>
        <td>${escapeHtml(item.spec)}<br><small>${escapeHtml(item.skuProductType)} · ${escapeHtml(item.craftType)}</small></td>
        <td>${escapeHtml(item.barcode || "")}</td>
        <td>${skuImage(item.barcodeImagePath, `${item.name} 69码`, "barcode")}</td>
        <td>${item.suggestedRetail ? money(item.suggestedRetail) : "-"}</td>
        <td>${escapeHtml(item.stockInDate || item.launchDate || "")}</td>
      </tr>
    `).join("");
    return `
      ${skuMetaNote()}
      <div class="sku-toolbar">
        <input type="search" id="skuSearchInput" value="${escapeHtml(skuSearch)}" placeholder="搜索SKU名称、编号、地区、69码、产品类别">
        ${selectInput(skuCategoryFilter, categoryOptions, 'id="skuCategoryFilter"')}
        ${selectInput(skuSeriesFilter, skuOptionList("productSeries", "全部产品系列"), 'id="skuSeriesFilter"')}
        ${selectInput(skuSpecFilter, skuOptionList("spec", "全部规格"), 'id="skuSpecFilter"')}
        ${selectInput(skuTypeFilter, skuOptionList("skuProductType", "全部产品类型"), 'id="skuTypeFilter"')}
        ${selectInput(skuCraftFilter, skuOptionList("craftType", "全部工艺类型"), 'id="skuCraftFilter"')}
        ${selectInput(skuRegionFilter, skuOptionList("styleRegion", "全部款式/地区"), 'id="skuRegionFilter"')}
        ${selectInput(skuRetailFilter, skuOptionList("suggestedRetail", "全部价位"), 'id="skuRetailFilter"')}
        <button type="button" id="clearSkuFiltersBtn">清空筛选</button>
      </div>
      <div class="sku-count">当前显示 ${escapeHtml(rows.length)} / ${escapeHtml((skuData.rows || []).length)} 条</div>
      <div class="sku-table-wrap">
        <table class="config-table sku-table">
          <thead><tr><th>SKU/编号</th><th>产品图</th><th>产品名称</th><th>系列/地区</th><th>规格/类型/工艺</th><th>69码</th><th>69码图</th><th>建议零售价</th><th>入库日期</th></tr></thead>
          <tbody>${tableRows || `<tr><td colspan="9">暂无匹配SKU</td></tr>`}</tbody>
        </table>
      </div>
    `;
  }

  function renderMeasuredProducts() {
    const rows = data.products.map((product) => {
      const result = XJCore.calculate(data, { productId: product.id, scenario: state.scenario, channel: state.channel });
      return `<article class="library-row">
        <span class="product-id">${escapeHtml(product.id)}</span>
        <strong>${escapeHtml(product.name)}</strong>
        <span>${escapeHtml(product.spec)}</span>
        <span>${escapeHtml(product.bodyType)}</span>
        <b>${money(result.cost.totalCost)}</b>
        <b>${money(result.cost.minRetail)}</b>
        <div class="row-actions">
          <button type="button" data-use-product="${escapeHtml(product.id)}">选用</button>
          <button type="button" data-edit-product="${escapeHtml(product.id)}">编辑</button>
          <button type="button" data-copy-product="${escapeHtml(product.id)}">复制</button>
          <button type="button" data-delete-product="${escapeHtml(product.id)}">删除</button>
        </div>
      </article>`;
    }).join("");
    return `
      <div class="library-toolbar">
        <button type="button" class="primary" id="addProductBtn">新增产品</button>
        <button type="button" id="exportProductsBtn">导出产品库</button>
        <label class="import-label">
          导入产品库
          <input type="file" id="importProductsInput" accept="application/json,.json">
        </label>
        <button type="button" id="resetProductsBtn">恢复默认产品</button>
      </div>
      ${renderProductEditor()}
      <div class="library-table-head">
        <span>编码</span>
        <span>名称</span>
        <span>规格</span>
        <span>类型</span>
        <span>成本</span>
        <span>最低价带</span>
        <span>操作</span>
      </div>
      <div class="library-items">${rows}</div>`;
  }

  function renderProductLibrary() {
    const body = activeProductPanel === "sku"
      ? renderSkuTable()
      : activeProductPanel === "measured"
        ? renderMeasuredProducts()
        : renderSkuCategories();
    qs("#productLibrary").innerHTML = `
      <nav class="secondary-tabs scenario-subtabs product-subtabs" aria-label="产品库子类目">
        <button type="button" data-product-panel="category">产品类别</button>
        <button type="button" data-product-panel="sku">SKU总表</button>
        <button type="button" data-product-panel="measured">测算产品</button>
      </nav>
      <div class="product-panel-view">${body}</div>`;
    bindProductImport();
  }

  function renderProductEditor() {
    if (!editingProductId) {
      return `<section class="product-editor collapsed">
        <div>
          <h3>产品编辑</h3>
          <strong>未选择产品</strong>
        </div>
      </section>`;
    }

    const product = data.products.find((item) => item.id === editingProductId) || blankProduct({ id: editingProductId });
    const componentFields = Object.entries(XJCore.componentLabels).map(([key, label]) => (
      field(label, `<input type="number" step="0.1" min="0" value="${escapeHtml(product.components[key] || 0)}" data-product-component="${escapeHtml(key)}">`)
    )).join("");
    const costBandRows = product.costPriceBands.map(productCostBandRow).join("");
    const scenarioBands = alignScenarioBandsWithGrades(product.scenarioPriceBands);
    const scenarioBandRows = scenarioBands.map(productScenarioBandRow).join("");

    return `<section class="product-editor">
      <div class="section-title">
        <h3>${editingProductId === "__new__" ? "新增产品" : "编辑产品"}</h3>
        <div class="row-actions">
          <button type="button" class="primary" id="saveProductBtn">保存产品</button>
          <button type="button" id="cancelProductEditBtn">取消</button>
        </div>
      </div>
      <div class="product-form-grid">
        ${productField("id", product.id === "__new__" ? nextProductId() : product.id, "产品编码")}
        ${productField("name", product.name, "产品名称")}
        ${productField("structure", product.structure, "产品结构")}
        ${productField("spec", product.spec, "规格/口径")}
        ${productField("bodyType", product.bodyType, "本体类型")}
        ${productSelect("productClass", product.productClass, "产品大类", ["大瓦", "小瓦"])}
        ${productSelect("productType", product.productType, "产品类型", ["手绘款", "工艺款"])}
        ${productField("carrier", product.carrier, "载体类型")}
        ${productField("packageType", product.packageType, "包装类型")}
        ${productField("note", product.note, "备注")}
      </div>
      <div class="product-component-grid">${componentFields}</div>
      <div class="product-price-grid">
        <section class="product-price-block">
          <div class="product-price-head">
            <div>
              <h4>产品成本价带</h4>
              <p>该产品按总成本反推最低建议零售价</p>
            </div>
            <div class="row-actions">
              <button type="button" id="resetProductCostBandsBtn">按产品类型重置</button>
              <button type="button" class="rule-add-btn" id="addProductCostBandBtn">新增价带</button>
            </div>
          </div>
          <table class="config-table product-band-table">
            <thead><tr><th>成本上限</th><th>建议零售价</th><th>标签</th><th>操作</th></tr></thead>
            <tbody id="productCostBandRows">${costBandRows}</tbody>
          </table>
        </section>
        <section class="product-price-block">
          <div class="product-price-head">
            <div>
              <h4>产品场景价带</h4>
              <p>场景分线跟随规则参数里的评级标准，不在产品里单独填写</p>
            </div>
            <div class="row-actions">
              <button type="button" id="resetProductScenarioBandsBtn">按产品类型重置</button>
              <button type="button" class="rule-add-btn" id="addProductScenarioBandBtn">新增价带</button>
            </div>
          </div>
          <table class="config-table product-band-table">
            <thead><tr><th>评级分线</th><th>建议零售价</th><th>标签</th><th>操作</th></tr></thead>
            <tbody id="productScenarioBandRows">${scenarioBandRows}</tbody>
          </table>
        </section>
      </div>
    </section>`;
  }

  function productFromEditor() {
    const fields = {};
    qsa("[data-product-field]").forEach((input) => {
      fields[input.dataset.productField] = input.value.trim();
    });
    const components = {};
    qsa("[data-product-component]").forEach((input) => {
      components[input.dataset.productComponent] = Number(input.value);
    });
    const costPriceBands = qsa("[data-product-cost-band]").map((row) => ({
      maxCost: Number(qs('[data-product-cost-band-field="maxCost"]', row).value),
      retail: Number(qs('[data-product-cost-band-field="retail"]', row).value),
      label: qs('[data-product-cost-band-field="label"]', row).value.trim()
    }));
    const scenarioPriceBands = qsa("[data-product-scenario-band]").map((row) => ({
      minScore: Number(qs('[data-product-scenario-band-field="minScore"]', row).value),
      grade: qs('[data-product-scenario-band-field="grade"]', row).value.trim(),
      retail: Number(qs('[data-product-scenario-band-field="retail"]', row).value),
      label: qs('[data-product-scenario-band-field="label"]', row).value.trim()
    }));
    return normalizeProduct({ ...fields, components, costPriceBands, scenarioPriceBands });
  }

  function addProductPriceBand(kind) {
    if (kind === "cost") {
      const body = qs("#productCostBandRows");
      if (body) body.insertAdjacentHTML("beforeend", productCostBandRow({ maxCost: 30, retail: 89, label: "新成本价带" }));
      return;
    }
    const body = qs("#productScenarioBandRows");
    const index = body ? body.children.length : 0;
    const grade = ruleGradeOrder()[index] || "";
    if (body) body.insertAdjacentHTML("beforeend", productScenarioBandRow({ grade, minScore: gradeThreshold(grade, 0), retail: 79, label: grade ? `${grade}级场景价带` : "新场景价带" }, index));
  }

  function deleteProductPriceBand(button) {
    const row = button.closest("tr");
    const body = row && row.parentElement;
    if (!row || !body) return;
    if (body.children.length <= 1) {
      alert("至少保留一条价带。");
      return;
    }
    row.remove();
  }

  function resetProductPriceBands(kind) {
    const draft = productFromEditor();
    if (kind === "cost") {
      const body = qs("#productCostBandRows");
      if (body) body.innerHTML = XJCore.defaultCostPriceBandsForProduct(data.rules, draft).map(productCostBandRow).join("");
      return;
    }
    const body = qs("#productScenarioBandRows");
    if (body) body.innerHTML = XJCore.defaultScenarioPriceBandsForProduct(data.rules, draft).map(productScenarioBandRow).join("");
  }

  function saveProductFromEditor(options = {}) {
    const product = productFromEditor();
    if (!product.id || !product.name) {
      alert("产品编码和产品名称不能为空。");
      return false;
    }
    const duplicate = data.products.find((item) => item.id === product.id && item.id !== editingProductId);
    if (duplicate) {
      alert("产品编码已存在，请换一个编码。");
      return false;
    }

    const existingProduct = data.products.find((item) => item.id === editingProductId);
    if (existingProduct) {
      window.ProductProvider.saveProduct(product, existingProduct.id);
      data.products = normalizeProducts(window.ProductProvider.fetchProducts());
      if (state.productId === existingProduct.id) state.productId = product.id;
    } else {
      window.ProductProvider.saveProduct(product);
      data.products = normalizeProducts(window.ProductProvider.fetchProducts());
      state.productId = product.id;
    }
    editingProductId = product.id;
    activeProductPanel = "measured";
    persistState();
    renderApp();
    setActiveView("products");
    setActiveProductPanel("measured");
    if (options.flash !== false) flashContextToolbar("已保存当前产品");
    return true;
  }

  function deleteProduct(productId) {
    if (data.products.length <= 1) {
      alert("至少保留一个产品。");
      return;
    }
    const product = data.products.find((item) => item.id === productId);
    if (!product) return;
    if (!confirm(`删除 ${product.id} ${product.name}？`)) return;
    data.products = normalizeProducts(window.ProductProvider.deleteProductById(productId));
    if (state.productId === productId) {
      state.productId = data.products[0].id;
    }
    if (editingProductId === productId) editingProductId = null;
    persistState();
    renderApp();
    setActiveView("products");
  }

  function copyProduct(productId) {
    const product = data.products.find((item) => item.id === productId);
    if (!product) return;
    const copied = normalizeProduct({
      ...XJCore.clone(product),
      id: nextProductId(),
      name: `${product.name} 副本`
    });
    window.ProductProvider.saveProduct(copied);
    data.products = normalizeProducts(window.ProductProvider.fetchProducts());
    editingProductId = copied.id;
    activeProductPanel = "measured";
    renderApp();
    setActiveView("products");
  }

  function resetProducts() {
    if (!confirm("恢复默认产品库？现有本地新增和修改会被覆盖。")) return;
    replaceProducts(window.DEFAULT_DATA.products);
    state.productId = data.products[0].id;
    editingProductId = null;
    persistState();
    renderApp();
    setActiveView("products");
  }

  function importProducts(imported) {
    const products = Array.isArray(imported) ? imported : imported.products;
    if (!Array.isArray(products) || !products.length) {
      alert("产品库 JSON 中没有可用产品。");
      return;
    }
    replaceProducts(products);
    if (!data.products.some((product) => product.id === state.productId)) {
      state.productId = data.products[0].id;
    }
    editingProductId = null;
    persistState();
    renderApp();
    setActiveView("products");
  }

  function bindProductImport() {
    const input = qs("#importProductsInput");
    if (!input) return;
    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        importProducts(JSON.parse(await file.text()));
      } catch (error) {
        alert("产品库 JSON 解析失败。");
        console.warn(error);
      }
      event.target.value = "";
    });
  }

  function importScenicSpots(imported) {
    const scenicSpots = Array.isArray(imported) ? imported : imported.scenicSpots;
    if (!Array.isArray(scenicSpots) || !scenicSpots.length) {
      alert("景区库 JSON 中没有可用景区记录。");
      return;
    }
    replaceScenicSpots(scenicSpots);
    scenicVisibleLimit = 80;
    renderApp();
    setActiveView("scenic-db");
  }

  function bindScenicImport() {
    const input = qs("#importScenicSpotsInput");
    if (!input) return;
    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        importScenicSpots(JSON.parse(await file.text()));
      } catch (error) {
        alert("景区库 JSON 解析失败。");
        console.warn(error);
      }
      event.target.value = "";
    });
  }

  function resetScenicSpots() {
    if (!confirm("恢复默认景区库？现有本地新增和修改会被覆盖。")) return;
    replaceScenicSpots(window.DEFAULT_DATA.scenicSpots || []);
    clearScenicFilters();
    renderApp();
    setActiveView("scenic-db");
  }

  function clearScenicFilters() {
    scenicSearch = "";
    scenicTypeFilter = "";
    scenicGradeFilter = "";
    scenicProvinceFilter = "";
    scenicPriorityFilter = "";
    scenicT0Filter = "";
    scenicTileFilter = "";
    scenicDataStatusFilter = "";
    scenicVerificationFilter = "";
    scenicSortMode = "scoreDesc";
    scenicVisibleLimit = 80;
    if (scenicSearchRenderTimer) {
      window.clearTimeout(scenicSearchRenderTimer);
      scenicSearchRenderTimer = 0;
    }
    renderScenicDatabase();
  }

  function replaceFulfillmentRecords(recordsInput) {
    data.fulfillmentRecords = normalizeFulfillmentRecords(recordsInput);
    persistFulfillmentRecords();
    return data.fulfillmentRecords;
  }

  function importFulfillmentRecords(imported) {
    const recordsInput = Array.isArray(imported) ? imported : (imported.fulfillmentRecords || imported.records);
    if (!Array.isArray(recordsInput) || !recordsInput.length) {
      alert("落地台账 JSON 中没有可用点位记录。");
      return;
    }
    replaceFulfillmentRecords(recordsInput);
    renderApp();
    setActiveView("fulfillment");
    flashContextToolbar("已导入落地台账");
  }

  function resetFulfillmentRecords() {
    if (!confirm("恢复默认落地台账？现有销售补录会被覆盖。")) return;
    replaceFulfillmentRecords(defaultFulfillmentRecords());
    clearFulfillmentFilters();
    renderApp();
    setActiveView("fulfillment");
  }

  function clearFulfillmentFilters() {
    fulfillmentSearch = "";
    fulfillmentStatusFilter = "";
    fulfillmentTypeFilter = "";
    fulfillmentReceiptFilter = "";
    fulfillmentShelfFilter = "";
    fulfillmentIssueFilter = "";
    if (fulfillmentSearchRenderTimer) {
      window.clearTimeout(fulfillmentSearchRenderTimer);
      fulfillmentSearchRenderTimer = 0;
    }
    renderFulfillment();
  }

  function updateFulfillmentRecordField(target) {
    const record = data.fulfillmentRecords.find((item) => item.id === target.dataset.fulfillmentId);
    if (!record) return;
    if (!accountCanModuleAction("fulfillment", "edit")) {
      alert("当前账号没有编辑点位落地权限。");
      renderFulfillment();
      return;
    }
    if (!fulfillmentVisibleToAccount(record)) {
      alert("当前账号不能编辑这条点位落地记录。");
      renderFulfillment();
      return;
    }
    const fieldName = target.dataset.fulfillmentField;
    record[fieldName] = target.value;
    if (fieldName === "salesOwner") {
      const owner = accountByIdentity("", target.value);
      if (owner) {
        record.ownerId = owner.id;
        record.ownerName = owner.name;
      }
    }
    record.salesUpdatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    persistFulfillmentRecords();
  }

  function recordKey(record, index) {
    return record.id || `${record.time || "legacy"}-${record.spotName || "record"}-${index}`;
  }

  function opportunityStatusOptions() {
    return ["公海线索", "已认领", "报备待审", "报备驳回/补充材料", "报备通过", "商务洽谈", "条件审批", "已签约/待落地", "运营中", "战败/退回公海", "冻结/无效"];
  }

  function opportunityStageOptions() {
    return ["线索确认", "已触达", "需求确认", "方案/报价", "商务洽谈", "合同/打样", "发货落地", "动销复盘", "退回公海"];
  }

  function opportunityContactRoleOptions() {
    return ["待确认", "官方/管委会", "运营方", "门店店主", "渠道中间人", "品牌/招商负责人", "其他"];
  }

  function followupTypeOptions() {
    return ["微信沟通", "电话沟通", "现场拜访", "线上会议", "发送资料", "报价/方案", "合同推进", "发货/上架", "动销复盘", "其他"];
  }

  function dateAfterDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function scenarioPointScope(scenario, fallbackName = "") {
    if (!scenario) return fallbackName || "待细化到具体点位";
    return [
      scenario.scenicParentName,
      scenario.scenicSubAreaName,
      scenario.spotName
    ].filter(Boolean).join(" / ") || fallbackName || "待细化到具体点位";
  }

  function recordInputs(record) {
    if (record.inputs) return normalizeState(record.inputs);
    if (record.state) return normalizeState(record.state);
    return null;
  }

  function ensureOpportunityFields(record, result = null) {
    const inputs = result ? result.inputs : recordInputs(record);
    const scenario = inputs && inputs.scenario ? inputs.scenario : null;
    if (!record.opportunityStatus) record.opportunityStatus = "公海线索";
    if (!record.opportunityStage) record.opportunityStage = record.opportunityStatus === "公海线索" ? "线索确认" : "商务洽谈";
    if (!record.opportunityOwner) record.opportunityOwner = "";
    if (!record.opportunityOwnerId) record.opportunityOwnerId = "";
    if (!record.opportunityOwnerRole) record.opportunityOwnerRole = "";
    if (!record.opportunityTeam) record.opportunityTeam = "";
    if (!record.opportunityPointScope) record.opportunityPointScope = scenarioPointScope(scenario, record.spotName);
    if (!record.opportunityContactRole) record.opportunityContactRole = "待确认";
    if (!record.opportunityContactName) record.opportunityContactName = "";
    if (!record.opportunityLastContactAt) record.opportunityLastContactAt = "";
    if (!record.opportunityNextAction) record.opportunityNextAction = "";
    if (!record.opportunityNextActionAt) record.opportunityNextActionAt = "";
    if (!record.opportunityEvidence) record.opportunityEvidence = "";
    if (!record.opportunityProtectionUntil) record.opportunityProtectionUntil = "";
    if (!record.opportunityUpdatedAt) record.opportunityUpdatedAt = "";
    if (!record.opportunityNote) record.opportunityNote = "";
    return record;
  }

  function isPublicOpportunity(record) {
    return ["公海线索", "战败/退回公海"].includes(record.opportunityStatus);
  }

  function opportunityScopePartsFromScenario(scenario = {}, fallbackName = "") {
    const parent = String(scenario.scenicParentName || "").trim();
    const subArea = String(scenario.scenicSubAreaName || "").trim();
    const spot = String(scenario.spotName || fallbackName || "").trim();
    const scope = scenarioPointScope({ scenicParentName: parent, scenicSubAreaName: subArea, spotName: spot }, spot);
    return {
      parent,
      subArea,
      spot,
      scope,
      parentKey: crmIdentityKey(parent),
      subAreaKey: crmIdentityKey(subArea),
      spotKey: crmIdentityKey(spot),
      scopeKey: crmIdentityKey(scope)
    };
  }

  function opportunityScopePartsFromRecord(record, result = null) {
    const inputs = result ? result.inputs : recordInputs(record);
    const scenario = inputs && inputs.scenario ? inputs.scenario : {};
    const fallbackName = record && (record.opportunityPointScope || record.spotName || "");
    const parts = opportunityScopePartsFromScenario(scenario, fallbackName);
    if (record && record.opportunityPointScope) {
      parts.scope = record.opportunityPointScope;
      parts.scopeKey = crmIdentityKey(record.opportunityPointScope);
    }
    if (record && record.spotName && !parts.spot) {
      parts.spot = record.spotName;
      parts.spotKey = crmIdentityKey(record.spotName);
    }
    return parts;
  }

  function opportunityScopeMatchKind(record, result) {
    if (!record || !result) return "";
    ensureOpportunityFields(record);
    const current = opportunityScopePartsFromScenario(result.inputs.scenario, result.inputs.scenario.spotName);
    const existing = opportunityScopePartsFromRecord(record);
    if (current.scopeKey && existing.scopeKey && current.scopeKey === existing.scopeKey) return "same";
    if (current.parentKey && existing.parentKey && current.parentKey === existing.parentKey) {
      if (current.subAreaKey && existing.subAreaKey) return current.subAreaKey === existing.subAreaKey ? "same" : "related";
      if (current.subAreaKey || existing.subAreaKey) return "related";
    }
    if (current.spotKey && existing.spotKey && current.spotKey === existing.spotKey) return "same";
    if (current.scopeKey && existing.scopeKey && (current.scopeKey.includes(existing.scopeKey) || existing.scopeKey.includes(current.scopeKey))) {
      return "related";
    }
    if (crmPointMatches(current.scope, existing.scope) || crmPointMatches(current.spot, existing.spot)) return "related";
    return "";
  }

  function opportunityCollisionForResult(result) {
    const matches = { same: [], related: [] };
    if (!result) return matches;
    records.forEach((record, index) => {
      if (!record || record.opportunityStatus === "冻结/无效") return;
      const kind = opportunityScopeMatchKind(record, result);
      if (!kind) return;
      matches[kind].push({ record, index, kind });
    });
    return matches;
  }

  function opportunityOwnerText(record) {
    const identity = ownerIdentityFromRow(record);
    return identity.name ? `${identity.name}${identity.team ? ` · ${identity.team}` : ""}` : "未分配";
  }

  function canMergeOpportunityForResult(record) {
    if (!record) return false;
    ensureOpportunityFields(record);
    if (isPublicOpportunity(record)) return accountCanModuleAction("opportunities", "edit");
    return accountCanEditOpportunity(record);
  }

  function saveCollisionHintText() {
    const blockMessage = scenarioSaveBlockMessage();
    if (blockMessage) return `${blockMessage}，保存按钮才会启用。`;
    const result = currentResult();
    const collision = opportunityCollisionForResult(result);
    const same = collision.same[0];
    if (same) {
      if (canMergeOpportunityForResult(same.record)) {
        return `已存在同点位机会“${escapeHtml(same.record.spotName || same.record.opportunityPointScope || "未命名点位")}”，保存会合并更新，不重复入库。`;
      }
      return "该点位已有受保护机会，保存时会拦截重复报备，请找主管协调归属。";
    }
    if (collision.related.length) {
      const relatedNames = collision.related.slice(0, 2).map((item) => item.record.opportunityPointScope || item.record.spotName || "关联点位").join("、");
      return `发现同父级/相邻点位：${escapeHtml(relatedNames)}。请确认已细化到子片区或具体门店后保存。`;
    }
    return `将以“${escapeHtml(currentAccountName())}”入库到我的点位机会，并同步生成/更新CRM客户客资。`;
  }

  function opportunityTone(record) {
    if (record.opportunityStatus === "公海线索") return "neutral";
    if (record.opportunityStatus === "已认领" || record.opportunityStatus === "报备待审") return "medium";
    if (record.opportunityStatus === "报备通过" || record.opportunityStatus === "商务洽谈" || record.opportunityStatus === "条件审批") return "mid-high";
    if (record.opportunityStatus === "已签约/待落地" || record.opportunityStatus === "运营中") return "strong";
    return "weak";
  }

  function opportunityMatchesView(record) {
    ensureOpportunityFields(record);
    if (activeRecordView === "history") return accountCanViewAll() || isPublicOpportunity(record) || accountMatchesRecord(record);
    if (activeRecordView === "pool") return isPublicOpportunity(record);
    if (activeRecordView === "mine") {
      if (!hasAccount()) return false;
      return accountOwnsRecord(record);
    }
    if (activeRecordView === "funnel") {
      if (accountCanViewAll()) return !isPublicOpportunity(record);
      return !isPublicOpportunity(record) && accountMatchesRecord(record);
    }
    return accountCanViewAll() || accountMatchesRecord(record);
  }

  function updateOpportunityProtection(record, days) {
    record.opportunityProtectionUntil = dateAfterDays(days);
    record.opportunityUpdatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  }

  function touchOpportunity(record) {
    record.opportunityUpdatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  }

  function updateRecordOpportunityField(target, options = {}) {
    const shouldLog = options.log !== false;
    const shouldRender = options.render === true;
    const index = Number(target.dataset.recordCrm);
    const key = target.dataset.recordField;
    const record = records[index];
    if (!record || !key) return;
    ensureOpportunityFields(record);
    if (!accountCanEditOpportunity(record) && !accountCanApprove()) {
      alert("当前账号没有权限编辑这条点位机会。");
      renderRecords();
      return;
    }
    const previous = Object.prototype.hasOwnProperty.call(target.dataset, "recordOriginal")
      ? target.dataset.recordOriginal
      : record[key];
    record[key] = target.value;
    if (key === "opportunityOwner") {
      const owner = accountByIdentity("", record.opportunityOwner);
      if (owner) {
        record.opportunityOwnerId = owner.id;
        record.opportunityTeam = owner.team;
      } else if (record.opportunityOwner === currentAccountName()) {
        record.opportunityOwnerId = currentAccount().id;
        record.opportunityTeam = currentAccount().team;
      }
    }
    touchOpportunity(record);
    persistRecords();
    if (shouldLog && ["opportunityStatus", "opportunityStage", "opportunityOwner", "opportunityNextAction", "opportunityNextActionAt", "opportunityProtectionUntil"].includes(key) && String(previous ?? "") !== String(target.value ?? "")) {
      appendCrmActivity({
        type: "机会跟进",
        title: "更新机会字段",
        detail: `${key}: ${previous || "空"} -> ${target.value || "空"}`,
        pointName: record.spotName || record.opportunityPointScope,
        recordId: record.id || "",
        targetType: "record",
        targetId: record.id || "",
        ownerId: record.opportunityOwnerId || record.accountId || "",
        ownerName: record.opportunityOwner || record.operatorName || "",
        tone: key === "opportunityStatus" ? "medium" : "neutral"
      });
      target.dataset.recordOriginal = String(target.value ?? "");
    }
    if (shouldRender) renderRecords();
    if (options.renderCrm !== false) renderCrmWorkspace();
  }

  function applyCurrentAccountToOpportunity(record) {
    const account = currentAccount();
    record.opportunityOwner = account.name;
    record.opportunityOwnerId = account.id;
    record.opportunityOwnerRole = account.role;
    record.opportunityTeam = account.team;
    if (!record.operatorName) record.operatorName = account.name;
    if (!record.accountId) record.accountId = account.id;
    if (!record.accountRole) record.accountRole = account.role;
    if (!record.accountTeam) record.accountTeam = account.team;
  }

  function recordPipelinePoint(record, result) {
    return result ? result.inputs.scenario.spotName : (record.spotName || record.opportunityPointScope || "未命名点位");
  }

  function crmOwnerFromRecord(record) {
    const owner = accountByIdentity(record.opportunityOwnerId || record.accountId, record.opportunityOwner || record.operatorName);
    return {
      ownerId: record.opportunityOwnerId || record.accountId || (owner ? owner.id : "") || currentAccount().id || "",
      ownerName: record.opportunityOwner || record.operatorName || (owner ? owner.name : "") || currentAccountName(),
      ownerTeam: record.opportunityTeam || record.accountTeam || (owner ? owner.team : "") || currentAccount().team || ""
    };
  }

  function crmCustomerStatusFromOpportunity(record) {
    const status = String(record && record.opportunityStatus || "");
    if (status.includes("签约") || status === "运营中") return "合作中";
    if (status.includes("商务") || status.includes("条件") || status.includes("报备通过")) return "商务中";
    if (status.includes("认领") || status.includes("报备")) return "评级中";
    return "新线索";
  }

  function ensureCrmCustomerForRecord(record, result) {
    const pointName = recordPipelinePoint(record, result);
    const owner = crmOwnerFromRecord(record);
    const scenario = result && result.inputs ? result.inputs.scenario : {};
    const scopeName = record.opportunityPointScope || scenarioPointScope(scenario, pointName);
    const existing = crmWorkspace.customers.find((customer) =>
      customer.id === record.customerId
      || crmPointMatches(customer.name, pointName)
      || crmPointMatches(customer.name, scopeName)
    );
    if (existing) {
      record.customerId = existing.id;
      existing.region = existing.region || scenario.city || "";
      existing.ownerId = existing.ownerId || owner.ownerId;
      existing.ownerName = existing.ownerName || owner.ownerName;
      existing.ownerTeam = existing.ownerTeam || owner.ownerTeam;
      existing.contactName = existing.contactName || record.opportunityContactName || "";
      existing.contactRole = existing.contactRole || record.opportunityContactRole || "待确认";
      existing.status = existing.status && existing.status !== "新线索" ? existing.status : crmCustomerStatusFromOpportunity(record);
      existing.nextAction = record.opportunityNextAction || existing.nextAction || "补齐合同主体和联系人";
      existing.nextActionAt = record.opportunityNextActionAt || existing.nextActionAt || crmDatePlusDays("", 3);
      existing.note = existing.note || record.opportunityNote || "";
      existing.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
      return existing;
    }
    const customer = {
      id: `CUST-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
      name: pointName,
      type: "景区/运营方",
      source: "点位机会生成",
      region: scenario.city || "",
      ...owner,
      contactName: record.opportunityContactName || "",
      contactRole: record.opportunityContactRole || "待确认",
      phone: "",
      wechat: "",
      status: crmCustomerStatusFromOpportunity(record),
      nextAction: record.opportunityNextAction || "补齐合同主体和联系人",
      nextActionAt: record.opportunityNextActionAt || crmDatePlusDays("", 3),
      note: record.opportunityNote || ""
    };
    crmWorkspace.customers.unshift(customer);
    record.customerId = customer.id;
    return customer;
  }

  function existingOpportunityForCustomer(customer) {
    if (!customer) return { record: null, index: -1 };
    const index = records.findIndex((record) =>
      record.customerId === customer.id
      || record.spotName === customer.name
      || record.opportunityPointScope === customer.name
    );
    return { record: index >= 0 ? records[index] : null, index };
  }

  function canAssignCustomerToCurrentAccount(customer) {
    if (!hasAccount() || !crmCanEditCollection("customers")) return false;
    const identity = ownerIdentityFromRow(customer);
    if (!identity.id && !identity.name) return true;
    if (accountOwnsIdentity(identity)) return true;
    return accountHasPermission("crm", "admin");
  }

  function applyCurrentAccountToCustomer(customer) {
    const account = currentAccount();
    customer.ownerId = account.id || "";
    customer.ownerName = account.name || "";
    customer.ownerTeam = account.team || "";
    if (!customer.status || customer.status === "新线索") customer.status = "已触达";
    if (!customer.nextAction) customer.nextAction = "3天内完成首次触达并补齐联系人/点位信息";
    if (!customer.nextActionAt || crmDateStatus(customer.nextActionAt).days < 0) customer.nextActionAt = crmDatePlusDays("", 3);
    customer.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  }

  function maybeSyncCustomerOwnerToOpportunity(customer) {
    const existing = existingOpportunityForCustomer(customer);
    if (!existing.record) return null;
    const record = existing.record;
    ensureOpportunityFields(record);
    const recordOwner = ownerIdentityFromRow(record);
    const canTakeRecord = isPublicOpportunity(record) || !recordOwner.id && !recordOwner.name || accountCanModuleAction("opportunities", "admin");
    if (!canTakeRecord) return record;
    const account = currentAccount();
    record.customerId = customer.id;
    record.opportunityOwner = account.name || customer.ownerName || "";
    record.opportunityOwnerId = account.id || customer.ownerId || "";
    record.opportunityOwnerRole = account.role || "";
    record.opportunityTeam = account.team || customer.ownerTeam || "";
    record.operatorName = record.operatorName || account.name || "";
    record.accountId = record.accountId || account.id || "";
    record.accountRole = record.accountRole || account.role || "";
    record.accountTeam = record.accountTeam || account.team || "";
    if (isPublicOpportunity(record)) record.opportunityStatus = "已认领";
    record.opportunityStage = record.opportunityStage || "线索确认";
    record.opportunityNextAction = customer.nextAction || record.opportunityNextAction || "进入场景评级补齐T0/T1/T2参数";
    record.opportunityNextActionAt = customer.nextActionAt || record.opportunityNextActionAt || crmDatePlusDays("", 3);
    record.opportunityClaimedAt = record.opportunityClaimedAt || new Date().toLocaleString("zh-CN", { hour12: false });
    if (!record.opportunityProtectionUntil) updateOpportunityProtection(record, 14);
    touchOpportunity(record);
    return record;
  }

  function assignCustomerToCurrentAccount(index) {
    const customer = crmWorkspace.customers[index];
    if (!customer || !crmOwnerVisible(customer)) return;
    if (!canAssignCustomerToCurrentAccount(customer)) {
      alert("这条客资已有负责人，当前账号没有重新分配权限。");
      return;
    }
    const previousOwner = customer.ownerName || "未分配";
    applyCurrentAccountToCustomer(customer);
    const record = maybeSyncCustomerOwnerToOpportunity(customer);
    persistCrmWorkspace();
    if (record) persistRecords();
    appendCrmActivity({
      type: "客户客资",
      title: "申领/分配客资",
      detail: `${customer.name || "未命名客户"} · ${previousOwner} -> ${customer.ownerName || "未分配"} · 首次跟进 ${customer.nextActionAt || "待排期"}`,
      pointName: customer.name || "",
      recordId: record && record.id || "",
      targetType: "customers",
      targetId: customer.id || "",
      ownerId: customer.ownerId || "",
      ownerName: customer.ownerName || "",
      tone: "mid-high"
    });
    renderRecords();
    renderCrmWorkspace();
  }

  function scheduleCustomerFollowup(index) {
    const customer = crmWorkspace.customers[index];
    if (!customer || !crmOwnerVisible(customer)) return;
    if (!crmCanEditCollection("customers")) {
      alert("当前账号没有编辑客户客资权限。");
      return;
    }
    if (!customer.nextAction) customer.nextAction = "补齐联系人、店铺位置、授权资源和商务意向";
    customer.nextActionAt = crmDatePlusDays("", 3);
    if (!customer.status || customer.status === "新线索") customer.status = "已触达";
    customer.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    const record = maybeSyncCustomerOwnerToOpportunity(customer);
    persistCrmWorkspace();
    if (record) persistRecords();
    appendCrmActivity({
      type: "客户客资",
      title: "安排客资跟进",
      detail: `${customer.name || "未命名客户"} · ${customer.nextAction} · ${customer.nextActionAt}`,
      pointName: customer.name || "",
      recordId: record && record.id || "",
      targetType: "customers",
      targetId: customer.id || "",
      ownerId: customer.ownerId || "",
      ownerName: customer.ownerName || "",
      tone: "medium"
    });
    renderRecords();
    renderCrmWorkspace();
  }

  function createOpportunityFromCustomer(index) {
    if (!accountCanModuleAction("opportunities", "edit")) {
      alert("当前账号没有创建点位机会权限。");
      return;
    }
    const customer = crmWorkspace.customers[index];
    if (!customer || !crmOwnerVisible(customer)) return;
    const existing = existingOpportunityForCustomer(customer);
    if (existing.record) {
      ensureOpportunityFields(existing.record);
      activeRecordView = accountOwnsRecord(existing.record) ? "mine" : "funnel";
      activeRecordPanels[recordKey(existing.record, existing.index)] = "claim";
      appendCrmActivity({
        type: "机会跟进",
        title: "打开已有客户机会",
        detail: `${customer.name} 已有点位机会，进入跟进面板`,
        pointName: existing.record.spotName || existing.record.opportunityPointScope || customer.name,
        recordId: existing.record.id || "",
        targetType: "record",
        targetId: existing.record.id || "",
        ownerId: existing.record.opportunityOwnerId || existing.record.accountId || "",
        ownerName: existing.record.opportunityOwner || existing.record.operatorName || "",
        tone: "neutral"
      });
      renderRecords();
      renderCrmWorkspace();
      setActiveView("records");
      return;
    }
    const account = currentAccount();
    const ownerAccount = accounts.find((item) => item.id === customer.ownerId);
    const owner = {
      id: customer.ownerId || account.id || "",
      name: customer.ownerName || (ownerAccount ? ownerAccount.name : "") || account.name || "",
      role: ownerAccount ? ownerAccount.role : account.role || "",
      team: customer.ownerTeam || (ownerAccount ? ownerAccount.team : "") || account.team || ""
    };
    const now = new Date().toLocaleString("zh-CN", { hour12: false });
    const record = {
      id: `R${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      time: now,
      operatorName: account.name || owner.name,
      accountId: account.id || owner.id,
      accountRole: account.role || owner.role,
      accountTeam: account.team || owner.team,
      customerId: customer.id,
      customerName: customer.name,
      spotName: customer.name,
      productId: "",
      productName: "待选择产品",
      grade: "待评级",
      retail: 0,
      judgement: "待进入场景评级",
      purchaseStatus: "待测算",
      policyType: "待测算",
      monthlyCommission: 0,
      income: 0,
      opportunityStatus: "已认领",
      opportunityStage: "线索确认",
      opportunityOwner: owner.name,
      opportunityOwnerId: owner.id,
      opportunityOwnerRole: owner.role,
      opportunityTeam: owner.team,
      opportunityPointScope: customer.name,
      opportunityContactRole: customer.contactRole || "待确认",
      opportunityContactName: customer.contactName || "",
      opportunityLastContactAt: "",
      opportunityNextAction: customer.nextAction || "进入场景评级补齐T0/T1/T2参数",
      opportunityNextActionAt: customer.nextActionAt || crmDatePlusDays("", 3),
      opportunityEvidence: `客户客资来源：${customer.source || "CRM客户表"}`,
      opportunityNote: customer.note || "",
      opportunityClaimedAt: now
    };
    updateOpportunityProtection(record, 14);
    records.unshift(record);
    customer.ownerId = owner.id;
    customer.ownerName = owner.name;
    customer.ownerTeam = owner.team;
    customer.status = customer.status === "新线索" || customer.status === "已触达" ? "评级中" : customer.status;
    customer.nextAction = record.opportunityNextAction;
    customer.nextActionAt = record.opportunityNextActionAt;
    customer.updatedAt = now;
    persistRecords();
    persistCrmWorkspace();
    appendCrmActivity({
      type: "机会跟进",
      title: "客户转点位机会",
      detail: `${customer.name} · 待补场景评级 · 保护至 ${record.opportunityProtectionUntil}`,
      pointName: customer.name,
      recordId: record.id,
      targetType: "record",
      targetId: record.id,
      ownerId: record.opportunityOwnerId,
      ownerName: record.opportunityOwner,
      tone: "mid-high"
    });
    activeRecordView = accountCanViewAll() && record.opportunityOwnerId !== account.id ? "funnel" : "mine";
    activeRecordPanels[recordKey(record, 0)] = "claim";
    renderRecords();
    renderCrmWorkspace();
    setActiveView("records");
  }

  function crmOwnerFromRow(row) {
    const account = currentAccount();
    const owner = accountByIdentity(row.ownerId, row.ownerName);
    return {
      ownerId: row.ownerId || (owner ? owner.id : "") || account.id || "",
      ownerName: row.ownerName || (owner ? owner.name : "") || account.name || "",
      ownerTeam: row.ownerTeam || (owner ? owner.team : "") || account.team || ""
    };
  }

  function existingOrderForContract(contract) {
    if (!contract) return null;
    return crmWorkspace.orders.find((order) =>
      order.contractId === contract.id
      || contract.pointName && order.pointName === contract.pointName && (!contract.customerId || order.customerId === contract.customerId)
    ) || null;
  }

  function existingSalesForOrder(order) {
    if (!order) return null;
    return crmWorkspace.storeSales.find((sale) =>
      sale.orderId === order.id
      || order.pointName && sale.pointName === order.pointName
    ) || null;
  }

  function existingReplenishmentOrderForSale(sale) {
    if (!sale) return null;
    return crmWorkspace.orders.find((order) =>
      order.storeSaleId === sale.id
      || sale.replenishmentOrderId && order.id === sale.replenishmentOrderId
      || order.orderType === "补货订单"
        && sale.pointName
        && order.pointName === sale.pointName
        && order.mesStatus !== "已完成"
    ) || null;
  }

  function replenishmentAdviceFromSale(sale) {
    return saleReviewModel(sale).advice;
  }

  function existingFulfillmentForOrder(order) {
    if (!order) return null;
    return data.fulfillmentRecords.find((record) =>
      record.orderId === order.id
      || order.pointName && record.pointName === order.pointName
    ) || null;
  }

  function upsertStoreSalesForOrder(order, overrides = {}) {
    const owner = crmOwnerFromRow(order);
    const month = overrides.month || new Date().toISOString().slice(0, 7);
    const existing = existingSalesForOrder(order);
    if (existing) {
      existing.orderId = existing.orderId || order.id || "";
      existing.customerId = existing.customerId || order.customerId || "";
      existing.pointName = existing.pointName || order.pointName || "待确认门店";
      existing.month = existing.month || month;
      existing.ownerId = existing.ownerId || owner.ownerId;
      existing.ownerName = existing.ownerName || owner.ownerName;
      existing.replenishmentAdvice = existing.replenishmentAdvice || "上线后按周补录销售额、回款、动销率和补货建议";
      existing.reviewStatus = existing.reviewStatus || "待复盘";
      existing.replenishmentPriority = existing.replenishmentPriority || saleReviewPriority(existing);
      existing.reviewOwner = existing.reviewOwner || owner.ownerName;
      existing.reviewDueDate = existing.reviewDueDate || "";
      existing.grossProfitAmount = existing.grossProfitAmount || saleGrossProfit(existing);
      existing.estimatedCommission = existing.estimatedCommission || saleEstimatedCommission(existing);
      existing.soldQty = Number(existing.soldQty) || 0;
      existing.stockQty = Number(existing.stockQty) || Number(order.quantity) || 0;
      existing.suggestedReplenishmentQty = Number(existing.suggestedReplenishmentQty) || 0;
      existing.reviewedAt = existing.reviewedAt || "";
      existing.replenishmentOrderId = existing.replenishmentOrderId || "";
      Object.entries(overrides).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (key === "reviewStatus" && existing.reviewStatus && existing.reviewStatus !== "待复盘") return;
        if (key === "replenishmentAdvice" && existing.replenishmentAdvice && !String(existing.replenishmentAdvice).includes("上线后")) return;
        existing[key] = value;
      });
      existing.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
      order.storeSalesId = existing.id;
      return { sale: existing, created: false };
    }
    const sale = {
      id: `SALE-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
      orderId: order.id || "",
      customerId: order.customerId || "",
      pointName: order.pointName || "待确认门店",
      month,
      salesAmount: 0,
      receiptAmount: 0,
      salesCostAmount: 0,
      soldQty: 0,
      stockQty: Number(order.quantity) || 0,
      suggestedReplenishmentQty: 0,
      grossProfitAmount: 0,
      estimatedCommission: 0,
      sellThroughRate: 0,
      replenishmentPriority: "待录入",
      replenishmentAdvice: "上线后按周补录销售额、回款、动销率和补货建议",
      reviewStatus: "待复盘",
      reviewOwner: owner.ownerName,
      reviewDueDate: "",
      reviewedAt: "",
      replenishmentOrderId: "",
      ...owner,
      note: `由订单/MES ${order.id || "待编号"} 生成`,
      ...overrides
    };
    crmWorkspace.storeSales.unshift(sale);
    order.storeSalesId = sale.id;
    return { sale, created: true };
  }

  function orderWorkflowAction(order) {
    const status = order && order.mesStatus || "待下单";
    if (status === "待下单") return { action: "confirmOrder", label: "确认下单", nextStatus: "设计/打样", permission: "edit" };
    if (status === "设计/打样") return { action: "sampleDone", label: "打样通过", nextStatus: "待生产", permission: "edit" };
    if (status === "待生产") return { action: "startProduction", label: "开始生产", nextStatus: "生产中", permission: "edit" };
    if (status === "生产中") return { action: "pack", label: "送检包装", nextStatus: "质检/包装", permission: "edit" };
    if (status === "质检/包装") return { action: "outbound", label: "确认出库", nextStatus: "已出库", permission: "approve" };
    if (status === "已出库") return { action: "ship", label: "确认发货", nextStatus: "已发货", permission: "approve" };
    if (status === "已发货" || String(status).includes("已发货")) return { action: "complete", label: "完成订单", nextStatus: "已完成", permission: "approve" };
    return null;
  }

  function canRunOrderWorkflow(actionMeta) {
    if (!actionMeta) return false;
    if (actionMeta.permission === "approve") {
      return accountCanModuleAction("orders", "approve");
    }
    return accountCanModuleAction("orders", "edit");
  }

  function orderDeliveryDetailLines(order) {
    return [
      order.skuPlan ? `SKU：${order.skuPlan}` : "",
      order.designRequirement ? `打样/设计：${order.designRequirement}` : "",
      order.receiverInfo ? `收货人：${order.receiverInfo}` : "",
      order.deliveryAddress ? `交付地点：${order.deliveryAddress}` : "",
      order.launchDate ? `目标上架：${order.launchDate}` : ""
    ].filter(Boolean);
  }

  function orderDeliveryNote(order, headline) {
    const lines = [headline].concat(orderDeliveryDetailLines(order));
    return lines.filter(Boolean).join("\n");
  }

  function orderShipmentQuantityNote(order) {
    const quantity = Number(order.quantity) || 0;
    if (order.skuPlan && quantity) return `来自订单/MES：${quantity}件；${order.skuPlan}`;
    if (order.skuPlan) return `来自订单/MES：${order.skuPlan}`;
    if (quantity) return `来自订单/MES：${quantity}件`;
    return "订单SKU/数量待补";
  }

  function fulfillmentPatchFromOrder(order, overrides = {}) {
    const baseNote = overrides.salesNote || "由订单/MES生成，待库管或销售补发货凭证、签收和上架情况";
    return {
      pointName: order.pointName || "待确认点位",
      cooperationType: order.orderType || "待核",
      shipmentQuantity: Number(order.quantity) || null,
      shipmentQuantityNote: orderShipmentQuantityNote(order),
      skuPlan: order.skuPlan || "",
      designRequirement: order.designRequirement || "",
      receiverInfo: order.receiverInfo || "",
      deliveryAddress: order.deliveryAddress || "",
      launchDate: order.launchDate || "",
      ...overrides,
      salesNote: orderDeliveryNote(order, baseNote)
    };
  }

  function upsertFulfillmentForOrder(order, overrides = {}) {
    const owner = crmOwnerFromRow(order);
    const existing = existingFulfillmentForOrder(order);
    const orderPatch = fulfillmentPatchFromOrder(order, overrides);
    if (existing) {
      existing.orderId = existing.orderId || order.id || "";
      existing.customerId = existing.customerId || order.customerId || "";
      existing.ownerId = existing.ownerId || owner.ownerId;
      existing.ownerName = existing.ownerName || owner.ownerName;
      existing.ownerTeam = existing.ownerTeam || owner.ownerTeam;
      existing.salesOwner = existing.salesOwner || owner.ownerName;
      Object.entries(orderPatch).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (key === "salesNote" && existing.salesNote && !String(existing.salesNote).startsWith("由订单/MES") && !String(existing.salesNote).startsWith("订单已确认发货")) return;
        existing[key] = value;
      });
      existing.salesUpdatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
      return { fulfillment: existing, created: false };
    }
    const fulfillment = normalizeFulfillmentRecord({
      id: `FUL-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
      code: `FUL-${String(data.fulfillmentRecords.length + 1).padStart(4, "0")}`,
      orderId: order.id || "",
      customerId: order.customerId || "",
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      ownerTeam: owner.ownerTeam,
      pointName: order.pointName || "待确认点位",
      folderName: `${order.pointName || "待确认点位"}｜订单发货落地`,
      cooperationType: order.orderType || "待核",
      lastFileDate: new Date().toISOString().slice(0, 10),
      shipmentStatus: "待发货",
      receiptStatus: "待签收",
      displayStatus: "待核",
      shipmentBatchCount: 0,
      shipmentQuantity: Number(order.quantity) || null,
      shipmentQuantityNote: orderShipmentQuantityNote(order),
      evidenceFiles: [],
      exceptionTags: order.quantity ? ["待补发货凭证", "待签收回执"] : ["待补订单数量", "待补发货凭证", "待签收回执"],
      salesShelfStatus: "待补录",
      salesShelfDate: "",
      salesSellStatus: "待补录",
      salesOwner: owner.ownerName,
      salesNote: orderDeliveryNote(order, "由订单/MES生成，待库管或销售补发货凭证、签收和上架情况"),
      salesUpdatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      syncSource: "CRM订单/MES本地生成",
      syncCheckedAt: new Date().toISOString().slice(0, 10),
      ...orderPatch
    });
    data.fulfillmentRecords.unshift(fulfillment);
    order.fulfillmentId = fulfillment.id;
    return { fulfillment, created: true };
  }

  function contractWorkflowAction(contract) {
    const status = contract && contract.status || "待制作";
    if (status === "待制作") return { action: "submitReview", label: "提交审核", nextStatus: "法务/商务审核", permission: "edit" };
    if (status === "法务/商务审核") return { action: "send", label: "标记已发", nextStatus: "已发对方", permission: "edit" };
    if (status === "已发对方") return { action: "sign", label: "标记签约", nextStatus: "已签约", permission: "approve" };
    if (status === "已签约") return { action: "archive", label: "归档", nextStatus: "归档", permission: "approve" };
    return null;
  }

  function canRunContractWorkflow(actionMeta) {
    if (!actionMeta) return false;
    if (actionMeta.permission === "approve") {
      return accountCanModuleAction("contracts", "approve");
    }
    return accountCanModuleAction("contracts", "edit");
  }

  function updateCrmContractWorkflow(index, action) {
    const contract = crmWorkspace.contracts[index];
    if (!contract || !crmOwnerVisible(contract)) return;
    const actionMeta = contractWorkflowAction(contract);
    if (!actionMeta || actionMeta.action !== action) {
      flashContextToolbar("当前合同状态没有可执行的流转动作");
      renderCrmWorkspace();
      return;
    }
    if (!canRunContractWorkflow(actionMeta)) {
      alert(actionMeta.permission === "approve" ? "当前账号没有合同审批权限。" : "当前账号没有合同编辑权限。");
      renderCrmWorkspace();
      return;
    }
    const previous = contract.status || "待制作";
    contract.status = actionMeta.nextStatus;
    contract.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    if (action === "submitReview") contract.nextAction = "等待主管/商务审核合同主体、授权边界和结算条件";
    if (action === "send") contract.nextAction = "跟进对方反馈、盖章进度和签约日期";
    if (action === "sign") {
      contract.signDate = contract.signDate || new Date().toISOString().slice(0, 10);
      contract.receivableDueDate = contract.receivableDueDate || crmDatePlusDays(contract.signDate, 30);
      contract.paymentStatus = contractPaymentStatus({ ...contract, paymentStatus: "待确认" });
      contract.invoiceStatus = contract.invoiceStatus || "待开票";
      contract.nextAction = "生成订单/MES并确认首批SKU、数量、交付条件和首期回款计划";
    }
    if (action === "archive") contract.nextAction = "合同已归档，进入订单、发货和动销复盘";
    persistCrmWorkspace();
    appendCrmActivity({
      type: "合同",
      title: `合同${actionMeta.label}`,
      detail: `${contract.pointName || "未命名点位"} · ${previous} -> ${contract.status}`,
      pointName: contract.pointName || "",
      targetType: "contract",
      targetId: contract.id || "",
      ownerId: contract.ownerId || "",
      ownerName: contract.ownerName || "",
      tone: action === "sign" ? "mid-high" : "medium"
    });
    renderCrmWorkspace();
  }

  function createCrmFulfillmentFromOrder(index) {
    if (!accountCanModuleAction("fulfillment", "edit")) {
      alert("当前账号没有建立发货落地权限。");
      return;
    }
    const order = crmWorkspace.orders[index];
    if (!order || !crmOwnerVisible(order)) return;
    const existing = existingFulfillmentForOrder(order);
    if (existing) {
      fulfillmentSearch = existing.pointName || "";
      appendCrmActivity({
        type: "发货落地",
        title: "查看已有发货落地",
        detail: `${existing.pointName || order.pointName || "未命名点位"} · ${fulfillmentLandingStatus(existing)} · ${existing.receiptStatus || "签收待核"}`,
        pointName: existing.pointName || order.pointName || "",
        targetType: "fulfillment",
        targetId: existing.id || "",
        ownerId: existing.ownerId || order.ownerId || "",
        ownerName: existing.ownerName || order.ownerName || "",
        tone: "neutral"
      });
      renderCrmWorkspace();
      renderFulfillment();
      return;
    }
    const owner = crmOwnerFromRow(order);
    const { fulfillment } = upsertFulfillmentForOrder(order);
    order.mesStatus = order.mesStatus === "待下单" ? "待生产" : order.mesStatus;
    order.note = `${order.note || ""}${order.note ? "\n" : ""}已建立发货落地记录，待补发货凭证和签收回执。`;
    order.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    persistCrmWorkspace();
    persistFulfillmentRecords();
    appendCrmActivity({
      type: "发货落地",
      title: "订单建立发货落地",
      detail: `${fulfillment.pointName} · ${fulfillment.shipmentStatus} · ${fulfillment.receiptStatus}`,
      pointName: fulfillment.pointName,
      targetType: "fulfillment",
      targetId: fulfillment.id,
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      tone: "medium"
    });
    renderCrmWorkspace();
    renderFulfillment();
  }

  function updateCrmOrderWorkflow(index, action) {
    const order = crmWorkspace.orders[index];
    if (!order || !crmOwnerVisible(order)) return;
    const actionMeta = orderWorkflowAction(order);
    if (!actionMeta || actionMeta.action !== action) {
      flashContextToolbar("当前订单状态没有可执行的MES动作");
      renderCrmWorkspace();
      return;
    }
    if (!canRunOrderWorkflow(actionMeta)) {
      alert(actionMeta.permission === "approve" ? "当前账号没有订单审批权限。" : "当前账号没有订单编辑权限。");
      renderCrmWorkspace();
      return;
    }
    const previous = order.mesStatus || "待下单";
    order.mesStatus = actionMeta.nextStatus;
    order.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    if (action === "confirmOrder") order.note = `${order.note || ""}${order.note ? "\n" : ""}已确认下单，进入设计/打样。`;
    if (action === "sampleDone") order.note = `${order.note || ""}${order.note ? "\n" : ""}打样通过，等待排产。`;
    if (action === "startProduction") order.note = `${order.note || ""}${order.note ? "\n" : ""}已开始生产，等待质检包装。`;
    if (action === "pack") order.note = `${order.note || ""}${order.note ? "\n" : ""}进入质检/包装，准备出库。`;
    if (action === "outbound") order.note = `${order.note || ""}${order.note ? "\n" : ""}已确认出库，等待发货凭证。`;
    if (action === "ship") {
      const { fulfillment, created } = upsertFulfillmentForOrder(order, {
        shipmentStatus: "已发货",
        receiptStatus: "待签收",
        lastFileDate: new Date().toISOString().slice(0, 10),
        exceptionTags: ["待签收回执", "待上架照片"],
        salesNote: "订单已确认发货，待补签收回执、上架照片和现场销售反馈",
        syncSource: "CRM订单/MES确认发货"
      });
      order.fulfillmentId = fulfillment.id;
      order.note = `${order.note || ""}${order.note ? "\n" : ""}${created ? "已确认发货并建立发货落地记录。" : "已确认发货并更新发货落地记录。"}`;
      persistFulfillmentRecords();
    }
    if (action === "complete") {
      const { sale, created } = upsertStoreSalesForOrder(order, {
        reviewStatus: "待复盘",
        replenishmentAdvice: "订单已完成，按周补录销售额、回款、动销率和补货建议"
      });
      order.note = `${order.note || ""}${order.note ? "\n" : ""}订单已完成，${created ? "已自动建立" : "已关联"} ${sale.month || "本月"} 门店销售跟踪。`;
      appendCrmActivity({
        type: "门店销售",
        title: created ? "订单完成自动建立销售跟踪" : "订单完成关联销售跟踪",
        detail: `${sale.pointName || order.pointName || "未命名门店"} · ${sale.month || "未填月份"} · 待录入销售、回款和动销`,
        pointName: sale.pointName || order.pointName || "",
        targetType: "storeSales",
        targetId: sale.id || "",
        ownerId: sale.ownerId || order.ownerId || "",
        ownerName: sale.ownerName || order.ownerName || "",
        tone: "mid-high"
      });
    }
    persistCrmWorkspace();
    appendCrmActivity({
      type: "订单/MES",
      title: `订单${actionMeta.label}`,
      detail: `${order.pointName || "未命名点位"} · ${previous} -> ${order.mesStatus}`,
      pointName: order.pointName || "",
      targetType: "order",
      targetId: order.id || "",
      ownerId: order.ownerId || "",
      ownerName: order.ownerName || "",
      tone: action === "ship" || action === "complete" ? "mid-high" : "medium"
    });
    renderCrmWorkspace();
    renderFulfillment();
  }

  function createCrmOrderFromContract(index) {
    if (!accountCanModuleAction("orders", "edit")) {
      alert("当前账号没有生成订单/MES权限。");
      return;
    }
    const contract = crmWorkspace.contracts[index];
    if (!contract || !crmOwnerVisible(contract)) return;
    const existing = existingOrderForContract(contract);
    if (existing) {
      appendCrmActivity({
        type: "订单/MES",
        title: "查看已有订单",
        detail: `${existing.pointName || contract.pointName || "未命名点位"} · ${existing.mesStatus || "待下单"}`,
        pointName: existing.pointName || contract.pointName || "",
        targetType: "order",
        targetId: existing.id || "",
        ownerId: existing.ownerId || contract.ownerId || "",
        ownerName: existing.ownerName || contract.ownerName || "",
        tone: "neutral"
      });
      renderCrmWorkspace();
      return;
    }
    const owner = crmOwnerFromRow(contract);
    const orderType = String(contract.type || "").includes("寄售")
      ? "寄售铺货"
      : String(contract.type || "").includes("定制")
        ? "定制开发"
        : "采购订单";
    const order = {
      id: `ORD-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
      contractId: contract.id || "",
      customerId: contract.customerId || "",
      pointName: contract.pointName || "待确认点位",
      orderType,
      mesStatus: "待下单",
      ...owner,
      amount: Number(contract.amount) || 0,
      quantity: 0,
      skuPlan: "待补首批SKU、单款数量、69码和图片链接",
      designRequirement: contract.deliveryTerms || "待确认画面素材、打样要求、包装贴标和出样节点",
      receiverInfo: "待补收货人/电话",
      deliveryAddress: "待补收货地址/交付门店",
      launchDate: "",
      dueDate: "",
      note: `由合同 ${contract.contractNo || contract.id || "待编号"} 生成，需补首批SKU、数量、生产和发货节点`
    };
    crmWorkspace.orders.unshift(order);
    contract.orderId = order.id;
    contract.nextAction = "补齐订单/MES首批SKU、数量和交付条件";
    contract.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    persistCrmWorkspace();
    appendCrmActivity({
      type: "订单/MES",
      title: "合同生成订单/MES",
      detail: `${order.pointName} · ${order.orderType} · ${crmCurrency(order.amount)}`,
      pointName: order.pointName,
      targetType: "order",
      targetId: order.id,
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      tone: "mid-high"
    });
    renderCrmWorkspace();
  }

  function createCrmSalesFromOrder(index) {
    if (!accountCanModuleAction("storeSales", "edit")) {
      alert("当前账号没有建立门店销售跟踪权限。");
      return;
    }
    const order = crmWorkspace.orders[index];
    if (!order || !crmOwnerVisible(order)) return;
    const existing = existingSalesForOrder(order);
    if (existing) {
      appendCrmActivity({
        type: "门店销售",
        title: "查看已有销售跟踪",
        detail: `${existing.pointName || order.pointName || "未命名门店"} · ${existing.month || "未填月份"}`,
        pointName: existing.pointName || order.pointName || "",
        targetType: "storeSales",
        targetId: existing.id || "",
        ownerId: existing.ownerId || order.ownerId || "",
        ownerName: existing.ownerName || order.ownerName || "",
        tone: "neutral"
      });
      renderCrmWorkspace();
      return;
    }
    const owner = crmOwnerFromRow(order);
    const { sale } = upsertStoreSalesForOrder(order);
    order.note = `${order.note || ""}${order.note ? "\n" : ""}已建立 ${sale.month || "本月"} 门店销售跟踪。`;
    order.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    persistCrmWorkspace();
    appendCrmActivity({
      type: "门店销售",
      title: "订单建立门店销售跟踪",
      detail: `${sale.pointName} · ${sale.month || "未填月份"} · 待录入销售和回款`,
      pointName: sale.pointName,
      targetType: "storeSales",
      targetId: sale.id,
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      tone: "medium"
    });
    renderCrmWorkspace();
  }

  function markStoreSalesReviewed(index) {
    if (!accountCanModuleAction("storeSales", "edit")) {
      alert("当前账号没有门店销售复盘权限。");
      return;
    }
    const sale = crmWorkspace.storeSales[index];
    if (!sale || !crmOwnerVisible(sale)) return;
    const review = saleReviewModel(sale);
    const advice = review.advice;
    const account = currentAccount();
    sale.replenishmentAdvice = advice;
    sale.replenishmentPriority = review.priority;
    sale.suggestedReplenishmentQty = review.suggestedQty;
    sale.reviewOwner = sale.reviewOwner || account.name || sale.ownerName || "";
    sale.grossProfitAmount = saleGrossProfit(sale);
    sale.estimatedCommission = saleEstimatedCommission(sale);
    sale.reviewStatus = review.status;
    sale.reviewedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    sale.reviewDueDate = crmDatePlusDays("", review.nextReviewDays);
    sale.updatedAt = sale.reviewedAt;
    persistCrmWorkspace();
    appendCrmActivity({
      type: "门店销售",
      title: "门店销售复盘",
      detail: `${sale.pointName || "未命名门店"} · ${sale.month || "未填月份"} · ${review.summary} · ${advice}`,
      pointName: sale.pointName || "",
      targetType: "storeSales",
      targetId: sale.id || "",
      ownerId: sale.ownerId || "",
      ownerName: sale.ownerName || "",
      tone: review.canReplenish ? "mid-high" : review.priority === "待录入" ? "weak" : "neutral"
    });
    renderCrmWorkspace();
  }

  function createReplenishmentOrderFromSale(index) {
    if (!accountCanModuleAction("orders", "edit")) {
      alert("当前账号没有生成补货订单权限。");
      return;
    }
    const sale = crmWorkspace.storeSales[index];
    if (!sale || !crmOwnerVisible(sale)) return;
    const existing = existingReplenishmentOrderForSale(sale);
    if (existing) {
      appendCrmActivity({
        type: "订单/MES",
        title: "查看已有补货订单",
        detail: `${existing.pointName || sale.pointName || "未命名门店"} · ${existing.mesStatus || "待下单"}`,
        pointName: existing.pointName || sale.pointName || "",
        targetType: "order",
        targetId: existing.id || "",
        ownerId: existing.ownerId || sale.ownerId || "",
        ownerName: existing.ownerName || sale.ownerName || "",
        tone: "neutral"
      });
      renderCrmWorkspace();
      return;
    }
    const owner = crmOwnerFromRow(sale);
    const review = saleReviewModel(sale);
    const advice = sale.replenishmentAdvice && !String(sale.replenishmentAdvice).includes("待录入") ? sale.replenishmentAdvice : review.advice;
    const suggestedQty = Number(sale.suggestedReplenishmentQty) || review.suggestedQty;
    if (!review.canReplenish && !suggestedQty) {
      alert("当前复盘结论还不建议补货。请先录入销量/库存/回款并生成复盘。");
      return;
    }
    const order = {
      id: `ORD-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
      storeSaleId: sale.id || "",
      customerId: sale.customerId || "",
      pointName: sale.pointName || "待确认门店",
      orderType: "补货订单",
      mesStatus: "待下单",
      ...owner,
      amount: 0,
      quantity: suggestedQty,
      skuPlan: `建议补货${suggestedQty || "待确认"}件；补货SKU待销售按动销明细确认，需补单款数量、69码和图片链接`,
      designRequirement: "沿用已上架款式或补充新款画面，打样/包装变更需单独确认",
      receiverInfo: "沿用原点位收货人，变更需补电话",
      deliveryAddress: `${sale.pointName || "待确认门店"} · 待补详细收货地址`,
      launchDate: "",
      dueDate: crmDatePlusDays("", 7),
      note: `由门店销售复盘生成：${sale.month || "未填月份"} · 销售${crmCurrency(sale.salesAmount)} · 回款${crmCurrency(sale.receiptAmount)} · 动销${Number(sale.sellThroughRate) || 0}%；${advice}`
    };
    crmWorkspace.orders.unshift(order);
    sale.replenishmentOrderId = order.id;
    sale.replenishmentAdvice = advice;
    sale.suggestedReplenishmentQty = suggestedQty;
    sale.reviewStatus = "已生成补货订单";
    sale.reviewedAt = new Date().toLocaleString("zh-CN", { hour12: false });
    sale.updatedAt = sale.reviewedAt;
    persistCrmWorkspace();
    appendCrmActivity({
      type: "订单/MES",
      title: "门店销售生成补货订单",
      detail: `${order.pointName} · 补货订单 · 建议${suggestedQty || 0}件 · 待补SKU明细`,
      pointName: order.pointName,
      targetType: "order",
      targetId: order.id,
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      tone: "mid-high"
    });
    renderCrmWorkspace();
  }

  function buildContractDraftFromContract(contract) {
    const depositText = Number(contract.depositAmount) > 0 ? crmCurrency(contract.depositAmount) : "无/待确认";
    return [
      "寻迹万物瓦片文创合作协议草稿",
      "",
      `合同编号：${contract.contractNo || contract.id || "待编号"}`,
      `甲方/点位：${contract.pointName || "待确认"}`,
      `客户主体：${contract.subjectName || crmCustomerName(contract.customerId) || "待补正式主体"}`,
      `合作类型：${contract.type || "景区合作"}`,
      `合同模板：${contract.template || "景区合作协议"}`,
      `合同状态：${contract.status || "待制作"}`,
      `合同金额：${crmCurrency(contract.amount)}`,
      contract.ratingBasis ? `测算依据：${contract.ratingBasis}` : "",
      contract.productTerms ? `产品与价格：${contract.productTerms}` : "",
      contract.businessTerms ? `商务条件：${contract.businessTerms}` : "",
      `授权边界：${contract.authorizationScope || "待确认景区名称、地标元素、联名露出和使用周期"}`,
      `结算账期：${contract.settlementCycle || "待确认账期与对账周期"}`,
      `保证金/保底：${depositText}`,
      `应收金额：${crmCurrency(contract.amount)}；已收金额：${crmCurrency(contract.paidAmount)}；剩余应收：${crmCurrency(contractReceivableRemaining(contract))}`,
      `回款状态：${contractPaymentStatus(contract)}；预计回款日：${contract.receivableDueDate || "待确认"}`,
      `开票状态：${contract.invoiceStatus || "待补开票信息"}`,
      `开票信息：${contract.invoiceInfo || "待补开票信息"}`,
      `交付边界：${contract.deliveryTerms || "首批SKU、数量、打样确认、发货时间、收货人和签收凭证需在订单/MES页确认"}`,
      `销售复盘：${contract.salesReviewTerms || "上线后按月补录销售额、回款额、动销率和补货建议，作为后续提成与复购依据"}`,
      `下一步：${contract.nextAction || "确认合同主体、授权边界、账期和发货条件"}`,
      contract.note ? `备注：${contract.note}` : "",
      "",
      "待补条款：合同主体证照、开票信息、账期、保证金、知识产权授权、结算周期、退换货、退出机制。"
    ].filter((line) => line !== "").join("\n");
  }

  function buildContractDraft(record, result, customer, contractType) {
    const scenario = result ? result.inputs.scenario : {};
    const channel = result ? result.inputs.channel : {};
    const business = result ? result.business : {};
    const grade = result ? result.scenario.grade : "待评级";
    const score = result ? XJCore.round(result.scenario.score, 1) : "待测算";
    const deduction = result ? percent(business.negotiatedDeduction) : "待确认";
    const retail = result ? money(result.pricing.retail) : "待确认";
    const mode = channel.mode || contractType || "景区合作";
    return buildContractDraftFromContract({
      contractNo: "",
      pointName: recordPipelinePoint(record, result),
      customerId: customer.id || "",
      subjectName: customer.name || "待补正式主体",
      type: contractType || mode,
      template: result ? `${grade}级点位${mode.includes("寄售") ? "寄售" : "采购"}合作协议` : "景区合作协议",
      status: "待制作",
      amount: result ? Number(result.purchase.finalTotal || result.commission.purchaseReceiptAmount || 0) : 0,
      ratingBasis: `${grade}（${score}分） · 点位颗粒度：${record.opportunityPointScope || scenario.spotName || "待细化到具体门店/片区"}`,
      productTerms: `${result ? result.cost.product.name : "待确认产品"} / 零售价 ${retail}`,
      businessTerms: `扣点 ${deduction}，政策 ${business.policyType || "待确认"}`,
      authorizationScope: result && business.authAdvice ? business.authAdvice : "以双方最终授权范围为准，优先明确景区名称、地标元素、联名露出和使用周期",
      settlementCycle: mode.includes("寄售") ? "建议月结，对账后按约定账期回款" : "采购订单按合同约定预付/到货/验收节点回款",
      depositAmount: Number(channel.deposit) || 0,
      invoiceInfo: "待补开票信息",
      invoiceStatus: "待补开票信息",
      paidAmount: 0,
      receivableDueDate: "",
      paymentStatus: "待确认",
      deliveryTerms: "首批SKU、数量、打样确认、发货时间、收货人和签收凭证需在订单/MES页确认",
      salesReviewTerms: "上线后按月补录销售额、回款额、动销率和补货建议，作为后续提成与复购依据",
      nextAction: "确认合同主体、授权边界、账期和发货条件"
    });
  }

  function ensureContractDraft(contract) {
    if (!contract) return "";
    if (!contract.contractNo) contract.contractNo = contract.id || `CON-${Date.now().toString(36)}`;
    contract.draftText = buildContractDraftFromContract(contract);
    return contract.draftText;
  }

  function createCrmContractFromRecord(index) {
    const record = records[index];
    if (!record) return;
    if (!accountCanModuleAction("contracts", "edit")) {
      alert("当前账号没有生成合同权限。");
      return;
    }
    if (!opportunityCanCreateContract(record)) {
      alert("点位机会需先报备通过，才能生成合同。");
      return;
    }
    const result = recordResult(record);
    ensureOpportunityFields(record, result);
    const customer = ensureCrmCustomerForRecord(record, result);
    const pointName = recordPipelinePoint(record, result);
    const owner = crmOwnerFromRecord(record);
    const mode = result ? String(result.inputs.channel.mode || "") : "";
    const existingContract = crmWorkspace.contracts.find((contract) => contract.pointName === pointName && contract.status !== "作废");
    if (!existingContract) {
      const contractId = `CON-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
      const contractType = mode.includes("寄售") ? "寄售合作" : "采购供货";
      const channel = result ? result.inputs.channel : {};
      const business = result ? result.business : {};
      const gradeText = result ? `${result.scenario.grade} ${XJCore.round(result.scenario.score, 1)}分` : "待评级";
      const productTerms = result ? `${result.cost.product.name} / 零售价 ${money(result.pricing.retail)}` : "待确认产品与价格";
      const businessTerms = result ? `扣点 ${percent(result.business.negotiatedDeduction)}，政策 ${result.business.policyType || "待确认"}` : "待确认商务条件";
      const contract = {
        id: contractId,
        contractNo: `${contractId.toUpperCase()}`,
        customerId: customer.id,
        pointName,
        type: contractType,
        status: "待制作",
        ...owner,
        subjectName: customer.name || "",
        authorizationScope: business.authAdvice || "待确认景区名称、地标元素、联名露出和使用周期",
        settlementCycle: mode.includes("寄售") ? "建议月结，对账后按约定账期回款" : "采购订单按合同约定预付/到货/验收节点回款",
        depositAmount: Number(channel.deposit) || 0,
        invoiceInfo: "待补开票信息",
        invoiceStatus: "待补开票信息",
        paidAmount: 0,
        receivableDueDate: "",
        paymentStatus: "待确认",
        deliveryTerms: "首批SKU、数量、打样确认、发货时间、收货人和签收凭证需在订单/MES页确认",
        salesReviewTerms: "上线后按月补录销售额、回款额、动销率和补货建议，作为后续提成与复购依据",
        ratingBasis: gradeText,
        productTerms,
        businessTerms,
        amount: result ? Number(result.purchase.finalTotal || result.commission.purchaseReceiptAmount || 0) : 0,
        signDate: "",
        template: result ? `${result.scenario.grade}级点位${mode.includes("寄售") ? "寄售" : "采购"}合作协议` : "景区合作协议",
        nextAction: "确认合同主体、授权边界、账期和发货条件",
        note: result ? `${gradeText} · ${result.business.policyType}` : ""
      };
      contract.draftText = buildContractDraftFromContract(contract);
      crmWorkspace.contracts.unshift({
        ...contract
      });
      activeCrmDraftId = contract.id;
    }
    const contractActivityId = existingContract ? existingContract.id : activeCrmDraftId;
    record.opportunityStatus = "商务洽谈";
    record.opportunityStage = "合同/打样";
    record.opportunityNextAction = "补齐合同主体并制作合同初稿";
    touchOpportunity(record);
    persistCrmWorkspace();
    persistRecords();
    appendCrmActivity({
      type: "合同",
      title: existingContract ? "查看已有合同" : "生成合同草稿",
      detail: `${pointName} · ${mode.includes("寄售") ? "寄售合作" : "采购供货"} · ${result ? result.scenario.grade : "待评级"}`,
      pointName,
      recordId: record.id || "",
      targetType: "contract",
      targetId: contractActivityId || "",
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      tone: "mid-high"
    });
    activeRecordPanels[recordKey(record, index)] = "claim";
    renderRecords();
    renderCrmWorkspace();
  }

  function createCrmOrderFromRecord(index) {
    const record = records[index];
    if (!record) return;
    if (!accountCanModuleAction("orders", "edit")) {
      alert("当前账号没有生成订单/MES权限。");
      return;
    }
    if (!opportunityCanCreateOrder(record)) {
      alert("请先进入合同商务阶段，再生成订单/MES。");
      return;
    }
    const result = recordResult(record);
    ensureOpportunityFields(record, result);
    const customer = ensureCrmCustomerForRecord(record, result);
    const pointName = recordPipelinePoint(record, result);
    const owner = crmOwnerFromRecord(record);
    const channel = result ? result.inputs.channel : {};
    const mode = String(channel.mode || "");
    const quantity = mode.includes("寄售") ? Number(channel.stockQty || 0) : Number(channel.purchaseQty || channel.totalPurchaseQty || 0);
    const amount = result ? Number(result.purchase.finalTotal || channel.purchaseReceiptAmount || 0) : 0;
    const productName = result ? result.cost.product.name : "待选产品";
    const exists = crmWorkspace.orders.some((order) => order.pointName === pointName && !["已完成", "作废"].includes(order.mesStatus));
    if (!exists) {
      crmWorkspace.orders.unshift({
        id: `ORD-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
        customerId: customer.id,
        pointName,
        orderType: mode.includes("寄售") ? "寄售铺货" : "采购订单",
        mesStatus: "待下单",
        ...owner,
        amount,
        quantity,
        skuPlan: `${productName} · ${quantity ? `计划${quantity}件` : "数量待补"}；单款SKU、69码和图片链接待拆分`,
        designRequirement: mode.includes("寄售") ? "首批铺货需确认景区主题画面、打样、包装贴标和陈列物料" : "采购款式、画面素材、打样要求、包装贴标和出样节点待确认",
        receiverInfo: "待补收货人/电话",
        deliveryAddress: `${pointName} · 待补详细收货地址/交付门店`,
        launchDate: "",
        dueDate: "",
        note: "由点位机会生成，需同步生产、质检、包装和出库节点"
      });
    }
    record.opportunityStatus = "已签约/待落地";
    record.opportunityStage = "发货落地";
    record.opportunityNextAction = "确认首批SKU、数量、交付时间和收货人";
    touchOpportunity(record);
    persistCrmWorkspace();
    persistRecords();
    appendCrmActivity({
      type: "订单/MES",
      title: exists ? "查看已有订单" : "生成订单/MES",
      detail: `${pointName} · ${quantity || 0}件 · ${crmCurrency(amount)}`,
      pointName,
      recordId: record.id || "",
      targetType: "order",
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      tone: "mid-high"
    });
    activeRecordPanels[recordKey(record, index)] = "claim";
    renderRecords();
    renderCrmWorkspace();
  }

  function createCrmSalesFromRecord(index) {
    const record = records[index];
    if (!record) return;
    if (!accountCanModuleAction("storeSales", "edit")) {
      alert("当前账号没有生成门店销售跟踪权限。");
      return;
    }
    if (!opportunityCanCreateSales(record)) {
      alert("请先完成签约/待落地，再建立门店销售跟踪。");
      return;
    }
    const result = recordResult(record);
    ensureOpportunityFields(record, result);
    const customer = ensureCrmCustomerForRecord(record, result);
    const pointName = recordPipelinePoint(record, result);
    const owner = crmOwnerFromRecord(record);
    const channel = result ? result.inputs.channel : {};
    const mode = String(channel.mode || "");
    const quantity = mode.includes("寄售") ? Number(channel.stockQty || 0) : Number(channel.purchaseQty || channel.totalPurchaseQty || 0);
    const month = new Date().toISOString().slice(0, 7);
    const exists = crmWorkspace.storeSales.some((sale) => sale.pointName === pointName && sale.month === month);
    if (!exists) {
      crmWorkspace.storeSales.unshift({
        id: `SALE-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
        customerId: customer.id,
        pointName,
        month,
        salesAmount: 0,
        receiptAmount: 0,
        salesCostAmount: 0,
        soldQty: 0,
        stockQty: Number(quantity) || 0,
        suggestedReplenishmentQty: 0,
        grossProfitAmount: 0,
        estimatedCommission: 0,
        sellThroughRate: 0,
        replenishmentPriority: "待录入",
        reviewOwner: owner.ownerName,
        reviewDueDate: "",
        reviewStatus: "待复盘",
        reviewedAt: "",
        replenishmentAdvice: "上线后按周补录销售额、回款和补货建议",
        ...owner,
        note: "由点位机会生成"
      });
    }
    record.opportunityStatus = "运营中";
    record.opportunityStage = "动销复盘";
    record.opportunityNextAction = "补录首月销售、回款和陈列反馈";
    touchOpportunity(record);
    persistCrmWorkspace();
    persistRecords();
    appendCrmActivity({
      type: "门店销售",
      title: exists ? "查看已有销售跟踪" : "建立门店销售跟踪",
      detail: `${pointName} · ${month} · 待录入销售额和回款`,
      pointName,
      recordId: record.id || "",
      targetType: "storeSales",
      ownerId: owner.ownerId,
      ownerName: owner.ownerName,
      tone: "medium"
    });
    activeRecordPanels[recordKey(record, index)] = "claim";
    renderRecords();
    renderCrmWorkspace();
  }

  function handleRecordPipelineAction(action, index) {
    if (action === "contract") createCrmContractFromRecord(index);
    if (action === "order") createCrmOrderFromRecord(index);
    if (action === "sales") createCrmSalesFromRecord(index);
  }

  function opportunityCanCreateContract(record) {
    const status = String(record && record.opportunityStatus || "");
    return ["报备通过", "商务洽谈", "条件审批", "已签约/待落地", "运营中"].includes(status);
  }

  function opportunityCanCreateOrder(record) {
    const status = String(record && record.opportunityStatus || "");
    return ["商务洽谈", "条件审批", "已签约/待落地", "运营中"].includes(status);
  }

  function opportunityCanCreateSales(record) {
    const status = String(record && record.opportunityStatus || "");
    return ["已签约/待落地", "运营中"].includes(status);
  }

  function opportunityApprovalChecklist(record) {
    ensureOpportunityFields(record);
    const owner = ownerIdentityFromRow(record);
    const due = crmDateStatus(record.opportunityNextActionAt);
    return [
      {
        key: "scope",
        label: "点位颗粒度",
        ready: Boolean(record.opportunityPointScope && !String(record.opportunityPointScope).includes("待细化")),
        detail: record.opportunityPointScope || "需补父级/子级片区/具体门店"
      },
      {
        key: "owner",
        label: "负责人",
        ready: Boolean(owner.id || owner.name),
        detail: owner.name || "需认领到销售/渠道账号"
      },
      {
        key: "contact",
        label: "联系人",
        ready: Boolean(record.opportunityContactName || record.opportunityContactRole && record.opportunityContactRole !== "待确认"),
        detail: record.opportunityContactName || record.opportunityContactRole || "需补联系人或角色"
      },
      {
        key: "evidence",
        label: "证据",
        ready: Boolean(String(record.opportunityEvidence || "").trim()),
        detail: record.opportunityEvidence ? "已补证据/链接" : "需补聊天、会议或现场证据"
      },
      {
        key: "nextAction",
        label: "下一步",
        ready: Boolean(record.opportunityNextAction && record.opportunityNextActionAt && due.days >= 0),
        detail: record.opportunityNextAction && record.opportunityNextActionAt ? `${record.opportunityNextAction} · ${due.label}` : "需补动作和日期"
      }
    ];
  }

  function opportunityApprovalMissing(record) {
    return opportunityApprovalChecklist(record).filter((item) => !item.ready);
  }

  function opportunityApprovalChecklistHtml(record) {
    const items = opportunityApprovalChecklist(record);
    const readyCount = items.filter((item) => item.ready).length;
    return `<div class="record-approval-checklist">
      <div class="record-approval-head">
        <strong>报备清单</strong>
        <span>${readyCount}/${items.length} 项已完成</span>
      </div>
      <div class="record-approval-items">
        ${items.map((item) => `<div class="${item.ready ? "ready" : "missing"}">
          <b>${item.ready ? "已" : "缺"}</b>
          <span>${escapeHtml(item.label)}</span>
          <small>${escapeHtml(item.detail)}</small>
        </div>`).join("")}
      </div>
    </div>`;
  }

  function handleRecordOpportunityAction(action, index) {
    const record = records[index];
    if (!record) return;
    ensureOpportunityFields(record);
    const pointName = record.spotName || record.opportunityPointScope || "未命名点位";
    const activityTitles = {
      claim: "认领点位机会",
      submit: "提交报备",
      approve: "报备通过",
      reject: "报备驳回",
      release: "退回公海"
    };
    if (!hasAccount()) {
      alert("请先在顶部选择或填写当前账号。");
      const accountInput = qs("#accountPresetSelect") || qs("#accountNameInput");
      if (accountInput) accountInput.focus();
      return;
    }
    if (action === "claim") {
      if (!isPublicOpportunity(record) && !accountCanEditOpportunity(record)) {
        alert("这条点位机会已被其他账号认领，不能重复认领。");
        return;
      }
      applyCurrentAccountToOpportunity(record);
      record.opportunityStatus = "已认领";
      record.opportunityStage = record.opportunityStage || "线索确认";
      record.opportunityClaimedAt = record.opportunityClaimedAt || new Date().toLocaleString("zh-CN", { hour12: false });
      updateOpportunityProtection(record, 14);
    }
    if (action === "submit") {
      if (!accountCanEditOpportunity(record)) {
        alert("当前账号没有权限提交这条点位机会。");
        return;
      }
      const missing = opportunityApprovalMissing(record);
      if (missing.length) {
        alert(`报备资料还不完整：${missing.map((item) => item.label).join("、")}。请补齐后再提交。`);
        activeRecordPanels[recordKey(record, index)] = "claim";
        renderRecords();
        return;
      }
      if (!record.opportunityOwner) applyCurrentAccountToOpportunity(record);
      record.opportunityStatus = "报备待审";
      record.opportunityStage = record.opportunityStage === "线索确认" ? "已触达" : record.opportunityStage;
      updateOpportunityProtection(record, 30);
    }
    if (action === "approve") {
      if (!accountCanApprove()) {
        alert("只有销售主管或管理员可以通过报备。");
        return;
      }
      if (record.opportunityStatus !== "报备待审") {
        alert("只有“报备待审”的点位机会可以审批通过。");
        return;
      }
      const missing = opportunityApprovalMissing(record);
      if (missing.length) {
        alert(`审批资料还不完整：${missing.map((item) => item.label).join("、")}。请先驳回或让销售补齐。`);
        activeRecordPanels[recordKey(record, index)] = "claim";
        renderRecords();
        return;
      }
      record.opportunityStatus = "报备通过";
      record.opportunityStage = record.opportunityStage === "线索确认" ? "已触达" : record.opportunityStage;
      updateOpportunityProtection(record, 60);
    }
    if (action === "reject") {
      if (!accountCanApprove()) {
        alert("只有销售主管或管理员可以驳回报备。");
        return;
      }
      if (record.opportunityStatus !== "报备待审") {
        alert("只有“报备待审”的点位机会可以驳回补充。");
        return;
      }
      record.opportunityStatus = "报备驳回/补充材料";
      record.opportunityStage = "已触达";
      record.opportunityNextAction = "补充报备清单资料后重新提交";
      record.opportunityNextActionAt = crmDatePlusDays("", 3);
      record.opportunityProtectionUntil = crmDatePlusDays("", 14);
      record.opportunityNote = [`${new Date().toLocaleString("zh-CN", { hour12: false })} 报备驳回：请补充点位颗粒度、联系人、证据或下一步动作。`, record.opportunityNote || ""].filter(Boolean).join("\n");
      touchOpportunity(record);
    }
    if (action === "release") {
      if (!accountCanEditOpportunity(record)) {
        alert("当前账号没有权限退回这条点位机会。");
        return;
      }
      if (!window.confirm("确认将这条点位机会退回公海？")) return;
      record.opportunityStatus = "战败/退回公海";
      record.opportunityStage = "退回公海";
      record.opportunityOwner = "";
      record.opportunityOwnerId = "";
      record.opportunityOwnerRole = "";
      record.opportunityTeam = "";
      record.opportunityProtectionUntil = "";
      touchOpportunity(record);
      activeRecordView = "pool";
    }
    persistRecords();
    appendCrmActivity({
      type: "机会跟进",
      title: activityTitles[action] || "更新点位机会",
      detail: `${record.opportunityStatus} · ${record.opportunityStage || "未填阶段"}`,
      pointName,
      recordId: record.id || "",
      targetType: "record",
      targetId: record.id || "",
      ownerId: record.opportunityOwnerId || record.accountId || "",
      ownerName: record.opportunityOwner || record.operatorName || "",
      tone: action === "release" || action === "reject" ? "weak" : action === "approve" ? "mid-high" : "medium"
    });
    const key = recordKey(record, index);
    activeRecordPanels[key] = "claim";
    renderRecords();
    renderCrmWorkspace();
    renderContextToolbar();
  }

  function followupValue(form, key) {
    const fieldNode = form && form.querySelector(`[data-followup-field="${key}"]`);
    return fieldNode ? String(fieldNode.value || "").trim() : "";
  }

  function saveRecordFollowup(button) {
    const index = Number(button && button.dataset.recordFollowupSubmit);
    const record = records[index];
    if (!record) return;
    ensureOpportunityFields(record);
    if (!accountCanEditOpportunity(record) && !accountCanApprove()) {
      alert("当前账号没有权限新增这条点位机会的跟进记录。");
      renderRecords();
      return;
    }
    const form = button.closest("[data-record-followup-form]");
    const followupType = followupValue(form, "type") || "跟进";
    const summary = followupValue(form, "summary");
    const nextAction = followupValue(form, "nextAction");
    const nextActionAt = followupValue(form, "nextActionAt");
    const evidence = followupValue(form, "evidence");
    if (!summary && !nextAction && !evidence) {
      alert("请至少填写本次纪要、下一步动作或证据链接。");
      return;
    }
    const now = new Date().toLocaleString("zh-CN", { hour12: false });
    const today = new Date().toISOString().slice(0, 10);
    if (!record.opportunityOwner) applyCurrentAccountToOpportunity(record);
    record.opportunityLastContactAt = today;
    if (nextAction) record.opportunityNextAction = nextAction;
    if (nextActionAt) record.opportunityNextActionAt = nextActionAt;
    if (evidence) {
      record.opportunityEvidence = [record.opportunityEvidence, `${now} ${followupType}：${evidence}`].filter(Boolean).join("\n");
    }
    if (summary) {
      record.opportunityNote = [`${now} ${followupType}：${summary}`, record.opportunityNote].filter(Boolean).join("\n");
    }
    touchOpportunity(record);
    const customer = record.customerId ? crmWorkspace.customers.find((item) => item.id === record.customerId) : null;
    if (customer) {
      if (nextAction) customer.nextAction = nextAction;
      if (nextActionAt) customer.nextActionAt = nextActionAt;
      if (summary) customer.note = [`${now} ${followupType}：${summary}`, customer.note || ""].filter(Boolean).join("\n");
      customer.status = customer.status === "新线索" || customer.status === "已触达" ? "评级中" : customer.status;
      customer.updatedAt = now;
    }
    persistRecords();
    persistCrmWorkspace();
    appendCrmActivity({
      type: "手动跟进",
      title: `${followupType}记录`,
      detail: [summary, nextAction ? `下一步：${nextAction}` : "", nextActionAt ? `日期：${nextActionAt}` : "", evidence ? "已补证据" : ""].filter(Boolean).join(" · "),
      pointName: record.spotName || record.opportunityPointScope || "",
      recordId: record.id || "",
      targetType: "record",
      targetId: record.id || "",
      ownerId: record.opportunityOwnerId || record.accountId || "",
      ownerName: record.opportunityOwner || record.operatorName || "",
      tone: nextActionAt ? "mid-high" : "neutral"
    });
    const key = recordKey(record, index);
    activeRecordPanels[key] = "claim";
    flashContextToolbar("已保存跟进记录");
    renderRecords();
    renderCrmWorkspace();
    renderContextToolbar();
  }

  function recordResult(record) {
    const inputs = recordInputs(record);
    if (!inputs) return null;
    try {
      return XJCore.calculate(data, inputs);
    } catch (error) {
      console.warn("测算记录重算失败。", error);
      return null;
    }
  }

  function recordSnapshot(result) {
    return {
      grade: result.scenario.grade,
      score: XJCore.round(result.scenario.score, 1),
      t0Score: result.scenario.t0Score,
      t1Score: result.scenario.t1Score,
      t2Score: result.scenario.t2Score,
      retail: result.pricing.retail,
      judgement: result.pricing.judgement,
      purchaseStatus: result.purchase.status,
      policyType: result.business.policyType,
      monthlyCommission: result.commission.monthlyCommission,
      bonus: result.commission.bonus,
      income: result.commission.income,
      businessDeduction: result.business.negotiatedDeduction,
      commissionScheme: result.commission.scheme
    };
  }

  function syncRecordSummary(record, result) {
    record.spotName = result.inputs.scenario.spotName;
    record.productId = result.cost.product.id;
    record.productName = result.cost.product.name;
    record.grade = `${result.scenario.grade} ${XJCore.round(result.scenario.score, 1)}分`;
    record.retail = result.pricing.retail;
    record.judgement = result.pricing.judgement;
    record.purchaseStatus = result.purchase.status;
    record.policyType = result.business.policyType;
    record.monthlyCommission = result.commission.monthlyCommission;
    record.businessDeduction = result.business.negotiatedDeduction;
    record.income = result.commission.income;
    record.snapshot = recordSnapshot(result);
  }

  function recordChannelControlsHtml(record, index, result) {
    const inputs = recordInputs(record);
    if (!inputs) return "";
    const channel = inputs.channel;
    const attr = (key) => `data-record-channel="${index}" data-record-field="${escapeHtml(key)}" data-record-original="${escapeHtml(channel[key] ?? "")}"`;
    const modeOptions = Object.keys(data.rules.commissionRates).map((name) => ({ value: name, label: name }));
    const gradeOptions = [{ value: "", label: `自动 · ${result.scenario.grade}` }].concat(
      ruleGradeOrder().map((grade) => ({ value: grade, label: grade }))
    );
    const priceOptions = [{ value: 0, label: `自动推荐 · ${money(result.pricing.suggestedRetail)}` }].concat(
      data.rules.priceOptions.map((price) => ({ value: price, label: money(price) }))
    );
    const policyOptions = [
      { value: "标准商务条件", label: "标准商务条件" },
      { value: "试点优惠政策", label: "试点优惠政策" },
      { value: "资源置换政策", label: "资源置换政策" }
    ];
    const commonControls = [
      field("合作模式", selectInput(channel.mode, modeOptions, attr("mode"))),
      field("点位等级", selectInput(channel.gradeOverride, gradeOptions, attr("gradeOverride"))),
      field("零售价", selectInput(channel.retailOverride, priceOptions, attr("retailOverride")))
    ];
    const consignmentControls = commonControls.concat([
      field("政策类型", selectInput(channel.policyType || "标准商务条件", policyOptions, attr("policyType"))),
      field("实际/拟谈扣点(%)", numberInput({ value: channel.negotiatedDeduction, min: 0, max: 85, step: 1, attr: `${attr("negotiatedDeduction")} placeholder="空=等级基准"` }), `等级基准 ${percent(result.business.baselineDeduction)}`),
      field("最高3个月销售回款额", numberInput({ value: channel.top3SalesReceipt, min: 0, step: 100, attr: `${attr("top3SalesReceipt")} placeholder="空=月销售额×3"` }), "上线后6个月内最高3个月"),
      field("本点位销售商务成本", numberInput({ value: channel.pointBusinessCost, min: 0, step: 100, attr: attr("pointBusinessCost") })),
      field("辅助月销售额", numberInput({ value: channel.monthlySales, min: 0, step: 100, attr: attr("monthlySales") })),
      field("铺货数量", numberInput({ value: channel.stockQty, min: 0, step: 1, attr: attr("stockQty") })),
      field("当月销售数量", numberInput({ value: channel.soldQty, min: 0, step: 1, attr: attr("soldQty") })),
      field("保证金", numberInput({ value: channel.deposit, min: 0, step: 100, attr: attr("deposit") }))
    ]);
    const procurementControls = commonControls.concat([
      field("采购数量", numberInput({ value: channel.purchaseQty, min: 0, step: 1, attr: attr("purchaseQty") })),
      field("总采购量", numberInput({ value: channel.totalPurchaseQty, min: 0, step: 1, attr: attr("totalPurchaseQty") })),
      field("采购回款额", numberInput({ value: channel.purchaseReceiptAmount, min: 0, step: 100, attr: `${attr("purchaseReceiptAmount")} placeholder="空=标准采购小计"` }), "按单次采购回款额匹配提成阶梯"),
      field("客户类型", selectInput(channel.customerType || "新客户", [{ value: "新客户", label: "新客户/首次采购" }, { value: "老客户", label: "老客户/复购采购" }], attr("customerType")), `老客户系数 ${percent(data.rules.repeatCustomerFactor || 0.5)}`),
      field("产品大类", selectInput(channel.productClassOverride, [{ value: "", label: `自动 · ${result.cost.product.productClass}` }, { value: "大瓦", label: "大瓦" }, { value: "小瓦", label: "小瓦" }], attr("productClassOverride"))),
      field("产品类型", selectInput(channel.productTypeOverride, [{ value: "", label: `自动 · ${result.cost.product.productType}` }, { value: "手绘款", label: "手绘款" }, { value: "工艺款", label: "工艺款" }], attr("productTypeOverride")))
    ]);
    return (String(channel.mode).includes("寄售") ? consignmentControls : procurementControls).join("");
  }

  function recordOpportunityControlsHtml(record, index) {
    ensureOpportunityFields(record);
    const canEdit = accountCanEditOpportunity(record) || accountCanApprove();
    const canCreateContract = canEdit && opportunityCanCreateContract(record) && accountCanModuleAction("contracts", "edit");
    const canCreateOrder = canEdit && opportunityCanCreateOrder(record) && accountCanModuleAction("orders", "edit");
    const canCreateSales = canEdit && opportunityCanCreateSales(record) && accountCanModuleAction("storeSales", "edit");
    const disabled = canEdit ? "" : " disabled";
    const attr = (key) => `data-record-crm="${index}" data-record-field="${escapeHtml(key)}" data-record-original="${escapeHtml(record[key] ?? "")}"${disabled}`;
    const optionMap = (values) => values.map((value) => ({ value, label: value }));
    const submitLabel = record.opportunityStatus === "报备待审" ? "更新报备" : record.opportunityStatus === "报备驳回/补充材料" ? "重新提交报备" : "提交报备";
    const canApprovePending = accountCanApprove() && record.opportunityStatus === "报备待审";
    return `
      <div class="record-opportunity-actions">
        <button type="button" class="primary" data-record-op-action="claim" data-record-index="${index}"${!hasAccount() || (!isPublicOpportunity(record) && !accountCanEditOpportunity(record)) ? " disabled" : ""}>${isPublicOpportunity(record) ? "认领" : "更新认领"}</button>
        <button type="button" data-record-op-action="submit" data-record-index="${index}"${!accountCanEditOpportunity(record) ? " disabled" : ""}>${escapeHtml(submitLabel)}</button>
        <button type="button" data-record-op-action="approve" data-record-index="${index}"${canApprovePending ? "" : " disabled"}>报备通过</button>
        <button type="button" data-record-op-action="reject" data-record-index="${index}"${canApprovePending ? "" : " disabled"}>驳回补充</button>
        <button type="button" data-record-op-action="release" data-record-index="${index}"${!accountCanEditOpportunity(record) ? " disabled" : ""}>退回公海</button>
        <button type="button" data-record-pipeline="contract" data-record-index="${index}"${!canCreateContract ? " disabled" : ""}>生成合同</button>
        <button type="button" data-record-pipeline="order" data-record-index="${index}"${!canCreateOrder ? " disabled" : ""}>生成订单/MES</button>
        <button type="button" data-record-pipeline="sales" data-record-index="${index}"${!canCreateSales ? " disabled" : ""}>建门店销售</button>
      </div>
      ${opportunityApprovalChecklistHtml(record)}
      ${canEdit ? "" : `<p class="record-permission-note">当前账号只能查看，不能编辑这条点位机会。</p>`}
      <div class="form-grid record-opportunity-controls">
        ${field("机会状态", selectInput(record.opportunityStatus, optionMap(opportunityStatusOptions()), attr("opportunityStatus")))}
        ${field("跟进阶段", selectInput(record.opportunityStage, optionMap(opportunityStageOptions()), attr("opportunityStage")))}
        ${field("认领/负责人", `<input type="text" value="${escapeHtml(record.opportunityOwner || "")}" ${attr("opportunityOwner")} placeholder="销售/渠道姓名">`, "不填负责人不能长期保护点位")}
        ${field("保护期至", `<input type="date" value="${escapeHtml(record.opportunityProtectionUntil || "")}" ${attr("opportunityProtectionUntil")}>`, "临时认领14天，报备通过30天起")}
        ${field("点位颗粒度", `<input type="text" value="${escapeHtml(record.opportunityPointScope || "")}" ${attr("opportunityPointScope")} placeholder="父级/子级片区/具体门店">`, "不要只写父级景区，尽量到子级片区或具体门店")}
        ${field("联系人角色", selectInput(record.opportunityContactRole, optionMap(opportunityContactRoleOptions()), attr("opportunityContactRole")))}
        ${field("联系人/渠道", `<input type="text" value="${escapeHtml(record.opportunityContactName || "")}" ${attr("opportunityContactName")} placeholder="姓名/微信名/机构">`)}
        ${field("最近沟通日期", `<input type="date" value="${escapeHtml(record.opportunityLastContactAt || "")}" ${attr("opportunityLastContactAt")}>`)}
        ${field("下一步动作", `<input type="text" value="${escapeHtml(record.opportunityNextAction || "")}" ${attr("opportunityNextAction")} placeholder="如：约会议、发报价、补授权资料">`)}
        ${field("下一步日期", `<input type="date" value="${escapeHtml(record.opportunityNextActionAt || "")}" ${attr("opportunityNextActionAt")}>`)}
        ${field("证据/链接", `<textarea rows="2" ${attr("opportunityEvidence")} placeholder="聊天截图说明、飞书/微信/会议纪要链接">${escapeHtml(record.opportunityEvidence || "")}</textarea>`, "没有证据只算临时认领")}
        ${field("备注", `<textarea rows="2" ${attr("opportunityNote")} placeholder="商务阻力、资源条件、审批风险">${escapeHtml(record.opportunityNote || "")}</textarea>`)}
      </div>`;
  }

  function recordActivityTrail(record) {
    const key = record && record.id;
    const pointName = record && (record.spotName || record.opportunityPointScope);
    const activities = recentCrmActivities(8, (activity) =>
      key && activity.recordId === key
      || pointName && activity.pointName === pointName
    );
    return `<div class="record-activity-trail">
      <div class="record-detail-head"><strong>跟进时间线</strong><span>保存、认领、报备、合同、订单和销售跟踪动作</span></div>
      ${renderActivityFeed(activities, "暂无跟进动态")}
    </div>`;
  }

  function recordFollowupFormHtml(record, index) {
    const canEdit = accountCanEditOpportunity(record) || accountCanApprove();
    const disabled = canEdit ? "" : " disabled";
    return `<div class="record-followup-form" data-record-followup-form="${index}">
      <div class="record-detail-head"><strong>新增跟进记录</strong><span>沉淀本次沟通、证据和下一步动作</span></div>
      <div class="form-grid record-followup-grid">
        ${field("跟进方式", selectInput("微信沟通", followupTypeOptions().map((value) => ({ value, label: value })), `data-followup-field="type"${disabled}`))}
        ${field("下一步动作", `<input type="text" data-followup-field="nextAction" placeholder="如：约现场会、发报价、补授权资料"${disabled}>`)}
        ${field("下一步日期", `<input type="date" data-followup-field="nextActionAt"${disabled}>`)}
        ${field("证据/链接", `<input type="text" data-followup-field="evidence" placeholder="聊天截图说明、会议纪要、飞书/微信链接"${disabled}>`)}
        ${field("本次纪要", `<textarea rows="3" data-followup-field="summary" placeholder="记录对方反馈、阻力、资源承诺、需要内部配合的事项"${disabled}></textarea>`, "会同步写入机会时间线")}
      </div>
      <div class="record-followup-actions">
        <button type="button" class="primary" data-record-followup-submit="${index}"${disabled}>保存跟进</button>
        <small>${canEdit ? "保存后会更新最近沟通日期和客户/机会下一步。" : "当前账号只能查看，不能新增跟进。"}</small>
      </div>
    </div>`;
  }

  function recordDetailHtml(record, index, panel, result) {
    if (!panel) return "";
    if (panel === "claim") {
      return `<div class="record-detail-panel" data-record-panel="claim">
        <div class="record-detail-head"><strong>认领报备</strong><span>用于公海保护、商务推进和团队漏斗管理</span></div>
        ${recordOpportunityControlsHtml(record, index)}
        ${recordFollowupFormHtml(record, index)}
        ${recordActivityTrail(record)}
      </div>`;
    }
    if (!result) {
      return `<div class="record-detail-panel">
        <p class="empty">这条旧记录只保存了摘要，缺少当时完整的景区填报和商务测算快照。请重新保存一次测算后，即可在记录里展开商务条件和模拟提成测算。</p>
      </div>`;
    }
    if (panel === "business") {
      return `<div class="record-detail-panel" data-record-panel="business">
        <div class="record-detail-head"><strong>商务条件</strong><span>依据本条记录的景区评级自动生成</span></div>
        ${businessGuidanceHtml(result)}
      </div>`;
    }
    return `<div class="record-detail-panel" data-record-panel="commission">
      <div class="record-detail-head"><strong>模拟提成测算</strong><span>只调整和保存本条记录，不影响场景评级当前填报</span></div>
      <div class="form-grid record-channel-controls">${recordChannelControlsHtml(record, index, result)}</div>
      <div class="summary-strip record-commission-strip">${commissionSummaryHtml(result)}</div>
      ${commissionResultsHtml(result)}
    </div>`;
  }

  function renderRecords() {
    if (!accountHasPermission("opportunities", "view")) {
      setHtml("recordsList", permissionGateHtml("没有点位机会权限", "点位机会包含公海池、认领报备、商务推进和测算归档。"));
      setHtml("scenarioRecordsList", permissionGateHtml("没有点位机会权限", "点位机会包含公海池、认领报备、商务推进和测算归档。"));
      return;
    }
    records.forEach((record) => ensureOpportunityFields(record));
    const visibleRecords = records.filter((record) => accountCanViewAll() || isPublicOpportunity(record) || accountMatchesRecord(record));
    const publicCount = records.filter(isPublicOpportunity).length;
    const myCount = hasAccount() ? records.filter(accountOwnsRecord).length : 0;
    const claimedCount = visibleRecords.filter((record) => ["已认领", "报备待审", "报备驳回/补充材料"].includes(record.opportunityStatus)).length;
    const activeCount = visibleRecords.filter((record) => ["报备通过", "商务洽谈", "条件审批"].includes(record.opportunityStatus)).length;
    const signedCount = visibleRecords.filter((record) => ["已签约/待落地", "运营中"].includes(record.opportunityStatus)).length;
    const funnelCount = records.filter((record) => !isPublicOpportunity(record) && (accountCanViewAll() || accountMatchesRecord(record))).length;
    const viewTabs = [
      { key: "pool", label: "公海池", count: publicCount },
      { key: "mine", label: "我的跟进", count: myCount },
      { key: "funnel", label: opportunityFunnelLabel(), count: funnelCount },
      { key: "history", label: "测算归档", count: visibleRecords.length }
    ];
    const filteredRecords = records
      .map((record, index) => ({ record, index }))
      .filter(({ record }) => opportunityMatchesView(record));
    const account = currentAccount();
    const headerHtml = `
      <section class="opportunity-dashboard">
        <div><span>当前账号</span><strong>${escapeHtml(hasAccount() ? account.name : "未登录")}</strong><small>${escapeHtml(hasAccount() ? `${account.role} · ${account.team || "未分组"} · ${currentAccountScopeText()}` : "先选择账号再保存")}</small></div>
        <div><span>可见机会</span><strong>${visibleRecords.length}</strong><small>${escapeHtml(opportunityVisibleScopeText())}</small></div>
        <div><span>公海池</span><strong>${publicCount}</strong><small>可认领报备</small></div>
        <div><span>认领/报备</span><strong>${claimedCount}</strong><small>需补证据与动作</small></div>
        <div><span>洽谈/审批</span><strong>${activeCount}</strong><small>保护期内推进</small></div>
        <div><span>签约/运营</span><strong>${signedCount}</strong><small>转落地台账跟踪</small></div>
      </section>
      <nav class="opportunity-tabs" aria-label="点位机会视图">
        ${viewTabs.map((tab) => `<button type="button" class="${activeRecordView === tab.key ? "active" : ""}" data-record-view="${escapeHtml(tab.key)}">${escapeHtml(tab.label)} · ${tab.count}</button>`).join("")}
      </nav>`;
    const listHtml = filteredRecords.length ? filteredRecords.map(({ record, index }) => {
      const key = recordKey(record, index);
      const activePanel = activeRecordPanels[key] || "";
      const result = recordResult(record);
      ensureOpportunityFields(record, result);
      const spotName = result ? result.inputs.scenario.spotName : record.spotName;
      const productText = result ? `${result.cost.product.id} · ${result.cost.product.name}` : `${record.productId || "未记录"} · ${record.productName || "产品未记录"}`;
      const gradeText = result ? `${result.scenario.grade} ${XJCore.round(result.scenario.score, 1)}分` : record.grade;
      const retail = result ? result.pricing.retail : record.retail;
      const commission = result ? result.commission.monthlyCommission : record.monthlyCommission;
      const summaryText = result
        ? `${result.pricing.judgement} · ${result.purchase.status} · ${result.business.policyType} · 扣点${percent(result.business.negotiatedDeduction)}`
        : `${record.judgement || "判断未记录"} · ${record.purchaseStatus || "采购未记录"} · ${record.policyType || "政策未记录"} · ${record.businessDeduction !== undefined ? `扣点${percent(record.businessDeduction)}` : "扣点未记录"}`;
      const ownerText = record.opportunityOwner || (isPublicOpportunity(record) ? "可认领" : "未填负责人");
      const nextActionText = record.opportunityNextAction || (isPublicOpportunity(record) ? "待认领报备" : "待填写下一步动作");
      const protectText = record.opportunityProtectionUntil ? `保护至 ${record.opportunityProtectionUntil}` : "未设置保护期";
      const deleteButton = accountCanDeleteRecord(record) ? `<button type="button" data-delete-record="${index}">删除</button>` : "";
      return `<article class="record-card">
        <div class="record-row opportunity-row">
          <div class="record-cell">
            <span>${escapeHtml(record.time || "未记录时间")}</span>
            <small>${escapeHtml(record.accountRole || "测算人")} ${escapeHtml(record.operatorName || "未填")}</small>
          </div>
          <div class="record-cell">
            <span class="stage-pill ${opportunityTone(record)}">${escapeHtml(record.opportunityStatus)}</span>
            <small>${escapeHtml(ownerText)}${record.opportunityTeam ? ` · ${escapeHtml(record.opportunityTeam)}` : ""}</small>
          </div>
          <div class="record-cell">
            <strong>${escapeHtml(spotName || "未命名点位")}</strong>
            <small>${escapeHtml(record.opportunityPointScope || "待细化到具体点位")}</small>
          </div>
          <div class="record-cell">
            <b>${escapeHtml(gradeText || "未评级")} / ${money(retail || 0)} / ${money(commission || 0)}</b>
            <small>${escapeHtml(productText)}</small>
          </div>
          <div class="record-cell">
            <span>${escapeHtml(record.opportunityStage)} · ${escapeHtml(nextActionText)}</span>
            <small>${escapeHtml(protectText)}</small>
          </div>
          <div class="record-cell record-summary-cell">
            <span>${escapeHtml(summaryText)}</span>
          </div>
          <div class="row-actions record-actions">
            <button type="button" class="${activePanel === "claim" ? "active" : ""}" data-record-detail="${index}" data-record-panel="claim">${isPublicOpportunity(record) ? "认领报备" : "跟进报备"}</button>
            <button type="button" class="${activePanel === "business" ? "active" : ""}" data-record-detail="${index}" data-record-panel="business">商务条件</button>
            <button type="button" class="${activePanel === "commission" ? "active" : ""}" data-record-detail="${index}" data-record-panel="commission">模拟提成</button>
            ${deleteButton}
          </div>
        </div>
        ${recordDetailHtml(record, index, activePanel, result)}
      </article>`;
    }).join("") : `<p class="empty">${records.length ? (hasAccount() ? "当前视图暂无点位机会" : "请先在顶部选择账号，再查看自己的点位机会") : "暂无测算记录，保存测算后会进入点位机会池"}</p>`;
    const html = headerHtml + listHtml;
    setHtml("recordsList", html);
    setHtml("scenarioRecordsList", html);
  }

  function parseChannelValue(target, key) {
    const nullableNumbers = ["negotiatedDeduction", "monthlySales", "top3SalesReceipt", "purchaseReceiptAmount"];
    if (target.type === "number" || key === "retailOverride") {
      if (target.value === "" && nullableNumbers.includes(key)) return "";
      return Number(target.value);
    }
    return target.value;
  }

  function updateRecordChannel(target, options = {}) {
    const index = Number(target.dataset.recordChannel);
    const key = target.dataset.recordField;
    const record = records[index];
    if (!record || !key) return;
    const inputs = recordInputs(record);
    if (!inputs) return;
    inputs.channel[key] = parseChannelValue(target, key);
    record.inputs = XJCore.clone(inputs);
    const result = XJCore.calculate(data, inputs);
    syncRecordSummary(record, result);
    persistRecords();
    target.dataset.recordOriginal = String(target.value ?? "");
    if (options.render !== false) renderRecords();
  }

  function setPath(target, path, value, isCheckbox) {
    const parts = path.split(".");
    let cursor = target;
    for (let index = 0; index < parts.length - 1; index += 1) {
      cursor = cursor[parts[index]];
    }
    const finalKey = parts[parts.length - 1];
    if (isCheckbox) {
      cursor[finalKey] = Boolean(value);
      return;
    }
    const current = cursor[finalKey];
    if (typeof current === "number") {
      cursor[finalKey] = Number(value);
    } else {
      cursor[finalKey] = value;
    }
  }

  function scoringOptionRenameInfo(path) {
    const match = String(path).match(/^scoring\.([^.]+)\.options\.(\d+)\.label$/);
    if (!match) return null;
    const key = match[1];
    const index = Number(match[2]);
    const group = data.rules.scoring && data.rules.scoring[key];
    const option = group && Array.isArray(group.options) ? group.options[index] : null;
    if (!option) return null;
    return { key, option, oldLabel: String(option.label || "") };
  }

  function migrateOptionLabelReferences(key, oldLabel, newLabel) {
    const oldValue = String(oldLabel || "").trim();
    const newValue = String(newLabel || "").trim();
    if (!oldValue || !newValue || oldValue === newValue) return;
    let scenicChanged = false;
    let recordsChanged = false;
    if (state.scenario && state.scenario[key] === oldValue) state.scenario[key] = newValue;
    data.scenicSpots.forEach((spot) => {
      if (spot[key] === oldValue) {
        spot[key] = newValue;
        scenicChanged = true;
      }
    });
    records.forEach((record) => {
      [record.inputs, record.state].forEach((inputs) => {
        if (inputs && inputs.scenario && inputs.scenario[key] === oldValue) {
          inputs.scenario[key] = newValue;
          recordsChanged = true;
        }
      });
    });
    if (key === "scenicType" && scenicTypeFilter === oldValue) scenicTypeFilter = newValue;
    if (key === "tileRelevance" && scenicTileFilter === oldValue) scenicTileFilter = newValue;
    persistState();
    if (scenicChanged) persistScenicSpots();
    if (recordsChanged) persistRecords();
  }

  function preserveOptionAliasForRename(path, nextLabel) {
    const info = scoringOptionRenameInfo(path);
    if (!info) return;
    const oldLabel = info.oldLabel.trim();
    const newLabel = String(nextLabel || "").trim();
    if (!oldLabel || !newLabel || oldLabel === newLabel) return;
    const aliases = Array.isArray(info.option.aliases) ? info.option.aliases : [];
    if (!aliases.includes(oldLabel)) info.option.aliases = aliases.concat(oldLabel);
    migrateOptionLabelReferences(info.key, oldLabel, newLabel);
  }

  function refreshRulesUi() {
    persistRules();
    persistState();
    renderScenarioControls();
    renderPricing();
    renderSettings();
    updateCalculatedViews();
    renderUiEditor();
    renderContextToolbar();
    applyUiLayout();
  }

  function addRuleItem(target) {
    if (target === "gradeParams") {
      const grades = Object.keys(data.rules.gradeParams || {});
      const newGrade = nextRuleName("X", grades);
      const ordered = ruleGradeOrder();
      const seed = data.rules.gradeParams[ordered[ordered.length - 1]] || data.rules.gradeParams.D || {};
      data.rules.gradeParams[newGrade] = cloneGradeParam({
        ...seed,
        threshold: Math.max(0, Number(seed.threshold || 0) - 5),
        mode: "新增等级合作模式",
        commercialTerms: "待设置"
      });
      data.rules.expansionBonuses = data.rules.expansionBonuses || {};
      data.rules.expansionBonuses[newGrade] = 0;
      refreshRulesUi();
      return;
    }
    const current = ruleValueAt(target);
    if (Array.isArray(current)) {
      current.push(cloneRuleItem(target));
      refreshRulesUi();
      return;
    }
    if (current && typeof current === "object") {
      const used = Object.keys(current);
      const key = nextRuleName(target === "commissionRates" ? "新增模式" : target === "expansionBonuses" ? "新等级" : "新增项", used);
      current[key] = target === "commissionRates" ? 0.1 : target === "expansionBonuses" ? 0 : 1;
      refreshRulesUi();
    }
  }

  function deleteRuleItem(target, key) {
    if (!confirm("删除该规则项？")) return;
    if (target === "gradeParams") {
      const grades = Object.keys(data.rules.gradeParams || {});
      if (grades.length <= 1) {
        alert("至少保留一个等级。");
        return;
      }
      delete data.rules.gradeParams[key];
      if (data.rules.expansionBonuses) delete data.rules.expansionBonuses[key];
      if (state.channel.gradeOverride === key) state.channel.gradeOverride = "";
      refreshRulesUi();
      return;
    }
    const current = ruleValueAt(target);
    if (Array.isArray(current)) {
      if (current.length <= 1) {
        alert("至少保留一条规则。");
        return;
      }
      current.splice(Number(key), 1);
      refreshRulesUi();
      return;
    }
    if (current && typeof current === "object") {
      const keys = Object.keys(current);
      if (keys.length <= 1) {
        alert("至少保留一条规则。");
        return;
      }
      delete current[key];
      if (target === "commissionRates" && state.channel.mode === key) state.channel.mode = Object.keys(current)[0] || "";
      if (target === "dataQualityFactors" && state.channel.dataQuality === key) state.channel.dataQuality = Object.keys(current)[0] || "";
      if (target === "paymentFactors" && state.channel.paymentTerm === key) state.channel.paymentTerm = Object.keys(current)[0] || "";
      refreshRulesUi();
    }
  }

  function sanitizeRuleKey(value, fallback) {
    const cleaned = String(value || "").trim().replaceAll(".", "·");
    return cleaned || fallback;
  }

  function renameGrade(oldGrade, nextGrade) {
    const grade = sanitizeRuleKey(nextGrade, oldGrade);
    if (grade === oldGrade) return;
    if (data.rules.gradeParams[grade]) {
      alert("等级名称已存在。");
      renderSettings();
      return;
    }
    data.rules.gradeParams[grade] = data.rules.gradeParams[oldGrade];
    delete data.rules.gradeParams[oldGrade];
    if (data.rules.expansionBonuses && data.rules.expansionBonuses[oldGrade] !== undefined) {
      data.rules.expansionBonuses[grade] = data.rules.expansionBonuses[oldGrade];
      delete data.rules.expansionBonuses[oldGrade];
    }
    if (state.channel.gradeOverride === oldGrade) state.channel.gradeOverride = grade;
    refreshRulesUi();
  }

  function renameRuleMapKey(target, oldKey, nextKey, baseName) {
    const current = ruleValueAt(target);
    if (!current || typeof current !== "object") return;
    const key = sanitizeRuleKey(nextKey, oldKey || baseName || "新增项");
    if (key === oldKey) return;
    if (current[key]) {
      alert("名称已存在。");
      renderSettings();
      return;
    }
    current[key] = current[oldKey];
    delete current[oldKey];
    if (target === "commissionRates" && state.channel.mode === oldKey) state.channel.mode = key;
    if (target === "dataQualityFactors" && state.channel.dataQuality === oldKey) state.channel.dataQuality = key;
    if (target === "paymentFactors" && state.channel.paymentTerm === oldKey) state.channel.paymentTerm = key;
    refreshRulesUi();
  }

  function setActiveView(viewName) {
    const viewNames = qsa("section[data-view]").map((section) => section.dataset.view);
    const requestedView = viewNames.includes(viewName) ? viewName : firstAccessibleView("scenario");
    activeView = canAccessView(requestedView) ? requestedView : firstAccessibleView(requestedView);
    closeUiEditorIfScopeChanged();
    qsa("section[data-view]").forEach((view) => {
      view.hidden = view.dataset.view !== activeView;
    });
    qsa(".view-tabs button[data-view-target]").forEach((button) => {
      const panel = button.dataset.crmPanelTarget;
      const isActive = button.dataset.viewTarget === activeView
        && (!panel || activeView !== "crm" || panel === activeCrmPanel);
      button.classList.toggle("active", isActive);
    });
    qsa("[data-nav-group]").forEach((group) => {
      const views = String(group.dataset.navViews || "").split(/\s+/).filter(Boolean);
      const isActiveGroup = views.includes(activeView);
      group.classList.toggle("active", isActiveGroup);
      const trigger = group.querySelector("[data-nav-primary]");
      if (trigger) trigger.classList.toggle("active", isActiveGroup);
    });
    qsa(".mobile-tab-bar button[data-view-target]").forEach((button) => {
      const views = String(button.dataset.navViews || button.dataset.viewTarget || "").split(/\s+/).filter(Boolean);
      button.classList.toggle("active", views.includes(activeView));
    });
    renderContextToolbar();
    applyUiLayout();
  }

  function setActiveScenarioPanel(panelName) {
    const panels = qsa("[data-scenario-panel-view]").map((panel) => panel.dataset.scenarioPanelView);
    activeScenarioPanel = panels.includes(panelName) ? panelName : "save";
    closeUiEditorIfScopeChanged();
    qsa("[data-scenario-panel-view]").forEach((panel) => {
      panel.hidden = panel.dataset.scenarioPanelView !== activeScenarioPanel;
    });
    qsa("[data-scenario-panel]").forEach((button) => {
      button.classList.toggle("active", button.dataset.scenarioPanel === activeScenarioPanel);
    });
    renderContextToolbar();
    applyUiLayout();
  }

  function setActiveProductPanel(panelName) {
    const panels = ["category", "sku", "measured"];
    activeProductPanel = panels.includes(panelName) ? panelName : "category";
    closeUiEditorIfScopeChanged();
    qsa("[data-product-panel]").forEach((button) => {
      button.classList.toggle("active", button.dataset.productPanel === activeProductPanel);
    });
    renderContextToolbar();
    applyUiLayout();
  }

  function closeNavGroups(exceptGroup = null) {
    qsa("[data-nav-group]").forEach((group) => {
      if (group !== exceptGroup) {
        group.classList.remove("open");
        const trigger = group.querySelector("[data-nav-primary], [data-layout-open]");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  function selectProduct(productId) {
    state.productId = productId;
    persistState();
    renderApp();
  }

  function mergeCurrentResultIntoOpportunity(match, result) {
    const record = match && match.record;
    const index = match && Number(match.index);
    if (!record) return false;
    ensureOpportunityFields(record, result);
    const account = currentAccount();
    const previousStatus = record.opportunityStatus || "未建状态";
    const wasPublic = isPublicOpportunity(record);
    const wasUnassigned = !ownerIdentityFromRow(record).id && !ownerIdentityFromRow(record).name;
    record.inputs = XJCore.clone(result.inputs);
    syncRecordSummary(record, result);
    ensureOpportunityFields(record, result);
    record.opportunityPointScope = scenarioPointScope(result.inputs.scenario, result.inputs.scenario.spotName);
    record.operatorName = record.operatorName || account.name;
    record.accountId = record.accountId || account.id;
    record.accountRole = record.accountRole || account.role;
    record.accountTeam = record.accountTeam || account.team;
    if (wasPublic || wasUnassigned) {
      record.opportunityStatus = "已认领";
      record.opportunityStage = "线索确认";
      record.opportunityOwner = account.name;
      record.opportunityOwnerId = account.id;
      record.opportunityOwnerRole = account.role;
      record.opportunityTeam = account.team;
      record.opportunityClaimedAt = record.opportunityClaimedAt || new Date().toLocaleString("zh-CN", { hour12: false });
      updateOpportunityProtection(record, 14);
    }
    record.opportunityNextAction = record.opportunityNextAction || "3天内完成首次触达并补齐授权/店位/商务条件";
    record.opportunityNextActionAt = record.opportunityNextActionAt || crmDatePlusDays("", 3);
    if (!record.opportunityProtectionUntil) updateOpportunityProtection(record, 14);
    touchOpportunity(record);
    const customer = ensureCrmCustomerForRecord(record, result);
    persistRecords();
    persistCrmWorkspace();
    appendCrmActivity({
      type: "机会防撞",
      title: wasPublic || wasUnassigned ? "认领并更新已有机会" : "合并更新已有机会",
      detail: `${record.spotName || record.opportunityPointScope} · ${previousStatus} -> ${record.opportunityStatus || "已更新"} · 未重复入库`,
      pointName: record.spotName || record.opportunityPointScope,
      recordId: record.id || "",
      targetType: "record",
      targetId: record.id || "",
      ownerId: record.opportunityOwnerId || record.accountId || "",
      ownerName: record.opportunityOwner || record.operatorName || "",
      tone: "mid-high"
    });
    appendCrmActivity({
      type: "客户客资",
      title: "测算合并客户客资",
      detail: `${customer.name} · ${customer.status || "新线索"} · ${customer.region || "区域待补"}`,
      pointName: customer.name,
      recordId: record.id || "",
      targetType: "customer",
      targetId: customer.id,
      ownerId: customer.ownerId || record.opportunityOwnerId,
      ownerName: customer.ownerName || record.opportunityOwner,
      tone: "neutral"
    });
    activeRecordView = accountOwnsRecord(record) ? "mine" : "funnel";
    activeRecordPanels[recordKey(record, index)] = "claim";
    renderRecords();
    renderCrmWorkspace();
    setActiveView("records");
    flashContextToolbar("已合并更新已有点位机会，未重复入库");
    return true;
  }

  function blockDuplicateOpportunitySave(match, result) {
    const record = match && match.record;
    if (!record) return false;
    ensureOpportunityFields(record, result);
    const canSeeOwner = accountMatchesRecord(record) || accountCanViewAll();
    const pointName = record.spotName || record.opportunityPointScope || result.inputs.scenario.spotName || "该点位";
    const ownerText = canSeeOwner ? opportunityOwnerText(record) : "受保护负责人";
    appendCrmActivity({
      type: "机会防撞",
      title: "重复报备拦截",
      detail: `${pointName} 已存在机会，负责人：${ownerText}；本次测算未新建重复记录`,
      pointName,
      recordId: record.id || "",
      targetType: "record",
      targetId: record.id || "",
      ownerId: record.opportunityOwnerId || record.accountId || "",
      ownerName: canSeeOwner ? record.opportunityOwner || record.operatorName || "" : "",
      tone: "weak"
    });
    if (canSeeOwner) {
      activeRecordView = accountOwnsRecord(record) ? "mine" : "funnel";
      activeRecordPanels[recordKey(record, match.index)] = "claim";
      renderRecords();
      setActiveView("records");
    }
    alert(`该点位已有机会记录，负责人：${ownerText}。本次测算已被防撞拦截，没有重复入库。`);
    return true;
  }

  function saveCurrentRecord() {
    const blockMessage = scenarioSaveBlockMessage();
    if (blockMessage) {
      alert(blockMessage);
      setActiveView("scenario");
      setActiveScenarioPanel(isScenarioReadyForCalculation() ? "save" : "info");
      const input = qs(!hasAccount() ? "#accountPresetSelect" : "[data-scenario='spotName']");
      if (input) input.focus();
      updateSaveRecordButtons();
      return;
    }
    syncOperatorFromAccount();
    const result = currentResult();
    const account = currentAccount();
    const collision = opportunityCollisionForResult(result);
    const sameOpportunity = collision.same[0];
    if (sameOpportunity) {
      if (canMergeOpportunityForResult(sameOpportunity.record)) {
        mergeCurrentResultIntoOpportunity(sameOpportunity, result);
        return;
      }
      blockDuplicateOpportunitySave(sameOpportunity, result);
      return;
    }
    const record = {
      id: `R${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      time: new Date().toLocaleString("zh-CN", { hour12: false }),
      operatorName: account.name,
      accountId: account.id,
      accountRole: account.role,
      accountTeam: account.team,
      inputs: XJCore.clone(result.inputs)
    };
    syncRecordSummary(record, result);
    ensureOpportunityFields(record, result);
    record.opportunityStatus = "已认领";
    record.opportunityStage = "线索确认";
    record.opportunityOwner = account.name;
    record.opportunityOwnerId = account.id;
    record.opportunityOwnerRole = account.role;
    record.opportunityTeam = account.team;
    record.opportunityPointScope = scenarioPointScope(result.inputs.scenario, result.inputs.scenario.spotName);
    record.opportunityNextAction = "3天内完成首次触达并补齐授权/店位/商务条件";
    record.opportunityNextActionAt = crmDatePlusDays("", 3);
    record.opportunityClaimedAt = record.time;
    updateOpportunityProtection(record, 14);
    const customer = ensureCrmCustomerForRecord(record, result);
    records.unshift(record);
    activeRecordView = "mine";
    activeRecordPanels[recordKey(record, 0)] = "claim";
    persistRecords();
    persistCrmWorkspace();
    appendCrmActivity({
      type: "机会跟进",
      title: "保存测算入库",
      detail: `${record.spotName || record.opportunityPointScope} · ${record.grade || "未评级"} · 默认进入我的跟进`,
      pointName: record.spotName || record.opportunityPointScope,
      recordId: record.id,
      targetType: "record",
      targetId: record.id,
      ownerId: record.opportunityOwnerId || record.accountId,
      ownerName: record.opportunityOwner || record.operatorName,
      tone: "mid-high"
    });
    appendCrmActivity({
      type: "客户客资",
      title: "测算同步客户客资",
      detail: `${customer.name} · ${customer.status || "新线索"} · ${customer.region || "区域待补"}`,
      pointName: customer.name,
      recordId: record.id,
      targetType: "customer",
      targetId: customer.id,
      ownerId: customer.ownerId || record.opportunityOwnerId,
      ownerName: customer.ownerName || record.opportunityOwner,
      tone: "neutral"
    });
    renderRecords();
    renderCrmWorkspace();
    setActiveView("records");
  }

  function downloadJson(filename, value) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadText(filename, value) {
    const blob = new Blob([String(value || "")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function workspaceBackupPayload() {
    return {
      version: WORKSPACE_BACKUP_VERSION,
      app: "寻迹万物销售工作台",
      generatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
      note: "包含本地账号配置和演示口令，仅供内部备份迁移。",
      data: {
        state: XJCore.clone(state),
        rules: XJCore.clone(data.rules),
        rulesBackups: XJCore.clone(loadJson(STORAGE_RULES_BACKUPS) || []),
        products: XJCore.clone(data.products),
        scenicSpots: XJCore.clone(data.scenicSpots),
        records: XJCore.clone(records),
        fulfillmentRecords: XJCore.clone(data.fulfillmentRecords),
        crmWorkspace: XJCore.clone(crmWorkspace),
        crmActivityLog: XJCore.clone(crmActivityLog),
        accounts: XJCore.clone(accounts),
        uiLayout: XJCore.clone(uiLayout),
        uiLayoutBackups: XJCore.clone(loadJson(STORAGE_UI_LAYOUT_BACKUPS) || [])
      }
    };
  }

  function exportWorkspaceBackup() {
    if (!accountHasPermission("accounts", "admin")) {
      alert("当前账号没有导出全量备份权限。");
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`寻迹万物销售工作台全量备份-${date}.json`, workspaceBackupPayload());
    appendCrmActivity({
      type: "系统备份",
      title: "导出全量备份",
      detail: "导出账号、CRM、机会、规则、产品、景区、发货和UI布局",
      targetType: "workspaceBackup",
      tone: "neutral"
    });
    renderAccountAdmin();
    flashContextToolbar("已导出全量备份");
  }

  function persistFullWorkspace() {
    saveJson(STORAGE_RULES, data.rules);
    saveJson(STORAGE_STATE, state);
    saveJson(STORAGE_RECORDS, records);
    saveJson(STORAGE_SCENIC_SPOTS, data.scenicSpots);
    saveJson(STORAGE_FULFILLMENT, data.fulfillmentRecords);
    saveJson(STORAGE_ACCOUNTS, accounts);
    saveJson(STORAGE_ACCOUNT_SESSION, accountSession);
    saveJson(STORAGE_CRM_WORKSPACE, crmWorkspace);
    saveJson(STORAGE_CRM_ACTIVITY, crmActivityLog);
    saveJson(STORAGE_UI_LAYOUT, uiLayout);
    window.ProductProvider.saveAllProducts(data.products);
    lastPersistedRulesSnapshot = XJCore.clone(data.rules);
    lastPersistedUiLayoutSnapshot = XJCore.clone(uiLayout);
  }

  function applyWorkspaceBackup(imported) {
    if (!accountHasPermission("accounts", "admin")) {
      alert("当前账号没有恢复全量备份权限。");
      return false;
    }
    const payload = imported && imported.data ? imported.data : imported;
    if (!payload || typeof payload !== "object" || !payload.crmWorkspace && !payload.records && !payload.accounts) {
      alert("备份文件不包含可恢复的工作台数据。");
      return false;
    }
    if (!window.confirm("恢复全量备份会覆盖当前本地账号、CRM、机会、规则、产品、景区和落地数据。确认继续？")) return false;
    if (payload.rules) data.rules = applyRuleMigrations(mergeRules(window.DEFAULT_DATA.rules, payload.rules), payload.rules);
    if (payload.products) data.products = normalizeProducts(payload.products);
    if (payload.scenicSpots) data.scenicSpots = applyScenicDataMigrations(normalizeScenicSpots(payload.scenicSpots));
    if (payload.fulfillmentRecords) data.fulfillmentRecords = normalizeFulfillmentRecords(payload.fulfillmentRecords);
    if (payload.state) state = normalizeState(payload.state);
    if (payload.records) records = Array.isArray(payload.records) ? payload.records : [];
    if (payload.accounts) accounts = normalizeAccounts(payload.accounts);
    if (payload.crmWorkspace) crmWorkspace = normalizeCrmWorkspace(payload.crmWorkspace);
    if (payload.crmActivityLog) crmActivityLog = normalizeCrmActivityLog(payload.crmActivityLog);
    if (payload.uiLayout) uiLayout = normalizeUiLayout(payload.uiLayout);
    if (payload.rulesBackups) saveJson(STORAGE_RULES_BACKUPS, Array.isArray(payload.rulesBackups) ? payload.rulesBackups : []);
    if (payload.uiLayoutBackups) saveJson(STORAGE_UI_LAYOUT_BACKUPS, Array.isArray(payload.uiLayoutBackups) ? payload.uiLayoutBackups : []);
    const current = accounts.find((account) => account.id === accountSession.id && account.status !== "停用")
      || accounts.find((account) => account.role === "管理员" && account.status !== "停用")
      || accounts[0];
    accountSession = normalizeAccountSession({
      ...current,
      authenticated: true,
      loginAt: new Date().toLocaleString("zh-CN", { hour12: false })
    });
    syncOperatorFromAccount();
    appendCrmActivity({
      type: "系统备份",
      title: "恢复全量备份",
      detail: imported && imported.generatedAt ? `恢复备份：${imported.generatedAt}` : "恢复本地工作台全量备份",
      targetType: "workspaceBackup",
      tone: "medium"
    });
    persistFullWorkspace();
    renderApp();
    flashContextToolbar("已恢复全量备份");
    return true;
  }

  async function handleWorkspaceBackupImport(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      applyWorkspaceBackup(JSON.parse(await file.text()));
    } catch (error) {
      alert("全量备份 JSON 解析失败。");
      console.warn(error);
    }
    input.value = "";
  }

  function flashContextToolbar(message) {
    const status = qs("#contextToolbarStatus");
    if (!status) return;
    status.textContent = message;
    window.clearTimeout(flashContextToolbar.timer);
    flashContextToolbar.timer = window.setTimeout(() => {
      const nextStatus = qs("#contextToolbarStatus");
      if (nextStatus) nextStatus.textContent = "";
    }, 1800);
  }

  function ruleSectionPayload(sectionKey) {
    const keys = ruleSectionFieldMap[sectionKey] || [];
    return keys.reduce((payload, key) => {
      payload[key] = XJCore.clone(data.rules[key]);
      return payload;
    }, {});
  }

  function currentContextExportPayload() {
    const result = currentResult();
    if (activeView === "scenario") {
      return { context: currentContextInfo(), result, state: XJCore.clone(state), records: activeScenarioPanel === "history" ? XJCore.clone(records) : undefined };
    }
    if (activeView === "crm") return { context: currentContextInfo(), crmWorkspace: XJCore.clone(crmWorkspace), records: XJCore.clone(records), fulfillmentRecords: XJCore.clone(data.fulfillmentRecords), crmActivityLog: XJCore.clone(crmActivityLog) };
    if (activeView === "scenic-db") return { context: currentContextInfo(), scenicSpots: XJCore.clone(data.scenicSpots) };
    if (activeView === "cost") return { context: currentContextInfo(), productId: state.productId, cost: result.cost, pricing: result.pricing };
    if (activeView === "pricing") return { context: currentContextInfo(), state: XJCore.clone(state), pricing: result.pricing, business: result.business, purchase: result.purchase, commission: result.commission };
    if (activeView === "records") return { context: currentContextInfo(), records: XJCore.clone(records), crmActivityLog: XJCore.clone(crmActivityLog) };
    if (activeView === "fulfillment") return { context: currentContextInfo(), fulfillmentRecords: XJCore.clone(data.fulfillmentRecords) };
    if (activeView === "products") {
      if (activeProductPanel === "sku") return { context: currentContextInfo(), skuData: XJCore.clone(skuData) };
      return { context: currentContextInfo(), products: XJCore.clone(data.products) };
    }
    if (activeView === "settings") return { context: currentContextInfo(), ruleSection: activeRuleSection, rules: ruleSectionPayload(activeRuleSection) };
    if (activeView === "accounts") return { context: currentContextInfo(), accounts: XJCore.clone(accounts), currentAccount: XJCore.clone(currentAccount()), crmActivityLog: XJCore.clone(crmActivityLog) };
    return { context: currentContextInfo(), state: XJCore.clone(state) };
  }

  function saveCurrentContext() {
    if (activeView === "crm") {
      persistCrmWorkspace();
      persistRecords();
      persistFulfillmentRecords();
      persistCrmActivityLog();
      persistUiLayout("保存销售CRM页面UI");
      flashContextToolbar("已保存CRM链路数据");
      return;
    }
    if (activeView === "scenario") {
      persistState();
      persistUiLayout("保存场景评级页面UI");
      saveCurrentRecord();
      return;
    }
    if (activeView === "scenic-db") {
      persistScenicSpots();
      persistUiLayout("保存景区库页面UI");
      flashContextToolbar("已保存当前景区库");
      return;
    }
    if (activeView === "products") {
      if (activeProductPanel === "measured" && editingProductId) {
        saveProductFromEditor({ flash: true });
        return;
      }
      window.ProductProvider.saveAllProducts(data.products);
      persistUiLayout("保存产品库页面UI");
      flashContextToolbar(activeProductPanel === "sku" ? "SKU总表为同步数据，已保留当前产品库" : "已保存当前产品页");
      return;
    }
    if (activeView === "settings") {
      if (activeRuleSection === "price") data.rules.scenarioPriceBands = alignScenarioBandsWithGrades(data.rules.scenarioPriceBands);
      persistRules("保存当前规则域");
      persistUiLayout("保存规则参数页面UI");
      flashContextToolbar("已保存当前规则域");
      return;
    }
    if (activeView === "records") {
      persistRecords();
      persistCrmActivityLog();
      persistUiLayout("保存点位机会页面UI");
      flashContextToolbar("已保存点位机会");
      return;
    }
    if (activeView === "fulfillment") {
      persistFulfillmentRecords();
      persistUiLayout("保存点位落地页面UI");
      flashContextToolbar("已保存点位落地状态");
      return;
    }
    if (activeView === "accounts") {
      persistAccounts();
      persistAccountSession();
      persistCrmActivityLog();
      persistUiLayout("保存账号管理页面UI");
      flashContextToolbar("已保存账号权限");
      return;
    }
    persistState();
    persistUiLayout(`保存${activeView}页面UI`);
    flashContextToolbar("已保存当前页测算参数");
  }

  function exportCurrentContext() {
    const context = currentContextInfo();
    const filename = `${context.title.replace(/[\\/:*?"<>|\\s]+/g, "-")}.json`;
    downloadJson(filename, currentContextExportPayload());
  }

  function importRuleSection(imported) {
    const incoming = imported.rules || imported;
    const keys = ruleSectionFieldMap[activeRuleSection] || [];
    let changed = 0;
    keys.forEach((key) => {
      if (incoming[key] !== undefined) {
        data.rules[key] = XJCore.clone(incoming[key]);
        changed += 1;
      }
    });
    if (!changed) {
      alert("导入文件中没有当前规则域可用参数。");
      return;
    }
    if (activeRuleSection === "purchase") {
      data.rules.purchaseTiers = normalizeQuantityPurchaseTiers(data.rules.purchaseTiers);
      data.rules.ui = {
        ...(data.rules.ui || {}),
        purchaseTierModelVersion: window.DEFAULT_DATA.rules.ui && window.DEFAULT_DATA.rules.ui.purchaseTierModelVersion
      };
    }
    persistRules("导入当前规则域");
    renderSettings();
    renderContextToolbar();
    flashContextToolbar("已导入当前规则域");
  }

  async function handleContextImport(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      if (activeView === "settings") importRuleSection(imported);
      if (activeView === "scenic-db") importScenicSpots(imported);
      if (activeView === "fulfillment") importFulfillmentRecords(imported);
      if (activeView === "products" && activeProductPanel !== "sku") importProducts(imported);
    } catch (error) {
      alert("导入 JSON 解析失败。");
      console.warn(error);
    }
    input.value = "";
  }

  function toggleContextUiEdit() {
    const scope = currentUiScopeKey();
    if (uiEditMode && uiEditScope === scope) {
      uiEditMode = false;
      uiEditScope = "";
    } else {
      uiEditMode = true;
      uiEditScope = scope;
      activeUiEditorSection = "copy";
    }
    renderUiEditor();
    renderScenarioControls();
    updateCalculatedViews();
    renderContextToolbar();
    applyUiLayout();
  }

  function openLayoutPlanner() {
    uiEditMode = true;
    uiEditScope = currentUiScopeKey();
    activeUiEditorSection = "pages";
    renderUiEditor();
    renderScenarioControls();
    updateCalculatedViews();
    renderContextToolbar();
    applyUiLayout();
  }

  function openLayoutDesigner(target) {
    const viewName = target.view || "scenario";
    if (viewName === "crm") {
      setActiveCrmPanel(target.crmPanel || activeCrmPanel || "dashboard");
    }
    setActiveView(viewName);
    if (viewName === "crm") {
      renderCrmWorkspace();
    }
    if (viewName === "scenario") {
      setActiveScenarioPanel(target.scenarioPanel || "save");
    }
    if (viewName === "products") {
      const nextPanel = target.productPanel || activeProductPanel || "category";
      activeProductPanel = nextPanel;
      renderProductLibrary();
      setActiveProductPanel(nextPanel);
    }
    uiEditMode = true;
    uiEditScope = currentUiScopeKey();
    activeUiEditorSection = "style";
    renderUiEditor();
    renderScenarioControls();
    updateCalculatedViews();
    renderContextToolbar();
    applyUiLayout();
    const activeHost = qs(`[data-context-host="${currentContextInfo().host}"]`);
    if (activeHost) activeHost.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleInput(event) {
    const target = event.target;
    if (target.id === "accountNameInput") {
      updateAccountField("name", target.value);
      return;
    }
    if (target.id === "accountTeamInput") {
      updateAccountField("team", target.value);
      return;
    }
    if (target.matches("[data-account-field]")) {
      updateManagedAccountField(target, { log: false, render: false });
      return;
    }
    if (target.matches("[data-crm-field]")) {
      updateCrmField(target, { log: false });
      return;
    }
    if (target.id === "scenicSearchInput") {
      if (scenicSearchComposing || event.isComposing) return;
      scenicSearch = target.value;
      scenicVisibleLimit = 80;
      scheduleScenicDatabaseRender();
      return;
    }
    if (target.id === "fulfillmentSearchInput") {
      if (fulfillmentSearchComposing || event.isComposing) return;
      fulfillmentSearch = target.value;
      scheduleFulfillmentRender();
      return;
    }
    if (target.id === "crmSearchInput") {
      if (crmSearchComposing || event.isComposing) return;
      crmSearch = target.value;
      window.clearTimeout(crmSearchRenderTimer);
      crmSearchRenderTimer = window.setTimeout(() => renderCrmWorkspace(), 350);
      return;
    }
    if (target.id === "skuSearchInput") {
      skuSearch = target.value;
      renderProductLibrary();
      setActiveProductPanel("sku");
      return;
    }
    if (target.matches("[data-record-channel]")) {
      updateRecordChannel(target, { render: false });
      return;
    }
    if (target.matches("[data-record-crm]")) {
      updateRecordOpportunityField(target, { log: false, render: false, renderCrm: false });
      return;
    }
    if (target.matches("[data-fulfillment-field]")) {
      updateFulfillmentRecordField(target);
      if (target.tagName === "TEXTAREA" || target.type === "text") return;
      renderFulfillment();
      return;
    }
    if (target.matches("[data-ui-text]")) {
      const textKey = target.dataset.uiText;
      uiLayout.texts[textKey] = target.value;
      uiLayout = normalizeUiLayout(uiLayout);
      persistUiLayout("修改UI文案");
      if (textKey.startsWith("scenicDb")) renderScenicDatabase();
      if (textKey.startsWith("fulfillment")) renderFulfillment();
      updateCalculatedViews();
      renderContextToolbar();
      applyUiLayout();
      return;
    }
    if (target.matches("[data-operator-name]")) {
      state.operatorName = target.value;
      persistState();
      updateCalculatedViews();
      return;
    }
    if (target.matches("[data-scenario]")) {
      const key = target.dataset.scenario;
      state.scenario[key] = target.type === "checkbox" ? target.checked : target.type === "number" ? Number(target.value) : target.value;
      persistState();
      if (key === "spotName") renderInlineScenicMatches();
      renderPricing();
      updateCalculatedViews();
      return;
    }
    if (target.matches("[data-channel]")) {
      const key = target.dataset.channel;
      state.channel[key] = target.type === "number" || key === "retailOverride"
        ? (target.value === "" && ["negotiatedDeduction", "monthlySales", "top3SalesReceipt", "purchaseReceiptAmount"].includes(key) ? "" : Number(target.value))
        : target.value;
      persistState();
      updateCalculatedViews();
    }
  }

  function handleChange(event) {
    const target = event.target;
    if (target.id === "accountPresetSelect") {
      accountLoginError = "";
      return;
    }
    if (target.id === "accountRoleSelect") {
      updateAccountField("role", target.value);
      renderAccountBar();
      return;
    }
    if (target.matches("[data-account-field]")) {
      updateManagedAccountField(target, { log: true, render: true });
      return;
    }
    if (target.matches("[data-account-permission]")) {
      updateManagedAccountPermission(target);
      return;
    }
    if (target.matches("[data-crm-field]")) {
      updateCrmField(target, { log: true });
      renderCrmWorkspace();
      return;
    }
    if (target.matches("[data-ui-layout]")) {
      uiLayout[target.dataset.uiLayout] = target.value;
      uiLayout = normalizeUiLayout(uiLayout);
      persistUiLayout("修改UI样式");
      renderUiEditor();
      applyUiLayout();
      return;
    }
    if (target.matches("[data-ui-toggle]")) {
      uiLayout[target.dataset.uiToggle] = target.checked;
      uiLayout = normalizeUiLayout(uiLayout);
      persistUiLayout("修改UI显示开关");
      renderUiEditor();
      applyUiLayout();
      return;
    }
    const scenicFilterSetters = {
      scenicProvinceFilter: (value) => { scenicProvinceFilter = value; },
      scenicTypeFilter: (value) => { scenicTypeFilter = value; },
      scenicGradeFilter: (value) => { scenicGradeFilter = value; },
      scenicPriorityFilter: (value) => { scenicPriorityFilter = value; },
      scenicT0Filter: (value) => { scenicT0Filter = value; },
      scenicTileFilter: (value) => { scenicTileFilter = value; },
      scenicDataStatusFilter: (value) => { scenicDataStatusFilter = value; },
      scenicVerificationFilter: (value) => { scenicVerificationFilter = value; },
      scenicSortMode: (value) => { scenicSortMode = value || "scoreDesc"; }
    };
    if (scenicFilterSetters[target.id]) {
      scenicFilterSetters[target.id](target.value);
      scenicVisibleLimit = 80;
      renderScenicDatabase();
      return;
    }
    const fulfillmentFilterSetters = {
      fulfillmentStatusFilter: (value) => { fulfillmentStatusFilter = value; },
      fulfillmentTypeFilter: (value) => { fulfillmentTypeFilter = value; },
      fulfillmentReceiptFilter: (value) => { fulfillmentReceiptFilter = value; },
      fulfillmentShelfFilter: (value) => { fulfillmentShelfFilter = value; },
      fulfillmentIssueFilter: (value) => { fulfillmentIssueFilter = value; }
    };
    if (fulfillmentFilterSetters[target.id]) {
      fulfillmentFilterSetters[target.id](target.value);
      renderFulfillment();
      return;
    }
    if (target.id === "crmOwnerFilter") {
      crmOwnerFilter = target.value;
      renderCrmWorkspace();
      return;
    }
    if (target.id === "crmCollectionFilter") {
      crmCollectionFilter = target.value || "all";
      setActiveCrmPanel(crmCollectionFilter === "all" ? "dashboard" : crmPanelForCollection(crmCollectionFilter), { syncFilter: false });
      renderCrmWorkspace();
      return;
    }
    if (target.matches("[data-fulfillment-field]")) {
      updateFulfillmentRecordField(target);
      renderFulfillment();
      return;
    }
    const skuFilterSetters = {
      skuCategoryFilter: (value) => { skuCategoryFilter = value; },
      skuSeriesFilter: (value) => { skuSeriesFilter = value; },
      skuSpecFilter: (value) => { skuSpecFilter = value; },
      skuTypeFilter: (value) => { skuTypeFilter = value; },
      skuCraftFilter: (value) => { skuCraftFilter = value; },
      skuRegionFilter: (value) => { skuRegionFilter = value; },
      skuRetailFilter: (value) => { skuRetailFilter = value; }
    };
    if (skuFilterSetters[target.id]) {
      skuFilterSetters[target.id](target.value);
      renderProductLibrary();
      setActiveProductPanel("sku");
      return;
    }
    if (target.matches("[data-rule-grade-rename]")) {
      renameGrade(target.dataset.ruleGradeRename, target.value);
      return;
    }
    if (target.matches("[data-rule-map-key]")) {
      renameRuleMapKey(target.dataset.ruleMapKey, target.dataset.ruleMapOldKey, target.value, target.dataset.ruleMapBase);
      return;
    }
    if (target.matches("[data-record-channel]")) {
      updateRecordChannel(target, { render: true });
      return;
    }
    if (target.matches("[data-record-crm]")) {
      updateRecordOpportunityField(target, { log: true, render: true, renderCrm: true });
      return;
    }
    if (target.matches("[data-scenario], [data-channel]")) {
      handleInput(event);
      return;
    }
    if (target.matches("[data-rule-path]")) {
      const nextValue = target.type === "checkbox" ? target.checked : target.value;
      preserveOptionAliasForRename(target.dataset.rulePath, nextValue);
      setPath(data.rules, target.dataset.rulePath, nextValue, target.type === "checkbox");
      refreshRulesUi();
      return;
    }
    if (target.matches("[data-context-import]")) {
      handleContextImport(target);
      return;
    }
    if (target.matches("[data-import-workspace-backup]")) {
      handleWorkspaceBackupImport(target);
      return;
    }
  }

  function bindEvents() {
    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleChange);
    document.addEventListener("pointerover", (event) => {
      const group = event.target.closest && event.target.closest("[data-nav-group]");
      if (!group) return;
      closeNavGroups(group);
      group.classList.add("open");
      const trigger = group.querySelector("[data-nav-primary], [data-layout-open]");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    });
    document.addEventListener("pointerout", (event) => {
      const group = event.target.closest && event.target.closest("[data-nav-group]");
      if (!group || group.contains(event.relatedTarget)) return;
      group.classList.remove("open");
      const trigger = group.querySelector("[data-nav-primary], [data-layout-open]");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("focusin", (event) => {
      const group = event.target.closest && event.target.closest("[data-nav-group]");
      if (!group) return;
      closeNavGroups(group);
      group.classList.add("open");
      const trigger = group.querySelector("[data-nav-primary], [data-layout-open]");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    });
    document.addEventListener("focusout", (event) => {
      const group = event.target.closest && event.target.closest("[data-nav-group]");
      if (!group || group.contains(event.relatedTarget)) return;
      group.classList.remove("open");
      const trigger = group.querySelector("[data-nav-primary], [data-layout-open]");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("compositionstart", (event) => {
      if (event.target && event.target.id === "scenicSearchInput") {
        scenicSearchComposing = true;
      }
      if (event.target && event.target.id === "fulfillmentSearchInput") {
        fulfillmentSearchComposing = true;
      }
      if (event.target && event.target.id === "crmSearchInput") {
        crmSearchComposing = true;
      }
    });
    document.addEventListener("compositionend", (event) => {
      if (event.target && event.target.id === "scenicSearchInput") {
        scenicSearchComposing = false;
        scenicSearch = event.target.value;
        scenicVisibleLimit = 80;
        if (scenicSearchRenderTimer) {
          window.clearTimeout(scenicSearchRenderTimer);
          scenicSearchRenderTimer = 0;
        }
        renderScenicDatabase();
      }
      if (event.target && event.target.id === "fulfillmentSearchInput") {
        fulfillmentSearchComposing = false;
        fulfillmentSearch = event.target.value;
        if (fulfillmentSearchRenderTimer) {
          window.clearTimeout(fulfillmentSearchRenderTimer);
          fulfillmentSearchRenderTimer = 0;
        }
        renderFulfillment();
      }
      if (event.target && event.target.id === "crmSearchInput") {
        crmSearchComposing = false;
        crmSearch = event.target.value;
        if (crmSearchRenderTimer) {
          window.clearTimeout(crmSearchRenderTimer);
          crmSearchRenderTimer = 0;
        }
        renderCrmWorkspace();
      }
    });
    document.addEventListener("click", (event) => {
      const productCard = event.target.closest("[data-product-card]");
      if (productCard) {
        selectProduct(productCard.dataset.productCard);
        return;
      }
      const useProduct = event.target.closest("[data-use-product]");
      if (useProduct) {
        selectProduct(useProduct.dataset.useProduct);
        setActiveView("cost");
        return;
      }
      const crmPanelButton = event.target.closest("[data-crm-panel-target]");
      if (crmPanelButton) {
        const targetView = crmPanelButton.dataset.viewTarget || "crm";
        if (!canAccessView(targetView)) {
          flashContextToolbar("当前账号没有访问该模块的权限");
          closeNavGroups();
          return;
        }
        setActiveCrmPanel(crmPanelButton.dataset.crmPanelTarget);
        setActiveView(targetView);
        if (targetView === "crm") renderCrmWorkspace();
        closeNavGroups();
        return;
      }
      const viewButton = event.target.closest("[data-view-target]");
      if (viewButton) {
        if (!canAccessView(viewButton.dataset.viewTarget)) {
          flashContextToolbar("当前账号没有访问该模块的权限");
          closeNavGroups();
          return;
        }
        setActiveView(viewButton.dataset.viewTarget);
        closeNavGroups();
        return;
      }
      const addAccountButton = event.target.closest("[data-add-account]");
      if (addAccountButton) {
        addManagedAccount();
        return;
      }
      const resetAccountsButton = event.target.closest("[data-reset-accounts]");
      if (resetAccountsButton) {
        resetManagedAccounts();
        return;
      }
      const resetAccountPermissionsButton = event.target.closest("[data-reset-account-permissions]");
      if (resetAccountPermissionsButton) {
        resetManagedAccountPermissions(Number(resetAccountPermissionsButton.dataset.resetAccountPermissions));
        return;
      }
      const resetAccountPasswordButton = event.target.closest("[data-reset-account-password]");
      if (resetAccountPasswordButton) {
        resetManagedAccountPassword(Number(resetAccountPasswordButton.dataset.resetAccountPassword));
        return;
      }
      const unlockAccountButton = event.target.closest("[data-unlock-account]");
      if (unlockAccountButton) {
        unlockManagedAccount(Number(unlockAccountButton.dataset.unlockAccount));
        return;
      }
      if (event.target.closest("[data-export-workspace-backup]")) {
        exportWorkspaceBackup();
        return;
      }
      const deleteAccountButton = event.target.closest("[data-delete-account]");
      if (deleteAccountButton) {
        deleteManagedAccount(Number(deleteAccountButton.dataset.deleteAccount));
        return;
      }
      const loginAccountButton = event.target.closest("[data-login-account]");
      if (loginAccountButton) {
        impersonateManagedAccount(loginAccountButton.dataset.loginAccount);
        return;
      }
      if (event.target.closest("[data-toggle-password-panel]")) {
        accountPasswordPanelOpen = !accountPasswordPanelOpen;
        accountPasswordChangeError = "";
        renderAccountBar();
        return;
      }
      if (event.target.closest("[data-change-password-submit]")) {
        changeCurrentAccountPassword();
        return;
      }
      const loginSubmitButton = event.target.closest("[data-login-submit]");
      if (loginSubmitButton) {
        const accountId = (qs("#accountPresetSelect") || {}).value || "";
        const password = (qs("#accountPasswordInput") || {}).value || "";
        loginAccount(accountId, password);
        return;
      }
      const logoutButton = event.target.closest("[data-logout-account]");
      if (logoutButton) {
        logoutAccount();
        return;
      }
      const recordPipelineButton = event.target.closest("[data-record-pipeline]");
      if (recordPipelineButton) {
        handleRecordPipelineAction(recordPipelineButton.dataset.recordPipeline, Number(recordPipelineButton.dataset.recordIndex));
        return;
      }
      const crmClosureAction = event.target.closest("[data-crm-closure-action]");
      if (crmClosureAction) {
        handleRecordPipelineAction(crmClosureAction.dataset.crmClosureAction, Number(crmClosureAction.dataset.recordIndex));
        return;
      }
      const crmPointOpenButton = event.target.closest("[data-crm-point-open]");
      if (crmPointOpenButton) {
        activeCrmPointName = crmPointOpenButton.dataset.crmPointOpen || "";
        setActiveCrmPanel("dashboard", { syncFilter: false });
        setActiveView("crm");
        renderCrmWorkspace();
        flashContextToolbar(`已打开${activeCrmPointName || "点位"}全链路档案`);
        return;
      }
      if (event.target.closest("[data-crm-point-close]")) {
        activeCrmPointName = "";
        renderCrmWorkspace();
        return;
      }
      const crmDraftButton = event.target.closest("[data-crm-draft]");
      if (crmDraftButton) {
        const contractId = crmDraftButton.dataset.crmDraft;
        activeCrmDraftId = activeCrmDraftId === contractId ? "" : contractId;
        renderCrmWorkspace();
        return;
      }
      if (event.target.closest("[data-crm-draft-close]")) {
        activeCrmDraftId = "";
        renderCrmWorkspace();
        return;
      }
      if (event.target.closest("[data-crm-draft-copy]")) {
        copyActiveCrmDraft();
        return;
      }
      if (event.target.closest("[data-crm-draft-export]")) {
        exportActiveCrmDraft();
        return;
      }
      if (event.target.closest("[data-crm-brief-copy]")) {
        copyCrmBrief();
        return;
      }
      if (event.target.closest("[data-crm-brief-export]")) {
        exportCrmBrief();
        return;
      }
      if (event.target.closest("[data-crm-filter-reset]")) {
        crmSearch = "";
        crmOwnerFilter = "";
        crmCollectionFilter = "all";
        setActiveCrmPanel("dashboard", { syncFilter: false });
        renderCrmWorkspace();
        return;
      }
      const crmTaskOpenButton = event.target.closest("[data-crm-task-open]");
      if (crmTaskOpenButton) {
        openCrmTask(crmTaskDescriptorFromButton(crmTaskOpenButton));
        return;
      }
      const crmTaskPostponeButton = event.target.closest("[data-crm-task-postpone]");
      if (crmTaskPostponeButton) {
        postponeCrmTask(crmTaskDescriptorFromButton(crmTaskPostponeButton), Number(crmTaskPostponeButton.dataset.crmTaskPostpone) || 3);
        return;
      }
      const crmContractWorkflowButton = event.target.closest("[data-crm-contract-workflow]");
      if (crmContractWorkflowButton) {
        updateCrmContractWorkflow(Number(crmContractWorkflowButton.dataset.crmIndex), crmContractWorkflowButton.dataset.crmContractWorkflow);
        return;
      }
      const crmContractOrderButton = event.target.closest("[data-crm-contract-order]");
      if (crmContractOrderButton) {
        createCrmOrderFromContract(Number(crmContractOrderButton.dataset.crmContractOrder));
        return;
      }
      const crmOrderFulfillmentButton = event.target.closest("[data-crm-order-fulfillment]");
      if (crmOrderFulfillmentButton) {
        createCrmFulfillmentFromOrder(Number(crmOrderFulfillmentButton.dataset.crmOrderFulfillment));
        return;
      }
      const crmOrderWorkflowButton = event.target.closest("[data-crm-order-workflow]");
      if (crmOrderWorkflowButton) {
        updateCrmOrderWorkflow(Number(crmOrderWorkflowButton.dataset.crmIndex), crmOrderWorkflowButton.dataset.crmOrderWorkflow);
        return;
      }
      const crmOrderSalesButton = event.target.closest("[data-crm-order-sales]");
      if (crmOrderSalesButton) {
        createCrmSalesFromOrder(Number(crmOrderSalesButton.dataset.crmOrderSales));
        return;
      }
      const crmSalesReviewButton = event.target.closest("[data-crm-sales-review]");
      if (crmSalesReviewButton) {
        markStoreSalesReviewed(Number(crmSalesReviewButton.dataset.crmSalesReview));
        return;
      }
      const crmSalesReplenishButton = event.target.closest("[data-crm-sales-replenish]");
      if (crmSalesReplenishButton) {
        createReplenishmentOrderFromSale(Number(crmSalesReplenishButton.dataset.crmSalesReplenish));
        return;
      }
      const addCrmRowButton = event.target.closest("[data-add-crm-row]");
      if (addCrmRowButton) {
        addCrmRow(addCrmRowButton.dataset.addCrmRow);
        return;
      }
      const deleteCrmRowButton = event.target.closest("[data-delete-crm-row]");
      if (deleteCrmRowButton) {
        deleteCrmRow(deleteCrmRowButton.dataset.deleteCrmRow, Number(deleteCrmRowButton.dataset.crmIndex));
        return;
      }
      const crmCustomerOpportunityButton = event.target.closest("[data-crm-customer-opportunity]");
      if (crmCustomerOpportunityButton) {
        createOpportunityFromCustomer(Number(crmCustomerOpportunityButton.dataset.crmCustomerOpportunity));
        return;
      }
      const crmCustomerAssignButton = event.target.closest("[data-crm-customer-assign]");
      if (crmCustomerAssignButton) {
        assignCustomerToCurrentAccount(Number(crmCustomerAssignButton.dataset.crmCustomerAssign));
        return;
      }
      const crmCustomerSlaButton = event.target.closest("[data-crm-customer-sla]");
      if (crmCustomerSlaButton) {
        scheduleCustomerFollowup(Number(crmCustomerSlaButton.dataset.crmCustomerSla));
        return;
      }
      const navPrimary = event.target.closest("[data-nav-primary]");
      if (navPrimary) {
        const group = navPrimary.closest("[data-nav-group]");
        closeNavGroups(group);
        if (group) {
          group.classList.add("open");
          navPrimary.setAttribute("aria-expanded", "true");
        }
        return;
      }
      const layoutOpen = event.target.closest("[data-layout-open]");
      if (layoutOpen) {
        const group = layoutOpen.closest("[data-layout-nav]");
        closeNavGroups(group);
        if (group) group.classList.add("open");
        openLayoutPlanner();
        return;
      }
      const layoutDesignTarget = event.target.closest("[data-layout-design-view]");
      if (layoutDesignTarget) {
        if (!canAccessView(layoutDesignTarget.dataset.layoutDesignView)) {
          flashContextToolbar("当前账号没有编辑该页面布局的权限");
          closeNavGroups();
          return;
        }
        closeNavGroups();
        openLayoutDesigner({
          view: layoutDesignTarget.dataset.layoutDesignView,
          crmPanel: layoutDesignTarget.dataset.layoutDesignCrmPanel,
          scenarioPanel: layoutDesignTarget.dataset.layoutDesignScenarioPanel,
          productPanel: layoutDesignTarget.dataset.layoutDesignProductPanel
        });
        return;
      }
      const contextAction = event.target.closest("[data-context-action]");
      if (contextAction) {
        const action = contextAction.dataset.contextAction;
        if (action === "save") saveCurrentContext();
        if (action === "export") exportCurrentContext();
        return;
      }
      if (event.target.id === "toggleUiEditBtn") {
        uiEditMode = !uiEditMode;
        uiEditScope = currentUiScopeKey();
        renderUiEditor();
        renderScenarioControls();
        updateCalculatedViews();
        renderContextToolbar();
        applyUiLayout();
        return;
      }
      if (event.target.id === "closeUiEditorBtn") {
        uiEditMode = false;
        uiEditScope = "";
        renderScenarioControls();
        renderUiEditor();
        updateCalculatedViews();
        renderContextToolbar();
        applyUiLayout();
        return;
      }
      const ruleCardNav = event.target.closest("[data-rule-card]");
      if (ruleCardNav) {
        activeRuleSection = ruleCardNav.dataset.ruleCard;
        closeUiEditorIfScopeChanged();
        renderSettings();
        renderContextToolbar();
        applyUiLayout();
        return;
      }
      const ruleAdd = event.target.closest("[data-rule-add]");
      if (ruleAdd) {
        addRuleItem(ruleAdd.dataset.ruleAdd);
        return;
      }
      const ruleDelete = event.target.closest("[data-rule-delete]");
      if (ruleDelete) {
        deleteRuleItem(ruleDelete.dataset.ruleDelete, ruleDelete.dataset.ruleDeleteKey);
        return;
      }
      const uiEditorSection = event.target.closest("[data-ui-editor-section]");
      if (uiEditorSection) {
        activeUiEditorSection = uiEditorSection.dataset.uiEditorSection || "style";
        renderUiEditor();
        return;
      }
      const uiViewMove = event.target.closest("[data-ui-view-move]");
      if (uiViewMove && uiEditMode) {
        const key = uiViewMove.dataset.uiViewMove;
        const direction = uiViewMove.dataset.direction;
        const order = [...uiLayout.mainViewOrder];
        const index = order.indexOf(key);
        const nextIndex = direction === "up" ? index - 1 : index + 1;
        if (index >= 0 && nextIndex >= 0 && nextIndex < order.length) {
          [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
          uiLayout.mainViewOrder = order;
          persistUiLayout("调整主页面顺序");
          renderUiEditor();
          applyUiLayout();
        }
        return;
      }
      const uiPanelMove = event.target.closest("[data-ui-panel-move]");
      if (uiPanelMove && uiEditMode) {
        const key = uiPanelMove.dataset.uiPanelMove;
        const scope = uiPanelMove.dataset.panelScope;
        const direction = uiPanelMove.dataset.direction;
        const order = [...(uiLayout.panelOrder[scope] || [])];
        const index = order.indexOf(key);
        const nextIndex = direction === "up" ? index - 1 : index + 1;
        if (index >= 0 && nextIndex >= 0 && nextIndex < order.length) {
          [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
          uiLayout.panelOrder[scope] = order;
          persistUiLayout("调整UI面板顺序");
          renderUiEditor();
          applyUiLayout();
        }
        return;
      }
      const uiRuleMove = event.target.closest("[data-ui-rule-move]");
      if (uiRuleMove && uiEditMode && activeView === "settings") {
        const key = uiRuleMove.dataset.uiRuleMove;
        const direction = uiRuleMove.dataset.direction;
        const order = (data.rules.ui.ruleOrder || Object.keys(sectionMeta)).filter((item) => sectionMeta[item]);
        const index = order.indexOf(key);
        const nextIndex = direction === "up" ? index - 1 : index + 1;
        if (index >= 0 && nextIndex >= 0 && nextIndex < order.length) {
          [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
          data.rules.ui.ruleOrder = order;
          persistRules("调整规则域顺序");
          renderSettings();
          renderUiEditor();
          renderContextToolbar();
          applyUiLayout();
        }
        return;
      }
      const scenarioMove = event.target.closest("[data-scenario-move]");
      if (scenarioMove && uiEditMode) {
        const key = scenarioMove.dataset.scenarioMove;
        const direction = scenarioMove.dataset.direction;
        const order = [...uiLayout.scenarioSectionOrder];
        const index = order.indexOf(key);
        const nextIndex = direction === "up" ? index - 1 : index + 1;
        if (index >= 0 && nextIndex >= 0 && nextIndex < order.length) {
          [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
          uiLayout.scenarioSectionOrder = order;
          persistUiLayout("调整景区信息模块顺序");
          renderScenarioControls();
          renderUiEditor();
          updateCalculatedViews();
          applyUiLayout();
        }
        return;
      }
      const scenarioPanelButton = event.target.closest("[data-scenario-panel]");
      if (scenarioPanelButton) {
        setActiveScenarioPanel(scenarioPanelButton.dataset.scenarioPanel);
        return;
      }
      const productPanelButton = event.target.closest("[data-product-panel]");
      if (productPanelButton) {
        activeProductPanel = productPanelButton.dataset.productPanel;
        renderProductLibrary();
        setActiveProductPanel(activeProductPanel);
        return;
      }
      const skuCategoryButton = event.target.closest("[data-sku-category]");
      if (skuCategoryButton) {
        skuCategoryFilter = skuCategoryButton.dataset.skuCategory;
        skuSearch = "";
        skuSeriesFilter = "";
        skuSpecFilter = "";
        skuTypeFilter = "";
        skuCraftFilter = "";
        skuRegionFilter = "";
        skuRetailFilter = "";
        activeProductPanel = "sku";
        renderProductLibrary();
        setActiveProductPanel("sku");
        return;
      }
      if (event.target.id === "clearSkuFiltersBtn") {
        skuSearch = "";
        skuCategoryFilter = "";
        skuSeriesFilter = "";
        skuSpecFilter = "";
        skuTypeFilter = "";
        skuCraftFilter = "";
        skuRegionFilter = "";
        skuRetailFilter = "";
        renderProductLibrary();
        setActiveProductPanel("sku");
        return;
      }
      const pricingModeButton = event.target.closest("[data-pricing-mode]");
      if (pricingModeButton) {
        activePricingMode = pricingModeButton.dataset.pricingMode;
        ensurePricingModeState();
        renderPricing();
        updateCalculatedViews();
        return;
      }
      const editProductFromCost = event.target.closest("#editProductFromCost");
      if (editProductFromCost) {
        event.preventDefault();
        editingProductId = state.productId;
        renderProductLibrary();
        setActiveView("products");
        return;
      }
      if (event.target.id === "saveRecordBtn" || event.target.closest("[data-save-record]")) {
        saveCurrentRecord();
        return;
      }
      if (event.target.id === "exportRulesBtn") {
        downloadJson("寻迹万物销售测算规则.json", data.rules);
        return;
      }
      if (event.target.id === "exportRecordsBtn") {
        downloadJson("寻迹万物点位机会.json", records);
        return;
      }
      if (event.target.id === "exportScenicSpotsBtn") {
        downloadJson("寻迹万物景区基础库.json", { scenicSpots: data.scenicSpots });
        return;
      }
      if (event.target.id === "exportFulfillmentBtn") {
        downloadJson("寻迹万物点位落地台账.json", { fulfillmentRecords: data.fulfillmentRecords });
        return;
      }
      if (event.target.id === "resetScenicSpotsBtn") {
        resetScenicSpots();
        return;
      }
      if (event.target.id === "resetFulfillmentBtn") {
        resetFulfillmentRecords();
        return;
      }
      if (event.target.id === "clearScenicFiltersBtn") {
        clearScenicFilters();
        return;
      }
      if (event.target.id === "clearFulfillmentFiltersBtn") {
        clearFulfillmentFilters();
        return;
      }
      if (event.target.id === "loadMoreScenicBtn") {
        scenicVisibleLimit += 80;
        renderScenicDatabase();
        return;
      }
      const inlineApplyScenic = event.target.closest("[data-inline-apply-scenic]");
      if (inlineApplyScenic) {
        applyScenicSpot(inlineApplyScenic.dataset.inlineApplyScenic);
        return;
      }
      const applyScenic = event.target.closest("[data-apply-scenic]");
      if (applyScenic) {
        applyScenicSpot(applyScenic.dataset.applyScenic);
        return;
      }
      const fulfillmentDetail = event.target.closest("[data-fulfillment-detail]");
      if (fulfillmentDetail) {
        const id = fulfillmentDetail.dataset.fulfillmentDetail;
        fulfillmentActiveId = fulfillmentActiveId === id ? "" : id;
        renderFulfillment();
        return;
      }
      if (event.target.id === "addProductBtn") {
        editingProductId = "__new__";
        activeProductPanel = "measured";
        renderProductLibrary();
        setActiveProductPanel("measured");
        return;
      }
      if (event.target.id === "addProductCostBandBtn") {
        addProductPriceBand("cost");
        return;
      }
      if (event.target.id === "addProductScenarioBandBtn") {
        addProductPriceBand("scenario");
        return;
      }
      if (event.target.id === "resetProductCostBandsBtn") {
        resetProductPriceBands("cost");
        return;
      }
      if (event.target.id === "resetProductScenarioBandsBtn") {
        resetProductPriceBands("scenario");
        return;
      }
      const deleteProductBand = event.target.closest("[data-delete-product-band]");
      if (deleteProductBand) {
        deleteProductPriceBand(deleteProductBand);
        return;
      }
      if (event.target.id === "saveProductBtn") {
        saveProductFromEditor();
        return;
      }
      if (event.target.id === "cancelProductEditBtn") {
        editingProductId = null;
        renderProductLibrary();
        setActiveProductPanel(activeProductPanel);
        return;
      }
      if (event.target.id === "exportProductsBtn") {
        downloadJson("寻迹万物产品库.json", { products: data.products });
        return;
      }
      if (event.target.id === "resetProductsBtn") {
        activeProductPanel = "measured";
        resetProducts();
        return;
      }
      const recordViewButton = event.target.closest("[data-record-view]");
      if (recordViewButton) {
        activeRecordView = recordViewButton.dataset.recordView || "pool";
        renderRecords();
        return;
      }
      const recordOpportunityAction = event.target.closest("[data-record-op-action]");
      if (recordOpportunityAction) {
        handleRecordOpportunityAction(recordOpportunityAction.dataset.recordOpAction, Number(recordOpportunityAction.dataset.recordIndex));
        return;
      }
      const recordFollowupSubmit = event.target.closest("[data-record-followup-submit]");
      if (recordFollowupSubmit) {
        saveRecordFollowup(recordFollowupSubmit);
        return;
      }
      const recordDetail = event.target.closest("[data-record-detail]");
      if (recordDetail) {
        const index = Number(recordDetail.dataset.recordDetail);
        const record = records[index];
        if (!record) return;
        const key = recordKey(record, index);
        const panel = recordDetail.dataset.recordPanel;
        activeRecordPanels[key] = activeRecordPanels[key] === panel ? "" : panel;
        renderRecords();
        return;
      }
      const deleteRecord = event.target.closest("[data-delete-record]");
      if (deleteRecord) {
        const index = Number(deleteRecord.dataset.deleteRecord);
        const record = records[index];
        if (record && !accountCanDeleteRecord(record)) {
          alert("当前账号没有权限删除这条点位机会。");
          return;
        }
        if (record) delete activeRecordPanels[recordKey(record, index)];
        records.splice(index, 1);
        persistRecords();
        renderRecords();
        return;
      }
      const editProduct = event.target.closest("[data-edit-product]");
      if (editProduct) {
        editingProductId = editProduct.dataset.editProduct;
        activeProductPanel = "measured";
        renderProductLibrary();
        setActiveProductPanel("measured");
        return;
      }
      const copyProductButton = event.target.closest("[data-copy-product]");
      if (copyProductButton) {
        copyProduct(copyProductButton.dataset.copyProduct);
        return;
      }
      const deleteProductButton = event.target.closest("[data-delete-product]");
      if (deleteProductButton) {
        deleteProduct(deleteProductButton.dataset.deleteProduct);
      }
    });

    document.addEventListener("dragstart", (event) => {
      const scenarioDrag = event.target.closest("[data-scenario-drag]");
      if (scenarioDrag && uiEditMode) {
        event.dataTransfer.setData("text/scenario-section", scenarioDrag.dataset.scenarioDrag);
        event.dataTransfer.effectAllowed = "move";
        return;
      }
      const productCard = event.target.closest("[data-product-card]");
      if (productCard) {
        event.dataTransfer.setData("text/product-id", productCard.dataset.productCard);
      }
      const ruleCard = event.target.closest("[data-rule-card]");
      if (ruleCard) {
        event.dataTransfer.setData("text/rule-key", ruleCard.dataset.ruleCard);
      }
    });

    qs("#dropZone").addEventListener("dragover", (event) => event.preventDefault());
    qs("#dropZone").addEventListener("drop", (event) => {
      event.preventDefault();
      const productId = event.dataTransfer.getData("text/product-id");
      if (productId) selectProduct(productId);
    });

    qs("#scenarioControls").addEventListener("dragover", (event) => {
      if (uiEditMode && event.target.closest("[data-scenario-section]")) event.preventDefault();
    });
    qs("#scenarioControls").addEventListener("drop", (event) => {
      if (!uiEditMode) return;
      const dragged = event.dataTransfer.getData("text/scenario-section");
      const target = event.target.closest("[data-scenario-section]");
      if (!dragged || !target || dragged === target.dataset.scenarioSection) return;
      event.preventDefault();
      const next = uiLayout.scenarioSectionOrder.filter((key) => key !== dragged);
      next.splice(next.indexOf(target.dataset.scenarioSection), 0, dragged);
      uiLayout.scenarioSectionOrder = next;
      persistUiLayout("拖拽调整景区信息模块顺序");
      renderScenarioControls();
      updateCalculatedViews();
      applyUiLayout();
    });

    qs("#ruleBoard").addEventListener("dragover", (event) => {
      if (event.target.closest("[data-rule-card]")) event.preventDefault();
    });
    qs("#ruleBoard").addEventListener("drop", (event) => {
      event.preventDefault();
      const dragged = event.dataTransfer.getData("text/rule-key");
      const target = event.target.closest("[data-rule-card]");
      if (!dragged || !target || dragged === target.dataset.ruleCard) return;
      const order = (data.rules.ui.ruleOrder || Object.keys(sectionMeta)).filter((key) => sectionMeta[key]);
      const next = order.filter((key) => key !== dragged);
      next.splice(next.indexOf(target.dataset.ruleCard), 0, dragged);
      data.rules.ui.ruleOrder = next;
      persistRules("调整规则域顺序");
      renderSettings();
    });

    const legacyRulesInput = qs("#importRulesInput");
    if (legacyRulesInput) {
      legacyRulesInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const text = await file.text();
        const imported = JSON.parse(text);
        const importedRules = imported.rules || imported;
        data.rules = applyRuleMigrations(mergeRules(window.DEFAULT_DATA.rules, importedRules), importedRules);
        activeRuleSection = (data.rules.ui.ruleOrder || Object.keys(sectionMeta))[0] || "price";
        persistRules("导入完整规则");
        renderApp();
        event.target.value = "";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    renderApp();
    updateScenarioStickyTop();
    window.addEventListener("resize", updateScenarioStickyTop);
    window.addEventListener("scroll", updateScenarioStickyTop, { passive: true });
  });
})();
