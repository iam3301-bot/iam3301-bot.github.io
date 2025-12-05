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
  // =============================================
  // ⚠️ 重要: 配置 Supabase 以启用多用户功能
  // =============================================
  // 当前为演示模式(本地存储)，用户数据不能跨浏览器共享
  // 
  // 配置步骤:
  // 1. 访问 https://supabase.com 注册免费账户
  // 2. 创建新项目 (免费版支持 500MB 数据库, 50000 用户)
  // 3. 进入项目 Settings > API
  // 4. 复制 Project URL 和 anon public key
  // 5. 将下面的值替换为你的真实配置
  // 6. 将 enabled 改为 true
  // =============================================
  
  // 替换为你的 Supabase Project URL
  // 格式: https://xxxxxxxxxxxxx.supabase.co
  url: 'https://gybgiqyyltckgxbdtzwu.supabase.co',
  
  // 替换为你的 Supabase anon/public key
  // 这是公开密钥，可以安全地在前端使用
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YmdpcXl5bHRja2d4YmR0end1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MTA2MDksImV4cCI6MjA4MDM4NjYwOX0.WWF_rPUyIVOFDccLXm06Npf6J3fJoA_bbFoVJeZQzrA',
  
  // ✅ 已启用 Supabase 云数据库 (多用户共享)
  enabled: true,
  
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
// 邮件服务配置 (用于发送真实验证码)
// =============================================
// 支持的服务:
// 1. Resend (推荐, 免费 3000 封/月): https://resend.com
// 2. EmailJS (免费 200 封/月): https://emailjs.com
// 3. 自定义后端 API
// =============================================

const EMAIL_SERVICE_CONFIG = {
  // 邮件服务提供商: 'emailjs' | 'resend_proxy' | 'custom' | 'demo'
  // 推荐使用 emailjs - 支持纯前端调用，无需后端
  provider: 'emailjs',
  
  // =============================================
  // EmailJS 配置 (推荐 - 纯前端方案)
  // 免费版: 200 封/月
  // 配置步骤:
  // 1. 访问 https://www.emailjs.com 注册账号
  // 2. 创建 Email Service (选择 Gmail/Outlook 等)
  // 3. 创建 Email Template, 使用以下变量:
  //    - {{to_email}} - 收件人邮箱
  //    - {{verification_code}} - 验证码
  //    - {{app_name}} - 应用名称 (GameBox 游盒)
  // 4. 获取 Service ID, Template ID, Public Key
  // =============================================
  emailjs: {
    serviceId: 'service_bymjkqh',  // EmailJS Service ID (QQ Mail SMTP)
    templateId: 'template_df6t50r',     // EmailJS Template ID  
    publicKey: 'Z6VWjqql5Idf6t027',   // EmailJS Public Key
    enabled: true  // 已启用真实邮件发送 (使用QQ邮箱授权码)
  },
  
  // =============================================
  // Resend 配置 (需要后端代理)
  // 免费版: 3000 封/月, 100 封/日
  // 注意: Resend API Key 不能暴露在前端
  // 需要设置后端代理或使用 Serverless Function
  // =============================================
  resend: {
    proxyEndpoint: '', // 你的后端代理地址
    // 后端示例: Cloudflare Worker / Vercel Function
  },
  
  // 自定义后端 API
  custom: {
    endpoint: '',
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
    
    // 恢复永久存储的用户数据
    this._restoreUsersFromPermanentStorage();
    
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
    console.log('[GameBox Auth] 用户数据永久存储: 已启用');
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
    
    // 创建新用户 (注意: email_confirmed 设为 false，必须验证)
    const newUser = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      password: password,
      username: username,
      avatar: this._getRandomAvatar(),
      email_confirmed: false, // 必须邮箱验证
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    LOCAL_AUTH.saveUsers(users);
    
    // 保存到永久存储（防止数据丢失）
    this._saveUserToPermanentStorage(newUser);
    
    return {
      success: true,
      needsEmailConfirmation: true, // 需要邮箱验证
      message: '注册成功！请使用邮箱验证码完成注册。',
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
    
    // 检查邮箱是否已验证
    if (!user.email_confirmed) {
      return { 
        success: false, 
        error: '邮箱尚未验证，请先完成邮箱验证',
        needsVerification: true
      };
    }
    
    // 更新最后登录时间
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].last_login = new Date().toISOString();
      users[userIndex].updated_at = new Date().toISOString();
      LOCAL_AUTH.saveUsers(users);
      
      // 更新永久存储
      this._saveUserToPermanentStorage(users[userIndex]);
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
    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otpData = {
      email: email.toLowerCase(),
      code: code,
      expires: Date.now() + 5 * 60 * 1000 // 5分钟过期
    };
    
    // 保存验证码到本地 (用于验证)
    localStorage.setItem('gamebox_email_otp', JSON.stringify(otpData));
    
    // 根据配置选择邮件服务
    const provider = EMAIL_SERVICE_CONFIG.provider;
    
    // EmailJS - 推荐的纯前端方案
    if (provider === 'emailjs' && EMAIL_SERVICE_CONFIG.emailjs.enabled) {
      return await this._sendEmailWithEmailJS(email, code);
    }
    // Resend 代理方案
    else if (provider === 'resend_proxy' && EMAIL_SERVICE_CONFIG.resend.proxyEndpoint) {
      return await this._sendEmailWithResendProxy(email, code);
    }
    // 自定义后端
    else if (provider === 'custom' && EMAIL_SERVICE_CONFIG.custom.endpoint) {
      return await this._sendEmailWithCustomAPI(email, code);
    }
    // Supabase 内置 OTP
    else if (isSupabaseEnabled()) {
      // 使用 Supabase OTP
      try {
        const { data, error } = await supabaseClient.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false
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
      // 演示模式
      console.log(`[演示模式] 邮箱验证码: ${code}`);
      
      return {
        success: true,
        message: '验证码已发送 (演示模式: 请查看页面显示的验证码)',
        demoCode: code
      };
    }
  },
  
  // 使用 Resend 代理发送邮件 (需要后端代理)
  async _sendEmailWithResendProxy(email, code) {
    try {
      const response = await fetch(EMAIL_SERVICE_CONFIG.resend.proxyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: email,
          code: code,
          type: 'verification'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: '验证码已发送到您的邮箱，请查收'
        };
      } else {
        return { success: false, error: data.error || '邮件发送失败' };
      }
    } catch (error) {
      console.error('[Resend Proxy] 请求错误:', error);
      return { success: false, error: '网络错误，请稍后重试' };
    }
  },
  
  // 使用 EmailJS 发送邮件 (推荐 - 纯前端方案)
  async _sendEmailWithEmailJS(email, code) {
    try {
      // 检查 EmailJS SDK 是否已加载
      if (typeof emailjs === 'undefined') {
        // 动态加载 EmailJS SDK
        await this._loadEmailJSSDK();
      }
      
      // 初始化 EmailJS
      emailjs.init(EMAIL_SERVICE_CONFIG.emailjs.publicKey);
      
      // 发送邮件
      const result = await emailjs.send(
        EMAIL_SERVICE_CONFIG.emailjs.serviceId,
        EMAIL_SERVICE_CONFIG.emailjs.templateId,
        {
          to_email: email,
          verification_code: code,
          app_name: 'GameBox 游盒',
          message: `您的验证码是: ${code}，有效期5分钟。`
        }
      );
      
      console.log('[EmailJS] 发送成功:', result);
      
      return {
        success: true,
        message: '验证码已发送到您的邮箱，请查收'
      };
    } catch (error) {
      console.error('[EmailJS] 发送失败:', error);
      // 如果 EmailJS 失败，回退到演示模式
      console.log(`[回退演示模式] 邮箱验证码: ${code}`);
      return { 
        success: true, 
        message: '验证码已发送 (演示模式)',
        demoCode: code
      };
    }
  },
  
  // 动态加载 EmailJS SDK
  async _loadEmailJSSDK() {
    return new Promise((resolve, reject) => {
      if (typeof emailjs !== 'undefined') {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },
  
  // 使用自定义 API 发送邮件
  async _sendEmailWithCustomAPI(email, code) {
    try {
      const response = await fetch(EMAIL_SERVICE_CONFIG.custom.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          code: code,
          type: 'verification'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: '验证码已发送到您的邮箱，请查收'
        };
      } else {
        return { success: false, error: data.error || '发送失败' };
      }
    } catch (error) {
      console.error('[Custom API] 请求错误:', error);
      return { success: false, error: '网络错误，请稍后重试' };
    }
  },
  
  // 验证邮箱验证码
  // 重要: 无论是 Supabase 模式还是本地模式，都使用本地存储的验证码验证
  // 因为 EmailJS 发送的验证码存储在本地，不是 Supabase 的 OTP
  async verifyEmailOTP(email, code) {
    // 统一使用本地存储验证（因为验证码是我们通过 EmailJS 发送并存储在本地的）
    const otpDataStr = localStorage.getItem('gamebox_email_otp');
    
    if (!otpDataStr) {
      return { success: false, error: '请先发送验证码' };
    }
    
    const otpData = JSON.parse(otpDataStr);
    
    // 检查邮箱是否匹配
    if (otpData.email !== email.toLowerCase()) {
      return { success: false, error: '邮箱不匹配，请确认输入的邮箱地址' };
    }
    
    // 检查验证码是否过期
    if (Date.now() > otpData.expires) {
      localStorage.removeItem('gamebox_email_otp');
      const expiredMinutesAgo = Math.round((Date.now() - otpData.expires) / 60000);
      return { 
        success: false, 
        error: `验证码已过期${expiredMinutesAgo > 0 ? `（${expiredMinutesAgo}分钟前）` : ''}，请重新发送` 
      };
    }
    
    // 检查验证码是否正确
    if (otpData.code !== code) {
      return { success: false, error: '验证码错误，请检查后重试' };
    }
    
    // 验证成功，清除验证码
    localStorage.removeItem('gamebox_email_otp');
    
    console.log('[GameBox Auth] 验证码验证成功:', email);
    
    return {
      success: true,
      message: '邮箱验证成功'
    };
  },
  
  // 带验证码的注册（强制验证）
  async signUpWithOTP(email, password, username, otpCode) {
    // 无论是 Supabase 模式还是本地模式，都先验证 EmailJS 发送的验证码
    // 因为我们使用 EmailJS 发送验证码，验证码存储在本地 localStorage
    
    console.log('[GameBox Auth] signUpWithOTP 开始, Supabase 模式:', isSupabaseEnabled());
    
    // 第一步：验证验证码（使用本地存储验证）
    const verifyResult = await this.verifyEmailOTP(email, otpCode);
    if (!verifyResult.success) {
      console.log('[GameBox Auth] 验证码验证失败:', verifyResult.error);
      return verifyResult;
    }
    
    console.log('[GameBox Auth] 验证码验证成功，开始注册');
    
    // 第二步：验证通过后注册
    const signUpResult = await this.signUp(email, password, username);
    
    if (signUpResult.success) {
      // Supabase 模式：用户已创建
      if (isSupabaseEnabled()) {
        console.log('[GameBox Auth] Supabase 注册成功');
        // 如果 Supabase 返回需要邮箱验证，我们已经通过 EmailJS 验证过了
        // 所以可以告知用户注册成功
        signUpResult.message = '注册成功！您可以立即登录。';
        signUpResult.needsEmailConfirmation = false;
      } 
      // 本地模式：标记邮箱已验证
      else if (signUpResult.user) {
        const users = LOCAL_AUTH.getUsers();
        const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
        if (userIndex !== -1) {
          users[userIndex].email_confirmed = true;
          users[userIndex].email_verified_at = new Date().toISOString();
          users[userIndex].updated_at = new Date().toISOString();
          LOCAL_AUTH.saveUsers(users);
          
          // 更新永久存储
          this._saveUserToPermanentStorage(users[userIndex]);
          
          signUpResult.user.email_confirmed = true;
        }
        signUpResult.message = '注册成功！您可以立即登录。';
      }
    }
    
    return signUpResult;
  },
  
  // 保存用户到永久存储（防止数据丢失）
  _saveUserToPermanentStorage(user) {
    try {
      // 使用专门的永久存储 key
      const PERMANENT_USERS_KEY = 'gamebox_permanent_users';
      const permanentUsers = JSON.parse(localStorage.getItem(PERMANENT_USERS_KEY) || '[]');
      
      // 查找是否已存在
      const existingIndex = permanentUsers.findIndex(u => u.id === user.id);
      
      if (existingIndex !== -1) {
        // 更新现有用户（保留所有历史数据）
        permanentUsers[existingIndex] = {
          ...permanentUsers[existingIndex],
          ...user,
          updated_at: new Date().toISOString()
        };
      } else {
        // 添加新用户
        permanentUsers.push({
          ...user,
          permanent_saved_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem(PERMANENT_USERS_KEY, JSON.stringify(permanentUsers));
      console.log('[GameBox Auth] 用户数据已保存到永久存储:', user.email);
    } catch (error) {
      console.error('[GameBox Auth] 保存到永久存储失败:', error);
    }
  },
  
  // 从永久存储恢复用户数据
  _restoreUsersFromPermanentStorage() {
    try {
      const PERMANENT_USERS_KEY = 'gamebox_permanent_users';
      const permanentUsers = JSON.parse(localStorage.getItem(PERMANENT_USERS_KEY) || '[]');
      
      if (permanentUsers.length > 0) {
        // 合并到当前用户列表
        const currentUsers = LOCAL_AUTH.getUsers();
        const currentEmails = new Set(currentUsers.map(u => u.email.toLowerCase()));
        
        permanentUsers.forEach(permUser => {
          if (!currentEmails.has(permUser.email.toLowerCase())) {
            currentUsers.push(permUser);
          }
        });
        
        LOCAL_AUTH.saveUsers(currentUsers);
        console.log('[GameBox Auth] 已从永久存储恢复用户数据');
      }
    } catch (error) {
      console.error('[GameBox Auth] 恢复永久存储失败:', error);
    }
  }
};

// =============================================
// Steam 集成 API
// =============================================

const STEAM_CONFIG = {
  // Steam Web API Key (用户需要自行申请: https://steamcommunity.com/dev/apikey)
  // 正确的 API Key 是 32 位十六进制字符串
  apiKey: '',
  
  // 是否启用 Steam 集成
  enabled: true,
  
  // CORS 代理列表 (按优先级排序，自动故障转移)
  proxyServers: [
    { name: 'corsproxy.io', url: 'https://corsproxy.io/?', active: true },
    { name: 'cors.lol', url: 'https://api.cors.lol/?url=', active: true },
    { name: 'allorigins', url: 'https://api.allorigins.win/raw?url=', active: true },
    { name: 'codetabs', url: 'https://api.codetabs.com/v1/proxy?quest=', active: true }
  ],
  
  currentProxyIndex: 0,
  proxyUrl: 'https://corsproxy.io/?'
};

const SteamAPI = {
  // 初始化
  init() {
    console.log('[Steam API] 初始化, 启用状态:', STEAM_CONFIG.enabled);
  },
  
  // 检查是否启用
  isEnabled() {
    // 检查是否启用且 API Key 有效（至少 10 个字符）
    return STEAM_CONFIG.enabled && STEAM_CONFIG.apiKey && STEAM_CONFIG.apiKey.length > 10;
  },
  
  // 获取当前代理服务器
  _getCurrentProxy() {
    const activeProxies = STEAM_CONFIG.proxyServers.filter(p => p.active);
    if (activeProxies.length === 0) {
      return STEAM_CONFIG.proxyUrl; // 回退到默认
    }
    const index = STEAM_CONFIG.currentProxyIndex % activeProxies.length;
    return activeProxies[index].url;
  },
  
  // 切换到下一个代理
  _switchToNextProxy() {
    const activeProxies = STEAM_CONFIG.proxyServers.filter(p => p.active);
    if (activeProxies.length > 1) {
      STEAM_CONFIG.currentProxyIndex = (STEAM_CONFIG.currentProxyIndex + 1) % activeProxies.length;
      console.log('[Steam API] 切换到代理:', activeProxies[STEAM_CONFIG.currentProxyIndex % activeProxies.length].name);
    }
  },
  
  // 带故障转移的请求
  async _fetchWithFailover(url, maxRetries = 3) {
    const activeProxies = STEAM_CONFIG.proxyServers.filter(p => p.active);
    let lastError = null;
    
    for (let i = 0; i < Math.min(maxRetries, activeProxies.length); i++) {
      const proxyUrl = this._getCurrentProxy();
      const fullUrl = proxyUrl + encodeURIComponent(url);
      
      try {
        const response = await fetch(fullUrl, {
          timeout: 10000
        });
        
        if (response.ok) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            return { success: true, data };
          } catch (jsonError) {
            console.error('[Steam API] JSON 解析失败，响应内容:', text.substring(0, 200));
            throw new Error(`无效的 JSON 响应: ${text.substring(0, 50)}...`);
          }
        }
        
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        console.warn(`[Steam API] 代理请求失败 (${this._getCurrentProxy()}):`, error.message);
        lastError = error;
        this._switchToNextProxy();
      }
    }
    
    return { success: false, error: lastError?.message || '所有代理服务器均不可用' };
  },
  
  // 从 Steam 个人资料 URL 提取 SteamID64
  async resolveSteamId(profileUrl) {
    // 支持多种格式:
    // https://steamcommunity.com/id/customurl
    // https://steamcommunity.com/profiles/76561198xxxxxxxxx
    // 76561198xxxxxxxxx (直接 ID)
    // STEAM_X:Y:Z (旧格式)
    // [U:1:XXXXXX] (新格式)
    // 十六进制格式（如 Steam 客户端的某些显示）
    
    let steamId = profileUrl.trim();
    
    // 如果为空
    if (!steamId) {
      return { success: false, error: '请输入 Steam ID 或个人资料链接' };
    }
    
    console.log('[Steam API] 正在解析 Steam ID:', steamId);
    
    // 如果已经是纯数字 ID (17位 SteamID64)
    if (/^\d{17}$/.test(steamId)) {
      console.log('[Steam API] 识别为 SteamID64');
      return { success: true, steamId: steamId };
    }
    
    // 从 URL 提取 (profiles/数字格式)
    const profileMatch = steamId.match(/steamcommunity\.com\/profiles\/(\d{17})/);
    if (profileMatch) {
      console.log('[Steam API] 从 profiles URL 提取');
      return { success: true, steamId: profileMatch[1] };
    }
    
    // 自定义 URL 格式 (id/自定义名称)
    const customMatch = steamId.match(/steamcommunity\.com\/id\/([^\/\?]+)/);
    if (customMatch) {
      const vanityUrl = customMatch[1];
      console.log('[Steam API] 检测到自定义 URL:', vanityUrl);
      
      // 尝试使用 CORS 代理解析
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://steamcommunity.com/id/${vanityUrl}/?xml=1`
        )}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        // 从 XML 响应中提取 steamID64
        const steamIdMatch = data.contents.match(/<steamID64>(\d{17})<\/steamID64>/);
        if (steamIdMatch) {
          return { success: true, steamId: steamIdMatch[1] };
        }
      } catch (e) {
        console.error('解析自定义 URL 失败:', e);
      }
      
      // 如果代理失败且有 API Key，使用官方 API
      if (this.isEnabled()) {
        const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_CONFIG.apiKey}&vanityurl=${vanityUrl}`;
        const result = await this._fetchWithFailover(url);
        
        if (result.success && result.data.response && result.data.response.success === 1) {
          return { success: true, steamId: result.data.response.steamid };
        }
      }
      
      return { success: false, error: '无法解析该自定义 URL。请使用 SteamID64 格式（17位数字）或完整的个人资料链接' };
    }
    
    // 尝试解析旧格式 STEAM_X:Y:Z
    const oldFormatMatch = steamId.match(/^STEAM_(\d):(\d):(\d+)$/i);
    if (oldFormatMatch) {
      console.log('[Steam API] 识别为旧格式 STEAM_X:Y:Z');
      const Y = parseInt(oldFormatMatch[2]);
      const Z = parseInt(oldFormatMatch[3]);
      // 转换为 SteamID64: (Z * 2) + 76561197960265728 + Y
      const id64 = BigInt(Z) * BigInt(2) + BigInt('76561197960265728') + BigInt(Y);
      return { success: true, steamId: id64.toString() };
    }
    
    // 尝试解析新格式 [U:1:XXXXXX]
    const newFormatMatch = steamId.match(/^\[U:1:(\d+)\]$/);
    if (newFormatMatch) {
      console.log('[Steam API] 识别为新格式 [U:1:xxx]');
      const accountId = parseInt(newFormatMatch[1]);
      // 转换为 SteamID64: accountId + 76561197960265728
      const id64 = BigInt(accountId) + BigInt('76561197960265728');
      return { success: true, steamId: id64.toString() };
    }
    
    // 如果是纯数字但不是17位，可能是 AccountID
    if (/^\d+$/.test(steamId) && steamId.length < 17) {
      console.log('[Steam API] 尝试解析为 AccountID');
      const accountId = parseInt(steamId);
      if (accountId > 0) {
        const id64 = BigInt(accountId) + BigInt('76561197960265728');
        return { success: true, steamId: id64.toString() };
      }
    }
    
    // 尝试解析十六进制格式 (如 Steam 登录令牌等)
    // 格式如: 6F051DB2782265D282FBD7BA874A9AC1 (32位十六进制)
    if (/^[0-9A-Fa-f]{32}$/.test(steamId)) {
      console.log('[Steam API] 检测到32位十六进制格式，这不是有效的 Steam ID 格式');
      return { 
        success: false, 
        error: '您输入的是32位十六进制字符串，这不是有效的 Steam ID 格式。\n\n' +
               '请使用以下方法获取正确的 Steam ID：\n' +
               '1. 打开 Steam 客户端 → 查看 → 设置 → 界面 → 显示 Steam URL 地址栏\n' +
               '2. 点击您的个人资料，查看地址栏中的数字\n' +
               '3. 或访问 steamid.io 输入您的 Steam 个人资料链接查询\n\n' +
               '正确的 Steam ID 格式示例：76561198012345678'
      };
    }
    
    // 最后尝试：如果输入的是用户名，尝试通过 XML 页面解析
    if (/^[a-zA-Z0-9_-]+$/.test(steamId)) {
      console.log('[Steam API] 尝试作为自定义用户名解析:', steamId);
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://steamcommunity.com/id/${steamId}/?xml=1`
        )}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        const steamIdMatch = data.contents.match(/<steamID64>(\d{17})<\/steamID64>/);
        if (steamIdMatch) {
          console.log('[Steam API] 成功从自定义用户名解析到 ID:', steamIdMatch[1]);
          return { success: true, steamId: steamIdMatch[1] };
        }
        
        // 检查是否是用户名不存在的情况
        if (data.contents.includes('<error>') || data.contents.includes('The specified profile could not be found')) {
          return { 
            success: false, 
            error: `找不到名为 "${steamId}" 的 Steam 用户。\n请确认您输入的自定义 URL 名称是否正确，或使用 SteamID64 格式。`
          };
        }
      } catch (e) {
        console.error('解析用户名失败:', e);
      }
    }
    
    // 如果包含非法字符，给出提示
    if (/[^a-zA-Z0-9_\-:\/\.\[\] ]/.test(steamId)) {
      return { 
        success: false, 
        error: '输入包含无效字符。Steam ID 只能包含字母、数字和特定符号。\n\n' +
               '请使用以下格式之一：\n' +
               '• SteamID64: 76561198012345678（17位数字）\n' +
               '• 个人资料链接: https://steamcommunity.com/profiles/xxx 或 /id/xxx\n' +
               '• 自定义URL名称: 如 "gaben"'
      };
    }
    
    return { 
      success: false, 
      error: '无法识别您输入的 Steam ID 格式。\n\n' +
             '请使用以下格式之一：\n' +
             '• SteamID64: 76561198012345678（17位数字）\n' +
             '• 个人资料链接: steamcommunity.com/profiles/xxx 或 /id/xxx\n' +
             '• 旧格式: STEAM_0:1:12345678\n' +
             '• 新格式: [U:1:12345678]\n' +
             '• 自定义URL名称（英文字母数字，如 "gaben"）\n\n' +
             '💡 提示：访问 https://steamid.io 可以轻松查询您的 Steam ID'
    };
  },
  
  // 获取用户信息
  async getPlayerSummary(steamId) {
    if (!this.isEnabled()) {
      // 本地模式 - 返回模拟数据
      return this._getMockPlayerSummary(steamId);
    }
    
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_CONFIG.apiKey}&steamids=${steamId}`;
    const result = await this._fetchWithFailover(url);
    
    if (result.success && result.data.response && result.data.response.players && result.data.response.players.length > 0) {
      const player = result.data.response.players[0];
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
    
    // 如果 API 请求失败，回退到模拟数据
    if (!result.success) {
      console.warn('[Steam API] API 请求失败，使用模拟数据');
      return this._getMockPlayerSummary(steamId);
    }
    
    return { success: false, error: '未找到该用户' };
  },
  
  // 获取拥有的游戏
  async getOwnedGames(steamId, includeAppInfo = true, includeFreeGames = true) {
    if (!this.isEnabled()) {
      // 本地模式 - 返回模拟数据
      return this._getMockOwnedGames(steamId);
    }
    
    let url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_CONFIG.apiKey}&steamid=${steamId}&format=json`;
    if (includeAppInfo) url += '&include_appinfo=1';
    if (includeFreeGames) url += '&include_played_free_games=1';
    
    const result = await this._fetchWithFailover(url);
    
    if (result.success && result.data.response) {
      const games = result.data.response.games || [];
      return {
        success: true,
        gameCount: result.data.response.game_count || games.length,
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
    
    // 如果 API 请求失败，回退到模拟数据
    if (!result.success) {
      console.warn('[Steam API] API 请求失败，使用模拟数据');
      return this._getMockOwnedGames(steamId);
    }
    
    return { success: false, error: '获取游戏库失败，可能是用户资料设为私密' };
  },
  
  // 获取最近游玩的游戏
  async getRecentlyPlayedGames(steamId, count = 10) {
    if (!this.isEnabled()) {
      return this._getMockRecentGames(steamId);
    }
    
    const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_CONFIG.apiKey}&steamid=${steamId}&count=${count}&format=json`;
    const result = await this._fetchWithFailover(url);
    
    if (result.success && result.data.response) {
      const games = result.data.response.games || [];
      return {
        success: true,
        totalCount: result.data.response.total_count || games.length,
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
    
    // 如果 API 请求失败，回退到模拟数据
    if (!result.success) {
      console.warn('[Steam API] API 请求失败，使用模拟数据');
      return this._getMockRecentGames(steamId);
    }
    
    return { success: false, error: '获取最近游戏失败' };
  },
  
  // 获取成就
  async getPlayerAchievements(steamId, appId) {
    if (!this.isEnabled()) {
      return { success: false, error: '成就功能需要 Steam API Key' };
    }
    
    const url = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${STEAM_CONFIG.apiKey}&steamid=${steamId}`;
    const result = await this._fetchWithFailover(url);
    
    if (result.success && result.data.playerstats && result.data.playerstats.achievements) {
      const achievements = result.data.playerstats.achievements;
      const achieved = achievements.filter(a => a.achieved === 1).length;
      
      return {
        success: true,
        gameName: result.data.playerstats.gameName,
        achievements: achievements,
        achievedCount: achieved,
        totalCount: achievements.length,
        completionRate: Math.round((achieved / achievements.length) * 100)
      };
    }
    
    return { success: false, error: result.error || '获取成就失败' };
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
  
  // 保存用户数据（实时保存，永不删除）
  saveData(userId, data) {
    const allData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    allData[userId] = { ...this.getData(userId), ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));
    
    // 自动备份到永久存储
    this._backupUserData(userId, allData[userId]);
    
    // 自动同步平台绑定到云端（异步，不阻塞）
    this._syncPlatformBindingsToCloud(userId, allData[userId]).catch(err => {
      console.warn('[UserDataManager] 云端同步失败（非阻塞）:', err);
    });
    
    return allData[userId];
  },
  
  // 备份用户数据到永久存储（防止数据丢失）
  _backupUserData(userId, userData) {
    try {
      const BACKUP_KEY = 'gamebox_user_data_backup';
      const backups = JSON.parse(localStorage.getItem(BACKUP_KEY) || '{}');
      
      if (!backups[userId]) {
        backups[userId] = [];
      }
      
      // 保存当前数据快照
      backups[userId].push({
        data: userData,
        timestamp: new Date().toISOString()
      });
      
      // 只保留最近10个备份
      if (backups[userId].length > 10) {
        backups[userId] = backups[userId].slice(-10);
      }
      
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
      console.log('[UserDataManager] 用户数据已备份:', userId);
    } catch (error) {
      console.error('[UserDataManager] 备份失败:', error);
    }
  },
  
  // 恢复用户数据（从备份恢复）
  restoreUserData(userId) {
    try {
      const BACKUP_KEY = 'gamebox_user_data_backup';
      const backups = JSON.parse(localStorage.getItem(BACKUP_KEY) || '{}');
      
      if (backups[userId] && backups[userId].length > 0) {
        // 恢复最新的备份
        const latestBackup = backups[userId][backups[userId].length - 1];
        
        const allData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        allData[userId] = latestBackup.data;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));
        
        console.log('[UserDataManager] 用户数据已恢复:', userId);
        return { success: true, data: latestBackup.data };
      }
      
      return { success: false, error: '没有找到备份数据' };
    } catch (error) {
      console.error('[UserDataManager] 恢复失败:', error);
      return { success: false, error: error.message };
    }
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
  async unlinkSteam(userId) {
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
    
    // 同时删除云端绑定
    await this.removePlatformBinding(userId, 'steam').catch(err => {
      console.warn('[unlinkSteam] 删除云端绑定失败（非阻塞）:', err);
    });
    
    return { success: true, message: 'Steam 账号已解绑' };
  },
  
  // 同步 Steam 数据
  async syncSteam(userId) {
    const userData = this.getData(userId);
    
    if (!userData.steam.linked || !userData.steam.steamId) {
      return { success: false, error: '请先绑定 Steam 账号' };
    }
    
    return this.linkSteam(userId, userData.steam.steamId);
  },
  
  // =============================================
  // Supabase 云端同步 (当 Supabase 启用时)
  // =============================================
  
  // 同步本地数据到 Supabase
  async syncToCloud(userId) {
    if (!isSupabaseEnabled()) {
      return { success: false, error: '云同步需要配置 Supabase' };
    }
    
    const localData = this.getData(userId);
    
    try {
      // 使用 upsert 更新或插入用户数据
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .upsert({
          user_id: userId,
          steam_data: localData.steam,
          preferences: localData.preferences,
          stats: localData.stats,
          custom_avatar: localData.customAvatar || null,
          bio: localData.bio || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      console.log('[UserDataManager] 数据已同步到云端');
      return { success: true, message: '数据已同步到云端' };
    } catch (error) {
      console.error('[UserDataManager] 云同步失败:', error);
      return { success: false, error: error.message };
    }
  },
  
  // 从 Supabase 拉取数据
  async syncFromCloud(userId) {
    if (!isSupabaseEnabled()) {
      return { success: false, error: '云同步需要配置 Supabase' };
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      
      if (data) {
        // 合并云端数据到本地
        const mergedData = {
          ...this.getData(userId),
          steam: data.steam_data || this._getDefaultData().steam,
          preferences: data.preferences || this._getDefaultData().preferences,
          stats: data.stats || this._getDefaultData().stats,
          customAvatar: data.custom_avatar,
          bio: data.bio,
          lastCloudSync: new Date().toISOString()
        };
        
        // 保存到本地
        this.saveData(userId, mergedData);
        
        console.log('[UserDataManager] 已从云端同步数据');
        return { success: true, data: mergedData, message: '数据已从云端同步' };
      }
      
      return { success: true, message: '云端暂无数据' };
    } catch (error) {
      console.error('[UserDataManager] 从云端同步失败:', error);
      return { success: false, error: error.message };
    }
  },
  
  // =============================================
  // 平台绑定云端同步（新方法）
  // =============================================
  
  // 同步平台绑定到云端（私有方法，自动调用）
  async _syncPlatformBindingsToCloud(userId, userData) {
    if (!isSupabaseEnabled()) {
      console.log('[UserDataManager] Supabase未启用，跳过云端同步');
      return;
    }
    
    try {
      // 同步 Steam 绑定
      if (userData.steam?.linked && userData.steam?.steamId) {
        await this.savePlatformBinding(userId, 'steam', {
          platformUserId: userData.steam.steamId,
          platformUsername: userData.steam.personaName,
          platformAvatar: userData.steam.avatar,
          platformProfileUrl: userData.steam.profileUrl,
          platformData: {
            games: userData.steam.games || [],
            gameCount: userData.steam.gameCount || 0,
            totalPlaytime: userData.steam.totalPlaytime || 0,
            lastSync: userData.steam.lastSync
          }
        });
      }
      
      console.log('[UserDataManager] 平台绑定已同步到云端');
    } catch (error) {
      console.error('[UserDataManager] 平台绑定云端同步失败:', error);
      throw error;
    }
  },
  
  // 保存平台绑定到云端
  async savePlatformBinding(userId, platform, bindingData) {
    if (!isSupabaseEnabled()) {
      return { success: false, error: '云同步需要配置 Supabase' };
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('user_platform_bindings')
        .upsert({
          user_id: userId,
          platform: platform,
          platform_user_id: bindingData.platformUserId,
          platform_username: bindingData.platformUsername,
          platform_avatar: bindingData.platformAvatar,
          platform_profile_url: bindingData.platformProfileUrl,
          platform_data: bindingData.platformData || {},
          last_sync_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,platform'
        });
      
      if (error) throw error;
      
      console.log(`[UserDataManager] ${platform} 绑定已保存到云端`);
      return { success: true, data };
    } catch (error) {
      console.error(`[UserDataManager] 保存 ${platform} 绑定失败:`, error);
      return { success: false, error: error.message };
    }
  },
  
  // 从云端加载平台绑定
  async loadPlatformBindings(userId) {
    if (!isSupabaseEnabled()) {
      console.log('[UserDataManager] Supabase未启用，从本地加载数据');
      return { success: true, data: this.getData(userId) };
    }
    
    try {
      const { data: bindings, error } = await supabaseClient
        .from('user_platform_bindings')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (bindings && bindings.length > 0) {
        const userData = this.getData(userId);
        
        // 处理 Steam 绑定
        const steamBinding = bindings.find(b => b.platform === 'steam');
        if (steamBinding) {
          userData.steam = {
            linked: true,
            steamId: steamBinding.platform_user_id,
            personaName: steamBinding.platform_username,
            avatar: steamBinding.platform_avatar,
            profileUrl: steamBinding.platform_profile_url,
            games: steamBinding.platform_data?.games || [],
            gameCount: steamBinding.platform_data?.gameCount || 0,
            totalPlaytime: steamBinding.platform_data?.totalPlaytime || 0,
            lastSync: steamBinding.platform_data?.lastSync || steamBinding.last_sync_at
          };
        }
        
        // TODO: 处理其他平台绑定 (PSN, Xbox, Epic等)
        
        // 保存到本地
        this.saveData(userId, userData);
        
        console.log('[UserDataManager] 平台绑定已从云端加载:', bindings.length, '个绑定');
        return { success: true, data: userData, bindings: bindings };
      }
      
      console.log('[UserDataManager] 云端暂无平台绑定数据');
      return { success: true, data: this.getData(userId), bindings: [] };
    } catch (error) {
      console.error('[UserDataManager] 从云端加载平台绑定失败:', error);
      return { success: false, error: error.message };
    }
  },
  
  // 删除平台绑定（从云端）
  async removePlatformBinding(userId, platform) {
    if (!isSupabaseEnabled()) {
      return { success: false, error: '云同步需要配置 Supabase' };
    }
    
    try {
      const { error } = await supabaseClient
        .from('user_platform_bindings')
        .delete()
        .eq('user_id', userId)
        .eq('platform', platform);
      
      if (error) throw error;
      
      console.log(`[UserDataManager] ${platform} 绑定已从云端删除`);
      return { success: true };
    } catch (error) {
      console.error(`[UserDataManager] 删除 ${platform} 绑定失败:`, error);
      return { success: false, error: error.message };
    }
  }
};

// =============================================
// Supabase 数据库表结构 (SQL)
// 用户首次配置 Supabase 时，需要在 Supabase Dashboard
// 的 SQL Editor 中执行以下 SQL 创建表
// =============================================

const SUPABASE_SCHEMA_SQL = `
-- 创建用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  steam_data JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{"theme": "cyberpunk", "notifications": true, "publicProfile": true}',
  stats JSONB DEFAULT '{"ownedGames": 0, "wishlistGames": 0, "totalPlaytime": 0, "achievements": 0}',
  custom_avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- 启用 Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 创建更新时间自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 创建用户平台绑定表（新增）
-- =============================================
CREATE TABLE IF NOT EXISTS user_platform_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_user_id VARCHAR(255) NOT NULL,
  platform_username VARCHAR(255),
  platform_avatar TEXT,
  platform_profile_url TEXT,
  platform_data JSONB,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_platform_bindings_user_id ON user_platform_bindings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_platform_bindings_platform ON user_platform_bindings(platform);
CREATE INDEX IF NOT EXISTS idx_user_platform_bindings_user_platform ON user_platform_bindings(user_id, platform);

-- 启用 RLS
ALTER TABLE user_platform_bindings ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Users can view own bindings" ON user_platform_bindings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bindings" ON user_platform_bindings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bindings" ON user_platform_bindings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bindings" ON user_platform_bindings
  FOR DELETE USING (auth.uid() = user_id);

-- 创建触发器
CREATE TRIGGER update_user_platform_bindings_updated_at
  BEFORE UPDATE ON user_platform_bindings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
`;

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    GameBoxAuth, 
    SUPABASE_CONFIG, 
    LOCAL_AUTH, 
    SteamAPI, 
    STEAM_CONFIG, 
    UserDataManager,
    EMAIL_SERVICE_CONFIG,
    SUPABASE_SCHEMA_SQL
  };
}
