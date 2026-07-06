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

  const gradeOrder = ["S", "A", "B", "C", "D"];
  const stageOrder = ["T0", "T1", "T2"];
  const defaultStageWeights = { T0: 50, T1: 45, T2: 5 };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, toNumber(value)));
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
    const target = String(selected ?? "");
    const option = group.options.find((item) => {
      if (String(item.label) === target) return true;
      return Array.isArray(item.aliases) && item.aliases.some((alias) => String(alias) === target);
    });
    return option ? toNumber(option.score) : 0;
  }

  function scoreFromThresholds(thresholds, value) {
    const target = toNumber(value);
    const sorted = [...thresholds].sort((a, b) => b.min - a.min);
    return sorted.find((item) => target >= toNumber(item.min)) || sorted[sorted.length - 1];
  }

  function groupMax(group, fallback = 0) {
    const declared = Number(group && group.max);
    if (Number.isFinite(declared) && declared > 0) return declared;
    const optionScores = Array.isArray(group && group.options) ? group.options.map((item) => toNumber(item.score)) : [];
    const thresholdScores = Array.isArray(group && group.thresholds) ? group.thresholds.map((item) => toNumber(item.score)) : [];
    const freeScore = group && group.freeScore !== undefined ? [toNumber(group.freeScore)] : [];
    const scores = [...optionScores, ...thresholdScores, ...freeScore].filter((score) => score > 0);
    return scores.length ? Math.max(...scores) : fallback;
  }

  function boundedScore(score, max) {
    const value = Math.max(0, toNumber(score));
    return max > 0 ? Math.min(value, max) : value;
  }

  function normalizedStageWeights(scoring) {
    const configured = (scoring && scoring.stageWeights) || {};
    const raw = {};
    stageOrder.forEach((stage) => {
      const value = Number(configured[stage]);
      raw[stage] = Number.isFinite(value) && value >= 0 ? value : defaultStageWeights[stage];
    });
    const total = stageOrder.reduce((sum, stage) => sum + raw[stage], 0);
    if (!total) return { ...defaultStageWeights };
    return stageOrder.reduce((weights, stage) => {
      weights[stage] = raw[stage] / total * 100;
      return weights;
    }, {});
  }

  function weightedStageScore(rawScore, rawMax, weight) {
    if (rawMax <= 0 || weight <= 0) return 0;
    return clamp(rawScore / rawMax, 0, 1) * weight;
  }

  function stageScoreBandThresholds(scoring, stage) {
    const weights = normalizedStageWeights(scoring);
    const weight = weights[stage] || defaultStageWeights[stage] || 0;
    if (stage === "T2") return [weight * 0.6, weight * 0.4, weight * 0.3];
    if (stage === "T1") return [weight * 0.85, weight * 0.68, weight * 0.5];
    return [weight * 0.85, weight * 0.7, weight * 0.55];
  }

  function getGradeOrder(rules) {
    const params = (rules && rules.gradeParams) || {};
    const keys = Object.keys(params);
    if (!keys.length) return [...gradeOrder];
    const defaultIndex = new Map(gradeOrder.map((grade, index) => [grade, index]));
    return keys.sort((left, right) => {
      const thresholdDiff = toNumber(params[right] && params[right].threshold) - toNumber(params[left] && params[left].threshold);
      if (thresholdDiff) return thresholdDiff;
      const leftIndex = defaultIndex.has(left) ? defaultIndex.get(left) : 999;
      const rightIndex = defaultIndex.has(right) ? defaultIndex.get(right) : 999;
      return leftIndex - rightIndex || String(left).localeCompare(String(right), "zh-CN");
    });
  }

  function fallbackGradeParam(rules, grade) {
    const params = (rules && rules.gradeParams) || {};
    const ordered = getGradeOrder(rules);
    return params[grade] || params.D || params.C || params[ordered[ordered.length - 1]] || params[ordered[0]] || {};
  }

  function gradeByScore(rules, score) {
    const params = rules.gradeParams || {};
    const ordered = getGradeOrder(rules);
    const matched = ordered.find((grade) => score >= toNumber(params[grade] && params[grade].threshold));
    return matched || ordered[ordered.length - 1] || "D";
  }

  function capGrade(rules, grade, maxGrade) {
    const ordered = getGradeOrder(rules);
    const currentIndex = ordered.indexOf(grade);
    const capIndex = ordered.indexOf(maxGrade);
    if (currentIndex < 0 || capIndex < 0) return grade;
    return currentIndex < capIndex ? maxGrade : grade;
  }

  function productText(product) {
    return [
      product && product.name,
      product && product.spec,
      product && product.bodyType,
      product && product.productClass,
      product && product.productType,
      product && product.packageType,
      product && product.note,
      product && product.structure
    ].filter(Boolean).join(" ");
  }

  function normalizeCostPriceBands(bands) {
    if (!Array.isArray(bands)) return [];
    return bands.map((band) => ({
      maxCost: toNumber(band.maxCost),
      retail: toNumber(band.retail),
      label: String(band.label || band.retail || "").trim()
    })).filter((band) => band.maxCost > 0 && band.retail > 0);
  }

  function normalizeScenarioPriceBands(bands) {
    if (!Array.isArray(bands)) return [];
    return bands.map((band) => ({
      minScore: toNumber(band.minScore),
      retail: toNumber(band.retail),
      label: String(band.label || band.retail || "").trim()
    })).filter((band) => band.retail > 0);
  }

  function fallbackCostPriceBands(rules) {
    const normalized = normalizeCostPriceBands(rules && rules.costPriceBands);
    return normalized.length ? normalized : [
      { maxCost: 15, retail: 58, label: "58" },
      { maxCost: 20, retail: 68, label: "68" },
      { maxCost: 28, retail: 79, label: "79" },
      { maxCost: 35, retail: 89, label: "89" }
    ];
  }

  function fallbackScenarioPriceBands(rules) {
    const normalized = normalizeScenarioPriceBands(rules && rules.scenarioPriceBands);
    return normalized.length ? normalized : [
      { minScore: 88, retail: 89, label: "S级城市样板/官方联名" },
      { minScore: 76, retail: 79, label: "A级重点合作/店中店" },
      { minScore: 64, retail: 68, label: "B级市场试点/小批量测试" },
      { minScore: 50, retail: 58, label: "C级轻模式试点" },
      { minScore: 0, retail: 49, label: "D级暂不推进" }
    ];
  }

  function productProfile(product) {
    const text = productText(product);
    const components = (product && product.components) || {};
    const isSmall = text.includes("小瓦");
    const isCraft = text.includes("工艺") || toNumber(components.craft) >= 8;
    const isPremium = text.includes("礼盒") || text.includes("礼品") || text.includes("定制") || text.includes("授权") || text.includes("高工艺") || text.includes("罗甸") || toNumber(components.craft) >= 18 || toNumber(components.package) >= 8 || toNumber(components.customAuth) >= 4;
    if (isSmall) return "small";
    if (isPremium) return "premium";
    if (isCraft) return "craft";
    return "standard";
  }

  function defaultCostPriceBandsForProduct(rules, product) {
    const profile = productProfile(product);
    if (profile === "small") {
      return [
        { maxCost: 10, retail: 39, label: "小瓦39" },
        { maxCost: 15, retail: 49, label: "小瓦49" },
        { maxCost: 20, retail: 58, label: "小瓦58" },
        { maxCost: 28, retail: 68, label: "小瓦68" }
      ];
    }
    if (profile === "premium") {
      return [
        { maxCost: 28, retail: 89, label: "礼盒/高工艺89" },
        { maxCost: 38, retail: 109, label: "礼盒/高工艺109" },
        { maxCost: 50, retail: 129, label: "礼盒/高工艺129" },
        { maxCost: 65, retail: 159, label: "礼盒/高工艺159" }
      ];
    }
    if (profile === "craft") {
      return [
        { maxCost: 20, retail: 68, label: "工艺68" },
        { maxCost: 28, retail: 79, label: "工艺79" },
        { maxCost: 36, retail: 89, label: "工艺89" },
        { maxCost: 48, retail: 109, label: "工艺109" }
      ];
    }
    return fallbackCostPriceBands(rules);
  }

  function defaultScenarioPriceBandsForProduct(rules, product) {
    const profile = productProfile(product);
    if (profile === "small") {
      return [
        { minScore: 88, retail: 68, label: "S级小瓦强场景" },
        { minScore: 76, retail: 58, label: "A级小瓦重点场景" },
        { minScore: 64, retail: 49, label: "B级小瓦试点场景" },
        { minScore: 50, retail: 39, label: "C级小瓦轻试点" },
        { minScore: 0, retail: 39, label: "D级暂不推进" }
      ];
    }
    if (profile === "premium") {
      return [
        { minScore: 88, retail: 159, label: "S级礼盒/高工艺样板" },
        { minScore: 76, retail: 149, label: "A级礼盒/高工艺重点" },
        { minScore: 64, retail: 129, label: "B级礼盒/高工艺试点" },
        { minScore: 50, retail: 109, label: "C级礼盒/高工艺轻试" },
        { minScore: 0, retail: 98, label: "D级暂不推进" }
      ];
    }
    if (profile === "craft") {
      return [
        { minScore: 88, retail: 109, label: "S级工艺款样板" },
        { minScore: 76, retail: 98, label: "A级工艺款重点" },
        { minScore: 64, retail: 89, label: "B级工艺款试点" },
        { minScore: 50, retail: 79, label: "C级工艺款轻试" },
        { minScore: 0, retail: 68, label: "D级暂不推进" }
      ];
    }
    return fallbackScenarioPriceBands(rules);
  }

  function productCostPriceBands(rules, product) {
    const ownBands = normalizeCostPriceBands(product && product.costPriceBands);
    return ownBands.length ? ownBands : defaultCostPriceBandsForProduct(rules, product);
  }

  function productScenarioPriceBands(rules, product) {
    const ownBands = normalizeScenarioPriceBands(product && product.scenarioPriceBands);
    return ownBands.length ? ownBands : defaultScenarioPriceBandsForProduct(rules, product);
  }

  function retailByCost(rules, totalCost, product) {
    const sorted = productCostPriceBands(rules, product).sort((a, b) => a.maxCost - b.maxCost);
    const matched = sorted.find((band) => totalCost <= toNumber(band.maxCost));
    if (matched) return matched.retail;
    const raw = totalCost / toNumber(rules.highPriceCostShare, 0.35);
    return Math.ceil(raw / toNumber(rules.priceRound, 10)) * toNumber(rules.priceRound, 10) - toNumber(rules.priceMinus, 1);
  }

  function retailByScenario(rules, score, product) {
    const sorted = productScenarioPriceBands(rules, product).sort((a, b) => b.minScore - a.minScore);
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

    const costPriceBands = productCostPriceBands(data.rules, product);
    const minRetail = retailByCost(data.rules, totalCost, product);
    return {
      product,
      componentLabels,
      components,
      totalCost: round(totalCost, 2),
      minRetail,
      costPriceBands,
      costShareAtMinRetail: minRetail ? totalCost / minRetail : 0,
      priceBandLabel: minRetail <= 89 ? String(minRetail) : "高于89"
    };
  }

  function calculateScenario(data, inputs) {
    const rules = data.rules;
    const product = findProduct(data, inputs.productId);
    const scenario = { ...data.defaultInputs.scenario, ...(inputs.scenario || {}) };
    const scoring = rules.scoring;
    const breakdown = [];

    function addOption(stage, key) {
      const group = scoring[key];
      const max = groupMax(group, 0);
      const score = boundedScore(scoreFromOptions(group, scenario[key]), max);
      breakdown.push({
        stage,
        key,
        label: group.label,
        value: scenario[key],
        rawScore: score,
        rawMax: max
      });
      return score;
    }

    const t0Keys = ["scenicType", "tileRelevance", "commemorationMind", "youngSpread", "culturalEndorsement"];
    const t1OptionKeys = ["location", "store", "display", "businessTerms", "cooperationEfficiency"];
    const t2Keys = ["officialCooperation", "coBrandAuth", "marketingResources", "decorationResources", "manpowerResources", "officialTrafficResources"];

    const t0RawScore = t0Keys.reduce((sum, key) => sum + addOption("T0", key), 0);
    const t0RawMax = t0Keys.reduce((sum, key) => sum + groupMax(scoring[key], 0), 0);
    const visitorBand = scoreFromThresholds(scoring.visitors.thresholds, scenario.annualVisitors);
    const visitorMax = groupMax(scoring.visitors, 10);
    const visitorScore = boundedScore(visitorBand.score, visitorMax);
    breakdown.push({
      stage: "T1",
      key: "visitors",
      label: scoring.visitors.label,
      value: `${toNumber(scenario.annualVisitors)}${scoring.visitors.unit}`,
      rawScore: visitorScore,
      rawMax: visitorMax,
      band: visitorBand.label
    });
    const ticketGroup = scoring.ticket;
    const ticketBand = scenario.ticketMode === "收费"
      ? scoreFromThresholds(ticketGroup.thresholds, scenario.ticketPrice)
      : { score: ticketGroup.freeScore, label: "免费开放" };
    const ticketMax = groupMax(ticketGroup, 4);
    const ticketScore = boundedScore(ticketBand.score, ticketMax);
    breakdown.push({
      stage: "T1",
      key: "ticket",
      label: ticketGroup.label,
      value: scenario.ticketMode === "收费" ? `${toNumber(scenario.ticketPrice)}元` : "免费开放",
      rawScore: ticketScore,
      rawMax: ticketMax,
      band: ticketBand.label
    });
    const t1RawScore = visitorScore + ticketScore + t1OptionKeys.reduce((sum, key) => sum + addOption("T1", key), 0);
    const t1RawMax = visitorMax + ticketMax + t1OptionKeys.reduce((sum, key) => sum + groupMax(scoring[key], 0), 0);
    const t2RawScore = t2Keys.reduce((sum, key) => sum + addOption("T2", key), 0);
    const t2RawMax = t2Keys.reduce((sum, key) => sum + groupMax(scoring[key], 0), 0);

    const stageWeights = normalizedStageWeights(scoring);
    const t0Score = weightedStageScore(t0RawScore, t0RawMax, stageWeights.T0);
    const t1Score = weightedStageScore(t1RawScore, t1RawMax, stageWeights.T1);
    const t2Score = weightedStageScore(t2RawScore, t2RawMax, stageWeights.T2);
    const stageRawMax = { T0: t0RawMax, T1: t1RawMax, T2: t2RawMax };
    breakdown.forEach((item) => {
      const stageMax = stageRawMax[item.stage] || 0;
      const stageWeight = stageWeights[item.stage] || 0;
      item.score = round(weightedStageScore(item.rawScore, stageMax, stageWeight), 1);
      item.max = round(weightedStageScore(item.rawMax, stageMax, stageWeight), 1);
      item.rawScore = round(item.rawScore, 1);
      item.rawMax = round(item.rawMax, 1);
    });

    const rawScore = t0Score + t1Score + t2Score;
    const vetoItems = (scoring.vetoRules || []).filter((item) => Boolean(scenario[item.key]));
    const hasVeto = vetoItems.length > 0;
    const score = hasVeto ? Math.min(49, rawScore) : Math.min(100, rawScore);
    const rawGrade = hasVeto ? "D" : gradeByScore(rules, score);
    const gradeCapReasons = [];
    let grade = rawGrade;
    const [t0SampleLine, t0LightLine, t0BaseLine] = stageScoreBandThresholds(scoring, "T0");
    const [t1SampleLine, t1LightLine, t1BaseLine] = stageScoreBandThresholds(scoring, "T1");
    const [t2SampleLine, t2ResourceLine, t2MediumLine] = stageScoreBandThresholds(scoring, "T2");
    if (!hasVeto) {
      if (t0Score < t0BaseLine || t1Score < t1BaseLine) {
        grade = capGrade(rules, grade, "D");
        gradeCapReasons.push("T0/T1未过基础线");
      } else {
        if (t0Score < t0LightLine || t1Score < t1LightLine) {
          grade = capGrade(rules, grade, "C");
          gradeCapReasons.push("T0/T1仅适合轻试");
        } else if (t0Score < t0SampleLine || t1Score < t1SampleLine) {
          grade = capGrade(rules, grade, "B");
          gradeCapReasons.push("T0/T1未达样板强度");
        }
        if (t2Score < t2ResourceLine) {
          grade = capGrade(rules, grade, "B");
          gradeCapReasons.push("T2官方/资源支持弱");
        } else if (t2Score < t2SampleLine) {
          grade = capGrade(rules, grade, "A");
          gradeCapReasons.push("T2暂不足以做S级样板");
        }
      }
    }
    const gradeParam = fallbackGradeParam(rules, grade);
    const scenarioPriceBands = productScenarioPriceBands(rules, product);
    const priceBand = retailByScenario(rules, score, product);
    const needAuth = grade === "S" || grade === "A" || scenario.coBrandAuth !== "可签官方授权联名并使用名称/LOGO/地标" ? "是/建议优先明确" : "否";
    let funnelAction = "进入商务测算";
    if (t0Score < t0BaseLine) {
      funnelAction = "文化适配不足，暂不推进";
    } else if (t0Score < t0LightLine) {
      funnelAction = "只做低投入轻合作或内容测试";
    } else if (t0Score < t0SampleLine) {
      funnelAction = "进入观察/备选名单";
    } else if (t1Score < t1BaseLine) {
      funnelAction = "商业转化弱，不建议进场";
    } else if (t1Score < t1LightLine) {
      funnelAction = "仅适合寄售/快闪测试";
    } else if (t1Score < t1SampleLine) {
      funnelAction = "可谈，但控制首批投入和陈列面积";
    } else if (t2Score < t2MediumLine) {
      funnelAction = "可做早期优惠试点，不做样板投入";
    } else if (t2Score < t2SampleLine) {
      funnelAction = "做寄售/小批量采购/店中店";
    } else {
      funnelAction = "可进入重点商务谈判";
    }

    const riskItems = [];
    if (hasVeto) riskItems.push(`一票否决：${vetoItems.map((item) => item.label).join("；")}`);
    if (gradeCapReasons.length && grade !== rawGrade) riskItems.push(`评级封顶：${gradeCapReasons.join("；")}`);
    if (t0Score < t0LightLine) riskItems.push("文化与客群适配偏弱");
    if (t1Score < t1LightLine) riskItems.push("客流/动线/店型转化条件不足");
    if (t2Score < t2ResourceLine) riskItems.push("官方合作、授权联名或官方资源偏弱");
    if (scenario.display === "边角陈列" || scenario.display === "无明确陈列") riskItems.push("陈列弱，需控制铺货");
    if (scenario.coBrandAuth === "不允许使用名称/地标元素") riskItems.push("授权风险");
    const risk = riskItems.length ? riskItems.join("；") : "正常跟进";

    return {
      scenario,
      breakdown,
      rawScore,
      score,
      rawGrade,
      grade,
      gradeCapReasons,
      gradeParam,
      t0Score: round(t0Score, 1),
      t1Score: round(t1Score, 1),
      t2Score: round(t2Score, 1),
      stageWeights: stageOrder.reduce((weights, stage) => {
        weights[stage] = round(stageWeights[stage], 4);
        return weights;
      }, {}),
      stageRawScores: {
        T0: round(t0RawScore, 1),
        T1: round(t1RawScore, 1),
        T2: round(t2RawScore, 1)
      },
      stageRawMax: {
        T0: round(t0RawMax, 1),
        T1: round(t1RawMax, 1),
        T2: round(t2RawMax, 1)
      },
      vetoItems,
      hasVeto,
      funnelAction,
      recommendedRetail: priceBand.retail,
      priceBandLabel: priceBand.label,
      scenarioPriceBands,
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
    const gradeParam = fallbackGradeParam(rules, grade);
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

  function matchPurchaseCommissionTier(rules, amount) {
    const receipt = toNumber(amount);
    const tiers = Array.isArray(rules.purchaseCommissionTiers) ? rules.purchaseCommissionTiers : [];
    const sorted = [...tiers].sort((a, b) => toNumber(a.minAmount) - toNumber(b.minAmount));
    return sorted.find((tier) => receipt >= toNumber(tier.minAmount) && receipt <= toNumber(tier.maxAmount, 999999999)) || sorted[sorted.length - 1] || null;
  }

  function expansionBonusForGrade(rules, grade) {
    const bonuses = rules.expansionBonuses || {};
    if (bonuses[grade] !== undefined) return toNumber(bonuses[grade]);
    const legacy = fallbackGradeParam(rules, grade);
    return toNumber(legacy.bonus);
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

  function normalizeDeduction(value) {
    if (value === "" || value === null || value === undefined) return null;
    const raw = toNumber(value);
    const ratio = raw > 1 ? raw / 100 : raw;
    return clamp(ratio, 0, 0.85);
  }

  function commissionAmount(distributableMargin, commissionRate, sellThrough, depositFactor, paymentFactor, dataQualityFactor) {
    return distributableMargin * commissionRate * toNumber(sellThrough.factor) * depositFactor * paymentFactor * dataQualityFactor;
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
    const gradeParam = fallbackGradeParam(rules, effectiveGrade);
    const effectiveGradeParam = clone(gradeParam);
    const suggestedRetail = Math.max(cost.minRetail, scenario.recommendedRetail);
    const retail = toNumber(channel.retailOverride) > 0 ? toNumber(channel.retailOverride) : suggestedRetail;
    const stockQty = toNumber(channel.stockQty);
    const soldQty = toNumber(channel.soldQty);
    const monthlySales = channel.monthlySales === "" || channel.monthlySales === null || channel.monthlySales === undefined
      ? retail * soldQty
      : toNumber(channel.monthlySales);
    const baselineConsignment = calculateConsignment(rules, effectiveGrade, monthlySales, retail);
    const baselineSettlementRatio = String(channel.mode).includes("寄售") ? baselineConsignment.finalRatio : toNumber(gradeParam.baseSettlementRatio);
    const baselineDeduction = 1 - baselineSettlementRatio;
    const normalizedNegotiatedDeduction = normalizeDeduction(channel.negotiatedDeduction);
    const hasNegotiatedDeduction = normalizedNegotiatedDeduction !== null;
    const activeSettlementRatio = hasNegotiatedDeduction ? 1 - normalizedNegotiatedDeduction : baselineSettlementRatio;
    const consignment = {
      ...baselineConsignment,
      finalRatio: round(activeSettlementRatio, 4),
      capUnitPrice: round(retail * activeSettlementRatio, 2),
      negotiated: hasNegotiatedDeduction
    };
    const deduction = 1 - activeSettlementRatio;
    const settlement = retail * activeSettlementRatio;
    const grossMargin = settlement - cost.totalCost;
    const costShare = retail ? cost.totalCost / retail : 0;
    const grossMarginRate = settlement ? grossMargin / settlement : 0;
    const managementReserve = retail * toNumber(rules.managementReserveRate);
    const fixedFeeMonthly = toNumber(channel.fixedFeeMonthly);
    const fixedFeePerUnit = soldQty ? fixedFeeMonthly / soldQty : 0;
    const distributableMargin = Math.max(0, grossMargin - managementReserve - fixedFeePerUnit);
    const productClass = channel.productClassOverride || cost.product.productClass;
    const productType = channel.productTypeOverride || cost.product.productType;

    const standardPurchaseCap = baselineConsignment.capUnitPrice;
    const purchase = calculatePurchase(rules, {
      productClass,
      productType,
      purchaseQty: channel.purchaseQty,
      totalPurchaseQty: channel.totalPurchaseQty,
      retail,
      consignmentCap: standardPurchaseCap
    });

    const sellThroughRate = stockQty ? soldQty / stockQty : 0;
    const sellThrough = findSellThroughFactor(rules, sellThroughRate);
    const dataQualityFactor = toNumber(rules.dataQualityFactors[channel.dataQuality]);
    const paymentFactor = toNumber(rules.paymentFactors[channel.paymentTerm]);
    const stockValue = retail * stockQty;
    const depositCoverage = stockValue ? toNumber(channel.deposit) / stockValue : 0;
    const depositFactor = depositCoefficient(rules, depositCoverage, channel.deposit);
    const isConsignmentMode = String(channel.mode).includes("寄售");
    const commissionRate = isConsignmentMode
      ? toNumber(rules.consignmentCommissionBaseRate, 0.1)
      : toNumber(rules.commissionRates && rules.commissionRates[channel.mode]);
    const upliftRate = toNumber(rules.consignmentCommissionUpliftRate, 0.3);
    const top3SalesReceipt = channel.top3SalesReceipt === "" || channel.top3SalesReceipt === null || channel.top3SalesReceipt === undefined
      ? monthlySales * 3
      : toNumber(channel.top3SalesReceipt);
    const pointBusinessCost = toNumber(channel.pointBusinessCost);
    const standardReceipt = activeSettlementRatio > 0
      ? top3SalesReceipt * (baselineSettlementRatio / activeSettlementRatio)
      : 0;
    const extraReceipt = isConsignmentMode && activeSettlementRatio > baselineSettlementRatio
      ? Math.max(0, top3SalesReceipt - standardReceipt)
      : 0;
    const consignmentBaseCommission = Math.max(0, top3SalesReceipt - pointBusinessCost) * commissionRate;
    const consignmentUpliftCommission = extraReceipt * upliftRate;
    const purchaseReceiptAmount = channel.purchaseReceiptAmount === "" || channel.purchaseReceiptAmount === null || channel.purchaseReceiptAmount === undefined
      ? purchase.finalTotal
      : toNumber(channel.purchaseReceiptAmount);
    const purchaseCommissionTier = matchPurchaseCommissionTier(rules, purchaseReceiptAmount);
    const purchaseCommissionRate = purchaseCommissionTier ? toNumber(purchaseCommissionTier.rate) : 0;
    const customerType = channel.customerType || "新客户";
    const customerFactor = customerType === "老客户" ? toNumber(rules.repeatCustomerFactor, 0.5) : 1;
    const purchaseCommission = purchaseReceiptAmount * purchaseCommissionRate * customerFactor;
    const perUnitCommission = soldQty && isConsignmentMode ? (consignmentBaseCommission + consignmentUpliftCommission) / soldQty : 0;
    const monthlyCommission = isConsignmentMode ? consignmentBaseCommission + consignmentUpliftCommission : purchaseCommission;
    const commissionReceiptBase = isConsignmentMode ? top3SalesReceipt : purchaseReceiptAmount;
    const commissionShareOfReceipt = commissionReceiptBase > 0 ? monthlyCommission / commissionReceiptBase : 0;
    const bonus = expansionBonusForGrade(rules, effectiveGrade);
    const income = toNumber(rules.salaryBase) + monthlyCommission + bonus;
    const baselineSettlement = retail * baselineSettlementRatio;
    const baselineGrossMargin = baselineSettlement - cost.totalCost;
    const baselineDistributableMargin = Math.max(0, baselineGrossMargin - managementReserve);
    const baselineTop3BaseCommission = Math.max(0, standardReceipt - pointBusinessCost) * commissionRate;
    const baselinePerUnitCommission = soldQty && isConsignmentMode ? baselineTop3BaseCommission / soldQty : 0;
    const baselineMonthlyCommission = isConsignmentMode ? baselineTop3BaseCommission : purchaseCommission;

    let warning = "正常";
    if (sellThroughRate < 0.1) {
      warning = "低动销/建议撤换";
    } else if (paymentFactor === 0) {
      warning = "未结算不计提";
    } else if (isConsignmentMode && depositCoverage < 0.3) {
      warning = "保证金覆盖低";
    }

    const pricing = {
      suggestedRetail,
      retail,
      effectiveGrade,
      gradeParam: effectiveGradeParam,
      activeSettlementRatio: round(activeSettlementRatio, 4),
      deduction: round(deduction, 4),
      settlement: round(settlement, 2),
      grossMargin: round(grossMargin, 2),
      costShare,
      grossMarginRate,
      managementReserve: round(managementReserve, 2),
      fixedFeeMonthly: round(fixedFeeMonthly, 2),
      fixedFeePerUnit: round(fixedFeePerUnit, 2),
      distributableMargin: round(distributableMargin, 2),
      judgement: buildJudgement({ retail, cost, settlement, distributable: distributableMargin, costShare })
    };

    const business = {
      effectiveGrade,
      gradeParam: clone(gradeParam),
      policyType: channel.policyType || "标准商务条件",
      ruleDeduction: round(toNumber(gradeParam.deduction), 4),
      ruleBaseSettlementRatio: round(toNumber(gradeParam.baseSettlementRatio), 4),
      ruleMinSettlementRatio: round(toNumber(gradeParam.minSettlementRatio), 4),
      ruleStockLimit: toNumber(gradeParam.stockLimit),
      baselineSettlementRatio: round(baselineSettlementRatio, 4),
      baselineDeduction: round(baselineDeduction, 4),
      negotiatedDeduction: round(deduction, 4),
      hasNegotiatedDeduction,
      baselineSettlement: round(baselineSettlement, 2),
      baselineGrossMargin: round(baselineGrossMargin, 2),
      baselineDistributableMargin: round(baselineDistributableMargin, 2),
      baselinePerUnitCommission: round(baselinePerUnitCommission, 4),
      baselineMonthlyCommission: round(baselineMonthlyCommission, 2),
      deltaSettlementRatio: round(activeSettlementRatio - baselineSettlementRatio, 4),
      deltaDistributableMargin: round(distributableMargin - baselineDistributableMargin, 2),
      deltaPerUnitCommission: round(perUnitCommission - baselinePerUnitCommission, 4),
      deltaMonthlyCommission: round(monthlyCommission - baselineMonthlyCommission, 2),
      fixedFeeMonthly: round(fixedFeeMonthly, 2),
      fixedFeePerUnit: round(fixedFeePerUnit, 2)
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
      upliftRate,
      commissionReceiptBase: round(commissionReceiptBase, 2),
      commissionShareOfReceipt: round(commissionShareOfReceipt, 4),
      perUnitCommission: round(perUnitCommission, 4),
      monthlyCommission: round(monthlyCommission, 2),
      totalCommission: round(monthlyCommission, 2),
      top3SalesReceipt: round(top3SalesReceipt, 2),
      pointBusinessCost: round(pointBusinessCost, 2),
      standardReceipt: round(standardReceipt, 2),
      extraReceipt: round(extraReceipt, 2),
      consignmentBaseCommission: round(consignmentBaseCommission, 2),
      consignmentUpliftCommission: round(consignmentUpliftCommission, 2),
      purchaseReceiptAmount: round(purchaseReceiptAmount, 2),
      purchaseCommissionTier,
      purchaseCommissionRate,
      purchaseCommission: round(purchaseCommission, 2),
      customerType,
      customerFactor,
      scheme: isConsignmentMode ? "寄售回款提成" : "采购回款提成",
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
      business,
      baselineConsignment,
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
    defaultCostPriceBandsForProduct,
    defaultScenarioPriceBandsForProduct,
    getGradeOrder,
    gradeOrder,
    normalizeCostPriceBands,
    normalizeScenarioPriceBands,
    normalizedStageWeights,
    pct,
    productCostPriceBands,
    productScenarioPriceBands,
    round,
    stageScoreBandThresholds
  };

  root.XJCore = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
