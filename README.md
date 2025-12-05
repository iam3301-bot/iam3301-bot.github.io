# 🎮 GameBox 游盒

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://iam3301-bot.github.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-3.0.0-orange.svg)](https://github.com/iam3301-bot/iam3301-bot.github.io)

**GameBox 游盒** 是一个现代化的游戏信息聚合平台，提供游戏库、排行榜、折扣信息、社区讨论、用户账号系统等功能。采用赛博朋克风格设计，支持多平台游戏数据整合（Steam、PlayStation、Xbox、Nintendo Switch）。

🔗 **在线访问**：https://iam3301-bot.github.io/

---

## ✨ 核心功能

### 🎯 游戏信息
- **游戏库**：5000+ Steam 真实游戏数据 + 200+ 多平台游戏
- **游戏详情**：封面、评分、标签、系统配置、Steam 链接
- **智能搜索**：支持中英文游戏名搜索
- **分类筛选**：按类型、平台、发行年份筛选
- **排行榜**：按评分、热度、发行时间排序

### 💰 折扣 / 史低
- Steam 折扣信息（实时获取）
- 历史最低价追踪
- 优惠提醒功能

### 💬 社区功能
- **帖子发布**：发表游戏心得、攻略、讨论
- **实时评论**：Supabase Realtime 实时同步
- **点赞功能**：防重复点赞
- **在线人数**：实时显示在线用户
- **板块分类**：公告、讨论、攻略、求助等

### 👤 用户系统
- **邮箱注册/登录**：Supabase 认证
- **邮箱验证**：EmailJS 验证码系统
- **多账号管理**：快速切换多个账号（保存 session token）
- **OAuth 登录**：支持 Google、GitHub、Discord（需配置）
- **个人中心**：头像、昵称、密码修改
- **平台绑定**：Steam、PlayStation、Xbox、Switch 账号绑定

### 📰 游戏资讯
- 最新游戏新闻
- 发行信息
- 更新公告

### 🔧 工具箱
- 游戏推荐算法
- 性能测试工具
- 成就追踪（开发中）

---

## 🏗️ 项目结构

```
GameBox/
├── 📄 核心页面
│   ├── index.html                  # 首页（游戏库）
│   ├── game-detail.html            # 游戏详情页
│   ├── ranking.html                # 排行榜
│   ├── discount.html               # 折扣 / 史低
│   ├── community.html              # 社区首页
│   ├── post-detail.html            # 帖子详情页
│   ├── news-list.html              # 资讯列表
│   ├── news-detail.html            # 资讯详情
│   ├── search.html                 # 搜索页面
│   ├── tools.html                  # 工具箱
│   └── my-library.html             # 我的游戏库
│
├── 👤 用户系统
│   ├── login.html                  # 登录/注册页面
│   ├── profile.html                # 个人中心
│   ├── profile-edit.html           # 编辑资料
│   ├── change-password.html        # 修改密码
│   ├── accounts.html               # 账号管理
│   ├── platform-accounts.html      # 平台账号绑定
│   ├── steam-binding.html          # Steam 绑定
│   ├── steam-callback.html         # Steam OAuth 回调
│   └── oauth-callback.html         # OAuth 通用回调
│
├── 🎨 样式文件
│   ├── index.css                   # 主样式表
│   └── cyberpunk-styles.css        # 赛博朋克风格样式
│
├── 🧩 核心 JavaScript
│   ├── common.js                   # 公共函数（导航、搜索、滚动）
│   ├── cyber-effects.js            # 视觉特效（Matrix 背景、粒子）
│   ├── supabase-config.js          # Supabase 认证系统
│   ├── oauth-providers.js          # OAuth 第三方登录管理
│   └── account-switcher.js         # 多账号快速切换系统
│
├── 📊 数据源
│   ├── real-steam-games.js         # 5000+ Steam 游戏数据
│   ├── mega-game-database-real.js  # 游戏数据库封装
│   ├── multi-platform-games.js     # 多平台游戏数据
│   ├── chinese-game-names.js       # 中文游戏名映射
│   ├── games-database.json         # 游戏数据 JSON
│   ├── ranking.json                # 排行榜数据
│   └── steam-ratings-db.js         # Steam 评分数据
│
├── 🎮 游戏 API
│   ├── game-api.js                 # 游戏 API 基础封装
│   ├── enhanced-game-api.js        # 增强游戏 API
│   ├── steam-api.js                # Steam API 工具类
│   ├── steam-api-service.js        # Steam API 服务
│   ├── game-cover-fetcher.js       # 游戏封面获取
│   ├── game-covers.js              # 封面缓存管理
│   └── platform-api-service.js     # 多平台 API 服务
│
├── 💬 社区系统
│   ├── community-data-service.js   # 社区数据服务
│   └── create-post-modal.js        # 发帖弹窗组件
│
├── 📰 资讯系统
│   ├── news-api.js                 # 资讯 API
│   └── real-news-api.js            # 真实资讯数据
│
├── 👥 账号管理
│   ├── account-history.js          # 账号历史记录
│   └── account-modals.js           # 账号相关弹窗
│
├── 🗄️ 数据库脚本
│   ├── FINAL-FIX-DATABASE.sql      # 完整数据库初始化（推荐）
│   └── step-by-step-init.sql       # 分步数据库初始化
│
├── 🛠️ 工具页面
│   ├── force-clear-all.html        # 强制清除缓存
│   └── force-refresh.html          # 强制刷新
│
├── 📦 配置文件
│   ├── package.json                # NPM 包管理
│   ├── package-lock.json           # NPM 依赖锁定
│   └── tools/sysreq-overrides.json # 系统配置覆盖
│
└── 📚 文档
    ├── README.md                   # 本文档
    └── docs/archive/               # 历史文档归档
        ├── BACKEND_SETUP.md
        ├── COMMUNITY_SETUP.md
        ├── OAUTH_SETUP_GUIDE.md
        └── ...
```

---

## 🛠️ 技术栈

### 前端技术
- **HTML5** + **CSS3**：语义化标签、Flexbox/Grid 布局
- **原生 JavaScript (ES6+)**：无框架依赖，纯 Vanilla JS
- **赛博朋克 UI**：Matrix 动画背景、霓虹灯效果、粒子系统

### 后端服务
- **Supabase**：用户认证、数据库（PostgreSQL）、Realtime 订阅
- **EmailJS**：邮箱验证码发送
- **GitHub Pages**：静态网站托管

### 数据源
- **Steam Web API**：游戏详情、评分、系统配置
- **CORS 代理**：ThingProxy、AllOrigins（绕过跨域限制）
- **本地 JSON 数据库**：5000+ 游戏数据

### 第三方集成
- **OAuth 2.0**：Google、GitHub、Discord 登录
- **Steam OpenID**：Steam 账号绑定
- **Particles.js**：粒子动画效果
- **Font Awesome / Google Fonts**：图标和字体

---

## 🚀 快速开始

### 1. 克隆仓库
```bash
git clone https://github.com/iam3301-bot/iam3301-bot.github.io.git
cd iam3301-bot.github.io
```

### 2. 配置 Supabase

#### 2.1 创建 Supabase 项目
1. 访问 [Supabase](https://supabase.com/)
2. 创建新项目
3. 获取项目 URL 和 Anon Key

#### 2.2 执行数据库初始化
在 Supabase SQL 编辑器中执行：

```sql
-- 方式 1：完整初始化（推荐）
-- 复制并执行 FINAL-FIX-DATABASE.sql 的内容

-- 方式 2：分步初始化
-- 复制并执行 step-by-step-init.sql 的内容
```

**数据库表结构**：
- `user_profiles`：用户资料
- `online_users`：在线用户
- `community_posts`：社区帖子
- `community_comments`：帖子评论

#### 2.3 更新配置文件
编辑 `supabase-config.js`：

```javascript
const SUPABASE_CONFIG = {
  enabled: true,
  url: 'YOUR_SUPABASE_URL',        // 替换为你的 Supabase URL
  anonKey: 'YOUR_SUPABASE_KEY',    // 替换为你的 Anon Key
  oauth: {
    redirectUrl: 'https://your-domain.github.io/oauth-callback.html'
  }
};
```

### 3. 配置 EmailJS（邮箱验证）

#### 3.1 创建 EmailJS 账号
1. 访问 [EmailJS](https://www.emailjs.com/)
2. 创建邮件服务（推荐 Gmail）
3. 创建邮件模板（用于验证码）

#### 3.2 更新配置
编辑 `login.html`，找到 EmailJS 初始化部分：

```javascript
emailjs.init('YOUR_PUBLIC_KEY');  // 替换为你的 Public Key

// 发送验证码函数
emailjs.send(
  'YOUR_SERVICE_ID',   // 替换为你的 Service ID
  'YOUR_TEMPLATE_ID',  // 替换为你的 Template ID
  { ... }
);
```

### 4. 本地开发

#### 方式 1：使用 VS Code Live Server
1. 安装 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件
2. 右键 `index.html` → **Open with Live Server**

#### 方式 2：使用 Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# 访问 http://localhost:8000
```

#### 方式 3：使用 Node.js http-server
```bash
npm install -g http-server
http-server -p 8000

# 访问 http://localhost:8000
```

### 5. 部署到 GitHub Pages

#### 5.1 推送代码
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 5.2 启用 GitHub Pages
1. 打开仓库 → **Settings** → **Pages**
2. **Source** 选择 `main` 分支
3. 点击 **Save**
4. 等待 1-2 分钟部署完成
5. 访问：`https://your-username.github.io/`

---

## 📖 功能详解

### 🔐 多账号管理系统

GameBox 支持**真正的免密快速切换账号**，类似 QQ、微信的账号切换体验。

#### 工作原理
1. **登录成功后自动保存**：
   - 保存用户信息（用户名、邮箱、头像）
   - 保存 Supabase session token（有效期 1 小时）
   - 最多保存 5 个账号

2. **一键切换**：
   - 点击"🔄 切换账号"按钮
   - 选择账号 → **直接切换，无需密码**
   - 恢复 session token 到 Supabase

3. **Session 过期处理**：
   - Session 有效：直接切换 ✅
   - Session 过期：自动填充邮箱，提示输入密码 ⚠️

#### 使用示例
```javascript
// 保存账号（登录成功后自动调用）
const user = await GameBoxAuth.getCurrentUser();
const session = await GameBoxAuth.getSession();
AccountSwitcher.saveAccount(user, session);

// 切换账号
const result = await AccountSwitcher.switchToAccount('user@example.com', GameBoxAuth);
if (result.success) {
  console.log('切换成功！');
}

// 删除账号
AccountSwitcher.removeAccount('user@example.com');

// 显示切换器
AccountSwitcher.showSwitcher(onSwitch, onAddNew);
```

### 💬 社区实时同步

社区系统基于 **Supabase Realtime** 实现多设备实时同步。

#### 实时功能
- **实时评论**：发表评论后，所有在线用户立即看到
- **实时点赞**：点赞数实时更新
- **在线人数**：实时统计当前在线用户

#### 技术实现
```javascript
// 订阅评论更新
supabaseClient
  .channel('comments')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'community_comments'
  }, (payload) => {
    console.log('新评论:', payload.new);
    renderNewComment(payload.new);
  })
  .subscribe();

// 订阅帖子点赞
supabaseClient
  .channel('posts')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'community_posts'
  }, (payload) => {
    console.log('帖子更新:', payload.new);
    updatePostLikes(payload.new);
  })
  .subscribe();
```

### 🎮 Steam API 集成

GameBox 集成了 Steam API，但由于 CORS 限制，使用多种代理方案。

#### 代理优先级
1. **ThingProxy**（默认）
2. **AllOrigins**（备用）
3. **CORS Anywhere**（Heroku，需请求访问）
4. **自建 Cloudflare Worker**（推荐，需部署）

#### 数据获取
```javascript
// 搜索游戏
const searchResult = await steamAPI.searchGame('Counter-Strike');

// 获取游戏详情
const gameDetails = await steamAPI.getGameDetails(730); // CS:GO

// 获取系统配置
const requirements = await steamAPI.getSystemRequirements('CS:GO');
```

---

## ⚙️ 配置说明

### Supabase 配置

**文件**：`supabase-config.js`

```javascript
const SUPABASE_CONFIG = {
  enabled: true,                    // 是否启用 Supabase
  url: 'YOUR_SUPABASE_URL',         // Supabase 项目 URL
  anonKey: 'YOUR_SUPABASE_KEY',     // Anon Key
  
  oauth: {
    redirectUrl: 'https://your-domain.github.io/oauth-callback.html',
    google: { enabled: false },     // Google 登录
    github: { enabled: false },     // GitHub 登录
    discord: { enabled: false }     // Discord 登录
  }
};
```

### OAuth 配置

#### Google OAuth
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建 OAuth 2.0 客户端 ID
3. 添加授权重定向 URI：`https://your-project.supabase.co/auth/v1/callback`
4. 在 Supabase Dashboard → Authentication → Providers → Google 中配置

#### GitHub OAuth
1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 创建 OAuth App
3. 设置回调 URL：`https://your-project.supabase.co/auth/v1/callback`
4. 在 Supabase Dashboard → Authentication → Providers → GitHub 中配置

### EmailJS 配置

**文件**：`login.html`

```javascript
// 初始化 EmailJS
emailjs.init('YOUR_PUBLIC_KEY');

// 发送验证码
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
  to_email: userEmail,
  verification_code: otpCode,
  app_name: 'GameBox 游盒'
});
```

**邮件模板示例**：
```
主题：【GameBox 游盒】邮箱验证码

您的验证码是：{{verification_code}}

验证码有效期为 10 分钟，请勿泄露给他人。

如果这不是您的操作，请忽略此邮件。

——————————————————
{{app_name}}
```

---

## 🎨 自定义主题

### 修改赛博朋克配色

**文件**：`index.css`

```css
:root {
  /* 主色调 */
  --cyber-cyan: #00ffff;          /* 青色霓虹 */
  --accent: #ffd300;              /* 黄色强调 */
  --danger: #ff0055;              /* 红色警告 */
  
  /* 背景色 */
  --bg-main: #0a0a0a;             /* 主背景 */
  --bg-card: rgba(20, 20, 30, 0.95); /* 卡片背景 */
  
  /* 文字色 */
  --text-main: #e0e0e0;           /* 主文字 */
  --text-muted: #888888;          /* 次要文字 */
  
  /* 字体 */
  --font-primary: 'Rajdhani', sans-serif;
  --font-accent: 'Orbitron', sans-serif;
}
```

### 禁用 Matrix 背景

**文件**：`cyber-effects.js`

```javascript
// 注释掉 Matrix 背景初始化
// initMatrixRain();

// 或者在 HTML 中移除脚本引用
// <script src="cyber-effects.js"></script>
```

---

## 🐛 常见问题

### Q1：登录后显示"服务器连接失败"
**原因**：Supabase 配置错误或 API Key 过期。

**解决方案**：
1. 检查 `supabase-config.js` 中的 URL 和 Key 是否正确
2. 确认 Supabase 项目状态正常
3. 清除浏览器缓存：访问 `force-clear-all.html`

### Q2：社区评论无法发表
**原因**：数据库表未创建或字段不匹配。

**解决方案**：
1. 在 Supabase SQL 编辑器执行 `FINAL-FIX-DATABASE.sql`
2. 确认表 `community_comments` 存在且有正确的字段

### Q3：Steam 系统配置显示"暂无数据"
**原因**：CORS 代理失效或 Steam API 限流。

**解决方案**：
- 这是正常现象，免费公共代理经常失效
- 推荐部署自己的 Cloudflare Worker 代理
- 系统配置缺失不影响其他功能

### Q4：多账号切换提示"Session 已过期"
**原因**：Supabase session token 有效期为 1 小时。

**解决方案**：
- 重新输入密码登录（系统会自动填充邮箱）
- Session 过期是正常现象，为了安全考虑

### Q5：邮箱验证码收不到
**原因**：EmailJS 配置错误或邮箱被标记为垃圾邮件。

**解决方案**：
1. 检查 EmailJS Service 和 Template 配置
2. 查看邮箱垃圾箱
3. 尝试使用其他邮箱

### Q6：部署到 GitHub Pages 后页面显示异常
**原因**：浏览器缓存导致旧版本残留。

**解决方案**：
1. 访问 `https://your-username.github.io/force-clear-all.html`
2. 点击"清除缓存并跳转"
3. 或手动清除：`Ctrl + Shift + R`（Windows/Linux）或 `Cmd + Shift + R`（Mac）

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 提交 Issue
- 使用清晰的标题描述问题
- 提供详细的复现步骤
- 附上截图或错误日志

### 提交 Pull Request
1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交代码：`git commit -m "Add: your feature"`
4. 推送分支：`git push origin feature/your-feature`
5. 创建 Pull Request

### 代码规范
- 使用 2 空格缩进
- 遵循语义化命名
- 添加必要的注释
- 测试后再提交

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

### 开源项目
- [Supabase](https://supabase.com/) - 开源 Firebase 替代方案
- [EmailJS](https://www.emailjs.com/) - 前端邮件发送服务
- [Particles.js](https://vincentgarreau.com/particles.js/) - 粒子动画库
- [Font Awesome](https://fontawesome.com/) - 图标库
- [Google Fonts](https://fonts.google.com/) - 字体服务

### 数据来源
- [Steam Web API](https://steamcommunity.com/dev) - Steam 游戏数据
- [RAWG](https://rawg.io/) - 游戏数据库 API
- [IGDB](https://www.igdb.com/) - 游戏信息数据库

### 设计灵感
- Cyberpunk 2077 UI 设计
- Neon Genesis Evangelion 配色
- Blade Runner 视觉风格

---

## 📞 联系方式

- **项目主页**：https://iam3301-bot.github.io/
- **GitHub 仓库**：https://github.com/iam3301-bot/iam3301-bot.github.io
- **问题反馈**：[GitHub Issues](https://github.com/iam3301-bot/iam3301-bot.github.io/issues)
- **邮箱**：278442912@qq.com

---

## 🗺️ 开发路线图

### ✅ 已完成
- [x] 游戏库和详情页
- [x] 排行榜系统
- [x] 用户注册/登录
- [x] 邮箱验证
- [x] 社区系统（发帖、评论、点赞）
- [x] 多账号快速切换
- [x] Realtime 实时同步
- [x] 平台账号绑定
- [x] 个人中心
- [x] 赛博朋克 UI

### 🚧 进行中
- [ ] 折扣信息实时获取
- [ ] 游戏推荐算法优化
- [ ] Steam 评论抓取
- [ ] 移动端优化

### 📅 计划中
- [ ] 成就系统
- [ ] 好友系统
- [ ] 私信功能
- [ ] 游戏时长统计
- [ ] 愿望单功能
- [ ] PWA 支持（离线访问）
- [ ] 国际化（多语言）
- [ ] 黑暗/明亮主题切换

---

## 📊 项目统计

- **总代码行数**：~15,000 行
- **HTML 页面**：25+
- **JavaScript 模块**：30+
- **游戏数据**：5000+ Steam + 200+ 多平台
- **数据库表**：4 个
- **支持平台**：Steam、PS、Xbox、Switch
- **支持语言**：中文、英文

---

## 🌟 Star History

如果这个项目对你有帮助，请给个 Star ⭐！

[![Star History Chart](https://api.star-history.com/svg?repos=iam3301-bot/iam3301-bot.github.io&type=Date)](https://star-history.com/#iam3301-bot/iam3301-bot.github.io&Date)

---

<div align="center">

**🎮 GameBox 游盒 - 让游戏信息触手可及 🎮**

Made with ❤️ by [IOA3301](https://github.com/iam3301-bot)

</div>
