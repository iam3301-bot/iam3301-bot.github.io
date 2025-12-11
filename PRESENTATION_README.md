# 🎮 GameBox 游盒 - 项目演示 PPT

## 📖 简介

这是一个专为 **GameBox 游盒** 项目制作的交互式演示 PPT，采用赛博朋克风格设计，全面展示项目的功能、技术架构和特色。

## 🌐 在线访问

### GitHub Pages 部署
项目已部署到 GitHub Pages，可以直接访问：
- **PPT 地址**: https://iam3301-bot.github.io/presentation.html
- **项目主页**: https://iam3301-bot.github.io/

### 本地预览
如果您克隆了仓库，可以通过以下方式本地预览：

```bash
# 方式 1: Python HTTP Server
python3 -m http.server 8000
# 然后访问 http://localhost:8000/presentation.html

# 方式 2: Node.js http-server
npm install -g http-server
http-server -p 8000
# 然后访问 http://localhost:8000/presentation.html

# 方式 3: VS Code Live Server
# 安装 Live Server 插件
# 右键 presentation.html → Open with Live Server
```

## ✨ PPT 特色

### 🎨 视觉设计
- **赛博朋克主题**: 完整的赛博朋克风格 UI
- **霓虹灯效果**: 青色、黄色、红色霓虹光晕
- **粒子背景**: Particles.js 交互式粒子动画
- **流畅动画**: Reveal.js 页面切换动画

### 📑 内容结构
PPT 共包含 **12+ 个主要章节**，全面覆盖：

1. **开场总览** - 项目介绍与快速导航
2. **项目简介** - GameBox 的核心定位
3. **核心功能** - 游戏库、社区、排行榜等功能详解
4. **用户系统** - 多账号管理、OAuth 登录
5. **技术架构** - 前端技术栈、后端服务、数据库设计
6. **快速开始** - 部署指南、配置说明
7. **功能演示** - 主要页面预览
8. **项目统计** - 代码量、功能数据统计
9. **开发路线图** - 已完成功能、进行中、计划功能
10. **常见问题** - FAQ 汇总
11. **贡献指南** - 如何参与项目
12. **结尾总结** - 项目成就与联系方式

### 🔗 交互功能
- **外部链接**: 直接跳转到 GitHub、在线网站
- **页面导航**: 支持键盘、鼠标、触摸导航
- **悬停效果**: 卡片、按钮悬停动画
- **响应式设计**: 适配桌面、平板、手机

## ⌨️ 快捷键

使用以下快捷键控制 PPT 播放：

| 快捷键 | 功能 |
|--------|------|
| `→` 或 `空格` | 下一页 |
| `←` | 上一页 |
| `↑` / `↓` | 垂直章节导航 |
| `Esc` | 幻灯片概览 |
| `F` | 全屏模式 |
| `R` | 返回首页 |
| `S` | 演讲者模式 |
| `?` | 显示帮助 |

## 🛠️ 技术栈

### PPT 框架
- **Reveal.js 4.5.0** - 强大的 HTML 演示框架
- **Particles.js 2.0.0** - 粒子动画库
- **Font Awesome 6.4.0** - 图标库

### 样式技术
- **CSS3 动画** - 关键帧动画、过渡效果
- **Grid / Flexbox** - 响应式布局
- **自定义主题** - 赛博朋克配色方案

### JavaScript
- **原生 ES6+** - 无额外依赖
- **Reveal.js API** - 幻灯片控制
- **事件监听** - 交互响应

## 📦 文件说明

```
presentation.html          # PPT 主文件（单文件，约 64KB）
├── 内嵌 CSS 样式         # 赛博朋克主题样式
├── Reveal.js 配置        # 幻灯片设置
├── Particles.js 配置     # 粒子背景
└── 12+ 章节内容          # 完整的项目介绍
```

**优势**: 所有样式和内容都包含在一个 HTML 文件中，无需额外依赖，方便分享和部署。

## 🎯 使用场景

### 1. 项目展示
- 向他人介绍 GameBox 项目
- 演示核心功能和技术亮点
- 展示项目架构和设计思路

### 2. 技术分享
- 技术社区分享会
- 学校课程项目汇报
- 面试作品集展示

### 3. 团队协作
- 团队内部项目回顾
- 新成员项目培训
- 功能需求讨论

### 4. 开源推广
- GitHub 项目宣传
- 社交媒体分享
- 技术博客配图

## 🎨 自定义

### 修改配色
在 `<style>` 标签中的 `:root` 部分修改：

```css
:root {
  --cyber-cyan: #00ffff;     /* 青色霓虹 */
  --accent: #ffd300;          /* 黄色强调 */
  --danger: #ff0055;          /* 红色警告 */
  --bg-main: #0a0a0a;         /* 主背景 */
}
```

### 修改粒子效果
在 `particlesJS()` 配置中调整：

```javascript
particlesJS('particles-js', {
  particles: {
    number: { value: 80 },    // 粒子数量
    color: { value: '#00ffff' }, // 粒子颜色
    size: { value: 3 },        // 粒子大小
    // ...更多配置
  }
});
```

### 添加新页面
使用 `<section>` 标签添加新幻灯片：

```html
<section data-background-color="#0a0a1a">
  <h2>新页面标题</h2>
  <p>页面内容...</p>
</section>
```

## 📱 响应式支持

PPT 已针对不同设备优化：

- **桌面端** (1920x1080+): 完整显示，最佳体验
- **笔记本** (1366x768+): 自动缩放，保持比例
- **平板电脑** (768x1024): 响应式布局
- **手机** (375x667+): 垂直滚动，简化布局

## 🐛 常见问题

### Q: 为什么粒子背景不显示？
A: 确保通过 HTTP 服务器访问，不要直接双击打开 HTML 文件。

### Q: 如何导出为 PDF？
A: 在浏览器中打开 PPT，按 `E` 键进入打印模式，然后使用浏览器的"打印→另存为 PDF"功能。

### Q: 如何修改内容？
A: 直接编辑 `presentation.html` 文件，在 `<div class="slides">` 中修改对应的 `<section>` 内容。

### Q: 支持哪些浏览器？
A: 支持所有现代浏览器：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 许可证

本 PPT 与 GameBox 项目使用相同的 [MIT License](../LICENSE)。

## 🙏 致谢

- **Reveal.js** - 感谢 Hakim El Hattab 创建的优秀演示框架
- **Particles.js** - 感谢 Vincent Garreau 的粒子动画库
- **GameBox 项目** - 本 PPT 基于 [iam3301-bot/iam3301-bot.github.io](https://github.com/iam3301-bot/iam3301-bot.github.io)

## 📞 联系方式

- **项目作者**: IOA3301
- **GitHub**: https://github.com/iam3301-bot
- **邮箱**: 2784422912@qq.com
- **项目主页**: https://iam3301-bot.github.io/

---

<div align="center">

**🎮 GameBox 游盒 - 让游戏信息触手可及 🎮**

Made with ❤️ by [IOA3301](https://github.com/iam3301-bot)

</div>
