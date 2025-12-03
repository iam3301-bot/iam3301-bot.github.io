// =============================================
// GameBox Supabase 配置文件
// =============================================
// 使用方法:
// 1. 访问 https://supabase.com 创建免费账户
// 2. 创建新项目
// 3. 在 Settings > API 中获取 Project URL 和 anon key
// 4. 将下面的配置替换为你的真实值
// =============================================

const SUPABASE_CONFIG = {
  // 替换为你的 Supabase Project URL
  // 格式: https://xxxxxxxxxxxxx.supabase.co
  url: 'https://demo-project.supabase.co',
  
  // 替换为你的 Supabase anon/public key
  // 这是公开密钥，可以安全地在前端使用
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-key-replace-with-your-own',
  
  // 是否启用 Supabase (设为 false 使用本地模拟模式)
  enabled: false,
  
  // OAuth 配置 (需要在 Supabase Dashboard 中配置)
  oauth: {
    google: {
      enabled: false,
      // 在 Supabase Dashboard > Authentication > Providers 配置
    },
    github: {
      enabled: false,
      // 在 Supabase Dashboard > Authentication > Providers 配置
    }
  },
  
  // 邮件配置
  email: {
    // 是否需要邮箱验证 (Supabase 免费版默认需要)
    confirmationRequired: true,
    // 重定向 URL (需要在 Supabase Dashboard 配置)
    redirectUrl: window.location.origin
  }
};

// =============================================
// Supabase 客户端初始化
// =============================================

let supabaseClient = null;

// 初始化 Supabase 客户端
function initSupabase() {
  if (SUPABASE_CONFIG.enabled && typeof supabase !== 'undefined') {
    try {
      supabaseClient = supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
          }
        }
      );
      console.log('[GameBox Auth] Supabase 客户端初始化成功');
      return true;
    } catch (error) {
      console.error('[GameBox Auth] Supabase 初始化失败:', error);
      return false;
    }
  }
  return false;
}

// 获取 Supabase 客户端
function getSupabase() {
  return supabaseClient;
}

// 检查是否使用 Supabase
function isSupabaseEnabled() {
  return SUPABASE_CONFIG.enabled && supabaseClient !== null;
}

// =============================================
// 本地存储模拟 (当 Supabase 未配置时使用)
// =============================================

const LOCAL_AUTH = {
  USERS_KEY: 'gamebox_users',
  SESSION_KEY: 'gamebox_session',
  
  // 初始化本地用户数据库
  init() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers = [
        {
          id: 'demo-user-001',
          email: 'demo@gamebox.test',
          password: 'demo123456',
          username: '演示玩家',
          avatar: '🎮',
          email_confirmed: true,
          created_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }
  },
  
  // 获取所有本地用户
  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },
  
  // 保存本地用户
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },
  
  // 获取当前会话
  getSession() {
    const session = localStorage.getItem(this.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },
  
  // 设置会话
  setSession(user) {
    const session = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        email_confirmed: user.email_confirmed
      },
      login_time: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天过期
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    
    // 兼容其他页面
    localStorage.setItem('currentUser', JSON.stringify({
      username: user.username,
      nickname: user.username,
      email: user.email
    }));
    
    return session;
  },
  
  // 清除会话
  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem('currentUser');
  },
  
  // 检查会话是否有效
  isSessionValid() {
    const session = this.getSession();
    if (!session) return false;
    
    const expiresAt = new Date(session.expires_at);
    return expiresAt > new Date();
  }
};

// =============================================
// 统一认证 API
// =============================================

const GameBoxAuth = {
  // 初始化
  async init() {
    LOCAL_AUTH.init();
    const supabaseReady = initSupabase();
    
    if (supabaseReady) {
      // 监听 Supabase 认证状态变化
      supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('[GameBox Auth] 认证状态变化:', event);
        if (event === 'SIGNED_IN' && session) {
          this._syncUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          LOCAL_AUTH.clearSession();
        }
      });
    }
    
    console.log('[GameBox Auth] 初始化完成, 模式:', supabaseReady ? 'Supabase' : '本地模拟');
    return { mode: supabaseReady ? 'supabase' : 'local' };
  },
  
  // 注册
  async signUp(email, password, username) {
    if (isSupabaseEnabled()) {
      return this._supabaseSignUp(email, password, username);
    } else {
      return this._localSignUp(email, password, username);
    }
  },
  
  // Supabase 注册
  async _supabaseSignUp(email, password, username) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
            avatar: this._getRandomAvatar()
          },
          emailRedirectTo: SUPABASE_CONFIG.email.redirectUrl
        }
      });
      
      if (error) throw error;
      
      // 检查是否需要邮箱验证
      if (data.user && !data.session) {
        return {
          success: true,
          needsEmailConfirmation: true,
          message: '注册成功！请查收验证邮件完成注册。',
          user: data.user
        };
      }
      
      return {
        success: true,
        needsEmailConfirmation: false,
        message: '注册成功！',
        user: data.user,
        session: data.session
      };
    } catch (error) {
      console.error('[GameBox Auth] Supabase 注册失败:', error);
      
      // 转换错误消息
      let message = error.message;
      if (message.includes('User already registered')) {
        message = '该邮箱已被注册';
      } else if (message.includes('Password should be')) {
        message = '密码至少需要6位字符';
      } else if (message.includes('Invalid email')) {
        message = '请输入有效的邮箱地址';
      }
      
      return {
        success: false,
        error: message
      };
    }
  },
  
  // 本地注册
  async _localSignUp(email, password, username) {
    await this._simulateDelay();
    
    const users = LOCAL_AUTH.getUsers();
    
    // 检查邮箱是否已存在
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: '该邮箱已被注册' };
    }
    
    // 检查用户名是否已存在
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: '该用户名已被使用' };
    }
    
    // 创建新用户
    const newUser = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      password: password,
      username: username,
      avatar: this._getRandomAvatar(),
      email_confirmed: true, // 本地模式默认已验证
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    LOCAL_AUTH.saveUsers(users);
    
    return {
      success: true,
      needsEmailConfirmation: false,
      message: '注册成功！',
      user: newUser
    };
  },
  
  // 登录
  async signIn(email, password) {
    if (isSupabaseEnabled()) {
      return this._supabaseSignIn(email, password);
    } else {
      return this._localSignIn(email, password);
    }
  },
  
  // Supabase 登录
  async _supabaseSignIn(email, password) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) throw error;
      
      return {
        success: true,
        message: '登录成功！',
        user: data.user,
        session: data.session
      };
    } catch (error) {
      console.error('[GameBox Auth] Supabase 登录失败:', error);
      
      let message = error.message;
      if (message.includes('Invalid login credentials')) {
        message = '邮箱或密码错误';
      } else if (message.includes('Email not confirmed')) {
        message = '请先验证您的邮箱';
      }
      
      return {
        success: false,
        error: message
      };
    }
  },
  
  // 本地登录
  async _localSignIn(email, password) {
    await this._simulateDelay();
    
    const users = LOCAL_AUTH.getUsers();
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (!user) {
      return { success: false, error: '邮箱或密码错误' };
    }
    
    const session = LOCAL_AUTH.setSession(user);
    
    return {
      success: true,
      message: '登录成功！',
      user: user,
      session: session
    };
  },
  
  // 登出
  async signOut() {
    if (isSupabaseEnabled()) {
      try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
      } catch (error) {
        console.error('[GameBox Auth] Supabase 登出失败:', error);
      }
    }
    
    LOCAL_AUTH.clearSession();
    
    return { success: true, message: '已成功退出登录' };
  },
  
  // 获取当前用户
  async getCurrentUser() {
    if (isSupabaseEnabled()) {
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error || !user) return null;
        
        return {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email.split('@')[0],
          avatar: user.user_metadata?.avatar || '🎮',
          email_confirmed: user.email_confirmed_at !== null
        };
      } catch (error) {
        console.error('[GameBox Auth] 获取用户失败:', error);
        return null;
      }
    } else {
      const session = LOCAL_AUTH.getSession();
      if (session && LOCAL_AUTH.isSessionValid()) {
        return session.user;
      }
      return null;
    }
  },
  
  // 获取当前会话
  async getSession() {
    if (isSupabaseEnabled()) {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error || !session) return null;
        return session;
      } catch (error) {
        return null;
      }
    } else {
      return LOCAL_AUTH.getSession();
    }
  },
  
  // OAuth 登录 (Google)
  async signInWithGoogle() {
    if (!isSupabaseEnabled()) {
      return { success: false, error: 'Google 登录需要配置 Supabase' };
    }
    
    if (!SUPABASE_CONFIG.oauth.google.enabled) {
      return { success: false, error: 'Google 登录尚未启用，请在 Supabase Dashboard 配置' };
    }
    
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: SUPABASE_CONFIG.email.redirectUrl
        }
      });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // OAuth 登录 (GitHub)
  async signInWithGitHub() {
    if (!isSupabaseEnabled()) {
      return { success: false, error: 'GitHub 登录需要配置 Supabase' };
    }
    
    if (!SUPABASE_CONFIG.oauth.github.enabled) {
      return { success: false, error: 'GitHub 登录尚未启用，请在 Supabase Dashboard 配置' };
    }
    
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: SUPABASE_CONFIG.email.redirectUrl
        }
      });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // 重置密码
  async resetPassword(email) {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: SUPABASE_CONFIG.email.redirectUrl + '/reset-password.html'
        });
        
        if (error) throw error;
        
        return {
          success: true,
          message: '密码重置邮件已发送，请查收您的邮箱'
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    } else {
      return {
        success: false,
        error: '密码重置功能需要配置 Supabase'
      };
    }
  },
  
  // 更新密码
  async updatePassword(newPassword) {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabaseClient.auth.updateUser({
          password: newPassword
        });
        
        if (error) throw error;
        
        return {
          success: true,
          message: '密码已更新'
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    } else {
      // 本地模式更新密码
      const session = LOCAL_AUTH.getSession();
      if (!session) {
        return { success: false, error: '请先登录' };
      }
      
      const users = LOCAL_AUTH.getUsers();
      const userIndex = users.findIndex(u => u.id === session.user.id);
      
      if (userIndex === -1) {
        return { success: false, error: '用户不存在' };
      }
      
      users[userIndex].password = newPassword;
      LOCAL_AUTH.saveUsers(users);
      
      return {
        success: true,
        message: '密码已更新'
      };
    }
  },
  
  // 更新用户资料
  async updateProfile(updates) {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabaseClient.auth.updateUser({
          data: updates
        });
        
        if (error) throw error;
        
        return {
          success: true,
          message: '资料已更新',
          user: data.user
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    } else {
      const session = LOCAL_AUTH.getSession();
      if (!session) {
        return { success: false, error: '请先登录' };
      }
      
      const users = LOCAL_AUTH.getUsers();
      const userIndex = users.findIndex(u => u.id === session.user.id);
      
      if (userIndex === -1) {
        return { success: false, error: '用户不存在' };
      }
      
      // 更新用户资料
      Object.assign(users[userIndex], updates);
      LOCAL_AUTH.saveUsers(users);
      
      // 更新会话
      LOCAL_AUTH.setSession(users[userIndex]);
      
      return {
        success: true,
        message: '资料已更新',
        user: users[userIndex]
      };
    }
  },
  
  // 同步用户资料到本地 (Supabase 模式)
  async _syncUserProfile(user) {
    if (!user) return;
    
    LOCAL_AUTH.setSession({
      id: user.id,
      email: user.email,
      username: user.user_metadata?.username || user.email.split('@')[0],
      avatar: user.user_metadata?.avatar || '🎮',
      email_confirmed: user.email_confirmed_at !== null
    });
  },
  
  // 随机头像
  _getRandomAvatar() {
    const avatars = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎢', '🎡', '🎠', '👾', '🤖', '🦊', '🐱', '🐶', '🐼', '🦁', '🐯', '🦄'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  },
  
  // 模拟网络延迟
  _simulateDelay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // 获取当前认证模式
  getAuthMode() {
    return isSupabaseEnabled() ? 'supabase' : 'local';
  },
  
  // 获取配置状态
  getConfigStatus() {
    return {
      supabaseEnabled: SUPABASE_CONFIG.enabled,
      supabaseConnected: isSupabaseEnabled(),
      googleOAuthEnabled: SUPABASE_CONFIG.oauth.google.enabled,
      githubOAuthEnabled: SUPABASE_CONFIG.oauth.github.enabled,
      emailConfirmationRequired: SUPABASE_CONFIG.email.confirmationRequired
    };
  },
  
  // =============================================
  // 邮箱验证码功能
  // =============================================
  
  // 发送邮箱验证码 (OTP)
  async sendEmailOTP(email) {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false // 仅验证邮箱，不创建用户
          }
        });
        
        if (error) throw error;
        
        return {
          success: true,
          message: '验证码已发送到您的邮箱，请查收'
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    } else {
      // 本地模式模拟验证码
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const otpData = {
        email: email.toLowerCase(),
        code: code,
        expires: Date.now() + 5 * 60 * 1000 // 5分钟过期
      };
      localStorage.setItem('gamebox_email_otp', JSON.stringify(otpData));
      
      console.log(`[演示模式] 邮箱验证码: ${code}`);
      
      return {
        success: true,
        message: '验证码已发送 (演示模式: 请在控制台查看验证码)',
        // 演示模式下直接返回验证码
        demoCode: code
      };
    }
  },
  
  // 验证邮箱验证码
  async verifyEmailOTP(email, code) {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabaseClient.auth.verifyOtp({
          email: email,
          token: code,
          type: 'email'
        });
        
        if (error) throw error;
        
        return {
          success: true,
          message: '邮箱验证成功'
        };
      } catch (error) {
        return { success: false, error: '验证码错误或已过期' };
      }
    } else {
      // 本地模式验证
      const otpDataStr = localStorage.getItem('gamebox_email_otp');
      if (!otpDataStr) {
        return { success: false, error: '请先发送验证码' };
      }
      
      const otpData = JSON.parse(otpDataStr);
      
      if (otpData.email !== email.toLowerCase()) {
        return { success: false, error: '邮箱不匹配' };
      }
      
      if (Date.now() > otpData.expires) {
        localStorage.removeItem('gamebox_email_otp');
        return { success: false, error: '验证码已过期，请重新发送' };
      }
      
      if (otpData.code !== code) {
        return { success: false, error: '验证码错误' };
      }
      
      // 验证成功，清除验证码
      localStorage.removeItem('gamebox_email_otp');
      
      return {
        success: true,
        message: '邮箱验证成功'
      };
    }
  },
  
  // 带验证码的注册
  async signUpWithOTP(email, password, username, otpCode) {
    // 先验证验证码
    const verifyResult = await this.verifyEmailOTP(email, otpCode);
    if (!verifyResult.success) {
      return verifyResult;
    }
    
    // 验证通过后注册
    return this.signUp(email, password, username);
  }
};

// =============================================
// Steam 集成 API
// =============================================

const STEAM_CONFIG = {
  // Steam Web API Key (用户需要自行申请: https://steamcommunity.com/dev/apikey)
  apiKey: '',
  
  // 是否启用 Steam 集成
  enabled: false,
  
  // CORS 代理 (由于浏览器限制，需要通过代理访问 Steam API)
  // 可以使用自己的后端代理或公共代理服务
  proxyUrl: 'https://api.allorigins.win/raw?url='
};

const SteamAPI = {
  // 初始化
  init() {
    console.log('[Steam API] 初始化, 启用状态:', STEAM_CONFIG.enabled);
  },
  
  // 检查是否启用
  isEnabled() {
    return STEAM_CONFIG.enabled && STEAM_CONFIG.apiKey;
  },
  
  // 从 Steam 个人资料 URL 提取 SteamID64
  async resolveSteamId(profileUrl) {
    // 支持多种格式:
    // https://steamcommunity.com/id/customurl
    // https://steamcommunity.com/profiles/76561198xxxxxxxxx
    // 76561198xxxxxxxxx (直接 ID)
    
    let steamId = profileUrl.trim();
    
    // 如果已经是纯数字 ID
    if (/^\d{17}$/.test(steamId)) {
      return { success: true, steamId: steamId };
    }
    
    // 从 URL 提取
    const profileMatch = steamId.match(/steamcommunity\.com\/profiles\/(\d{17})/);
    if (profileMatch) {
      return { success: true, steamId: profileMatch[1] };
    }
    
    // 自定义 URL 格式
    const customMatch = steamId.match(/steamcommunity\.com\/id\/([^\/\?]+)/);
    if (customMatch) {
      const vanityUrl = customMatch[1];
      
      if (!this.isEnabled()) {
        return { 
          success: false, 
          error: '解析自定义 URL 需要 Steam API Key。请直接输入您的 SteamID64，或使用个人资料链接格式: steamcommunity.com/profiles/您的ID' 
        };
      }
      
      // 调用 Steam API 解析
      try {
        const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_CONFIG.apiKey}&vanityurl=${vanityUrl}`;
        const response = await fetch(STEAM_CONFIG.proxyUrl + encodeURIComponent(url));
        const data = await response.json();
        
        if (data.response && data.response.success === 1) {
          return { success: true, steamId: data.response.steamid };
        } else {
          return { success: false, error: '无法解析该 Steam 个人资料' };
        }
      } catch (error) {
        return { success: false, error: '解析失败: ' + error.message };
      }
    }
    
    return { success: false, error: '无效的 Steam 个人资料链接或 ID' };
  },
  
  // 获取用户信息
  async getPlayerSummary(steamId) {
    if (!this.isEnabled()) {
      // 本地模式 - 返回模拟数据
      return this._getMockPlayerSummary(steamId);
    }
    
    try {
      const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_CONFIG.apiKey}&steamids=${steamId}`;
      const response = await fetch(STEAM_CONFIG.proxyUrl + encodeURIComponent(url));
      const data = await response.json();
      
      if (data.response && data.response.players && data.response.players.length > 0) {
        const player = data.response.players[0];
        return {
          success: true,
          player: {
            steamId: player.steamid,
            personaName: player.personaname,
            profileUrl: player.profileurl,
            avatar: player.avatarfull || player.avatarmedium || player.avatar,
            personaState: player.personastate, // 0=离线, 1=在线, 2=忙碌, 3=离开, 4=打盹, 5=想交易, 6=想玩
            visibility: player.communityvisibilitystate, // 1=私密, 3=公开
            lastLogoff: player.lastlogoff,
            gameId: player.gameid,
            gameExtraInfo: player.gameextrainfo
          }
        };
      }
      
      return { success: false, error: '未找到该用户' };
    } catch (error) {
      return { success: false, error: '获取用户信息失败: ' + error.message };
    }
  },
  
  // 获取拥有的游戏
  async getOwnedGames(steamId, includeAppInfo = true, includeFreeGames = true) {
    if (!this.isEnabled()) {
      // 本地模式 - 返回模拟数据
      return this._getMockOwnedGames(steamId);
    }
    
    try {
      let url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_CONFIG.apiKey}&steamid=${steamId}&format=json`;
      if (includeAppInfo) url += '&include_appinfo=1';
      if (includeFreeGames) url += '&include_played_free_games=1';
      
      const response = await fetch(STEAM_CONFIG.proxyUrl + encodeURIComponent(url));
      const data = await response.json();
      
      if (data.response) {
        const games = data.response.games || [];
        return {
          success: true,
          gameCount: data.response.game_count || games.length,
          games: games.map(game => ({
            appId: game.appid,
            name: game.name || `App ${game.appid}`,
            playtimeForever: game.playtime_forever || 0, // 总游戏时间(分钟)
            playtime2Weeks: game.playtime_2weeks || 0, // 最近两周游戏时间
            imgIconUrl: game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null,
            imgLogoUrl: game.img_logo_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg` : null,
            // Steam 商店封面图
            headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`
          }))
        };
      }
      
      return { success: false, error: '获取游戏库失败，可能是用户资料设为私密' };
    } catch (error) {
      return { success: false, error: '获取游戏库失败: ' + error.message };
    }
  },
  
  // 获取最近游玩的游戏
  async getRecentlyPlayedGames(steamId, count = 10) {
    if (!this.isEnabled()) {
      return this._getMockRecentGames(steamId);
    }
    
    try {
      const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_CONFIG.apiKey}&steamid=${steamId}&count=${count}&format=json`;
      const response = await fetch(STEAM_CONFIG.proxyUrl + encodeURIComponent(url));
      const data = await response.json();
      
      if (data.response) {
        const games = data.response.games || [];
        return {
          success: true,
          totalCount: data.response.total_count || games.length,
          games: games.map(game => ({
            appId: game.appid,
            name: game.name,
            playtimeForever: game.playtime_forever || 0,
            playtime2Weeks: game.playtime_2weeks || 0,
            imgIconUrl: game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : null,
            headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`
          }))
        };
      }
      
      return { success: false, error: '获取最近游戏失败' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // 获取成就
  async getPlayerAchievements(steamId, appId) {
    if (!this.isEnabled()) {
      return { success: false, error: '成就功能需要 Steam API Key' };
    }
    
    try {
      const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${STEAM_CONFIG.apiKey}&steamid=${steamId}`;
      const response = await fetch(STEAM_CONFIG.proxyUrl + encodeURIComponent(url));
      const data = await response.json();
      
      if (data.playerstats && data.playerstats.achievements) {
        const achievements = data.playerstats.achievements;
        const achieved = achievements.filter(a => a.achieved === 1).length;
        
        return {
          success: true,
          gameName: data.playerstats.gameName,
          achievements: achievements,
          achievedCount: achieved,
          totalCount: achievements.length,
          completionRate: Math.round((achieved / achievements.length) * 100)
        };
      }
      
      return { success: false, error: '获取成就失败' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // 格式化游戏时间
  formatPlaytime(minutes) {
    if (minutes < 60) return `${minutes} 分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
    const days = Math.floor(hours / 24);
    const remainHours = hours % 24;
    return `${days} 天 ${remainHours} 小时`;
  },
  
  // 获取在线状态文本
  getPersonaStateText(state) {
    const states = ['离线', '在线', '忙碌', '离开', '打盹', '想交易', '想玩游戏'];
    return states[state] || '未知';
  },
  
  // =============================================
  // 本地模拟数据 (演示用)
  // =============================================
  
  _getMockPlayerSummary(steamId) {
    return {
      success: true,
      player: {
        steamId: steamId || '76561198000000000',
        personaName: '演示玩家',
        profileUrl: 'https://steamcommunity.com/profiles/' + (steamId || '76561198000000000'),
        avatar: 'https://avatars.cloudflare.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
        personaState: 1,
        visibility: 3,
        lastLogoff: Math.floor(Date.now() / 1000) - 3600,
        gameId: null,
        gameExtraInfo: null
      },
      isDemo: true
    };
  },
  
  _getMockOwnedGames(steamId) {
    const mockGames = [
      { appId: 730, name: 'Counter-Strike 2', playtimeForever: 15420, playtime2Weeks: 840 },
      { appId: 570, name: 'Dota 2', playtimeForever: 8760, playtime2Weeks: 120 },
      { appId: 1245620, name: 'ELDEN RING', playtimeForever: 4320, playtime2Weeks: 360 },
      { appId: 1091500, name: 'Cyberpunk 2077', playtimeForever: 2880, playtime2Weeks: 0 },
      { appId: 1174180, name: 'Red Dead Redemption 2', playtimeForever: 3600, playtime2Weeks: 180 },
      { appId: 292030, name: 'The Witcher 3: Wild Hunt', playtimeForever: 5400, playtime2Weeks: 0 },
      { appId: 1551360, name: 'Forza Horizon 5', playtimeForever: 1200, playtime2Weeks: 60 },
      { appId: 1817070, name: 'Hogwarts Legacy', playtimeForever: 2160, playtime2Weeks: 0 },
      { appId: 2358720, name: 'Black Myth: Wukong', playtimeForever: 1800, playtime2Weeks: 720 },
      { appId: 1086940, name: 'Baldur\'s Gate 3', playtimeForever: 6000, playtime2Weeks: 480 }
    ];
    
    return {
      success: true,
      gameCount: mockGames.length,
      games: mockGames.map(game => ({
        ...game,
        imgIconUrl: null,
        imgLogoUrl: null,
        headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`
      })),
      isDemo: true
    };
  },
  
  _getMockRecentGames(steamId) {
    const recentGames = [
      { appId: 2358720, name: 'Black Myth: Wukong', playtimeForever: 1800, playtime2Weeks: 720 },
      { appId: 730, name: 'Counter-Strike 2', playtimeForever: 15420, playtime2Weeks: 840 },
      { appId: 1086940, name: 'Baldur\'s Gate 3', playtimeForever: 6000, playtime2Weeks: 480 },
      { appId: 1245620, name: 'ELDEN RING', playtimeForever: 4320, playtime2Weeks: 360 }
    ];
    
    return {
      success: true,
      totalCount: recentGames.length,
      games: recentGames.map(game => ({
        ...game,
        imgIconUrl: null,
        headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`
      })),
      isDemo: true
    };
  }
};

// =============================================
// 用户数据管理 (用户中心扩展)
// =============================================

const UserDataManager = {
  STORAGE_KEY: 'gamebox_user_data',
  
  // 获取用户数据
  getData(userId) {
    const allData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    return allData[userId] || this._getDefaultData();
  },
  
  // 保存用户数据
  saveData(userId, data) {
    const allData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    allData[userId] = { ...this.getData(userId), ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));
    return allData[userId];
  },
  
  // 默认数据结构
  _getDefaultData() {
    return {
      steam: {
        linked: false,
        steamId: null,
        personaName: null,
        avatar: null,
        lastSync: null,
        games: [],
        gameCount: 0,
        totalPlaytime: 0
      },
      preferences: {
        theme: 'cyberpunk',
        notifications: true,
        publicProfile: true
      },
      stats: {
        ownedGames: 0,
        wishlistGames: 0,
        totalPlaytime: 0,
        achievements: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  
  // 绑定 Steam 账号
  async linkSteam(userId, steamIdOrUrl) {
    // 解析 Steam ID
    const resolveResult = await SteamAPI.resolveSteamId(steamIdOrUrl);
    if (!resolveResult.success) {
      return resolveResult;
    }
    
    const steamId = resolveResult.steamId;
    
    // 获取用户信息
    const playerResult = await SteamAPI.getPlayerSummary(steamId);
    if (!playerResult.success) {
      return playerResult;
    }
    
    // 获取游戏库
    const gamesResult = await SteamAPI.getOwnedGames(steamId);
    
    // 计算总游戏时间
    let totalPlaytime = 0;
    if (gamesResult.success && gamesResult.games) {
      totalPlaytime = gamesResult.games.reduce((sum, g) => sum + (g.playtimeForever || 0), 0);
    }
    
    // 保存数据
    const userData = this.saveData(userId, {
      steam: {
        linked: true,
        steamId: steamId,
        personaName: playerResult.player.personaName,
        avatar: playerResult.player.avatar,
        profileUrl: playerResult.player.profileUrl,
        lastSync: new Date().toISOString(),
        games: gamesResult.success ? gamesResult.games : [],
        gameCount: gamesResult.success ? gamesResult.gameCount : 0,
        totalPlaytime: totalPlaytime
      }
    });
    
    return {
      success: true,
      message: 'Steam 账号绑定成功！',
      data: userData.steam,
      isDemo: playerResult.isDemo || gamesResult.isDemo
    };
  },
  
  // 解绑 Steam 账号
  unlinkSteam(userId) {
    const userData = this.getData(userId);
    userData.steam = {
      linked: false,
      steamId: null,
      personaName: null,
      avatar: null,
      lastSync: null,
      games: [],
      gameCount: 0,
      totalPlaytime: 0
    };
    this.saveData(userId, userData);
    
    return { success: true, message: 'Steam 账号已解绑' };
  },
  
  // 同步 Steam 数据
  async syncSteam(userId) {
    const userData = this.getData(userId);
    
    if (!userData.steam.linked || !userData.steam.steamId) {
      return { success: false, error: '请先绑定 Steam 账号' };
    }
    
    return this.linkSteam(userId, userData.steam.steamId);
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameBoxAuth, SUPABASE_CONFIG, LOCAL_AUTH, SteamAPI, STEAM_CONFIG, UserDataManager };
}
