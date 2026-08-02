/**
 * 可视化图表模块
 * 基于 Chart.js 渲染营养分析图表
 */

const Charts = {
  instances: {},

  destroy(chartKey) {
    if (this.instances[chartKey]) {
      this.instances[chartKey].destroy();
      delete this.instances[chartKey];
    }
  },

  destroyAll() {
    Object.keys(this.instances).forEach(k => this.destroy(k));
  },

  // ========== 单日营养达标率 雷达图 ==========
  renderRadarChart(canvasId, intakeData, standardMode) {
    this.destroy('radar');

    const keyNutrients = [
      'vitA', 'vitD', 'vitE', 'vitC', 'vitB1', 'vitB2', 'vitB6', 'vitB12',
      'folate', 'calcium', 'iron', 'zinc', 'magnesium', 'selenium'
    ];

    const labels = keyNutrients.map(k => NUTRITION_STANDARDS.getNutrientName(k));
    const standard = NUTRITION_STANDARDS;

    const basicData = keyNutrients.map(k => {
      const intake = intakeData[k] || 0;
      const rni = standard.getStandard(k, 'basic') || 1;
      return Math.min((intake / rni) * 100, 100);
    });

    const advancedData = standardMode === 'advanced'
      ? keyNutrients.map(k => {
          const intake = intakeData[k] || 0;
          const adv = standard.getStandard(k, 'advanced') || 1;
          return Math.min((intake / adv) * 100, 100);
        })
      : null;

    const datasets = [{
      label: '基础标准达标率',
      data: basicData,
      backgroundColor: 'rgba(45,184,77,0.15)',
      borderColor: 'rgba(45,184,77,1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(45,184,77,1)',
      pointRadius: 3,
    }];

    if (advancedData) {
      datasets.push({
        label: '进阶标准达标率',
        data: advancedData,
        backgroundColor: 'rgba(59,130,246,0.1)',
        borderColor: 'rgba(59,130,246,0.8)',
        borderWidth: 2,
        borderDash: [4, 2],
        pointBackgroundColor: 'rgba(59,130,246,1)',
        pointRadius: 3,
      });
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances['radar'] = new Chart(ctx, {
      type: 'radar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0,
            max: 110,
            ticks: { display: false, stepSize: 25 },
            grid: { color: '#e5e7eb' },
            pointLabels: { font: { size: 10 } }
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 }, padding: 16 } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(0)}%`
            }
          }
        }
      }
    });
  },

  // ========== 宏量营养素 柱状图 ==========
  renderMacroChart(canvasId, intakeData, standardMode) {
    this.destroy('macro');

    const macros = ['energy', 'protein', 'carbohydrate', 'fat', 'fiber'];
    const labels = macros.map(k => NUTRITION_STANDARDS.getNutrientName(k));
    const std = NUTRITION_STANDARDS;

    const intakeValues = macros.map(k => Math.round(intakeData[k] || 0));
    const basicValues = macros.map(k => std.getStandard(k, 'basic') || 0);
    const advancedValues = macros.map(k => std.getStandard(k, 'advanced') || 0);

    const datasets = [
      {
        label: '今日摄入',
        data: intakeValues,
        backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderRadius: 6,
      },
      {
        label: '基础RNI',
        data: basicValues,
        type: 'line',
        borderColor: '#6b7280',
        borderDash: [3,3],
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#6b7280',
        fill: false,
      }
    ];

    if (standardMode === 'advanced') {
      datasets.push({
        label: '进阶标准',
        data: advancedValues,
        type: 'line',
        borderColor: '#3b82f6',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        fill: false,
      });
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances['macro'] = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  },

  // ========== 周期趋势 折线图 ==========
  renderTrendChart(canvasId, dateLabels, intakeSeries, nutrientKeys, standardMode) {
    this.destroy('trend');

    const std = NUTRITION_STANDARDS;
    const datasets = [];

    const colors = [
      '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
    ];

    nutrientKeys.forEach((key, i) => {
      const data = dateLabels.map((_, di) => {
        return intakeSeries[di] ? (intakeSeries[di][key] || 0) : 0;
      });

      datasets.push({
        label: NUTRITION_STANDARDS.getNutrientName(key),
        data,
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length] + '20',
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.3,
        fill: false,
      });
    });

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances['trend'] = new Chart(ctx, {
      type: 'line',
      data: { labels: dateLabels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 9 } } }
        },
        scales: {
          y: { beginAtZero: true, title: { display: false } }
        }
      }
    });
  },

  // ========== 营养来源分布 饼图 ==========
  renderSourceChart(canvasId, meals, nutrientKey) {
    this.destroy('source');

    const nutrientNames = {
      'protein': '蛋白质', 'energy': '能量', 'fat': '脂肪', 'carbohydrate': '碳水化合物',
      'calcium': '钙', 'iron': '铁', 'vitC': '维生素C', 'vitD': '维生素D'
    };

    const foodContributions = {};

    meals.forEach(meal => {
      meal.foods.forEach(food => {
        if (food.nutrition && food.nutrition[nutrientKey]) {
          const key = food.name;
          foodContributions[key] = (foodContributions[key] || 0) + food.nutrition[nutrientKey];
        }
      });
    });

    const entries = Object.entries(foodContributions).sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (entries.length === 0) {
      entries.push(['无数据', 1]);
    }

    const total = entries.reduce((sum, [, v]) => sum + v, 0);
    const labels = entries.map(([name, val]) =>
      `${name} (${(val/total*100).toFixed(0)}%)`
    );

    const colors = [
      '#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6',
      '#ec4899','#06b6d4','#84cc16','#f97316','#6366f1'
    ];

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances['source'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: entries.map(([, val]) => val),
          backgroundColor: colors.slice(0, entries.length),
          borderWidth: 1,
          borderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 9 }, boxWidth: 10, padding: 8 }
          }
        }
      }
    });
  },

  // ========== 达标率汇总 仪表板 ==========
  renderSummaryChart(canvasId, intakeData, standardMode) {
    this.destroy('summary');

    const allNutrients = NUTRITION_STANDARDS.nutrients.filter(n => n.key !== 'sodium');
    const std = NUTRITION_STANDARDS;

    const categories = [...new Set(allNutrients.map(n => n.category))];
    const catNames = {
      macro: '宏量营养素', fatSoluble: '脂溶性维生素', waterSoluble: '水溶性维生素', mineral: '矿物质'
    };

    const datasets = [];
    const colorMap = {
      basic: { bg: 'rgba(45,184,77,0.6)', border: '#2db84d' },
      advanced: { bg: 'rgba(59,130,246,0.6)', border: '#3b82f6' }
    };

    ['basic', 'advanced'].forEach(mode => {
      if (mode === 'advanced' && standardMode !== 'advanced') return;
      const data = categories.map(cat => {
        const nuts = allNutrients.filter(n => n.category === cat);
        const rates = nuts.map(n => {
          const intake = intakeData[n.key] || 0;
          const st = std.getStandard(n.key, mode) || 1;
          return Math.min(intake / st, 1);
        });
        return rates.length > 0
          ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length * 100)
          : 0;
      });

      datasets.push({
        label: mode === 'basic' ? '基础标准均值达标率' : '进阶标准均值达标率',
        data,
        backgroundColor: colorMap[mode].bg,
        borderColor: colorMap[mode].border,
        borderWidth: 1,
      });
    });

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.instances['summary'] = new Chart(ctx, {
      type: 'bar',
      data: { labels: categories.map(c => catNames[c] || c), datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
        },
        scales: {
          x: { min: 0, max: 110, ticks: { callback: v => v + '%' } }
        }
      }
    });
  },
};
