import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const data = require("../assets/default-data.js");
const core = require("../assets/calculator-core.js");

function close(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 0.01, `${message}: expected ${expected}, got ${actual}`);
}

const sGradeHandPaint = core.calculate(data, {
  productId: "P001",
  scenario: data.defaultInputs.scenario,
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
close(sGradeHandPaint.scenario.score, 100, "S级示例综合分");
close(sGradeHandPaint.cost.totalCost, 15, "P001总成本");
assert.equal(sGradeHandPaint.purchase.tier.name, "批量二档");
close(sGradeHandPaint.purchase.tierUnitPrice, 31.96, "P001阶梯采购单价");
close(sGradeHandPaint.consignment.capUnitPrice, 36.04, "P001寄售结算价上限");
assert.equal(sGradeHandPaint.purchase.status, "通过");

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

const weakScenario = core.calculate(data, {
  productId: "P001",
  scenario: {
    scenicLevel: "无/其他",
    annualVisitors: 20,
    ticketMode: "免费",
    ticketPrice: 0,
    culture: "其他",
    location: "景区外/弱动线",
    store: "临时摊位",
    display: "边角陈列",
    policy: "高扣点/额外费用",
    auth: "无授权"
  },
  channel: {
    ...data.defaultInputs.channel,
    gradeOverride: "",
    retailOverride: 0
  }
});

assert.equal(weakScenario.scenario.grade, "C");
assert.equal(weakScenario.scenario.risk, "陈列弱，需控制铺货");
close(weakScenario.pricing.suggestedRetail, 58, "弱场景建议价");

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

console.log("calculation checks passed");
