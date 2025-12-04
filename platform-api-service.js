/**
 * 多平台 API 服务
 * 支持 Xbox (OpenXBL) 和 PlayStation (PSN API) 的数据获取
 * Epic Games 暂无公开 API，仅支持手动录入
 */

(function() {
  'use strict';

  // =============================================
  // Xbox Live API (via OpenXBL)
  // =============================================
  
  const XboxAPI = {
    // API 配置
    config: {
      enabled: false,
      apiKey: '', // 用户需要在 https://xbl.io 注册获取
      baseUrl: 'https://xbl.io/api/v2'
    },
    
    // 初始化
    init() {
      // 从 localStorage 读取 API Key
      const savedKey = localStorage.getItem('xbox_api_key');
      if (savedKey) {
        this.config.apiKey = savedKey;
        this.config.enabled = true;
        console.log('✅ Xbox API 已启用');
      } else {
        console.log('ℹ️ Xbox API 未配置 - 请在设置中输入 OpenXBL API Key');
      }
    },
    
    // 设置 API Key
    setApiKey(key) {
      if (key && key.trim()) {
        this.config.apiKey = key.trim();
        this.config.enabled = true;
        localStorage.setItem('xbox_api_key', key.trim());
        console.log('✅ Xbox API Key 已保存');
        return true;
      }
      return false;
    },
    
    // 清除 API Key
    clearApiKey() {
      this.config.apiKey = '';
      this.config.enabled = false;
      localStorage.removeItem('xbox_api_key');
      console.log('ℹ️ Xbox API Key 已清除');
    },
    
    // 检查是否启用
    isEnabled() {
      return this.config.enabled && this.config.apiKey;
    },
    
    // 发起 API 请求
    async request(endpoint, options = {}) {
      if (!this.isEnabled()) {
        return { success: false, error: 'Xbox API 未配置' };
      }
      
      try {
        const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
          headers: {
            'X-Authorization': this.config.apiKey,
            'Accept': 'application/json',
            ...options.headers
          },
          ...options
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        console.error('Xbox API 请求失败:', error);
        return { success: false, error: error.message };
      }
    },
    
    // 获取用户资料
    async getProfile(gamertag) {
      const result = await this.request(`/player/summary?gt=${encodeURIComponent(gamertag)}`);
      
      if (result.success && result.data) {
        return {
          success: true,
          profile: {
            gamertag: result.data.Gamertag || gamertag,
            gamerscore: result.data.Gamerscore || 0,
            avatar: result.data.ProfileImageUrl || result.data.DisplayPicRaw || '',
            accountTier: result.data.AccountTier || 'Silver',
            xuid: result.data.XUID || ''
          }
        };
      }
      
      return result;
    },
    
    // 获取游戏成就/游戏列表
    async getGames(xuid) {
      // 尝试获取成就标题列表
      const result = await this.request(`/achievements/player/${xuid}`);
      
      if (result.success && result.data && result.data.titles) {
        const games = result.data.titles.map(title => ({
          titleId: title.titleId,
          name: title.name,
          type: title.type,
          achievementCount: title.maxGamerscore ? Math.round(title.currentGamerscore / (title.maxGamerscore / title.achievements?.length || 1)) : 0,
          gamerscore: title.currentGamerscore || 0,
          maxGamerscore: title.maxGamerscore || 0,
          lastPlayed: title.lastUnlock
        }));
        
        return {
          success: true,
          games: games,
          gameCount: games.length,
          totalGamerscore: games.reduce((sum, g) => sum + (g.gamerscore || 0), 0)
        };
      }
      
      return { success: false, error: '无法获取游戏列表', games: [], gameCount: 0 };
    },
    
    // 搜索玩家
    async searchPlayer(gamertag) {
      const result = await this.request(`/search/${encodeURIComponent(gamertag)}`);
      
      if (result.success && result.data && result.data.people) {
        return {
          success: true,
          players: result.data.people.map(p => ({
            gamertag: p.gamertag,
            xuid: p.xuid,
            avatar: p.displayPicRaw
          }))
        };
      }
      
      return { success: false, error: '未找到玩家', players: [] };
    }
  };

  // =============================================
  // PlayStation Network API (via psn-api pattern)
  // =============================================
  
  const PSNAPI = {
    // API 配置
    config: {
      enabled: false,
      npsso: '', // 用户的 NPSSO token
      accessToken: '',
      refreshToken: '',
      tokenExpiry: 0
    },
    
    // 初始化
    init() {
      // 从 localStorage 读取配置
      const savedConfig = localStorage.getItem('psn_api_config');
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          Object.assign(this.config, config);
          this.config.enabled = !!config.accessToken;
          console.log('✅ PSN API 配置已加载');
        } catch (e) {
          console.warn('PSN API 配置解析失败');
        }
      } else {
        console.log('ℹ️ PSN API 未配置 - 需要 NPSSO Token');
      }
    },
    
    // 保存配置
    saveConfig() {
      localStorage.setItem('psn_api_config', JSON.stringify(this.config));
    },
    
    // 设置 NPSSO Token (需要从 PlayStation 网站获取)
    async setNpsso(npsso) {
      if (!npsso || npsso.length < 60) {
        return { success: false, error: 'NPSSO Token 格式无效 (应为64字符)' };
      }
      
      this.config.npsso = npsso;
      
      // 尝试交换 access token
      // 注意：由于 CORS 限制，这需要通过代理或后端服务
      // 这里提供一个模拟/演示模式
      
      console.log('⚠️ PSN API 需要后端代理才能完成认证');
      console.log('ℹ️ 由于浏览器 CORS 限制，PSN API 调用需要服务端支持');
      
      // 保存 NPSSO，等待后端支持
      this.config.enabled = false; // 标记为未完全启用
      this.saveConfig();
      
      return { 
        success: false, 
        error: 'PSN API 需要后端代理服务支持，目前请使用手动录入',
        hint: '您可以访问 https://ca.account.sony.com/api/v1/ssocookie 获取 NPSSO Token'
      };
    },
    
    // 检查是否启用
    isEnabled() {
      return this.config.enabled && this.config.accessToken;
    },
    
    // 获取用户资料 (需要 accessToken)
    async getProfile(accountId) {
      if (!this.isEnabled()) {
        return { success: false, error: 'PSN API 未配置或未授权' };
      }
      
      // 实际实现需要后端代理
      return { success: false, error: '需要后端代理服务支持' };
    },
    
    // 获取奖杯数据
    async getTrophies(accountId) {
      if (!this.isEnabled()) {
        return { success: false, error: 'PSN API 未配置或未授权' };
      }
      
      return { success: false, error: '需要后端代理服务支持' };
    },
    
    // 清除配置
    clearConfig() {
      this.config = {
        enabled: false,
        npsso: '',
        accessToken: '',
        refreshToken: '',
        tokenExpiry: 0
      };
      localStorage.removeItem('psn_api_config');
      console.log('ℹ️ PSN API 配置已清除');
    }
  };

  // =============================================
  // Epic Games (无公开 API，仅手动录入)
  // =============================================
  
  const EpicAPI = {
    isEnabled() {
      return false; // Epic 没有公开 API
    },
    
    getStatus() {
      return {
        available: false,
        reason: 'Epic Games 未提供公开 API',
        alternative: '请手动输入您的 Epic 用户名和游戏数量',
        helpUrl: 'https://store.epicgames.com/library'
      };
    }
  };

  // =============================================
  // 统一平台服务
  // =============================================
  
  const PlatformAPIService = {
    // 初始化所有平台
    init() {
      XboxAPI.init();
      PSNAPI.init();
      console.log('🎮 平台 API 服务已初始化');
    },
    
    // 获取平台状态
    getStatus() {
      return {
        xbox: {
          enabled: XboxAPI.isEnabled(),
          name: 'Xbox Live',
          apiSource: 'OpenXBL (xbl.io)',
          configUrl: 'https://xbl.io/',
          features: ['用户资料', '游戏列表', '成就', 'Gamerscore']
        },
        playstation: {
          enabled: PSNAPI.isEnabled(),
          name: 'PlayStation Network',
          apiSource: 'psn-api (需要后端)',
          configUrl: 'https://ca.account.sony.com/api/v1/ssocookie',
          features: ['奖杯数据', '用户资料'],
          note: '需要后端代理服务支持'
        },
        epic: {
          enabled: false,
          name: 'Epic Games',
          apiSource: '无公开 API',
          configUrl: 'https://store.epicgames.com/library',
          features: [],
          note: 'Epic Games 暂不提供公开 API，请手动录入数据'
        }
      };
    },
    
    // Xbox 相关方法
    xbox: {
      setApiKey: (key) => XboxAPI.setApiKey(key),
      clearApiKey: () => XboxAPI.clearApiKey(),
      isEnabled: () => XboxAPI.isEnabled(),
      getProfile: (gamertag) => XboxAPI.getProfile(gamertag),
      getGames: (xuid) => XboxAPI.getGames(xuid),
      searchPlayer: (gamertag) => XboxAPI.searchPlayer(gamertag)
    },
    
    // PlayStation 相关方法
    playstation: {
      setNpsso: (npsso) => PSNAPI.setNpsso(npsso),
      clearConfig: () => PSNAPI.clearConfig(),
      isEnabled: () => PSNAPI.isEnabled(),
      getProfile: (accountId) => PSNAPI.getProfile(accountId),
      getTrophies: (accountId) => PSNAPI.getTrophies(accountId)
    },
    
    // Epic 相关方法
    epic: {
      isEnabled: () => EpicAPI.isEnabled(),
      getStatus: () => EpicAPI.getStatus()
    },
    
    // 绑定账号的统一入口
    async bindAccount(platform, identifier) {
      switch (platform) {
        case 'xbox':
          if (!XboxAPI.isEnabled()) {
            return { 
              success: false, 
              error: '请先配置 Xbox API Key',
              configRequired: true,
              configUrl: 'https://xbl.io/'
            };
          }
          
          // 先搜索/验证玩家
          const profileResult = await XboxAPI.getProfile(identifier);
          if (!profileResult.success) {
            return profileResult;
          }
          
          // 获取游戏列表
          const gamesResult = await XboxAPI.getGames(profileResult.profile.xuid);
          
          return {
            success: true,
            platform: 'xbox',
            account: {
              username: profileResult.profile.gamertag,
              xuid: profileResult.profile.xuid,
              avatar: profileResult.profile.avatar,
              gamerscore: profileResult.profile.gamerscore,
              gameCount: gamesResult.gameCount || 0,
              games: gamesResult.games || [],
              isApiData: true, // 标记为 API 数据
              boundAt: new Date().toISOString()
            }
          };
          
        case 'playstation':
          return { 
            success: false, 
            error: 'PSN API 需要后端代理服务，请手动录入数据',
            configRequired: true,
            useManualEntry: true
          };
          
        case 'epic':
          return { 
            success: false, 
            error: 'Epic Games 无公开 API，请手动录入数据',
            useManualEntry: true
          };
          
        default:
          return { success: false, error: '不支持的平台' };
      }
    }
  };

  // 导出全局对象
  window.PlatformAPIService = PlatformAPIService;
  window.XboxAPI = XboxAPI;
  window.PSNAPI = PSNAPI;
  window.EpicAPI = EpicAPI;

  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PlatformAPIService.init());
  } else {
    PlatformAPIService.init();
  }

  console.log('✅ 平台 API 服务模块已加载');
})();
