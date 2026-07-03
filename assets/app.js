(function runSalesCalculator() {
  const STORAGE_RULES = "xj-sales-calculator-rules-v1";
  const STORAGE_STATE = "xj-sales-calculator-state-v1";
  const STORAGE_PRODUCTS = "xj-sales-calculator-products-v1";
  const STORAGE_RECORDS = "xj-sales-calculator-records-v1";

  const sectionMeta = {
    price: { title: "价带", label: "成本与定价", detail: "成本阈值、建议价、管理保留" },
    grade: { title: "评级", label: "S/A/B/C", detail: "等级阈值、扣点、计售比、铺货上限" },
    scoring: { title: "评分", label: "场景模型", detail: "客流、文化、陈列、授权等分值" },
    purchase: { title: "采购", label: "阶梯与上限", detail: "单款阶梯价、寄售结算价上限" },
    commission: { title: "提成", label: "动销与回款", detail: "提成率、动销、账期、数据质量" }
  };

  let data = XJCore.clone(window.DEFAULT_DATA);
  const savedRules = loadJson(STORAGE_RULES);
  if (savedRules) data.rules = mergeRules(data.rules, savedRules);
  const savedProducts = loadJson(STORAGE_PRODUCTS);
  if (Array.isArray(savedProducts) && savedProducts.length) {
    data.products = normalizeProducts(savedProducts);
  }

  let state = loadJson(STORAGE_STATE) || XJCore.clone(data.defaultInputs);
  state = normalizeState(state);
  let records = loadJson(STORAGE_RECORDS) || [];
  let activeView = "calculator";
  let editingProductId = null;

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

  function normalizeState(input) {
    const productId = data.products.some((product) => product.id === input.productId) ? input.productId : data.products[0].id;
    return {
      ...XJCore.clone(data.defaultInputs),
      ...input,
      productId,
      scenario: { ...data.defaultInputs.scenario, ...(input.scenario || {}) },
      channel: { ...data.defaultInputs.channel, ...(input.channel || {}) },
      costOverrides: { ...(input.costOverrides || {}) }
    };
  }

  function persistState() {
    saveJson(STORAGE_STATE, state);
  }

  function persistRules() {
    saveJson(STORAGE_RULES, data.rules);
  }

  function persistProducts() {
    saveJson(STORAGE_PRODUCTS, data.products);
  }

  function persistRecords() {
    saveJson(STORAGE_RECORDS, records);
  }

  function normalizeProduct(product) {
    const fallback = window.DEFAULT_DATA.products[0];
    const components = {};
    Object.keys(XJCore.componentLabels).forEach((key) => {
      components[key] = Number(product.components && product.components[key] !== undefined ? product.components[key] : 0);
    });
    return {
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

  function currentResult() {
    return XJCore.calculate(data, state);
  }

  function renderApp() {
    renderProductCards();
    renderCostEditor();
    renderScenarioControls();
    renderChannelControls();
    renderSettings();
    renderProductLibrary();
    renderRecords();
    updateCalculatedViews();
    setActiveView(activeView);
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
        <label class="cost-row">
          <span>${escapeHtml(label)}</span>
          <input type="number" step="0.1" min="0" value="${escapeHtml(value)}" data-cost="${escapeHtml(key)}">
        </label>`;
    }).join("");

    qs("#dropZone").innerHTML = `
      <div class="drop-product">
        <span class="product-id">${escapeHtml(product.id)}</span>
        <div>
          <strong>${escapeHtml(product.name)}</strong>
          <small>${escapeHtml(product.structure)} · ${escapeHtml(product.carrier)} · ${escapeHtml(product.packageType)}</small>
        </div>
      </div>
      <button class="icon-button" type="button" id="resetCostBtn" title="恢复该产品默认成本">↺</button>`;

    qs("#costEditor").innerHTML = componentRows;
  }

  function optionList(group) {
    return group.options.map((item) => ({ value: item.label, label: `${item.label} · ${item.score}分` }));
  }

  function renderScenarioControls() {
    const s = state.scenario;
    const scoring = data.rules.scoring;
    qs("#scenarioControls").innerHTML = `
      ${field("点位/门店", `<input type="text" value="${escapeHtml(s.spotName)}" data-scenario="spotName">`)}
      ${field("景区评级", selectInput(s.scenicLevel, optionList(scoring.scenicLevel), 'data-scenario="scenicLevel"'))}
      ${field("年客流量(万人)", numberInput({ value: s.annualVisitors, min: 0, step: 10, attr: 'data-scenario="annualVisitors"' }))}
      ${field("收费状态", selectInput(s.ticketMode, [{ value: "收费", label: "收费" }, { value: "免费", label: "免费" }], 'data-scenario="ticketMode"'))}
      ${field("门票金额", numberInput({ value: s.ticketPrice, min: 0, step: 1, attr: 'data-scenario="ticketPrice"' }))}
      ${field("文化关联", selectInput(s.culture, optionList(scoring.culture), 'data-scenario="culture"'))}
      ${field("动线位置", selectInput(s.location, optionList(scoring.location), 'data-scenario="location"'))}
      ${field("铺位类型", selectInput(s.store, optionList(scoring.store), 'data-scenario="store"'))}
      ${field("陈列资源", selectInput(s.display, optionList(scoring.display), 'data-scenario="display"'))}
      ${field("优待政策", selectInput(s.policy, optionList(scoring.policy), 'data-scenario="policy"'))}
      ${field("官方授权", selectInput(s.auth, optionList(scoring.auth), 'data-scenario="auth"'))}
    `;
  }

  function renderChannelControls() {
    const result = currentResult();
    const c = state.channel;
    const priceOptions = [{ value: 0, label: `自动推荐 · ${money(result.pricing.suggestedRetail)}` }].concat(
      data.rules.priceOptions.map((price) => ({ value: price, label: money(price) }))
    );
    const gradeOptions = [{ value: "", label: `自动 · ${result.scenario.grade}` }].concat(
      XJCore.gradeOrder.map((grade) => ({ value: grade, label: grade }))
    );
    qs("#channelControls").innerHTML = `
      ${field("合作模式", selectInput(c.mode, Object.keys(data.rules.commissionRates).map((name) => ({ value: name, label: name })), 'data-channel="mode"'))}
      ${field("点位等级", selectInput(c.gradeOverride, gradeOptions, 'data-channel="gradeOverride"'))}
      ${field("零售价", selectInput(c.retailOverride, priceOptions, 'data-channel="retailOverride"'))}
      ${field("采购数量", numberInput({ value: c.purchaseQty, min: 0, step: 1, attr: 'data-channel="purchaseQty"' }))}
      ${field("总采购量", numberInput({ value: c.totalPurchaseQty, min: 0, step: 1, attr: 'data-channel="totalPurchaseQty"' }))}
      ${field("月销售额", numberInput({ value: c.monthlySales, min: 0, step: 100, attr: 'data-channel="monthlySales"' }))}
      ${field("铺货数量", numberInput({ value: c.stockQty, min: 0, step: 1, attr: 'data-channel="stockQty"' }))}
      ${field("当月销售数量", numberInput({ value: c.soldQty, min: 0, step: 1, attr: 'data-channel="soldQty"' }))}
      ${field("保证金", numberInput({ value: c.deposit, min: 0, step: 100, attr: 'data-channel="deposit"' }))}
      ${field("产品大类", selectInput(c.productClassOverride, [{ value: "", label: `自动 · ${result.cost.product.productClass}` }, { value: "大瓦", label: "大瓦" }, { value: "小瓦", label: "小瓦" }], 'data-channel="productClassOverride"'))}
      ${field("产品类型", selectInput(c.productTypeOverride, [{ value: "", label: `自动 · ${result.cost.product.productType}` }, { value: "手绘款", label: "手绘款" }, { value: "工艺款", label: "工艺款" }], 'data-channel="productTypeOverride"'))}
      ${field("核算口径", selectInput(c.dataQuality, Object.keys(data.rules.dataQualityFactors).map((name) => ({ value: name, label: `${name} · ${percent(data.rules.dataQualityFactors[name])}` })), 'data-channel="dataQuality"'))}
      ${field("账期", selectInput(c.paymentTerm, Object.keys(data.rules.paymentFactors).map((name) => ({ value: name, label: `${name} · ${percent(data.rules.paymentFactors[name])}` })), 'data-channel="paymentTerm"'))}
    `;
  }

  function metricCard(label, value, note, tone = "") {
    return `<article class="metric-card ${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(note)}</small>
    </article>`;
  }

  function updateCalculatedViews() {
    const result = currentResult();
    qs("#summaryStrip").innerHTML = `
      ${metricCard("综合评级", `${result.scenario.grade} · ${XJCore.round(result.scenario.score, 1)}分`, result.scenario.risk, `grade-${result.scenario.grade}`)}
      ${metricCard("建议零售价", money(result.pricing.retail), `成本底线 ${money(result.cost.minRetail)} / 场景建议 ${money(result.scenario.recommendedRetail)}`, "accent")}
      ${metricCard("可分配毛利", money(result.pricing.distributableMargin), `我方计售比 ${percent(result.pricing.activeSettlementRatio)}`, "profit")}
      ${metricCard("采购校验", result.purchase.status, `${money(result.purchase.finalUnitPrice)} / 片`, result.purchase.status === "需下调" ? "warn" : "ok")}
    `;

    qs("#resultsPanel").innerHTML = `
      <section class="result-block">
        <h3>成本</h3>
        <dl>
          <dt>总成本</dt><dd>${money(result.cost.totalCost)}</dd>
          <dt>最低价带</dt><dd>${money(result.cost.minRetail)}</dd>
          <dt>成本占比</dt><dd>${percent(result.pricing.costShare)}</dd>
          <dt>产品口径</dt><dd>${escapeHtml(result.productClass)} · ${escapeHtml(result.productType)}</dd>
        </dl>
      </section>
      <section class="result-block">
        <h3>场景</h3>
        <dl>
          <dt>测算等级</dt><dd>${escapeHtml(result.pricing.effectiveGrade)}</dd>
          <dt>建议定价</dt><dd>${money(result.scenario.recommendedRetail)}</dd>
          <dt>合作模式</dt><dd>${escapeHtml(result.scenario.gradeParam.mode)}</dd>
          <dt>授权优先</dt><dd>${escapeHtml(result.scenario.needAuth)}</dd>
        </dl>
      </section>
      <section class="result-block">
        <h3>定价</h3>
        <dl>
          <dt>我方回款/片</dt><dd>${money(result.pricing.settlement)}</dd>
          <dt>单片毛利</dt><dd>${money(result.pricing.grossMargin)}</dd>
          <dt>毛利率</dt><dd>${percent(result.pricing.grossMarginRate)}</dd>
          <dt>判断</dt><dd>${escapeHtml(result.pricing.judgement)}</dd>
        </dl>
      </section>
      <section class="result-block">
        <h3>采购/寄售</h3>
        <dl>
          <dt>匹配阶梯</dt><dd>${escapeHtml(result.purchase.tier ? result.purchase.tier.name : "未匹配")}</dd>
          <dt>阶梯采购价</dt><dd>${money(result.purchase.tierUnitPrice)}</dd>
          <dt>寄售上限</dt><dd>${money(result.consignment.capUnitPrice)}</dd>
          <dt>最终采购小计</dt><dd>${money(result.purchase.finalTotal)}</dd>
          <dt>总采政策</dt><dd>${escapeHtml(result.purchase.totalPolicy.name)}</dd>
        </dl>
      </section>
      <section class="result-block">
        <h3>提成</h3>
        <dl>
          <dt>单片提成</dt><dd>${money(result.commission.perUnitCommission)}</dd>
          <dt>月提成</dt><dd>${money(result.commission.monthlyCommission)}</dd>
          <dt>拓新奖金</dt><dd>${money(result.commission.bonus)}</dd>
          <dt>收入估算</dt><dd>${money(result.commission.income)}</dd>
          <dt>预警</dt><dd>${escapeHtml(result.commission.warning)}</dd>
        </dl>
      </section>
    `;

    qs("#scoreBreakdown").innerHTML = result.scenario.breakdown.map((item) => {
      const width = Math.max(0, Math.min(100, item.score * 5));
      return `<div class="score-row">
        <span>${escapeHtml(item.label)}</span>
        <div class="score-track"><i style="width:${width}%"></i></div>
        <b>${escapeHtml(item.score)}分</b>
      </div>`;
    }).join("");
  }

  function renderRuleBoard() {
    const order = data.rules.ui.ruleOrder || Object.keys(sectionMeta);
    return order.map((key) => {
      const meta = sectionMeta[key];
      return `<button class="rule-card" draggable="true" data-rule-card="${escapeHtml(key)}">
        <span>${escapeHtml(meta.title)}</span>
        <strong>${escapeHtml(meta.label)}</strong>
        <small>${escapeHtml(meta.detail)}</small>
      </button>`;
    }).join("");
  }

  function renderSettings() {
    qs("#ruleBoard").innerHTML = renderRuleBoard();
    const order = data.rules.ui.ruleOrder || Object.keys(sectionMeta);
    qs("#settingsBody").innerHTML = order.map((key) => {
      if (key === "price") return renderPriceSettings();
      if (key === "grade") return renderGradeSettings();
      if (key === "scoring") return renderScoringSettings();
      if (key === "purchase") return renderPurchaseSettings();
      if (key === "commission") return renderCommissionSettings();
      return "";
    }).join("");
  }

  function settingInput(path, value, step = "1", min = "") {
    const minAttr = min !== "" ? ` min="${min}"` : "";
    return `<input type="number" step="${step}"${minAttr} value="${escapeHtml(value)}" data-rule-path="${escapeHtml(path)}">`;
  }

  function renderPriceSettings() {
    return `<section class="settings-section">
      <div class="section-title"><h2>成本与价带</h2><button type="button" id="resetRulesBtn">恢复默认</button></div>
      <div class="settings-grid">
        ${field("高价带成本占比", settingInput("highPriceCostShare", data.rules.highPriceCostShare, "0.01", "0"))}
        ${field("管理保留比例", settingInput("managementReserveRate", data.rules.managementReserveRate, "0.01", "0"))}
        ${field("渠道经理底薪", settingInput("salaryBase", data.rules.salaryBase, "100", "0"))}
      </div>
      <table class="config-table">
        <thead><tr><th>成本上限</th><th>建议零售价</th><th>标签</th></tr></thead>
        <tbody>${data.rules.costPriceBands.map((band, index) => `
          <tr>
            <td>${settingInput(`costPriceBands.${index}.maxCost`, band.maxCost, "0.1", "0")}</td>
            <td>${settingInput(`costPriceBands.${index}.retail`, band.retail, "1", "0")}</td>
            <td><input value="${escapeHtml(band.label)}" data-rule-path="costPriceBands.${index}.label"></td>
          </tr>`).join("")}</tbody>
      </table>
      <table class="config-table">
        <thead><tr><th>场景分下限</th><th>建议零售价</th><th>标签</th></tr></thead>
        <tbody>${data.rules.scenarioPriceBands.map((band, index) => `
          <tr>
            <td>${settingInput(`scenarioPriceBands.${index}.minScore`, band.minScore, "1", "0")}</td>
            <td>${settingInput(`scenarioPriceBands.${index}.retail`, band.retail, "1", "0")}</td>
            <td><input value="${escapeHtml(band.label)}" data-rule-path="scenarioPriceBands.${index}.label"></td>
          </tr>`).join("")}</tbody>
      </table>
    </section>`;
  }

  function renderGradeSettings() {
    return `<section class="settings-section">
      <div class="section-title"><h2>S/A/B/C 参数</h2></div>
      <table class="config-table">
        <thead><tr><th>等级</th><th>分数线</th><th>景区扣点</th><th>基础计售比</th><th>最低计售比</th><th>铺货上限</th><th>拓新奖金</th></tr></thead>
        <tbody>${XJCore.gradeOrder.map((grade) => {
          const item = data.rules.gradeParams[grade];
          return `<tr>
            <td><b>${grade}</b></td>
            <td>${settingInput(`gradeParams.${grade}.threshold`, item.threshold, "1", "0")}</td>
            <td>${settingInput(`gradeParams.${grade}.deduction`, item.deduction, "0.01", "0")}</td>
            <td>${settingInput(`gradeParams.${grade}.baseSettlementRatio`, item.baseSettlementRatio, "0.01", "0")}</td>
            <td>${settingInput(`gradeParams.${grade}.minSettlementRatio`, item.minSettlementRatio, "0.01", "0")}</td>
            <td>${settingInput(`gradeParams.${grade}.stockLimit`, item.stockLimit, "100", "0")}</td>
            <td>${settingInput(`gradeParams.${grade}.bonus`, item.bonus, "100", "0")}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>
    </section>`;
  }

  function renderScoringSettings() {
    const scoring = data.rules.scoring;
    const optionGroups = ["scenicLevel", "culture", "location", "store", "display", "policy", "auth"];
    return `<section class="settings-section">
      <div class="section-title"><h2>场景评分</h2></div>
      <div class="score-config">
        ${optionGroups.map((key) => {
          const group = scoring[key];
          return `<div class="score-config-block">
            <h3>${escapeHtml(group.label)}</h3>
            ${group.options.map((option, index) => `
              <label><span>${escapeHtml(option.label)}</span>${settingInput(`scoring.${key}.options.${index}.score`, option.score, "1")}</label>
            `).join("")}
          </div>`;
        }).join("")}
        <div class="score-config-block">
          <h3>${escapeHtml(scoring.visitors.label)}</h3>
          ${scoring.visitors.thresholds.map((item, index) => `
            <label><span>${escapeHtml(item.label)}</span>${settingInput(`scoring.visitors.thresholds.${index}.score`, item.score, "1")}</label>
          `).join("")}
        </div>
        <div class="score-config-block">
          <h3>${escapeHtml(scoring.ticket.label)}</h3>
          <label><span>免费</span>${settingInput("scoring.ticket.freeScore", scoring.ticket.freeScore, "1")}</label>
          ${scoring.ticket.thresholds.map((item, index) => `
            <label><span>${escapeHtml(item.label)}</span>${settingInput(`scoring.ticket.thresholds.${index}.score`, item.score, "1")}</label>
          `).join("")}
        </div>
      </div>
    </section>`;
  }

  function renderPurchaseSettings() {
    return `<section class="settings-section">
      <div class="section-title"><h2>采购阶梯</h2></div>
      <table class="config-table wide">
        <thead><tr><th>大类</th><th>类型</th><th>数量下限</th><th>数量上限</th><th>阶梯</th><th>折扣</th><th>启用</th></tr></thead>
        <tbody>${data.rules.purchaseTiers.map((tier, index) => `
          <tr>
            <td><input value="${escapeHtml(tier.productClass)}" data-rule-path="purchaseTiers.${index}.productClass"></td>
            <td><input value="${escapeHtml(tier.productType)}" data-rule-path="purchaseTiers.${index}.productType"></td>
            <td>${settingInput(`purchaseTiers.${index}.minQty`, tier.minQty, "1", "0")}</td>
            <td>${settingInput(`purchaseTiers.${index}.maxQty`, tier.maxQty, "1", "0")}</td>
            <td><input value="${escapeHtml(tier.name)}" data-rule-path="purchaseTiers.${index}.name"></td>
            <td>${settingInput(`purchaseTiers.${index}.discount`, tier.discount, "0.01", "0")}</td>
            <td><input type="checkbox" ${tier.enabled ? "checked" : ""} data-rule-path="purchaseTiers.${index}.enabled"></td>
          </tr>`).join("")}</tbody>
      </table>
    </section>`;
  }

  function renderCommissionSettings() {
    return `<section class="settings-section">
      <div class="section-title"><h2>提成与动销</h2></div>
      <div class="settings-grid">
        ${Object.keys(data.rules.commissionRates).map((name) => field(name, settingInput(`commissionRates.${name}`, data.rules.commissionRates[name], "0.01", "0"))).join("")}
      </div>
      <table class="config-table">
        <thead><tr><th>动销率下限</th><th>状态</th><th>系数</th><th>处理建议</th></tr></thead>
        <tbody>${data.rules.sellThroughFactors.map((item, index) => `
          <tr>
            <td>${settingInput(`sellThroughFactors.${index}.minRate`, item.minRate, "0.01", "0")}</td>
            <td><input value="${escapeHtml(item.status)}" data-rule-path="sellThroughFactors.${index}.status"></td>
            <td>${settingInput(`sellThroughFactors.${index}.factor`, item.factor, "0.1", "0")}</td>
            <td><input value="${escapeHtml(item.action)}" data-rule-path="sellThroughFactors.${index}.action"></td>
          </tr>`).join("")}</tbody>
      </table>
      <div class="settings-grid">
        ${Object.keys(data.rules.dataQualityFactors).map((name) => field(name, settingInput(`dataQualityFactors.${name}`, data.rules.dataQualityFactors[name], "0.01", "0"))).join("")}
        ${Object.keys(data.rules.paymentFactors).map((name) => field(name, settingInput(`paymentFactors.${name}`, data.rules.paymentFactors[name], "0.01", "0"))).join("")}
      </div>
    </section>`;
  }

  function renderProductLibrary() {
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

    qs("#productLibrary").innerHTML = `
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
    return normalizeProduct({ ...fields, components });
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

    const existingIndex = data.products.findIndex((item) => item.id === editingProductId);
    if (existingIndex >= 0) {
      const oldId = data.products[existingIndex].id;
      data.products[existingIndex] = product;
      if (state.productId === oldId) state.productId = product.id;
    } else {
      data.products.push(product);
      state.productId = product.id;
    }
    state.costOverrides = {};
    editingProductId = product.id;
    persistProducts();
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
    data.products = data.products.filter((item) => item.id !== productId);
    if (state.productId === productId) {
      state.productId = data.products[0].id;
      state.costOverrides = {};
    }
    if (editingProductId === productId) editingProductId = null;
    persistProducts();
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
    data.products.push(copied);
    editingProductId = copied.id;
    persistProducts();
    renderApp();
    setActiveView("products");
  }

  function resetProducts() {
    if (!confirm("恢复默认产品库？现有本地新增和修改会被覆盖。")) return;
    data.products = XJCore.clone(window.DEFAULT_DATA.products);
    state.productId = data.products[0].id;
    state.costOverrides = {};
    editingProductId = null;
    persistProducts();
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
    data.products = normalizeProducts(products);
    if (!data.products.some((product) => product.id === state.productId)) {
      state.productId = data.products[0].id;
      state.costOverrides = {};
    }
    editingProductId = null;
    persistProducts();
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

  function renderRecords() {
    qs("#recordsList").innerHTML = records.length ? records.map((record, index) => `
      <article class="record-row">
        <span>${escapeHtml(record.time)}</span>
        <strong>${escapeHtml(record.spotName)}</strong>
        <span>${escapeHtml(record.productId)} · ${escapeHtml(record.productName)}</span>
        <b>${escapeHtml(record.grade)} / ${money(record.retail)}</b>
        <span>${escapeHtml(record.judgement)} · ${escapeHtml(record.purchaseStatus)}</span>
        <button type="button" data-delete-record="${index}">删除</button>
      </article>`).join("") : `<p class="empty">暂无测算记录</p>`;
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

  function setActiveView(viewName) {
    activeView = viewName;
    qsa(".view").forEach((view) => {
      view.hidden = view.dataset.view !== viewName;
    });
    qsa("[data-view-target]").forEach((button) => {
      button.classList.toggle("active", button.dataset.viewTarget === viewName);
    });
  }

  function selectProduct(productId) {
    state.productId = productId;
    state.costOverrides = {};
    persistState();
    renderApp();
  }

  function saveCurrentRecord() {
    const result = currentResult();
    records.unshift({
      time: new Date().toLocaleString("zh-CN", { hour12: false }),
      spotName: result.inputs.scenario.spotName,
      productId: result.cost.product.id,
      productName: result.cost.product.name,
      grade: `${result.scenario.grade} ${XJCore.round(result.scenario.score, 1)}分`,
      retail: result.pricing.retail,
      judgement: result.pricing.judgement,
      purchaseStatus: result.purchase.status,
      monthlyCommission: result.commission.monthlyCommission
    });
    records = records.slice(0, 50);
    persistRecords();
    renderRecords();
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

  function handleInput(event) {
    const target = event.target;
    if (target.matches("[data-cost]")) {
      state.costOverrides[target.dataset.cost] = Number(target.value);
      persistState();
      renderChannelControls();
      updateCalculatedViews();
      return;
    }
    if (target.matches("[data-scenario]")) {
      const key = target.dataset.scenario;
      state.scenario[key] = target.type === "number" ? Number(target.value) : target.value;
      persistState();
      renderChannelControls();
      updateCalculatedViews();
      return;
    }
    if (target.matches("[data-channel]")) {
      const key = target.dataset.channel;
      state.channel[key] = target.type === "number" || key === "retailOverride" ? Number(target.value) : target.value;
      persistState();
      updateCalculatedViews();
    }
  }

  function handleChange(event) {
    const target = event.target;
    if (target.matches("[data-cost], [data-scenario], [data-channel]")) {
      handleInput(event);
      return;
    }
    if (target.matches("[data-rule-path]")) {
      setPath(data.rules, target.dataset.rulePath, target.type === "checkbox" ? target.checked : target.value, target.type === "checkbox");
      persistRules();
      renderChannelControls();
      updateCalculatedViews();
    }
  }

  function bindEvents() {
    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleChange);
    document.addEventListener("click", (event) => {
      const productCard = event.target.closest("[data-product-card]");
      if (productCard) {
        selectProduct(productCard.dataset.productCard);
        return;
      }
      const useProduct = event.target.closest("[data-use-product]");
      if (useProduct) {
        selectProduct(useProduct.dataset.useProduct);
        setActiveView("calculator");
        return;
      }
      const viewButton = event.target.closest("[data-view-target]");
      if (viewButton) {
        setActiveView(viewButton.dataset.viewTarget);
        return;
      }
      if (event.target.id === "resetCostBtn") {
        state.costOverrides = {};
        persistState();
        renderCostEditor();
        updateCalculatedViews();
        return;
      }
      if (event.target.id === "saveRecordBtn") {
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
      if (event.target.id === "addProductBtn") {
        editingProductId = "__new__";
        renderProductLibrary();
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
        resetProducts();
        return;
      }
      if (event.target.id === "resetRulesBtn") {
        data.rules = XJCore.clone(window.DEFAULT_DATA.rules);
        persistRules();
        renderApp();
        return;
      }
      const deleteRecord = event.target.closest("[data-delete-record]");
      if (deleteRecord) {
        records.splice(Number(deleteRecord.dataset.deleteRecord), 1);
        persistRecords();
        renderRecords();
        return;
      }
      const editProduct = event.target.closest("[data-edit-product]");
      if (editProduct) {
        editingProductId = editProduct.dataset.editProduct;
        renderProductLibrary();
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

    qs("#ruleBoard").addEventListener("dragover", (event) => {
      if (event.target.closest("[data-rule-card]")) event.preventDefault();
    });
    qs("#ruleBoard").addEventListener("drop", (event) => {
      event.preventDefault();
      const dragged = event.dataTransfer.getData("text/rule-key");
      const target = event.target.closest("[data-rule-card]");
      if (!dragged || !target || dragged === target.dataset.ruleCard) return;
      const order = data.rules.ui.ruleOrder || Object.keys(sectionMeta);
      const next = order.filter((key) => key !== dragged);
      next.splice(next.indexOf(target.dataset.ruleCard), 0, dragged);
      data.rules.ui.ruleOrder = next;
      persistRules();
      renderSettings();
    });

    qs("#importRulesInput").addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const text = await file.text();
      const imported = JSON.parse(text);
      data.rules = mergeRules(window.DEFAULT_DATA.rules, imported.rules || imported);
      persistRules();
      renderApp();
      event.target.value = "";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    renderApp();
  });
})();
