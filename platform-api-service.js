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
  // PlayStation Network API (完整支持 - 与 Steam 对接一致)
  // =============================================
  
  const PSNAPI = {
    // API 配置
    config: {
      enabled: false,
      npsso: '',
      accessToken: '',
      refreshToken: '',
      tokenExpiry: 0,
      accountId: '',
      onlineId: '',
      // 代理服务器地址 - 可配置
      proxyUrl: localStorage.getItem('psn_proxy_url') || 'http://localhost:3001'
    },
    
    // 初始化
    init() {
      const savedConfig = localStorage.getItem('psn_api_config');
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          Object.assign(this.config, config);
          // 检查 token 是否过期
          if (this.config.accessToken && this.config.tokenExpiry > Date.now()) {
            this.config.enabled = true;
            console.log('✅ PSN API 已启用 (Token 有效)');
          } else if (this.config.accessToken) {
            console.log('⚠️ PSN API Token 已过期，需要重新认证');
            this.config.enabled = false;
          }
        } catch (e) {
          console.warn('PSN API 配置解析失败');
        }
      } else {
        console.log('ℹ️ PSN API 未配置 - 需要 NPSSO Token');
      }
    },
    
    // 保存配置
    saveConfig() {
      const configToSave = {
        npsso: this.config.npsso,
        accessToken: this.config.accessToken,
        refreshToken: this.config.refreshToken,
        tokenExpiry: this.config.tokenExpiry,
        accountId: this.config.accountId,
        onlineId: this.config.onlineId,
        proxyUrl: this.config.proxyUrl
      };
      localStorage.setItem('psn_api_config', JSON.stringify(configToSave));
    },
    
    // 设置代理服务器地址
    setProxyUrl(url) {
      this.config.proxyUrl = url;
      localStorage.setItem('psn_proxy_url', url);
    },
    
    // 检查代理服务器是否可用
    async checkProxy() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${this.config.proxyUrl}/api/psn/health`, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
      } catch (e) {
        return false;
      }
    },
    
    // 使用 NPSSO 进行认证
    async authenticate(npsso) {
      if (!npsso || npsso.length < 60) {
        return { success: false, error: 'NPSSO Token 格式无效 (应为64字符)' };
      }
      
      try {
        // 先检查代理服务器
        const proxyAvailable = await this.checkProxy();
        if (!proxyAvailable) {
          return { 
            success: false, 
            error: '无法连接到 PSN API 代理服务器',
            hint: `请确保代理服务器运行在 ${this.config.proxyUrl}`
          };
        }
        
        // 调用代理服务器进行认证
        const response = await fetch(`${this.config.proxyUrl}/api/psn/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ npsso })
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.config.npsso = npsso;
          this.config.accessToken = data.accessToken;
          this.config.refreshToken = data.refreshToken;
          this.config.tokenExpiry = Date.now() + (data.expiresIn * 1000);
          this.config.enabled = true;
          this.saveConfig();
          
          console.log('✅ PSN API 认证成功');
          return { success: true };
        } else {
          return { success: false, error: data.error || '认证失败' };
        }
      } catch (e) {
        console.error('PSN 认证错误:', e);
        return { 
          success: false, 
          error: '无法连接到 PSN API 代理服务器',
          hint: `请确保代理服务器运行在 ${this.config.proxyUrl}`
        };
      }
    },
    
    // 检查是否启用
    isEnabled() {
      return this.config.enabled && this.config.accessToken && this.config.tokenExpiry > Date.now();
    },
    
    // API 请求封装
    async apiRequest(endpoint, params = {}) {
      if (!this.isEnabled()) {
        return { success: false, error: 'PSN API 未启用或 Token 已过期' };
      }
      
      try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${this.config.proxyUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`
          }
        });
        
        if (response.status === 401) {
          this.config.enabled = false;
          this.saveConfig();
          return { success: false, error: 'Token 已过期，请重新认证' };
        }
        
        const data = await response.json();
        return { success: response.ok, data };
      } catch (e) {
        console.error('PSN API 请求错误:', e);
        return { success: false, error: e.message };
      }
    },
    
    // 获取用户资料
    async getProfile(accountId = 'me') {
      const result = await this.apiRequest('/api/psn/profile', { accountId });
      
      if (result.success && result.data) {
        const profile = result.data;
        return {
          success: true,
          profile: {
            accountId: profile.accountId || accountId,
            onlineId: profile.onlineId || '',
            avatar: profile.avatarUrls?.[0]?.avatarUrl || profile.avatarUrl || '',
            aboutMe: profile.aboutMe || '',
            languages: profile.languages || [],
            isPlus: profile.isPlus || false
          }
        };
      }
      
      return result;
    },
    
    // 获取用户奖杯概要
    async getTrophySummary(accountId = 'me') {
      const result = await this.apiRequest('/api/psn/trophy-summary', { accountId });
      
      if (result.success && result.data) {
        return {
          success: true,
          summary: {
            trophyLevel: result.data.trophyLevel || 0,
            progress: result.data.progress || 0,
            tier: result.data.tier || 1,
            earnedTrophies: result.data.earnedTrophies || {
              bronze: 0,
              silver: 0,
              gold: 0,
              platinum: 0
            }
          }
        };
      }
      
      return result;
    },
    
    // 获取游戏列表
    async getUserTitles(accountId = 'me', limit = 800) {
      const result = await this.apiRequest('/api/psn/titles', { accountId, limit });
      
      if (result.success && result.data) {
        const titles = result.data.trophyTitles || [];
        return {
          success: true,
          titles: titles.map(t => ({
            npCommunicationId: t.npCommunicationId,
            name: t.trophyTitleName,
            detail: t.trophyTitleDetail,
            iconUrl: t.trophyTitleIconUrl,
            platform: t.trophyTitlePlatform, // PS5, PS4, PS3, VITA
            progress: t.progress,
            earnedTrophies: t.earnedTrophies,
            definedTrophies: t.definedTrophies,
            lastUpdated: t.lastUpdatedDateTime
          })),
          totalCount: result.data.totalItemCount || titles.length
        };
      }
      
      return { success: false, error: result.error, titles: [], totalCount: 0 };
    },
    
    // 搜索用户
    async searchUser(onlineId) {
      const result = await this.apiRequest('/api/psn/search', { onlineId });
      
      if (result.success && result.data && result.data.domainResponses) {
        const socialResults = result.data.domainResponses.find(d => d.domain === 'SocialAllAccounts');
        if (socialResults && socialResults.results) {
          return {
            success: true,
            users: socialResults.results.map(u => ({
              accountId: u.socialMetadata?.accountId,
              onlineId: u.socialMetadata?.onlineId,
              avatarUrl: u.socialMetadata?.avatarUrl,
              isPsPlus: u.socialMetadata?.isPsPlus
            }))
          };
        }
      }
      
      return { success: false, error: '未找到用户', users: [] };
    },
    
    // 清除配置
    clearConfig() {
      this.config = {
        enabled: false,
        npsso: '',
        accessToken: '',
        refreshToken: '',
        tokenExpiry: 0,
        accountId: '',
        onlineId: '',
        proxyUrl: this.config.proxyUrl
      };
      localStorage.removeItem('psn_api_config');
      console.log('ℹ️ PSN API 配置已清除');
    },
    
    // 兼容别名方法
    async setNpsso(npsso) {
      return await this.authenticate(npsso);
    },
    
    async getTrophies(accountId) {
      return await this.getUserTitles(accountId);
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
          apiSource: 'psn-api (需要后端代理)',
          configUrl: 'https://ca.account.sony.com/api/v1/ssocookie',
          features: ['奖杯数据', '用户资料', '游戏列表', '奖杯统计'],
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
      authenticate: (npsso) => PSNAPI.authenticate(npsso),
      setNpsso: (npsso) => PSNAPI.setNpsso(npsso),
      clearConfig: () => PSNAPI.clearConfig(),
      isEnabled: () => PSNAPI.isEnabled(),
      checkProxy: () => PSNAPI.checkProxy(),
      setProxyUrl: (url) => PSNAPI.setProxyUrl(url),
      getProfile: (accountId) => PSNAPI.getProfile(accountId),
      getTrophySummary: (accountId) => PSNAPI.getTrophySummary(accountId),
      getTrophies: (accountId) => PSNAPI.getTrophies(accountId),
      getUserTitles: (accountId, limit) => PSNAPI.getUserTitles(accountId, limit),
      searchUser: (onlineId) => PSNAPI.searchUser(onlineId)
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
              isApiData: true,
              boundAt: new Date().toISOString()
            }
          };
          
        case 'playstation':
          if (!PSNAPI.isEnabled()) {
            return { 
              success: false, 
              error: '请先配置 PSN NPSSO Token',
              configRequired: true,
              useManualEntry: false
            };
          }
          
          // 获取奖杯概要
          const summaryResult = await PSNAPI.getTrophySummary('me');
          
          // 获取游戏列表
          const titlesResult = await PSNAPI.getUserTitles('me');
          
          if (!titlesResult.success) {
            return { success: false, error: titlesResult.error || '获取数据失败' };
          }
          
          // 计算奖杯统计
          const trophies = summaryResult.success ? summaryResult.summary.earnedTrophies : { bronze: 0, silver: 0, gold: 0, platinum: 0 };
          const totalTrophies = trophies.bronze + trophies.silver + trophies.gold + trophies.platinum;
          
          return {
            success: true,
            platform: 'playstation',
            account: {
              username: identifier || 'PSN User',
              accountId: 'me',
              gameCount: titlesResult.totalCount,
              games: titlesResult.titles,
              trophyLevel: summaryResult.success ? summaryResult.summary.trophyLevel : 0,
              trophies: trophies,
              totalTrophies: totalTrophies,
              isApiData: true,
              boundAt: new Date().toISOString()
            }
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
