/**
 * 中国常见食物营养成分数据库
 * 数据来源: 中国食物成分表(标准版) 第6版
 * 每项数据为每100g可食部含量
 * 营养素键名与 nutrition-standards.js 保持一致
 */

const FOOD_DATABASE = {
  categories: [
    { key: 'grain', name: '谷薯类', icon: '🌾' },
    { key: 'vegetable', name: '蔬菜类', icon: '🥬' },
    { key: 'fruit', name: '水果类', icon: '🍎' },
    { key: 'meat', name: '畜肉类', icon: '🥩' },
    { key: 'poultry', name: '禽肉类', icon: '🍗' },
    { key: 'egg', name: '蛋类', icon: '🥚' },
    { key: 'seafood', name: '水产类', icon: '🐟' },
    { key: 'legume', name: '豆及豆制品', icon: '🫘' },
    { key: 'dairy', name: '奶及奶制品', icon: '🥛' },
    { key: 'nut', name: '坚果种子', icon: '🌰' },
    { key: 'mushroom', name: '菌藻类', icon: '🍄' },
    { key: 'oil', name: '油脂调味品', icon: '🫗' },
  ],

  foods: [
    // ========== 谷薯类 ==========
    { id:'rice', name:'米饭(蒸)', cat:'grain', kcal:116, protein:2.6, fat:0.3, carb:25.9, fiber:0.3, vitA:0,vitD:0,vitE:0,vitK:0,vitB1:0.02,vitB2:0.03,vitB6:0.05,vitB12:0,vitC:0,folate:3.4,niacin:0.4,calcium:7,phosphorus:62,potassium:43,sodium:1.5,magnesium:12,iron:0.3,zinc:0.5,selenium:1 },
    { id:'rice_brown', name:'糙米饭', cat:'grain', kcal:112, protein:2.7, fat:0.9, carb:23.5, fiber:1.8, vitA:0,vitD:0,vitE:0.4,vitK:0,vitB1:0.18,vitB2:0.04,vitB6:0.15,vitB12:0,vitC:0,folate:12,niacin:1.5,calcium:10,phosphorus:80,potassium:85,sodium:1.5,magnesium:35,iron:0.4,zinc:0.8,selenium:8 },
    { id:'noodle', name:'面条(煮)', cat:'grain', kcal:110, protein:3.5, fat:0.2, carb:22.6, fiber:0.4, vitA:0,vitD:0,vitE:0,vitK:0,vitB1:0.04,vitB2:0.02,vitB6:0.03,vitB12:0,vitC:0,folate:6,niacin:0.6,calcium:13,phosphorus:46,potassium:38,sodium:120,magnesium:14,iron:0.5,zinc:0.4,selenium:5 },
    { id:'bread', name:'面包(全麦)', cat:'grain', kcal:246, protein:9.5, fat:3.4, carb:44.2, fiber:6.0, vitA:0,vitD:0,vitE:1.1,vitK:0,vitB1:0.25,vitB2:0.08,vitB6:0.1,vitB12:0,vitC:0,folate:40,niacin:3.5,calcium:70,phosphorus:180,potassium:200,sodium:400,magnesium:50,iron:2.5,zinc:1.8,selenium:30 },
    { id:'oatmeal', name:'燕麦片', cat:'grain', kcal:367, protein:15, fat:6.7, carb:61, fiber:5.3, vitA:0,vitD:0,vitE:3.1,vitK:0,vitB1:0.3,vitB2:0.13,vitB6:0.1,vitB12:0,vitC:0,folate:30,niacin:1.1,calcium:186,phosphorus:291,potassium:214,sodium:3.1,magnesium:177,iron:5.8,zinc:2.6,selenium:4.2 },
    { id:'sweet_potato', name:'红薯', cat:'grain', kcal:86, protein:1.6, fat:0.1, carb:20, fiber:3.0, vitA:260,vitD:0,vitE:0.2,vitK:0,vitB1:0.05,vitB2:0.03,vitB6:0.12,vitB12:0,vitC:13,folate:12,niacin:0.6,calcium:30,phosphorus:47,potassium:337,sodium:16,magnesium:18,iron:0.5,zinc:0.2,selenium:0.5 },
    { id:'potato', name:'土豆', cat:'grain', kcal:76, protein:2, fat:0.1, carb:17, fiber:2.2, vitA:0,vitD:0,vitE:0.01,vitK:0,vitB1:0.08,vitB2:0.03,vitB6:0.27,vitB12:0,vitC:27,folate:12,niacin:1.1,calcium:12,phosphorus:40,potassium:342,sodium:2.7,magnesium:21,iron:0.3,zinc:0.3,selenium:0.4 },
    { id:'corn', name:'玉米(鲜)', cat:'grain', kcal:86, protein:3.3, fat:1.2, carb:19, fiber:2.7, vitA:22,vitD:0,vitE:0.5,vitK:0,vitB1:0.03,vitB2:0.05,vitB6:0.09,vitB12:0,vitC:6.8,folate:46,niacin:0.7,calcium:2,phosphorus:80,potassium:238,sodium:1.1,magnesium:32,iron:0.4,zinc:0.6,selenium:0.5 },
    { id:'millet', name:'小米(煮)', cat:'grain', kcal:46, protein:1.4, fat:0.3, carb:9.6, fiber:0.2, vitA:0,vitD:0,vitE:0.1,vitK:0,vitB1:0.04,vitB2:0.02,vitB6:0.04,vitB12:0,vitC:0,folate:5,niacin:0.3,calcium:4,phosphorus:22,potassium:18,sodium:0.8,magnesium:11,iron:0.4,zinc:0.2,selenium:0.5 },

    // ========== 蔬菜类 ==========
    { id:'broccoli', name:'西兰花', cat:'vegetable', kcal:34, protein:4.1, fat:0.6, carb:4.3, fiber:1.6, vitA:120,vitD:0,vitE:0.5,vitK:100,vitB1:0.09,vitB2:0.13,vitB6:0.17,vitB12:0,vitC:56,folate:58,niacin:0.6,calcium:67,phosphorus:72,potassium:17,sodium:18.8,magnesium:17,iron:1, zinc:0.3,selenium:1.8 },
    { id:'spinach', name:'菠菜', cat:'vegetable', kcal:24, protein:2.6, fat:0.3, carb:4.5, fiber:1.7, vitA:487,vitD:0,vitE:1.7,vitK:483,vitB1:0.03,vitB2:0.08,vitB6:0.15,vitB12:0,vitC:32,folate:194,niacin:0.6,calcium:66,phosphorus:47,potassium:311,sodium:85.2,magnesium:58,iron:2.9,zinc:0.53,selenium:0.97 },
    { id:'cabbage', name:'白菜', cat:'vegetable', kcal:17, protein:1.5, fat:0.1, carb:3.2, fiber:0.8, vitA:20,vitD:0,vitE:0.1,vitK:13,vitB1:0.01,vitB2:0.03,vitB6:0.04,vitB12:0,vitC:28,folate:43,niacin:0.4,calcium:50,phosphorus:31,potassium:130,sodium:57.5,magnesium:11,iron:0.5,zinc:0.3,selenium:0.3 },
    { id:'tomato', name:'番茄', cat:'vegetable', kcal:18, protein:0.9, fat:0.2, carb:3.9, fiber:1.2, vitA:42,vitD:0,vitE:0.5,vitK:5,vitB1:0.03,vitB2:0.02,vitB6:0.06,vitB12:0,vitC:19,folate:15,niacin:0.5,calcium:10,phosphorus:23,potassium:237,sodium:5.2,magnesium:9,iron:0.3,zinc:0.2,selenium:0.1 },
    { id:'carrot', name:'胡萝卜', cat:'vegetable', kcal:32, protein:1, fat:0.2, carb:8.8, fiber:2.8, vitA:835,vitD:0,vitE:0.7,vitK:13,vitB1:0.04,vitB2:0.05,vitB6:0.14,vitB12:0,vitC:9,folate:19,niacin:0.6,calcium:32,phosphorus:27,potassium:320,sodium:69,magnesium:12,iron:0.5,zinc:0.2,selenium:0.7 },
    { id:'cucumber', name:'黄瓜', cat:'vegetable', kcal:15, protein:0.8, fat:0.2, carb:2.9, fiber:0.5, vitA:5,vitD:0,vitE:0.1,vitK:0.4,vitB1:0.02,vitB2:0.01,vitB6:0.04,vitB12:0,vitC:9,folate:9,niacin:0.1,calcium:16,phosphorus:24,potassium:147,sodium:4.9,magnesium:9,iron:0.3,zinc:0.2,selenium:0.2 },
    { id:'lettuce', name:'生菜', cat:'vegetable', kcal:13, protein:1.3, fat:0.2, carb:2, fiber:0.7, vitA:166,vitD:0,vitE:0.3,vitK:24,vitB1:0.02,vitB2:0.03,vitB6:0.04,vitB12:0,vitC:10,folate:30,niacin:0.4,calcium:34,phosphorus:27,potassium:170,sodium:32.8,magnesium:12,iron:0.9,zinc:0.2,selenium:0.3 },
    { id:'cauliflower', name:'菜花', cat:'vegetable', kcal:24, protein:2.1, fat:0.2, carb:4.6, fiber:2.1, vitA:5,vitD:0,vitE:0.2,vitK:16,vitB1:0.06,vitB2:0.06,vitB6:0.17,vitB12:0,vitC:48,folate:44,niacin:0.5,calcium:23,phosphorus:47,potassium:200,sodium:31.6,magnesium:15,iron:0.5,zinc:0.3,selenium:0.9 },
    { id:'green_pepper', name:'青椒', cat:'vegetable', kcal:22, protein:1, fat:0.2, carb:5.4, fiber:1.4, vitA:18,vitD:0,vitE:0.6,vitK:7.4,vitB1:0.03,vitB2:0.03,vitB6:0.17,vitB12:0,vitC:72,folate:10,niacin:0.6,calcium:14,phosphorus:20,potassium:142,sodium:3.3,magnesium:12,iron:0.8,zinc:0.2,selenium:0.2 },
    { id:'eggplant', name:'茄子', cat:'vegetable', kcal:21, protein:1.1, fat:0.2, carb:4.9, fiber:1.3, vitA:8,vitD:0,vitE:0.2,vitK:3,vitB1:0.02,vitB2:0.04,vitB6:0.08,vitB12:0,vitC:5,folate:22,niacin:0.6,calcium:24,phosphorus:23,potassium:230,sodium:5.4,magnesium:13,iron:0.5,zinc:0.2,selenium:0.3 },
    { id:'onion', name:'洋葱', cat:'vegetable', kcal:39, protein:1.1, fat:0.2, carb:9, fiber:0.9, vitA:3,vitD:0,vitE:0.1,vitK:0.4,vitB1:0.03,vitB2:0.01,vitB6:0.12,vitB12:0,vitC:7.4,folate:19,niacin:0.2,calcium:24,phosphorus:39,potassium:147,sodium:4.7,magnesium:10,iron:0.2,zinc:0.2,selenium:0.6 },
    { id:'garlic', name:'大蒜', cat:'vegetable', kcal:126, protein:4.5, fat:0.2, carb:27.6, fiber:1.1, vitA:3,vitD:0,vitE:0.1,vitK:0,vitB1:0.04,vitB2:0.06,vitB6:1.24,vitB12:0,vitC:7,folate:3,niacin:0.7,calcium:39,phosphorus:117,potassium:302,sodium:19.6,magnesium:21,iron:1.2,zinc:0.9,selenium:3.1 },
    { id:'pumpkin', name:'南瓜', cat:'vegetable', kcal:22, protein:0.7, fat:0.1, carb:5.3, fiber:0.8, vitA:148,vitD:0,vitE:0.4,vitK:1,vitB1:0.03,vitB2:0.02,vitB6:0.06,vitB12:0,vitC:8,folate:16,niacin:0.4,calcium:21,phosphorus:44,potassium:340,sodium:2.3,magnesium:12,iron:0.4,zinc:0.2,selenium:0.4 },
    { id:'bok_choy', name:'油菜', cat:'vegetable', kcal:14, protein:1.8, fat:0.5, carb:2.3, fiber:1.1, vitA:103,vitD:0,vitE:0.5,vitK:28,vitB1:0.04,vitB2:0.05,vitB6:0.06,vitB12:0,vitC:36,folate:46,niacin:0.5,calcium:108,phosphorus:39,potassium:210,sodium:73.7,magnesium:22,iron:1.4,zinc:0.3,selenium:0.4 },

    // ========== 水果类 ==========
    { id:'apple', name:'苹果', cat:'fruit', kcal:52, protein:0.3, fat:0.2, carb:13.8, fiber:2.4, vitA:3,vitD:0,vitE:0.2,vitK:2.2,vitB1:0.02,vitB2:0.02,vitB6:0.04,vitB12:0,vitC:4.6,folate:3,niacin:0.1,calcium:6,phosphorus:11,potassium:107,sodium:1,magnesium:5,iron:0.1,zinc:0.04,selenium:0 },
    { id:'banana', name:'香蕉', cat:'fruit', kcal:89, protein:1.1, fat:0.3, carb:22.8, fiber:2.6, vitA:3,vitD:0,vitE:0.1,vitK:0.5,vitB1:0.03,vitB2:0.07,vitB6:0.37,vitB12:0,vitC:8.7,folate:20,niacin:0.7,calcium:5,phosphorus:22,potassium:358,sodium:1,magnesium:27,iron:0.3,zinc:0.2,selenium:1 },
    { id:'orange', name:'橙子', cat:'fruit', kcal:47, protein:0.9, fat:0.1, carb:11.8, fiber:2.4, vitA:11,vitD:0,vitE:0.2,vitK:0,vitB1:0.09,vitB2:0.03,vitB6:0.06,vitB12:0,vitC:53.2,folate:30,niacin:0.3,calcium:40,phosphorus:14,potassium:181,sodium:0,magnesium:10,iron:0.1,zinc:0.07,selenium:0 },
    { id:'strawberry', name:'草莓', cat:'fruit', kcal:32, protein:0.7, fat:0.3, carb:7.7, fiber:2, vitA:1,vitD:0,vitE:0.3,vitK:2.2,vitB1:0.02,vitB2:0.02,vitB6:0.06,vitB12:0,vitC:58.8,folate:24,niacin:0.4,calcium:16,phosphorus:24,potassium:153,sodium:1,magnesium:13,iron:0.4,zinc:0.1,selenium:0.4 },
    { id:'grape', name:'葡萄', cat:'fruit', kcal:67, protein:0.6, fat:0.2, carb:17, fiber:0.9, vitA:3,vitD:0,vitE:0.2,vitK:14.6,vitB1:0.07,vitB2:0.03,vitB6:0.09,vitB12:0,vitC:3.2,folate:2,niacin:0.2,calcium:10,phosphorus:10,potassium:191,sodium:0.4,magnesium:7,iron:0.4,zinc:0.1,selenium:0.1 },
    { id:'watermelon', name:'西瓜', cat:'fruit', kcal:30, protein:0.6, fat:0.2, carb:7.6, fiber:0.4, vitA:28,vitD:0,vitE:0.1,vitK:0.1,vitB1:0.01,vitB2:0.02,vitB6:0.05,vitB12:0,vitC:8.1,folate:3,niacin:0.1,calcium:7,phosphorus:11,potassium:112,sodium:1,magnesium:10,iron:0.2,zinc:0.1,selenium:0.1 },
    { id:'kiwi', name:'猕猴桃', cat:'fruit', kcal:61, protein:0.8, fat:0.6, carb:14.7, fiber:3, vitA:4,vitD:0,vitE:1.5,vitK:40,vitB1:0.03,vitB2:0.02,vitB6:0.06,vitB12:0,vitC:92.7,folate:25,niacin:0.3,calcium:34,phosphorus:34,potassium:312,sodium:3,magnesium:12,iron:0.2,zinc:0.1,selenium:0.2 },
    { id:'blueberry', name:'蓝莓', cat:'fruit', kcal:57, protein:0.7, fat:0.3, carb:14.5, fiber:2.4, vitA:3,vitD:0,vitE:0.6,vitK:19,vitB1:0.04,vitB2:0.04,vitB6:0.05,vitB12:0,vitC:9.7,folate:6,niacin:0.4,calcium:6,phosphorus:12,potassium:77,sodium:1,magnesium:6,iron:0.3,zinc:0.2,selenium:0.1 },
    { id:'mango', name:'芒果', cat:'fruit', kcal:60, protein:0.8, fat:0.4, carb:15, fiber:1.6, vitA:54,vitD:0,vitE:1.1,vitK:4.2,vitB1:0.03,vitB2:0.04,vitB6:0.13,vitB12:0,vitC:36.4,folate:43,niacin:0.4,calcium:11,phosphorus:14,potassium:168,sodium:1,magnesium:10,iron:0.2,zinc:0.1,selenium:0.6 },

    // ========== 畜肉类 ==========
    { id:'chicken_breast', name:'鸡胸肉', cat:'poultry', kcal:133, protein:31, fat:1.2, carb:0, fiber:0, vitA:9,vitD:0.3,vitE:0.2,vitK:0,vitB1:0.07,vitB2:0.12,vitB6:0.5,vitB12:0.3,vitC:0,folate:4,niacin:13.2,calcium:9,phosphorus:210,potassium:256,sodium:34,magnesium:28,iron:0.6,zinc:0.9,selenium:22 },
    { id:'beef_lean', name:'瘦牛肉', cat:'meat', kcal:125, protein:20, fat:4.5, carb:0, fiber:0, vitA:0,vitD:0.5,vitE:0.3,vitK:0,vitB1:0.05,vitB2:0.18,vitB6:0.4,vitB12:2.6,vitC:0,folate:6,niacin:4.5,calcium:9,phosphorus:200,potassium:216,sodium:57,magnesium:21,iron:2.8,zinc:4.3,selenium:20 },
    { id:'pork_lean', name:'瘦猪肉', cat:'meat', kcal:143, protein:20, fat:6.2, carb:0, fiber:0, vitA:5,vitD:0.5,vitE:0.3,vitK:0,vitB1:0.87,vitB2:0.16,vitB6:0.4,vitB12:0.8,vitC:0,folate:5,niacin:3.5,calcium:6,phosphorus:189,potassium:242,sodium:57,magnesium:19,iron:1.5,zinc:3,selenium:12 },
    { id:'lamb', name:'羊肉', cat:'meat', kcal:118, protein:20, fat:3.9, carb:0, fiber:0, vitA:7,vitD:0,vitE:0.2,vitK:0,vitB1:0.05,vitB2:0.15,vitB6:0.2,vitB12:2,vitC:0,folate:3,niacin:4.5,calcium:6,phosphorus:190,potassium:232,sodium:69,magnesium:18,iron:2,zinc:3,selenium:15 },
    { id:'pork_belly', name:'五花肉', cat:'meat', kcal:349, protein:7.3, fat:35, carb:0, fiber:0, vitA:11,vitD:0.6,vitE:0.4,vitK:0,vitB1:0.19,vitB2:0.11,vitB6:0.2,vitB12:0.5,vitC:0,folate:1,niacin:1.8,calcium:6,phosphorus:120,potassium:158,sodium:51,magnesium:12,iron:0.8,zinc:1.3,selenium:10 },
    { id:'beef_steak', name:'牛排', cat:'meat', kcal:217, protein:26, fat:12, carb:0, fiber:0, vitA:0,vitD:0.5,vitE:0.3,vitK:0,vitB1:0.06,vitB2:0.21,vitB6:0.45,vitB12:2.8,vitC:0,folate:7,niacin:5,calcium:10,phosphorus:220,potassium:250,sodium:60,magnesium:25,iron:3,zinc:5,selenium:25 },

    // ========== 禽肉类 ==========
    { id:'chicken_thigh', name:'鸡腿肉', cat:'poultry', kcal:181, protein:16, fat:13, carb:0, fiber:0, vitA:15,vitD:0.3,vitE:0.3,vitK:0,vitB1:0.05,vitB2:0.1,vitB6:0.3,vitB12:0.3,vitC:0,folate:5,niacin:6,calcium:10,phosphorus:160,potassium:200,sodium:60,magnesium:20,iron:0.8,zinc:1.1,selenium:18 },
    { id:'duck', name:'鸭肉', cat:'poultry', kcal:240, protein:15, fat:19, carb:0, fiber:0, vitA:14,vitD:0.5,vitE:0.4,vitK:0,vitB1:0.08,vitB2:0.15,vitB6:0.25,vitB12:0.3,vitC:0,folate:10,niacin:4,calcium:6,phosphorus:145,potassium:191,sodium:69,magnesium:14,iron:1.4,zinc:1.2,selenium:13 },

    // ========== 蛋类 ==========
    { id:'egg', name:'鸡蛋', cat:'egg', kcal:144, protein:13.3, fat:8.8, carb:2.8, fiber:0, vitA:234,vitD:2,vitE:1.1,vitK:0,vitB1:0.11,vitB2:0.27,vitB6:0.13,vitB12:0.56,vitC:0,folate:70,niacin:0.2,calcium:56,phosphorus:130,potassium:154,sodium:131.5,magnesium:10,iron:2,selenium:14.3 },
    { id:'egg_white', name:'蛋白', cat:'egg', kcal:48, protein:11.6, fat:0.1, carb:0.8, fiber:0, vitA:0,vitD:0,vitE:0,vitK:0,vitB1:0.04,vitB2:0.15,vitB6:0.02,vitB12:0.1,vitC:0,folate:4,niacin:0.1,calcium:9,phosphorus:11,potassium:139,sodium:166,magnesium:9,iron:0.1,zinc:0.03,selenium:6 },
    { id:'duck_egg', name:'鸭蛋', cat:'egg', kcal:180, protein:12.6, fat:13, carb:3.1, fiber:0, vitA:261,vitD:2.5,vitE:4.5,vitK:0,vitB1:0.13,vitB2:0.28,vitB6:0.1,vitB12:0.5,vitC:0,folate:80,niacin:0.3,calcium:62,phosphorus:226,potassium:135,sodium:106,magnesium:13,iron:2.9,zinc:1.6,selenium:15 },

    // ========== 水产类 ==========
    { id:'salmon', name:'三文鱼', cat:'seafood', kcal:139, protein:17, fat:7.8, carb:0, fiber:0, vitA:12,vitD:11,vitE:3.5,vitK:0,vitB1:0.07,vitB2:0.18,vitB6:0.6,vitB12:3.2,vitC:0,folate:5,niacin:6,calcium:9,phosphorus:170,potassium:363,sodium:59,magnesium:27,iron:0.3,zinc:0.5,selenium:25 },
    { id:'tuna', name:'金枪鱼', cat:'seafood', kcal:144, protein:23, fat:4, carb:0, fiber:0, vitA:18,vitD:1,vitE:2,vitK:0,vitB1:0.12,vitB2:0.13,vitB6:0.5,vitB12:2.5,vitC:0,folate:2,niacin:8.7,calcium:4,phosphorus:230,potassium:252,sodium:39,magnesium:27,iron:1,zinc:0.9,selenium:43 },
    { id:'shrimp', name:'虾', cat:'seafood', kcal:87, protein:18, fat:0.7, carb:0, fiber:0, vitA:15,vitD:0.5,vitE:2.4,vitK:0,vitB1:0.01,vitB2:0.07,vitB6:0.1,vitB12:0.5,vitC:0,folate:12,niacin:2.6,calcium:62,phosphorus:215,potassium:215,sodium:165,magnesium:24,iron:0.6,zinc:1.1,selenium:17 },
    { id:'tilapia', name:'罗非鱼', cat:'seafood', kcal:98, protein:18, fat:1.5, carb:0, fiber:0, vitA:0,vitD:0.5,vitE:0.5,vitK:0,vitB1:0.1,vitB2:0.07,vitB6:0.2,vitB12:1.5,vitC:0,folate:15,niacin:3,calcium:10,phosphorus:170,potassium:220,sodium:50,magnesium:27,iron:0.6,zinc:0.5,selenium:20 },
    { id:'squid', name:'鱿鱼', cat:'seafood', kcal:92, protein:17, fat:1.3, carb:0, fiber:0, vitA:15,vitD:0,vitE:1,vitK:0,vitB1:0.03,vitB2:0.06,vitB6:0.2,vitB12:0.5,vitC:0,folate:10,niacin:3,calcium:32,phosphorus:150,potassium:201,sodium:165,magnesium:22,iron:0.5,zinc:1.5,selenium:13 },
    { id:'oyster', name:'生蚝', cat:'seafood', kcal:73, protein:5.3, fat:2.1, carb:8.2, fiber:0, vitA:50,vitD:0,vitE:0.5,vitK:0,vitB1:0.05,vitB2:0.1,vitB6:0.05,vitB12:16,vitC:7,folate:10,niacin:1,calcium:35,phosphorus:93,potassium:168,sodium:270,magnesium:10,iron:5.7,zinc:71.2,selenium:50 },

    // ========== 豆及豆制品 ==========
    { id:'tofu', name:'豆腐(北)', cat:'legume', kcal:98, protein:12.2, fat:4.8, carb:1.5, fiber:0.4, vitA:0,vitD:0,vitE:0.7,vitK:0,vitB1:0.05,vitB2:0.04,vitB6:0.1,vitB12:0,vitC:0,folate:15,niacin:0.3,calcium:138,phosphorus:158,potassium:106,sodium:7.3,magnesium:63,iron:1.5,zinc:1,selenium:1.2 },
    { id:'soybean', name:'黄豆', cat:'legume', kcal:390, protein:35, fat:16, carb:34, fiber:15.5, vitA:5,vitD:0,vitE:18.9,vitK:37,vitB1:0.41,vitB2:0.2,vitB6:0.4,vitB12:0,vitC:0,folate:130,niacin:2.1,calcium:191,phosphorus:465,potassium:1503,sodium:2.2,magnesium:199,iron:8.2,zinc:3.3,selenium:6.2 },
    { id:'tofu_skin', name:'豆腐皮', cat:'legume', kcal:409, protein:44, fat:17, carb:19, fiber:0.2, vitA:0,vitD:0,vitE:5,vitK:0,vitB1:0.04,vitB2:0.1,vitB6:0.1,vitB12:0,vitC:0,folate:20,niacin:0.3,calcium:116,phosphorus:318,potassium:42,sodium:26,magnesium:149,iron:6.9,zinc:2.5,selenium:1.8 },
    { id:'soymilk', name:'豆浆', cat:'legume', kcal:31, protein:3, fat:1.6, carb:1.2, fiber:0.4, vitA:0,vitD:0,vitE:0.3,vitK:0,vitB1:0.02,vitB2:0.02,vitB6:0.05,vitB12:0,vitC:0,folate:10,niacin:0.1,calcium:10,phosphorus:30,potassium:48,sodium:3,magnesium:9,iron:0.4,zinc:0.2,selenium:0.3 },
    { id:'mung_bean', name:'绿豆', cat:'legume', kcal:329, protein:21, fat:0.8, carb:62, fiber:6.4, vitA:3,vitD:0,vitE:1,vitK:0,vitB1:0.25,vitB2:0.11,vitB6:0.3,vitB12:0,vitC:0,folate:100,niacin:2,calcium:81,phosphorus:337,potassium:787,sodium:3.2,magnesium:125,iron:6.5,zinc:2.2,selenium:4.3 },
    { id:'chickpea', name:'鹰嘴豆', cat:'legume', kcal:364, protein:19, fat:6, carb:61, fiber:17, vitA:1,vitD:0,vitE:0.8,vitK:4,vitB1:0.28,vitB2:0.12,vitB6:0.4,vitB12:0,vitC:1.3,folate:172,niacin:1.3,calcium:49,phosphorus:299,potassium:291,sodium:7,magnesium:48,iron:2.9,zinc:2.9,selenium:4.3 },

    // ========== 奶及奶制品 ==========
    { id:'milk', name:'牛奶', cat:'dairy', kcal:54, protein:3, fat:3.2, carb:3.4, fiber:0, vitA:24,vitD:1.2,vitE:0.2,vitK:0,vitB1:0.03,vitB2:0.14,vitB6:0.04,vitB12:0.4,vitC:1,folate:5,niacin:0.1,calcium:104,phosphorus:73,potassium:109,sodium:37.2,magnesium:11,iron:0.1,zinc:0.4,selenium:3.1 },
    { id:'greek_yogurt', name:'希腊酸奶', cat:'dairy', kcal:97, protein:9, fat:5, carb:4, fiber:0, vitA:30,vitD:1.5,vitE:0.3,vitK:0,vitB1:0.05,vitB2:0.2,vitB6:0.05,vitB12:0.8,vitC:0,folate:8,niacin:0.2,calcium:100,phosphorus:95,potassium:141,sodium:46,magnesium:11,iron:0.1,zinc:0.5,selenium:5 },
    { id:'cheese', name:'奶酪', cat:'dairy', kcal:328, protein:26, fat:24, carb:2.5, fiber:0, vitA:207,vitD:0.5,vitE:0.7,vitK:2.4,vitB1:0.03,vitB2:0.32,vitB6:0.06,vitB12:1.1,vitC:0,folate:10,niacin:0.1,calcium:525,phosphorus:340,potassium:74,sodium:584,magnesium:28,iron:0.2,zinc:3.1,selenium:9 },

    // ========== 坚果种子 ==========
    { id:'almond', name:'杏仁', cat:'nut', kcal:578, protein:21, fat:50, carb:22, fiber:12.5, vitA:1,vitD:0,vitE:25.6,vitK:0,vitB1:0.21,vitB2:0.62,vitB6:0.14,vitB12:0,vitC:0,folate:44,niacin:3,calcium:269,phosphorus:481,potassium:733,sodium:1,magnesium:270,iron:3.7,zinc:3.1,selenium:1.2 },
    { id:'walnut', name:'核桃', cat:'nut', kcal:654, protein:15, fat:65, carb:14, fiber:6.7, vitA:1,vitD:0,vitE:1.5,vitK:2.9,vitB1:0.34,vitB2:0.15,vitB6:0.54,vitB12:0,vitC:1.3,folate:98,niacin:1.1,calcium:98,phosphorus:346,potassium:441,sodium:2,magnesium:121,iron:2.9,zinc:3.1,selenium:4.6 },
    { id:'peanut', name:'花生', cat:'nut', kcal:567, protein:26, fat:49, carb:16, fiber:8.5, vitA:0,vitD:0,vitE:8.3,vitK:0,vitB1:0.64,vitB2:0.14,vitB6:0.35,vitB12:0,vitC:0,folate:240,niacin:12,calcium:92,phosphorus:376,potassium:705,sodium:18,magnesium:168,iron:4.6,zinc:3.3,selenium:7.2 },
    { id:'sunflower_seed', name:'葵花籽', cat:'nut', kcal:584, protein:21, fat:51, carb:20, fiber:8.6, vitA:3,vitD:0,vitE:35.2,vitK:0,vitB1:1.48,vitB2:0.36,vitB6:1.34,vitB12:0,vitC:1.4,folate:227,niacin:8.3,calcium:78,phosphorus:660,potassium:689,sodium:5.4,magnesium:325,iron:5.3,zinc:5,selenium:53 },
    { id:'chia_seed', name:'奇亚籽', cat:'nut', kcal:486, protein:17, fat:31, carb:42, fiber:34, vitA:3,vitD:0,vitE:0.5,vitK:0,vitB1:0.62,vitB2:0.17,vitB6:0.17,vitB12:0,vitC:1.6,folate:49,niacin:8.8,calcium:631,phosphorus:948,potassium:407,sodium:16,magnesium:335,iron:7.7,zinc:4.6,selenium:25 },
    { id:'cashew', name:'腰果', cat:'nut', kcal:553, protein:18, fat:44, carb:30, fiber:3.3, vitA:0,vitD:0,vitE:0.9,vitK:34.1,vitB1:0.42,vitB2:0.06,vitB6:0.42,vitB12:0,vitC:0.5,folate:25,niacin:1.4,calcium:37,phosphorus:593,potassium:660,sodium:12,magnesium:292,iron:6.7,zinc:5.8,selenium:19.9 },

    // ========== 菌藻类 ==========
    { id:'shiitake', name:'香菇(鲜)', cat:'mushroom', kcal:26, protein:2.2, fat:0.3, carb:5.2, fiber:3.3, vitA:0,vitD:0.5,vitE:0,vitK:0,vitB1:0.02,vitB2:0.05,vitB6:0.04,vitB12:0,vitC:1,folate:30,niacin:1.2,calcium:2,phosphorus:30,potassium:20,sodium:1.4,magnesium:11,iron:0.3,zinc:0.3,selenium:2.6 },
    { id:'shiitake_dried', name:'香菇(干)', cat:'mushroom', kcal:274, protein:20, fat:1.2, carb:61, fiber:31, vitA:3,vitD:18,vitE:0.7,vitK:0,vitB1:0.19,vitB2:1.4,vitB6:0.4,vitB12:0,vitC:5,folate:240,niacin:17,calcium:83,phosphorus:258,potassium:2576,sodium:9.4,magnesium:147,iron:10.5,zinc:8.6,selenium:6.4 },
    { id:'enoki', name:'金针菇', cat:'mushroom', kcal:26, protein:2.4, fat:0.4, carb:6, fiber:2.7, vitA:0,vitD:0,vitE:0,vitK:0,vitB1:0.02,vitB2:0.05,vitB6:0.05,vitB12:0,vitC:2,folate:30,niacin:4.1,calcium:2,phosphorus:43,potassium:195,sodium:4.3,magnesium:17,iron:1,zinc:0.4,selenium:2.4 },
    { id:'kelp', name:'海带', cat:'mushroom', kcal:13, protein:1.2, fat:0.1, carb:2.1, fiber:0.5, vitA:0,vitD:0,vitE:0.1,vitK:0,vitB1:0.01,vitB2:0.1,vitB6:0,vitB12:0,vitC:0,folate:1,niacin:0.4,calcium:134,phosphorus:30,potassium:246,sodium:8,magnesium:25,iron:0.4,zinc:0.2,selenium:5 },
    { id:'nori', name:'紫菜', cat:'mushroom', kcal:207, protein:26, fat:1.1, carb:44, fiber:21.6, vitA:12,vitD:0,vitE:1,vitK:0,vitB1:0.27,vitB2:1,vitB6:0.1,vitB12:0,vitC:2,folate:116,niacin:7,calcium:264,phosphorus:350,potassium:1796,sodium:710,magnesium:105,iron:54.9,zinc:2.5,selenium:7.2 },
    { id:'wood_ear', name:'黑木耳', cat:'mushroom', kcal:205, protein:12, fat:1.5, carb:65, fiber:29, vitA:17,vitD:0,vitE:0.5,vitK:0,vitB1:0.17,vitB2:0.44,vitB6:0.1,vitB12:0,vitC:0,folate:38,niacin:2.5,calcium:247,phosphorus:201,potassium:757,sodium:48.5,magnesium:152,iron:97.4,zinc:3.2,selenium:3.7 },

    // ========== 油脂调味品 ==========
    { id:'olive_oil', name:'橄榄油', cat:'oil', kcal:899, protein:0, fat:99.8, carb:0, fiber:0, vitA:0,vitD:0,vitE:14.4,vitK:60,vitB1:0,vitB2:0,vitB6:0,vitB12:0,vitC:0,folate:0,niacin:0,calcium:0,phosphorus:0,potassium:0,sodium:0,magnesium:0,iron:0,zinc:0,selenium:0 },
    { id:'soy_sauce', name:'酱油', cat:'oil', kcal:53, protein:8, fat:0.6, carb:4.9, fiber:0.8, vitA:0,vitD:0,vitE:0,vitK:0,vitB1:0.03,vitB2:0.13,vitB6:0.1,vitB12:0,vitC:0,folate:15,niacin:1.4,calcium:66,phosphorus:204,potassium:337,sodium:5757,magnesium:41,iron:1.3,zinc:0.5,selenium:2 },
    { id:'sesame_oil', name:'香油', cat:'oil', kcal:898, protein:0, fat:99.7, carb:0.2, fiber:0, vitA:0,vitD:0,vitE:68.5,vitK:0,vitB1:0,vitB2:0,vitB6:0,vitB12:0,vitC:0,folate:0,niacin:0,calcium:9,phosphorus:4,potassium:5,sodium:1.4,magnesium:3,iron:0.5,zinc:0.6,selenium:0 },
    { id:'honey', name:'蜂蜜', cat:'oil', kcal:321, protein:0.4, fat:1.9, carb:75, fiber:0, vitA:0,vitD:0,vitE:0,vitK:0,vitB1:0,vitB2:0.05,vitB6:0.02,vitB12:0,vitC:3,folate:0,niacin:0.1,calcium:4,phosphorus:3,potassium:28,sodium:0.3,magnesium:2,iron:1,zinc:0.1,selenium:0.5 },
  ],

  // 根据ID获取食物
  getFood(id) {
    return this.foods.find(f => f.id === id);
  },

  // 根据类别获取食物列表
  getByCategory(cat) {
    return this.foods.filter(f => f.cat === cat);
  },

  // 搜索食物
  search(keyword) {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return [];
    return this.foods.filter(f => f.name.toLowerCase().includes(kw) || f.id.includes(kw));
  },

  // 获取食物的营养素对象(标准化字段名)
  getNutritionForFood(foodId, weightGrams) {
    const food = this.getFood(foodId);
    if (!food) return null;
    const ratio = weightGrams / 100;
    return {
      energy: (food.kcal || 0) * ratio,
      protein: (food.protein || 0) * ratio,
      fat: (food.fat || 0) * ratio,
      carbohydrate: (food.carb || 0) * ratio,
      fiber: (food.fiber || 0) * ratio,
      vitA: (food.vitA || 0) * ratio,
      vitD: (food.vitD || 0) * ratio,
      vitE: (food.vitE || 0) * ratio,
      vitK: (food.vitK || 0) * ratio,
      vitB1: (food.vitB1 || 0) * ratio,
      vitB2: (food.vitB2 || 0) * ratio,
      vitB6: (food.vitB6 || 0) * ratio,
      vitB12: (food.vitB12 || 0) * ratio,
      vitC: (food.vitC || 0) * ratio,
      folate: (food.folate || 0) * ratio,
      niacin: (food.niacin || 0) * ratio,
      pantothenic: 0,
      biotin: 0,
      choline: 0,
      calcium: (food.calcium || 0) * ratio,
      phosphorus: (food.phosphorus || 0) * ratio,
      potassium: (food.potassium || 0) * ratio,
      sodium: (food.sodium || 0) * ratio,
      magnesium: (food.magnesium || 0) * ratio,
      iron: (food.iron || 0) * ratio,
      zinc: (food.zinc || 0) * ratio,
      selenium: (food.selenium || 0) * ratio,
      copper: 0,
      manganese: 0,
      iodine: 0,
      molybdenum: 0,
      chromium: 0,
    };
  },

  // 猜测食物(用于模拟AI识别 - 基于关键词)
  guessFoodByKeyword(keyword) {
    const kw = keyword.trim().toLowerCase();
    const result = this.foods.filter(f =>
      f.name.toLowerCase().includes(kw) || f.id.includes(kw) ||
      this.getCategoryName(f.cat).includes(kw)
    );
    return result.slice(0, 5);
  },

  getCategoryName(catKey) {
    const c = this.categories.find(c => c.key === catKey);
    return c ? c.name : '';
  }
};
