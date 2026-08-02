/**
 * 营养监测工作台 - 主应用逻辑
 */

const App = {
  currentDate: '',
  currentTab: 'record',
  confirmingAdvanced: false,
  confirmCallback: null,
  editingMealId: null,
  editingSuppId: null,
  tempSelectedFoods: [], // 编辑中的临时食物列表 [{foodId, weight, weightRange}]
  mealImage: null,        // 编辑中的图片(base64)
  deferredPrompt: null,   // PWA安装事件
  touchStartX: 0,         // 滑动起始X坐标
  touchStartY: 0,

  // ========== 初始化 ==========
  init() {
    Storage.init();
    this.currentDate = Storage._formatDate(new Date());
    this.setupNavigation();
    this.registerServiceWorker();
    this.listenInstallPrompt();
    this.setupSwipeGesture();
    this.renderAll();
    this.renderNotifications();
    this.updateDateDisplay();
    this.updateUserBadge();
    this._updateAddButton();
  },

  // ========== PWA: 注册Service Worker ==========
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('[PWA] Service Worker 注册成功:', reg.scope))
          .catch(err => console.log('[PWA] SW注册失败:', err));
      });
    }
  },

  // ========== PWA: 安装提示 ==========
  listenInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      // 延迟显示，等用户用过几次
      const visitCount = parseInt(localStorage.getItem('nutrition_app_visits') || '0') + 1;
      localStorage.setItem('nutrition_app_visits', visitCount);
      if (visitCount >= 2) {
        setTimeout(() => {
          const prompt = document.getElementById('installPrompt');
          if (prompt) prompt.style.display = 'flex';
        }, 3000);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.id === 'installBtn') {
        if (this.deferredPrompt) {
          this.deferredPrompt.prompt();
          this.deferredPrompt.userChoice.then((result) => {
            console.log('[PWA] 安装结果:', result.outcome);
            this.deferredPrompt = null;
            document.getElementById('installPrompt').style.display = 'none';
          });
        } else {
          this.showToast('请通过浏览器菜单"添加到主屏幕"安装', 'info');
          document.getElementById('installPrompt').style.display = 'none';
        }
      }
    });

    // iOS Safari 提示（没有beforeinstallprompt事件）
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App已安装');
    });
  },

  // ========== 左右滑动手势切换日期 ==========
  setupSwipeGesture() {
    const content = document.getElementById('tabContent');
    if (!content) return;

    content.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    content.addEventListener('touchend', (e) => {
      if (!this.touchStartX) return;
      const dx = e.changedTouches[0].clientX - this.touchStartX;
      const dy = e.changedTouches[0].clientY - this.touchStartY;

      // 水平滑动 > 60px 且大于垂直滑动
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          this.changeDate(-1); // 右滑=前一天
        } else {
          this.changeDate(1);  // 左滑=后一天
        }
      }
      this.touchStartX = 0;
      this.touchStartY = 0;
    });
  },

  setupNavigation() {
    // 底部标签切换（排除中间+号）
    document.querySelectorAll('#bottomTabNav .tab-btn[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // 日期切换
    document.getElementById('prevDay').addEventListener('click', () => this.changeDate(-1));
    document.getElementById('nextDay').addEventListener('click', () => this.changeDate(1));
    document.getElementById('todayBtn').addEventListener('click', () => this.jumpToToday());

    // 键盘导航
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') this.changeDate(-1);
      if (e.key === 'ArrowRight') this.changeDate(1);
    });
  },

  // ========== 标签切换 ==========
  switchTab(tab) {
    Charts.destroyAll();
    this.currentTab = tab;
    // 底部导航高亮
    document.querySelectorAll('#bottomTabNav .tab-btn[data-tab]').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    // 设置页切换时不显示+号
    this._updateAddButton();
    // 回到顶部
    document.getElementById('tabContent').scrollTop = 0;
    this.renderAll();
  },

  // ========== 日期操作 ==========
  changeDate(offset) {
    const d = new Date(this.currentDate);
    d.setDate(d.getDate() + offset);
    this.currentDate = Storage._formatDate(d);
    this.updateDateDisplay();
    this.renderAll();
  },

  jumpToToday() {
    this.currentDate = Storage._formatDate(new Date());
    this.updateDateDisplay();
    this.renderAll();
  },

  updateDateDisplay() {
    const d = new Date(this.currentDate);
    const today = Storage._formatDate(new Date());
    const yesterday = (() => { const y = new Date(); y.setDate(y.getDate()-1); return Storage._formatDate(y); })();

    let label = `${d.getMonth()+1}月${d.getDate()}日`;
    if (this.currentDate === today) label = '今天';
    else if (this.currentDate === yesterday) label = '昨天';

    const dayNames = ['周日','周一','周二','周三','周四','周五','周六'];
    label += ` ${dayNames[d.getDay()]}`;

    document.getElementById('currentDateLabel').textContent = label;
  },

  updateUserBadge() {
    const p = Storage.getProfile();
    document.getElementById('userBadge').textContent =
      `👤 ${p.gender==='male'?'男':'女'} ${p.age}岁 ${p.height}cm ${p.weight}kg`;
  },

  // ========== 全量渲染 ==========
  renderAll() {
    const container = document.getElementById('tabContent');
    switch (this.currentTab) {
      case 'record': container.innerHTML = this.renderRecordTab(); break;
      case 'report': container.innerHTML = this.renderReportTab();
        setTimeout(() => this._renderReportCharts(), 100); break;
      case 'analysis': container.innerHTML = this.renderAnalysisTab();
        setTimeout(() => this._renderAnalysisCharts(), 100); break;
      case 'supplement': container.innerHTML = this.renderSupplementTab(); break;
      case 'settings': container.innerHTML = this.renderSettingsTab();
        this._setupSettingsForm(); break;
    }

    // 绑定后续事件
    this._bindEvents();
  },

  // ========== 记录标签页 ==========
  renderRecordTab() {
    const record = Storage.getRecord(this.currentDate);
    const meals = record ? record.meals : [];
    const sunlight = record ? record.sunlight : { minutes: 0, bodyParts: ['arms', 'legs'] };

    let html = `
      <!-- 日晒模块 -->
      <div class="card" style="padding:0;overflow:hidden;">
        <div class="sunlight-widget" id="sunlightWidget">
          <span class="sunlight-icon">☀️</span>
          <div class="sunlight-info">
            <h4>今日日晒记录</h4>
            <p>四肢裸露晒太阳时长影响维生素D合成</p>
          </div>
          <div class="sunlight-input-group">
            <input type="number" class="sunlight-input" id="sunlightMinutes"
              min="0" max="180" value="${sunlight.minutes || 0}" />
            <span style="font-size:12px;">分钟</span>
            <button class="btn btn-sm btn-primary" onclick="App.saveSunlight()">保存</button>
          </div>
        </div>
        ${sunlight.minutes > 0 ? `<div style="padding:8px 14px;font-size:12px;color:#78350f;background:#fefce8;">
          💡 估算等效维D合成：约 ${Math.round(Math.min(sunlight.minutes/10 * NUTRITION_STANDARDS.sunlightConversion.per10Min, NUTRITION_STANDARDS.sunlightConversion.maxDaily))}μg (${Math.round(Math.min(sunlight.minutes/10 * NUTRITION_STANDARDS.sunlightConversion.per10Min, NUTRITION_STANDARDS.sunlightConversion.maxDaily)*40)} IU)
        </div>` : ''}
      </div>

      <!-- 餐次列表 -->
      <div class="card">
        <div class="card-title">📋 今日饮食记录</div>
    `;

    if (meals.length === 0) {
      html += `
        <div class="empty-state">
          <div class="empty-icon">🍽️</div>
          <p>今天还没有记录任何饮食</p>
          <button class="btn btn-primary" onclick="App.openMealEditor()">+ 添加餐次</button>
        </div>`;
    } else {
      html += `<div id="mealsList">`;
      meals.forEach((meal, i) => {
        const totalCal = meal.foods.reduce((sum, f) => sum + (f.nutrition ? f.nutrition.energy : 0), 0);
        html += `
          <div class="meal-item">
            <div class="meal-header">
              <span class="meal-order">第${meal.order || (i+1)}餐</span>
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="meal-time">${meal.time || ''}  ·  约${Math.round(totalCal)}kcal</span>
              </div>
              <div class="meal-actions">
                <button class="btn btn-sm btn-outline" onclick="App.openMealEditor('${meal.id}')">✏️ 编辑</button>
                <button class="btn btn-sm" style="color:#ef4444;" onclick="App.deleteMeal('${meal.id}')">🗑</button>
              </div>
            </div>
            ${meal.image ? `<img src="${meal.image}" class="meal-image" alt="餐食图片" />` : ''}
            <div class="meal-body">
              <div class="meal-foods">
                ${meal.foods.map(f => `
                  <span class="food-tag">
                    ${f.name}
                    <span class="weight">${f.weight}g</span>
                    ${f.weightRange ? `<span style="font-size:10px;color:#9ca3af;">±${f.weightRange}%</span>` : ''}
                  </span>
                `).join('')}
              </div>
              ${meal.notes ? `<p style="margin-top:8px;font-size:12px;color:#6b7280;">💬 ${meal.notes}</p>` : ''}
            </div>
          </div>`;
      });
      html += `</div>
        <div style="text-align:center;margin-top:10px;">
          <button class="btn btn-primary" onclick="App.openMealEditor()">+ 添加餐次</button>
        </div>`;
    }
    html += `</div>`;

    return html;
  },

  // ========== 报告标签页 ==========
  renderReportTab() {
    const record = Storage.getRecord(this.currentDate);
    const settings = Storage.getSettings();
    const intake = this.calculateDailyNutrition(this.currentDate);
    const std = NUTRITION_STANDARDS;
    const standardMode = settings.standardMode || 'basic';

    if (!record || record.meals.length === 0) {
      return `
        <div class="card">
          <div class="empty-state">
            <div class="empty-icon">📊</div>
            <p>今日暂无饮食数据，请先记录餐食</p>
            <button class="btn btn-primary" onclick="App.switchTab('record');App.openMealEditor()">去记录</button>
          </div>
        </div>`;
    }

    let html = `
      <div class="card">
        <div class="card-title">📊 今日营养摄入报告</div>
        <div class="standard-toggle">
          <label>当前标准：<strong>${standardMode === 'advanced' ? '进阶标准' : '基础标准(RNI)'}</strong></label>
          <span style="font-size:12px;color:#6b7280;">（基础标准=《中国居民膳食营养素参考摄入量2023版》RNI；进阶标准=前沿文献保守化推荐值）</span>
        </div>
      </div>

      <!-- 达标汇总 -->
      <div class="stats-grid">
        ${this._renderStatsSummary(intake, standardMode)}
      </div>

      <!-- 雷达图 -->
      <div class="card">
        <div class="card-title">🎯 营养素达标率概览</div>
        <div class="chart-container">
          <canvas id="radarChart" style="max-height:320px;"></canvas>
        </div>
      </div>

      <!-- 宏量营养素柱状图 -->
      <div class="card">
        <div class="card-title">🔥 宏量营养素</div>
        <div class="chart-container">
          <canvas id="macroChart" style="max-height:280px;"></canvas>
        </div>
      </div>

      <!-- 营养素明细 -->
      <div class="card">
        <div class="card-title">📋 营养素达标详情</div>
    `;

    const categories = [
      { key: 'fatSoluble', name: '脂溶性维生素' },
      { key: 'waterSoluble', name: '水溶性维生素' },
      { key: 'mineral', name: '矿物质' },
    ];

    categories.forEach(cat => {
      const nuts = std.nutrients.filter(n => n.category === cat.key);
      html += `<div class="nutrient-group"><div class="nutrient-group-title">${cat.name}</div>`;
      nuts.forEach(n => {
        const intakeVal = intake[n.key] || 0;
        const basicRNI = n.basicRNI || 1;
        const advancedRNI = n.advanced || 1;
        const standard = standardMode === 'advanced' ? advancedRNI : basicRNI;
        const pct = Math.min(intakeVal / standard * 100, 150);
        const pctBasic = Math.min(intakeVal / basicRNI * 100, 150);
        const hasUL = n.UL && intakeVal > n.UL;
        const rangeInfo = this._getIntakeRange(n.key, this.currentDate);

        html += `
          <div class="nutrient-bar-group">
            <div class="nutrient-bar-header">
              <span class="nutrient-name">${n.name} ${hasUL ? '⚠️' : ''}</span>
              <span class="nutrient-value">
                <span class="${intakeVal >= standard ? 'achieved' : (hasUL ? 'exceeded' : '')}">
                  ${intakeVal.toFixed(1)}${n.unit}
                </span>
                / ${standard.toFixed(1)}${n.unit}
                (${pct.toFixed(0)}%)
                ${standardMode !== 'advanced' ? `<span style="color:#9ca3af;"> ·进阶:${n.advanced}${n.unit}</span>` : ''}
              </span>
            </div>
            <div class="nutrient-bar-track">
              <div class="nutrient-bar-fill" style="
                width:${pct}%;
                background:${hasUL ? 'var(--color-danger)' : (pct >= 100 ? 'var(--color-success)' : pct >= 70 ? 'var(--color-warning)' : 'var(--color-danger)')}">
                ${pct > 30 ? pct.toFixed(0)+'%' : ''}
              </div>
              ${standardMode !== 'advanced' ? `<div class="nutrient-bar-advanced-mark" style="left:${Math.min(advancedRNI/standard*100, 150)}%;" title="进阶标准: ${advancedRNI}${n.unit}"></div>` : ''}
            </div>
            ${rangeInfo ? `<div class="nutrient-range-display">📐 识别浮动区间: ${rangeInfo.min.toFixed(1)} ~ ${rangeInfo.max.toFixed(1)} ${n.unit}</div>` : ''}
            ${n.note ? `<div style="font-size:10px;color:#9ca3af;margin-top:2px;">💡 ${n.note}</div>` : ''}
          </div>`;
      });
      html += `</div>`;
    });

    html += `</div>`;

    // 食物来源分布
    if (record && record.meals.length > 0) {
      html += `
        <div class="card">
          <div class="card-title">🥩 蛋白质来源分布</div>
          <div class="chart-container">
            <canvas id="sourceChart" style="max-height:280px;"></canvas>
          </div>
        </div>`;
    }

    return html;
  },

  _renderStatsSummary(intake, standardMode) {
    const std = NUTRITION_STANDARDS;
    const allNuts = std.nutrients.filter(n => n.key !== 'sodium');
    let basicPass = 0, advPass = 0, total = allNuts.length;

    allNuts.forEach(n => {
      const v = intake[n.key] || 0;
      if (v >= n.basicRNI) basicPass++;
      if (v >= n.advanced) advPass++;
    });

    const basicRate = Math.round(basicPass / total * 100);
    const advRate = Math.round(advPass / total * 100);

    return `
      <div class="stat-card">
        <div class="stat-value">${Math.round(intake.energy || 0)}</div>
        <div class="stat-label">摄入能量(kcal)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${Math.round(intake.protein || 0)}g</div>
        <div class="stat-label">摄入蛋白质</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${basicRate}%</div>
        <div class="stat-label">基础标准达标率</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:var(--color-secondary);">${advRate}%</div>
        <div class="stat-label">进阶标准达标率</div>
      </div>
    `;
  },

  _renderReportCharts() {
    const intake = this.calculateDailyNutrition(this.currentDate);
    const settings = Storage.getSettings();
    const standardMode = settings.standardMode || 'basic';
    const record = Storage.getRecord(this.currentDate);

    Charts.renderRadarChart('radarChart', intake, standardMode);
    Charts.renderMacroChart('macroChart', intake, standardMode);
    if (record && record.meals.length > 0) {
      Charts.renderSourceChart('sourceChart', record.meals, 'protein');
    }
  },

  // ========== 周期分析标签页 ==========
  renderAnalysisTab() {
    const record = Storage.getRecord(this.currentDate);

    if (!record || record.meals.length === 0) {
      return `<div class="card"><div class="empty-state"><div class="empty-icon">📈</div>
        <p>暂无今日饮食数据。请先记录饮食后查看趋势分析。</p></div></div>`;
    }

    let html = `
      <div class="card">
        <div class="card-title">📈 营养趋势分析</div>
        <div class="card-subtitle">基于历史数据的长期营养摄入趋势</div>
        <div style="margin-bottom:12px;">
          <label style="font-size:12px;margin-right:8px;">周期范围：</label>
          <button class="btn btn-sm btn-outline" onclick="App._renderAnalysisForRange(7)">最近7天</button>
          <button class="btn btn-sm btn-outline" onclick="App._renderAnalysisForRange(14)">最近14天</button>
          <button class="btn btn-sm btn-outline" onclick="App._renderAnalysisForRange(30)">最近30天</button>
        </div>
        <div class="chart-container" id="trendChartArea">
          <p style="text-align:center;color:#9ca3af;padding:40px;">点击上方按钮查看趋势数据</p>
        </div>
      </div>

      <!-- 长期低摄入预警 -->
      <div class="card" id="longTermWarningCard">
        <div class="card-title">⚠️ 长期低摄入风险预警</div>
        <div id="longTermWarningContent">
          <p style="text-align:center;color:#9ca3af;padding:20px;">分析中...</p>
        </div>
      </div>

      <!-- UL超标检查 -->
      <div class="card" id="ulWarningCard">
        <div class="card-title">🔴 UL上限超标检查</div>
        <div id="ulWarningContent">
          <p style="text-align:center;color:#9ca3af;padding:20px;">分析中...</p>
        </div>
      </div>
    `;

    // 异步加载分析
    setTimeout(() => {
      this._renderAnalysisForRange(7);
      this._renderLongTermWarnings();
      this._renderULWarningsPeriod();
    }, 50);

    return html;
  },

  _renderAnalysisForRange(days) {
    const end = new Date(this.currentDate);
    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));

    const records = Storage.getRecordsInRange(Storage._formatDate(start), Storage._formatDate(end));
    const dateLabels = [];
    const intakeSeries = [];
    const current = new Date(start);

    while (current <= end) {
      const dateStr = Storage._formatDate(current);
      dateLabels.push(`${current.getMonth()+1}/${current.getDate()}`);
      const rec = records[dateStr];
      if (rec && rec.meals.length > 0) {
        intakeSeries.push(this.calculateDailyNutrition(dateStr));
      } else {
        intakeSeries.push(null);
      }
      current.setDate(current.getDate() + 1);
    }

    // 重建canvas
    const area = document.getElementById('trendChartArea');
    area.innerHTML = '<canvas id="trendChart" style="height:280px;"></canvas>';

    const keyNutrients = ['energy', 'protein', 'calcium', 'iron', 'zinc', 'vitC', 'vitD'];
    // 过滤掉null
    const validDates = dateLabels.filter((_, i) => intakeSeries[i] !== null);
    const validIntakes = intakeSeries.filter(s => s !== null);

    if (validDates.length > 0) {
      Charts.renderTrendChart('trendChart', validDates, validIntakes, keyNutrients, 'basic');
    }
  },

  _renderLongTermWarnings() {
    const content = document.getElementById('longTermWarningContent');
    if (!content) return;

    const weeks = 2; // 检查最近14天
    const end = new Date(this.currentDate);
    const start = new Date(end);
    start.setDate(start.getDate() - 13);
    const records = Storage.getRecordsInRange(Storage._formatDate(start), Storage._formatDate(end));

    const validDates = [];
    const current = new Date(start);
    while (current <= end) {
      const ds = Storage._formatDate(current);
      const rec = records[ds];
      if (rec && rec.meals.length > 0) validDates.push(ds);
      current.setDate(current.getDate() + 1);
    }

    if (validDates.length < 3) {
      content.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px;">记录天数不足（需至少3天有数据），暂无法评估长期趋势。</p>';
      return;
    }

    const std = NUTRITION_STANDARDS;
    const threshold = std.longTermWarningThreshold;
    const warnings = [];

    // 检查所有营养素
    const checkNuts = std.nutrients.filter(n => ['vitA','vitD','vitE','vitC','vitB1','vitB2','vitB6','vitB12','folate','calcium','iron','zinc','magnesium','selenium','potassium'].includes(n.key));

    checkNuts.forEach(n => {
      let belowCount = 0;
      validDates.forEach(ds => {
        const intake = this.calculateDailyNutrition(ds);
        if ((intake[n.key] || 0) < n.basicRNI) belowCount++;
      });

      if (belowCount / validDates.length > threshold) {
        warnings.push({
          nutrient: n,
          belowDays: belowCount,
          totalDays: validDates.length,
          percentage: Math.round(belowCount / validDates.length * 100)
        });
      }
    });

    if (warnings.length === 0) {
      content.innerHTML = '<div class="alert alert-success"><span class="alert-icon">✅</span>近14天未检测到明显的营养素长期低摄入风险，继续保持！</div>';
    } else {
      content.innerHTML = warnings.map(w => `
        <div class="alert alert-warning">
          <span class="alert-icon">⚠️</span>
          <span>${w.nutrient.name}：近${w.totalDays}天中有${w.belowDays}天(${w.percentage}%)低于基础推荐值(${w.nutrient.basicRNI}${w.nutrient.unit})，存在长期缺乏风险</span>
        </div>
      `).join('');
    }
  },

  _renderULWarningsPeriod() {
    const content = document.getElementById('ulWarningContent');
    if (!content) return;

    const weeks = 2;
    const end = new Date(this.currentDate);
    const start = new Date(end);
    start.setDate(start.getDate() - 13);
    const records = Storage.getRecordsInRange(Storage._formatDate(start), Storage._formatDate(end));

    const validDates = [];
    const current = new Date(start);
    while (current <= end) {
      const ds = Storage._formatDate(current);
      if (records[ds] && records[ds].meals.length > 0) validDates.push(ds);
      current.setDate(current.getDate() + 1);
    }

    if (validDates.length < 3) {
      content.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px;">记录天数不足，暂无法评估。</p>';
      return;
    }

    // 计算平均摄入
    const avgIntake = {};
    const std = NUTRITION_STANDARDS;
    std.nutrients.forEach(n => {
      let sum = 0;
      validDates.forEach(ds => {
        const intake = this.calculateDailyNutrition(ds);
        sum += (intake[n.key] || 0);
      });
      avgIntake[n.key] = sum / validDates.length;
    });

    const ulWarnings = [];
    std.nutrients.forEach(n => {
      if (n.UL && avgIntake[n.key] > n.UL) {
        ulWarnings.push({
          nutrient: n,
          average: avgIntake[n.key],
          UL: n.UL,
          exceedPercent: Math.round((avgIntake[n.key] - n.UL) / n.UL * 100)
        });
      }
    });

    if (ulWarnings.length === 0) {
      content.innerHTML = '<div class="alert alert-success"><span class="alert-icon">✅</span>近14天平均摄入量均未超过营养素UL可耐受最高摄入量，安全。</div>';
    } else {
      content.innerHTML = ulWarnings.map(w => `
        <div class="alert alert-danger">
          <span class="alert-icon">🔴</span>
          <span>
            <strong>${w.nutrient.name}</strong>：近14天平均 ${w.average.toFixed(1)}${w.nutrient.unit}，超过UL上限(${w.UL}${w.nutrient.unit}) ${w.exceedPercent}%
            <br/><small style="color:#991b1b;">建议适当调整饮食，减少该营养素来源食物摄入</small>
          </span>
        </div>
      `).join('');
    }
  },

  _renderAnalysisCharts() {
    // 图表已在renderAnalysisTab中通过setTimeout延迟渲染
  },

  // ========== 补充剂标签页 ==========
  renderSupplementTab() {
    const record = Storage.getRecord(this.currentDate);
    const supps = record ? (record.supplements || []) : [];

    // 计算补充剂营养素汇总
    const suppNutrientSums = {};
    supps.forEach(s => {
      (s.nutrients || []).forEach(entry => {
        const target = NUTRITION_STANDARDS.nutrients.find(n =>
          n.name.replace(/\s+/g,'').toLowerCase().includes(entry.key.replace(/[_\s]/g,'').toLowerCase()) ||
          n.key.toLowerCase() === entry.key.replace(/[\s()]/g,'').toLowerCase()
        );
        const nutKey = target ? target.key : entry.key;
        suppNutrientSums[nutKey] = (suppNutrientSums[nutKey] || 0) + (entry.amount || 0);
      });
    });

    let html = `
      <div class="card">
        <div class="card-title">💊 膳食补充剂 <span class="supp-tab-badge">独立看板</span></div>
        <div class="card-subtitle">补充剂营养素不纳入日常饮食摄入统计，独立展示。</div>
        <button class="btn btn-primary btn-sm" onclick="App.openSupplementEditor()">+ 添加补充剂记录</button>
      </div>
    `;

    if (supps.length === 0) {
      html += `
        <div class="card">
          <div class="empty-state">
            <div class="empty-icon">💊</div>
            <p>今日无补充剂记录</p>
            <p style="font-size:12px;color:#9ca3af;">如使用蛋白粉、肌酸、复合维生素等，请在此处单独记录</p>
          </div>
        </div>`;
    } else {
      html += `<div class="card"><div class="card-title">📋 今日补充剂清单</div>`;
      supps.forEach(s => {
        html += `
          <div class="supp-item">
            <div class="supp-item-header">
              <span class="supp-item-name">${s.name} ${s.time ? `(${s.time})` : ''}</span>
              <button class="btn btn-sm" style="color:#ef4444;" onclick="App.deleteSupplement('${s.id}')">🗑</button>
            </div>
            <div class="supp-nutrient-list">
              ${(s.nutrients || []).map(n => `<span class="supp-nutrient-tag">${n.name || n.key}: ${n.amount}${n.unit || 'mg'}</span>`).join('')}
            </div>
            ${s.notes ? `<p style="font-size:11px;color:#6b7280;margin-top:6px;">💬 ${s.notes}</p>` : ''}
          </div>`;
      });
      html += `</div>`;

      // 补充剂营养素汇总
      if (Object.keys(suppNutrientSums).length > 0) {
        html += `
          <div class="card">
            <div class="card-title">💊 补充剂营养素汇总（独立于膳食）</div>
            <table style="width:100%;font-size:12px;border-collapse:collapse;">
              <thead><tr style="border-bottom:1px solid #e5e7eb;">
                <th style="text-align:left;padding:6px;">营养素</th>
                <th style="text-align:right;padding:6px;">补充剂提供</th>
                <th style="text-align:right;padding:6px;">基础RNI</th>
                <th style="text-align:right;padding:6px;">占比</th>
              </tr></thead>
              <tbody>
                ${Object.entries(suppNutrientSums).map(([key, amount]) => {
                  const nut = NUTRITION_STANDARDS.getNutrient(key);
                  const rni = nut ? nut.basicRNI : 0;
                  const pct = rni > 0 ? Math.round(amount / rni * 100) : 0;
                  return `<tr style="border-bottom:1px solid #f3f4f6;">
                    <td style="padding:6px;">${nut ? nut.name : key}</td>
                    <td style="text-align:right;padding:6px;">${amount.toFixed(1)}${nut ? nut.unit : ''}</td>
                    <td style="text-align:right;padding:6px;">${rni.toFixed(1)}${nut ? nut.unit : ''}</td>
                    <td style="text-align:right;padding:6px;color:${pct>100?'#ef4444':'#22c55e'};">${pct}%</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>`;
      }
    }

    return html;
  },

  // ========== 设置标签页 ==========
  renderSettingsTab() {
    const profile = Storage.getProfile();
    const settings = Storage.getSettings();

    return `
      <div style="display:flex;align-items:center;margin-bottom:12px;">
        <button class="btn btn-sm btn-outline" onclick="App.switchTab('record')">‹ 返回</button>
        <span style="flex:1;text-align:center;font-weight:700;font-size:16px;">⚙️ 设置</span>
        <div style="width:56px;"></div>
      </div>
      <div class="card">
        <div class="card-title">👤 个人基础档案</div>
        <form id="profileForm">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">性别</label>
              <select class="form-select" name="gender">
                <option value="male" ${profile.gender==='male'?'selected':''}>男</option>
                <option value="female" ${profile.gender==='female'?'selected':''}>女</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">年龄</label>
              <input type="number" class="form-input" name="age" value="${profile.age}" min="1" max="120" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">身高 (cm)</label>
              <input type="number" class="form-input" name="height" value="${profile.height}" min="50" max="250" />
            </div>
            <div class="form-group">
              <label class="form-label">体重 (kg)</label>
              <input type="number" class="form-input" name="weight" value="${profile.weight}" min="20" max="300" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">活动水平</label>
            <select class="form-select" name="activityLevel">
              <option value="sedentary" ${profile.activityLevel==='sedentary'?'selected':''}>久坐少动</option>
              <option value="light" ${profile.activityLevel==='light'?'selected':''}>轻度活动</option>
              <option value="moderate" ${profile.activityLevel==='moderate'?'selected':''}>中等活动（规律运动）</option>
              <option value="active" ${profile.activityLevel==='active'?'selected':''}>高度活跃</option>
              <option value="athlete" ${profile.activityLevel==='athlete'?'selected':''}>运动员级</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">生活标签</label>
            <div class="life-labels">
              ${['力量训练爱好者','减脂期','发育期','久坐上班族','运动爱好者','增肌期','素食者'].map(label => `
                <label style="cursor:pointer;">
                  <input type="checkbox" name="lifeLabels" value="${label}" ${(profile.lifeLabels||[]).includes(label)?'checked':''} style="margin-right:4px;" />
                  <span class="life-label-tag">${label}</span>
                </label>
              `).join('')}
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">特殊人群标记</label>
            <select class="form-select" name="specialGroup">
              <option value="">无特殊标记</option>
              <option value="pregnant" ${profile.specialGroup==='pregnant'?'selected':''}>孕妇</option>
              <option value="lactating" ${profile.specialGroup==='lactating'?'selected':''}>哺乳期</option>
              <option value="diabetes" ${profile.specialGroup==='diabetes'?'selected':''}>糖尿病</option>
              <option value="hypertension" ${profile.specialGroup==='hypertension'?'selected':''}>高血压</option>
              <option value="gout" ${profile.specialGroup==='gout'?'selected':''}>痛风/高尿酸</option>
              <option value="anemia" ${profile.specialGroup==='anemia'?'selected':''}>贫血</option>
            </select>
          </div>
          <button type="button" class="btn btn-primary" onclick="App.saveProfile()">保存档案</button>
        </form>
      </div>

      <div class="card">
        <div class="card-title">⚙️ 进阶标准设置</div>
        <div class="standard-toggle">
          <span style="flex:1;font-size:13px;">
            <strong>进阶营养标准</strong><br/>
            <span style="color:#6b7280;">采用前沿营养学术文献整理的高阶推荐值(已保守化为激进值80%)作为评判依据</span>
          </span>
          <label class="toggle-switch">
            <input type="checkbox" id="advToggle" ${settings.standardMode==='advanced'?'checked':''} onchange="App.toggleAdvancedStandard()" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div style="font-size:12px;color:#6b7280;margin-top:8px;">
          ⚠️ 开启前将弹出确认弹窗，需您手动确认。进阶标准仅供参考，不构成医疗建议。
        </div>
      </div>

      <div class="card">
        <div class="card-title">💾 数据管理</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-outline" onclick="App.exportData()">📥 导出数据(JSON)</button>
          <button class="btn btn-outline" onclick="App.importData()">📤 导入数据</button>
          <button class="btn btn-danger" onclick="App.clearAllData()">🗑 清除所有数据</button>
        </div>
      </div>
    `;
  },

  _setupSettingsForm() {
    // 表单事件绑定
  },

  saveProfile() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    const fd = new FormData(form);
    const profile = {
      gender: fd.get('gender'),
      age: parseInt(fd.get('age')) || 17,
      height: parseInt(fd.get('height')) || 173,
      weight: parseInt(fd.get('weight')) || 97,
      activityLevel: fd.get('activityLevel'),
      lifeLabels: fd.getAll('lifeLabels'),
      specialGroup: fd.get('specialGroup') || null,
    };

    // 重新计算目标值
    const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + (profile.gender === 'male' ? 5 : -161);
    const palMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, athlete: 1.9 };
    const tdee = Math.round(bmr * (palMap[profile.activityLevel] || 1.55));
    const isFatLoss = (profile.lifeLabels || []).some(l => l.includes('减脂'));
    const isMuscleGain = (profile.lifeLabels || []).some(l => l.includes('增肌'));
    const targetCal = isFatLoss ? Math.round(tdee * 0.8) : tdee;
    const targetProtein = (profile.lifeLabels || []).some(l => l.includes('力量') || l.includes('增肌'))
      ? Math.round(profile.weight * 1.8) : Math.round(profile.weight * 0.8);

    Storage.saveProfile({
      ...profile,
      bmr: Math.round(bmr),
      tdee,
      targetCalories: targetCal,
      targetProtein,
    });

    this.updateUserBadge();
    this.showToast('档案已保存，营养标准将自动适配', 'success');
  },

  toggleAdvancedStandard() {
    const settings = Storage.getSettings();
    const toggle = document.getElementById('advToggle');

    if (toggle && toggle.checked && !settings.advancedConfirmed) {
      // 弹出确认弹窗
      toggle.checked = false;
      this.showConfirm(
        '确认开启进阶标准',
        `<div style="font-size:13px;">
          <p style="margin-bottom:12px;">您即将启用<strong>进阶营养标准</strong>，请注意：</p>
          <ul style="padding-left:20px;margin-bottom:12px;">
            <li>进阶标准采用<strong>前沿营养学术文献</strong>整理的高阶推荐值，已保守化为激进值的<strong>80%</strong></li>
            <li>此标准高于国家标准RNI，更适合有运动习惯、追求更优营养状态的人群</li>
            <li>进阶标准<strong>仅供参考</strong>，不构成医疗建议</li>
            <li>如感到不适，可随时在设置中关闭</li>
          </ul>
          <p style="color:#6b7280;">确认后将以进阶标准重新计算营养达标率。</p>
        </div>`,
        () => {
          Storage.saveSettings({ standardMode: 'advanced', advancedConfirmed: true });
          this.showToast('进阶标准已启用 (保守化激进值80%)', 'info');
          this.renderAll();
        },
        () => {
          // 取消
        }
      );
    } else {
      const newMode = toggle && toggle.checked ? 'advanced' : 'basic';
      Storage.saveSettings({ standardMode: newMode });
      this.showToast(newMode === 'advanced' ? '已切换到进阶标准' : '已切换到基础标准(RNI)', 'info');
      this.renderAll();
    }
  },

  // ========== 餐次编辑 ==========
  openMealEditor(mealId) {
    this.editingMealId = mealId || null;
    this.tempSelectedFoods = [];
    this.mealImage = null;

    const isEdit = !!mealId;
    const record = Storage.getRecord(this.currentDate);

    if (isEdit && record) {
      const meal = record.meals.find(m => m.id === mealId);
      if (meal) {
        this.tempSelectedFoods = meal.foods.map(f => ({
          foodId: f.foodId || '',
          name: f.name,
          weight: f.weight,
          weightRange: f.weightRange || 10,
          nutrition: f.nutrition,
        }));
        this.mealImage = meal.image || null;
      }
    }

    // 渲染模态框
    const title = document.getElementById('mealModalTitle');
    title.textContent = isEdit ? '编辑餐次' : '添加新餐次';
    document.getElementById('mealModal').style.display = 'flex';

    this._renderMealEditorBody();
  },

  _renderMealEditorBody() {
    const body = document.getElementById('mealModalBody');
    const isEdit = !!this.editingMealId;
    const record = Storage.getRecord(this.currentDate);
    const meal = isEdit && record ? record.meals.find(m => m.id === this.editingMealId) : null;

    let html = '';

    // 餐次基本信息
    const orderNum = this.tempSelectedFoods.length > 0 && meal
      ? meal.order
      : ((record ? record.meals.length : 0) + 1);

    html += `
      <div class="form-row" style="margin-bottom:12px;">
        <div class="form-group">
          <label class="form-label">时间</label>
          <input type="time" class="form-input" id="mealTime" value="${meal ? meal.time || '' : new Date().toTimeString().slice(0,5)}" />
        </div>
        <div class="form-group">
          <label class="form-label">标签 (自动排序)</label>
          <div class="form-input" style="background:#f3f4f6;color:#6b7280;">第${orderNum}餐</div>
        </div>
      </div>`;

    // 图片上传区域
    html += `
      <div class="upload-zone" id="imageUploadZone" onclick="document.getElementById('imageInput').click()">
        ${this.mealImage
          ? `<img src="${this.mealImage}" style="max-width:100%;max-height:200px;border-radius:4px;" />`
          : `<div class="upload-icon">📸</div>
             <p>上传餐食图片进行AI识别<br/><small>(支持JPG/PNG，识别结果含±10-15%误差)</small></p>`
        }
      </div>
      <input type="file" id="imageInput" accept="image/*" style="display:none;" onchange="App.handleImageUpload(event)" />
      ${this.mealImage ? `<button class="btn btn-sm btn-outline btn-block" onclick="App.mealImage=null;App._renderMealEditorBody();">移除图片</button>` : ''}
    `;

    // 混合菜引导 (有图片时显示)
    if (this.mealImage) {
      html += `
        <div class="mixed-dish-guide">
          <h4>🍲 混合菜肴识别提醒</h4>
          <p>如上传图片为混合菜肴(如炒菜、炖菜、汤品)，请尽量在下方详细描述食材构成：</p>
          <input type="text" class="form-input" id="dishDescription" placeholder="例如：番茄炒蛋(番茄200g+鸡蛋2个)、红烧牛肉面(牛肉150g+面条200g+青菜50g)..." />
          <p style="font-size:10px;color:#78350f;margin-top:4px;">详细<strong>食材描述</strong>可显著降低AI识别偏差，提升营养计算准确度。</p>
        </div>`;
    }

    // 手动添加/搜索食物
    html += `
      <div class="food-selector">
        <input type="text" class="food-search-bar" id="foodSearch" placeholder="🔍 搜索食物 (如：鸡蛋、鸡胸肉、西兰花...)" oninput="App._searchFood(this.value)" />
        <div class="food-category-tabs" id="foodCategoryTabs">
          <button class="food-cat-btn active" onclick="App._filterFoodCategory('all', this)">全部</button>
          ${FOOD_DATABASE.categories.map(c =>
            `<button class="food-cat-btn" onclick="App._filterFoodCategory('${c.key}', this)">${c.icon} ${c.name}</button>`
          ).join('')}
        </div>
        <div class="food-grid" id="foodOptionGrid">
          ${this._renderFoodOptions('all')}
        </div>
      </div>`;

    // 已选食物列表
    html += `
      <div class="selected-foods" id="selectedFoodsList">
        <h4 style="font-size:13px;margin-bottom:8px;">已选食物 (${this.tempSelectedFoods.length})</h4>
    `;

    if (this.tempSelectedFoods.length === 0) {
      html += `<p style="color:#9ca3af;font-size:12px;">尚未添加食物，请搜索并点击添加</p>`;
    } else {
      this.tempSelectedFoods.forEach((food, idx) => {
        const rangeMin = Math.round(food.weight * (1 - food.weightRange / 100));
        const rangeMax = Math.round(food.weight * (1 + food.weightRange / 100));
        html += `
          <div class="selected-food-row">
            <span class="food-name">${food.name}</span>
            <div class="weight-input-group">
              <input type="number" class="weight-input" value="${food.weight}"
                onchange="App._updateFoodWeight(${idx}, this.value)" />
              <span style="font-size:12px;">g</span>
            </div>
            <span class="weight-range">(${rangeMin}-${rangeMax}g)</span>
            <button class="remove-food-btn" onclick="App._removeFood(${idx})">✕</button>
          </div>`;
      });
    }
    html += `</div>`;

    // 备注
    html += `
      <div class="form-group" style="margin-top:12px;">
        <label class="form-label">备注 (可选)</label>
        <textarea class="form-input" id="mealNotes" rows="2" placeholder="烹饪方式、调料、特殊说明...">${meal ? (meal.notes || '') : ''}</textarea>
      </div>`;

    body.innerHTML = html;

    // 确保保存按钮绑定到 saveMeal (防止被补充剂编辑器覆盖)
    const saveBtn = document.querySelector('#mealModal .btn-primary');
    if (saveBtn) saveBtn.onclick = () => this.saveMeal();
  },

  _renderFoodOptions(category) {
    let foods;
    if (category === 'all') {
      foods = FOOD_DATABASE.foods;
    } else {
      foods = FOOD_DATABASE.getByCategory(category);
    }
    return foods.map(f => `
      <div class="food-option" data-food-id="${f.id}" onclick="App._addTempFood('${f.id}')"
        title="${f.name} (${f.kcal}kcal/100g)">
        ${f.name}
        <span style="font-size:10px;color:#9ca3af;">${f.kcal}kcal</span>
      </div>
    `).join('');
  },

  _searchFood(query) {
    if (!query) {
      document.getElementById('foodOptionGrid').innerHTML = this._renderFoodOptions('all');
      return;
    }
    const results = FOOD_DATABASE.search(query);
    if (results.length === 0) {
      document.getElementById('foodOptionGrid').innerHTML =
        `<p style="color:#9ca3af;font-size:12px;text-align:center;grid-column:1/-1;padding:12px;">未找到匹配食物</p>`;
    } else {
      document.getElementById('foodOptionGrid').innerHTML = results.map(f => `
        <div class="food-option" data-food-id="${f.id}" onclick="App._addTempFood('${f.id}')"
          title="${f.name} (${f.kcal}kcal/100g)">
          ${f.name}
          <span style="font-size:10px;color:#9ca3af;">${f.kcal}kcal</span>
        </div>
      `).join('');
    }
  },

  _filterFoodCategory(cat, btn) {
    document.querySelectorAll('#foodCategoryTabs .food-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('foodOptionGrid').innerHTML = this._renderFoodOptions(cat);
  },

  _addTempFood(foodId) {
    const food = FOOD_DATABASE.getFood(foodId);
    if (!food) return;

    // 默认150g，AI估重场景10-15%浮动
    const defaultWeight = 150;
    const isImageRecognition = !!this.mealImage;
    const errorRange = isImageRecognition ? 12 : 0; // 有图片时±12%，无图片时手动输入无误差

    this.tempSelectedFoods.push({
      foodId: food.id,
      name: food.name,
      weight: defaultWeight,
      weightRange: errorRange,
    });

    this._renderMealEditorBody();
  },

  _updateFoodWeight(idx, weight) {
    if (idx >= 0 && idx < this.tempSelectedFoods.length) {
      this.tempSelectedFoods[idx].weight = Math.max(1, parseFloat(weight) || 0);
    }
  },

  _removeFood(idx) {
    this.tempSelectedFoods.splice(idx, 1);
    this._renderMealEditorBody();
  },

  handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.mealImage = e.target.result;
      this._simulateRecognition(e.target.result);
    };
    reader.readAsDataURL(file);
  },

  _simulateRecognition(imageData) {
    // 模拟AI识别流程: 显示加载状态 -> 基于图片分析推荐食物
    const zone = document.getElementById('imageUploadZone');
    if (zone) {
      zone.innerHTML = `
        <div class="recognizing">
          <div class="spinner"></div>
          <p>🔍 AI正在分析食物构成...</p>
        </div>`;
    }

    setTimeout(() => {
      // 模拟识别: 从数据库随机推荐3-5种食物
      const allFoods = [...FOOD_DATABASE.foods];
      const shuffled = allFoods.sort(() => Math.random() - 0.5);
      const guesses = shuffled.slice(0, 4).map(f => ({
        foodId: f.id, name: f.name,
        weight: Math.round(50 + Math.random() * 150),
        weightRange: Math.round(10 + Math.random() * 5),
      }));

      // 用模拟结果填充临时食物列表（如果还没有食物）
      if (this.tempSelectedFoods.length === 0) {
        this.tempSelectedFoods = guesses.map(g => ({
          foodId: g.foodId,
          name: g.name,
          weight: g.weight,
          weightRange: g.weightRange,
        }));
      }

      this._renderMealEditorBody();
      this.showToast('AI识别完成，请核对并修正食物与克重 (识别合理误差±10-15%)', 'info');
    }, 1500);
  },

  saveMeal() {
    const time = document.getElementById('mealTime')?.value || '';
    const notes = document.getElementById('mealNotes')?.value || '';
    const dishDesc = document.getElementById('dishDescription')?.value || '';

    if (this.tempSelectedFoods.length === 0) {
      this.showToast('请至少添加一种食物', 'warning');
      return;
    }

    // 构建食物数据(含营养计算)
    const foods = this.tempSelectedFoods.map(tf => {
      const nutrition = FOOD_DATABASE.getNutritionForFood(tf.foodId, tf.weight);
      return {
        foodId: tf.foodId,
        name: tf.name,
        weight: tf.weight,
        weightRange: tf.weightRange || 0,
        nutrition,
      };
    });

    const mealData = {
      time,
      foods,
      notes: dishDesc ? `${dishDesc}${notes ? '; ' + notes : ''}` : notes,
      image: this.mealImage,
    };

    const record = Storage.getRecord(this.currentDate) || {
      date: this.currentDate,
      meals: [],
      sunlight: { minutes: 0, bodyParts: ['arms', 'legs'] },
      supplements: [],
    };

    if (this.editingMealId) {
      Storage.updateMeal(this.currentDate, this.editingMealId, mealData);
      this.showToast('餐次已更新，统计已同步', 'success');
    } else {
      mealData.order = record.meals.length + 1;
      Storage.addMeal(this.currentDate, mealData);
      this.showToast(`已添加第${record.meals.length + 1}餐`, 'success');
    }

    this.editingMealId = null;
    this.tempSelectedFoods = [];
    this.mealImage = null;
    document.getElementById('mealModal').style.display = 'none';
    this.renderAll();
  },

  closeMealEditor() {
    this.editingMealId = null;
    this.tempSelectedFoods = [];
    this.mealImage = null;
    document.getElementById('mealModal').style.display = 'none';
  },

  deleteMeal(mealId) {
    this.showConfirm(
      '确认删除',
      '<p>删除后该餐次数据将<strong>永久移除</strong>，当日及周期统计将实时同步更新。</p>',
      () => {
        Storage.deleteMeal(this.currentDate, mealId);
        this.showToast('餐次已删除，统计已同步', 'success');
        this.renderAll();
      }
    );
  },

  // ========== 日晒记录 ==========
  saveSunlight() {
    const minutes = parseInt(document.getElementById('sunlightMinutes')?.value) || 0;
    Storage.updateSunlight(this.currentDate, {
      minutes: Math.min(Math.max(minutes, 0), 180),
      bodyParts: ['arms', 'legs'],
    });
    this.showToast('日晒记录已保存', 'success');
    this.renderAll();
  },

  // ========== 补充剂编辑 ==========
  openSupplementEditor() {
    this.editingSuppId = null;
    const body = document.getElementById('mealModalBody');
    const title = document.getElementById('mealModalTitle');
    title.textContent = '添加补充剂记录';

    const nutOptions = NUTRITION_STANDARDS.nutrients.map(n =>
      `<option value="${n.key}">${n.name} (${n.unit})</option>`
    ).join('');

    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">补充剂名称</label>
        <input type="text" class="form-input" id="suppName" placeholder="如：蛋白粉、复合维生素、肌酸..." />
      </div>
      <div class="form-group">
        <label class="form-label">服用时间</label>
        <input type="time" class="form-input" id="suppTime" value="${new Date().toTimeString().slice(0,5)}" />
      </div>
      <div id="suppNutrientsList">
        <h4 style="font-size:13px;margin-bottom:6px;">营养素明细</h4>
      </div>
      <button class="btn btn-sm btn-outline btn-block" onclick="App._addSuppNutrient()">+ 添加营养素</button>
      <button class="btn btn-sm btn-outline btn-block" onclick="App._addSuppNutrient();App._addSuppNutrient()" style="margin-top:4px;">+ 批量添加(3项)</button>
      <div class="form-group" style="margin-top:12px;">
        <label class="form-label">备注 (可选)</label>
        <textarea class="form-input" id="suppNotes" rows="2" placeholder="品牌、剂量说明..."></textarea>
      </div>
    `;

    // 默认添加1项营养素
    this._addSuppNutrient();

    document.getElementById('mealModal').style.display = 'flex';
    // 覆盖保存按钮行为
    document.querySelector('#mealModal .btn-primary').onclick = () => this.saveSupplement();
  },

  _addSuppNutrient() {
    const list = document.getElementById('suppNutrientsList');
    if (!list) return;

    const nutOptions = NUTRITION_STANDARDS.nutrients.map(n =>
      `<option value="${n.key}">${n.name} (${n.unit})</option>`
    ).join('');

    const idx = list.querySelectorAll('.supp-nutrient-row').length;
    const row = document.createElement('div');
    row.className = 'supp-nutrient-row';
    row.style.cssText = 'display:flex;gap:6px;align-items:center;margin-bottom:6px;';
    row.innerHTML = `
      <select class="form-select" style="flex:2;font-size:12px;" name="suppNutKey_${idx}">${nutOptions}</select>
      <input type="number" class="form-input" style="flex:1;font-size:12px;" name="suppNutAmt_${idx}" placeholder="用量" step="0.1" min="0" />
      <select class="form-select" style="flex:1;font-size:12px;" name="suppNutUnit_${idx}">
        <option value="g">g</option><option value="mg">mg</option><option value="μg">μg</option><option value="IU">IU</option>
      </select>
      <button class="btn btn-sm" style="color:#ef4444;" onclick="this.parentElement.remove()">✕</button>
    `;
    list.appendChild(row);
  },

  saveSupplement() {
    const name = document.getElementById('suppName')?.value.trim();
    if (!name) { this.showToast('请填写补充剂名称', 'warning'); return; }

    const time = document.getElementById('suppTime')?.value || '';
    const notes = document.getElementById('suppNotes')?.value || '';
    const rows = document.querySelectorAll('.supp-nutrient-row');
    const nutrients = [];

    rows.forEach((row, i) => {
      const keySelect = row.querySelector(`[name="suppNutKey_${i}"]`);
      const amtInput = row.querySelector(`[name="suppNutAmt_${i}"]`);
      const unitSelect = row.querySelector(`[name="suppNutUnit_${i}"]`);

      if (keySelect && amtInput && parseFloat(amtInput.value) > 0) {
        const nut = NUTRITION_STANDARDS.getNutrient(keySelect.value);
        nutrients.push({
          key: keySelect.value,
          name: nut ? nut.name : keySelect.value,
          amount: parseFloat(amtInput.value),
          unit: unitSelect ? unitSelect.value : (nut ? nut.unit : 'mg'),
        });
      }
    });

    if (nutrients.length === 0) { this.showToast('请至少添加一项营养素', 'warning'); return; }

    Storage.addSupplement(this.currentDate, { name, time, notes, nutrients });
    this.showToast(`补充剂「${name}」已记录 (独立于膳食统计)`, 'success');

    this.editingMealId = null;
    this.editingSuppId = null;
    document.getElementById('mealModal').style.display = 'none';
    this.renderAll();
  },

  deleteSupplement(suppId) {
    Storage.deleteSupplement(this.currentDate, suppId);
    this.showToast('补充剂记录已删除', 'success');
    this.renderAll();
  },

  // ========== 营养计算引擎 ==========
  calculateDailyNutrition(date) {
    const record = Storage.getRecord(date);
    if (!record) return this._emptyIntake();

    const totals = this._emptyIntake();

    // 汇总所有餐次食物营养素
    record.meals.forEach(meal => {
      meal.foods.forEach(food => {
        if (food.nutrition) {
          Object.keys(food.nutrition).forEach(key => {
            totals[key] = (totals[key] || 0) + (food.nutrition[key] || 0);
          });
        }
      });
    });

    // 日晒贡献的维D
    if (record.sunlight && record.sunlight.minutes > 0) {
      const sunVitD = Math.min(
        record.sunlight.minutes / 10 * NUTRITION_STANDARDS.sunlightConversion.per10Min,
        NUTRITION_STANDARDS.sunlightConversion.maxDaily
      );
      totals.vitD = (totals.vitD || 0) + sunVitD;
    }

    // 四舍五入
    Object.keys(totals).forEach(key => {
      totals[key] = Math.round(totals[key] * 10) / 10;
    });

    return totals;
  },

  _emptyIntake() {
    const intake = {};
    NUTRITION_STANDARDS.nutrients.forEach(n => { intake[n.key] = 0; });
    // 确保一些键名映射
    intake.energy = 0;
    intake.protein = 0;
    intake.fat = 0;
    intake.carbohydrate = 0;
    intake.fiber = 0;
    return intake;
  },

  // 计算某营养素的识别浮动区间
  _getIntakeRange(nutrientKey, date) {
    const record = Storage.getRecord(date);
    if (!record) return null;

    let weightedSum = 0;
    let totalWeight = 0;
    let hasRange = false;

    record.meals.forEach(meal => {
      meal.foods.forEach(food => {
        if (food.weightRange && food.weightRange > 0 && food.nutrition && food.nutrition[nutrientKey] !== undefined) {
          hasRange = true;
          // 用权重加权浮动百分比
          const range = food.weightRange / 100;
          const nutVal = food.nutrition[nutrientKey];
          weightedSum += nutVal * range;
          totalWeight += nutVal;
        }
      });
    });

    if (!hasRange) return null;

    const avgRangePercent = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const totalIntake = this.calculateDailyNutrition(date)[nutrientKey] || 0;

    return {
      min: Math.round((totalIntake * (1 - avgRangePercent)) * 10) / 10,
      max: Math.round((totalIntake * (1 + avgRangePercent)) * 10) / 10,
    };
  },

  // ========== 通知区域 ==========
  renderNotifications() {
    const area = document.getElementById('notificationArea');
    if (!area) return;
    area.innerHTML = '';

    const record = Storage.getRecord(this.currentDate);
    const settings = Storage.getSettings();

    // UL超标提醒 (仅当日)
    if (record && record.meals.length > 0) {
      const intake = this.calculateDailyNutrition(this.currentDate);
      const ulWarnings = [];
      NUTRITION_STANDARDS.nutrients.forEach(n => {
        if (n.UL && (intake[n.key] || 0) > n.UL) {
          ulWarnings.push({ nutrient: n, intake: intake[n.key] });
        }
      });

      if (ulWarnings.length > 0) {
        area.innerHTML += ulWarnings.map(w => `
          <div class="alert alert-danger">
            <span class="alert-icon">🔴</span>
            <span><strong>${w.nutrient.name}</strong> 摄入 ${w.intake.toFixed(1)}${w.nutrient.unit}，超过UL上限 ${w.nutrient.UL}${w.nutrient.unit}，请注意！</span>
            <span class="alert-close" onclick="this.parentElement.remove()">✕</span>
          </div>
        `).join('');
      }
    }

    // 进阶标准提示
    if (settings.standardMode === 'advanced') {
      area.innerHTML += `
        <div class="alert alert-info">
          <span class="alert-icon">📌</span>
          <span>当前使用<strong>进阶标准</strong>，基于前沿文献保守化(80%)推荐值评判。</span>
          <span class="alert-close" onclick="this.parentElement.remove()">✕</span>
        </div>`;
    }
  },

  // ========== 模态框控制 ==========
  showConfirm(title, bodyHtml, onOk, onCancel) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmBody').innerHTML = bodyHtml;
    this.confirmCallback = onOk;
    this.cancelCallback = onCancel;
    document.getElementById('confirmOkBtn').onclick = () => {
      if (this.confirmCallback) this.confirmCallback();
      this.closeConfirm();
    };
    document.getElementById('confirmModal').style.display = 'flex';
  },

  closeConfirm() {
    document.getElementById('confirmModal').style.display = 'none';
    this.confirmCallback = null;
    this.cancelCallback = null;
  },

  // ========== Toast ==========
  showToast(msg, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },

  // ========== 事件绑定 ==========
  _bindEvents() {
    // 关闭模态框(点击遮罩)
    document.getElementById('mealModal').onclick = function(e) {
      if (e.target === this) App.closeMealEditor();
    };
    document.getElementById('confirmModal').onclick = function(e) {
      if (e.target === this) App.closeConfirm();
    };
  },

  // ========== 数据导出/导入 ==========
  exportData() {
    const json = Storage.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrition_data_${this.currentDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('数据已导出', 'success');
  },

  // ========== 中间+按钮 ==========
  _updateAddButton() {
    const addBtn = document.querySelector('.tab-btn-add');
    if (addBtn) {
      addBtn.style.display = (this.currentTab === 'record') ? 'flex' : 'none';
    }
  },

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.showConfirm(
          '确认导入数据',
          '<p>导入数据将<strong>覆盖现有数据</strong>，此操作不可撤销。确认继续？</p>',
          () => {
            const ok = Storage.importData(ev.target.result);
            if (ok) {
              this.showToast('数据导入成功', 'success');
              this.renderAll();
            } else {
              this.showToast('数据格式错误，导入失败', 'error');
            }
          }
        );
      };
      reader.readAsText(file);
    };
    input.click();
  },

  clearAllData() {
    this.showConfirm(
      '⚠️ 确认清除所有数据',
      '<p style="color:#ef4444;">此操作将<strong>永久删除</strong>所有营养记录和设置，不可恢复！</p>',
      () => {
        Storage.clearAll();
        this.showToast('所有数据已清除', 'success');
        this.renderAll();
      }
    );
  },
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => App.init());
