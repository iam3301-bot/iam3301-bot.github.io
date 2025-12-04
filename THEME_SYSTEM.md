# GameBox 主题系统文档

## 📖 概述

GameBox 游盒现在支持多主题切换功能，用户可以根据个人喜好选择不同的视觉风格。

## 🎨 可用主题

### 1. 赛博朋克主题 (Cyberpunk)
- **图标**: 🌃
- **描述**: 未来科技风格，霓虹灯效果
- **特点**:
  - 蓝色霓虹色调
  - 科技感十足的UI元素
  - 流光溢彩的动画效果
  - 电子游戏风格的滚动条

### 2. 游戏世界主题 (Game World)
- **图标**: 🎮
- **描述**: 经典游戏风格，复古与现代结合
- **特点**:
  - 金色主色调（游戏金币黄）
  - 生命值红、魔力蓝、经验绿的配色
  - 像素风格的装饰元素
  - 游戏化的交互反馈
  - 史诗级的视觉效果

## 🚀 如何使用

### 用户使用

1. **打开主题切换器**
   - 在页面右下角找到浮动的主题按钮（带有主题图标）
   - 点击按钮打开主题选择面板

2. **选择主题**
   - 在弹出的面板中查看所有可用主题
   - 点击任意主题卡片即可切换
   - 当前激活的主题会显示 ✓ 标记

3. **主题持久化**
   - 选择的主题会自动保存到浏览器本地存储
   - 下次访问网站时会自动应用上次选择的主题

### 开发者集成

#### 在其他页面添加主题支持

1. **引入主题CSS文件**
```html
<!-- 在页面 <head> 中添加 -->
<link rel="stylesheet" href="cyberpunk-styles.css">
<link rel="stylesheet" href="game-theme.css">
```

2. **引入主题管理器**
```html
<!-- 在页面 </body> 前添加 -->
<script src="theme-manager.js"></script>
```

3. **完成！**
   - 主题管理器会自动初始化
   - 会自动创建主题切换器UI
   - 会自动应用用户之前选择的主题

## 🔧 技术实现

### 文件结构

```
/home/user/webapp/
├── cyberpunk-styles.css    # 赛博朋克主题样式
├── game-theme.css          # 游戏世界主题样式
├── theme-manager.js        # 主题管理器核心逻辑
└── index.html              # 首页（已集成主题系统）
```

### 主题管理器 API

```javascript
// 获取主题管理器实例
const manager = window.themeManager;

// 切换主题
manager.applyTheme('game', true); // 'cyberpunk' 或 'game'

// 获取当前主题
const current = manager.getCurrentTheme();
console.log(current); // { key: 'game', name: '游戏世界', ... }

// 获取所有主题
const all = manager.getAllThemes();
console.log(all); // [ { key: 'cyberpunk', ... }, { key: 'game', ... } ]
```

### 监听主题切换事件

```javascript
window.addEventListener('themechange', (e) => {
  console.log('主题已切换:', e.detail.theme.name);
  console.log('主题键:', e.detail.themeKey);
  
  // 在这里可以执行主题切换后的自定义逻辑
});
```

## 🎯 主题样式规范

### CSS 类命名

- 主题类名格式: `theme-{themeName}`
- 示例:
  - 赛博朋克: `theme-cyberpunk`
  - 游戏世界: `theme-game`

### CSS 变量

每个主题定义在 `body.theme-{name}` 下，使用 CSS 变量：

```css
body.theme-game {
  --game-gold: #FFD700;
  --game-red: #FF4757;
  --game-blue: #2F80ED;
  /* ... 更多变量 */
}
```

### 样式覆盖优先级

```css
/* 基础样式 */
.card { ... }

/* 主题样式覆盖 */
body.theme-game .card { ... }
```

## 🎨 如何添加新主题

### 步骤1: 创建主题CSS文件

创建新文件 `your-theme.css`：

```css
body.theme-yourtheme {
  /* 定义主题变量 */
  --your-primary: #color;
  --your-secondary: #color;
  
  /* 设置背景 */
  background: linear-gradient(...);
}

/* 定义各组件样式 */
body.theme-yourtheme .card { ... }
body.theme-yourtheme .button { ... }
/* ... 更多样式 */
```

### 步骤2: 在主题管理器中注册

编辑 `theme-manager.js`，在 `THEMES` 对象中添加：

```javascript
const THEMES = {
  // ... 现有主题
  yourtheme: {
    name: '你的主题',
    nameEn: 'Your Theme',
    icon: '🌟',
    className: 'theme-yourtheme',
    description: '主题描述',
    cssFile: 'your-theme.css'
  }
};
```

### 步骤3: 测试

1. 刷新页面
2. 打开主题切换器
3. 应该能看到新主题出现在列表中
4. 点击测试切换效果

## 📱 响应式支持

所有主题都包含响应式设计，自动适配移动设备：

- 小屏幕下主题切换器位置和大小会自动调整
- 所有主题元素都有移动端优化
- 触摸友好的交互设计

## 🐛 故障排除

### 主题没有生效？

1. 检查浏览器控制台是否有错误
2. 确认 CSS 文件路径正确
3. 清除浏览器缓存重试
4. 检查 localStorage 是否被禁用

### 主题切换器没有显示？

1. 确认 `theme-manager.js` 已正确加载
2. 检查是否有 JavaScript 错误
3. 确认页面 DOM 已完全加载

### 样式冲突？

1. 检查 CSS 选择器优先级
2. 确保主题样式使用了 `body.theme-{name}` 前缀
3. 避免使用 `!important`（除非必要）

## 🎮 游戏主题特色

游戏世界主题包含以下特殊效果：

### 彩虹流光边框
```css
@keyframes game-rainbow-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 奖杯发光动画
```css
@keyframes game-trophy-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 1); }
}
```

### 徽章弹跳动画
```css
@keyframes game-badge-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
```

### 折扣闪耀效果
```css
@keyframes game-discount-shine {
  0%, 100% { box-shadow: 0 4px 15px rgba(255, 215, 0, 0.6); }
  50% { box-shadow: 0 4px 25px rgba(255, 215, 0, 1); }
}
```

## 📝 更新日志

### v1.0.0 (2025-12-04)
- ✨ 新增主题系统
- 🎨 添加赛博朋克主题
- 🎮 添加游戏世界主题
- 🔧 实现主题切换器UI
- 💾 支持主题本地存储
- 📱 响应式设计支持

## 🤝 贡献

欢迎贡献新主题！请遵循以下步骤：

1. Fork 本项目
2. 创建新主题分支 (`git checkout -b theme/awesome-theme`)
3. 按照上述规范添加新主题
4. 提交更改 (`git commit -m 'Add awesome theme'`)
5. 推送到分支 (`git push origin theme/awesome-theme`)
6. 创建 Pull Request

## 📄 许可证

本主题系统遵循项目整体许可证。

## 💡 灵感来源

- **赛博朋克主题**: 受《赛博朋克 2077》视觉风格启发
- **游戏世界主题**: 融合经典RPG和街机游戏元素

---

**开发者**: GameBox Team  
**更新时间**: 2025-12-04  
**版本**: 1.0.0
