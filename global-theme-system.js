/**
 * GameBox 全局主题系统 v2.0
 * Global Theme System for All Pages
 * 支持所有页面、所有组件的主题切换
 */

(function() {
  'use strict';
  
  // ==========================================
  // 主题配置 - 基于知名游戏
  // ==========================================
  
  const GAME_THEMES = {
    // 黑神话：悟空主题
    wukong: {
      id: 'wukong',
      name: '黑神话：悟空',
      nameEn: 'Black Myth: Wukong',
      icon: '🐵',
      description: '东方神话，金色辉煌',
      colors: {
        primary: '#FFD700',      // 金箍棒金
        secondary: '#B8860B',    // 暗金
        accent: '#FF6B00',       // 火焰橙
        background: {
          primary: '#1A0F0A',    // 深棕黑
          secondary: '#2D1810',  // 棕褐
          card: '#3D2418'        // 卡片背景
        },
        text: {
          primary: '#FFF8DC',    // 象牙白
          secondary: '#D4C4A8',  // 暗米色
          muted: '#8B7355'       // 褐灰
        },
        border: '#8B6914',       // 金铜边框
        success: '#DAA520',      // 金色
        warning: '#FF8C00',      // 深橙
        danger: '#DC143C',       // 猩红
        info: '#FFD700'          // 金黄
      },
      fonts: {
        primary: '"Ma Shan Zheng", "KaiTi", "STKaiti", cursive',
        secondary: '"Zhi Mang Xing", "STXingkai", cursive'
      }
    },
    
    // 巫师3主题
    witcher: {
      id: 'witcher',
      name: '巫师3',
      nameEn: 'The Witcher 3',
      icon: '⚔️',
      description: '中世纪奇幻，狼之风暴',
      colors: {
        primary: '#C41E3A',      // 血红
        secondary: '#8B0000',    // 暗红
        accent: '#FFD700',       // 金色符文
        background: {
          primary: '#0A0A0A',    // 纯黑
          secondary: '#1A1A1A',  // 深灰
          card: '#2A2A2A'        // 炭灰
        },
        text: {
          primary: '#E8E8E8',    // 银白
          secondary: '#B8B8B8',  // 浅灰
          muted: '#707070'       // 中灰
        },
        border: '#4A4A4A',       // 钢灰
        success: '#228B22',      // 森林绿
        warning: '#FFA500',      // 琥珀
        danger: '#8B0000',       // 血红
        info: '#4682B4'          // 钢蓝
      },
      fonts: {
        primary: '"Cinzel", "Times New Roman", serif',
        secondary: '"Philosopher", Georgia, serif'
      }
    },
    
    // GTA5主题
    gta5: {
      id: 'gta5',
      name: 'GTA5',
      nameEn: 'Grand Theft Auto V',
      icon: '🚗',
      description: '都市霓虹，自由狂野',
      colors: {
        primary: '#00FF00',      // 霓虹绿
        secondary: '#32CD32',    // 青柠绿
        accent: '#FF1493',       // 霓虹粉
        background: {
          primary: '#000000',    // 纯黑
          secondary: '#0D0D0D',  // 墨黑
          card: '#1A1A1A'        // 深黑
        },
        text: {
          primary: '#FFFFFF',    // 纯白
          secondary: '#CCCCCC',  // 浅灰
          muted: '#808080'       // 中灰
        },
        border: '#00FF00',       // 霓虹绿边框
        success: '#00FF00',      // 绿色
        warning: '#FFD700',      // 金色
        danger: '#FF0000',       // 红色
        info: '#00BFFF'          // 深天蓝
      },
      fonts: {
        primary: '"Pricedown", "Impact", sans-serif',
        secondary: '"Roboto Condensed", Arial, sans-serif'
      }
    },
    
    // 荒野大镖客2主题
    rdr2: {
      id: 'rdr2',
      name: '荒野大镖客2',
      nameEn: 'Red Dead Redemption 2',
      icon: '🤠',
      description: '西部荒野，黄昏余晖',
      colors: {
        primary: '#D4AF37',      // 金黄
        secondary: '#8B4513',    // 马鞍棕
        accent: '#CD5C5C',       // 印第安红
        background: {
          primary: '#2B1810',    // 深棕
          secondary: '#3D2817',  // 泥土棕
          card: '#4A3425'        // 木板棕
        },
        text: {
          primary: '#F5DEB3',    // 麦色
          secondary: '#DEB887',  // 硬木色
          muted: '#A0826D'       // 沙土色
        },
        border: '#8B7355',       // 皮革棕
        success: '#6B8E23',      // 橄榄绿
        warning: '#DAA520',      // 金棒色
        danger: '#8B0000',       // 暗红
        info: '#4682B4'          // 钢蓝
      },
      fonts: {
        primary: '"Rye", "Courier New", monospace',
        secondary: '"Special Elite", Georgia, serif'
      }
    },
    
    // 博德之门3主题
    bg3: {
      id: 'bg3',
      name: '博德之门3',
      nameEn: 'Baldur\'s Gate 3',
      icon: '🐉',
      description: 'DND奇幻，紫色魔法',
      colors: {
        primary: '#9370DB',      // 中紫
        secondary: '#6A5ACD',    // 岩蓝
        accent: '#FF4500',       // 橙红
        background: {
          primary: '#1C0A28',    // 深紫黑
          secondary: '#2D1B3D',  // 紫黑
          card: '#3E2A52'        // 深紫
        },
        text: {
          primary: '#E6E6FA',    // 薰衣草白
          secondary: '#D8BFD8',  // 蓟色
          muted: '#9370DB'       // 中紫
        },
        border: '#8B7AB8',       // 紫灰
        success: '#32CD32',      // 青柠绿
        warning: '#FFD700',      // 金色
        danger: '#DC143C',       // 猩红
        info: '#9370DB'          // 中紫
      },
      fonts: {
        primary: '"Spectral", "Garamond", serif',
        secondary: '"Lora", Georgia, serif'
      }
    },
    
    // 艾尔登法环主题
    eldenring: {
      id: 'eldenring',
      name: '艾尔登法环',
      nameEn: 'Elden Ring',
      icon: '💍',
      description: '黑暗魂系，黄金律法',
      colors: {
        primary: '#FDB813',      // 金色法环
        secondary: '#B8860B',    // 暗金
        accent: '#00CED1',       // 暗绿松石
        background: {
          primary: '#0C0C0C',    // 深黑
          secondary: '#1A1A1A',  // 炭黑
          card: '#2A2A2A'        // 暗灰
        },
        text: {
          primary: '#E8D4A8',    // 古金色
          secondary: '#C4B5A0',  // 石色
          muted: '#8A7968'       // 灰棕
        },
        border: '#5C5C5C',       // 钢灰
        success: '#8FBC8F',      // 暗海绿
        warning: '#DAA520',      // 金棒色
        danger: '#8B0000',       // 暗红
        info: '#4682B4'          // 钢蓝
      },
      fonts: {
        primary: '"Trajan Pro", "Cinzel", serif',
        secondary: '"Marcellus", Georgia, serif'
      }
    },
    
    // 赛博朋克2077主题
    cyberpunk2077: {
      id: 'cyberpunk2077',
      name: '赛博朋克2077',
      nameEn: 'Cyberpunk 2077',
      icon: '🌃',
      description: '夜之城霓虹，矩阵雨特效',
      colors: {
        primary: '#00F0FF',      // 夜之城青色
        secondary: '#FF003C',    // 霓虹粉
        accent: '#FFED4E',       // 黄色高光
        background: {
          primary: '#0a0e27',    // 深蓝黑
          secondary: '#16213e',  // 暗蓝
          card: '#1a2332'        // 卡片蓝
        },
        text: {
          primary: '#00F0FF',    // 青色文字
          secondary: '#e2e8f0',  // 银白
          muted: '#94a3b8'       // 灰蓝
        },
        border: '#00F0FF',       // 青色边框
        success: '#00ff88',      // 霓虹绿
        warning: '#FFED4E',      // 黄色
        danger: '#FF003C',       // 霓虹粉红
        info: '#00F0FF'          // 青色
      },
      fonts: {
        primary: '"Orbitron", "Rajdhani", sans-serif',
        secondary: '"Rajdhani", "Roboto", sans-serif'
      }
    },
    
    // 原始赛博朋克主题
    cyberpunk: {
      id: 'cyberpunk',
      name: '赛博朋克',
      nameEn: 'Cyberpunk',
      icon: '💠',
      description: '未来科技，蓝色霓虹',
      colors: {
        primary: '#38bdf8',
        secondary: '#0ea5e9',
        accent: '#06b6d4',
        background: {
          primary: '#0f172a',
          secondary: '#1e293b',
          card: '#334155'
        },
        text: {
          primary: '#f8fafc',
          secondary: '#e2e8f0',
          muted: '#94a3b8'
        },
        border: '#475569',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#06b6d4'
      },
      fonts: {
        primary: '"Orbitron", sans-serif',
        secondary: '"Rajdhani", sans-serif'
      }
    }
  };
  
  const STORAGE_KEY = 'gamebox_global_theme';
  const DEFAULT_THEME = 'cyberpunk2077';
  
  // ==========================================
  // 全局主题管理器类
  // ==========================================
  
  class GlobalThemeManager {
    constructor() {
      this.currentTheme = this.loadTheme();
      this.styleElement = null;
      this.fontLinkElement = null;
      this.init();
    }
    
    init() {
      console.log('🎨 全局主题系统初始化...');
      this.loadThemeFonts();
      this.applyTheme(this.currentTheme, false);
      this.injectGlobalStyles();
      this.createThemeSwitcher();
      console.log('✅ 全局主题系统已加载，当前主题:', GAME_THEMES[this.currentTheme].name);
    }
    
    loadTheme() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && GAME_THEMES[saved]) {
          return saved;
        }
      } catch (e) {
        console.warn('无法读取主题设置:', e);
      }
      return DEFAULT_THEME;
    }
    
    saveTheme(themeId) {
      try {
        localStorage.setItem(STORAGE_KEY, themeId);
      } catch (e) {
        console.warn('无法保存主题设置:', e);
      }
    }
    
    // 加载主题字体
    loadThemeFonts() {
      if (this.fontLinkElement) {
        this.fontLinkElement.remove();
      }
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&family=Cinzel:wght@400;700&family=Spectral:wght@400;700&family=Special+Elite&display=swap';
      document.head.appendChild(link);
      
      this.fontLinkElement = link;
    }
    
    // 应用主题
    applyTheme(themeId, animate = true) {
      if (!GAME_THEMES[themeId]) {
        console.warn('主题不存在:', themeId);
        return;
      }
      
      const theme = GAME_THEMES[themeId];
      const body = document.body;
      
      // 添加过渡动画
      if (animate) {
        body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
          body.style.transition = '';
        }, 500);
      }
      
      // 移除所有主题类
      Object.keys(GAME_THEMES).forEach(id => {
        body.classList.remove(`theme-${id}`);
      });
      
      // 添加新主题类
      body.classList.add(`theme-${themeId}`);
      body.dataset.theme = themeId;
      
      // 特殊处理：赛博朋克主题使用theme-cyberpunk2077类名以启用特效
      if (themeId === 'cyberpunk' || themeId === 'cyberpunk2077') {
        body.classList.add('theme-cyberpunk2077');
      } else {
        body.classList.remove('theme-cyberpunk2077');
      }
      
      // 注入CSS变量
      this.injectThemeVariables(theme);
      
      // 控制特效系统
      this.toggleCyberEffects(themeId === 'cyberpunk' || themeId === 'cyberpunk2077');
      this.toggleWukongEffects(themeId === 'wukong');
      this.toggleWitcherEffects(themeId === 'witcher');
      this.toggleGTA5Effects(themeId === 'gta5');
      this.toggleRDR2Effects(themeId === 'rdr2');
      this.toggleBG3Effects(themeId === 'bg3');
      this.toggleEldenRingEffects(themeId === 'eldenring');
      
      // 保存当前主题
      this.currentTheme = themeId;
      this.saveTheme(themeId);
      
      // 更新UI
      this.updateSwitcherUI();
      
      // 触发事件
      this.dispatchThemeChangeEvent(themeId, theme);
      
      console.log('✅ 主题已切换:', theme.name);
    }
    
    // 控制赛博朋克特效的显示/隐藏
    toggleCyberEffects(enable) {
      const matrixRain = document.querySelector('.matrix-rain');
      const particles = document.querySelector('.cyber-particles');
      const scrollProgress = document.querySelector('.scroll-progress');
      
      if (enable) {
        // 启用特效
        if (matrixRain) matrixRain.style.display = 'block';
        if (particles) particles.style.display = 'block';
        if (scrollProgress) scrollProgress.style.display = 'block';
      } else {
        // 禁用特效
        if (matrixRain) matrixRain.style.display = 'none';
        if (particles) particles.style.display = 'none';
        if (scrollProgress) scrollProgress.style.display = 'none';
      }
    }
    
    // 控制悟空主题特效的显示/隐藏
    toggleWukongEffects(enable) {
      if (enable) {
        // 启动悟空特效系统 (enhanced version)
        if (window.WukongEnhancedEffects && !window.wukongEffects) {
          window.wukongEffects = new window.WukongEnhancedEffects();
        } else if (window.wukongEffects) {
          window.wukongEffects.toggle(true);
        }
      } else {
        // 停止悟空特效系统
        if (window.wukongEffects) {
          window.wukongEffects.destroy();
          window.wukongEffects = null;
        }
      }
    }
    
    // 控制巫师3主题特效
    toggleWitcherEffects(enable) {
      if (enable) {
        if (window.Witcher3EffectsSystem && !window.witcherEffects) {
          window.witcherEffects = new window.Witcher3EffectsSystem();
        } else if (window.witcherEffects) {
          window.witcherEffects.toggle(true);
        }
      } else {
        if (window.witcherEffects) {
          window.witcherEffects.destroy();
          window.witcherEffects = null;
        }
      }
    }
    
    // 控制GTA5主题特效
    toggleGTA5Effects(enable) {
      if (enable) {
        if (window.GTA5EffectsSystem && !window.gta5Effects) {
          window.gta5Effects = new window.GTA5EffectsSystem();
        } else if (window.gta5Effects) {
          window.gta5Effects.toggle(true);
        }
      } else {
        if (window.gta5Effects) {
          window.gta5Effects.destroy();
          window.gta5Effects = null;
        }
      }
    }
    
    // 控制荒野大镖客2主题特效
    toggleRDR2Effects(enable) {
      if (enable) {
        if (window.RDR2EffectsSystem && !window.rdr2Effects) {
          window.rdr2Effects = new window.RDR2EffectsSystem();
        } else if (window.rdr2Effects) {
          window.rdr2Effects.toggle(true);
        }
      } else {
        if (window.rdr2Effects) {
          window.rdr2Effects.destroy();
          window.rdr2Effects = null;
        }
      }
    }
    
    // 控制博德之门3主题特效
    toggleBG3Effects(enable) {
      if (enable) {
        if (window.BG3EffectsSystem && !window.bg3Effects) {
          window.bg3Effects = new window.BG3EffectsSystem();
        } else if (window.bg3Effects) {
          window.bg3Effects.toggle(true);
        }
      } else {
        if (window.bg3Effects) {
          window.bg3Effects.destroy();
          window.bg3Effects = null;
        }
      }
    }
    
    // 控制艾尔登法环主题特效
    toggleEldenRingEffects(enable) {
      if (enable) {
        if (window.EldenRingEffectsSystem && !window.eldenRingEffects) {
          window.eldenRingEffects = new window.EldenRingEffectsSystem();
        } else if (window.eldenRingEffects) {
          window.eldenRingEffects.toggle(true);
        }
      } else {
        if (window.eldenRingEffects) {
          window.eldenRingEffects.destroy();
          window.eldenRingEffects = null;
        }
      }
    }
    
    // 注入主题CSS变量
    injectThemeVariables(theme) {
      const root = document.documentElement;
      const colors = theme.colors;
      
      // 设置CSS变量
      root.style.setProperty('--theme-primary', colors.primary);
      root.style.setProperty('--theme-secondary', colors.secondary);
      root.style.setProperty('--theme-accent', colors.accent);
      
      root.style.setProperty('--theme-bg-primary', colors.background.primary);
      root.style.setProperty('--theme-bg-secondary', colors.background.secondary);
      root.style.setProperty('--theme-bg-card', colors.background.card);
      
      root.style.setProperty('--theme-text-primary', colors.text.primary);
      root.style.setProperty('--theme-text-secondary', colors.text.secondary);
      root.style.setProperty('--theme-text-muted', colors.text.muted);
      
      // 兼容旧版变量名
      root.style.setProperty('--text-main', colors.text.primary);
      root.style.setProperty('--text-soft', colors.text.secondary);
      root.style.setProperty('--text-muted', colors.text.muted);
      
      root.style.setProperty('--theme-border', colors.border);
      root.style.setProperty('--theme-success', colors.success);
      root.style.setProperty('--theme-warning', colors.warning);
      root.style.setProperty('--theme-danger', colors.danger);
      root.style.setProperty('--theme-info', colors.info);
      
      root.style.setProperty('--theme-font-primary', theme.fonts.primary);
      root.style.setProperty('--theme-font-secondary', theme.fonts.secondary);
    }
    
    // 注入全局样式
    injectGlobalStyles() {
      if (this.styleElement) {
        this.styleElement.remove();
      }
      
      const style = document.createElement('style');
      style.id = 'global-theme-styles';
      style.textContent = this.generateGlobalCSS();
      document.head.appendChild(style);
      
      this.styleElement = style;
    }
    
    // 生成全局CSS
    generateGlobalCSS() {
      return `
        /* ==========================================
           全局主题样式 - 适用所有页面
           ========================================== */
        
        /* 基础样式 */
        body {
          background: linear-gradient(135deg, 
            var(--theme-bg-primary) 0%, 
            var(--theme-bg-secondary) 100%
          ) !important;
          background-attachment: fixed !important;
          color: var(--theme-text-primary) !important;
          font-family: var(--theme-font-secondary), -apple-system, sans-serif !important;
          transition: background 0.5s ease, color 0.5s ease;
        }
        
        /* 滚动条样式 - 全局 */
        * {
          scrollbar-width: thin;
          scrollbar-color: var(--theme-primary) var(--theme-bg-secondary);
        }
        
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--theme-bg-secondary);
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, var(--theme-primary), var(--theme-secondary));
          border-radius: 6px;
          border: 2px solid var(--theme-bg-secondary);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: var(--theme-primary);
          box-shadow: 0 0 10px var(--theme-primary);
        }
        
        /* 卡片样式 */
        .card, .sidebar-card, .sidebar-card-enhanced {
          background: var(--theme-bg-card) !important;
          border-color: var(--theme-border) !important;
          color: var(--theme-text-primary) !important;
        }
        
        /* 标题样式 */
        .card-title, .page-title, .sidebar-title, .sidebar-title-enhanced {
          color: var(--theme-primary) !important;
          font-family: var(--theme-font-primary) !important;
          text-shadow: 0 0 10px var(--theme-primary) !important;
        }
        
        /* 按钮样式 */
        button, .btn, .ranking-tab {
          background: var(--theme-bg-card) !important;
          border-color: var(--theme-border) !important;
          color: var(--theme-text-secondary) !important;
          font-family: var(--theme-font-secondary) !important;
        }
        
        button:hover, .btn:hover, .ranking-tab:hover {
          background: var(--theme-secondary) !important;
          border-color: var(--theme-primary) !important;
          color: var(--theme-text-primary) !important;
          box-shadow: 0 0 15px var(--theme-primary) !important;
        }
        
        .ranking-tab.is-active, button.is-active {
          background: var(--theme-primary) !important;
          border-color: var(--theme-accent) !important;
          color: var(--theme-bg-primary) !important;
          font-weight: 700 !important;
        }
        
        /* 输入框和选择框 */
        input, select, textarea {
          background: var(--theme-bg-secondary) !important;
          border-color: var(--theme-border) !important;
          color: var(--theme-text-primary) !important;
        }
        
        input:focus, select:focus, textarea:focus {
          border-color: var(--theme-primary) !important;
          box-shadow: 0 0 10px var(--theme-primary) !important;
          outline: none !important;
        }
        
        /* 下拉框箭头 */
        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='var(--theme-primary)' d='M6 9L1 4h10z'/%3E%3C/svg%3E") !important;
        }
        
        /* 链接样式 */
        a {
          color: var(--theme-accent) !important;
        }
        
        a:hover {
          color: var(--theme-primary) !important;
          text-shadow: 0 0 8px var(--theme-primary) !important;
        }
        
        /* 导航栏 */
        .header {
          background: var(--theme-bg-primary) !important;
          border-bottom-color: var(--theme-border) !important;
        }
        
        .nav-link {
          color: var(--theme-text-secondary) !important;
        }
        
        .nav-link:hover, .nav-link.is-active {
          color: var(--theme-primary) !important;
          border-bottom-color: var(--theme-primary) !important;
        }
        
        /* Logo */
        .logo-mark {
          background: var(--theme-primary) !important;
          color: var(--theme-bg-primary) !important;
          box-shadow: 0 0 15px var(--theme-primary) !important;
        }
        
        /* 徽章 */
        .badge {
          background: var(--theme-accent) !important;
          color: var(--theme-bg-primary) !important;
        }
        
        /* 排行榜 */
        .ranking-item {
          background: var(--theme-bg-card) !important;
          border-color: var(--theme-border) !important;
        }
        
        .ranking-item:hover {
          border-color: var(--theme-primary) !important;
          box-shadow: 0 0 15px var(--theme-primary) !important;
        }
        
        /* 游戏名称和信息 */
        .ranking-name {
          color: var(--theme-text-primary) !important;
        }
        
        .ranking-meta {
          color: var(--theme-primary) !important;
        }
        
        .ranking-rank, .ranking-pos {
          background: var(--theme-bg-secondary) !important;
          color: var(--theme-primary) !important;
          border-color: var(--theme-border) !important;
        }
        
        .ranking-rank.top1, .ranking-pos--top1 {
          background: var(--theme-primary) !important;
          color: var(--theme-bg-primary) !important;
          box-shadow: 0 0 20px var(--theme-primary) !important;
        }
        
        /* 类型标签 */
        .category-chip {
          background: var(--theme-bg-card) !important;
          border-color: var(--theme-border) !important;
        }
        
        .category-chip:hover {
          background: var(--theme-secondary) !important;
          border-color: var(--theme-primary) !important;
        }
        
        .category-chip.is-active {
          background: var(--theme-primary) !important;
          border-color: var(--theme-accent) !important;
          color: var(--theme-bg-primary) !important;
        }
        
        /* 游戏卡片 */
        .game-card {
          background: var(--theme-bg-card) !important;
          border-color: var(--theme-border) !important;
        }
        
        .game-card:hover {
          border-color: var(--theme-primary) !important;
          box-shadow: 0 0 20px var(--theme-primary) !important;
        }
        
        /* 评分颜色 */
        .rating-high { color: var(--theme-success) !important; }
        .rating-medium { color: var(--theme-warning) !important; }
        .rating-low { color: var(--theme-danger) !important; }
        
        /* 折扣标签 */
        .discount-percent, .discount-badge {
          background: var(--theme-danger) !important;
          color: white !important;
        }
        
        .discount-price {
          color: var(--theme-success) !important;
        }
        
        /* 侧边栏 */
        .sidebar-badge {
          background: var(--theme-accent) !important;
          border-color: var(--theme-primary) !important;
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
        }
      `;
    }
    
    // 创建主题切换器
    createThemeSwitcher() {
      if (document.getElementById('globalThemeSwitcher')) {
        return;
      }
      
      const container = document.createElement('div');
      container.id = 'globalThemeSwitcher';
      container.className = 'global-theme-switcher';
      
      const button = document.createElement('button');
      button.className = 'theme-switcher-btn';
      button.innerHTML = `
        <span class="theme-switcher-icon">🎨</span>
        <span class="theme-switcher-label">主题</span>
      `;
      
      const panel = document.createElement('div');
      panel.className = 'theme-switcher-panel';
      
      Object.entries(GAME_THEMES).forEach(([id, theme]) => {
        const option = document.createElement('div');
        option.className = 'theme-option';
        option.dataset.themeId = id;
        option.innerHTML = `
          <div class="theme-option-icon">${theme.icon}</div>
          <div class="theme-option-info">
            <div class="theme-option-name">${theme.name}</div>
            <div class="theme-option-desc">${theme.description}</div>
          </div>
          <div class="theme-option-check">✓</div>
        `;
        
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          this.applyTheme(id, true);
          this.hidePanel();
        });
        
        panel.appendChild(option);
      });
      
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePanel();
      });
      
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          this.hidePanel();
        }
      });
      
      container.appendChild(button);
      container.appendChild(panel);
      document.body.appendChild(container);
      
      this.injectSwitcherStyles();
      this.updateSwitcherUI();
    }
    
    togglePanel() {
      const panel = document.querySelector('.theme-switcher-panel');
      if (panel) {
        panel.classList.toggle('is-active');
      }
    }
    
    hidePanel() {
      const panel = document.querySelector('.theme-switcher-panel');
      if (panel) {
        panel.classList.remove('is-active');
      }
    }
    
    updateSwitcherUI() {
      const options = document.querySelectorAll('.theme-option');
      options.forEach(option => {
        const themeId = option.dataset.themeId;
        if (themeId === this.currentTheme) {
          option.classList.add('is-active');
        } else {
          option.classList.remove('is-active');
        }
      });
      
      const currentTheme = GAME_THEMES[this.currentTheme];
      const icon = document.querySelector('.theme-switcher-icon');
      if (icon && currentTheme) {
        icon.textContent = currentTheme.icon;
      }
    }
    
    dispatchThemeChangeEvent(themeId, theme) {
      const event = new CustomEvent('globalthemechange', {
        detail: { themeId, theme, timestamp: Date.now() }
      });
      window.dispatchEvent(event);
    }
    
    injectSwitcherStyles() {
      if (document.getElementById('theme-switcher-ui-styles')) {
        return;
      }
      
      const style = document.createElement('style');
      style.id = 'theme-switcher-ui-styles';
      style.textContent = `
        .global-theme-switcher {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 999999;
        }
        
        .theme-switcher-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--theme-bg-card);
          border: 2px solid var(--theme-primary);
          border-radius: 50px;
          color: var(--theme-text-primary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px var(--theme-primary);
          transition: all 0.3s ease;
        }
        
        .theme-switcher-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(0, 0, 0, 0.6), 0 0 30px var(--theme-primary);
        }
        
        .theme-switcher-icon {
          font-size: 20px;
        }
        
        .theme-switcher-panel {
          position: absolute;
          bottom: calc(100% + 15px);
          right: 0;
          min-width: 320px;
          max-height: 70vh;
          overflow-y: auto;
          background: var(--theme-bg-card);
          border: 2px solid var(--theme-primary);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 10px 50px rgba(0, 0, 0, 0.7), 0 0 40px var(--theme-primary);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }
        
        .theme-switcher-panel.is-active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .theme-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          background: var(--theme-bg-secondary);
          border: 2px solid var(--theme-border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .theme-option:last-child {
          margin-bottom: 0;
        }
        
        .theme-option:hover {
          background: var(--theme-bg-primary);
          border-color: var(--theme-primary);
          transform: translateX(3px);
        }
        
        .theme-option.is-active {
          background: var(--theme-primary);
          border-color: var(--theme-accent);
          color: var(--theme-bg-primary);
          box-shadow: 0 0 15px var(--theme-primary);
        }
        
        .theme-option.is-active .theme-option-name,
        .theme-option.is-active .theme-option-desc {
          color: var(--theme-bg-primary) !important;
        }
        
        .theme-option-icon {
          font-size: 28px;
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        
        .theme-option-info {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }
        
        .theme-option-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--theme-text-primary);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .theme-option-desc {
          font-size: 11px;
          color: var(--theme-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .theme-option-check {
          font-size: 20px;
          color: var(--theme-bg-primary);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .theme-option.is-active .theme-option-check {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .global-theme-switcher {
            bottom: 20px;
            right: 20px;
          }
          
          .theme-switcher-btn {
            padding: 10px 16px;
            font-size: 13px;
          }
          
          .theme-switcher-panel {
            min-width: 280px;
          }
        }
      `;
      
      document.head.appendChild(style);
    }
    
    getCurrentTheme() {
      return {
        id: this.currentTheme,
        ...GAME_THEMES[this.currentTheme]
      };
    }
    
    getAllThemes() {
      return Object.entries(GAME_THEMES).map(([id, theme]) => ({
        id,
        ...theme
      }));
    }
  }
  
  // 创建全局实例
  window.GlobalThemeManager = GlobalThemeManager;
  
  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.globalThemeManager = new GlobalThemeManager();
    });
  } else {
    window.globalThemeManager = new GlobalThemeManager();
  }
  
  // 监听主题切换事件
  window.addEventListener('globalthemechange', (e) => {
    console.log('🎨 全局主题已切换:', e.detail.theme.name);
  });
  
})();
