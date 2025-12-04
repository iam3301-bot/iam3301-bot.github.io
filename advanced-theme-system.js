/**
 * GameBox 高级主题系统 v3.0
 * Advanced Theme System with Visual Effects
 * 包含背景动画、粒子效果、特殊视觉效果
 */

(function() {
  'use strict';
  
  // ==========================================
  // 主题配置 - 每个主题包含完整的视觉效果
  // ==========================================
  
  const ADVANCED_THEMES = {
    // 赛博朋克2077主题
    cyberpunk2077: {
      id: 'cyberpunk2077',
      name: '赛博朋克2077',
      nameEn: 'Cyberpunk 2077',
      icon: '🌃',
      description: '夜之城霓虹，矩阵雨特效',
      colors: {
        primary: '#00F0FF',
        secondary: '#FF003C',
        accent: '#FFED4E',
        background: {
          primary: '#0a0e27',
          secondary: '#16213e',
          card: '#1a2332'
        },
        text: {
          primary: '#00F0FF',
          secondary: '#e2e8f0',
          muted: '#94a3b8'
        },
        border: '#00F0FF',
        success: '#00ff88',
        warning: '#FFED4E',
        danger: '#FF003C',
        info: '#00F0FF'
      },
      effects: {
        matrixRain: {
          enabled: true,
          color: '#00F0FF',
          columns: 20,
          speed: [8, 15],
          characters: '01アイウエオカキクセタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
        },
        particles: {
          enabled: true,
          count: 40,
          colors: ['#00F0FF', '#FF003C', '#FFED4E'],
          speed: [15, 25],
          size: [2, 5]
        },
        scanlines: {
          enabled: true,
          opacity: 0.05
        },
        glitch: {
          enabled: true,
          interval: [10000, 20000]
        },
        backgroundAnimation: 'cyber-grid'
      }
    },
    
    // 黑神话：悟空主题
    wukong: {
      id: 'wukong',
      name: '黑神话：悟空',
      nameEn: 'Black Myth: Wukong',
      icon: '🐵',
      description: '金箍棒辉煌，云雾缭绕',
      colors: {
        primary: '#FFD700',
        secondary: '#B8860B',
        accent: '#FF6B00',
        background: {
          primary: '#1A0F0A',
          secondary: '#2D1810',
          card: '#3D2418'
        },
        text: {
          primary: '#FFF8DC',
          secondary: '#D4C4A8',
          muted: '#8B7355'
        },
        border: '#8B6914',
        success: '#DAA520',
        warning: '#FF8C00',
        danger: '#DC143C',
        info: '#FFD700'
      },
      effects: {
        particles: {
          enabled: true,
          count: 30,
          colors: ['#FFD700', '#FF6B00'],
          type: 'golden-sparks',
          speed: [20, 30],
          size: [3, 8]
        },
        clouds: {
          enabled: true,
          count: 5,
          speed: 60,
          opacity: 0.2
        },
        lightRays: {
          enabled: true,
          color: '#FFD700',
          count: 8
        },
        backgroundAnimation: 'chinese-clouds'
      }
    },
    
    // 巫师3主题
    witcher3: {
      id: 'witcher3',
      name: '巫师3',
      nameEn: 'The Witcher 3',
      icon: '⚔️',
      description: '狼派风暴，魔法符文',
      colors: {
        primary: '#C41E3A',
        secondary: '#8B0000',
        accent: '#FFD700',
        background: {
          primary: '#0A0A0A',
          secondary: '#1A1A1A',
          card: '#2A2A2A'
        },
        text: {
          primary: '#E8E8E8',
          secondary: '#B8B8B8',
          muted: '#707070'
        },
        border: '#4A4A4A',
        success: '#228B22',
        warning: '#FFA500',
        danger: '#8B0000',
        info: '#4682B4'
      },
      effects: {
        particles: {
          enabled: true,
          count: 25,
          colors: ['#C41E3A', '#FFD700'],
          type: 'embers',
          speed: [10, 20],
          size: [2, 4]
        },
        runes: {
          enabled: true,
          count: 6,
          symbols: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'],
          color: '#FFD700',
          glowIntensity: 0.8
        },
        fog: {
          enabled: true,
          density: 0.3,
          speed: 40
        },
        backgroundAnimation: 'medieval-fog'
      }
    },
    
    // GTA5主题
    gta5: {
      id: 'gta5',
      name: 'GTA5',
      nameEn: 'Grand Theft Auto V',
      icon: '🚗',
      description: '洛圣都夜色，霓虹闪烁',
      colors: {
        primary: '#00FF00',
        secondary: '#32CD32',
        accent: '#FF1493',
        background: {
          primary: '#000000',
          secondary: '#0D0D0D',
          card: '#1A1A1A'
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
          muted: '#808080'
        },
        border: '#00FF00',
        success: '#00FF00',
        warning: '#FFD700',
        danger: '#FF0000',
        info: '#00BFFF'
      },
      effects: {
        neonStrips: {
          enabled: true,
          count: 8,
          colors: ['#00FF00', '#FF1493', '#00BFFF'],
          speed: 2
        },
        particles: {
          enabled: true,
          count: 35,
          colors: ['#00FF00', '#FF1493'],
          type: 'neon-sparks',
          speed: [15, 25],
          size: [2, 6]
        },
        scanlines: {
          enabled: true,
          opacity: 0.03
        },
        backgroundAnimation: 'city-lights'
      }
    },
    
    // 荒野大镖客2主题
    rdr2: {
      id: 'rdr2',
      name: '荒野大镖客2',
      nameEn: 'Red Dead Redemption 2',
      icon: '🤠',
      description: '西部黄昏，风沙滚滚',
      colors: {
        primary: '#D4AF37',
        secondary: '#8B4513',
        accent: '#CD5C5C',
        background: {
          primary: '#2B1810',
          secondary: '#3D2817',
          card: '#4A3425'
        },
        text: {
          primary: '#F5DEB3',
          secondary: '#DEB887',
          muted: '#A0826D'
        },
        border: '#8B7355',
        success: '#6B8E23',
        warning: '#DAA520',
        danger: '#8B0000',
        info: '#4682B4'
      },
      effects: {
        dust: {
          enabled: true,
          count: 30,
          color: '#D4AF37',
          speed: [20, 35],
          size: [1, 3]
        },
        sunRays: {
          enabled: true,
          color: '#D4AF37',
          opacity: 0.15,
          count: 10
        },
        tumbleweed: {
          enabled: true,
          count: 2,
          speed: 45
        },
        backgroundAnimation: 'desert-sunset'
      }
    },
    
    // 博德之门3主题
    bg3: {
      id: 'bg3',
      name: '博德之门3',
      nameEn: 'Baldur\'s Gate 3',
      icon: '🐉',
      description: 'DND魔法，紫色幽光',
      colors: {
        primary: '#9370DB',
        secondary: '#6A5ACD',
        accent: '#FF4500',
        background: {
          primary: '#1C0A28',
          secondary: '#2D1B3D',
          card: '#3E2A52'
        },
        text: {
          primary: '#E6E6FA',
          secondary: '#D8BFD8',
          muted: '#9370DB'
        },
        border: '#8B7AB8',
        success: '#32CD32',
        warning: '#FFD700',
        danger: '#DC143C',
        info: '#9370DB'
      },
      effects: {
        magicCircles: {
          enabled: true,
          count: 3,
          color: '#9370DB',
          rotationSpeed: 30
        },
        particles: {
          enabled: true,
          count: 40,
          colors: ['#9370DB', '#FF4500'],
          type: 'magic-sparks',
          speed: [10, 20],
          size: [2, 5]
        },
        arcane: {
          enabled: true,
          density: 0.2,
          color: '#9370DB'
        },
        backgroundAnimation: 'magic-realm'
      }
    },
    
    // 艾尔登法环主题
    eldenring: {
      id: 'eldenring',
      name: '艾尔登法环',
      nameEn: 'Elden Ring',
      icon: '💍',
      description: '黄金树光辉，暗影缭绕',
      colors: {
        primary: '#FDB813',
        secondary: '#B8860B',
        accent: '#00CED1',
        background: {
          primary: '#0C0C0C',
          secondary: '#1A1A1A',
          card: '#2A2A2A'
        },
        text: {
          primary: '#E8D4A8',
          secondary: '#C4B5A0',
          muted: '#8A7968'
        },
        border: '#5C5C5C',
        success: '#8FBC8F',
        warning: '#DAA520',
        danger: '#8B0000',
        info: '#4682B4'
      },
      effects: {
        goldenRing: {
          enabled: true,
          color: '#FDB813',
          pulseSpeed: 3,
          glowIntensity: 1
        },
        particles: {
          enabled: true,
          count: 30,
          colors: ['#FDB813', '#00CED1'],
          type: 'rune-fragments',
          speed: [15, 25],
          size: [2, 4]
        },
        shadows: {
          enabled: true,
          density: 0.4,
          speed: 50
        },
        backgroundAnimation: 'golden-tree'
      }
    }
  };
  
  const STORAGE_KEY = 'gamebox_advanced_theme';
  const DEFAULT_THEME = 'cyberpunk2077';
  
  // ==========================================
  // 高级主题管理器类
  // ==========================================
  
  class AdvancedThemeManager {
    constructor() {
      this.currentTheme = this.loadTheme();
      this.effectsContainer = null;
      this.activeEffects = [];
      this.init();
    }
    
    init() {
      console.log('🎮 高级主题系统初始化...');
      this.createEffectsContainer();
      this.applyTheme(this.currentTheme, false);
      this.createThemeSwitcher();
      console.log('✅ 高级主题系统已加载，当前主题:', ADVANCED_THEMES[this.currentTheme].name);
    }
    
    loadTheme() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && ADVANCED_THEMES[saved]) {
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
    
    createEffectsContainer() {
      this.effectsContainer = document.createElement('div');
      this.effectsContainer.id = 'theme-effects-container';
      this.effectsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
      `;
      document.body.appendChild(this.effectsContainer);
    }
    
    applyTheme(themeId, animate = true) {
      if (!ADVANCED_THEMES[themeId]) {
        console.warn('主题不存在:', themeId);
        return;
      }
      
      const theme = ADVANCED_THEMES[themeId];
      
      // 清除旧特效
      this.clearEffects();
      
      // 应用颜色
      this.applyColors(theme.colors);
      
      // 应用特效
      this.applyEffects(theme.effects);
      
      // 保存主题
      this.currentTheme = themeId;
      this.saveTheme(themeId);
      
      // 更新UI
      this.updateSwitcherUI();
      
      // 触发事件
      this.dispatchThemeChangeEvent(themeId, theme);
      
      console.log('✅ 主题已切换:', theme.name);
    }
    
    applyColors(colors) {
      const root = document.documentElement;
      root.style.setProperty('--theme-primary', colors.primary);
      root.style.setProperty('--theme-secondary', colors.secondary);
      root.style.setProperty('--theme-accent', colors.accent);
      root.style.setProperty('--theme-bg-primary', colors.background.primary);
      root.style.setProperty('--theme-bg-secondary', colors.background.secondary);
      root.style.setProperty('--theme-bg-card', colors.background.card);
      root.style.setProperty('--theme-text-primary', colors.text.primary);
      root.style.setProperty('--theme-text-secondary', colors.text.secondary);
      root.style.setProperty('--theme-text-muted', colors.text.muted);
      root.style.setProperty('--theme-border', colors.border);
      root.style.setProperty('--theme-success', colors.success);
      root.style.setProperty('--theme-warning', colors.warning);
      root.style.setProperty('--theme-danger', colors.danger);
      root.style.setProperty('--theme-info', colors.info);
      
      // 应用背景
      document.body.style.background = `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`;
      document.body.style.backgroundAttachment = 'fixed';
    }
    
    applyEffects(effects) {
      // 根据特效配置创建视觉效果
      if (effects.matrixRain && effects.matrixRain.enabled) {
        this.createMatrixRain(effects.matrixRain);
      }
      
      if (effects.particles && effects.particles.enabled) {
        this.createParticles(effects.particles);
      }
      
      if (effects.scanlines && effects.scanlines.enabled) {
        this.createScanlines(effects.scanlines);
      }
      
      if (effects.clouds && effects.clouds.enabled) {
        this.createClouds(effects.clouds);
      }
      
      if (effects.lightRays && effects.lightRays.enabled) {
        this.createLightRays(effects.lightRays);
      }
      
      if (effects.runes && effects.runes.enabled) {
        this.createRunes(effects.runes);
      }
      
      if (effects.neonStrips && effects.neonStrips.enabled) {
        this.createNeonStrips(effects.neonStrips);
      }
      
      if (effects.dust && effects.dust.enabled) {
        this.createDust(effects.dust);
      }
      
      if (effects.magicCircles && effects.magicCircles.enabled) {
        this.createMagicCircles(effects.magicCircles);
      }
      
      if (effects.goldenRing && effects.goldenRing.enabled) {
        this.createGoldenRing(effects.goldenRing);
      }
    }
    
    // 创建矩阵雨效果
    createMatrixRain(config) {
      const container = document.createElement('div');
      container.className = 'matrix-rain-effect';
      container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      `;
      
      for (let i = 0; i < config.columns; i++) {
        const column = document.createElement('div');
        column.style.cssText = `
          position: absolute;
          top: -100%;
          left: ${(i / config.columns) * 100}%;
          color: ${config.color};
          font-size: 14px;
          font-family: monospace;
          white-space: pre;
          opacity: 0.7;
          text-shadow: 0 0 5px ${config.color};
          animation: matrix-fall ${config.speed[0] + Math.random() * (config.speed[1] - config.speed[0])}s linear infinite;
          animation-delay: ${Math.random() * 3}s;
        `;
        
        let text = '';
        const chars = config.characters.split('');
        for (let j = 0; j < 15; j++) {
          text += chars[Math.floor(Math.random() * chars.length)] + '\n';
        }
        column.textContent = text;
        
        container.appendChild(column);
      }
      
      this.effectsContainer.appendChild(container);
      this.activeEffects.push(container);
      
      // 添加动画样式
      this.addStyle('matrix-fall', `
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `);
    }
    
    // 创建粒子效果
    createParticles(config) {
      const container = document.createElement('div');
      container.className = 'particles-effect';
      
      for (let i = 0; i < config.count; i++) {
        const particle = document.createElement('div');
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const size = config.size ? config.size[0] + Math.random() * (config.size[1] - config.size[0]) : 3;
        
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          box-shadow: 0 0 10px ${color};
          left: ${Math.random() * 100}%;
          bottom: -10px;
          animation: particle-float ${config.speed[0] + Math.random() * (config.speed[1] - config.speed[0])}s linear infinite;
          animation-delay: ${Math.random() * 5}s;
          opacity: ${0.5 + Math.random() * 0.5};
        `;
        
        container.appendChild(particle);
      }
      
      this.effectsContainer.appendChild(container);
      this.activeEffects.push(container);
      
      this.addStyle('particle-float', `
        @keyframes particle-float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-50vh) translateX(${Math.random() * 100 - 50}px); }
          100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
        }
      `);
    }
    
    // 创建扫描线效果
    createScanlines(config) {
      const scanlines = document.createElement('div');
      scanlines.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, ${config.opacity}) 0px,
          transparent 1px,
          transparent 2px,
          rgba(0, 0, 0, ${config.opacity}) 3px
        );
        pointer-events: none;
      `;
      
      this.effectsContainer.appendChild(scanlines);
      this.activeEffects.push(scanlines);
    }
    
    // 创建云朵效果
    createClouds(config) {
      // TODO: 实现云朵动画
    }
    
    // 创建光线效果
    createLightRays(config) {
      // TODO: 实现光线动画
    }
    
    // 创建符文效果
    createRunes(config) {
      // TODO: 实现符文动画
    }
    
    // 创建霓虹条效果
    createNeonStrips(config) {
      // TODO: 实现霓虹条动画
    }
    
    // 创建尘埃效果
    createDust(config) {
      // TODO: 实现尘埃动画
    }
    
    // 创建魔法阵效果
    createMagicCircles(config) {
      // TODO: 实现魔法阵动画
    }
    
    // 创建黄金环效果
    createGoldenRing(config) {
      // TODO: 实现黄金环动画
    }
    
    clearEffects() {
      this.activeEffects.forEach(effect => effect.remove());
      this.activeEffects = [];
      if (this.effectsContainer) {
        this.effectsContainer.innerHTML = '';
      }
    }
    
    addStyle(name, css) {
      const existingStyle = document.getElementById(`theme-style-${name}`);
      if (existingStyle) return;
      
      const style = document.createElement('style');
      style.id = `theme-style-${name}`;
      style.textContent = css;
      document.head.appendChild(style);
    }
    
    createThemeSwitcher() {
      // TODO: 创建主题切换UI
    }
    
    updateSwitcherUI() {
      // TODO: 更新UI状态
    }
    
    dispatchThemeChangeEvent(themeId, theme) {
      const event = new CustomEvent('advancedthemechange', {
        detail: { themeId, theme, timestamp: Date.now() }
      });
      window.dispatchEvent(event);
    }
    
    getCurrentTheme() {
      return {
        id: this.currentTheme,
        ...ADVANCED_THEMES[this.currentTheme]
      };
    }
    
    getAllThemes() {
      return Object.entries(ADVANCED_THEMES).map(([id, theme]) => ({
        id,
        ...theme
      }));
    }
  }
  
  // 创建全局实例
  window.AdvancedThemeManager = AdvancedThemeManager;
  
  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.advancedThemeManager = new AdvancedThemeManager();
    });
  } else {
    window.advancedThemeManager = new AdvancedThemeManager();
  }
  
})();
