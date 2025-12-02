# 🎮 GameBox 游盒

一个精美的游戏平台展示网站 - 纯前端项目，具有赛博朋克风格设计

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://iam3301-bot.github.io)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ 特性

- 🎨 **赛博朋克风格** - 深色主题，渐变效果，毛玻璃材质
- 🚀 **纯静态部署** - 无需后端服务器，直接部署到 GitHub Pages
- 🔄 **自动化数据更新** - GitHub Actions 定时从 FreeToGame API 获取最新数据
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **轻量高效** - 无框架依赖，原生 JavaScript 实现
- 🔒 **安全防护** - XSS 防护，安全的 HTML 处理
- 🎯 **Steam 集成** - 通过代理服务器获取 Steam 推荐配置

## 📸 预览

### 首页 - 热门排行榜
![首页预览](https://via.placeholder.com/800x450/050816/38bdf8?text=GameBox+Home)

### 游戏详情页
![详情页预览](https://via.placeholder.com/800x450/050816/38bdf8?text=Game+Detail)

## 🚀 快速开始

### 在线访问
直接访问：[https://iam3301-bot.github.io](https://iam3301-bot.github.io)

### 本地运行

1. **克隆项目**
```bash
git clone https://github.com/iam3301-bot/iam3301-bot.github.io.git
cd iam3301-bot.github.io
```

2. **安装依赖**
```bash
npm install
```

3. **启动代理服务器**（可选，用于 Steam API）
```bash
npm run dev
# 或
node server.js
```

4. **打开网站**
   - 直接用浏览器打开 `index.html`
   - 或使用本地服务器（推荐）：
     ```bash
     # 使用 Python
     python -m http.server 8080
     
     # 使用 Node.js http-server
     npx http-server -p 8080
     ```
   - 访问 `http://localhost:8080`

### 手动更新排行榜数据

```bash
npm run update:ranking
```

## 📁 项目结构

```
gamebox-web/
├── index.html              # 首页 - 热门排行榜
├── game-detail.html        # 游戏详情页
├── game-library.html       # 游戏库
├── ranking.html            # 排行榜
├── news-list.html          # 资讯列表
├── discount.html           # 折扣/史低
├── community.html          # 社区
├── my-library.html         # 我的游戏
├── tools.html              # 工具中心
├── profile.html            # 用户中心
├── search.html             # 搜索
├── login.html              # 登录
│
├── index.css               # 全局样式
├── common.js               # 通用脚本
├── ranking.json            # 排行榜数据（自动更新）
├── server.js               # Steam API 代理服务器
├── package.json            # 项目配置
│
├── tools/
│   ├── update-ranking.mjs  # 数据更新脚本
│   └── sysreq-overrides.json # 系统配置手动覆盖
│
└── .github/
    └── workflows/
        └── update-ranking.yml # 自动更新工作流
```

## 🎨 技术栈

| 类别 | 技术 |
|------|------|
| **前端** | HTML5, CSS3, JavaScript (ES6+) |
| **样式** | CSS Variables, Flexbox, Grid |
| **数据源** | FreeToGame API, Steam API |
| **自动化** | GitHub Actions |
| **部署** | GitHub Pages |
| **代理服务器** | Node.js (可选) |

## 📊 功能列表

### ✅ 已实现功能

- [x] 首页排行榜展示（热度/评分/新品/折扣）
- [x] 滚动加载更多
- [x] 游戏类型分类浏览
- [x] 游戏详情页
- [x] 基础信息展示
- [x] 系统配置显示（最低 + 推荐）
- [x] Steam 推荐配置获取
- [x] 用户登录/退出（LocalStorage）
- [x] 全局搜索
- [x] 响应式设计
- [x] 加载状态提示
- [x] 错误处理
- [x] 图片加载失败占位符
- [x] XSS 防护
- [x] GitHub Actions 自动更新数据

### 🚧 待开发功能

- [ ] 游戏库筛选功能
- [ ] 资讯页面数据接入
- [ ] 社区功能
- [ ] 用户收藏游戏
- [ ] 评论系统
- [ ] 搜索结果页面完善
- [ ] 工具中心功能

## 🔧 配置说明

### GitHub Actions 自动更新

项目配置了自动任务，每 6 小时更新一次排行榜数据：

```yaml
# .github/workflows/update-ranking.yml
on:
  schedule:
    - cron: "0 */6 * * *"  # 每 6 小时
  workflow_dispatch:        # 支持手动触发
```

手动触发：
1. 访问 GitHub Actions 页面
2. 选择 "Update ranking data" workflow
3. 点击 "Run workflow"

### Steam API 配置

**🎉 好消息：现在无需本地服务器！**

项目已经集成了公共 CORS 代理，开箱即用。如果需要更稳定的方案，可以选择部署 Cloudflare Workers。

详细配置说明请查看：**[DEPLOYMENT.md](DEPLOYMENT.md)**

#### 快速开始

1. **默认方案**（推荐用于测试）
   - 无需任何配置
   - 直接使用，已内置公共代理
   - 自动故障转移

2. **Cloudflare Worker**（推荐用于生产）
   - 参考 [DEPLOYMENT.md](DEPLOYMENT.md) 部署指南
   - 10 分钟一次性配置
   - 免费且稳定

### 系统配置覆盖

可以手动添加准确的系统配置到 `tools/sysreq-overrides.json`：

```json
{
  "游戏名称": {
    "minimum": {
      "os": "Windows 10",
      "processor": "Intel Core i5",
      "memory": "8 GB RAM",
      "graphics": "NVIDIA GTX 1060",
      "storage": "50 GB"
    },
    "recommended": {
      "os": "Windows 11",
      "processor": "Intel Core i7",
      "memory": "16 GB RAM",
      "graphics": "NVIDIA RTX 3060",
      "storage": "50 GB SSD"
    }
  }
}
```

## 🌐 Steam API 集成方案

本项目实现了**无需本地服务器**的 Steam API 调用，所有访问 GitHub Pages 的用户都可以使用。

### 默认方案：公共 CORS 代理 ✅
- **开箱即用**，无需任何配置
- 使用 `allorigins.win` 和 `corsproxy.io`
- 自动故障转移机制

### 推荐方案：Cloudflare Workers（可选）🌟  
- 更稳定、更快速
- 完全免费（每天 100,000 次请求）
- 10分钟一次性配置
- **详见 [DEPLOYMENT.md](DEPLOYMENT.md) 部署指南**

## 🎯 设计特点

### 配色方案
```css
:root {
  --bg: #050816;                    /* 主背景 */
  --bg-elevated: #0b1020;           /* 卡片背景 */
  --accent: #38bdf8;                /* 主色调 */
  --accent-strong: #0ea5e9;         /* 强调色 */
  --text-main: #e5e7eb;             /* 主文本 */
  --text-muted: #9ca3af;            /* 次要文本 */
}
```

### 视觉效果
- **渐变背景**: `radial-gradient` 营造空间感
- **毛玻璃效果**: `backdrop-filter: blur(10px)`
- **悬浮卡片**: 卡片式布局 + 阴影效果
- **微交互**: `hover` 状态动画
- **自定义滚动条**: 融入整体风格

## 🐛 已知问题

1. **Steam API 限流**：Steam API 有访问频率限制，请求过多可能被限制
2. **数据准确性**：推荐配置依赖 Steam API 和 FreeToGame 数据准确性
3. **浏览器兼容性**：部分旧版浏览器可能不支持 CSS Grid

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建新分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m "Add your feature"`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 📝 更新日志

### v2.0.0 (2024-12-02) 🚀
- ✨ **重大更新：无需本地服务器！**
- ✅ 添加公共 CORS 代理支持（默认启用）
- ✅ 添加 Cloudflare Workers 支持（可选）
- ✅ 实现智能故障转移机制
- ✅ 创建独立的 Steam API 工具类
- ✅ 添加详细的部署文档 (DEPLOYMENT.md)
- ✅ 优化错误处理和日志输出

### v1.1.0 (2024-12-02)
- ✅ 添加 Steam API 代理服务器（已废弃，改用新方案）
- ✅ 优化错误处理和加载状态
- ✅ 清理重复 CSS（减少 555 行）
- ✅ 添加 XSS 防护
- ✅ 添加图片加载失败处理
- ✅ 完善文档

### v1.0.0 (Initial Release)
- 🎉 基础功能实现
- 🎨 赛博朋克风格设计
- 🔄 GitHub Actions 自动更新

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👤 作者

**iam3301-bot**
- GitHub: [@iam3301-bot](https://github.com/iam3301-bot)

## 🙏 致谢

- 数据来源：[FreeToGame API](https://www.freetogame.com/api-doc)
- 系统配置：[Steam Store API](https://store.steampowered.com)
- 部署平台：[GitHub Pages](https://pages.github.com)

---

⭐ 如果觉得这个项目不错，请给个 Star 支持一下！
