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
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameBoxAuth, SUPABASE_CONFIG, LOCAL_AUTH };
}
