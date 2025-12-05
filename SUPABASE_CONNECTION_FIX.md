# 🔧 Supabase 连接问题诊断指南

## ❌ 问题：显示"本地存储数据"

当社区页面右下角显示 **"本地存储数据"** 徽章时，说明系统未连接到 Supabase 云数据库。

**影响**：
- ❌ 每个用户只能看到自己浏览器中的数据
- ❌ 无法实现多用户共享
- ❌ 帖子、评论只保存在本地浏览器
- ❌ 在线人数统计不准确

---

## 🔍 诊断步骤

### 步骤1：打开浏览器控制台

1. 访问社区页面：https://iam3301-bot.github.io/community.html
2. 按 **F12** 打开开发者工具
3. 切换到 **Console** 标签页
4. 查看日志信息

---

### 步骤2：识别问题类型

根据控制台日志判断问题：

#### 🔴 情况A：Supabase SDK 未加载

**日志提示**：
```
❌ Supabase SDK 未加载！
请确保 community.html 包含：
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

**原因**：HTML 文件缺少 Supabase JavaScript SDK

**解决方法**：
检查 `community.html` 是否包含以下代码：
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
```

---

#### 🔴 情况B：配置文件未加载

**日志提示**：
```
❌ SUPABASE_CONFIG 未定义！
请确保 community.html 包含：
<script src="supabase-config.js"></script>
```

**原因**：`supabase-config.js` 文件未加载或路径错误

**解决方法**：
1. 确认 `supabase-config.js` 文件存在于项目根目录
2. 检查文件路径是否正确

---

#### 🔴 情况C：Supabase 未启用

**日志提示**：
```
⚠️ Supabase 未启用（SUPABASE_CONFIG.enabled = false）
ℹ️ 社区数据服务: 使用本地存储模式
```

**原因**：配置中 `enabled: false`

**解决方法**：
编辑 `supabase-config.js`，将 `enabled` 改为 `true`：
```javascript
const SUPABASE_CONFIG = {
  url: 'https://gybgiqyyltckgxbdtzwu.supabase.co',
  anonKey: 'your-anon-key-here',
  enabled: true,  // ← 确保这里是 true
};
```

---

#### 🔴 情况D：数据库表不存在 ⚠️ **最常见**

**日志提示**：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 数据库表不存在！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 请按以下步骤修复：

1. 访问 Supabase 控制台:
   https://supabase.com/dashboard/project/gybgiqyyltckgxbdtzwu

2. 点击左侧菜单 "SQL Editor"

3. 点击 "New Query"

4. 复制项目中的 supabase-init.sql 文件内容

5. 粘贴到 SQL Editor 并点击 "Run"

6. 等待执行完成后，刷新此页面
```

**原因**：Supabase 数据库中缺少必要的数据表

**✅ 解决方法（详细步骤）**：

##### 第1步：登录 Supabase

1. 访问：https://supabase.com
2. 点击 **Sign In** 登录
3. 进入您的项目

##### 第2步：打开 SQL Editor

1. 在左侧导航菜单中找到 **SQL Editor**（数据库图标 🔧）
2. 点击进入 SQL 编辑器

##### 第3步：创建新查询

1. 点击右上角绿色按钮 **New Query**
2. 打开一个空白的 SQL 编辑窗口

##### 第4步：复制 SQL 脚本

**方法1：从 GitHub 复制**
```
访问：https://github.com/iam3301-bot/iam3301-bot.github.io/blob/main/supabase-init.sql
点击 "Copy raw file" 按钮
```

**方法2：从本地文件复制**
```
打开项目目录中的 supabase-init.sql
全选（Ctrl+A）并复制（Ctrl+C）
```

##### 第5步：粘贴并执行

1. 在 SQL Editor 中粘贴脚本（Ctrl+V）
2. 点击右下角绿色按钮 **Run**
3. 等待执行完成（约10-20秒）
4. 看到 "Success" 提示

##### 第6步：验证表已创建

1. 点击左侧菜单 **Table Editor**
2. 应该看到以下8个新表：
   - ✅ `user_profiles`
   - ✅ `community_posts`
   - ✅ `community_comments`
   - ✅ `community_likes`
   - ✅ `community_stats`
   - ✅ `online_users`
   - ✅ `activity_logs`
   - ✅ `user_platform_bindings`

##### 第7步：刷新社区页面

1. 返回社区页面
2. 按 **Ctrl+Shift+R**（或 Cmd+Shift+R）强制刷新
3. 右下角徽章应该变成绿色的 **"Supabase 云数据库"**
4. 控制台显示：
   ```
   ✅ 社区数据服务: 已连接 Supabase 数据库
   ✅ community_posts 表存在
   ✅ user_profiles 表存在
   ✅ 数据库表检查通过
   ```

---

#### 🔴 情况E：权限错误

**日志提示**：
```
❌ 数据库权限错误！
错误代码: PGRST301
请检查 Supabase RLS 策略是否正确设置
```

**原因**：Supabase Row Level Security (RLS) 策略配置错误

**解决方法**：

在 Supabase SQL Editor 执行：
```sql
-- 禁用所有表的 RLS（仅用于测试）
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE online_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_platform_bindings DISABLE ROW LEVEL SECURITY;
```

或者重新执行 `supabase-init.sql` 中的 RLS 策略部分。

---

#### 🔴 情况F：URL 或 Key 错误

**日志提示**：
```
❌ Supabase URL 或 anonKey 未配置！
当前配置：
  url: undefined
  anonKey: 未设置
```

**原因**：配置文件中的 URL 或 Key 为空或错误

**解决方法**：

1. 访问 Supabase 项目 Settings → API
2. 复制以下信息：
   - **Project URL**：`https://xxxxx.supabase.co`
   - **anon public key**：一长串 JWT token

3. 更新 `supabase-config.js`：
```javascript
const SUPABASE_CONFIG = {
  url: 'https://gybgiqyyltckgxbdtzwu.supabase.co',  // 替换为您的 URL
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',  // 替换为您的 Key
  enabled: true,
};
```

---

## 🧪 测试连接

完成修复后，进行以下测试：

### 测试1：检查控制台日志

刷新页面，控制台应显示：
```
✅ Supabase 客户端已创建
🔍 正在检查数据库表...
🔍 检查 community_posts 表...
✅ community_posts 表存在
🔍 检查 user_profiles 表...
✅ user_profiles 表存在
✅ 数据库表检查通过
✅ 社区数据服务: 已连接 Supabase 数据库
✅ 已订阅社区实时更新
💓 心跳机制已启动，每30秒更新在线状态
✅ 社区页面初始化完成 [数据源: Supabase 云数据库 ✅]
```

### 测试2：检查页面徽章

右下角应显示：
```
🟢 Supabase 云数据库
```
（绿色背景，青色边框）

### 测试3：发布测试帖子

1. 点击 "发布新帖" 按钮
2. 输入标题和内容
3. 发布成功后，帖子应该出现在列表中

### 测试4：多设备验证

1. 在电脑上发布一个帖子
2. 在手机上访问社区页面
3. 应该能看到刚才发布的帖子

如果看到了，说明多用户共享功能正常！✅

---

## 📊 数据库查询验证

在 Supabase SQL Editor 执行以下查询验证数据：

### 查询1：查看所有帖子

```sql
SELECT 
  id,
  title,
  author,
  created_at
FROM community_posts
ORDER BY created_at DESC
LIMIT 10;
```

### 查询2：查看注册用户

```sql
SELECT 
  id,
  username,
  created_at,
  last_login_at
FROM user_profiles
ORDER BY created_at DESC;
```

### 查询3：查看在线用户

```sql
SELECT 
  user_id,
  username,
  last_active,
  NOW() - last_active as offline_duration
FROM online_users
WHERE last_active > NOW() - INTERVAL '5 minutes'
ORDER BY last_active DESC;
```

### 查询4：统计数据

```sql
SELECT 
  (SELECT COUNT(*) FROM community_posts) as total_posts,
  (SELECT COUNT(*) FROM user_profiles) as total_members,
  (SELECT COUNT(*) FROM community_comments) as total_replies,
  (SELECT COUNT(*) FROM online_users 
   WHERE last_active > NOW() - INTERVAL '5 minutes') as online_users;
```

---

## 🔄 快速修复流程图

```
显示"本地存储数据"
         ↓
打开控制台（F12）
         ↓
查看错误日志
         ↓
    ┌────┴────┐
    ↓         ↓
SDK未加载   配置错误
    ↓         ↓
检查HTML   检查config.js
    ↓         ↓
    └────┬────┘
         ↓
    数据库表不存在 ← 最常见
         ↓
访问 Supabase 控制台
         ↓
SQL Editor → New Query
         ↓
粘贴 supabase-init.sql
         ↓
点击 Run 执行
         ↓
等待 10-20 秒
         ↓
Table Editor 验证
         ↓
刷新社区页面
         ↓
显示"Supabase 云数据库" ✅
```

---

## 💡 常见问题

### Q1：执行 SQL 脚本时出错？

**错误**：`ERROR: syntax error at or near "..."`

**解决**：
1. 确保复制了完整的 SQL 脚本
2. 清空编辑器重新粘贴
3. 检查是否有特殊字符被转义

---

### Q2：表创建成功但仍显示本地存储？

**可能原因**：
1. 浏览器缓存未清理
2. RLS 策略阻止访问

**解决**：
```javascript
// 在控制台执行
localStorage.clear();
sessionStorage.clear();
location.reload();
```

或者禁用 RLS：
```sql
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
```

---

### Q3：如何完全重置数据库？

**警告**：这将删除所有数据！

```sql
-- 删除所有表
DROP TABLE IF EXISTS community_likes CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS community_stats CASCADE;
DROP TABLE IF EXISTS online_users CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS user_platform_bindings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 然后重新执行 supabase-init.sql
```

---

### Q4：连接成功但数据不同步？

**检查**：
1. 确认其他设备也连接到 Supabase
2. 检查网络连接
3. 查看控制台是否有实时订阅错误

**验证实时订阅**：
```javascript
// 在控制台执行
console.log('实时订阅状态:', window._communityRealtimeSubscription);
```

---

## 📞 获取帮助

如果按照上述步骤仍无法解决，请：

1. **截图控制台日志**（完整的错误信息）
2. **截图 Supabase Table Editor**（显示已创建的表）
3. **提供配置信息**（URL 的前几位字符）
4. **描述操作步骤**

---

## ✅ 成功标志

修复成功后，您将看到：

**界面**：
- ✅ 右下角显示 "🟢 Supabase 云数据库"（绿色）
- ✅ 在线人数显示真实数值（不是 0）
- ✅ 社区成员数显示真实注册用户数

**控制台**：
- ✅ `✅ 社区数据服务: 已连接 Supabase 数据库`
- ✅ `✅ 数据库表检查通过`
- ✅ `💓 心跳更新成功`
- ✅ `🟢 真实在线用户数: 1`

**功能**：
- ✅ 多设备可以看到相同的帖子
- ✅ 发布的帖子立即同步到所有用户
- ✅ 在线人数实时更新
- ✅ 评论和点赞实时同步

---

**文档版本**：v1.0  
**更新时间**：2025-12-05  
**适用于**：GameBox 社区功能
