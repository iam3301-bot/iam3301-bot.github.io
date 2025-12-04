/**
 * 主题管理器 - Theme Manager
 * 管理网站的主题切换功能
 */

(function() {
  'use strict';
  
  // 主题配置
  const THEMES = {
    cyberpunk: {
      name: '赛博朋克',
      nameEn: 'Cyberpunk',
      icon: '🌃',
      className: 'theme-cyberpunk',
      description: '未来科技风格，霓虹灯效果',
      cssFile: 'cyberpunk-styles.css'
    },
    game: {
      name: '游戏世界',
      nameEn: 'Game World',
      icon: '🎮',
      className: 'theme-game',
      description: '经典游戏风格，复古与现代结合',
      cssFile: 'game-theme.css'
    }
  };
  
  const STORAGE_KEY = 'gamebox_theme';
  const DEFAULT_THEME = 'cyberpunk';
  
  // 主题管理器类
  class ThemeManager {
    constructor() {
      this.currentTheme = this.loadTheme();
      this.themeStyleElement = null;
      this.init();
    }
    
    // 初始化
    init() {
      this.applyTheme(this.currentTheme, false);
      this.createThemeSwitcher();
      console.log('🎨 主题管理器已初始化，当前主题:', this.currentTheme);
    }
    
    // 从本地存储加载主题
    loadTheme() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && THEMES[saved]) {
          return saved;
        }
      } catch (e) {
        console.warn('无法读取主题设置:', e);
      }
      return DEFAULT_THEME;
    }
    
    // 保存主题到本地存储
    saveTheme(themeKey) {
      try {
        localStorage.setItem(STORAGE_KEY, themeKey);
      } catch (e) {
        console.warn('无法保存主题设置:', e);
      }
    }
    
    // 应用主题
    applyTheme(themeKey, animate = true) {
      if (!THEMES[themeKey]) {
        console.warn('主题不存在:', themeKey);
        return;
      }
      
      const theme = THEMES[themeKey];
      const body = document.body;
      
      // 添加过渡动画
      if (animate) {
        body.style.transition = 'background 0.5s ease, color 0.5s ease';
        setTimeout(() => {
          body.style.transition = '';
        }, 500);
      }
      
      // 移除所有主题类
      Object.values(THEMES).forEach(t => {
        body.classList.remove(t.className);
      });
      
      // 添加新主题类
      body.classList.add(theme.className);
      
      // 更新主题样式文件
      this.loadThemeCSS(theme.cssFile);
      
      // 保存当前主题
      this.currentTheme = themeKey;
      this.saveTheme(themeKey);
      
      // 更新选择器UI
      this.updateSwitcherUI();
      
      // 触发主题切换事件
      this.dispatchThemeChangeEvent(themeKey, theme);
      
      console.log('✅ 主题已切换:', theme.name);
    }
    
    // 动态加载主题CSS文件
    loadThemeCSS(cssFile) {
      // 移除旧的主题样式
      if (this.themeStyleElement) {
        this.themeStyleElement.remove();
      }
      
      // 创建新的样式链接
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssFile;
      link.dataset.themeStyle = 'true';
      document.head.appendChild(link);
      
      this.themeStyleElement = link;
    }
    
    // 创建主题切换器UI
    createThemeSwitcher() {
      // 检查是否已存在
      if (document.getElementById('themeSwitcher')) {
        return;
      }
      
      // 创建容器
      const container = document.createElement('div');
      container.id = 'themeSwitcher';
      container.className = 'theme-switcher';
      
      // 创建切换按钮
      const button = document.createElement('button');
      button.className = 'theme-switcher-btn';
      button.innerHTML = `
        <span class="theme-switcher-icon">🎨</span>
        <span class="theme-switcher-label">主题</span>
      `;
      button.title = '切换主题';
      
      // 创建主题选项面板
      const panel = document.createElement('div');
      panel.className = 'theme-switcher-panel';
      
      Object.entries(THEMES).forEach(([key, theme]) => {
        const option = document.createElement('div');
        option.className = 'theme-option';
        option.dataset.theme = key;
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
          this.applyTheme(key, true);
          this.hidePanel();
        });
        
        panel.appendChild(option);
      });
      
      // 点击按钮切换面板显示
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePanel();
      });
      
      // 点击外部关闭面板
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
          this.hidePanel();
        }
      });
      
      container.appendChild(button);
      container.appendChild(panel);
      
      // 添加到页面
      document.body.appendChild(container);
      
      // 添加样式
      this.injectSwitcherStyles();
      
      // 初始化UI状态
      this.updateSwitcherUI();
    }
    
    // 切换面板显示
    togglePanel() {
      const panel = document.querySelector('.theme-switcher-panel');
      if (panel) {
        panel.classList.toggle('is-active');
      }
    }
    
    // 隐藏面板
    hidePanel() {
      const panel = document.querySelector('.theme-switcher-panel');
      if (panel) {
        panel.classList.remove('is-active');
      }
    }
    
    // 更新切换器UI状态
    updateSwitcherUI() {
      const options = document.querySelectorAll('.theme-option');
      options.forEach(option => {
        const themeKey = option.dataset.theme;
        if (themeKey === this.currentTheme) {
          option.classList.add('is-active');
        } else {
          option.classList.remove('is-active');
        }
      });
      
      // 更新按钮图标
      const currentTheme = THEMES[this.currentTheme];
      const icon = document.querySelector('.theme-switcher-icon');
      if (icon && currentTheme) {
        icon.textContent = currentTheme.icon;
      }
    }
    
    // 触发主题切换事件
    dispatchThemeChangeEvent(themeKey, theme) {
      const event = new CustomEvent('themechange', {
        detail: {
          themeKey,
          theme,
          timestamp: Date.now()
        }
      });
      window.dispatchEvent(event);
    }
    
    // 注入切换器样式
    injectSwitcherStyles() {
      const styleId = 'theme-switcher-styles';
      if (document.getElementById(styleId)) {
        return;
      }
      
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .theme-switcher {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9999;
        }
        
        .theme-switcher-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
          border: 2px solid rgba(56, 189, 248, 0.5);
          border-radius: 50px;
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(56, 189, 248, 0.3);
          transition: all 0.3s ease;
        }
        
        .theme-switcher-btn:hover {
          background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(51, 65, 85, 1) 100%);
          border-color: rgba(56, 189, 248, 0.8);
          transform: translateY(-2px);
          box-shadow: 
            0 6px 25px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(56, 189, 248, 0.5);
        }
        
        .theme-switcher-icon {
          font-size: 20px;
          line-height: 1;
        }
        
        .theme-switcher-label {
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 1px;
        }
        
        .theme-switcher-panel {
          position: absolute;
          bottom: calc(100% + 10px);
          right: 0;
          min-width: 300px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%);
          border: 2px solid rgba(56, 189, 248, 0.5);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(56, 189, 248, 0.3);
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
          background: rgba(15, 23, 42, 0.6);
          border: 2px solid rgba(56, 189, 248, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .theme-option:last-child {
          margin-bottom: 0;
        }
        
        .theme-option:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(56, 189, 248, 0.5);
          transform: translateX(3px);
        }
        
        .theme-option.is-active {
          background: rgba(56, 189, 248, 0.2);
          border-color: rgba(56, 189, 248, 0.8);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
        }
        
        .theme-option-icon {
          font-size: 32px;
          line-height: 1;
          flex-shrink: 0;
        }
        
        .theme-option-info {
          flex: 1;
        }
        
        .theme-option-name {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        
        .theme-option-desc {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .theme-option-check {
          font-size: 20px;
          color: #38bdf8;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .theme-option.is-active .theme-option-check {
          opacity: 1;
        }
        
        /* 游戏主题下的切换器样式 */
        body.theme-game .theme-switcher-btn {
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 52, 96, 0.95) 100%);
          border-color: rgba(255, 215, 0, 0.5);
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(255, 215, 0, 0.3);
        }
        
        body.theme-game .theme-switcher-btn:hover {
          border-color: rgba(255, 215, 0, 0.8);
          box-shadow: 
            0 6px 25px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(255, 215, 0, 0.5);
        }
        
        body.theme-game .theme-switcher-panel {
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(15, 52, 96, 0.98) 100%);
          border-color: rgba(255, 215, 0, 0.5);
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(255, 215, 0, 0.3);
        }
        
        body.theme-game .theme-option {
          border-color: rgba(83, 52, 131, 0.5);
        }
        
        body.theme-game .theme-option:hover {
          border-color: rgba(255, 215, 0, 0.5);
        }
        
        body.theme-game .theme-option.is-active {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.8);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }
        
        body.theme-game .theme-option-check {
          color: #FFD700;
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
          .theme-switcher {
            bottom: 20px;
            right: 20px;
          }
          
          .theme-switcher-btn {
            padding: 10px 16px;
            font-size: 13px;
          }
          
          .theme-switcher-icon {
            font-size: 18px;
          }
          
          .theme-switcher-panel {
            min-width: 260px;
          }
          
          .theme-option {
            padding: 10px;
          }
          
          .theme-option-icon {
            font-size: 28px;
          }
          
          .theme-option-name {
            font-size: 13px;
          }
          
          .theme-option-desc {
            font-size: 10px;
          }
        }
      `;
      
      document.head.appendChild(style);
    }
    
    // 获取当前主题信息
    getCurrentTheme() {
      return {
        key: this.currentTheme,
        ...THEMES[this.currentTheme]
      };
    }
    
    // 获取所有主题列表
    getAllThemes() {
      return Object.entries(THEMES).map(([key, theme]) => ({
        key,
        ...theme
      }));
    }
  }
  
  // 创建全局实例
  window.ThemeManager = ThemeManager;
  
  // 页面加载完成后自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.themeManager = new ThemeManager();
    });
  } else {
    window.themeManager = new ThemeManager();
  }
  
  // 监听主题切换事件（用于调试和扩展）
  window.addEventListener('themechange', (e) => {
    console.log('🎨 主题已切换:', e.detail);
  });
  
})();
