# 🎮 GameBox 社区功能说明

## 📖 概述

GameBox 现已集成完整的社区功能，支持真实的多用户互动和数据云端同步。

---

## ✨ 核心功能

### 💬 社区互动
- ✅ **发帖功能** - 用户可发布游戏心得、攻略、截图
- ✅ **评论系统** - 支持帖子评论和楼中楼回复
- ✅ **点赞功能** - 帖子和评论的点赞/取消点赞
- ✅ **板块分类** - 综合讨论、攻略心得、游戏截图、交易求助
- ✅ **帖子搜索** - 全文搜索标题、内容、游戏名称

### 📊 数据统计
- ✅ **实时在线统计** - 基于时间段的动态在线人数
- ✅ **社区统计** - 总帖子数、总成员数、总回复数
- ✅ **热门话题** - 根据热度自动排序展示
- ✅ **活动追踪** - 完整的用户活动日志

### 🔐 用户系统
- ✅ **注册/登录** - 支持邮箱验证码注册
- ✅ **Steam 头像** - 绑定 Steam 后自动同步头像
- ✅ **用户资料** - 个人信息管理和平台绑定
- ✅ **游客模式** - 未登录用户可浏览社区内容

---

## 🗄️ 技术架构

### 双模式运行

#### 1. 本地存储模式（默认）
- **存储方式**: LocalStorage
- **优势**: 零配置，开箱即用
- **限制**: 单用户，数据不跨设备同步
- **适用**: 快速体验、个人使用

#### 2. 云数据库模式（推荐）
- **存储方式**: Supabase PostgreSQL
- **优势**: 多用户、实时同步、跨设备访问
- **需求**: 配置 Supabase 项目
- **适用**: 生产环境、团队协作

---

## 🚀 快速开始

### 方式一：本地体验（无需配置）

1. 访问社区页面 `community.html`
2. 点击"发布新帖"即可体验
3. 数据存储在浏览器本地

### 方式二：启用云数据库

#### 第 1 步：创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com) 注册（免费）
2. 创建新项目，获取 API 密钥
3. 免费额度：500MB 数据库 + 50,000 月活用户

#### 第 2 步：初始化数据库

1. 在 Supabase Dashboard → SQL Editor
2. 执行 `supabase-init.sql` 脚本
3. 等待表创建完成（约 10 秒）

#### 第 3 步：配置项目

编辑 `supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://你的项目ID.supabase.co',
  anonKey: '你的公开密钥',
  enabled: true  // 启用 Supabase
};
```

#### 第 4 步：测试连接

1. 访问 `test-backend.html`
2. 点击"测试数据库连接"
3. 确认显示 ✅ 连接成功

---

## 📁 文件说明

| 文件 | 说明 | 用途 |
|------|------|------|
| `community.html` | 社区主页 | 浏览帖子、发布帖子 |
| `post-detail.html` | 帖子详情 | 查看帖子详情和评论 |
| `community-data-service.js` | 数据服务 | 统一的数据访问接口 |
| `supabase-config.js` | 数据库配置 | Supabase 连接配置 |
| `supabase-init.sql` | 初始化脚本 | 创建数据库表结构 |
| `test-backend.html` | 测试页面 | 测试后端连接状态 |
| `BACKEND_SETUP.md` | 配置文档 | 详细的配置指南 |

---

## 🗂️ 数据库表结构

### community_posts（帖子表）
```sql
- id: 帖子唯一标识
- title: 标题
- content: 内容
- author: 作者
- avatar: 头像
- game: 游戏名称
- board: 板块（general/guide/shot/trade）
- replies: 回复数
- likes: 点赞数
- views: 浏览量
- is_pinned: 是否置顶
- created_at: 创建时间
```

### community_comments（评论表）
```sql
- id: 评论唯一标识
- post_id: 关联帖子ID
- author: 评论者
- content: 评论内容
- likes: 点赞数
- created_at: 创建时间
```

### community_likes（点赞表）
```sql
- id: 点赞记录ID
- target_type: 目标类型（post/comment）
- target_id: 目标ID
- user_id: 用户ID
- created_at: 点赞时间
```

### community_stats（统计表）
```sql
- total_members: 总成员数
- total_replies: 总回复数
- start_time: 统计开始时间
- last_update: 最后更新时间
```

### online_users（在线用户表）
```sql
- user_id: 用户ID
- username: 用户名
- last_active: 最后活跃时间
```

---

## 🎨 功能特性

### 实时更新
- ✅ **Supabase Realtime** - 帖子发布后立即推送给所有用户
- ✅ **自动刷新** - 页面激活时自动拉取最新数据
- ✅ **在线状态** - 每 30 秒更新在线用户数

### 智能排序
- ✅ **置顶优先** - 置顶帖子始终显示在顶部
- ✅ **热度排序** - 根据点赞数、回复数、浏览量计算
- ✅ **时间排序** - 最新发布的帖子优先显示
- ✅ **板块筛选** - 按板块分类浏览

### 用户体验
- ✅ **加载动画** - 流畅的加载过渡效果
- ✅ **错误提示** - 友好的错误信息和重试机制
- ✅ **状态徽章** - 显示数据来源（Supabase/本地存储）
- ✅ **响应式设计** - 完美适配移动端和桌面端

---

## 🔒 安全特性

### 数据安全
- ✅ **RLS 策略** - Row Level Security 保护数据访问
- ✅ **XSS 防护** - 内容自动转义，防止脚本注入
- ✅ **CSRF 防护** - API 请求签名验证
- ✅ **匿名 ID** - 自动生成匿名用户标识

### 隐私保护
- ✅ **公开读取** - 所有人可浏览社区内容
- ✅ **登录发帖** - 发帖需要登录账户
- ✅ **数据加密** - 敏感信息本地加密存储
- ✅ **日志追踪** - 完整的操作日志审计

---

## 📊 性能优化

### 数据缓存
- ✅ **LocalStorage 缓存** - 减少 API 请求次数
- ✅ **增量更新** - 仅拉取变更的数据
- ✅ **懒加载** - 滚动加载更多帖子
- ✅ **图片优化** - 自动压缩和 CDN 加速

### 数据库优化
- ✅ **索引优化** - 主要查询字段建立索引
- ✅ **分页查询** - 避免一次加载过多数据
- ✅ **连接池** - Supabase 自动管理连接
- ✅ **实时推送** - WebSocket 长连接优化

---

## 🔧 API 接口

### 获取帖子列表
```javascript
const posts = await communityDataService.getAllPosts();
// 返回所有帖子，按置顶和时间排序
```

### 创建帖子
```javascript
const result = await communityDataService.createPost({
  title: '帖子标题',
  content: '帖子内容',
  game: '游戏名称',
  board: 'general'  // general/guide/shot/trade
});
```

### 添加评论
```javascript
const result = await communityDataService.addComment(postId, {
  content: '评论内容'
});
```

### 点赞/取消点赞
```javascript
const result = await communityDataService.likePost(postId);
// 自动检测当前状态，切换点赞/取消点赞
```

### 获取统计数据
```javascript
const stats = await communityDataService.getCommunityStats();
// 返回：totalPosts, totalMembers, totalReplies, onlineUsers
```

---

## 🎯 使用场景

### 游戏攻略分享
- 发布游戏心得和通关攻略
- 解答新手玩家疑问
- 分享高分技巧

### 游戏截图展示
- 分享精彩游戏瞬间
- 展示游戏画面效果
- 交流摄影技巧

### 交易和求助
- 游戏物品交易
- 组队招募
- 技术求助

### 社区讨论
- 游戏评测和推荐
- 行业新闻讨论
- 意见建议反馈

---

## 🐛 常见问题

### Q1: 为什么我发的帖子别人看不到？

**A**: 如果使用本地存储模式，数据仅保存在你的浏览器中。要实现多用户共享，请配置 Supabase 云数据库。

### Q2: 如何切换到云数据库模式？

**A**: 
1. 配置 `supabase-config.js` 中的 `enabled: true`
2. 执行 `supabase-init.sql` 创建表
3. 刷新页面，检查右下角状态徽章

### Q3: Supabase 免费版够用吗？

**A**: 免费版提供：
- 500MB 数据库存储（约 50 万条帖子）
- 50,000 月活用户
- 2GB 带宽
- 对于中小型社区完全够用

### Q4: 数据会丢失吗？

**A**: 
- **本地模式**: 清除浏览器缓存会丢失数据
- **云数据库模式**: 数据永久保存在 Supabase，定期自动备份

### Q5: 如何备份社区数据？

**A**: 在 Supabase Dashboard → Database → Backups 可以：
- 查看自动备份（免费版保留 7 天）
- 手动导出 SQL 文件
- 下载 CSV 数据

---

## 📚 相关文档

- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - 详细的后端配置指南
- **[README.md](README.md)** - 项目主文档
- **[Supabase 官方文档](https://supabase.com/docs)** - Supabase 使用手册

---

## 🎉 未来规划

### 短期计划
- [ ] 富文本编辑器
- [ ] 图片上传功能
- [ ] @提及功能
- [ ] 通知系统

### 中期计划
- [ ] 用户个人主页
- [ ] 私信功能
- [ ] 好友系统
- [ ] 举报/封禁机制

### 长期计划
- [ ] 积分/等级系统
- [ ] 勋章/徽章系统
- [ ] 社区活动系统
- [ ] 移动端 APP

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

**贡献方向**:
- 🐛 Bug 修复
- ✨ 新功能开发
- 📝 文档完善
- 🎨 UI/UX 改进
- 🌐 多语言支持

---

<div align="center">

**🎮 GameBox 社区 - 连接全球玩家**

Made with ❤️ by GameBox Team

</div>
