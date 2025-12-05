# 🚀 GameBox 后端设置指南

## 📋 目录

1. [概述](#概述)
2. [Supabase 云数据库设置](#supabase-云数据库设置)
3. [数据库表结构](#数据库表结构)
4. [邮件服务配置](#邮件服务配置)
5. [Steam API 配置](#steam-api-配置)
6. [功能测试](#功能测试)
7. [故障排除](#故障排除)

---

## 📖 概述

GameBox 支持两种运行模式：

1. **本地存储模式（LocalStorage）** - 无需配置，数据仅存储在浏览器本地
2. **云数据库模式（Supabase）** - 配置后支持多用户、实时同步、跨设备访问

本文档将指导你配置 **Supabase 云数据库模式**，实现真实的社区功能。

### 🎯 你将获得的功能

- ✅ 多用户注册/登录系统
- ✅ 真实的社区帖子发布/评论/点赞
- ✅ 实时在线用户统计
- ✅ 邮箱验证码功能
- ✅ Steam/PSN/Xbox 平台绑定
- ✅ 跨设备数据同步
- ✅ 实时数据更新推送

---

## 🗄️ Supabase 云数据库设置

### 第 1 步：创建 Supabase 账户

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 **Start your project** 注册账户（支持 GitHub 登录）
3. 免费版配额：
   - 500MB 数据库存储
   - 50,000 月活用户
   - 2GB 带宽
   - 无限 API 请求

### 第 2 步：创建新项目

1. 登录后点击 **New Project**
2. 填写项目信息：
   - **Name**: `gamebox-community`（或你喜欢的名称）
   - **Database Password**: 设置一个强密码（**请妥善保存**）
   - **Region**: 选择离你最近的区域（如 Southeast Asia - Singapore）
   - **Pricing Plan**: 选择 **Free**
3. 点击 **Create new project**，等待 1-2 分钟初始化完成

### 第 3 步：获取 API 密钥

1. 项目创建完成后，进入项目仪表板
2. 点击左侧菜单 **Settings** → **API**
3. 找到以下两个值：
   - **Project URL**: 格式为 `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: 一长串 JWT token（以 `eyJ` 开头）
4. **重要**: 复制这两个值，我们接下来要用

### 第 4 步：配置项目

打开 `supabase-config.js` 文件，找到以下配置：

```javascript
const SUPABASE_CONFIG = {
  // 替换为你的 Supabase Project URL
  url: 'https://xxxxxxxxxxxxx.supabase.co',
  
  // 替换为你的 Supabase anon/public key
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  
  // 启用 Supabase
  enabled: true,
};
```

将复制的 `Project URL` 和 `anon public key` 粘贴到对应位置。

---

## 📊 数据库表结构

### 第 5 步：创建数据库表

1. 在 Supabase 仪表板，点击左侧菜单 **SQL Editor**
2. 点击 **New Query** 创建新查询
3. 复制以下 SQL 代码并执行：

```sql
-- =============================================
-- GameBox 社区数据表 SQL
-- =============================================

-- 1. 社区帖子表
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '游客',
  avatar TEXT DEFAULT '👤',
  game TEXT DEFAULT '未分类',
  board TEXT DEFAULT 'general',
  replies INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT TRUE,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 帖子评论表
CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL DEFAULT '游客',
  avatar TEXT DEFAULT '👤',
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 点赞记录表
CREATE TABLE IF NOT EXISTS community_likes (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL, -- 'post' 或 'comment'
  target_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(target_type, target_id, user_id)
);

-- 4. 社区统计表
CREATE TABLE IF NOT EXISTS community_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_members INTEGER DEFAULT 5678,
  total_replies INTEGER DEFAULT 12345,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  last_update TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 在线用户追踪表
CREATE TABLE IF NOT EXISTS online_users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 活动日志表
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  user_id TEXT,
  details JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 用户平台绑定表
CREATE TABLE IF NOT EXISTS user_platform_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_posts_board ON community_posts(board);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON community_likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_online_users_active ON online_users(last_active);
CREATE INDEX IF NOT EXISTS idx_platform_bindings_user ON user_platform_bindings(user_id);

-- 启用行级安全策略 (RLS)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_platform_bindings ENABLE ROW LEVEL SECURITY;

-- 允许公开读取
CREATE POLICY "允许公开读取帖子" ON community_posts FOR SELECT USING (true);
CREATE POLICY "允许公开读取评论" ON community_comments FOR SELECT USING (true);
CREATE POLICY "允许公开读取统计" ON community_stats FOR SELECT USING (true);
CREATE POLICY "允许公开读取在线用户" ON online_users FOR SELECT USING (true);

-- 允许插入（可选择限制为已认证用户）
CREATE POLICY "允许创建帖子" ON community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "允许创建评论" ON community_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "允许点赞" ON community_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "允许更新在线状态" ON online_users FOR ALL USING (true);
CREATE POLICY "允许记录活动" ON activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "允许管理平台绑定" ON user_platform_bindings FOR ALL USING (true);

-- 允许更新
CREATE POLICY "允许更新帖子" ON community_posts FOR UPDATE USING (true);
CREATE POLICY "允许更新统计" ON community_stats FOR UPDATE USING (true);
CREATE POLICY "允许删除点赞" ON community_likes FOR DELETE USING (true);

-- 插入初始统计数据
INSERT INTO community_stats (id, total_members, total_replies, start_time)
VALUES (1, 5678, 12345, NOW())
ON CONFLICT (id) DO NOTHING;

-- 创建更新时间自动更新函数
CREATE OR REPLACE FUNCTION update_community_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER trigger_update_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_community_updated_at();

CREATE TRIGGER trigger_update_bindings_updated_at
  BEFORE UPDATE ON user_platform_bindings
  FOR EACH ROW
  EXECUTE FUNCTION update_community_updated_at();
```

4. 点击 **Run** 执行 SQL
5. 等待执行完成（应该显示 `Success. No rows returned`）

### 第 6 步：验证表创建

1. 点击左侧菜单 **Table Editor**
2. 你应该能看到以下表：
   - `community_posts`
   - `community_comments`
   - `community_likes`
   - `community_stats`
   - `online_users`
   - `activity_logs`
   - `user_platform_bindings`

如果看到这些表，说明数据库设置成功！✅

---

## 📧 邮件服务配置

GameBox 使用 **EmailJS** 发送验证码邮件（免费 200 封/月）。

### 配置 EmailJS

1. 访问 [https://www.emailjs.com](https://www.emailjs.com) 并注册
2. 进入 **Email Services** → 点击 **Add New Service**
3. 选择你的邮件服务商（推荐 Gmail）：
   - 按照指引连接你的邮箱
   - 记下 **Service ID**（如 `service_abc123`）
4. 进入 **Email Templates** → 点击 **Create New Template**
5. 创建验证码模板：
   - **Subject**: `GameBox 游盒 - 邮箱验证码`
   - **Content**: 
     ```
     您好，

     您的验证码是: {{verification_code}}

     验证码有效期为 5 分钟，请尽快完成验证。

     如果这不是您的操作，请忽略此邮件。

     GameBox 游盒团队
     ```
   - 使用变量：`{{to_email}}`, `{{verification_code}}`, `{{app_name}}`
   - 记下 **Template ID**（如 `template_xyz789`）
6. 进入 **Account** → 复制你的 **Public Key**（如 `user_ABC123XYZ`）

### 更新配置文件

编辑 `supabase-config.js`，找到 EmailJS 配置：

```javascript
const EMAIL_SERVICE_CONFIG = {
  provider: 'emailjs',
  
  emailjs: {
    serviceId: 'service_abc123',     // 你的 Service ID
    templateId: 'template_xyz789',   // 你的 Template ID
    publicKey: 'user_ABC123XYZ',     // 你的 Public Key
    enabled: true
  }
};
```

---

## 🎮 Steam API 配置

如果你想启用 Steam 平台绑定功能：

### 申请 Steam Web API Key

1. 访问 [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)
2. 登录你的 Steam 账号
3. 填写：
   - **Domain Name**: `localhost`（或你的域名）
   - 同意条款
4. 复制生成的 32 位 API Key

### 更新配置

编辑 `supabase-config.js`：

```javascript
const STEAM_CONFIG = {
  apiKey: '你的32位Steam API Key',
  enabled: true,
};
```

**注意**: 如果不配置 Steam API，用户仍然可以手动输入 Steam ID 进行绑定，但无法自动拉取游戏库。

---

## 🧪 功能测试

### 测试清单

完成配置后，请按以下步骤测试：

#### 1. 测试数据库连接

1. 打开浏览器控制台（F12）
2. 访问你的网站
3. 检查控制台是否显示：
   ```
   ✅ 社区数据服务: 已连接 Supabase 数据库
   ```

#### 2. 测试社区功能

1. 访问社区页面 `community.html`
2. 检查页面右下角是否显示 `🌐 Supabase 云数据库`
3. 点击 **发布新帖** 按钮
4. 填写标题和内容，提交
5. 刷新页面，检查帖子是否保存成功

#### 3. 测试邮箱验证

1. 访问注册页面
2. 输入邮箱，点击发送验证码
3. 检查邮箱是否收到验证码
4. 输入验证码完成注册

#### 4. 测试 Steam 绑定

1. 登录后访问用户中心 `profile.html`
2. 在 Steam 绑定区域输入你的 Steam ID
3. 点击同步，检查是否成功拉取游戏库

### 预期结果

✅ 所有功能正常工作  
✅ 数据在刷新后依然存在  
✅ 多个用户可以同时发帖/评论  
✅ 邮箱能收到验证码  

---

## 🛠️ 故障排除

### 问题 1: 控制台显示 "Supabase 未配置"

**解决方案**:
- 检查 `supabase-config.js` 中的 `enabled` 是否为 `true`
- 确认 `url` 和 `anonKey` 已正确配置
- 清除浏览器缓存并刷新

### 问题 2: SQL 执行失败

**解决方案**:
- 确保在 Supabase SQL Editor 中执行
- 检查是否有语法错误
- 如果表已存在，可以删除后重新创建：
  ```sql
  DROP TABLE IF EXISTS community_posts CASCADE;
  -- 然后重新执行创建表的 SQL
  ```

### 问题 3: 帖子发布后消失

**解决方案**:
- 打开浏览器控制台查看错误信息
- 检查 Supabase 的 RLS 策略是否正确
- 在 Supabase Dashboard → Authentication → Policies 检查权限

### 问题 4: 邮箱收不到验证码

**解决方案**:
- 检查 EmailJS 配置是否正确
- 查看 EmailJS Dashboard 的发送记录
- 检查垃圾邮件文件夹
- 确认邮箱服务商未屏蔽 EmailJS

### 问题 5: CORS 错误

**解决方案**:
- Supabase API 默认允许所有来源，无需配置 CORS
- 如果使用自定义域名，在 Supabase Dashboard → Settings → API → CORS 添加你的域名

---

## 📚 进阶配置

### 启用实时订阅

如果你希望帖子发布后立即显示给所有在线用户：

1. 在 Supabase Dashboard → Database → Replication
2. 启用 `community_posts` 表的 Realtime
3. 代码已自动处理实时订阅，无需额外配置

### 备份数据库

建议定期备份：

1. Supabase Dashboard → Database → Backups
2. 免费版提供 7 天自动备份
3. 可手动导出 SQL 文件

### 监控和日志

1. Supabase Dashboard → Logs
2. 可查看 API 请求、错误、性能指标

---

## 🎉 完成！

恭喜你完成了 GameBox 后端设置！现在你拥有：

- ✅ 云端数据库（多用户支持）
- ✅ 实时社区功能
- ✅ 邮箱验证系统
- ✅ Steam 平台集成
- ✅ 跨设备数据同步

### 下一步

- 邀请用户注册测试
- 发布第一篇社区帖子
- 绑定你的 Steam 账号
- 自定义样式和功能

### 需要帮助？

- 📖 [Supabase 官方文档](https://supabase.com/docs)
- 📖 [EmailJS 官方文档](https://www.emailjs.com/docs/)
- 📖 [Steam Web API 文档](https://steamcommunity.com/dev)

祝你使用愉快！🎮✨
