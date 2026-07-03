(function attachDefaultData(root) {
  const data = {
    meta: {
      appName: "寻迹万物销售测算台",
      version: "2026-07-03",
      sourceFiles: [
        "/Users/zhuli001/Desktop/寻迹万物_销售渠道经理机制设置表_V6_整合采购寄售机制.xlsx",
        "/Users/zhuli001/Desktop/寻迹万物_渠道采购与寄售机制测算表_采购价上限校验版.xlsx"
      ],
      note: "V6整合口径：成本、景区评级、定价、采购价上限、寄售计售比、提成测算。"
    },
    products: [
      {
        id: "P001",
        name: "大瓦6x8手绘标准组合",
        structure: "1+X+N",
        spec: "大瓦6x8",
        bodyType: "手绘款",
        productClass: "大瓦",
        productType: "手绘款",
        carrier: "冰箱贴",
        packageType: "挂钩式",
        note: "标准手绘款基准",
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
        }
      },
      {
        id: "P002",
        name: "大瓦6x8手绘盒装组合",
        structure: "1+X+N",
        spec: "大瓦6x8",
        bodyType: "手绘款",
        productClass: "大瓦",
        productType: "手绘款",
        carrier: "无/普通陈列",
        packageType: "盒装",
        note: "盒装适合68元点位",
        components: {
          tile: 1.8,
          uv: 1,
          handPaint: 6,
          craft: 0,
          carrier: 0,
          package: 2.5,
          customAuth: 0.7,
          loss: 3,
          logistics: 0.8
        }
      },
      {
        id: "P003",
        name: "大瓦立体插件工艺款",
        structure: "1+X+N",
        spec: "大瓦6x8",
        bodyType: "立体插件工艺款",
        productClass: "大瓦",
        productType: "工艺款",
        carrier: "冰箱贴背磁",
        packageType: "盒装",
        note: "工艺加价+10",
        components: {
          tile: 1.8,
          uv: 1,
          handPaint: 6,
          craft: 10,
          carrier: 2,
          package: 3,
          customAuth: 0.7,
          loss: 3,
          logistics: 0.8
        }
      },
      {
        id: "P004",
        name: "大瓦滴胶摆台工艺款",
        structure: "1+X+N",
        spec: "大瓦6x8",
        bodyType: "滴胶工艺款",
        productClass: "大瓦",
        productType: "工艺款",
        carrier: "摆台框",
        packageType: "盒装",
        note: "滴胶+摆台，适合79/89",
        components: {
          tile: 1.8,
          uv: 1,
          handPaint: 6,
          craft: 10,
          carrier: 5,
          package: 3.5,
          customAuth: 0.7,
          loss: 3.2,
          logistics: 1
        }
      },
      {
        id: "P005",
        name: "大瓦夜光礼盒工艺款",
        structure: "1+X+N",
        spec: "大瓦6x8",
        bodyType: "夜光工艺款",
        productClass: "大瓦",
        productType: "工艺款",
        carrier: "相框",
        packageType: "礼盒",
        note: "礼赠场景",
        components: {
          tile: 1.8,
          uv: 1,
          handPaint: 6,
          craft: 10,
          carrier: 6,
          package: 8,
          customAuth: 1.5,
          loss: 3.5,
          logistics: 1.2
        }
      },
      {
        id: "P006",
        name: "小瓦手绘挂坠款",
        structure: "1+X+N",
        spec: "小瓦",
        bodyType: "手绘款",
        productClass: "小瓦",
        productType: "手绘款",
        carrier: "挂坠",
        packageType: "挂钩式",
        note: "小瓦成本不按15",
        components: {
          tile: 1.2,
          uv: 0.8,
          handPaint: 5,
          craft: 0,
          carrier: 1.5,
          package: 0.8,
          customAuth: 0.5,
          loss: 2,
          logistics: 0.4
        }
      },
      {
        id: "P007",
        name: "小瓦手绘钥匙扣款",
        structure: "1+X+N",
        spec: "小瓦",
        bodyType: "手绘款",
        productClass: "小瓦",
        productType: "手绘款",
        carrier: "钥匙扣",
        packageType: "盒装",
        note: "钥匙扣类",
        components: {
          tile: 1.2,
          uv: 0.8,
          handPaint: 5,
          craft: 0,
          carrier: 2,
          package: 1.5,
          customAuth: 0.5,
          loss: 2.2,
          logistics: 0.5
        }
      },
      {
        id: "P008",
        name: "大瓦罗甸高工艺款",
        structure: "1+X+N",
        spec: "大瓦6x8",
        bodyType: "罗甸/高工艺款",
        productClass: "大瓦",
        productType: "工艺款",
        carrier: "摆台框",
        packageType: "礼盒",
        note: "高工艺款需单独定价",
        components: {
          tile: 1.8,
          uv: 1,
          handPaint: 6,
          craft: 22,
          carrier: 5,
          package: 8,
          customAuth: 2,
          loss: 4,
          logistics: 1.5
        }
      },
      {
        id: "P009",
        name: "大瓦手绘组合礼盒款",
        structure: "1+N+X组合礼盒",
        spec: "大瓦6x8+载体",
        bodyType: "手绘礼盒款",
        productClass: "大瓦",
        productType: "手绘款",
        carrier: "摆台框+背磁",
        packageType: "礼品盒",
        note: "礼赠组合，不适合58/68",
        components: {
          tile: 1.8,
          uv: 1,
          handPaint: 6,
          craft: 0,
          carrier: 7,
          package: 12,
          customAuth: 2,
          loss: 4,
          logistics: 1.5
        }
      },
      {
        id: "P010",
        name: "大瓦官方授权定制款",
        structure: "1+N+X定制款",
        spec: "大瓦6x8",
        bodyType: "官方授权定制款",
        productClass: "大瓦",
        productType: "工艺款",
        carrier: "相框",
        packageType: "定制礼盒",
        note: "授权/定制成本需明确",
        components: {
          tile: 1.8,
          uv: 1,
          handPaint: 6,
          craft: 10,
          carrier: 6,
          package: 15,
          customAuth: 6,
          loss: 5,
          logistics: 2
        }
      }
    ],
    rules: {
      managementReserveRate: 0.08,
      salaryBase: 10000,
      highPriceCostShare: 0.35,
      priceRound: 10,
      priceMinus: 1,
      priceOptions: [39, 49, 58, 68, 79, 89, 98, 109, 119, 129, 149, 159],
      costPriceBands: [
        { maxCost: 15, retail: 58, label: "58" },
        { maxCost: 20, retail: 68, label: "68" },
        { maxCost: 28, retail: 79, label: "79" },
        { maxCost: 35, retail: 89, label: "89" }
      ],
      scenarioPriceBands: [
        { minScore: 90, retail: 89, label: "顶级强IP" },
        { minScore: 78, retail: 79, label: "高分A级/S级" },
        { minScore: 60, retail: 68, label: "可重点开发" },
        { minScore: 0, retail: 58, label: "测试基础价" }
      ],
      gradeParams: {
        S: {
          threshold: 85,
          deduction: 0.45,
          baseSettlementRatio: 0.55,
          minSettlementRatio: 0.5,
          stockLimit: 20000,
          bonus: 1500,
          mode: "采购/保证金寄售/官方合作优先",
          priceRange: "79/89/礼盒更高",
          approval: "高货值铺货需审批"
        },
        A: {
          threshold: 70,
          deduction: 0.42,
          baseSettlementRatio: 0.58,
          minSettlementRatio: 0.53,
          stockLimit: 10000,
          bonus: 800,
          mode: "保证金寄售或小额寄售",
          priceRange: "68/79/89",
          approval: "超过1万货值审批"
        },
        B: {
          threshold: 55,
          deduction: 0.38,
          baseSettlementRatio: 0.62,
          minSettlementRatio: 0.57,
          stockLimit: 5000,
          bonus: 300,
          mode: "小额寄售/采购优先",
          priceRange: "58/68/79",
          approval: "超过5000审批"
        },
        C: {
          threshold: 0,
          deduction: 0.35,
          baseSettlementRatio: 0.65,
          minSettlementRatio: 0.6,
          stockLimit: 3000,
          bonus: 100,
          mode: "采购或样品级试销",
          priceRange: "58为主，谨慎做68",
          approval: "超过3000审批"
        }
      },
      scoring: {
        scenicLevel: {
          label: "景区评级",
          options: [
            { label: "5A", score: 12 },
            { label: "4A", score: 8 },
            { label: "3A", score: 4 },
            { label: "无/其他", score: 0 }
          ]
        },
        visitors: {
          label: "年客流量",
          unit: "万人",
          thresholds: [
            { min: 1000, score: 18, label: ">=1000万人" },
            { min: 500, score: 15, label: "500-999万人" },
            { min: 200, score: 11, label: "200-499万人" },
            { min: 50, score: 6, label: "50-199万人" },
            { min: 0, score: 2, label: "<50万人" }
          ]
        },
        ticket: {
          label: "门票金额",
          freeScore: 2,
          thresholds: [
            { min: 120, score: 10, label: ">=120元" },
            { min: 80, score: 9, label: "80-119元" },
            { min: 50, score: 7, label: "50-79元" },
            { min: 20, score: 5, label: "20-49元" },
            { min: 0, score: 3, label: "<20元" }
          ]
        },
        culture: {
          label: "文化关联",
          options: [
            { label: "寺庙/宗教/古镇/博物馆强相关", score: 18 },
            { label: "历史街区/世界遗产/文化遗产", score: 16 },
            { label: "遗址/古城/历史街区中相关", score: 14 },
            { label: "商业街区/潮玩街区", score: 7 },
            { label: "自然景区/山水景区", score: 5 },
            { label: "其他", score: 2 }
          ]
        },
        location: {
          label: "动线位置",
          options: [
            { label: "主街核心动线", score: 10 },
            { label: "游客中心/出入口", score: 9 },
            { label: "主街非核心", score: 8 },
            { label: "次街/侧街", score: 4 },
            { label: "景区外/弱动线", score: 1 }
          ]
        },
        store: {
          label: "铺位类型",
          options: [
            { label: "标准大文创店", score: 8 },
            { label: "精品文创潮玩店", score: 8 },
            { label: "独立空间", score: 7 },
            { label: "手工艺店", score: 6 },
            { label: "普通旅游店", score: 4 },
            { label: "临时摊位", score: 2 }
          ]
        },
        display: {
          label: "陈列资源",
          options: [
            { label: "C位专区", score: 12 },
            { label: "专区", score: 10 },
            { label: "C位单柜", score: 8 },
            { label: "标准货架", score: 5 },
            { label: "边角陈列", score: 2 },
            { label: "无明确陈列", score: 0 }
          ]
        },
        policy: {
          label: "优待政策",
          options: [
            { label: "官方优待/低扣点/免费陈列", score: 10 },
            { label: "部分优待", score: 6 },
            { label: "无明显优待", score: 3 },
            { label: "高扣点/额外费用", score: -2 }
          ]
        },
        auth: {
          label: "官方授权",
          options: [
            { label: "官方授权", score: 12 },
            { label: "官方背书", score: 8 },
            { label: "门店合作无授权", score: 3 },
            { label: "无授权", score: 0 }
          ]
        }
      },
      purchaseTiers: [
        { productClass: "大瓦", productType: "手绘款", minQty: 1, maxQty: 9, name: "小批试采", discount: 0.62, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "大瓦", productType: "手绘款", minQty: 10, maxQty: 29, name: "基础采购", discount: 0.55, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "大瓦", productType: "手绘款", minQty: 30, maxQty: 49, name: "批量一档", discount: 0.5, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "大瓦", productType: "手绘款", minQty: 50, maxQty: 99, name: "批量二档", discount: 0.47, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "大瓦", productType: "手绘款", minQty: 100, maxQty: 99999, name: "批量三档", discount: 0.44, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "大瓦", productType: "工艺款", minQty: 1, maxQty: 9, name: "小批试采", discount: 0.65, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "大瓦", productType: "工艺款", minQty: 10, maxQty: 29, name: "基础采购", discount: 0.58, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "大瓦", productType: "工艺款", minQty: 30, maxQty: 49, name: "批量一档", discount: 0.53, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "大瓦", productType: "工艺款", minQty: 50, maxQty: 99, name: "批量二档", discount: 0.5, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "大瓦", productType: "工艺款", minQty: 100, maxQty: 99999, name: "批量三档", discount: 0.47, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "小瓦", productType: "手绘款", minQty: 1, maxQty: 9, name: "小批试采", discount: 0.62, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "小瓦", productType: "手绘款", minQty: 10, maxQty: 29, name: "基础采购", discount: 0.55, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "小瓦", productType: "手绘款", minQty: 30, maxQty: 49, name: "批量一档", discount: 0.5, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "小瓦", productType: "手绘款", minQty: 50, maxQty: 99, name: "批量二档", discount: 0.47, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "小瓦", productType: "手绘款", minQty: 100, maxQty: 99999, name: "批量三档", discount: 0.44, manualPrice: null, useManualPrice: false, enabled: true },
        { productClass: "小瓦", productType: "工艺款", minQty: 1, maxQty: 99999, name: "非常规", discount: 0.6, manualPrice: null, useManualPrice: false, enabled: false }
      ],
      consignmentIncentives: [
        { minSales: 0, maxSales: 14999, decrease: 0, name: "无激励" },
        { minSales: 15000, maxSales: 49999, decrease: 0.02, name: "达标动销激励" },
        { minSales: 50000, maxSales: 999999, decrease: 0.05, name: "高动销/样板激励" }
      ],
      totalPurchasePolicies: [
        { minQty: 0, maxQty: 99, name: "无额外激励", action: "按单款阶梯价执行" },
        { minQty: 100, maxQty: 299, name: "陈列物料支持", action: "提供标准陈列物料/价签/桌卡" },
        { minQty: 300, maxQty: 499, name: "样品/试销款支持", action: "可赠送样品或试销款若干" },
        { minQty: 500, maxQty: 999, name: "复购返利/账期支持", action: "可给予下次采购返利或短账期支持" },
        { minQty: 1000, maxQty: 99999, name: "专项合作政策", action: "可申请城市/区域专项合作政策" }
      ],
      commissionRates: {
        "采购制": 0.2,
        "保证金寄售": 0.15,
        "普通寄售": 0.12,
        "复购补货": 0.08
      },
      sellThroughFactors: [
        { minRate: 0.6, factor: 1.2, status: "优秀", action: "可补货/增加陈列/重点维护" },
        { minRate: 0.4, factor: 1, status: "健康", action: "正常补货与维护" },
        { minRate: 0.25, factor: 0.8, status: "观察", action: "优化陈列/换款/加强话术" },
        { minRate: 0.1, factor: 0.5, status: "低效", action: "控制补货，45天内优化" },
        { minRate: 0, factor: 0, status: "无效", action: "暂停提成/撤货/转采购" }
      ],
      dataQualityFactors: {
        "款式级核算": 1,
        "产品结构/品类级核算": 0.95,
        "总金额/总件数核算": 0.85,
        "延迟核算": 0.7,
        "缺失/无法核算": 0
      },
      paymentFactors: {
        "次月5日前": 1,
        "次月6-15日": 0.9,
        "次月16-30日": 0.7,
        "超过30日": 0.4,
        "未结算": 0
      },
      depositFactors: [
        { minCoverage: 1, factor: 1.1 },
        { minCoverage: 0.7, factor: 1 },
        { minCoverage: 0.5, factor: 0.8 },
        { minCoverage: 0.3, factor: 0.6 },
        { minCoverage: 0, factor: 0.3 }
      ],
      ui: {
        ruleOrder: ["price", "grade", "scoring", "purchase", "commission"]
      }
    },
    defaultInputs: {
      productId: "P001",
      costOverrides: {},
      scenario: {
        spotName: "普陀山核心文创店",
        scenicLevel: "5A",
        annualVisitors: 1000,
        ticketMode: "收费",
        ticketPrice: 160,
        culture: "寺庙/宗教/古镇/博物馆强相关",
        location: "主街核心动线",
        store: "标准大文创店",
        display: "C位专区",
        policy: "官方优待/低扣点/免费陈列",
        auth: "官方授权"
      },
      channel: {
        mode: "保证金寄售",
        gradeOverride: "",
        retailOverride: 0,
        productClassOverride: "",
        productTypeOverride: "",
        purchaseQty: 50,
        totalPurchaseQty: 50,
        monthlySales: 20000,
        stockQty: 200,
        soldQty: 120,
        deposit: 10000,
        dataQuality: "款式级核算",
        paymentTerm: "次月5日前"
      }
    }
  };

  root.DEFAULT_DATA = data;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = data;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
