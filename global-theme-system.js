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
    // 黑神话：悟空主题 - 东方神话史诗风格
    wukong: {
      id: 'wukong',
      name: '黑神话：悟空',
      nameEn: 'Black Myth: Wukong',
      icon: '🐵',
      description: '东方神话史诗 · 金箍棒辉煌',
      visualStyle: {
        effects: ['金色粒子', '云雾缭绕', '水墨晕染', '火焰光晕'],
        animations: ['筋斗云', '72变幻影', '金箍棒旋转'],
        uiStyle: '中国传统纹样边框 + 金色装饰'
      },
      colors: {
        primary: '#FFD700',      // 金箍棒金
        secondary: '#DC143C',    // 孙悟空红袍
        accent: '#FF6B00',       // 火焰橙
        background: {
          primary: '#1A0F0A',    // 深棕黑(天宫暗沉)
          secondary: '#2D1810',  // 棕褐(花果山石)
          card: '#3D2418',       // 卡片(寺庙古木)
          gradient: 'radial-gradient(circle at center, #2D1810 0%, #1A0F0A 100%)'  // 水墨渐变
        },
        text: {
          primary: '#FFF8DC',    // 象牙白
          secondary: '#D4C4A8',  // 暗米色
          muted: '#8B7355'       // 褐灰
        },
        border: '#8B6914',       // 金铜边框
        borderGlow: '#FFD700',   // 金色发光
        success: '#DAA520',      // 金色
        warning: '#FF8C00',      // 深橙
        danger: '#DC143C',       // 猩红
        info: '#FFD700'          // 金黄
      },
      fonts: {
        primary: '"Ma Shan Zheng", "KaiTi", "STKaiti", "SimSun", serif',
        secondary: '"Zhi Mang Xing", "STXingkai", "SimHei", sans-serif'
      },
      effects: {
        particles: true,
        cloudMist: true,
        inkWash: true,
        goldenGlow: true
      }
    },
    
    // 巫师3主题 - 中世纪黑暗奇幻风格
    witcher: {
      id: 'witcher',
      name: '巫师3：狂猎',
      nameEn: 'The Witcher 3: Wild Hunt',
      icon: '⚔️',
      description: '中世纪黑暗奇幻 · 狼之风暴',
      visualStyle: {
        effects: ['雪花飘落', '血迹纹理', '符文发光', '野性狂猎'],
        animations: ['剑刃寒光', '猎魔人印记', '狂猎虚影'],
        uiStyle: '金属锈蚀边框 + 血红符文'
      },
      colors: {
        primary: '#C41E3A',      // 狂猎血红
        secondary: '#FFD700',    // 金色符文
        accent: '#8B4513',       // 皮革棕
        background: {
          primary: '#0A0A0A',    // 纯黑(夜晚森林)
          secondary: '#1A1A1A',  // 深灰(石墙)
          card: '#2A2A2A',       // 炭灰(城堡)
          gradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #2A2A2A 100%)'  // 阴暗渐变
        },
        text: {
          primary: '#E8E8E8',    // 银剑光
          secondary: '#B8B8B8',  // 浅灰
          muted: '#707070'       // 铁灰
        },
        border: '#8B0000',       // 血红边框
        borderGlow: '#FFD700',   // 符文光晕
        success: '#228B22',      // 森林绿
        warning: '#FFA500',      // 琥珀
        danger: '#8B0000',       // 血红
        info: '#4682B4'          // 钢蓝
      },
      fonts: {
        primary: '"Cinzel", "Trajan Pro", "Times New Roman", serif',
        secondary: '"Philosopher", "Merriweather", Georgia, serif'
      },
      effects: {
        snowfall: true,
        bloodTexture: true,
        runeGlow: true,
        wildHunt: true
      }
    },
    
    // GTA5主题 - 都市犯罪霓虹风格
    gta5: {
      id: 'gta5',
      name: 'GTA5',
      nameEn: 'Grand Theft Auto V',
      icon: '🚗',
      description: '洛圣都霓虹 · 犯罪都市',
      visualStyle: {
        effects: ['霓虹灯管', '警笛闪烁', '街头涂鸦', '现金飞舞'],
        animations: ['警车追逐光', '美钞雨', '霓虹呼吸'],
        uiStyle: '街头涂鸦边框 + 霓虹发光'
      },
      colors: {
        primary: '#00FF00',      // 霓虹绿(美钞)
        secondary: '#FFD700',    // 金色(财富)
        accent: '#FF1493',       // 霓虹粉(Vice City致敬)
        background: {
          primary: '#000000',    // 纯黑(夜晚洛圣都)
          secondary: '#0D0D0D',  // 墨黑(街道阴影)
          card: '#1A1A1A',       // 深黑(建筑)
          gradient: 'linear-gradient(45deg, #000000 0%, #0D0D0D 50%, #1A1A1A 100%)'  // 城市夜景
        },
        text: {
          primary: '#FFFFFF',    // 纯白
          secondary: '#00FF00',  // 霓虹绿
          muted: '#808080'       // 中灰
        },
        border: '#00FF00',       // 霓虹绿边框
        borderGlow: '#00FF00',   // 霓虹发光
        success: '#00FF00',      // 绿色
        warning: '#FFD700',      // 金色
        danger: '#FF0000',       // 红色(通缉)
        info: '#00BFFF'          // 深天蓝
      },
      fonts: {
        primary: '"Pricedown", "Impact", "Teko", sans-serif',
        secondary: '"Roboto Condensed", "Oswald", Arial, sans-serif'
      },
      effects: {
        neonGlow: true,
        policeSiren: true,
        graffiti: true,
        moneyRain: true
      }
    },
    
    // 荒野大镖客2主题 - 美国西部荒野风格
    rdr2: {
      id: 'rdr2',
      name: '荒野大镖客2',
      nameEn: 'Red Dead Redemption 2',
      icon: '🤠',
      description: '西部荒野 · 黄昏救赎',
      visualStyle: {
        effects: ['沙尘暴', '夕阳余晖', '老照片纹理', '左轮枪烟'],
        animations: ['马蹄印', '子弹轨迹', '牛仔决斗'],
        uiStyle: '木纹边框 + 皮革质感 + 西部字体'
      },
      colors: {
        primary: '#D4AF37',      // 金色(夕阳)
        secondary: '#8B4513',    // 马鞍棕
        accent: '#CD5C5C',       // 印第安红
        background: {
          primary: '#2B1810',    // 深棕(荒漠夜)
          secondary: '#3D2817',  // 泥土棕
          card: '#4A3425',       // 木板棕
          gradient: 'radial-gradient(ellipse at bottom, #D4AF37 0%, #8B4513 30%, #2B1810 70%)'  // 夕阳渐变
        },
        text: {
          primary: '#F5DEB3',    // 麦色
          secondary: '#DEB887',  // 硬木色
          muted: '#A0826D'       // 沙土色
        },
        border: '#8B7355',       // 皮革棕
        borderGlow: '#D4AF37',   // 金色光晕
        success: '#6B8E23',      // 橄榄绿
        warning: '#DAA520',      // 金棒色
        danger: '#8B0000',       // 血红(枪战)
        info: '#4682B4'          // 钢蓝
      },
      fonts: {
        primary: '"Rye", "Smokum", "Courier New", monospace',
        secondary: '"Special Elite", "Covered By Your Grace", Georgia, serif'
      },
      effects: {
        dustStorm: true,
        sunsetGlow: true,
        vintagePaper: true,
        gunSmoke: true
      }
    },
    
    // 博德之门3主题 - DND奇幻冒险风格
    bg3: {
      id: 'bg3',
      name: '博德之门3',
      nameEn: 'Baldur\'s Gate 3',
      icon: '🐉',
      description: 'DND奇幻 · 魔法与龙',
      visualStyle: {
        effects: ['魔法粒子', '紫色法术圈', '20面骰子', '龙鳞纹理'],
        animations: ['魔法阵旋转', '法术释放', '骰子滚动'],
        uiStyle: '魔法书边框 + 紫色魔法光'
      },
      colors: {
        primary: '#9370DB',      // 魔法紫
        secondary: '#FF4500',    // 火焰橙(龙息)
        accent: '#FFD700',       // 金色(传奇)
        background: {
          primary: '#1C0A28',    // 深紫黑(魔法夜)
          secondary: '#2D1B3D',  // 紫黑(地下城)
          card: '#3E2A52',       // 深紫(魔法卡)
          gradient: 'radial-gradient(circle at center, #2D1B3D 0%, #1C0A28 100%)'  // 魔法渐变
        },
        text: {
          primary: '#E6E6FA',    // 薰衣草白
          secondary: '#D8BFD8',  // 蓟色
          muted: '#9370DB'       // 中紫
        },
        border: '#9370DB',       // 紫色边框
        borderGlow: '#FF4500',   // 火焰光晕
        success: '#32CD32',      // 青柠绿(成功)
        warning: '#FFD700',      // 金色(警告)
        danger: '#DC143C',       // 猩红(伤害)
        info: '#9370DB'          // 魔法紫
      },
      fonts: {
        primary: '"Spectral", "IM Fell DW Pica", "Garamond", serif',
        secondary: '"Lora", "Quattrocento", Georgia, serif'
      },
      effects: {
        magicParticles: true,
        spellCircle: true,
        dice20: true,
        dragonScale: true
      }
    },
    
    // 艾尔登法环主题 - 黑暗魂系史诗风格
    eldenring: {
      id: 'eldenring',
      name: '艾尔登法环',
      nameEn: 'Elden Ring',
      icon: '💍',
      description: '黑暗魂系 · 黄金律法',
      visualStyle: {
        effects: ['金色法环', '灵魂粒子', '篝火余烬', '雾气弥漫'],
        animations: ['法环旋转', '灵魂飘散', '死亡重生'],
        uiStyle: '古代石刻边框 + 金色律法纹'
      },
      colors: {
        primary: '#FDB813',      // 金色法环
        secondary: '#B8860B',    // 暗金(失色)
        accent: '#00CED1',       // 月光蓝
        background: {
          primary: '#0C0C0C',    // 深黑(死亡)
          secondary: '#1A1A1A',  // 炭黑(余烬)
          card: '#2A2A2A',       // 暗灰(石棺)
          gradient: 'radial-gradient(ellipse at top, #FDB813 0%, #1A1A1A 40%, #0C0C0C 100%)'  // 法环光辉
        },
        text: {
          primary: '#E8D4A8',    // 古金色
          secondary: '#C4B5A0',  // 石色
          muted: '#8A7968'       // 灰棕
        },
        border: '#FDB813',       // 金色边框
        borderGlow: '#FDB813',   // 律法光辉
        success: '#8FBC8F',      // 暗海绿
        warning: '#DAA520',      // 金棒色
        danger: '#8B0000',       // 血红(致命)
        info: '#00CED1'          // 月光蓝
      },
      fonts: {
        primary: '"Trajan Pro", "Cinzel", "EB Garamond", serif',
        secondary: '"Marcellus", "Crimson Text", Georgia, serif'
      },
      effects: {
        goldenRing: true,
        soulParticles: true,
        bonfireEmber: true,
        mistEffect: true
      }
    },
    
    // 赛博朋克2077主题 - 未来赛博朋克风格
    cyberpunk2077: {
      id: 'cyberpunk2077',
      name: '赛博朋克2077',
      nameEn: 'Cyberpunk 2077',
      icon: '🌃',
      description: '夜之城 · 霓虹与矩阵',
      visualStyle: {
        effects: ['矩阵雨', '霓虹光管', '故障特效', '数字流'],
        animations: ['数码扫描线', '赛博网格', 'Glitch闪烁'],
        uiStyle: '未来科技边框 + 霓虹发光 + 故障艺术'
      },
      colors: {
        primary: '#00F0FF',      // 夜之城青色
        secondary: '#FF003C',    // 霓虹粉红
        accent: '#FFED4E',       // 黄色高光
        background: {
          primary: '#0a0e27',    // 深蓝黑(夜之城)
          secondary: '#16213e',  // 暗蓝(都市阴影)
          card: '#1a2332',       // 卡片蓝
          gradient: 'linear-gradient(180deg, #0a0e27 0%, #16213e 50%, #1a2332 100%)'  // 赛博渐变
        },
        text: {
          primary: '#00F0FF',    // 青色文字
          secondary: '#e2e8f0',  // 银白
          muted: '#94a3b8'       // 灰蓝
        },
        border: '#00F0FF',       // 青色边框
        borderGlow: '#00F0FF',   // 霓虹光晕
        success: '#00ff88',      // 霓虹绿
        warning: '#FFED4E',      // 黄色
        danger: '#FF003C',       // 霓虹粉红
        info: '#00F0FF'          // 青色
      },
      fonts: {
        primary: '"Orbitron", "Exo 2", "Rajdhani", sans-serif',
        secondary: '"Rajdhani", "Saira", "Roboto", sans-serif'
      },
      effects: {
        matrixRain: true,
        neonTubes: true,
        glitchEffect: true,
        digitalStream: true,
        scanlines: true,
        cyberGrid: true
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
      
      // 特殊处理：赛博朋克2077主题启用特效
      if (themeId === 'cyberpunk2077') {
        body.classList.add('theme-cyberpunk2077');
      } else {
        body.classList.remove('theme-cyberpunk2077');
      }
      
      // 注入CSS变量
      this.injectThemeVariables(theme);
      
      // 控制特效系统
      this.toggleCyberEffects(themeId === 'cyberpunk2077');
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
      root.style.setProperty('--theme-border-glow', colors.borderGlow || colors.primary);
      root.style.setProperty('--theme-success', colors.success);
      root.style.setProperty('--theme-warning', colors.warning);
      root.style.setProperty('--theme-danger', colors.danger);
      root.style.setProperty('--theme-info', colors.info);
      
      // 设置背景渐变
      if (colors.background.gradient) {
        root.style.setProperty('--theme-bg-gradient', colors.background.gradient);
      }
      
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
      const currentThemeData = GAME_THEMES[this.currentTheme];
      const bgGradient = currentThemeData?.colors?.background?.gradient || 
        `linear-gradient(135deg, var(--theme-bg-primary) 0%, var(--theme-bg-secondary) 100%)`;
      
      return `
        /* ==========================================
           全局主题样式 - 适用所有页面
           当前主题: ${currentThemeData?.name || '未知'}
           ========================================== */
        
        /* 基础样式 */
        body {
          background: ${bgGradient} !important;
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
        
        /* ==========================================
           主题特色样式 - 每个游戏独特的视觉效果
           ========================================== */
        
        /* 黑神话：悟空主题 - 中国传统纹样 */
        body.theme-wukong .card,
        body.theme-wukong .game-card,
        body.theme-wukong .ranking-item {
          border-style: double !important;
          border-width: 3px !important;
          background: linear-gradient(135deg, #3D2418 0%, #2D1810 100%) !important;
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 215, 0, 0.2) !important;
        }
        
        body.theme-wukong .card-title,
        body.theme-wukong .ranking-name {
          text-shadow: 0 0 10px #FFD700, 0 2px 4px rgba(0, 0, 0, 0.5) !important;
          letter-spacing: 2px !important;
        }
        
        body.theme-wukong button:hover,
        body.theme-wukong .ranking-item:hover {
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 15px rgba(220, 20, 60, 0.4) !important;
          transform: translateY(-2px) !important;
        }
        
        /* 巫师3主题 - 中世纪金属质感 */
        body.theme-witcher .card,
        body.theme-witcher .game-card,
        body.theme-witcher .ranking-item {
          border: 2px solid #8B0000 !important;
          background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%) !important;
          box-shadow: 0 4px 15px rgba(139, 0, 0, 0.5), inset 0 1px 0 rgba(255, 215, 0, 0.1) !important;
          position: relative !important;
        }
        
        body.theme-witcher .card::before,
        body.theme-witcher .game-card::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 2px !important;
          background: linear-gradient(90deg, transparent, #FFD700, transparent) !important;
          opacity: 0.5 !important;
        }
        
        body.theme-witcher .card-title,
        body.theme-witcher .ranking-name {
          font-family: 'Cinzel', 'Trajan Pro', serif !important;
          text-shadow: 0 0 10px #C41E3A, 2px 2px 4px rgba(0, 0, 0, 0.8) !important;
          letter-spacing: 1px !important;
          color: #E8E8E8 !important;
        }
        
        body.theme-witcher .ranking-meta {
          color: #FFD700 !important;
          text-shadow: 0 0 8px #FFD700 !important;
        }
        
        body.theme-witcher .ranking-item {
          transition: all 0.3s ease !important;
        }
        
        body.theme-witcher .ranking-item:hover {
          border-color: #C41E3A !important;
          box-shadow: 0 0 25px rgba(196, 30, 58, 0.8), 0 4px 20px rgba(0, 0, 0, 0.7) !important;
          transform: translateX(5px) !important;
        }
        
        body.theme-witcher button:hover {
          background: linear-gradient(135deg, #8B0000, #C41E3A) !important;
          box-shadow: 0 0 20px rgba(196, 30, 58, 0.8) !important;
        }
        
        /* GTA5主题 - 街头涂鸦霓虹 */
        body.theme-gta5 .card,
        body.theme-gta5 .game-card,
        body.theme-gta5 .ranking-item {
          border: 2px solid #00FF00 !important;
          background: linear-gradient(135deg, #1A1A1A 0%, #000000 100%) !important;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.4), 0 0 40px rgba(0, 255, 0, 0.2) !important;
        }
        
        body.theme-gta5 .card-title,
        body.theme-gta5 .ranking-name {
          font-family: 'Pricedown', 'Impact', sans-serif !important;
          text-shadow: 0 0 15px #00FF00, 0 0 30px #00FF00, 2px 2px 4px rgba(0, 0, 0, 0.9) !important;
          letter-spacing: 3px !important;
          text-transform: uppercase !important;
          color: #FFFFFF !important;
          font-weight: 900 !important;
        }
        
        body.theme-gta5 .ranking-meta {
          color: #FFD700 !important;
          text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700 !important;
          font-weight: 700 !important;
        }
        
        body.theme-gta5 .ranking-item {
          transition: all 0.3s ease !important;
        }
        
        body.theme-gta5 button:hover,
        body.theme-gta5 .ranking-item:hover {
          border-color: #FFD700 !important;
          box-shadow: 0 0 30px rgba(0, 255, 0, 0.8), 0 0 50px rgba(255, 20, 147, 0.4) !important;
          animation: gtaNeonPulse 2s ease-in-out infinite !important;
          transform: translateX(5px) !important;
        }
        
        @keyframes gtaNeonPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 0, 0.8); }
          50% { box-shadow: 0 0 50px rgba(0, 255, 0, 1), 0 0 30px rgba(255, 20, 147, 0.6); }
        }
        
        /* 荒野大镖客2主题 - 西部复古纸质 */
        body.theme-rdr2 .card,
        body.theme-rdr2 .game-card,
        body.theme-rdr2 .ranking-item {
          border: 3px solid #8B7355 !important;
          background: linear-gradient(135deg, #4A3425 0%, #3D2817 100%) !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(212, 175, 55, 0.1) !important;
          position: relative !important;
        }
        
        body.theme-rdr2 .card::after,
        body.theme-rdr2 .game-card::after {
          content: '' !important;
          position: absolute !important;
          inset: 0 !important;
          background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><filter id=\"noise\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" /></filter><rect width=\"100\" height=\"100\" filter=\"url(%23noise)\" opacity=\"0.05\"/></svg>') !important;
          pointer-events: none !important;
        }
        
        body.theme-rdr2 .card-title,
        body.theme-rdr2 .ranking-name {
          font-family: 'Rye', 'Smokum', serif !important;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px #D4AF37 !important;
          letter-spacing: 2px !important;
        }
        
        body.theme-rdr2 button:hover {
          background: linear-gradient(135deg, #8B4513, #D4AF37) !important;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.6) !important;
        }
        
        /* 博德之门3主题 - DND魔法书页 */
        body.theme-bg3 .card,
        body.theme-bg3 .game-card,
        body.theme-bg3 .ranking-item {
          border: 2px solid #9370DB !important;
          background: linear-gradient(135deg, #3E2A52 0%, #2D1B3D 100%) !important;
          box-shadow: 0 0 20px rgba(147, 112, 219, 0.4), 0 4px 15px rgba(0, 0, 0, 0.6) !important;
          position: relative !important;
        }
        
        body.theme-bg3 .card::before,
        body.theme-bg3 .game-card::before {
          content: '' !important;
          position: absolute !important;
          inset: -2px !important;
          border: 2px solid #FF4500 !important;
          border-radius: inherit !important;
          opacity: 0 !important;
          transition: opacity 0.3s ease !important;
        }
        
        body.theme-bg3 .card:hover::before,
        body.theme-bg3 .game-card:hover::before {
          opacity: 0.6 !important;
        }
        
        body.theme-bg3 .card-title,
        body.theme-bg3 .ranking-name {
          font-family: 'Spectral', 'IM Fell DW Pica', serif !important;
          text-shadow: 0 0 15px #9370DB, 0 0 30px #FF4500, 2px 2px 4px rgba(0, 0, 0, 0.8) !important;
        }
        
        body.theme-bg3 button:hover {
          background: linear-gradient(135deg, #9370DB, #6A5ACD) !important;
          box-shadow: 0 0 25px rgba(147, 112, 219, 0.8), 0 0 40px rgba(255, 69, 0, 0.4) !important;
        }
        
        /* 艾尔登法环主题 - 黄金律法光辉 */
        body.theme-eldenring .card,
        body.theme-eldenring .game-card,
        body.theme-eldenring .ranking-item {
          border: 2px solid #FDB813 !important;
          background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%) !important;
          box-shadow: 0 0 20px rgba(253, 184, 19, 0.3), 0 4px 20px rgba(0, 0, 0, 0.8) !important;
          position: relative !important;
        }
        
        body.theme-eldenring .card::after,
        body.theme-eldenring .game-card::after {
          content: '' !important;
          position: absolute !important;
          top: -2px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: 60% !important;
          height: 2px !important;
          background: linear-gradient(90deg, transparent, #FDB813, transparent) !important;
          box-shadow: 0 0 10px #FDB813 !important;
        }
        
        body.theme-eldenring .card-title,
        body.theme-eldenring .ranking-name {
          font-family: 'Trajan Pro', 'Cinzel', serif !important;
          text-shadow: 0 0 15px #FDB813, 0 0 30px #FDB813, 2px 2px 6px rgba(0, 0, 0, 0.9) !important;
          letter-spacing: 3px !important;
        }
        
        body.theme-eldenring button:hover,
        body.theme-eldenring .ranking-item:hover {
          box-shadow: 0 0 30px rgba(253, 184, 19, 0.8), 0 0 50px rgba(253, 184, 19, 0.4) !important;
          animation: eldenRingGlow 2s ease-in-out infinite !important;
        }
        
        @keyframes eldenRingGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(253, 184, 19, 0.6); }
          50% { box-shadow: 0 0 50px rgba(253, 184, 19, 1), 0 0 80px rgba(253, 184, 19, 0.5); }
        }
        
        /* 赛博朋克2077主题 - 矩阵赛博 */
        body.theme-cyberpunk2077 .card,
        body.theme-cyberpunk2077 .game-card,
        body.theme-cyberpunk2077 .ranking-item {
          border: 2px solid #00F0FF !important;
          background: linear-gradient(135deg, #1a2332 0%, #16213e 100%) !important;
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(255, 0, 60, 0.2), inset 0 1px 0 rgba(0, 240, 255, 0.2) !important;
          position: relative !important;
        }
        
        body.theme-cyberpunk2077 .card::before,
        body.theme-cyberpunk2077 .game-card::before {
          content: '' !important;
          position: absolute !important;
          inset: 0 !important;
          background: repeating-linear-gradient(0deg, rgba(0, 240, 255, 0.03) 0px, transparent 2px, transparent 4px) !important;
          pointer-events: none !important;
        }
        
        body.theme-cyberpunk2077 .card-title,
        body.theme-cyberpunk2077 .ranking-name {
          font-family: 'Orbitron', 'Exo 2', sans-serif !important;
          text-shadow: 0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #FF003C, 2px 2px 4px rgba(0, 0, 0, 0.9) !important;
          letter-spacing: 2px !important;
          text-transform: uppercase !important;
        }
        
        body.theme-cyberpunk2077 button:hover,
        body.theme-cyberpunk2077 .ranking-item:hover {
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.8), 0 0 50px rgba(255, 0, 60, 0.4) !important;
          animation: cyberGlitch 0.3s ease-in-out !important;
        }
        
        @keyframes cyberGlitch {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
          75% { transform: translate(-2px, -2px); }
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          /* 移动端简化特效 */
          body.theme-wukong .card,
          body.theme-witcher .card,
          body.theme-gta5 .card,
          body.theme-rdr2 .card,
          body.theme-bg3 .card,
          body.theme-eldenring .card,
          body.theme-cyberpunk2077 .card {
            border-width: 2px !important;
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
