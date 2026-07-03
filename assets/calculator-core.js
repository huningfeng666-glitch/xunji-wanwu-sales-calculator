(function attachCalculatorCore(root) {
  const componentLabels = {
    tile: "主材-瓦",
    uv: "UV定位",
    handPaint: "手绘",
    craft: "工艺加价",
    carrier: "载体成本",
    package: "包装成本",
    customAuth: "定制/授权",
    loss: "损耗/备用",
    logistics: "物流"
  };

  const gradeOrder = ["S", "A", "B", "C"];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function round(value, digits = 2) {
    const factor = 10 ** digits;
    return Math.round((toNumber(value) + Number.EPSILON) * factor) / factor;
  }

  function pct(value) {
    return round(toNumber(value) * 100, 1);
  }

  function findProduct(data, productId) {
    return data.products.find((product) => product.id === productId) || data.products[0];
  }

  function scoreFromOptions(group, selected) {
    const option = group.options.find((item) => item.label === selected);
    return option ? toNumber(option.score) : 0;
  }

  function scoreFromThresholds(thresholds, value) {
    const target = toNumber(value);
    const sorted = [...thresholds].sort((a, b) => b.min - a.min);
    return sorted.find((item) => target >= toNumber(item.min)) || sorted[sorted.length - 1];
  }

  function gradeByScore(rules, score) {
    const params = rules.gradeParams;
    if (score >= toNumber(params.S.threshold)) return "S";
    if (score >= toNumber(params.A.threshold)) return "A";
    if (score >= toNumber(params.B.threshold)) return "B";
    return "C";
  }

  function retailByCost(rules, totalCost) {
    const sorted = [...rules.costPriceBands].sort((a, b) => a.maxCost - b.maxCost);
    const matched = sorted.find((band) => totalCost <= toNumber(band.maxCost));
    if (matched) return matched.retail;
    const raw = totalCost / toNumber(rules.highPriceCostShare, 0.35);
    return Math.ceil(raw / toNumber(rules.priceRound, 10)) * toNumber(rules.priceRound, 10) - toNumber(rules.priceMinus, 1);
  }

  function retailByScenario(rules, score) {
    const sorted = [...rules.scenarioPriceBands].sort((a, b) => b.minScore - a.minScore);
    return sorted.find((band) => score >= toNumber(band.minScore)) || sorted[sorted.length - 1];
  }

  function calculateCost(data, inputs) {
    const product = findProduct(data, inputs.productId);
    const overrides = inputs.costOverrides || {};
    const components = {};
    let totalCost = 0;

    Object.keys(componentLabels).forEach((key) => {
      const baseValue = product.components[key] || 0;
      const value = Object.prototype.hasOwnProperty.call(overrides, key) ? toNumber(overrides[key]) : toNumber(baseValue);
      components[key] = value;
      totalCost += value;
    });

    const minRetail = retailByCost(data.rules, totalCost);
    return {
      product,
      componentLabels,
      components,
      totalCost: round(totalCost, 2),
      minRetail,
      costShareAtMinRetail: minRetail ? totalCost / minRetail : 0,
      priceBandLabel: minRetail <= 89 ? String(minRetail) : "高于89"
    };
  }

  function calculateScenario(data, inputs) {
    const rules = data.rules;
    const scenario = { ...data.defaultInputs.scenario, ...(inputs.scenario || {}) };
    const scoring = rules.scoring;
    const breakdown = [];

    const scenicScore = scoreFromOptions(scoring.scenicLevel, scenario.scenicLevel);
    breakdown.push({ key: "scenicLevel", label: scoring.scenicLevel.label, value: scenario.scenicLevel, score: scenicScore });

    const visitorBand = scoreFromThresholds(scoring.visitors.thresholds, scenario.annualVisitors);
    breakdown.push({ key: "visitors", label: scoring.visitors.label, value: `${toNumber(scenario.annualVisitors)}${scoring.visitors.unit}`, score: visitorBand.score });

    let ticketScore = scoring.ticket.freeScore;
    let ticketValue = "免费";
    if (scenario.ticketMode === "收费") {
      const ticketBand = scoreFromThresholds(scoring.ticket.thresholds, scenario.ticketPrice);
      ticketScore = ticketBand.score;
      ticketValue = `${toNumber(scenario.ticketPrice)}元`;
    }
    breakdown.push({ key: "ticket", label: scoring.ticket.label, value: ticketValue, score: ticketScore });

    ["culture", "location", "store", "display", "policy", "auth"].forEach((key) => {
      const group = scoring[key];
      const score = scoreFromOptions(group, scenario[key]);
      breakdown.push({ key, label: group.label, value: scenario[key], score });
    });

    const rawScore = breakdown.reduce((sum, item) => sum + toNumber(item.score), 0);
    const score = Math.min(100, rawScore);
    const grade = gradeByScore(rules, score);
    const gradeParam = rules.gradeParams[grade];
    const priceBand = retailByScenario(rules, score);
    const needAuth = grade === "S" || scenario.auth !== "官方授权" ? "是/建议优先明确" : "否";
    let risk = "正常跟进";
    if (gradeParam.deduction >= 0.45 && priceBand.retail < 68) {
      risk = "强点位扣点+低定价，需谨慎";
    } else if (scenario.display === "边角陈列") {
      risk = "陈列弱，需控制铺货";
    } else if (scenario.auth === "无授权") {
      risk = "授权风险";
    }

    return {
      scenario,
      breakdown,
      rawScore,
      score,
      grade,
      gradeParam,
      recommendedRetail: priceBand.retail,
      priceBandLabel: priceBand.label,
      needAuth,
      risk
    };
  }

  function findIncentive(rules, monthlySales) {
    const value = toNumber(monthlySales);
    const sorted = [...rules.consignmentIncentives].sort((a, b) => b.minSales - a.minSales);
    return sorted.find((item) => value >= toNumber(item.minSales)) || sorted[sorted.length - 1];
  }

  function calculateConsignment(rules, grade, monthlySales, retail) {
    const gradeParam = rules.gradeParams[grade] || rules.gradeParams.C;
    const incentive = findIncentive(rules, monthlySales);
    const baseRatio = toNumber(gradeParam.baseSettlementRatio);
    const minRatio = toNumber(gradeParam.minSettlementRatio);
    const decrease = toNumber(incentive.decrease);
    const finalRatio = Math.max(minRatio, baseRatio - decrease);
    return {
      grade,
      baseRatio,
      minRatio,
      incentive,
      finalRatio: round(finalRatio, 4),
      capUnitPrice: round(retail * finalRatio, 2)
    };
  }

  function matchPurchaseTier(rules, productClass, productType, qty) {
    const quantity = toNumber(qty);
    return rules.purchaseTiers.find((tier) => (
      tier.enabled &&
      tier.productClass === productClass &&
      tier.productType === productType &&
      quantity >= toNumber(tier.minQty) &&
      quantity <= toNumber(tier.maxQty)
    ));
  }

  function matchTotalPolicy(rules, totalQty) {
    const quantity = toNumber(totalQty);
    return rules.totalPurchasePolicies.find((policy) => quantity >= policy.minQty && quantity <= policy.maxQty) || rules.totalPurchasePolicies[0];
  }

  function calculatePurchase(rules, options) {
    const tier = matchPurchaseTier(rules, options.productClass, options.productType, options.purchaseQty);
    const totalPolicy = matchTotalPolicy(rules, options.totalPurchaseQty);
    if (!tier) {
      return {
        tier: null,
        discount: 0,
        tierUnitPrice: 0,
        finalUnitPrice: 0,
        finalTotal: 0,
        status: "未匹配",
        ruleText: "当前品类/数量没有启用采购阶梯",
        totalPolicy
      };
    }

    const tierUnitPrice = tier.useManualPrice && tier.manualPrice ? toNumber(tier.manualPrice) : options.retail * toNumber(tier.discount);
    const finalUnitPrice = Math.min(tierUnitPrice, options.consignmentCap);
    let status = "通过";
    if (tierUnitPrice > options.consignmentCap) {
      status = "需下调";
    } else if (Math.abs(tierUnitPrice - options.consignmentCap) < 0.0001) {
      status = "压线";
    }

    return {
      tier,
      discount: toNumber(tier.discount),
      tierUnitPrice: round(tierUnitPrice, 2),
      finalUnitPrice: round(finalUnitPrice, 2),
      finalTotal: round(finalUnitPrice * toNumber(options.purchaseQty), 2),
      status,
      ruleText: status === "需下调" ? "最终采购单价已按寄售结算价上限压低" : "采购价未高于该地区寄售结算价",
      totalPolicy
    };
  }

  function findSellThroughFactor(rules, sellThroughRate) {
    const sorted = [...rules.sellThroughFactors].sort((a, b) => b.minRate - a.minRate);
    return sorted.find((item) => sellThroughRate >= item.minRate) || sorted[sorted.length - 1];
  }

  function depositCoefficient(rules, depositCoverage, deposit) {
    if (toNumber(deposit) === 0) return 1;
    const sorted = [...rules.depositFactors].sort((a, b) => b.minCoverage - a.minCoverage);
    const matched = sorted.find((item) => depositCoverage >= item.minCoverage) || sorted[sorted.length - 1];
    return toNumber(matched.factor);
  }

  function buildJudgement({ retail, cost, settlement, distributable, costShare }) {
    if (retail < cost.minRetail) return "低于成本价带";
    if (settlement <= cost.totalCost) return "不可执行";
    if (distributable < 5) return "可分配毛利偏薄";
    if (costShare > 0.4) return "成本偏高，需溢价或礼盒化";
    return "可执行";
  }

  function calculate(data, rawInputs) {
    const inputs = {
      ...clone(data.defaultInputs),
      ...(rawInputs || {}),
      scenario: { ...data.defaultInputs.scenario, ...((rawInputs && rawInputs.scenario) || {}) },
      channel: { ...data.defaultInputs.channel, ...((rawInputs && rawInputs.channel) || {}) },
      costOverrides: { ...((rawInputs && rawInputs.costOverrides) || {}) }
    };
    const rules = data.rules;
    const cost = calculateCost(data, inputs);
    const scenario = calculateScenario(data, inputs);
    const channel = inputs.channel;
    const effectiveGrade = channel.gradeOverride || scenario.grade;
    const gradeParam = rules.gradeParams[effectiveGrade] || rules.gradeParams.C;
    const suggestedRetail = Math.max(cost.minRetail, scenario.recommendedRetail);
    const retail = toNumber(channel.retailOverride) > 0 ? toNumber(channel.retailOverride) : suggestedRetail;
    const monthlySales = channel.monthlySales === "" || channel.monthlySales === null || channel.monthlySales === undefined
      ? retail * toNumber(channel.soldQty)
      : toNumber(channel.monthlySales);
    const consignment = calculateConsignment(rules, effectiveGrade, monthlySales, retail);
    const activeSettlementRatio = String(channel.mode).includes("寄售") ? consignment.finalRatio : toNumber(gradeParam.baseSettlementRatio);
    const deduction = 1 - activeSettlementRatio;
    const settlement = retail * activeSettlementRatio;
    const grossMargin = settlement - cost.totalCost;
    const costShare = retail ? cost.totalCost / retail : 0;
    const grossMarginRate = settlement ? grossMargin / settlement : 0;
    const managementReserve = retail * toNumber(rules.managementReserveRate);
    const distributableMargin = Math.max(0, grossMargin - managementReserve);
    const productClass = channel.productClassOverride || cost.product.productClass;
    const productType = channel.productTypeOverride || cost.product.productType;

    const purchase = calculatePurchase(rules, {
      productClass,
      productType,
      purchaseQty: channel.purchaseQty,
      totalPurchaseQty: channel.totalPurchaseQty,
      retail,
      consignmentCap: consignment.capUnitPrice
    });

    const stockQty = toNumber(channel.stockQty);
    const soldQty = toNumber(channel.soldQty);
    const sellThroughRate = stockQty ? soldQty / stockQty : 0;
    const sellThrough = findSellThroughFactor(rules, sellThroughRate);
    const dataQualityFactor = toNumber(rules.dataQualityFactors[channel.dataQuality]);
    const paymentFactor = toNumber(rules.paymentFactors[channel.paymentTerm]);
    const stockValue = retail * stockQty;
    const depositCoverage = stockValue ? toNumber(channel.deposit) / stockValue : 0;
    const depositFactor = depositCoefficient(rules, depositCoverage, channel.deposit);
    const commissionRate = toNumber(rules.commissionRates[channel.mode]);
    const perUnitCommission = distributableMargin * commissionRate * toNumber(sellThrough.factor) * depositFactor * paymentFactor * dataQualityFactor;
    const monthlyCommission = perUnitCommission * soldQty;
    const bonus = toNumber(gradeParam.bonus);
    const income = toNumber(rules.salaryBase) + monthlyCommission + bonus;

    let warning = "正常";
    if (sellThroughRate < 0.1) {
      warning = "低动销/建议撤换";
    } else if (paymentFactor === 0) {
      warning = "未结算不计提";
    } else if (String(channel.mode).includes("寄售") && depositCoverage < 0.3) {
      warning = "保证金覆盖低";
    }

    const pricing = {
      suggestedRetail,
      retail,
      effectiveGrade,
      activeSettlementRatio: round(activeSettlementRatio, 4),
      deduction: round(deduction, 4),
      settlement: round(settlement, 2),
      grossMargin: round(grossMargin, 2),
      costShare,
      grossMarginRate,
      managementReserve: round(managementReserve, 2),
      distributableMargin: round(distributableMargin, 2),
      judgement: buildJudgement({ retail, cost, settlement, distributable: distributableMargin, costShare })
    };

    const commission = {
      mode: channel.mode,
      monthlySales,
      stockQty,
      soldQty,
      sellThroughRate,
      sellThrough,
      dataQualityFactor,
      paymentFactor,
      depositCoverage,
      depositFactor,
      commissionRate,
      perUnitCommission: round(perUnitCommission, 4),
      monthlyCommission: round(monthlyCommission, 2),
      bonus,
      salaryBase: toNumber(rules.salaryBase),
      income: round(income, 2),
      warning
    };

    return {
      inputs,
      cost,
      scenario,
      pricing,
      consignment,
      purchase,
      commission,
      productClass,
      productType,
      helpers: { pct }
    };
  }

  const api = {
    calculate,
    calculateCost,
    calculateScenario,
    clone,
    componentLabels,
    gradeOrder,
    pct,
    round
  };

  root.XJCore = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
