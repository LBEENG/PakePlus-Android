/**
 * 营养标准数据库
 * 基于《中国居民膳食营养素参考摄入量 2023版》
 * 包含: RNI(推荐摄入量)、UL(可耐受最高摄入量)、进阶标准(激进值80%)
 */

const NUTRITION_STANDARDS = {
  // 用户档案参数(17岁男性 力量训练 减脂发育期)
  // 根据体重97kg、力量训练特征，蛋白质等部分指标个性化上调
  profile: {
    gender: 'male',
    age: 17,
    height: 173,
    weight: 97,
    activityLevel: 'moderate', // 中等身体活动水平(规律力量训练)
    lifeLabels: ['力量训练爱好者', '减脂期', '发育期'],
    specialGroup: null,
    // BMR (Mifflin-St Jeor公式): 10*97 + 6.25*173 - 5*17 - 5 = 970+1081.25-85-5 = 1961.25
    bmr: 1961,
    // TDEE = BMR * 1.55(中等活动) ≈ 3040 kcal，减脂期建议TDEE的80% ≈ 2432
    tdee: 3040,
    targetCalories: 2430, // 减脂期目标热量
    targetProtein: 160,   // 力量训练减脂期 1.65g/kg
  },

  // 营养素列表: 基础标准(RNI/AI) + UL + 进阶标准
  // 进阶标准 = 前沿营养学激进推荐值 * 80%
  nutrients: [
    // ========== 能量 & 宏量营养素 ==========
    {
      key: 'energy',
      name: '能量',
      unit: 'kcal',
      category: 'macro',
      basicRNI: 2430,        // 减脂期目标(基于TDEE 80%)
      UL: 3000,              // 不设严格UL，以TDEE为参考上限
      advanced: 2300,        // 进阶: 更精准减脂热量(激进值2875*80%)
      icon: 'fire',
      note: '减脂期建议TDEE的75-85%，力量训练者不低于BMR'
    },
    {
      key: 'protein',
      name: '蛋白质',
      unit: 'g',
      category: 'macro',
      basicRNI: 75,          // 17岁男性RNI
      UL: null,              // 蛋白质无明确UL
      advanced: 160,         // 进阶: 1.65g/kg 力量训练减脂期(激进值200g*80%)
      icon: 'meat',
      note: '力量训练减脂期推荐1.6-2.0g/kg体重，发育期不宜过低'
    },
    {
      key: 'carbohydrate',
      name: '碳水化合物',
      unit: 'g',
      category: 'macro',
      basicRNI: 300,         // 占总能量50-65%
      UL: null,
      advanced: 270,         // 进阶: 控碳水策略(激进值337*80%)
      icon: 'wheat',
      note: '减脂期可适当控制，但力量训练者需保证训练供能'
    },
    {
      key: 'fat',
      name: '脂肪',
      unit: 'g',
      category: 'macro',
      basicRNI: 67,          // 占总能量20-30%
      UL: null,
      advanced: 55,          // 进阶: 低脂策略(激进值68*80%)
      icon: 'oil',
      note: '减脂期脂肪占比建议20-25%，注意优质脂肪来源'
    },
    {
      key: 'fiber',
      name: '膳食纤维',
      unit: 'g',
      category: 'macro',
      basicRNI: 25,          // AI
      UL: null,
      advanced: 30,          // 进阶(激进值37.5*80%)
      icon: 'leaf',
      note: '足量纤维有助减脂期饱腹感与肠道健康'
    },

    // ========== 脂溶性维生素 ==========
    {
      key: 'vitA',
      name: '维生素A',
      unit: 'μgRAE',
      category: 'fatSoluble',
      basicRNI: 800,
      UL: 3000,
      advanced: 900,         // 进阶(激进值1125*80%)
      icon: 'vitamin',
      note: '力量训练者需求略高，注意动物肝脏与深色蔬菜搭配'
    },
    {
      key: 'vitD',
      name: '维生素D',
      unit: 'μg',
      category: 'fatSoluble',
      basicRNI: 10,          // 400 IU
      UL: 50,                // 2000 IU
      advanced: 25,          // 进阶: 力量训练+减脂期需更高维D(激进值31.25*80%)
      icon: 'sun',
      note: '结合日晒时长综合评估，力量训练者维D需求更高'
    },
    {
      key: 'vitE',
      name: '维生素E',
      unit: 'mgα-TE',
      category: 'fatSoluble',
      basicRNI: 14,
      UL: 700,
      advanced: 20,          // 进阶(激进值25*80%)
      icon: 'vitamin',
      note: '抗氧化保护，减脂期自由基增多需额外补充'
    },
    {
      key: 'vitK',
      name: '维生素K',
      unit: 'μg',
      category: 'fatSoluble',
      basicRNI: 80,
      UL: null,
      advanced: 120,         // 进阶(激进值150*80%)
      icon: 'vitamin',
      note: '骨骼健康与凝血功能，深绿叶蔬菜含量丰富'
    },

    // ========== 水溶性维生素 ==========
    {
      key: 'vitB1',
      name: '维生素B1(硫胺素)',
      unit: 'mg',
      category: 'waterSoluble',
      basicRNI: 1.4,
      UL: null,
      advanced: 2.5,         // 进阶(激进值3.125*80%)
      icon: 'vitamin',
      note: '能量代谢关键辅酶，高碳水训练日需求增加'
    },
    {
      key: 'vitB2',
      name: '维生素B2(核黄素)',
      unit: 'mg',
      category: 'waterSoluble',
      basicRNI: 1.4,
      UL: null,
      advanced: 2.5,         // 进阶(激进值3.125*80%)
      icon: 'vitamin',
      note: '能量代谢与抗氧化，运动人群需求偏高'
    },
    {
      key: 'vitB6',
      name: '维生素B6',
      unit: 'mg',
      category: 'waterSoluble',
      basicRNI: 1.4,
      UL: 60,
      advanced: 3.2,         // 进阶: 蛋白质代谢需求(激进值4*80%)
      icon: 'vitamin',
      note: '高蛋白饮食者需求增加，参与蛋白质代谢'
    },
    {
      key: 'vitB12',
      name: '维生素B12',
      unit: 'μg',
      category: 'waterSoluble',
      basicRNI: 2.4,
      UL: null,
      advanced: 5,           // 进阶(激进值6.25*80%)
      icon: 'vitamin',
      note: '红细胞生成与神经功能，动物性食物为主要来源'
    },
    {
      key: 'vitC',
      name: '维生素C',
      unit: 'mg',
      category: 'waterSoluble',
      basicRNI: 100,
      UL: 2000,
      advanced: 250,         // 进阶: 抗氧化+训练恢复(激进值312*80%)
      icon: 'citrus',
      note: '抗氧化与胶原合成，力量训练后恢复需求增加'
    },
    {
      key: 'folate',
      name: '叶酸',
      unit: 'μgDFE',
      category: 'waterSoluble',
      basicRNI: 400,
      UL: 1000,
      advanced: 500,         // 进阶(激进值625*80%)
      icon: 'vitamin',
      note: '发育期细胞分裂旺盛，叶酸需求不可忽视'
    },
    {
      key: 'niacin',
      name: '烟酸',
      unit: 'mgNE',
      category: 'waterSoluble',
      basicRNI: 16,
      UL: 35,
      advanced: 25,          // 进阶(激进值31.25*80%)
      icon: 'vitamin',
      note: '能量代谢三大辅酶之一(NAD+/NADH前体)'
    },
    {
      key: 'pantothenic',
      name: '泛酸',
      unit: 'mg',
      category: 'waterSoluble',
      basicRNI: 5.0,         // AI
      UL: null,
      advanced: 10,          // 进阶(激进值12.5*80%)
      icon: 'vitamin',
      note: 'CoA前体，参与所有能量代谢通路'
    },
    {
      key: 'biotin',
      name: '生物素',
      unit: 'μg',
      category: 'waterSoluble',
      basicRNI: 40,          // AI
      UL: null,
      advanced: 60,          // 进阶(激进值75*80%)
      icon: 'vitamin',
      note: '参与脂肪酸合成与氨基酸代谢'
    },
    {
      key: 'choline',
      name: '胆碱',
      unit: 'mg',
      category: 'waterSoluble',
      basicRNI: 500,         // AI for male 14+
      UL: 3000,
      advanced: 625,         // 进阶(激进值781*80%)
      icon: 'vitamin',
      note: '神经递质与脂质代谢，力量训练者需求略高'
    },

    // ========== 矿物质 ==========
    {
      key: 'calcium',
      name: '钙',
      unit: 'mg',
      category: 'mineral',
      basicRNI: 1000,        // 17岁男性
      UL: 2000,
      advanced: 1200,       // 进阶: 发育期+力量训练骨负荷(激进值1500*80%)
      icon: 'bone',
      note: '骨骼发育关键期+力量训练骨重塑需求'
    },
    {
      key: 'phosphorus',
      name: '磷',
      unit: 'mg',
      category: 'mineral',
      basicRNI: 700,
      UL: 3500,
      advanced: 900,        // 进阶(激进值1125*80%)
      icon: 'mineral',
      note: '与钙协同维护骨骼健康'
    },
    {
      key: 'potassium',
      name: '钾',
      unit: 'mg',
      category: 'mineral',
      basicRNI: 2000,        // AI
      UL: null,
      advanced: 3500,       // 进阶: 运动排汗流失补充(激进值4375*80%)
      icon: 'banana',
      note: '运动排汗流失大，肌肉收缩与心律维持必需'
    },
    {
      key: 'sodium',
      name: '钠',
      unit: 'mg',
      category: 'mineral',
      basicRNI: 1500,        // AI
      UL: 2300,              // 预防慢病建议上限
      advanced: 1500,       // 进阶不变，钠不宜增加
      icon: 'salt',
      note: '减脂期控钠有助减少水肿，但训练出汗多需适量补充'
    },
    {
      key: 'magnesium',
      name: '镁',
      unit: 'mg',
      category: 'mineral',
      basicRNI: 370,         // 17岁男性
      UL: null,              // 食物来源无UL，补充剂有
      advanced: 500,         // 进阶: 力量训练肌肉功能(激进值625*80%)
      icon: 'mineral',
      note: '肌肉收缩放松与能量代谢，力量训练者易缺乏'
    },
    {
      key: 'iron',
      name: '铁',
      unit: 'mg',
      category: 'mineral',
      basicRNI: 16,          // 17岁男性
      UL: 42,
      advanced: 20,          // 进阶(激进值25*80%)
      icon: 'blood',
      note: '血红蛋白合成与氧气运输，训练者需求增加'
    },
    {
      key: 'zinc',
      name: '锌',
      unit: 'mg',
      category: 'mineral',
      basicRNI: 12.5,        // 17岁男性
      UL: 40,
      advanced: 20,          // 进阶: 力量训练睾酮合成(激进值25*80%)
      icon: 'mineral',
      note: '睾酮合成与免疫，力量训练+发育期需求高'
    },
    {
      key: 'selenium',
      name: '硒',
      unit: 'μg',
      category: 'mineral',
      basicRNI: 60,
      UL: 400,
      advanced: 100,         // 进阶: 抗氧化(激进值125*80%)
      icon: 'mineral',
      note: '谷胱甘肽过氧化物酶组分，抗氧化防御'
    },
    {
      key: 'copper',
      name: '铜',
      unit: 'mg',
      category: 'mineral',
      basicRNI: 0.8,
      UL: 10,
      advanced: 1.2,         // 进阶(激进值1.5*80%)
      icon: 'mineral',
      note: '铁代谢与结缔组织合成'
    },
    {
      key: 'manganese',
      name: '锰',
      unit: 'mg',
      category: 'mineral',
      basicRNI: 4.5,         // AI
      UL: 11,
      advanced: 5,           // 进阶(激进值6.25*80%)
      icon: 'mineral',
      note: '骨骼发育与代谢酶辅因子'
    },
    {
      key: 'iodine',
      name: '碘',
      unit: 'μg',
      category: 'mineral',
      basicRNI: 120,
      UL: 600,
      advanced: 150,        // 进阶(激进值187.5*80%)
      icon: 'mineral',
      note: '甲状腺激素合成，发育期代谢调节关键'
    },
    {
      key: 'molybdenum',
      name: '钼',
      unit: 'μg',
      category: 'mineral',
      basicRNI: 100,
      UL: 600,
      advanced: 120,         // 进阶(激进值150*80%)
      icon: 'mineral',
      note: '代谢酶辅因子'
    },
    {
      key: 'chromium',
      name: '铬',
      unit: 'μg',
      category: 'mineral',
      basicRNI: 30,          // AI
      UL: null,
      advanced: 50,          // 进阶: 胰岛素敏感性(激进值62.5*80%)
      icon: 'mineral',
      note: '葡萄糖耐量因子，减脂期胰岛素敏感性关键'
    },
  ],

  // 维D日晒等效换算: 四肢裸露晒太阳每10分钟 ≈ 等效维D合成约 5μg(200IU)
  // (UVB指数3+、面部+四肢暴露、无防晒)
  sunlightConversion: {
    per10Min: 5,  // μg per 10 min
    maxDaily: 25,  // 日晒贡献上限 25μg(防止过量)
    note: 'UVB指数≥3时有效，四肢裸露每10分钟约合成维D 5μg(200IU)，面部/颈部不计入'
  },

  // 长期低摄入预警阈值: 统计周期内超过一半天数低于基础标准
  longTermWarningThreshold: 0.5, // 50%

  // 获取营养素名称映射
  getNutrientName(key) {
    const n = this.nutrients.find(n => n.key === key);
    return n ? n.name : key;
  },

  // 获取营养素对象
  getNutrient(key) {
    return this.nutrients.find(n => n.key === key);
  },

  // 获取标准值
  getStandard(key, type = 'basic') {
    const n = this.nutrients.find(n => n.key === key);
    if (!n) return null;
    return type === 'basic' ? n.basicRNI : n.advanced;
  },

  // 获取UL
  getUL(key) {
    const n = this.nutrients.find(n => n.key === key);
    return n ? n.UL : null;
  }
};

// 营养素分类中文名
const CATEGORY_NAMES = {
  macro: '宏量营养素',
  fatSoluble: '脂溶性维生素',
  waterSoluble: '水溶性维生素',
  mineral: '矿物质'
};

// 营养素单位简写（用于表格紧凑展示）
const UNIT_SHORT = {
  'kcal': 'kcal',
  'g': 'g',
  'mg': 'mg',
  'μg': 'μg',
  'μgRAE': 'μgRAE',
  'mgα-TE': 'mg',
  'μgDFE': 'μg',
  'mgNE': 'mg'
};
