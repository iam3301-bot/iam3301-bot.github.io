// =============================================
// GameBox 第三方登录统一管理
// =============================================
// 支持: Google, GitHub, WeChat (微信), QQ
// =============================================

const OAUTH_CONFIG = {
  // =============================================
  // Google OAuth 2.0 配置
  // 文档: https://developers.google.com/identity/protocols/oauth2
  // =============================================
  google: {
    enabled: true,
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    // 重定向URI (需要在 Google Cloud Console 中配置)
    redirectUri: `${window.location.origin}/oauth-callback.html`,
    // OAuth 2.0 授权端点
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    // 令牌端点
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    // 用户信息端点
    userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
    // 授权范围
    scope: 'openid profile email',
    // 按钮样式
    buttonStyle: {
      background: '#4285f4',
      icon: `<svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>`,
      text: 'Google 登录'
    }
  },

  // =============================================
  // GitHub OAuth 配置
  // 文档: https://docs.github.com/en/developers/apps/building-oauth-apps
  // =============================================
  github: {
    enabled: true,
    clientId: 'YOUR_GITHUB_CLIENT_ID',
    clientSecret: '', // 注意: 客户端密钥应在后端处理，此处留空
    redirectUri: `${window.location.origin}/oauth-callback.html`,
    authEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    userInfoEndpoint: 'https://api.github.com/user',
    scope: 'read:user user:email',
    buttonStyle: {
      background: '#24292e',
      icon: `<svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="#fff" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>`,
      text: 'GitHub 登录'
    }
  },

  // =============================================
  // 微信开放平台 OAuth 配置
  // 文档: https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
  // =============================================
  wechat: {
    enabled: true,
    appId: 'YOUR_WECHAT_APP_ID',
    appSecret: '', // 注意: 应用密钥应在后端处理
    redirectUri: `${window.location.origin}/oauth-callback.html`,
    // 微信开放平台授权端点
    authEndpoint: 'https://open.weixin.qq.com/connect/qrconnect',
    // 获取 access_token
    tokenEndpoint: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    // 获取用户信息
    userInfoEndpoint: 'https://api.weixin.qq.com/sns/userinfo',
    // 授权作用域 (snsapi_login 用于网站应用)
    scope: 'snsapi_login',
    // 二维码模式
    qrcodeMode: true,
    buttonStyle: {
      background: '#07c160',
      icon: `<svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="#fff" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.858c-.135-.01-.27-.019-.406-.019zm-2.579 3.158c.545 0 .984.45.984 1.01 0 .56-.439 1.01-.984 1.01-.545 0-.984-.45-.984-1.01 0-.56.439-1.01.984-1.01zm4.655 0c.545 0 .984.45.984 1.01 0 .56-.439 1.01-.984 1.01-.545 0-.984-.45-.984-1.01 0-.56.439-1.01.984-1.01z"/>
      </svg>`,
      text: '微信登录'
    }
  },

  // =============================================
  // QQ互联 OAuth 配置
  // 文档: https://wiki.connect.qq.com/
  // =============================================
  qq: {
    enabled: true,
    appId: 'YOUR_QQ_APP_ID',
    appKey: '', // 注意: APP Key 应在后端处理
    redirectUri: `${window.location.origin}/oauth-callback.html`,
    // QQ互联授权端点
    authEndpoint: 'https://graph.qq.com/oauth2.0/authorize',
    // 获取 access_token
    tokenEndpoint: 'https://graph.qq.com/oauth2.0/token',
    // 获取用户 OpenID
    openIdEndpoint: 'https://graph.qq.com/oauth2.0/me',
    // 获取用户信息
    userInfoEndpoint: 'https://graph.qq.com/user/get_user_info',
    // 授权范围
    scope: 'get_user_info',
    buttonStyle: {
      background: '#12b7f5',
      icon: `<svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="#fff" d="M21.395 15.035a39.548 39.548 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.081 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39.548 39.548 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 1.131-2.427 1.843-3.229.426-.482.91-.731 1.229-.894.495 3.14 3.66 5.625 7.76 5.625s7.265-2.485 7.76-5.625c.318.163.803.412 1.229.894.712.802 1.302 3.294 1.843 3.229.252-.03.583-1.39-.437-4.673z"/>
      </svg>`,
      text: 'QQ 登录'
    }
  }
};

// =============================================
// 第三方登录管理器
// =============================================

class OAuthManager {
  constructor() {
    this.providers = OAUTH_CONFIG;
    this.currentProvider = null;
    this.callbackWindow = null;
  }

  // 生成随机 state 参数 (防止 CSRF 攻击)
  generateState() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // 保存 OAuth 状态到 localStorage
  saveOAuthState(provider, state) {
    const oauthState = {
      provider,
      state,
      timestamp: Date.now(),
      redirectUrl: window.location.href
    };
    localStorage.setItem('oauth_state', JSON.stringify(oauthState));
  }

  // 验证 OAuth 状态
  validateOAuthState(state) {
    const savedState = localStorage.getItem('oauth_state');
    if (!savedState) return null;

    try {
      const oauthState = JSON.parse(savedState);
      
      // 检查状态是否匹配
      if (oauthState.state !== state) {
        console.error('[OAuth] State 不匹配');
        return null;
      }

      // 检查是否过期 (10分钟)
      if (Date.now() - oauthState.timestamp > 10 * 60 * 1000) {
        console.error('[OAuth] State 已过期');
        localStorage.removeItem('oauth_state');
        return null;
      }

      return oauthState;
    } catch (error) {
      console.error('[OAuth] State 验证失败:', error);
      return null;
    }
  }

  // 清除 OAuth 状态
  clearOAuthState() {
    localStorage.removeItem('oauth_state');
  }

  // =============================================
  // Google 登录
  // =============================================
  async signInWithGoogle() {
    const provider = this.providers.google;
    if (!provider.enabled) {
      throw new Error('Google 登录未启用');
    }

    const state = this.generateState();
    this.saveOAuthState('google', state);

    // 构建授权 URL
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      response_type: 'code',
      scope: provider.scope,
      state: state,
      // 强制选择账号
      prompt: 'select_account'
    });

    const authUrl = `${provider.authEndpoint}?${params.toString()}`;
    
    // 打开授权页面
    this.openOAuthWindow(authUrl, 'google');
  }

  // =============================================
  // GitHub 登录
  // =============================================
  async signInWithGitHub() {
    const provider = this.providers.github;
    if (!provider.enabled) {
      throw new Error('GitHub 登录未启用');
    }

    const state = this.generateState();
    this.saveOAuthState('github', state);

    // 构建授权 URL
    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      scope: provider.scope,
      state: state
    });

    const authUrl = `${provider.authEndpoint}?${params.toString()}`;
    
    // 打开授权页面
    this.openOAuthWindow(authUrl, 'github');
  }

  // =============================================
  // 微信登录 (二维码模式)
  // =============================================
  async signInWithWeChat() {
    const provider = this.providers.wechat;
    if (!provider.enabled) {
      throw new Error('微信登录未启用');
    }

    const state = this.generateState();
    this.saveOAuthState('wechat', state);

    // 构建授权 URL
    const params = new URLSearchParams({
      appid: provider.appId,
      redirect_uri: encodeURIComponent(provider.redirectUri),
      response_type: 'code',
      scope: provider.scope,
      state: state
    });

    const authUrl = `${provider.authEndpoint}?${params.toString()}#wechat_redirect`;
    
    // 微信登录使用二维码模式，打开新窗口显示二维码
    this.openOAuthWindow(authUrl, 'wechat');
  }

  // =============================================
  // QQ 登录
  // =============================================
  async signInWithQQ() {
    const provider = this.providers.qq;
    if (!provider.enabled) {
      throw new Error('QQ 登录未启用');
    }

    const state = this.generateState();
    this.saveOAuthState('qq', state);

    // 构建授权 URL
    const params = new URLSearchParams({
      client_id: provider.appId,
      redirect_uri: encodeURIComponent(provider.redirectUri),
      response_type: 'code',
      scope: provider.scope,
      state: state
    });

    const authUrl = `${provider.authEndpoint}?${params.toString()}`;
    
    // 打开授权页面
    this.openOAuthWindow(authUrl, 'qq');
  }

  // =============================================
  // 打开 OAuth 授权窗口
  // =============================================
  openOAuthWindow(url, provider) {
    const width = 600;
    const height = 700;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    this.currentProvider = provider;
    
    this.callbackWindow = window.open(
      url,
      `oauth_${provider}`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    // 监听窗口关闭
    const checkWindow = setInterval(() => {
      if (this.callbackWindow && this.callbackWindow.closed) {
        clearInterval(checkWindow);
        console.log(`[OAuth] ${provider} 授权窗口已关闭`);
        this.callbackWindow = null;
      }
    }, 1000);
  }

  // =============================================
  // 处理 OAuth 回调
  // =============================================
  async handleCallback(code, state) {
    // 验证 state
    const oauthState = this.validateOAuthState(state);
    if (!oauthState) {
      throw new Error('OAuth 状态验证失败');
    }

    const provider = oauthState.provider;
    console.log(`[OAuth] 处理 ${provider} 回调, code: ${code}`);

    // 根据不同的提供商处理回调
    switch (provider) {
      case 'google':
        return await this.handleGoogleCallback(code);
      case 'github':
        return await this.handleGitHubCallback(code);
      case 'wechat':
        return await this.handleWeChatCallback(code);
      case 'qq':
        return await this.handleQQCallback(code);
      default:
        throw new Error(`未知的 OAuth 提供商: ${provider}`);
    }
  }

  // =============================================
  // 处理 Google 回调
  // =============================================
  async handleGoogleCallback(code) {
    // 注意: 实际项目中，令牌交换应在后端完成
    // 这里仅作演示，生产环境需要后端 API

    console.log('[OAuth] Google 登录成功, code:', code);
    
    // 模拟获取用户信息
    const mockUser = {
      id: `google_${Date.now()}`,
      email: 'user@gmail.com',
      username: 'Google User',
      avatar: 'https://via.placeholder.com/100',
      provider: 'google',
      email_confirmed: true
    };

    // 清除 OAuth 状态
    this.clearOAuthState();

    return {
      success: true,
      user: mockUser,
      message: 'Google 登录成功'
    };
  }

  // =============================================
  // 处理 GitHub 回调
  // =============================================
  async handleGitHubCallback(code) {
    console.log('[OAuth] GitHub 登录成功, code:', code);
    
    // 模拟获取用户信息
    const mockUser = {
      id: `github_${Date.now()}`,
      email: 'user@github.com',
      username: 'GitHub User',
      avatar: 'https://via.placeholder.com/100',
      provider: 'github',
      email_confirmed: true
    };

    this.clearOAuthState();

    return {
      success: true,
      user: mockUser,
      message: 'GitHub 登录成功'
    };
  }

  // =============================================
  // 处理微信回调
  // =============================================
  async handleWeChatCallback(code) {
    console.log('[OAuth] 微信登录成功, code:', code);
    
    // 模拟获取用户信息
    const mockUser = {
      id: `wechat_${Date.now()}`,
      email: '',  // 微信不提供邮箱
      username: '微信用户',
      avatar: 'https://via.placeholder.com/100',
      provider: 'wechat',
      email_confirmed: false,
      openid: `wx_${Date.now()}`
    };

    this.clearOAuthState();

    return {
      success: true,
      user: mockUser,
      message: '微信登录成功',
      needsEmail: true  // 微信登录后需要绑定邮箱
    };
  }

  // =============================================
  // 处理 QQ 回调
  // =============================================
  async handleQQCallback(code) {
    console.log('[OAuth] QQ 登录成功, code:', code);
    
    // 模拟获取用户信息
    const mockUser = {
      id: `qq_${Date.now()}`,
      email: '',  // QQ 可能不提供邮箱
      username: 'QQ用户',
      avatar: 'https://via.placeholder.com/100',
      provider: 'qq',
      email_confirmed: false,
      openid: `qq_${Date.now()}`
    };

    this.clearOAuthState();

    return {
      success: true,
      user: mockUser,
      message: 'QQ 登录成功',
      needsEmail: true  // QQ 登录后建议绑定邮箱
    };
  }

  // =============================================
  // 获取已启用的登录提供商
  // =============================================
  getEnabledProviders() {
    return Object.keys(this.providers).filter(key => this.providers[key].enabled);
  }

  // =============================================
  // 获取提供商配置
  // =============================================
  getProvider(name) {
    return this.providers[name];
  }
}

// 导出全局实例
window.OAuthManager = new OAuthManager();

console.log('[OAuth] 第三方登录管理器已初始化');
console.log('[OAuth] 已启用的提供商:', window.OAuthManager.getEnabledProviders());
