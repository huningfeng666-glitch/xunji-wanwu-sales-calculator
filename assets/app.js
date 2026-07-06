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
  const STORAGE_UI_LAYOUT = "xj-sales-calculator-ui-layout-v1";
  const STORAGE_UI_LAYOUT_BACKUPS = "xj-sales-calculator-ui-layout-backups-v1";
  const latestStageWeights = { T0: 50, T1: 45, T2: 5 };
  const RULE_BACKUP_LIMIT = 20;
  const UI_LAYOUT_BACKUP_LIMIT = 20;
  let lastPersistedRulesSnapshot = null;
  let lastPersistedUiLayoutSnapshot = null;

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
    mainViewOrder: ["scenario", "scenic-db", "cost", "pricing", "records", "products", "settings"],
    panelOrder: {
      cost: ["product", "cost", "result"],
      pricing: ["channel", "result"],
      commission: ["channel", "result"]
    },
    scenarioSectionOrder: ["basic", "t0", "t1", "t2", "veto", "save"],
    texts: {
      appTitle: "寻迹万物销售测算台",
      appSubtitle: "成本 · 场景评级 · 定价 · 采购/寄售 · 提成",
      topSave: "保存测算",
      uiEdit: "编辑UI",
      mainTabScenario: "场景评级",
      mainTabScenicDb: "景区库",
      mainTabCost: "成本测算",
      mainTabPricing: "定价测算",
      mainTabRecords: "测算记录",
      mainTabProducts: "产品库",
      mainTabSettings: "规则参数",
      mobileTabScenario: "场景",
      mobileTabScenicDb: "景区",
      mobileTabCost: "成本",
      mobileTabPricing: "定价",
      mobileTabRecords: "记录",
      mobileTabProducts: "产品",
      mobileTabSettings: "规则",
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
      scenicDbHeadIntro: "底库只保留可公开检索或可复核的景区基础数据；店位、店型、空间、商务扣点和官方资源由销售在景区信息页现场填报。",
      scenicDbCountNote: "当前底库用于销售检索和公开适配初筛；2025客流未核样本需进入商务前替换为官方或运营方口径。",
      panelProductChoice: "产品选择",
      panelCostComponents: "成本组件",
      panelCostResults: "结果",
      panelPricingChannel: "渠道参数",
      panelPricingResults: "定价结果",
      panelRecords: "测算记录",
      panelProducts: "产品库",
      panelSettings: "规则参数",
      stickyGradeLabel: "当前评级",
      stickyScoreLabel: "T0/T1/T2",
      stickyBusinessLabel: "指导商务条件",
      stickyCommissionLabel: "模拟提成"
    }
  };

  const mainViewMeta = {
    scenario: { textKey: "mainTabScenario", mobileTextKey: "mobileTabScenario", fallback: "场景评级" },
    "scenic-db": { textKey: "mainTabScenicDb", mobileTextKey: "mobileTabScenicDb", fallback: "景区库" },
    cost: { textKey: "mainTabCost", mobileTextKey: "mobileTabCost", fallback: "成本测算" },
    pricing: { textKey: "mainTabPricing", mobileTextKey: "mobileTabPricing", fallback: "定价测算" },
    records: { textKey: "mainTabRecords", mobileTextKey: "mobileTabRecords", fallback: "测算记录" },
    products: { textKey: "mainTabProducts", mobileTextKey: "mobileTabProducts", fallback: "产品库" },
    settings: { textKey: "mainTabSettings", mobileTextKey: "mobileTabSettings", fallback: "规则参数" }
  };

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
      detail: "管理保留、底薪、成本价带、场景建议价",
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
      detail: "单款阶梯价、总采政策、标准采购边界",
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
  let data = XJCore.clone(window.DEFAULT_DATA);
  const savedRules = loadJson(STORAGE_RULES);
  if (savedRules && (!savedRules.scoring || savedRules.scoring.officialCooperation)) {
    data.rules = mergeRules(data.rules, savedRules);
  }
  data.rules = applyRuleMigrations(data.rules, savedRules);
  lastPersistedRulesSnapshot = XJCore.clone(data.rules);
  data.products = normalizeProducts(window.ProductProvider.fetchProducts());
  data.scenicSpots = applyScenicDataMigrations(normalizeScenicSpots(loadJson(STORAGE_SCENIC_SPOTS) || data.scenicSpots || []));

  let state = loadJson(STORAGE_STATE) || XJCore.clone(data.defaultInputs);
  state = normalizeState(state);
  let records = loadJson(STORAGE_RECORDS) || [];
  let activeRecordPanels = {};
  let activeView = "scenario";
  let activeScenarioPanel = "save";
  let activeProductPanel = "category";
  let activePricingMode = "consignment";
  let activeUiEditorSection = "style";
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
  let skuSearch = "";
  let skuCategoryFilter = "";
  let skuSeriesFilter = "";
  let skuSpecFilter = "";
  let skuTypeFilter = "";
  let skuCraftFilter = "";
  let skuRegionFilter = "";
  let skuRetailFilter = "";
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
      texts: { ...defaultUiLayout.texts, ...(layout.texts || {}) }
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
    const sourceExpansionBonuses = (sourceRules && sourceRules.expansionBonuses) || {};
    const migratedExpansionBonuses = { ...(defaultRules.expansionBonuses || {}), ...sourceExpansionBonuses };
    Object.entries((sourceRules && sourceRules.gradeParams) || {}).forEach(([grade, params]) => {
      if (params && params.bonus !== undefined && sourceExpansionBonuses[grade] === undefined) migratedExpansionBonuses[grade] = Number(params.bonus) || 0;
    });
    const needsModelMigration = Boolean(latestVersion && currentVersion !== latestVersion);
    const needsScoreRepair = scoringNeedsTenPointRepair(nextRules.scoring);
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
      province: text(spot.province),
      city: text(spot.city, fallback.city),
      region: text(spot.region),
      priorityTier: text(spot.priorityTier, "待分级"),
      fitTags: list(spot.fitTags),
      scenicLevel: text(spot.scenicLevel, fallback.scenicLevel),
      annualVisitors: Number(spot.annualVisitors || 0),
      dataYear: Number(spot.dataYear || fallback.dataYear || 2025),
      visitorDataBasis: text(spot.visitorDataBasis, "待补公开数据"),
      ticketMode: text(spot.ticketMode, fallback.ticketMode),
      ticketPrice: Number(spot.ticketPrice || 0),
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
        sourceName: seed.sourceName,
        sourceUrl: seed.sourceUrl,
        sourceCheckedAt: seed.sourceCheckedAt,
        note: seed.note
      });
    });
    const existingIds = new Set(migrated.map((spot) => spot.id));
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
      scenarioPriceBands: XJCore.productScenarioPriceBands(data.rules, { ...normalized, scenarioPriceBands: product.scenarioPriceBands })
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
    price: ["highPriceCostShare", "managementReserveRate", "salaryBase", "costPriceBands", "scenarioPriceBands"],
    grade: ["gradeParams"],
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

  function currentContextInfo() {
    if (activeView === "scenario") {
      return {
        host: "scenario",
        scopeKey: `scenario:${activeScenarioPanel}`,
        title: `场景评级 · ${scenarioPanelLabel()}`,
        detail: "当前页只保存景区评级填报；商务条件和提成测算进入测算记录查看",
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
      return { host: "cost", scopeKey: "cost", title: "成本测算", detail: "当前页只保存当前产品与成本测算参数", saveLabel: "保存成本页", exportLabel: "导出成本测算", importLabel: "", exportable: true, importable: false };
    }
    if (activeView === "pricing") {
      return { host: "pricing", scopeKey: "pricing", title: "定价测算", detail: "当前页只保存当前定价测算参数", saveLabel: "保存定价页", exportLabel: "导出定价测算", importLabel: "", exportable: true, importable: false };
    }
    if (activeView === "records") {
      return { host: "records", scopeKey: "records", title: "测算记录", detail: "当前页只保存和导出测算记录", saveLabel: "保存记录", exportLabel: "导出记录", importLabel: "", exportable: true, importable: false };
    }
    if (activeView === "products") {
      return { host: "products", scopeKey: `products:${activeProductPanel}`, title: `产品库 · ${productPanelLabel()}`, detail: activeProductPanel === "sku" ? "当前页只导出SKU总表；SKU同步来源不在此手动导入" : "当前页只保存、导入和导出产品库数据", saveLabel: "保存产品库", exportLabel: activeProductPanel === "sku" ? "导出SKU总表" : "导出产品库", importLabel: "导入产品库", exportable: true, importable: activeProductPanel !== "sku" };
    }
    if (activeView === "settings") {
      const meta = sectionMeta[activeRuleSection] || sectionMeta.price;
      return { host: "settings", scopeKey: `settings:${activeRuleSection}`, title: `规则参数 · 一级域 ${meta.index} ${meta.title}`, detail: "当前页只保存、导入和导出当前规则域", saveLabel: "保存当前规则域", exportLabel: "导出当前规则域", importLabel: "导入当前规则域", exportable: true, importable: true };
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
    const editingCurrent = uiEditMode && uiEditScope === context.scopeKey;
    const saveDisabled = activeView === "scenario" && !hasOperatorName();
    host.innerHTML = `
      <div class="context-toolbar" data-context-scope="${escapeHtml(context.scopeKey)}">
        <div class="context-toolbar-copy">
          <strong>${escapeHtml(context.title)}</strong>
          <span>${escapeHtml(context.detail)}</span>
          <em id="contextToolbarStatus"></em>
        </div>
        <div class="context-toolbar-actions">
          <button type="button" class="primary${saveDisabled ? " disabled" : ""}" data-context-action="save"${saveDisabled ? " disabled title=\"请先填写测算人名字\"" : ""}>${escapeHtml(context.saveLabel)}</button>
          <button type="button" class="${editingCurrent ? "active" : ""}" data-context-action="edit-ui">${editingCurrent ? "退出本页编辑" : "编辑本页UI"}</button>
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

  function productScenarioBandRow(band) {
    return `<tr data-product-scenario-band>
      <td><input type="number" step="1" min="0" max="100" value="${escapeHtml(band.minScore)}" data-product-scenario-band-field="minScore"></td>
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

  function renderApp() {
    renderProductCards();
    renderCostEditor();
    renderScenarioControls();
    renderScenicDatabase();
    renderPricing();
    renderSettings();
    renderProductLibrary();
    renderRecords();
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

  function scenicMatchesForQuery(query, limit = 5) {
    const keyword = String(query || "").trim().toLowerCase();
    if (keyword.length < 2) return [];
    return data.scenicSpots
      .filter((spot) => scenicSearchText(spot).includes(keyword))
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
      return `<button type="button" class="inline-scenic-match" data-inline-apply-scenic="${escapeHtml(spot.id)}" aria-label="套用景区：${escapeHtml(spotName)}">
        <span class="product-id">${escapeHtml(spot.id)}</span>
        <div class="inline-scenic-main">
          <span class="inline-scenic-kicker">匹配景区</span>
          <strong class="inline-scenic-name">${escapeHtml(spotName)}</strong>
          <small>${escapeHtml([spot.city || spot.province, spot.scenicLevel, spot.scenicType].filter(Boolean).join(" · "))}</small>
          <em>${escapeHtml(spot.dataYear || 2025)}年 · ${escapeHtml(spot.annualVisitors)}万人</em>
        </div>
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
      if (activeView === "scenic-db") return [["panelScenicDb", "面板标题"], ["scenicDbHeadTitle", "景区库标题"], ["scenicDbHeadIntro", "景区库说明", "textarea"], ["scenicDbCountNote", "计数说明", "textarea"]];
      if (activeView === "cost") return [["panelProductChoice", "面板：产品选择"], ["panelCostComponents", "面板：成本组件"], ["panelCostResults", "面板：成本结果"]];
      if (activeView === "pricing") return [["panelPricingChannel", "面板：渠道参数"], ["panelPricingResults", "面板：定价结果"]];
      if (activeView === "records") return [["panelRecords", "面板标题"]];
      if (activeView === "products") return [["panelProducts", "面板标题"]];
      if (activeView === "settings") return [["panelSettings", "面板标题"]];
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
      const orderIndex = uiLayout.mainViewOrder.indexOf(viewName);
      button.style.order = orderIndex >= 0 ? String(orderIndex) : "";
      if (button.classList.contains("mobile-tab")) {
        const label = button.querySelector(".mobile-tab-label");
        if (label) label.textContent = uiText(meta.mobileTextKey) || meta.fallback || viewName;
      } else {
        button.textContent = uiText(meta.textKey) || meta.fallback || viewName;
      }
    });
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
    qsa('[data-context-action="edit-ui"]').forEach((button) => {
      const editingCurrent = uiEditMode && uiEditScope === currentUiScopeKey();
      button.classList.toggle("active", editingCurrent);
      button.textContent = editingCurrent ? "退出本页编辑" : "编辑本页UI";
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
        field("城市", `<input type="text" value="${escapeHtml(s.city || "")}" data-scenario="city">`),
        field("景区等级", selectInput(s.scenicLevel, optionList(scoring.scenicLevel), 'data-scenario="scenicLevel"')),
        field("年客流量(万人)", numberInput({ value: s.annualVisitors, min: 0, step: 10, attr: 'data-scenario="annualVisitors"' })),
        field("数据年份", numberInput({ value: s.dataYear || 2025, min: 2020, step: 1, attr: 'data-scenario="dataYear"' }), "优先使用2025年度数据，缺口先标待复核"),
        field("客流数据口径", `<input type="text" value="${escapeHtml(s.visitorDataBasis || "")}" data-scenario="visitorDataBasis">`, "注明年度、假日、城市口径或待复核"),
        field("收费状态", selectInput(s.ticketMode, [{ value: "收费", label: "收费" }, { value: "免费", label: "免费" }], 'data-scenario="ticketMode"')),
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
          ${field("测算人", `<input type="text" value="${escapeHtml(state.operatorName || "")}" data-operator-name placeholder="填写姓名后才能保存测算">`, "必填，用于历史测算追踪")}
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
    container.innerHTML = `
      <div class="scenic-db-head">
        <div>
          <strong>${escapeHtml(uiLayout.texts.scenicDbHeadTitle)}</strong>
          <span>${escapeHtml(uiLayout.texts.scenicDbHeadIntro)}</span>
        </div>
        <div class="scenic-stat-grid">
          <div><span>当前样本</span><b>${filtered.length}/${data.scenicSpots.length}</b></div>
          <div><span>公开适配强匹配</span><b>${strongT0Count}</b></div>
          <div><span>多渠道已核</span><b>${multiVerifiedCount}</b></div>
          <div><span>名单已核/待补证</span><b>${officialListCount}/${needCheckCount}</b></div>
        </div>
      </div>
      <div class="scenic-data-notice">
        景区库只保留公开基础数据和公开适配分，不是最终评级表。同一个景区会因为店铺位置、店型、陈列空间、商务条件、官方资源不同，在“场景评级”里得到不同等级；2025客流/收入等经营数据必须多渠道核验后才作为商务依据，未核数据只用于线索和初筛。
      </div>
      <div class="library-toolbar scenic-toolbar">
        <input type="search" id="scenicSearchInput" value="${escapeHtml(scenicSearch)}" placeholder="搜索景区、城市、类型、公开标签">
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
          const readyText = statusText.includes("已核") ? "2025客流已核" : "2025口径待核";
          return `<article class="scenic-card">
            <div class="scenic-card-main">
              <span class="product-id">${escapeHtml(spot.id)}</span>
              <div>
                <h3>${escapeHtml(spot.name)}</h3>
                <p>${escapeHtml([spot.region, spot.province, spot.city, spot.scenicLevel, spot.scenicType].filter(Boolean).join(" · "))}</p>
              </div>
              <div class="scenic-card-badges">
                <span>${escapeHtml(spot.priorityTier || "待分级")}</span>
              </div>
            </div>
            <div class="stage-pills">
              ${scenicStagePill("公开适配", spotResult.scenario.t0Score, t0Band)}
              <span class="stage-pill neutral">非最终评级</span>
              <span class="stage-pill ${scenicVerificationClass(spot.verificationStatus)}">${escapeHtml(spot.verificationStatusLabel)}</span>
              <span class="stage-pill neutral">${escapeHtml(readyText)}</span>
              <span class="stage-pill neutral">店位/商务由销售填报</span>
            </div>
            ${tags.length ? `<div class="fit-tags">${tags.slice(0, 6).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
            <dl>
              <dt>数据年份</dt><dd>${escapeHtml(spot.dataYear || 2025)}年</dd>
              <dt>公开适配分</dt><dd>${escapeHtml(spotResult.scenario.t0Score)}分 · 仅用于销售检索和初筛，最终评级看当次店位/商务/资源填报</dd>
              <dt>客流</dt><dd>${escapeHtml(spot.annualVisitors)}万人 · ${escapeHtml(spot.visitorDataBasis)}</dd>
              <dt>门票</dt><dd>${escapeHtml(spot.ticketMode)} · ${money(spot.ticketPrice || 0)}</dd>
              <dt>类型</dt><dd>${escapeHtml(spot.scenicType)}</dd>
              <dt>瓦文化</dt><dd>${escapeHtml(spot.tileRelevance)}</dd>
              <dt>购买心智</dt><dd>${escapeHtml(spot.commemorationMind)}</dd>
              <dt>客群传播</dt><dd>${escapeHtml(spot.youngSpread)}</dd>
              <dt>文化背书</dt><dd>${escapeHtml(spot.culturalEndorsement)}</dd>
              <dt>数据状态</dt><dd>${escapeHtml(spot.dataStatus || "待复核")}</dd>
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
    return String(state.operatorName || "").trim().length > 0;
  }

  function updateSaveRecordButtons() {
    const ready = hasOperatorName();
    qsa('[data-context-action="save"], [data-save-record]').forEach((button) => {
      const isScenarioContextSave = button.matches('[data-context-action="save"]') && activeView === "scenario";
      if (button.matches('[data-context-action="save"]') && !isScenarioContextSave) return;
      button.disabled = !ready;
      button.classList.toggle("disabled", !ready);
      button.title = ready ? "保存当前测算" : "请先在场景评级底部填写测算人名字";
    });
    setHtml("saveRecordHint", ready ? `将以“${escapeHtml(state.operatorName.trim())}”保存到历史测算。` : "请先填写测算人名字，保存按钮才会启用。");
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
          title: "预计收入 = 底薪 + 测算提成 + 拓展奖金",
          detail: `代入：${money(result.commission.salaryBase)} + ${money(result.commission.monthlyCommission)} + ${money(result.commission.bonus)} = ${money(result.commission.income)}`
        }
      ])}
    </div>`;
  }

  function commissionSummaryHtml(result) {
    const isConsignment = String(result.commission.mode).includes("寄售");
    return `
      ${metricCard("预计收入", money(result.commission.income), `底薪+测算提成+拓展奖金`, "profit")}
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
        ["收入估算", money(result.commission.income)]
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
    renderScenarioStickySummary(result);
    renderBusinessGuidance(result);
    renderScenarioCommission(result);
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
      ["收入估算", money(result.commission.income)],
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
        <span>${escapeHtml(data.rules.ui.scoringModelNote || "规则参数库按“一级规则域 → 二级参数组 → 具体参数项”管理；景区公开数据在“景区基础库”，销售当次店位/商务/资源填报在“场景评级”，最终测算沉淀在“测算记录”。")} <a href="./docs/rule-parameter-operating-strategy.md" target="_blank" rel="noopener">查看经营口径说明</a></span>
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
    if (target === "scenarioPriceBands") return { minScore: 60, retail: 79, label: "新场景价带" };
    if (target.endsWith(".options")) return { label: "新选项", score: 0 };
    if (target === "scoring.visitors.thresholds") return { min: 0, score: 0, label: "新客流档" };
    if (target === "scoring.ticket.thresholds") return { min: 0, score: 0, label: "新票价档" };
    if (target === "scoring.vetoRules") {
      const usedKeys = (data.rules.scoring.vetoRules || []).map((item) => item.key);
      return { key: nextRuleName("vetoCustom", usedKeys), label: "新红线规则" };
    }
    if (target === "purchaseTiers") return { productClass: "大瓦", productType: "手绘款", minQty: 1, maxQty: 9, name: "新增阶梯", discount: 0.6, manualPrice: null, useManualPrice: false, enabled: true };
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
    return settingsSection("price", `
      ${settingsSubsection("二级 1", "基础参数", "影响所有成本、定价和提成测算的全局参数", `
        <div class="settings-grid">
        ${field("高价带成本占比", settingInput("highPriceCostShare", data.rules.highPriceCostShare, "0.01", "0"))}
        ${field("管理保留比例", settingInput("managementReserveRate", data.rules.managementReserveRate, "0.01", "0"))}
        ${field("渠道经理底薪", settingInput("salaryBase", data.rules.salaryBase, "100", "0"))}
        </div>
      `)}
      ${settingsSubsection("二级 2", "默认成本价带模板", "仅作为产品未单独配置时的兜底模板；实际测算优先使用产品库里的成本价带", `
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
      ${settingsSubsection("二级 3", "默认场景价带模板", "仅作为产品未单独配置时的兜底模板；S/A/B/C 场景价带最终仍跟随每个产品", `
        ${ruleActions("scenarioPriceBands", "新增场景价带")}
        <table class="config-table">
          <thead><tr><th>场景分下限</th><th>建议零售价</th><th>标签</th><th>操作</th></tr></thead>
          <tbody>${data.rules.scenarioPriceBands.map((band, index) => `
            <tr>
              <td>${settingInput(`scenarioPriceBands.${index}.minScore`, band.minScore, "1", "0")}</td>
              <td>${settingInput(`scenarioPriceBands.${index}.retail`, band.retail, "1", "0")}</td>
              <td>${settingText(`scenarioPriceBands.${index}.label`, band.label)}</td>
              <td>${ruleDeleteButton("scenarioPriceBands", index)}</td>
            </tr>`).join("")}</tbody>
        </table>
      `)}
    `);
  }

  function renderGradeSettings() {
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
      ${settingsSubsection("二级 1", "单款采购阶梯", "按产品大类、产品类型和单款采购数量计算阶梯采购价", `
        ${ruleActions("purchaseTiers", "新增采购阶梯")}
        <table class="config-table wide">
          <thead><tr><th>大类</th><th>类型</th><th>数量下限</th><th>数量上限</th><th>阶梯</th><th>折扣</th><th>启用</th><th>操作</th></tr></thead>
          <tbody>${data.rules.purchaseTiers.map((tier, index) => `
            <tr>
              <td>${settingText(`purchaseTiers.${index}.productClass`, tier.productClass)}</td>
              <td>${settingText(`purchaseTiers.${index}.productType`, tier.productType)}</td>
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
        <td><strong>${escapeHtml(item.id)}</strong></td>
        <td>${skuImage(item.productImagePath, `${item.name} 产品图`, "product")}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.productSeries)}<br><small>${escapeHtml(item.styleRegion || "")}</small></td>
        <td>${escapeHtml(item.spec)}<br><small>${escapeHtml(item.skuProductType)} · ${escapeHtml(item.craftType)}</small></td>
        <td>${escapeHtml(item.barcode || "")}</td>
        <td>${skuImage(item.barcodeImagePath, `${item.name} 69码`, "barcode")}</td>
        <td>${item.suggestedRetail ? money(item.suggestedRetail) : "-"}</td>
        <td>${escapeHtml(item.launchDate || "")}</td>
      </tr>
    `).join("");
    return `
      ${skuMetaNote()}
      <div class="sku-toolbar">
        <input type="search" id="skuSearchInput" value="${escapeHtml(skuSearch)}" placeholder="搜索SKU名称、地区、69码、产品类别">
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
          <thead><tr><th>SKU</th><th>产品图</th><th>产品名称</th><th>系列/地区</th><th>规格/类型/工艺</th><th>69码</th><th>69码图</th><th>建议零售价</th><th>上新日期</th></tr></thead>
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
    const scenarioBandRows = product.scenarioPriceBands.map(productScenarioBandRow).join("");

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
              <p>同一个 S/A/B/C 场景，不同产品可对应不同建议价</p>
            </div>
            <div class="row-actions">
              <button type="button" id="resetProductScenarioBandsBtn">按产品类型重置</button>
              <button type="button" class="rule-add-btn" id="addProductScenarioBandBtn">新增价带</button>
            </div>
          </div>
          <table class="config-table product-band-table">
            <thead><tr><th>分数下限</th><th>建议零售价</th><th>标签</th><th>操作</th></tr></thead>
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
    if (body) body.insertAdjacentHTML("beforeend", productScenarioBandRow({ minScore: 60, retail: 79, label: "新场景价带" }));
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

  function saveProductFromEditor() {
    const product = productFromEditor();
    if (!product.id || !product.name) {
      alert("产品编码和产品名称不能为空。");
      return;
    }
    const duplicate = data.products.find((item) => item.id === product.id && item.id !== editingProductId);
    if (duplicate) {
      alert("产品编码已存在，请换一个编码。");
      return;
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

  function recordKey(record, index) {
    return record.id || `${record.time || "legacy"}-${record.spotName || "record"}-${index}`;
  }

  function recordInputs(record) {
    if (record.inputs) return normalizeState(record.inputs);
    if (record.state) return normalizeState(record.state);
    return null;
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
    const attr = (key) => `data-record-channel="${index}" data-record-field="${escapeHtml(key)}"`;
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

  function recordDetailHtml(record, index, panel, result) {
    if (!panel) return "";
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
    const html = records.length ? records.map((record, index) => {
      const key = recordKey(record, index);
      const activePanel = activeRecordPanels[key] || "";
      const result = recordResult(record);
      const spotName = result ? result.inputs.scenario.spotName : record.spotName;
      const productText = result ? `${result.cost.product.id} · ${result.cost.product.name}` : `${record.productId || "未记录"} · ${record.productName || "产品未记录"}`;
      const gradeText = result ? `${result.scenario.grade} ${XJCore.round(result.scenario.score, 1)}分` : record.grade;
      const retail = result ? result.pricing.retail : record.retail;
      const commission = result ? result.commission.monthlyCommission : record.monthlyCommission;
      const summaryText = result
        ? `${result.pricing.judgement} · ${result.purchase.status} · ${result.business.policyType} · 扣点${percent(result.business.negotiatedDeduction)}`
        : `${record.judgement || "判断未记录"} · ${record.purchaseStatus || "采购未记录"} · ${record.policyType || "政策未记录"} · ${record.businessDeduction !== undefined ? `扣点${percent(record.businessDeduction)}` : "扣点未记录"}`;
      return `<article class="record-card">
        <div class="record-row">
          <span>${escapeHtml(record.time)}</span>
          <span>${escapeHtml(record.operatorName || "未填测算人")}</span>
          <strong>${escapeHtml(spotName || "未命名点位")}</strong>
          <span>${escapeHtml(productText)}</span>
          <b>${escapeHtml(gradeText || "未评级")} / ${money(retail || 0)} / ${money(commission || 0)}</b>
          <span>${escapeHtml(summaryText)}</span>
          <div class="row-actions record-actions">
            <button type="button" class="${activePanel === "business" ? "active" : ""}" data-record-detail="${index}" data-record-panel="business">商务条件</button>
            <button type="button" class="${activePanel === "commission" ? "active" : ""}" data-record-detail="${index}" data-record-panel="commission">模拟提成</button>
            <button type="button" data-delete-record="${index}">删除</button>
          </div>
        </div>
        ${recordDetailHtml(record, index, activePanel, result)}
      </article>`;
    }).join("") : `<p class="empty">暂无测算记录</p>`;
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

  function updateRecordChannel(target) {
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
    renderRecords();
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
    activeView = viewNames.includes(viewName) ? viewName : "scenario";
    closeUiEditorIfScopeChanged();
    qsa("section[data-view]").forEach((view) => {
      view.hidden = view.dataset.view !== activeView;
    });
    qsa(".view-tabs button[data-view-target]").forEach((button) => {
      button.classList.toggle("active", button.dataset.viewTarget === activeView);
    });
    qsa(".mobile-tab-bar button[data-view-target]").forEach((button) => {
      button.classList.toggle("active", button.dataset.viewTarget === activeView);
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

  function selectProduct(productId) {
    state.productId = productId;
    persistState();
    renderApp();
  }

  function saveCurrentRecord() {
    if (!hasOperatorName()) {
      alert("请先在场景评级底部填写测算人名字。");
      setActiveView("scenario");
      setActiveScenarioPanel("save");
      const input = qs("[data-operator-name]");
      if (input) input.focus();
      updateSaveRecordButtons();
      return;
    }
    const result = currentResult();
    const record = {
      id: `R${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      time: new Date().toLocaleString("zh-CN", { hour12: false }),
      operatorName: state.operatorName.trim(),
      inputs: XJCore.clone(result.inputs)
    };
    syncRecordSummary(record, result);
    records.unshift(record);
    records = records.slice(0, 50);
    persistRecords();
    renderRecords();
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
    if (activeView === "scenic-db") return { context: currentContextInfo(), scenicSpots: XJCore.clone(data.scenicSpots) };
    if (activeView === "cost") return { context: currentContextInfo(), productId: state.productId, cost: result.cost, pricing: result.pricing };
    if (activeView === "pricing") return { context: currentContextInfo(), state: XJCore.clone(state), pricing: result.pricing, business: result.business, purchase: result.purchase, commission: result.commission };
    if (activeView === "records") return { context: currentContextInfo(), records: XJCore.clone(records) };
    if (activeView === "products") {
      if (activeProductPanel === "sku") return { context: currentContextInfo(), skuData: XJCore.clone(skuData) };
      return { context: currentContextInfo(), products: XJCore.clone(data.products) };
    }
    if (activeView === "settings") return { context: currentContextInfo(), ruleSection: activeRuleSection, rules: ruleSectionPayload(activeRuleSection) };
    return { context: currentContextInfo(), state: XJCore.clone(state) };
  }

  function saveCurrentContext() {
    if (activeView === "scenario") {
      saveCurrentRecord();
      return;
    }
    if (activeView === "scenic-db") {
      persistScenicSpots();
      flashContextToolbar("已保存当前景区库");
      return;
    }
    if (activeView === "products") {
      window.ProductProvider.saveAllProducts(data.products);
      flashContextToolbar(activeProductPanel === "sku" ? "SKU总表为同步数据，已保留当前产品库" : "已保存当前产品库");
      return;
    }
    if (activeView === "settings") {
      persistRules("保存当前规则域");
      flashContextToolbar("已保存当前规则域");
      return;
    }
    if (activeView === "records") {
      persistRecords();
      flashContextToolbar("已保存测算记录");
      return;
    }
    persistState();
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

  function handleInput(event) {
    const target = event.target;
    if (target.id === "scenicSearchInput") {
      if (scenicSearchComposing || event.isComposing) return;
      scenicSearch = target.value;
      scenicVisibleLimit = 80;
      scheduleScenicDatabaseRender();
      return;
    }
    if (target.id === "skuSearchInput") {
      skuSearch = target.value;
      renderProductLibrary();
      setActiveProductPanel("sku");
      return;
    }
    if (target.matches("[data-record-channel]")) {
      window.clearTimeout(updateRecordChannel.timer);
      updateRecordChannel.timer = window.setTimeout(() => updateRecordChannel(target), 250);
      return;
    }
    if (target.matches("[data-ui-text]")) {
      const textKey = target.dataset.uiText;
      uiLayout.texts[textKey] = target.value;
      uiLayout = normalizeUiLayout(uiLayout);
      persistUiLayout("修改UI文案");
      if (textKey.startsWith("scenicDb")) renderScenicDatabase();
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
      updateRecordChannel(target);
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
  }

  function bindEvents() {
    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleChange);
    document.addEventListener("compositionstart", (event) => {
      if (event.target && event.target.id === "scenicSearchInput") {
        scenicSearchComposing = true;
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
      const viewButton = event.target.closest("[data-view-target]");
      if (viewButton) {
        setActiveView(viewButton.dataset.viewTarget);
        return;
      }
      const contextAction = event.target.closest("[data-context-action]");
      if (contextAction) {
        const action = contextAction.dataset.contextAction;
        if (action === "save") saveCurrentContext();
        if (action === "edit-ui") toggleContextUiEdit();
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
        downloadJson("寻迹万物销售测算记录.json", records);
        return;
      }
      if (event.target.id === "exportScenicSpotsBtn") {
        downloadJson("寻迹万物景区基础库.json", { scenicSpots: data.scenicSpots });
        return;
      }
      if (event.target.id === "resetScenicSpotsBtn") {
        resetScenicSpots();
        return;
      }
      if (event.target.id === "clearScenicFiltersBtn") {
        clearScenicFilters();
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
