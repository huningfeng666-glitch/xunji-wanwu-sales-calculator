(function attachScenicVerificationData(root) {
  const data = {
  "meta": {
    "generatedAt": "2026-07-06T22:36:20+08:00",
    "sourceRows": 547,
    "statusCounts": {
      "multi_channel_verified": 7,
      "official_list_verified": 538,
      "needs_recheck": 2
    },
    "trafficVerifiedRows": 7,
    "businessDataUsableRows": 6,
    "sourceHealthCounts": {
      "reachable": 8,
      "unreachable": 1
    },
    "verificationRule": "2025客流/收入等经营数据必须满足：一手官方/年报/运营方来源，或两个独立公开来源相互印证；否则只保留为基础库线索，不作为商务依据。",
    "allowedSources": [
      "文化和旅游部数据服务",
      "省市文旅局/景区管委会/运营方公告",
      "上市公司年报/审计披露",
      "景区官方票务或官方运营平台"
    ]
  },
  "spots": {
    "S001": {
      "id": "S001",
      "name": "乌镇景区（父级）",
      "verificationStatus": "multi_channel_verified",
      "verificationStatusLabel": "父级汇总已核，子级需分开",
      "verificationSourceCount": 2,
      "verificationChannels": [
        "中青旅2025年年报公开披露",
        "乌镇旅游官方网站票务政策"
      ],
      "verificationCheckedAt": "2026-07-07T12:00:00+08:00",
      "trafficVerified": true,
      "businessDataUsable": false,
      "dataTrustLevel": "父级汇总可作目的地背书，不作单店商务依据",
      "sourceHealth": {
        "url": "https://www.cyts.com/news/getDetail?id=11573",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "父级客流可核，但正式测算必须选择西栅、东栅、南栅、乌村等子级片区或具体店位。",
      "verificationWarnings": [
        "不得把父级685.05万人次直接套给任一门店"
      ]
    },
    "S001-XZ": {
      "id": "S001-XZ",
      "name": "乌镇西栅景区",
      "verificationStatus": "multi_channel_verified",
      "verificationStatusLabel": "子级客流/票价已核",
      "verificationSourceCount": 2,
      "verificationChannels": [
        "中青旅2025年年报公开披露",
        "乌镇官方票务政策"
      ],
      "verificationCheckedAt": "2026-07-07T12:00:00+08:00",
      "trafficVerified": true,
      "businessDataUsable": true,
      "dataTrustLevel": "可作公开基础库口径，商务前仍需复核店位",
      "sourceHealth": {
        "url": "https://www.cyts.com/news/getDetail?id=11573",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "2025年西栅子级客流和官方票务口径可核；店位、商务、授权仍由销售填报。",
      "verificationWarnings": []
    },
    "S001-DZ": {
      "id": "S001-DZ",
      "name": "乌镇东栅景区",
      "verificationStatus": "multi_channel_verified",
      "verificationStatusLabel": "子级客流/票价已核",
      "verificationSourceCount": 2,
      "verificationChannels": [
        "中青旅2025年年报公开披露",
        "乌镇官方票务政策"
      ],
      "verificationCheckedAt": "2026-07-07T12:00:00+08:00",
      "trafficVerified": true,
      "businessDataUsable": true,
      "dataTrustLevel": "可作公开基础库口径，商务前仍需复核店位",
      "sourceHealth": {
        "url": "https://www.cyts.com/news/getDetail?id=11573",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "2025年东栅子级客流和官方票务口径可核；不得直接套用西栅消费心智。",
      "verificationWarnings": []
    },
    "S001-NZ": {
      "id": "S001-NZ",
      "name": "乌镇南栅历史街区",
      "verificationStatus": "needs_recheck",
      "verificationStatusLabel": "不清楚：缺少子级年客流",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "乌镇旅游官方网站票务政策线索"
      ],
      "verificationCheckedAt": "2026-07-07T12:00:00+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅作销售线索，不作商务依据",
      "sourceHealth": {
        "url": "https://www.wuzhen.com.cn/web/traver/info",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "公开来源未找到南栅2025单点年客流；界面明确标记不清楚。",
      "verificationWarnings": [
        "不得继承父级、西栅或东栅客流"
      ]
    },
    "S001-WC": {
      "id": "S001-WC",
      "name": "乌镇乌村",
      "verificationStatus": "needs_recheck",
      "verificationStatusLabel": "不清楚：客流/单票待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "乌镇官方预订平台票务产品线索"
      ],
      "verificationCheckedAt": "2026-07-07T12:00:00+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅作销售线索，不作商务依据",
      "sourceHealth": {
        "url": "https://www.ewuzhen.com/ticket/list",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "公开来源未找到乌村2025单点年客流，且票务多为度假/套餐口径；界面明确标记不清楚。",
      "verificationWarnings": [
        "不得继承父级、西栅或东栅客流",
        "标准单票口径需销售或运营方确认"
      ]
    },
    "S002": {
      "id": "S002",
      "name": "故宫博物院",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S003": {
      "id": "S003",
      "name": "西湖风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S004": {
      "id": "S004",
      "name": "普陀山风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S005": {
      "id": "S005",
      "name": "南京夫子庙-秦淮风光带",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S006": {
      "id": "S006",
      "name": "平遥古城",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S007": {
      "id": "S007",
      "name": "丽江古城",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S008": {
      "id": "S008",
      "name": "西安城墙",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S009": {
      "id": "S009",
      "name": "苏州园林（拙政园等）",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S010": {
      "id": "S010",
      "name": "宽窄巷子",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S011": {
      "id": "S011",
      "name": "杭州河坊街/清河坊历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S012": {
      "id": "S012",
      "name": "景德镇陶溪川文创街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S013": {
      "id": "S013",
      "name": "颐和园",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S014": {
      "id": "S014",
      "name": "天坛公园",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S015": {
      "id": "S015",
      "name": "恭王府景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S016": {
      "id": "S016",
      "name": "前门大街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S017": {
      "id": "S017",
      "name": "天津古文化街旅游区（津门故里）",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S018": {
      "id": "S018",
      "name": "杨柳青古镇街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S019": {
      "id": "S019",
      "name": "山海关景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S020": {
      "id": "S020",
      "name": "广府古城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S021": {
      "id": "S021",
      "name": "承德避暑山庄及周围寺庙景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S022": {
      "id": "S022",
      "name": "培仁历史文化街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S023": {
      "id": "S023",
      "name": "又见平遥文化产业园区印象新街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S024": {
      "id": "S024",
      "name": "晋祠天龙山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S025": {
      "id": "S025",
      "name": "五台山风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S026": {
      "id": "S026",
      "name": "皇城相府生态文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S027": {
      "id": "S027",
      "name": "云冈石窟景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S028": {
      "id": "S028",
      "name": "塞上老街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S029": {
      "id": "S029",
      "name": "沈阳中街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S030": {
      "id": "S030",
      "name": "沈阳故宫",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "公开文旅线索/销售待核"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://zwgk.mct.gov.cn/zfxxgkml/tjxx/202606/t20260602_966073.html",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S031": {
      "id": "S031",
      "name": "伪满皇宫博物馆",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S032": {
      "id": "S032",
      "name": "中央大街步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S033": {
      "id": "S033",
      "name": "新天地石库门街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S034": {
      "id": "S034",
      "name": "武康路-安福路街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S035": {
      "id": "S035",
      "name": "周庄古镇景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S036": {
      "id": "S036",
      "name": "同里古镇景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S037": {
      "id": "S037",
      "name": "惠山古镇景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S038": {
      "id": "S038",
      "name": "东关街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S039": {
      "id": "S039",
      "name": "平江历史街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S040": {
      "id": "S040",
      "name": "南浔古镇景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S041": {
      "id": "S041",
      "name": "西塘古镇旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S042": {
      "id": "S042",
      "name": "台州府城文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S043": {
      "id": "S043",
      "name": "绍兴鲁迅故里·沈园景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S044": {
      "id": "S044",
      "name": "桥西历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S045": {
      "id": "S045",
      "name": "皖南古村落-西递宏村",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S046": {
      "id": "S046",
      "name": "古徽州文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S047": {
      "id": "S047",
      "name": "三河古镇景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S048": {
      "id": "S048",
      "name": "黎阳映像街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S049": {
      "id": "S049",
      "name": "三坊七巷景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S050": {
      "id": "S050",
      "name": "福建土楼（永定·南靖）旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S051": {
      "id": "S051",
      "name": "鼓浪屿风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S052": {
      "id": "S052",
      "name": "泉州中山路旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S053": {
      "id": "S053",
      "name": "漳州古城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S054": {
      "id": "S054",
      "name": "篁岭景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S055": {
      "id": "S055",
      "name": "滕王阁旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S056": {
      "id": "S056",
      "name": "婺源县江湾景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S057": {
      "id": "S057",
      "name": "景德镇古窑民俗博览区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S058": {
      "id": "S058",
      "name": "万寿宫旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S059": {
      "id": "S059",
      "name": "台儿庄古城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S060": {
      "id": "S060",
      "name": "青州古城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S061": {
      "id": "S061",
      "name": "周村古商城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S062": {
      "id": "S062",
      "name": "明故城三孔旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S063": {
      "id": "S063",
      "name": "百花洲历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S064": {
      "id": "S064",
      "name": "清明上河园景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S065": {
      "id": "S065",
      "name": "龙门石窟景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S066": {
      "id": "S066",
      "name": "嵩山少林景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S067": {
      "id": "S067",
      "name": "殷墟景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S068": {
      "id": "S068",
      "name": "洛阳古城历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S069": {
      "id": "S069",
      "name": "黄鹤楼公园",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S070": {
      "id": "S070",
      "name": "武当山风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S071": {
      "id": "S071",
      "name": "襄阳北街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S072": {
      "id": "S072",
      "name": "昙华林历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S073": {
      "id": "S073",
      "name": "凤凰古城旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S074": {
      "id": "S074",
      "name": "岳阳楼-君山岛景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S075": {
      "id": "S075",
      "name": "太平街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S076": {
      "id": "S076",
      "name": "潮宗街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S077": {
      "id": "S077",
      "name": "开平碉楼文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S078": {
      "id": "S078",
      "name": "永庆坊",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S079": {
      "id": "S079",
      "name": "牌坊街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S080": {
      "id": "S080",
      "name": "南风古灶旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S081": {
      "id": "S081",
      "name": "南头古城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S082": {
      "id": "S082",
      "name": "黄姚古镇景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S083": {
      "id": "S083",
      "name": "独秀峰·靖江王城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S084": {
      "id": "S084",
      "name": "东西巷历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S085": {
      "id": "S085",
      "name": "骑楼建筑历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S086": {
      "id": "S086",
      "name": "大足石刻景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S087": {
      "id": "S087",
      "name": "磁器口街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S088": {
      "id": "S088",
      "name": "十八梯传统风貌区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S089": {
      "id": "S089",
      "name": "安仁古镇景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S090": {
      "id": "S090",
      "name": "阆中古城旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S091": {
      "id": "S091",
      "name": "青城山-都江堰旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S092": {
      "id": "S092",
      "name": "武侯祠·锦里",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S093": {
      "id": "S093",
      "name": "青岩古镇景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S094": {
      "id": "S094",
      "name": "镇远古城旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S095": {
      "id": "S095",
      "name": "崇圣寺三塔文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S096": {
      "id": "S096",
      "name": "和顺古镇景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S097": {
      "id": "S097",
      "name": "建水临安古城主题特色街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S098": {
      "id": "S098",
      "name": "大昭寺景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S099": {
      "id": "S099",
      "name": "布达拉宫景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S100": {
      "id": "S100",
      "name": "大唐不夜城步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S101": {
      "id": "S101",
      "name": "大明宫旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S102": {
      "id": "S102",
      "name": "华清宫景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S103": {
      "id": "S103",
      "name": "秦始皇帝陵博物院景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S104": {
      "id": "S104",
      "name": "嘉峪关文物景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S105": {
      "id": "S105",
      "name": "敦煌夜市文化旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S106": {
      "id": "S106",
      "name": "塔尔寺景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S107": {
      "id": "S107",
      "name": "镇北堡西部影视城",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S108": {
      "id": "S108",
      "name": "喀什古城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S109": {
      "id": "S109",
      "name": "热斯坦旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S110": {
      "id": "S110",
      "name": "大巴扎旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S111": {
      "id": "S111",
      "name": "北京（通州）大运河文化旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S112": {
      "id": "S112",
      "name": "圆明园遗址公园景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S113": {
      "id": "S113",
      "name": "北京奥林匹克公园",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S114": {
      "id": "S114",
      "name": "明十三陵景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S115": {
      "id": "S115",
      "name": "八达岭-慕田峪长城旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S116": {
      "id": "S116",
      "name": "盘山风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S117": {
      "id": "S117",
      "name": "衡水湖旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S118": {
      "id": "S118",
      "name": "南湖·开滦旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S119": {
      "id": "S119",
      "name": "金山岭长城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S120": {
      "id": "S120",
      "name": "清西陵景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S121": {
      "id": "S121",
      "name": "白石山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S122": {
      "id": "S122",
      "name": "娲皇宫景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S123": {
      "id": "S123",
      "name": "清东陵景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S124": {
      "id": "S124",
      "name": "西柏坡景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S125": {
      "id": "S125",
      "name": "野三坡景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S126": {
      "id": "S126",
      "name": "白洋淀景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S127": {
      "id": "S127",
      "name": "乔家大院景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S128": {
      "id": "S128",
      "name": "黄河壶口瀑布旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S129": {
      "id": "S129",
      "name": "云丘山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S130": {
      "id": "S130",
      "name": "太行山大峡谷八泉峡景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S131": {
      "id": "S131",
      "name": "洪洞大槐树寻根祭祖园旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S132": {
      "id": "S132",
      "name": "雁门关景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S133": {
      "id": "S133",
      "name": "绵山风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S134": {
      "id": "S134",
      "name": "老牛湾黄河大峡谷旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S135": {
      "id": "S135",
      "name": "呼伦贝尔大草原·莫尔格勒河景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S136": {
      "id": "S136",
      "name": "胡杨林旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S137": {
      "id": "S137",
      "name": "阿斯哈图石林景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S138": {
      "id": "S138",
      "name": "阿尔山-柴河旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S139": {
      "id": "S139",
      "name": "中俄边境旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S140": {
      "id": "S140",
      "name": "成吉思汗陵旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S141": {
      "id": "S141",
      "name": "响沙湾旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S142": {
      "id": "S142",
      "name": "五女山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S143": {
      "id": "S143",
      "name": "红海滩风景廊道景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S144": {
      "id": "S144",
      "name": "千山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S145": {
      "id": "S145",
      "name": "本溪水洞景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S146": {
      "id": "S146",
      "name": "金石滩景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S147": {
      "id": "S147",
      "name": "老虎滩海洋公园-老虎滩极地馆",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S148": {
      "id": "S148",
      "name": "沈阳植物园",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S149": {
      "id": "S149",
      "name": "大安嫩江湾旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S150": {
      "id": "S150",
      "name": "前郭查干湖景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S151": {
      "id": "S151",
      "name": "高句丽文物古迹旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S152": {
      "id": "S152",
      "name": "世界雕塑公园景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S153": {
      "id": "S153",
      "name": "延边州六鼎山文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S154": {
      "id": "S154",
      "name": "长影世纪城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S155": {
      "id": "S155",
      "name": "净月潭景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S156": {
      "id": "S156",
      "name": "长白山景区",
      "verificationStatus": "multi_channel_verified",
      "verificationStatusLabel": "多渠道已核",
      "verificationSourceCount": 2,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单",
        "长白山2025年年报公开披露"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": true,
      "businessDataUsable": true,
      "dataTrustLevel": "可作为初步商务依据",
      "sourceHealth": {
        "url": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12021482&stockid=603099",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区公开身份与2025经营数据均有公开来源支撑",
      "verificationWarnings": []
    },
    "S157": {
      "id": "S157",
      "name": "扎龙生态旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S158": {
      "id": "S158",
      "name": "虎头旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S159": {
      "id": "S159",
      "name": "北极村旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S160": {
      "id": "S160",
      "name": "林海奇石景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S161": {
      "id": "S161",
      "name": "镜泊湖景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S162": {
      "id": "S162",
      "name": "五大连池景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S163": {
      "id": "S163",
      "name": "太阳岛景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S164": {
      "id": "S164",
      "name": "西沙明珠湖景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S165": {
      "id": "S165",
      "name": "中国共产党一大·二大·四大纪念馆景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S166": {
      "id": "S166",
      "name": "上海科技馆",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S167": {
      "id": "S167",
      "name": "上海野生动物园",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S168": {
      "id": "S168",
      "name": "东方明珠广播电视塔",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S169": {
      "id": "S169",
      "name": "连岛景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S170": {
      "id": "S170",
      "name": "洪泽湖湿地景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S171": {
      "id": "S171",
      "name": "春秋淹城旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S172": {
      "id": "S172",
      "name": "花果山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S173": {
      "id": "S173",
      "name": "云龙湖景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S174": {
      "id": "S174",
      "name": "中华麋鹿园景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S175": {
      "id": "S175",
      "name": "周恩来故里景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S176": {
      "id": "S176",
      "name": "茅山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S177": {
      "id": "S177",
      "name": "天目湖景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S178": {
      "id": "S178",
      "name": "沙家浜-虞山尚湖旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S179": {
      "id": "S179",
      "name": "太湖旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S180": {
      "id": "S180",
      "name": "鼋头渚旅游风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S181": {
      "id": "S181",
      "name": "金山·焦山·北固山风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S182": {
      "id": "S182",
      "name": "金鸡湖旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S183": {
      "id": "S183",
      "name": "溱湖旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S184": {
      "id": "S184",
      "name": "濠河风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S185": {
      "id": "S185",
      "name": "环球恐龙城休闲旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S186": {
      "id": "S186",
      "name": "灵山大佛景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S187": {
      "id": "S187",
      "name": "中央电视台无锡影视基地三国水浒城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S188": {
      "id": "S188",
      "name": "-中山陵园风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S189": {
      "id": "S189",
      "name": "苏州园林（拙政园-留园-虎丘）",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S190": {
      "id": "S190",
      "name": "双龙风景旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S191": {
      "id": "S191",
      "name": "云和梯田景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S192": {
      "id": "S192",
      "name": "刘伯温故里景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S193": {
      "id": "S193",
      "name": "缙云仙都景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S194": {
      "id": "S194",
      "name": "天一阁·月湖景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S195": {
      "id": "S195",
      "name": "江郎山·廿八都旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S196": {
      "id": "S196",
      "name": "神仙居景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S197": {
      "id": "S197",
      "name": "天台山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S198": {
      "id": "S198",
      "name": "根宫佛国文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S199": {
      "id": "S199",
      "name": "西溪湿地旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S200": {
      "id": "S200",
      "name": "横店影视城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S201": {
      "id": "S201",
      "name": "溪口-滕头旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S202": {
      "id": "S202",
      "name": "千岛湖风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S203": {
      "id": "S203",
      "name": "雁荡山风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S204": {
      "id": "S204",
      "name": "琅琊山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S205": {
      "id": "S205",
      "name": "长江采石矶文化生态旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S206": {
      "id": "S206",
      "name": "万佛湖风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S207": {
      "id": "S207",
      "name": "方特旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S208": {
      "id": "S208",
      "name": "八里河风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S209": {
      "id": "S209",
      "name": "龙川景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S210": {
      "id": "S210",
      "name": "天堂寨旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S211": {
      "id": "S211",
      "name": "天柱山风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S212": {
      "id": "S212",
      "name": "九华山风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S213": {
      "id": "S213",
      "name": "黄山风景区",
      "verificationStatus": "multi_channel_verified",
      "verificationStatusLabel": "多渠道已核",
      "verificationSourceCount": 2,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单",
        "黄山旅游2025年年报公开披露"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": true,
      "businessDataUsable": true,
      "dataTrustLevel": "可作为初步商务依据",
      "sourceHealth": {
        "url": "https://money.finance.sina.com.cn/corp/view/vCB_AllBulletinDetail.php?id=12108299&stockid=600054",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区公开身份与2025经营数据均有公开来源支撑",
      "verificationWarnings": []
    },
    "S214": {
      "id": "S214",
      "name": "冠豸山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S215": {
      "id": "S215",
      "name": "厦门园林植物园景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S216": {
      "id": "S216",
      "name": "湄洲岛妈祖文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S217": {
      "id": "S217",
      "name": "古田旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S218": {
      "id": "S218",
      "name": "太姥山旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S219": {
      "id": "S219",
      "name": "清源山风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S220": {
      "id": "S220",
      "name": "（白水洋·鸳鸯溪）旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S221": {
      "id": "S221",
      "name": "泰宁风景旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S222": {
      "id": "S222",
      "name": "武夷山风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S223": {
      "id": "S223",
      "name": "三百山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S224": {
      "id": "S224",
      "name": "庐山西海景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S225": {
      "id": "S225",
      "name": "萍乡武功山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S226": {
      "id": "S226",
      "name": "龟峰景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S227": {
      "id": "S227",
      "name": "大觉山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S228": {
      "id": "S228",
      "name": "明月山旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S229": {
      "id": "S229",
      "name": "共和国摇篮景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S230": {
      "id": "S230",
      "name": "龙虎山风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S231": {
      "id": "S231",
      "name": "三清山风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S232": {
      "id": "S232",
      "name": "井冈山风景旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S233": {
      "id": "S233",
      "name": "奥帆海洋文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S234": {
      "id": "S234",
      "name": "微山湖旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S235": {
      "id": "S235",
      "name": "萤火虫水洞·地下大峡谷旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S236": {
      "id": "S236",
      "name": "黄河口生态旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S237": {
      "id": "S237",
      "name": "威海华夏城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S238": {
      "id": "S238",
      "name": "沂蒙山旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S239": {
      "id": "S239",
      "name": "天下第一泉景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S240": {
      "id": "S240",
      "name": "南山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S241": {
      "id": "S241",
      "name": "刘公岛景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S242": {
      "id": "S242",
      "name": "崂山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S243": {
      "id": "S243",
      "name": "蓬莱阁-三仙山-八仙过海旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S244": {
      "id": "S244",
      "name": "泰山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S245": {
      "id": "S245",
      "name": "宝泉旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S246": {
      "id": "S246",
      "name": "太昊伏羲陵文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S247": {
      "id": "S247",
      "name": "鸡公山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S248": {
      "id": "S248",
      "name": "八里沟景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S249": {
      "id": "S249",
      "name": "芒砀山汉文化旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S250": {
      "id": "S250",
      "name": "红旗渠-太行大峡谷旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S251": {
      "id": "S251",
      "name": "嵖岈山旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S252": {
      "id": "S252",
      "name": "西峡恐龙遗迹园-伏牛山-老界岭旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S253": {
      "id": "S253",
      "name": "龙潭大峡谷景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S254": {
      "id": "S254",
      "name": "老君山-鸡冠洞旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S255": {
      "id": "S255",
      "name": "尧山-中原大佛景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S256": {
      "id": "S256",
      "name": "白云山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S257": {
      "id": "S257",
      "name": "云台山-神农山-青天河风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S258": {
      "id": "S258",
      "name": "明显陵文化旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S259": {
      "id": "S259",
      "name": "三峡大瀑布景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S260": {
      "id": "S260",
      "name": "恩施州腾龙洞景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S261": {
      "id": "S261",
      "name": "古隆中景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S262": {
      "id": "S262",
      "name": "三国赤壁古战场景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S263": {
      "id": "S263",
      "name": "恩施州恩施大峡谷景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S264": {
      "id": "S264",
      "name": "木兰文化生态旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S265": {
      "id": "S265",
      "name": "东湖景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S266": {
      "id": "S266",
      "name": "清江画廊景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S267": {
      "id": "S267",
      "name": "神农架生态旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S268": {
      "id": "S268",
      "name": "恩施州神农溪纤夫文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S269": {
      "id": "S269",
      "name": "三峡人家风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S270": {
      "id": "S270",
      "name": "三峡大坝-屈原故里文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S271": {
      "id": "S271",
      "name": "矮寨·十八洞·德夯大峡谷景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S272": {
      "id": "S272",
      "name": "桃花源旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S273": {
      "id": "S273",
      "name": "炎帝陵景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S274": {
      "id": "S274",
      "name": "崀山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S275": {
      "id": "S275",
      "name": "东江湖旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S276": {
      "id": "S276",
      "name": "花明楼景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S277": {
      "id": "S277",
      "name": "岳麓山-橘子洲旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S278": {
      "id": "S278",
      "name": "韶山旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S279": {
      "id": "S279",
      "name": "衡山旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S280": {
      "id": "S280",
      "name": "武陵源-天门山旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S281": {
      "id": "S281",
      "name": "万绿湖风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S282": {
      "id": "S282",
      "name": "星湖旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S283": {
      "id": "S283",
      "name": "孙中山故里旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S284": {
      "id": "S284",
      "name": "海陵岛大角湾海上丝路旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S285": {
      "id": "S285",
      "name": "长鹿旅游休博园",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S286": {
      "id": "S286",
      "name": "罗浮山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S287": {
      "id": "S287",
      "name": "西樵山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S288": {
      "id": "S288",
      "name": "丹霞山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S289": {
      "id": "S289",
      "name": "地下河旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S290": {
      "id": "S290",
      "name": "观澜湖休闲旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S291": {
      "id": "S291",
      "name": "区雁南飞茶田景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S292": {
      "id": "S292",
      "name": "华侨城旅游度假区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S293": {
      "id": "S293",
      "name": "长隆旅游度假区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S294": {
      "id": "S294",
      "name": "花山岩画景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S295": {
      "id": "S295",
      "name": "程阳八寨景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S296": {
      "id": "S296",
      "name": "涠洲岛南湾鳄鱼山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S297": {
      "id": "S297",
      "name": "百色起义纪念园景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S298": {
      "id": "S298",
      "name": "德天跨国瀑布景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S299": {
      "id": "S299",
      "name": "两江四湖·象山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S300": {
      "id": "S300",
      "name": "青秀山风景名胜旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S301": {
      "id": "S301",
      "name": "漓江风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S302": {
      "id": "S302",
      "name": "天涯海角游览区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S303": {
      "id": "S303",
      "name": "蜈支洲岛旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S304": {
      "id": "S304",
      "name": "海南槟榔谷黎苗文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S305": {
      "id": "S305",
      "name": "分界洲岛旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S306": {
      "id": "S306",
      "name": "呀诺达雨林文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S307": {
      "id": "S307",
      "name": "武陵山大裂谷景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S308": {
      "id": "S308",
      "name": "白帝城·瞿塘峡景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S309": {
      "id": "S309",
      "name": "濯水景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S310": {
      "id": "S310",
      "name": "阿依河景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S311": {
      "id": "S311",
      "name": "龙缸景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S312": {
      "id": "S312",
      "name": "四面山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S313": {
      "id": "S313",
      "name": "金佛山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S314": {
      "id": "S314",
      "name": "万盛黑山谷-龙鳞石海风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S315": {
      "id": "S315",
      "name": "喀斯特旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S316": {
      "id": "S316",
      "name": "小三峡-小小三峡旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S317": {
      "id": "S317",
      "name": "阿坝州四姑娘山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S318": {
      "id": "S318",
      "name": "甘孜州稻城亚丁旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S319": {
      "id": "S319",
      "name": "光雾山旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S320": {
      "id": "S320",
      "name": "碧峰峡旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S321": {
      "id": "S321",
      "name": "甘孜州海螺沟景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S322": {
      "id": "S322",
      "name": "朱德故里景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S323": {
      "id": "S323",
      "name": "剑门蜀道剑门关旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S324": {
      "id": "S324",
      "name": "邓小平故里旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S325": {
      "id": "S325",
      "name": "阿坝州汶川特别旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S326": {
      "id": "S326",
      "name": "羌城旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S327": {
      "id": "S327",
      "name": "阿坝州黄龙风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S328": {
      "id": "S328",
      "name": "乐山大佛景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S329": {
      "id": "S329",
      "name": "阿坝州九寨沟景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://www.jiuzhai.com/news/scenic-news/10741-2025-10-23-19-27-29",
        "reachable": false,
        "httpStatus": 403,
        "error": "Forbidden"
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据",
        "来源链接本次访问异常，需人工复核原始出处"
      ]
    },
    "S330": {
      "id": "S330",
      "name": "峨眉山景区",
      "verificationStatus": "multi_channel_verified",
      "verificationStatusLabel": "多渠道已核",
      "verificationSourceCount": 2,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单",
        "峨眉山A 2025年年报公开披露（澎湃新闻转述）"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": true,
      "businessDataUsable": true,
      "dataTrustLevel": "可作为初步商务依据",
      "sourceHealth": {
        "url": "https://m.thepaper.cn/newsDetail_forward_33067979",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区公开身份与2025经营数据均有公开来源支撑",
      "verificationWarnings": []
    },
    "S331": {
      "id": "S331",
      "name": "黔西南州万峰林景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S332": {
      "id": "S332",
      "name": "织金洞景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S333": {
      "id": "S333",
      "name": "赤水丹霞旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S334": {
      "id": "S334",
      "name": "梵净山旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S335": {
      "id": "S335",
      "name": "樟江景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S336": {
      "id": "S336",
      "name": "百里杜鹃景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S337": {
      "id": "S337",
      "name": "龙宫景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S338": {
      "id": "S338",
      "name": "黄果树瀑布景区",
      "verificationStatus": "multi_channel_verified",
      "verificationStatusLabel": "多渠道已核",
      "verificationSourceCount": 2,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单",
        "人民网/新华网官方媒体公开报道"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": true,
      "businessDataUsable": true,
      "dataTrustLevel": "可作为初步商务依据",
      "sourceHealth": {
        "url": "http://gz.people.com.cn/BIG5/n2/2026/0414/c411926-41551262.html",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区公开身份与2025经营数据均有公开来源支撑",
      "verificationWarnings": []
    },
    "S339": {
      "id": "S339",
      "name": "文山州普者黑旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S340": {
      "id": "S340",
      "name": "火山热海旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S341": {
      "id": "S341",
      "name": "昆明世博园景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S342": {
      "id": "S342",
      "name": "迪庆州普达措国家公园",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S343": {
      "id": "S343",
      "name": "西双版纳州中科院西双版纳热带植物园",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S344": {
      "id": "S344",
      "name": "玉龙雪山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S345": {
      "id": "S345",
      "name": "雅鲁藏布大峡谷景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S346": {
      "id": "S346",
      "name": "扎什伦布寺景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S347": {
      "id": "S347",
      "name": "巴松措景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S348": {
      "id": "S348",
      "name": "乾陵景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S349": {
      "id": "S349",
      "name": "延川黄河乾坤湾景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S350": {
      "id": "S350",
      "name": "延安革命纪念地景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S351": {
      "id": "S351",
      "name": "城墙·碑林历史文化景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S352": {
      "id": "S352",
      "name": "太白山旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S353": {
      "id": "S353",
      "name": "金丝峡景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S354": {
      "id": "S354",
      "name": "法门文化景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S355": {
      "id": "S355",
      "name": "大雁塔-大唐芙蓉园景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S356": {
      "id": "S356",
      "name": "黄帝陵景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S357": {
      "id": "S357",
      "name": "甘南州冶力关旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S358": {
      "id": "S358",
      "name": "官鹅沟景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S359": {
      "id": "S359",
      "name": "临夏州炳灵寺世界文化遗产旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S360": {
      "id": "S360",
      "name": "七彩丹霞景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S361": {
      "id": "S361",
      "name": "鸣沙山月牙泉景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S362": {
      "id": "S362",
      "name": "麦积山景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S363": {
      "id": "S363",
      "name": "崆峒山风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S364": {
      "id": "S364",
      "name": "海北州阿咪东索景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S365": {
      "id": "S365",
      "name": "互助土族故土园旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S366": {
      "id": "S366",
      "name": "青海湖风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S367": {
      "id": "S367",
      "name": "青铜峡黄河大峡谷旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S368": {
      "id": "S368",
      "name": "水洞沟旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S369": {
      "id": "S369",
      "name": "沙坡头旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S370": {
      "id": "S370",
      "name": "沙湖旅游景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S371": {
      "id": "S371",
      "name": "天山托木尔景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S372": {
      "id": "S372",
      "name": "江布拉克景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S373": {
      "id": "S373",
      "name": "赛里木湖景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S374": {
      "id": "S374",
      "name": "世界魔鬼城景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S375": {
      "id": "S375",
      "name": "帕米尔旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S376": {
      "id": "S376",
      "name": "巴音布鲁克景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S377": {
      "id": "S377",
      "name": "喀拉峻景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S378": {
      "id": "S378",
      "name": "博斯腾湖景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S379": {
      "id": "S379",
      "name": "天山大峡谷",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S380": {
      "id": "S380",
      "name": "金湖杨景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S381": {
      "id": "S381",
      "name": "可可托海景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S382": {
      "id": "S382",
      "name": "那拉提旅游风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S383": {
      "id": "S383",
      "name": "喀纳斯景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S384": {
      "id": "S384",
      "name": "葡萄沟风景区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S385": {
      "id": "S385",
      "name": "天山天池风景名胜区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S386": {
      "id": "S386",
      "name": "兵团阿拉尔市塔克拉玛干·三五九旅文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家5A级旅游景区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=10",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S387": {
      "id": "S387",
      "name": "模式口历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S388": {
      "id": "S388",
      "name": "王府井商业街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S389": {
      "id": "S389",
      "name": "乐多港假日广场旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S390": {
      "id": "S390",
      "name": "751旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S391": {
      "id": "S391",
      "name": "华熙LIVE·五棵松旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S392": {
      "id": "S392",
      "name": "三里屯太古里",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S393": {
      "id": "S393",
      "name": "渔阳古街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S394": {
      "id": "S394",
      "name": "意风区旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S395": {
      "id": "S395",
      "name": "西大街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S396": {
      "id": "S396",
      "name": "湾里庙步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S397": {
      "id": "S397",
      "name": "鼎盛·元宝街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S398": {
      "id": "S398",
      "name": "河头老街文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S399": {
      "id": "S399",
      "name": "启新1889文化旅游街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S400": {
      "id": "S400",
      "name": "富龙风铃乐谷休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S401": {
      "id": "S401",
      "name": "金龙旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S402": {
      "id": "S402",
      "name": "太原古县城十字街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S403": {
      "id": "S403",
      "name": "钟楼步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S404": {
      "id": "S404",
      "name": "岚山根·运城印象步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S405": {
      "id": "S405",
      "name": "古城文旅休闲生活街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S406": {
      "id": "S406",
      "name": "阿拉善左旗定远营古城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S407": {
      "id": "S407",
      "name": "呼伦贝尔古城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S408": {
      "id": "S408",
      "name": "恼包旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S409": {
      "id": "S409",
      "name": "乔家金街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S410": {
      "id": "S410",
      "name": "黄河湾步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S411": {
      "id": "S411",
      "name": "安东老街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S412": {
      "id": "S412",
      "name": "红梅文创园旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S413": {
      "id": "S413",
      "name": "沈阳老北市旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S414": {
      "id": "S414",
      "name": "海昌·东方水城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S415": {
      "id": "S415",
      "name": "仁兴里沉浸式文旅街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S416": {
      "id": "S416",
      "name": "红旗街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S417": {
      "id": "S417",
      "name": "东北不夜城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S418": {
      "id": "S418",
      "name": "油坊胡同美食步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S419": {
      "id": "S419",
      "name": "中华巴洛克历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S420": {
      "id": "S420",
      "name": "东一中俄风情街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S421": {
      "id": "S421",
      "name": "蟠龙天地街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S422": {
      "id": "S422",
      "name": "衡复音乐街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S423": {
      "id": "S423",
      "name": "静安嘉里中心一安义路街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S424": {
      "id": "S424",
      "name": "愚园艺术生活街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S425": {
      "id": "S425",
      "name": "思南公馆街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S426": {
      "id": "S426",
      "name": "西津渡历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S427": {
      "id": "S427",
      "name": "御码头运河文化美食休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S428": {
      "id": "S428",
      "name": "运河·盂城驿街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S429": {
      "id": "S429",
      "name": "三堡街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S430": {
      "id": "S430",
      "name": "户部山-回龙窝街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S431": {
      "id": "S431",
      "name": "青果巷历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S432": {
      "id": "S432",
      "name": "李公堤旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S433": {
      "id": "S433",
      "name": "清名桥历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S434": {
      "id": "S434",
      "name": "紫阳街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S435": {
      "id": "S435",
      "name": "婺州古城历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S436": {
      "id": "S436",
      "name": "南塘河历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S437": {
      "id": "S437",
      "name": "运河·塘栖古镇历史风情街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S438": {
      "id": "S438",
      "name": "湖州小西街-衣裳街-状元街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S439": {
      "id": "S439",
      "name": "水亭门历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S440": {
      "id": "S440",
      "name": "老外滩街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S441": {
      "id": "S441",
      "name": "五马历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S442": {
      "id": "S442",
      "name": "长江不夜城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S443": {
      "id": "S443",
      "name": "安庆古城·倒扒狮历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S444": {
      "id": "S444",
      "name": "隋唐运河古镇旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S445": {
      "id": "S445",
      "name": "芜湖古城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S446": {
      "id": "S446",
      "name": "亳州北关历史街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S447": {
      "id": "S447",
      "name": "包河区罍街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S448": {
      "id": "S448",
      "name": "兴化府历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S449": {
      "id": "S449",
      "name": "尚书街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S450": {
      "id": "S450",
      "name": "店头街历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S451": {
      "id": "S451",
      "name": "上下杭历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S452": {
      "id": "S452",
      "name": "五店市传统文化旅游区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S453": {
      "id": "S453",
      "name": "明清古城老街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S454": {
      "id": "S454",
      "name": "文昌里旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S455": {
      "id": "S455",
      "name": "郁孤台旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S456": {
      "id": "S456",
      "name": "望仙谷岩铺老街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S457": {
      "id": "S457",
      "name": "饶州古镇旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S458": {
      "id": "S458",
      "name": "灯火兰山·新琅琊旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S459": {
      "id": "S459",
      "name": "台东旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S460": {
      "id": "S460",
      "name": "大鲍岛文化旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S461": {
      "id": "S461",
      "name": "印象济南·泉世界文化旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S462": {
      "id": "S462",
      "name": "金沙滩啤酒城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S463": {
      "id": "S463",
      "name": "朝阳街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S464": {
      "id": "S464",
      "name": "郑州记忆1952油化厂旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S465": {
      "id": "S465",
      "name": "广州市场步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S466": {
      "id": "S466",
      "name": "鼓楼特色文化旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S467": {
      "id": "S467",
      "name": "七盛角旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S468": {
      "id": "S468",
      "name": "岸上旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S469": {
      "id": "S469",
      "name": "德化步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S470": {
      "id": "S470",
      "name": "江汉路步行街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S471": {
      "id": "S471",
      "name": "吉庆民俗街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S472": {
      "id": "S472",
      "name": "仙山贡水兴隆老街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S473": {
      "id": "S473",
      "name": "黎黄陂路历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S474": {
      "id": "S474",
      "name": "西关印象旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S475": {
      "id": "S475",
      "name": "黔阳古城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S476": {
      "id": "S476",
      "name": "裕后街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S477": {
      "id": "S477",
      "name": "洞庭南路历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S478": {
      "id": "S478",
      "name": "柳子街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S479": {
      "id": "S479",
      "name": "乾州古城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S480": {
      "id": "S480",
      "name": "柳叶湖区河街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S481": {
      "id": "S481",
      "name": "祝屋巷",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S482": {
      "id": "S482",
      "name": "启明里",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S483": {
      "id": "S483",
      "name": "水东街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S484": {
      "id": "S484",
      "name": "孙文西路旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S485": {
      "id": "S485",
      "name": "钦州老街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S486": {
      "id": "S486",
      "name": "窑埠古镇街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S487": {
      "id": "S487",
      "name": "阳朔西街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S488": {
      "id": "S488",
      "name": "北海老城历史文化旅游街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S489": {
      "id": "S489",
      "name": "老南宁·三街两巷历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S490": {
      "id": "S490",
      "name": "大东海国际滨海旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S491": {
      "id": "S491",
      "name": "高兴里潮酷文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S492": {
      "id": "S492",
      "name": "环海艺术美食街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S493": {
      "id": "S493",
      "name": "鸿洲码头旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S494": {
      "id": "S494",
      "name": "龙门浩老街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S495": {
      "id": "S495",
      "name": "南川东街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S496": {
      "id": "S496",
      "name": "杨家坪步行街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S497": {
      "id": "S497",
      "name": "观音桥商圈旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S498": {
      "id": "S498",
      "name": "贰厂文创街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S499": {
      "id": "S499",
      "name": "酉州古城步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S500": {
      "id": "S500",
      "name": "大九街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S501": {
      "id": "S501",
      "name": "弹子石老街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S502": {
      "id": "S502",
      "name": "唐园旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S503": {
      "id": "S503",
      "name": "僰道历史文化旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S504": {
      "id": "S504",
      "name": "望平坊旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S505": {
      "id": "S505",
      "name": "上中顺特色街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S506": {
      "id": "S506",
      "name": "仁康古街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S507": {
      "id": "S507",
      "name": "春熙路",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S508": {
      "id": "S508",
      "name": "青云路步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S509": {
      "id": "S509",
      "name": "荔波古镇旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S510": {
      "id": "S510",
      "name": "中南门历史文化旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S511": {
      "id": "S511",
      "name": "云上丹寨旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S512": {
      "id": "S512",
      "name": "彝人古镇主题街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S513": {
      "id": "S513",
      "name": "南诏古街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S514": {
      "id": "S514",
      "name": "湄公河星光夜市旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S515": {
      "id": "S515",
      "name": "中国石林双龙旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S516": {
      "id": "S516",
      "name": "双廊镇民族文化街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S517": {
      "id": "S517",
      "name": "大研花巷旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S518": {
      "id": "S518",
      "name": "八廓街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S519": {
      "id": "S519",
      "name": "昌珠镇扎西曲登",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S520": {
      "id": "S520",
      "name": "慈觉林藏院风情街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S521": {
      "id": "S521",
      "name": "茶马城街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S522": {
      "id": "S522",
      "name": "榆林古城休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S523": {
      "id": "S523",
      "name": "石鼓文化城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S524": {
      "id": "S524",
      "name": "留坝厅老街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S525": {
      "id": "S525",
      "name": "榆林夫子庙文化旅游步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S526": {
      "id": "S526",
      "name": "秦巴老街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S527": {
      "id": "S527",
      "name": "古今里旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S528": {
      "id": "S528",
      "name": "河口古镇旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S529": {
      "id": "S529",
      "name": "八坊十三巷",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S530": {
      "id": "S530",
      "name": "旱码头·1960旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S531": {
      "id": "S531",
      "name": "平安驿·河湟民俗文化体验街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S532": {
      "id": "S532",
      "name": "唐道·637休闲文旅步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S533": {
      "id": "S533",
      "name": "贺兰山·漫葡小镇旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S534": {
      "id": "S534",
      "name": "向阳街旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S535": {
      "id": "S535",
      "name": "光耀旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S536": {
      "id": "S536",
      "name": "怀远旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S537": {
      "id": "S537",
      "name": "五百里风情街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S538": {
      "id": "S538",
      "name": "离街民俗风情步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S539": {
      "id": "S539",
      "name": "团城旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S540": {
      "id": "S540",
      "name": "新疆生产建设兵团第十二师104团新天润美食天街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S541": {
      "id": "S541",
      "name": "六星街历史文化街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S542": {
      "id": "S542",
      "name": "第四师可克达拉市草原之夜文化旅游休闲街区",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    },
    "S543": {
      "id": "S543",
      "name": "第八师石河子市幸福路步行街",
      "verificationStatus": "official_list_verified",
      "verificationStatusLabel": "官方名单已核，经营数据待核",
      "verificationSourceCount": 1,
      "verificationChannels": [
        "文化和旅游部国家级旅游休闲街区名单"
      ],
      "verificationCheckedAt": "2026-07-06T22:36:20+08:00",
      "trafficVerified": false,
      "businessDataUsable": false,
      "dataTrustLevel": "仅可用于入库和初筛",
      "sourceHealth": {
        "url": "https://sjfw.mct.gov.cn/site/dataservice/rural?type=138",
        "reachable": true,
        "httpStatus": 200,
        "error": ""
      },
      "verificationNote": "景区可进入基础库；2025客流、收入、店位、商务资源仍需销售或运营方补证",
      "verificationWarnings": [
        "2025客流/经营数据未完成多渠道核验，不得作为最终商务条件依据"
      ]
    }
  }
};
  root.SCENIC_VERIFICATION_DATA = data;
  if (typeof module !== "undefined") module.exports = data;
})(typeof window !== "undefined" ? window : globalThis);
