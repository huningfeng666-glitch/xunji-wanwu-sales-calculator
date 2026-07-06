import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const data = require("../assets/default-data.js");
const core = require("../assets/calculator-core.js");

function close(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 0.01, `${message}: expected ${expected}, got ${actual}`);
}

const defaultScenario = core.calculate(data, {
  productId: "P001",
  scenario: data.defaultInputs.scenario,
  channel: data.defaultInputs.channel
});

assert.deepEqual(data.rules.ui.ruleOrder, ["price", "grade", "scoring", "purchase", "commission", "sellThrough"]);
assert.ok(data.rules.consignmentIncentives.length >= 1, "一级域06保留寄售动销激励");
assert.ok(data.rules.sellThroughFactors.length >= 1, "一级域06保留动销评级");
assert.equal(defaultScenario.scenario.grade, "A");
assert.equal(defaultScenario.scenario.rawGrade, "A");
assert.equal(defaultScenario.scenario.risk, "正常跟进");
close(defaultScenario.scenario.score, 86.64, "默认普陀山样例综合分");
close(defaultScenario.scenario.t0Score, 44.5, "默认T0折算分");
close(defaultScenario.scenario.t1Score, 38.8, "默认T1折算分");
close(defaultScenario.scenario.t2Score, 3.4, "默认T2分");
assert.deepEqual(defaultScenario.scenario.stageWeights, { T0: 50, T1: 45, T2: 5 });
assert.deepEqual(defaultScenario.scenario.stageRawMax, { T0: 50, T1: 70, T2: 60 });
const tenPointScoreKeys = [
  "scenicType", "tileRelevance", "commemorationMind", "youngSpread", "culturalEndorsement",
  "visitors", "ticket", "location", "store", "display", "businessTerms", "cooperationEfficiency",
  "officialCooperation", "coBrandAuth", "marketingResources", "decorationResources", "manpowerResources", "officialTrafficResources"
];
tenPointScoreKeys.forEach((key) => {
  const group = data.rules.scoring[key];
  const values = [];
  if (Array.isArray(group.options)) values.push(...group.options.map((item) => item.score));
  if (Array.isArray(group.thresholds)) values.push(...group.thresholds.map((item) => item.score));
  if (group.freeScore !== undefined) values.push(group.freeScore);
  assert.equal(group.max, 10, `${key} 小模块满分为10`);
  close(Math.max(...values), 10, `${key} 小模块最高项为10分`);
});
assert.equal(defaultScenario.business.effectiveGrade, "A");
assert.equal(defaultScenario.business.gradeParam.mode, data.rules.gradeParams.A.mode);
close(defaultScenario.business.ruleDeduction, data.rules.gradeParams.A.deduction, "商务条件使用A级规则扣点");
close(defaultScenario.business.ruleBaseSettlementRatio, data.rules.gradeParams.A.baseSettlementRatio, "商务条件使用A级基准结算比例");
close(defaultScenario.business.ruleMinSettlementRatio, data.rules.gradeParams.A.minSettlementRatio, "商务条件使用A级最低结算比例");

const customBusinessRulesData = core.clone(data);
customBusinessRulesData.rules.gradeParams.A.deduction = 0.31;
customBusinessRulesData.rules.gradeParams.A.baseSettlementRatio = 0.69;
customBusinessRulesData.rules.gradeParams.A.minSettlementRatio = 0.64;
customBusinessRulesData.rules.gradeParams.A.stockLimit = 1234;
customBusinessRulesData.rules.gradeParams.A.mode = "测试规则合作模式";
const customBusinessRules = core.calculate(customBusinessRulesData, {
  productId: "P001",
  scenario: data.defaultInputs.scenario,
  channel: data.defaultInputs.channel
});

close(customBusinessRules.business.ruleDeduction, 0.31, "商务条件读取规则参数扣点");
close(customBusinessRules.business.ruleBaseSettlementRatio, 0.69, "商务条件读取规则参数基准结算比例");
close(customBusinessRules.business.ruleMinSettlementRatio, 0.64, "商务条件读取规则参数最低结算比例");
assert.equal(customBusinessRules.business.ruleStockLimit, 1234);
assert.equal(customBusinessRules.business.gradeParam.mode, "测试规则合作模式");

const fullOfficialScenario = {
  ...data.defaultInputs.scenario,
  youngSpread: "强：外地游客+年轻审美客群多",
  location: "主入口/出口必经点",
  display: "C位专区",
  businessTerms: "优：采购/保证金覆盖/短账期/无进场费",
  cooperationEfficiency: "高：决策链短/配合强",
  officialCooperation: "官方直签/官方体系内合作",
  marketingResources: "高：官号/活动/导览/游客中心可露出",
  decorationResources: "高：装补/展柜/灯光/墙面资源明确",
  manpowerResources: "高：导购/讲解/活动执行/销售数据可配合",
  officialTrafficResources: "高：官网/小程序/联票/导览可导流"
};

const sGradeHandPaint = core.calculate(data, {
  productId: "P001",
  scenario: fullOfficialScenario,
  channel: {
    ...data.defaultInputs.channel,
    gradeOverride: "S",
    retailOverride: 68,
    purchaseQty: 50,
    totalPurchaseQty: 50,
    monthlySales: 20000
  }
});

assert.equal(sGradeHandPaint.scenario.grade, "S");
assert.equal(sGradeHandPaint.business.effectiveGrade, "S");
assert.equal(sGradeHandPaint.business.gradeParam.mode, data.rules.gradeParams.S.mode);
assert.equal(sGradeHandPaint.business.ruleStockLimit, data.rules.gradeParams.S.stockLimit);
close(sGradeHandPaint.scenario.score, 97.4, "S级示例综合分");
close(sGradeHandPaint.cost.totalCost, 15, "P001总成本");
assert.equal(sGradeHandPaint.purchase.tier.name, "批量二档");
close(sGradeHandPaint.purchase.tierUnitPrice, 31.96, "P001阶梯采购单价");
close(sGradeHandPaint.consignment.capUnitPrice, 36.04, "P001寄售结算价上限");
assert.equal(sGradeHandPaint.purchase.status, "通过");

const allMaxScenario = {
  ...data.defaultInputs.scenario,
  scenicType: "古城/古镇/古村落",
  tileRelevance: "极强：游客一眼能理解卖瓦片",
  commemorationMind: "强：旅行纪念/祈福购买动机明确",
  youngSpread: "强：外地游客+年轻审美客群多",
  culturalEndorsement: "国家级/世界遗产/文保/非遗背书",
  annualVisitors: 9999,
  ticketMode: "收费",
  ticketPrice: 999,
  location: "主入口/出口必经点",
  store: "寻迹万物专店/店中店专区",
  display: "C位专区",
  businessTerms: "优：采购/保证金覆盖/短账期/无进场费",
  cooperationEfficiency: "已落地/已发货，可按周复盘",
  officialCooperation: "官方直签/官方体系内合作",
  coBrandAuth: "可签官方授权联名并使用名称/LOGO/地标",
  marketingResources: "样板传播：官号/活动/UGC内容可放大",
  decorationResources: "高：装补/展柜/灯光/墙面资源明确",
  manpowerResources: "高：导购/讲解/活动执行/销售数据可配合",
  officialTrafficResources: "高：官网/小程序/联票/导览可导流"
};

const maxScenario = core.calculate(data, {
  productId: "P001",
  scenario: allMaxScenario,
  channel: data.defaultInputs.channel
});

close(maxScenario.scenario.score, 100, "T0/T1/T2满配折算为100分");
close(maxScenario.scenario.t0Score, 50, "T0满配50分");
close(maxScenario.scenario.t1Score, 45, "T1满配45分");
close(maxScenario.scenario.t2Score, 5, "T2满配5分");

const adjustedScoreData = core.clone(data);
adjustedScoreData.rules.scoring.scenicType.options.find((item) => item.label === "古城/古镇/古村落").score = 99;
const adjustedScoreMax = core.calculate(adjustedScoreData, {
  productId: "P001",
  scenario: allMaxScenario,
  channel: data.defaultInputs.channel
});

close(adjustedScoreMax.scenario.score, 100, "小项分值调高后总分仍封顶100");

const renamedOptionData = core.clone(data);
const renamedScenicType = renamedOptionData.rules.scoring.scenicType.options.find((item) => item.label === "古城/古镇/古村落");
renamedScenicType.aliases = ["古城/古镇/古村落"];
renamedScenicType.label = "古镇/古村/古城";
const renamedCurrentScenario = core.calculate(renamedOptionData, {
  productId: "P001",
  scenario: {
    ...data.defaultInputs.scenario,
    scenicType: "古镇/古村/古城"
  },
  channel: data.defaultInputs.channel
});
const renamedAliasScenario = core.calculate(renamedOptionData, {
  productId: "P001",
  scenario: {
    ...data.defaultInputs.scenario,
    scenicType: "古城/古镇/古村落"
  },
  channel: data.defaultInputs.channel
});

close(renamedAliasScenario.scenario.t0Score, renamedCurrentScenario.scenario.t0Score, "选项改名后旧值仍通过别名计分");

const adjustedWeightData = core.clone(data);
adjustedWeightData.rules.scoring.stageWeights.T2 = 30;
const adjustedWeightMax = core.calculate(adjustedWeightData, {
  productId: "P001",
  scenario: allMaxScenario,
  channel: data.defaultInputs.channel
});

close(adjustedWeightMax.scenario.score, 100, "大类权重合计非100时仍折算为100");
close(Object.values(adjustedWeightMax.scenario.stageWeights).reduce((sum, value) => sum + value, 0), 100, "有效大类权重合计100");

const earlyMarketTrial = core.calculate(data, {
  productId: "P001",
  scenario: {
    ...data.defaultInputs.scenario,
    businessTerms: "早期拓市场试点：寄卖/免设计/样品支持，复盘周期明确",
    officialCooperation: "景区内门店合作，可争取官方背书",
    coBrandAuth: "可用景区名称/地标元素但不做正式联名",
    marketingResources: "低：主要靠门店和自带内容",
    decorationResources: "低：仅给普通货架",
    manpowerResources: "无：完全自运营",
    officialTrafficResources: "无线上或联票资源"
  },
  channel: data.defaultInputs.channel
});

assert.equal(earlyMarketTrial.scenario.rawGrade, "A");
assert.equal(earlyMarketTrial.scenario.grade, "B");
assert.ok(earlyMarketTrial.scenario.risk.includes("T2官方/资源支持弱"));

const craftNeedsAdjustment = core.calculate(data, {
  productId: "P003",
  scenario: data.defaultInputs.scenario,
  channel: {
    ...data.defaultInputs.channel,
    gradeOverride: "A",
    retailOverride: 88,
    purchaseQty: 20,
    totalPurchaseQty: 20,
    monthlySales: 50000
  }
});

assert.equal(craftNeedsAdjustment.productType, "工艺款");
assert.equal(craftNeedsAdjustment.purchase.tier.name, "基础采购");
close(craftNeedsAdjustment.purchase.tierUnitPrice, 51.04, "P003阶梯采购单价");
close(craftNeedsAdjustment.consignment.capUnitPrice, 46.64, "P003寄售结算价上限");
close(craftNeedsAdjustment.purchase.finalUnitPrice, 46.64, "P003最终采购单价");
assert.equal(craftNeedsAdjustment.purchase.status, "需下调");

const standardConsignmentCommission = core.calculate(data, {
  productId: "P001",
  scenario: data.defaultInputs.scenario,
  channel: {
    ...data.defaultInputs.channel,
    gradeOverride: "A",
    mode: "保证金寄售",
    top3SalesReceipt: 60000,
    pointBusinessCost: 5000,
    negotiatedDeduction: ""
  }
});

close(standardConsignmentCommission.commission.consignmentBaseCommission, 5500, "寄售标准条件基础提成");
close(standardConsignmentCommission.commission.consignmentUpliftCommission, 0, "寄售标准条件无商务提升激励");
close(standardConsignmentCommission.commission.monthlyCommission, 5500, "寄售标准条件提成合计");
close(standardConsignmentCommission.commission.commissionShareOfReceipt, 0.0917, "寄售提成占回款比例");
close(standardConsignmentCommission.commission.bonus, 800, "A级拓展奖金归属提成域");

const betterConsignmentCommission = core.calculate(data, {
  productId: "P001",
  scenario: data.defaultInputs.scenario,
  channel: {
    ...data.defaultInputs.channel,
    gradeOverride: "A",
    mode: "普通寄售",
    top3SalesReceipt: 65000,
    pointBusinessCost: 5000,
    negotiatedDeduction: 35
  }
});

close(betterConsignmentCommission.commission.standardReceipt, 56000, "高于标准商务条件的标准回款折算");
close(betterConsignmentCommission.commission.extraReceipt, 9000, "高于标准商务条件的超额回款");
close(betterConsignmentCommission.commission.consignmentBaseCommission, 6000, "高于标准商务条件基础提成");
close(betterConsignmentCommission.commission.consignmentUpliftCommission, 2700, "高于标准商务条件激励提成");
close(betterConsignmentCommission.commission.monthlyCommission, 8700, "高于标准商务条件提成合计");
close(betterConsignmentCommission.commission.commissionShareOfReceipt, 0.1338, "高于标准商务条件提成占回款比例");

const newPurchaseCommission = core.calculate(data, {
  productId: "P001",
  scenario: data.defaultInputs.scenario,
  channel: {
    ...data.defaultInputs.channel,
    mode: "采购制",
    purchaseReceiptAmount: 50000,
    customerType: "新客户"
  }
});

assert.equal(newPurchaseCommission.commission.purchaseCommissionTier.name, "3万-8万");
close(newPurchaseCommission.commission.purchaseCommissionRate, 0.05, "采购新客户阶梯提点");
close(newPurchaseCommission.commission.purchaseCommission, 2500, "采购新客户提成");
close(newPurchaseCommission.commission.commissionShareOfReceipt, 0.05, "采购新客户提成占回款比例");

const oldPurchaseCommission = core.calculate(data, {
  productId: "P001",
  scenario: data.defaultInputs.scenario,
  channel: {
    ...data.defaultInputs.channel,
    mode: "采购制",
    purchaseReceiptAmount: 50000,
    customerType: "老客户"
  }
});

close(oldPurchaseCommission.commission.customerFactor, 0.5, "采购老客户提成系数");
close(oldPurchaseCommission.commission.purchaseCommission, 1250, "采购老客户提成五折");

const purchaseUsesStandardTerms = core.calculate(data, {
  productId: "P003",
  scenario: data.defaultInputs.scenario,
  channel: {
    ...data.defaultInputs.channel,
    mode: "采购制",
    gradeOverride: "A",
    retailOverride: 88,
    purchaseQty: 20,
    totalPurchaseQty: 20,
    monthlySales: 50000,
    negotiatedDeduction: 10
  }
});

close(purchaseUsesStandardTerms.purchase.finalUnitPrice, 46.64, "采购按标准条件校验，不随实际扣点上浮");

const weakScenario = core.calculate(data, {
  productId: "P001",
  scenario: {
    scenicLevel: "无/其他",
    annualVisitors: 20,
    ticketMode: "免费",
    ticketPrice: 0,
    scenicType: "其他",
    tileRelevance: "无：基本没有自然关联",
    commemorationMind: "无：产品心智错位",
    youngSpread: "弱：老年香客/低价团为主",
    culturalEndorsement: "几乎无文化背书",
    location: "景区外/弱动线",
    store: "临时摊位",
    display: "边角陈列",
    businessTerms: "差：高扣点/保底/进场费",
    cooperationEfficiency: "低：响应慢/多头沟通",
    officialCooperation: "纯门店合作，无官方关系",
    coBrandAuth: "不允许使用名称/地标元素",
    marketingResources: "无营销资源",
    decorationResources: "无装补或物料支持",
    manpowerResources: "无：完全自运营",
    officialTrafficResources: "无线上或联票资源"
  },
  channel: {
    ...data.defaultInputs.channel,
    gradeOverride: "",
    retailOverride: 0
  }
});

assert.equal(weakScenario.scenario.grade, "D");
assert.ok(weakScenario.scenario.risk.includes("授权风险"));
close(weakScenario.pricing.suggestedRetail, 58, "弱场景建议价");

const smallTileProduct = core.calculate(data, {
  productId: "P006",
  scenario: data.defaultInputs.scenario,
  channel: {
    ...data.defaultInputs.channel,
    retailOverride: 0
  }
});

close(smallTileProduct.cost.totalCost, 12.2, "小瓦产品总成本");
close(smallTileProduct.cost.minRetail, 49, "小瓦产品成本价带");
close(smallTileProduct.scenario.recommendedRetail, 58, "小瓦产品场景价带");
close(smallTileProduct.pricing.suggestedRetail, 58, "小瓦产品自动建议价");

const customData = core.clone(data);
customData.products.push({
  id: "P999",
  name: "测试新增产品",
  structure: "1+X+N",
  spec: "大瓦6x8",
  bodyType: "手绘款",
  productClass: "大瓦",
  productType: "手绘款",
  carrier: "冰箱贴",
  packageType: "盒装",
  note: "新增产品校验",
  components: {
    tile: 2,
    uv: 1,
    handPaint: 7,
    craft: 0,
    carrier: 2,
    package: 3,
    customAuth: 1,
    loss: 3,
    logistics: 1
  }
});

const customProduct = core.calculate(customData, {
  productId: "P999",
  scenario: data.defaultInputs.scenario,
  channel: {
    ...data.defaultInputs.channel,
    retailOverride: 68,
    purchaseQty: 30,
    monthlySales: 15000
  }
});

close(customProduct.cost.totalCost, 20, "新增产品总成本");
close(customProduct.cost.minRetail, 68, "新增产品最低价带");
assert.equal(customProduct.purchase.tier.name, "批量一档");

const customBandData = core.clone(data);
customBandData.products.push({
  id: "P998",
  name: "测试产品独立价带",
  structure: "1+X+N",
  spec: "大瓦6x8",
  bodyType: "手绘款",
  productClass: "大瓦",
  productType: "手绘款",
  carrier: "冰箱贴",
  packageType: "盒装",
  note: "验证产品价带覆盖全局模板",
  components: {
    tile: 2,
    uv: 1,
    handPaint: 6,
    craft: 0,
    carrier: 2,
    package: 2,
    customAuth: 1,
    loss: 2,
    logistics: 1
  },
  costPriceBands: [
    { maxCost: 999, retail: 149, label: "产品自定义成本价带" }
  ],
  scenarioPriceBands: [
    { minScore: 0, retail: 159, label: "产品自定义场景价带" }
  ]
});

const customBandProduct = core.calculate(customBandData, {
  productId: "P998",
  scenario: data.defaultInputs.scenario,
  channel: {
    ...data.defaultInputs.channel,
    retailOverride: 0
  }
});

close(customBandProduct.cost.minRetail, 149, "产品自定义成本价带优先");
close(customBandProduct.scenario.recommendedRetail, 159, "产品自定义场景价带优先");
close(customBandProduct.pricing.suggestedRetail, 159, "产品自定义自动建议价");

console.log("calculation checks passed");
