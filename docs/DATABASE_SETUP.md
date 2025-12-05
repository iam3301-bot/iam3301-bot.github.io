# 📊 数据库配置指南

本文档详细说明如何配置 GameBox 的 Supabase 数据库。

---

## 📋 目录

1. [创建 Supabase 项目](#创建-supabase-项目)
2. [执行数据库初始化](#执行数据库初始化)
3. [表结构说明](#表结构说明)
4. [测试数据](#测试数据)
5. [常见问题](#常见问题)

---

## 🚀 创建 Supabase 项目

### 步骤 1：注册 Supabase 账号
1. 访问 [Supabase](https://supabase.com/)
2. 点击 **Start your project**
3. 使用 GitHub 或 Google 账号注册

### 步骤 2：创建新项目
1. 点击 **New Project**
2. 填写项目信息：
   - **Name**：gamebox（或任意名称）
   - **Database Password**：设置强密码（保存好）
   - **Region**：选择离你最近的区域（如 Tokyo）
   - **Pricing Plan**：选择 Free（免费）
3. 点击 **Create new project**
4. 等待 1-2 分钟项目创建完成

### 步骤 3：获取项目凭证
1. 打开项目 Dashboard
2. 点击左侧 **Settings** → **API**
3. 复制以下信息：
   - **Project URL**：`https://xxx.supabase.co`
   - **anon public Key**：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🗄️ 执行数据库初始化

### 方式 1：完整初始化（推荐）

1. 打开 Supabase SQL 编辑器：
   - Dashboard → **SQL Editor** → **New query**

2. 复制 `FINAL-FIX-DATABASE.sql` 的完整内容并执行

3. 验证结果：
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   
   应该看到 4 个表：
   - `user_profiles`
   - `online_users`
   - `community_posts`
   - `community_comments`

### 方式 2：分步初始化

如果方式 1 执行失败，使用 `step-by-step-init.sql`：

1. 打开 SQL 编辑器
2. 复制并执行 `step-by-step-init.sql`
3. 查看执行结果，确认每个步骤都成功

---

## 📊 表结构说明

### 1. user_profiles（用户资料表）

存储用户基本信息。

```sql
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,              -- 用户 ID（Supabase Auth User ID）
  username TEXT NOT NULL,            -- 用户名
  avatar TEXT DEFAULT '🎮',         -- 头像（Emoji）
  bio TEXT,                          -- 个人简介
  last_login_at TIMESTAMPTZ DEFAULT NOW(),  -- 最后登录时间
  created_at TIMESTAMPTZ DEFAULT NOW(),     -- 创建时间
  updated_at TIMESTAMPTZ DEFAULT NOW()      -- 更新时间
);
```

**索引**：
- `idx_user_profiles_username`：用户名索引
- `idx_user_profiles_created_at`：创建时间索引

**RLS（Row Level Security）**：已禁用

---

### 2. online_users（在线用户表）

记录当前在线的用户。

```sql
CREATE TABLE online_users (
  user_id TEXT PRIMARY KEY,         -- 用户 ID
  username TEXT NOT NULL,            -- 用户名
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),  -- 最后在线时间
  created_at TIMESTAMPTZ DEFAULT NOW()              -- 首次在线时间
);
```

**索引**：
- `idx_online_users_last_seen`：最后在线时间索引

**更新机制**：
- 用户访问社区页面时，自动调用 `upsert` 更新 `last_seen_at`
- 超过 5 分钟未活动的用户视为离线

**RLS**：已禁用

---

### 3. community_posts（社区帖子表）

存储社区发布的帖子。

```sql
CREATE TABLE community_posts (
  id TEXT PRIMARY KEY,              -- 帖子 ID
  title TEXT NOT NULL,               -- 标题
  content TEXT NOT NULL,             -- 内容
  author TEXT NOT NULL,              -- 作者
  avatar TEXT DEFAULT '👤',         -- 作者头像
  game TEXT,                         -- 关联游戏
  board TEXT DEFAULT 'general',      -- 板块（general, announcement, guide, help）
  likes INTEGER DEFAULT 0,           -- 点赞数
  replies INTEGER DEFAULT 0,         -- 回复数
  views INTEGER DEFAULT 0,           -- 浏览数
  is_pinned BOOLEAN DEFAULT FALSE,   -- 是否置顶
  is_new BOOLEAN DEFAULT FALSE,      -- 是否新帖
  created_at TIMESTAMPTZ DEFAULT NOW(),     -- 创建时间
  updated_at TIMESTAMPTZ DEFAULT NOW()      -- 更新时间
);
```

**索引**：
- `idx_posts_board`：板块索引
- `idx_posts_created_at`：创建时间索引
- `idx_posts_is_pinned`：置顶标记索引

**板块类型**：
- `announcement`：公告
- `general`：综合讨论
- `guide`：攻略心得
- `help`：求助问答

**RLS**：已禁用

---

### 4. community_comments（帖子评论表）

存储帖子的评论。

```sql
CREATE TABLE community_comments (
  id TEXT PRIMARY KEY,              -- 评论 ID
  post_id TEXT NOT NULL,             -- 关联帖子 ID
  author TEXT NOT NULL,              -- 评论作者
  content TEXT NOT NULL,             -- 评论内容
  created_at TIMESTAMPTZ DEFAULT NOW(),     -- 创建时间
  
  CONSTRAINT fk_comments_post 
    FOREIGN KEY (post_id) 
    REFERENCES community_posts(id) 
    ON DELETE CASCADE               -- 帖子删除时级联删除评论
);
```

**索引**：
- `idx_comments_post_id`：帖子 ID 索引
- `idx_comments_created_at`：创建时间索引

**外键约束**：
- 帖子删除时，相关评论自动删除（`ON DELETE CASCADE`）

**RLS**：已禁用

---

## 🧪 测试数据

初始化脚本会自动插入测试数据：

### user_profiles
```sql
('user-admin-001', '管理员', '👨‍💼', 'GameBox 社区管理员'),
('user-test-001', '测试用户1', '🎮', '游戏爱好者'),
('user-test-002', '测试用户2', '🎯', '赛博朋克粉丝')
```

### online_users
```sql
('user-admin-001', '管理员'),
('user-test-001', '测试用户1')
```

### community_posts
```sql
(
  'pinned-welcome',
  '【公告】欢迎来到 GameBox 社区！',
  '大家好！这里是 GameBox 社区的官方欢迎帖...',
  '管理员',
  '👨‍💼',
  '公告',
  'announcement',
  42,   -- 点赞数
  3,    -- 回复数
  888,  -- 浏览数
  TRUE, -- 置顶
  FALSE
)
```

### community_comments
```sql
('comment-test-1', 'pinned-welcome', '测试用户1', '这是第一条测试评论！'),
('comment-test-2', 'pinned-welcome', '测试用户2', '感谢管理员的欢迎贴 🎮'),
('comment-test-3', 'pinned-welcome', '游戏爱好者', '终于有专业的游戏社区了！👍')
```

---

## 🔧 常见问题

### Q1：执行 SQL 时报错 "relation already exists"

**原因**：表已存在，可能是之前执行过初始化脚本。

**解决方案**：
```sql
-- 删除所有表（谨慎操作！会丢失所有数据）
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS online_users CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 重新执行初始化脚本
```

---

### Q2：前端报错 "PGRST116" 或 "permission denied"

**原因**：Row Level Security (RLS) 已启用，阻止了匿名访问。

**解决方案**：
```sql
-- 禁用 RLS（开发环境）
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE online_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;

-- 生产环境建议启用 RLS 并配置访问策略
```

---

### Q3：字段名不匹配错误（如 "column 'is_pinned' does not exist"）

**原因**：表结构与前端代码不一致。

**解决方案**：
1. 删除旧表
2. 使用最新的 `FINAL-FIX-DATABASE.sql` 重新初始化
3. 确保字段名为：
   - `is_pinned`（不是 `pinned`）
   - `is_new`（不是 `new`）

---

### Q4：评论插入失败 "null value in column 'id'"

**原因**：`id` 字段没有自动生成。

**解决方案**：
确保前端代码在插入评论时手动生成 ID：
```javascript
const commentId = 'comment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

await supabaseClient
  .from('community_comments')
  .insert({
    id: commentId,          // 手动指定 ID
    post_id: postId,
    author: currentUser.name,
    content: content
  });
```

---

### Q5：如何备份数据库？

**方式 1：通过 Supabase Dashboard**
1. Dashboard → **Database** → **Backups**
2. 点击 **Create backup**
3. 下载备份文件

**方式 2：使用 SQL 导出**
```sql
-- 导出所有数据
COPY user_profiles TO '/tmp/user_profiles.csv' CSV HEADER;
COPY community_posts TO '/tmp/community_posts.csv' CSV HEADER;
-- ...
```

---

### Q6：如何迁移到生产环境？

1. **创建新的 Supabase 项目**（生产）
2. **执行初始化脚本**
3. **启用 RLS 并配置策略**：
   ```sql
   -- 示例：只允许登录用户查看帖子
   ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Anyone can view posts"
   ON community_posts FOR SELECT
   USING (true);
   
   CREATE POLICY "Authenticated users can insert posts"
   ON community_posts FOR INSERT
   WITH CHECK (auth.role() = 'authenticated');
   ```
4. **更新前端配置**（`supabase-config.js`）
5. **测试完整功能流程**

---

## 📚 更多资源

- [Supabase 官方文档](https://supabase.com/docs)
- [PostgreSQL 教程](https://www.postgresql.org/docs/)
- [Row Level Security 指南](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime 订阅文档](https://supabase.com/docs/guides/realtime)

---

<div align="center">

**需要帮助？** 请访问 [GitHub Issues](https://github.com/iam3301-bot/iam3301-bot.github.io/issues)

</div>
