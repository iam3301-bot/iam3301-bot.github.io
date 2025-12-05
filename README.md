# 🎮 GameBox 游盒

<div align="center">

**一个精美的游戏平台展示网站 - 纯前端项目，具有赛博朋克风格设计**

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://iam3301-bot.github.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.1.0-orange.svg)](https://github.com/iam3301-bot/iam3301-bot.github.io/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/iam3301-bot/iam3301-bot.github.io/pulls)

[在线演示](https://iam3301-bot.github.io) · [报告问题](https://github.com/iam3301-bot/iam3301-bot.github.io/issues) · [功能建议](https://github.com/iam3301-bot/iam3301-bot.github.io/issues)

</div>

---

## 📑 目录

- [✨ 核心特性](#-核心特性)
- [🎮 多平台账号管理](#-多平台账号管理)
- [📸 项目预览](#-项目预览)
- [🚀 快速开始](#-快速开始)
- [📁 项目结构](#-项目结构)
- [🎨 技术栈](#-技术栈)
- [📊 功能列表](#-功能列表)
- [🔧 高级配置](#-高级配置)
- [🎯 设计理念](#-设计理念)
- [📚 完整文档](#-完整文档)
- [🤝 贡献指南](#-贡献指南)
- [📝 更新日志](#-更新日志)
- [📄 许可证](#-许可证)

---

## ✨ 核心特性

### 🎨 现代化设计
- **赛博朋克风格** - 深色主题，霓虹色渐变，毛玻璃材质
- **响应式布局** - 完美适配桌面端、平板、移动端
- **流畅动画** - 微交互动画，提升用户体验
- **自定义滚动条** - 融入整体风格设计

### 🚀 高性能架构
- **纯静态部署** - 无需后端服务器，直接部署到 GitHub Pages
- **零框架依赖** - 原生 JavaScript 实现，轻量高效
- **自动化更新** - GitHub Actions 定时更新游戏数据
- **智能缓存** - LocalStorage 数据缓存，快速加载

### 🔒 安全可靠
- **XSS 防护** - 安全的 HTML 处理机制
- **数据加密** - API Key 和 Token 本地加密存储
- **隐私保护** - 所有数据仅存储在本地浏览器

### 🎯 丰富功能
- **Steam 集成** - 通过代理服务器获取 Steam 推荐配置
- **多平台支持** - Steam、Epic Games、Xbox Live、PlayStation Network
- **实时同步** - 自动同步游戏库、成就、奖杯数据
- **智能搜索** - 全局游戏搜索，快速定位

---

## 🎮 多平台账号管理

GameBox v2.1.0 引入了完整的多平台游戏账号管理系统，支持四大主流游戏平台！

### 📊 平台支持一览

| 平台 | 状态 | 绑定方式 | 数据同步 | API 来源 |
|------|------|---------|---------|---------|
| **🔵 Steam** | ✅ 完全支持 | Steam ID | ✅ 自动 | Steam Web API |
| **⚫ Epic Games** | ✅ 手动录入 | 手动输入 | ⚠️ 手动 | 无公开 API |
| **🟢 Xbox Live** | ✅ API 集成 | Gamertag | ✅ 自动 | OpenXBL API |
| **🔵 PlayStation** | ✅ API 集成 | PSN ID | ✅ 自动 | NPSSO Token |

### 🔵 Steam 平台
```javascript
// 功能特性
✅ Steam ID 自动绑定
✅ 用户信息同步（头像、昵称）
✅ 游戏库自动获取
✅ 总游戏时长统计
✅ 实时数据同步
```

**使用方法**：
1. 获取您的 Steam ID（例如：76561198012345678）
2. 在账号管理页面输入 Steam ID
3. 系统自动获取并同步您的 Steam 数据

### ⚫ Epic Games 平台
```javascript
// 功能特性
✅ 手动账号信息录入
✅ 游戏数量统计
✅ 本地数据存储
ℹ️ Epic Games 暂无公开 API
```

**使用方法**：
1. 登录 Epic Games Store，查看游戏库
2. 在平台配置页面手动输入用户名和游戏数量
3. 系统保存到本地浏览器

### 🟢 Xbox Live 平台
```javascript
// 功能特性
✅ OpenXBL API 完整集成
✅ API Key 配置管理
✅ Gamertag 自动绑定
✅ Gamerscore 实时显示
✅ 游戏库自动同步
✅ 成就统计功能
```

**使用方法**：
1. 访问 [OpenXBL](https://xbl.io/) 注册并获取免费 API Key
2. 在平台配置页面输入 API Key
3. 输入您的 Xbox Gamertag 完成绑定

### 🔵 PlayStation Network 平台
```javascript
// 功能特性
✅ NPSSO Token 认证
✅ 代理服务器配置
✅ PSN Online ID 绑定
✅ 奖杯等级显示
✅ 游戏库自动同步
✅ 多语言支持
```

**使用方法**：
1. 访问 [Sony SSO](https://ca.account.sony.com/api/v1/ssocookie) 获取 NPSSO Token
2. 配置代理服务器地址（默认：`http://localhost:3001`）
3. 系统自动认证并同步您的 PSN 数据

### 📖 详细文档
完整的平台配置指南请查看：**[PLATFORM_ACCOUNTS.md](PLATFORM_ACCOUNTS.md)**

---

## 📸 项目预览

### 🏠 首页 - 热门排行榜
展示最热门的免费游戏，支持按热度、评分、新品、折扣排序

### 🎯 游戏详情页
详细的游戏信息，包括系统配置、游戏截图、玩家评价

### 👤 用户中心
个人信息管理、多平台账号绑定、游戏库统计

### 🎮 多平台账号管理
统一管理 Steam、Epic、Xbox、PlayStation 平台账号

---

## 🚀 快速开始

### 📦 在线访问

直接访问线上版本，无需任何配置：

**🌐 [https://iam3301-bot.github.io](https://iam3301-bot.github.io)**

### 💻 本地开发

#### 1️⃣ 克隆项目

```bash
git clone https://github.com/iam3301-bot/iam3301-bot.github.io.git
cd iam3301-bot.github.io
```

#### 2️⃣ 安装依赖（可选）

```bash
npm install
```

#### 3️⃣ 启动本地服务器

**方式一：使用 Python**
```bash
python -m http.server 8080
```

**方式二：使用 Node.js**
```bash
npx http-server -p 8080
```

**方式三：使用 Live Server（VS Code 插件）**
- 安装 Live Server 扩展
- 右键 `index.html` → "Open with Live Server"

#### 4️⃣ 访问网站

打开浏览器访问：`http://localhost:8080`

### 🔄 手动更新数据

```bash
npm run update:ranking
```

---

## 📁 项目结构

```
gamebox-web/
├── 📄 HTML 页面
│   ├── index.html              # 首页 - 热门排行榜
│   ├── game-detail.html        # 游戏详情页
│   ├── game-library.html       # 游戏库浏览
│   ├── profile.html            # 用户中心
│   ├── accounts.html           # 账号管理
│   ├── platform-accounts.html  # 多平台配置
│   ├── switch-account.html     # 切换账号
│   ├── logout-confirm.html     # 退出登录
│   ├── login.html              # 登录页面
│   ├── search.html             # 搜索页面
│   ├── community.html          # 社区功能
│   ├── news-list.html          # 资讯列表
│   ├── discount.html           # 折扣活动
│   └── tools.html              # 工具中心
│
├── 🎨 样式文件
│   └── index.css               # 全局样式（赛博朋克主题）
│
├── 📜 JavaScript 脚本
│   ├── common.js               # 通用工具函数
│   ├── steam-api-service.js    # Steam API 服务
│   ├── platform-api-service.js # 多平台 API 服务
│   ├── supabase-config.js      # 数据库配置
│   ├── oauth-providers.js      # OAuth 登录配置
│   └── cyber-effects.js        # 赛博朋克特效
│
├── 📊 数据文件
│   └── ranking.json            # 排行榜数据（自动更新）
│
├── 🛠️ 工具脚本
│   └── tools/
│       ├── update-ranking.mjs        # 数据更新脚本
│       └── sysreq-overrides.json     # 系统配置覆盖
│
├── ⚙️ 配置文件
│   ├── package.json            # 项目配置
│   ├── server.js               # 本地代理服务器
│   └── worker.js               # Cloudflare Worker 代码
│
├── 🤖 自动化工作流
│   └── .github/
│       └── workflows/
│           └── update-ranking.yml    # 定时更新数据
│
└── 📚 文档
    ├── README.md               # 项目主文档
    ├── PLATFORM_ACCOUNTS.md    # 多平台账号管理指南
    ├── DEPLOYMENT.md           # Steam API 部署指南
    ├── BACKEND_SETUP.md        # 后端配置指南
    ├── EMAILJS_SETUP.md        # 邮件服务配置
    ├── OAUTH_SETUP_GUIDE.md    # OAuth 配置指南
    └── PROJECT_SUMMARY.md      # 项目完成总结
```

---

## 🎨 技术栈

### 前端技术

| 类别 | 技术 | 说明 |
|------|------|------|
| **HTML** | HTML5 | 语义化标签，SEO 优化 |
| **CSS** | CSS3 | CSS Variables, Flexbox, Grid |
| **JavaScript** | ES6+ | 原生 JS，无框架依赖 |
| **字体** | Google Fonts | Orbitron, Rajdhani |

### 数据源 & API

| 服务 | 用途 | 官方文档 |
|------|------|---------|
| **FreeToGame API** | 游戏数据获取 | [API 文档](https://www.freetogame.com/api-doc) |
| **Steam Web API** | Steam 配置获取 | [Steam API](https://developer.valvesoftware.com/wiki/Steam_Web_API) |
| **OpenXBL API** | Xbox Live 集成 | [OpenXBL](https://xbl.io/) |
| **PSN API** | PlayStation 集成 | 第三方非官方 API |

### 自动化 & 部署

| 工具 | 用途 |
|------|------|
| **GitHub Actions** | 定时自动更新数据 |
| **GitHub Pages** | 静态网站托管 |
| **Cloudflare Workers** | Steam API 代理（可选）|

### 可选服务

| 服务 | 用途 | 配置文档 |
|------|------|---------|
| **Supabase** | 后端数据库 | [BACKEND_SETUP.md](BACKEND_SETUP.md) |
| **EmailJS** | 邮件服务 | [EMAILJS_SETUP.md](EMAILJS_SETUP.md) |
| **OAuth 2.0** | 第三方登录 | [OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md) |

---

## 📊 功能列表

### ✅ 已实现功能

#### 🏠 首页功能
- [x] 热门游戏排行榜展示
- [x] 多维度排序（热度/评分/新品/折扣）
- [x] 无限滚动加载更多
- [x] 游戏类型分类筛选
- [x] 快速搜索功能

#### 🎮 游戏详情
- [x] 游戏基础信息展示
- [x] 系统配置显示（最低 + 推荐）
- [x] Steam 推荐配置自动获取
- [x] 游戏截图轮播
- [x] 相关游戏推荐

#### 👤 用户系统
- [x] 用户注册/登录（LocalStorage）
- [x] 第三方登录（Google, GitHub）
- [x] 用户信息管理
- [x] 密码修改功能
- [x] 邮箱验证（EmailJS）

#### 🎮 **多平台账号管理** (v2.1.0 新增)
- [x] **Steam 平台**
  - [x] Steam ID 自动绑定
  - [x] 游戏库自动同步
  - [x] 用户信息获取（头像、昵称）
  - [x] 总游戏时长统计
  - [x] 实时数据更新
- [x] **Epic Games 平台**
  - [x] 账号信息手动录入
  - [x] 游戏数量统计
  - [x] 本地数据存储
- [x] **Xbox Live 平台**
  - [x] OpenXBL API 集成
  - [x] API Key 配置管理
  - [x] Gamertag 绑定
  - [x] Gamerscore 显示
  - [x] 游戏库同步
  - [x] 成就统计
- [x] **PlayStation Network 平台**
  - [x] NPSSO Token 认证
  - [x] 代理服务器配置
  - [x] PSN Online ID 绑定
  - [x] 奖杯等级显示
  - [x] 游戏库同步
- [x] **账号管理功能**
  - [x] 独立的账号切换界面
  - [x] 独立的退出登录界面
  - [x] 统一的状态管理
  - [x] 数据本地加密存储

#### 🛠️ 技术特性
- [x] 响应式设计（移动端适配）
- [x] 加载状态提示
- [x] 错误处理机制
- [x] 图片加载失败占位符
- [x] XSS 防护
- [x] GitHub Actions 自动更新数据
- [x] 智能缓存策略

#### 💬 **社区功能** (v2.2.0 新增)
- [x] **实时社区系统**
  - [x] Supabase 云数据库支持
  - [x] 发帖/评论/点赞功能
  - [x] 实时在线用户统计
  - [x] 活动日志追踪
  - [x] 实时数据推送
- [x] **社区互动**
  - [x] 板块分类（综合讨论/攻略心得/游戏截图/交易求助）
  - [x] 帖子搜索功能
  - [x] 热门话题展示
  - [x] 在线用户列表

### 🚧 计划中功能

#### 📚 游戏库功能
- [ ] 高级筛选（价格、类型、平台）
- [ ] 个人游戏收藏
- [ ] 愿望单管理
- [ ] 游戏评分系统

#### 📰 资讯功能
- [ ] 游戏新闻列表
- [ ] RSS 订阅源接入
- [ ] 文章详情页
- [ ] 新闻推送通知

#### 👥 社区功能增强
- [ ] 用户个人主页
- [ ] 帖子富文本编辑器
- [ ] 图片上传功能
- [ ] 好友系统
- [ ] 私信功能

#### 🔧 工具中心
- [ ] 系统配置检测
- [ ] 游戏性能预测
- [ ] 价格历史曲线
- [ ] 折扣提醒

---

## 🔧 高级配置

### 🤖 GitHub Actions 自动更新

项目配置了自动任务，每 6 小时更新一次排行榜数据：

```yaml
# .github/workflows/update-ranking.yml
on:
  schedule:
    - cron: "0 */6 * * *"  # 每 6 小时执行一次
  workflow_dispatch:        # 支持手动触发
```

**手动触发方法**：
1. 访问 [GitHub Actions](https://github.com/iam3301-bot/iam3301-bot.github.io/actions) 页面
2. 选择 "Update ranking data" workflow
3. 点击 "Run workflow" 按钮

### 🌐 Steam API 配置

**🎉 好消息：现在无需本地服务器！**

#### 方案一：公共 CORS 代理（默认）✅
- ✅ **零配置**，开箱即用
- ✅ 自动故障转移机制
- ✅ 适合测试和个人项目
- ⚠️ 可能不够稳定

#### 方案二：Cloudflare Workers（推荐）🌟
- ✅ 更稳定、更快速
- ✅ 完全免费（每天 100,000 次请求）
- ✅ 10 分钟一次性配置
- ✅ 全球 CDN 加速

**配置指南**：详见 **[DEPLOYMENT.md](DEPLOYMENT.md)**

### 🎮 系统配置覆盖

可以手动添加准确的游戏系统配置到 `tools/sysreq-overrides.json`：

```json
{
  "Dota 2": {
    "minimum": {
      "os": "Windows 10 64-bit",
      "processor": "Intel Core i5-4670K",
      "memory": "8 GB RAM",
      "graphics": "NVIDIA GeForce GTX 1050",
      "storage": "50 GB available space"
    },
    "recommended": {
      "os": "Windows 11 64-bit",
      "processor": "Intel Core i7-9700K",
      "memory": "16 GB RAM",
      "graphics": "NVIDIA GeForce RTX 3060",
      "storage": "50 GB SSD"
    }
  }
}
```

### 📧 EmailJS 邮件服务

配置邮件验证功能：

1. 注册 [EmailJS](https://www.emailjs.com/) 账号
2. 创建邮件服务和模板
3. 获取 Service ID、Template ID、Public Key
4. 更新 `supabase-config.js` 配置

**详细配置**：查看 **[EMAILJS_SETUP.md](EMAILJS_SETUP.md)**

### 🔐 OAuth 第三方登录

支持 Google、GitHub、微信、QQ 登录：

1. 在各平台注册 OAuth 应用
2. 配置回调 URL
3. 更新 `oauth-providers.js` 配置

**详细配置**：查看 **[OAUTH_SETUP_GUIDE.md](OAUTH_SETUP_GUIDE.md)**

---

## 🎯 设计理念

### 🎨 视觉设计

#### 配色方案
```css
:root {
  /* 背景色 */
  --bg: #050816;                    /* 主背景 - 深空蓝 */
  --bg-elevated: #0b1020;           /* 卡片背景 - 稍亮 */
  
  /* 强调色 */
  --accent: #38bdf8;                /* 主色调 - 霓虹蓝 */
  --accent-strong: #0ea5e9;         /* 强调色 - 深蓝 */
  --gold: #f4b93e;                  /* 金色 - 用于重要元素 */
  
  /* 文本色 */
  --text-main: #e5e7eb;             /* 主文本 - 亮白 */
  --text-soft: #d1d5db;             /* 柔和文本 */
  --text-muted: #9ca3af;            /* 次要文本 - 灰色 */
  
  /* 状态色 */
  --success: #10b981;               /* 成功 - 绿色 */
  --warning: #f59e0b;               /* 警告 - 橙色 */
  --error: #ef4444;                 /* 错误 - 红色 */
}
```

#### 视觉效果
- **渐变背景** - `radial-gradient` 营造科技感空间
- **毛玻璃效果** - `backdrop-filter: blur(10px)` 增加层次
- **发光效果** - `box-shadow` 和 `text-shadow` 霓虹光晕
- **悬浮卡片** - 卡片式布局 + 阴影提升
- **微交互动画** - `hover` 状态流畅过渡
- **自定义滚动条** - 融入赛博朋克主题

### 💡 用户体验

#### 交互设计原则
1. **即时反馈** - 所有操作都有明确的视觉反馈
2. **流畅动画** - 300ms 的标准过渡时间
3. **错误友好** - 清晰的错误提示和解决方案
4. **渐进增强** - 核心功能在所有浏览器可用
5. **移动优先** - 优先考虑移动端体验

#### 性能优化
- **懒加载图片** - 减少初始加载时间
- **按需加载** - 仅加载当前需要的内容
- **LocalStorage 缓存** - 减少 API 请求次数
- **代码压缩** - 最小化文件体积
- **CDN 加速** - 使用 GitHub Pages CDN

---

## 📚 完整文档

| 文档 | 描述 | 链接 |
|------|------|------|
| **README.md** | 项目主文档（本文件） | [查看](README.md) |
| **PLATFORM_ACCOUNTS.md** | 多平台账号管理完整指南 | [查看](PLATFORM_ACCOUNTS.md) |
| **DEPLOYMENT.md** | Steam API 部署详细说明 | [查看](DEPLOYMENT.md) |
| **BACKEND_SETUP.md** | 后端服务配置教程 | [查看](BACKEND_SETUP.md) |
| **EMAILJS_SETUP.md** | 邮件服务配置步骤 | [查看](EMAILJS_SETUP.md) |
| **OAUTH_SETUP_GUIDE.md** | OAuth 第三方登录配置 | [查看](OAUTH_SETUP_GUIDE.md) |
| **PROJECT_SUMMARY.md** | 项目完成总结报告 | [查看](PROJECT_SUMMARY.md) |

---

## 🐛 常见问题

### Q1: Steam 配置获取失败？
**答**：可能原因及解决方案：
1. **游戏个人资料为私密** - 进入 Steam 设置 → 隐私设置，将个人资料和游戏详情设为"公开"
2. **API 限流** - 等待几分钟后重试
3. **网络问题** - 检查网络连接或尝试使用 VPN

### Q2: 多平台账号绑定后在其他设备看不到？
**答**：账号绑定数据存储在浏览器的 LocalStorage 中，不会跨设备同步。如需在其他设备使用，需要在每个设备上重新绑定。

### Q3: Epic Games 无法自动同步数据？
**答**：Epic Games 目前没有提供公开的 Web API，只能手动录入账号信息。我们会持续关注官方 API 的更新。

### Q4: Xbox Live 绑定提示"API Key 无效"？
**答**：
1. 检查 OpenXBL API Key 是否正确复制（包括完整字符串）
2. 确认 API Key 未过期
3. 检查 OpenXBL 账号的免费额度是否用完

### Q5: PlayStation 绑定失败？
**答**：
1. 确认 NPSSO Token 正确获取（访问 https://ca.account.sony.com/api/v1/ssocookie）
2. 检查代理服务器是否正常运行（默认 http://localhost:3001）
3. NPSSO Token 有效期约 2 个月，过期后需要重新获取

### Q6: 清除浏览器数据后账号绑定丢失？
**答**：所有绑定数据存储在 LocalStorage 中，清除浏览器数据会导致数据丢失。建议：
- 定期备份重要的 API Key 和配置信息
- 或考虑使用云端同步方案（需要额外配置）

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！我们非常欢迎各种形式的贡献。

### 🔀 提交 Pull Request

1. **Fork 本项目**
   ```bash
   # 点击页面右上角的 Fork 按钮
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/YOUR-USERNAME/iam3301-bot.github.io.git
   cd iam3301-bot.github.io
   ```

3. **创建新分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **推送到 GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 访问您的 Fork 仓库页面
   - 点击 "New Pull Request"
   - 填写 PR 描述并提交

### 📝 Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` - 新功能
- `fix:` - 修复 Bug
- `docs:` - 文档更新
- `style:` - 代码格式调整（不影响功能）
- `refactor:` - 代码重构
- `perf:` - 性能优化
- `test:` - 测试相关
- `chore:` - 构建工具或辅助工具的变动

### 🐛 报告 Bug

提交 Issue 时请包含：
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 浏览器版本和操作系统
- 相关截图（如有）

### 💡 功能建议

提交功能建议时请说明：
- 功能描述
- 使用场景
- 预期收益
- 可能的实现方案

---

## 📝 更新日志

### 🎮 v2.1.0 (2024-12-04) - 多平台账号管理

#### ✨ 新增功能
- **多平台游戏账号管理系统**
  - Epic Games 账号手动录入功能
  - Xbox Live API (OpenXBL) 完整集成
  - PlayStation Network API (NPSSO) 完整集成
- **UI/UX 优化**
  - 独立的账号切换界面（动画背景、流畅过渡）
  - 独立的退出登录界面（警告主题、明确提示）
  - 统一的平台状态徽章（灰色"未绑定" vs 绿色"已绑定"）

#### 🔧 改进
- 移除所有"即将推出"误导性文本
- 优化按钮文本样式（移除多余 emoji）
- 统一平台绑定交互逻辑
- 完善错误提示和帮助文档

#### 📚 文档
- 新增 `PLATFORM_ACCOUNTS.md` - 多平台账号管理完整指南
- 新增 `PROJECT_SUMMARY.md` - 项目完成总结报告
- 更新 `README.md` - 添加详细特性说明

### 🚀 v2.0.0 (2024-12-02) - 无需本地服务器

#### ✨ 重大更新
- 添加公共 CORS 代理支持（默认启用）
- 添加 Cloudflare Workers 支持（可选）
- 实现智能故障转移机制

#### 🔧 改进
- 创建独立的 Steam API 工具类
- 优化错误处理和日志输出
- 添加详细的部署文档 (DEPLOYMENT.md)

### 🛠️ v1.1.0 (2024-12-02) - 优化与清理

#### 🔧 改进
- 添加 Steam API 代理服务器（已废弃，改用新方案）
- 优化错误处理和加载状态
- 清理重复 CSS（减少 555 行）
- 添加 XSS 防护机制
- 添加图片加载失败处理
- 完善项目文档

### 🎉 v1.0.0 (Initial Release) - 首次发布

#### ✨ 核心功能
- 基础功能实现
- 赛博朋克风格设计
- GitHub Actions 自动更新
- 游戏排行榜展示
- 游戏详情页
- 用户登录/注册系统

---

## 🌟 致谢

感谢以下开源项目和服务：

### 数据来源
- [FreeToGame API](https://www.freetogame.com/api-doc) - 免费游戏数据
- [Steam Store API](https://store.steampowered.com) - 系统配置数据
- [OpenXBL](https://xbl.io/) - Xbox Live API 服务

### 技术支持
- [GitHub Pages](https://pages.github.com) - 静态网站托管
- [GitHub Actions](https://github.com/features/actions) - 自动化工作流
- [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算服务

### 设计资源
- [Google Fonts](https://fonts.google.com/) - Orbitron、Rajdhani 字体

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

```
MIT License

Copyright (c) 2024 iam3301-bot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👤 作者

**iam3301-bot**

- GitHub: [@iam3301-bot](https://github.com/iam3301-bot)
- 项目主页: [GameBox 游盒](https://iam3301-bot.github.io)

---

## 💬 联系方式

- **问题反馈**: [GitHub Issues](https://github.com/iam3301-bot/iam3301-bot.github.io/issues)
- **功能建议**: [GitHub Discussions](https://github.com/iam3301-bot/iam3301-bot.github.io/discussions)
- **Pull Request**: [GitHub PRs](https://github.com/iam3301-bot/iam3301-bot.github.io/pulls)

---

<div align="center">

### ⭐ Star History

如果这个项目对您有帮助，请给我们一个 Star！

[![Star History Chart](https://api.star-history.com/svg?repos=iam3301-bot/iam3301-bot.github.io&type=Date)](https://star-history.com/#iam3301-bot/iam3301-bot.github.io&Date)

---

**🎮 GameBox 游盒 - 让游戏管理更简单！**

Made with ❤️ by [iam3301-bot](https://github.com/iam3301-bot)

[⬆️ 回到顶部](#-gamebox-游盒)

</div>
