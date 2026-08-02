/**
 * 本地数据存储管理
 * 基于 localStorage 实现数据持久化
 * 所有饮食数据本地留存，保障隐私
 */

const Storage = {
  STORAGE_KEY: 'nutrition_workbench_data',
  PROFILE_KEY: 'nutrition_workbench_profile',
  SETTINGS_KEY: 'nutrition_workbench_settings',

  // 默认用户档案
  defaultProfile() {
    return {
      gender: 'male',
      age: 17,
      height: 173,
      weight: 97,
      activityLevel: 'moderate',
      lifeLabels: ['力量训练爱好者', '减脂期', '发育期'],
      specialGroup: null,
      targetCalories: 2430,
      targetProtein: 160,
    };
  },

  // 默认设置
  defaultSettings() {
    return {
      advancedConfirmed: false, // 进阶标准是否已确认开启
      standardMode: 'basic',    // 'basic' or 'advanced'
      dataVersion: 1,
    };
  },

  // 初始化
  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.PROFILE_KEY)) {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(this.defaultProfile()));
    }
    if (!localStorage.getItem(this.SETTINGS_KEY)) {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.defaultSettings()));
    }
  },

  // ========== 饮食记录 ==========
  getAllRecords() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
  },

  getRecord(date) {
    const all = this.getAllRecords();
    return all[date] || null;
  },

  saveRecord(date, data) {
    const all = this.getAllRecords();
    all[date] = data;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  },

  // 添加餐次
  addMeal(date, mealData) {
    const record = this.getRecord(date) || this._createEmptyRecord(date);
    mealData.id = 'meal_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    mealData.order = record.meals.length + 1;
    mealData.createdAt = new Date().toISOString();
    mealData.foods = mealData.foods || [];
    record.meals.push(mealData);
    this.saveRecord(date, record);
    return mealData;
  },

  // 更新餐次
  updateMeal(date, mealId, updates) {
    const record = this.getRecord(date);
    if (!record) return false;
    const meal = record.meals.find(m => m.id === mealId);
    if (!meal) return false;
    Object.assign(meal, updates);
    meal.updatedAt = new Date().toISOString();
    this.saveRecord(date, record);
    return true;
  },

  // 删除餐次
  deleteMeal(date, mealId) {
    const record = this.getRecord(date);
    if (!record) return false;
    record.meals = record.meals.filter(m => m.id !== mealId);
    // 重新排序
    record.meals.forEach((m, i) => { m.order = i + 1; });
    this.saveRecord(date, record);
    return true;
  },

  // 更新日晒记录
  updateSunlight(date, sunlightData) {
    const record = this.getRecord(date) || this._createEmptyRecord(date);
    record.sunlight = sunlightData;
    this.saveRecord(date, record);
  },

  // ========== 补充剂记录 ==========
  addSupplement(date, suppData) {
    const record = this.getRecord(date) || this._createEmptyRecord(date);
    suppData.id = 'supp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    suppData.createdAt = new Date().toISOString();
    suppData.nutrients = suppData.nutrients || [];
    record.supplements = record.supplements || [];
    record.supplements.push(suppData);
    this.saveRecord(date, record);
    return suppData;
  },

  deleteSupplement(date, suppId) {
    const record = this.getRecord(date);
    if (!record || !record.supplements) return false;
    record.supplements = record.supplements.filter(s => s.id !== suppId);
    this.saveRecord(date, record);
    return true;
  },

  // ========== 用户档案 ==========
  getProfile() {
    return { ...this.defaultProfile(), ...JSON.parse(localStorage.getItem(this.PROFILE_KEY) || '{}') };
  },

  saveProfile(profile) {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify({ ...this.getProfile(), ...profile }));
  },

  // ========== 设置 ==========
  getSettings() {
    return { ...this.defaultSettings(), ...JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}') };
  },

  saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify({ ...this.getSettings(), ...settings }));
  },

  // ========== 数据查询 ==========
  // 获取日期范围内的所有记录
  getRecordsInRange(startDate, endDate) {
    const all = this.getAllRecords();
    const result = {};
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      const dateStr = this._formatDate(current);
      if (all[dateStr]) {
        result[dateStr] = all[dateStr];
      }
      current.setDate(current.getDate() + 1);
    }
    return result;
  },

  // 获取最近N天的记录
  getRecentDays(days) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    return this.getRecordsInRange(this._formatDate(start), this._formatDate(end));
  },

  // 获取所有有记录的日期
  getAllDates() {
    return Object.keys(this.getAllRecords()).sort();
  },

  // ========== 内部工具 ==========
  _createEmptyRecord(date) {
    return {
      date,
      meals: [],
      sunlight: { minutes: 0, bodyParts: ['arms', 'legs'] },
      supplements: [],
    };
  },

  _formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  // 导出数据(JSON)
  exportData() {
    return JSON.stringify({
      records: this.getAllRecords(),
      profile: this.getProfile(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
    }, null, 2);
  },

  // 导入数据
  importData(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data.records) localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data.records));
      if (data.profile) localStorage.setItem(this.PROFILE_KEY, JSON.stringify(data.profile));
      if (data.settings) localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data.settings));
      return true;
    } catch (e) {
      console.error('导入数据失败:', e);
      return false;
    }
  },

  // 清除所有数据
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.init();
  }
};
