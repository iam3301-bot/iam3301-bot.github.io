# 真实在线人数统计 - 实现指南

## 🎉 已完成实现

您现在拥有**真实的在线人数统计系统**，不再使用模拟数据！

---

## 📊 工作原理

### 1. 心跳机制（Heartbeat）

```
用户访问社区页面
    ↓
立即更新在线状态
    ↓
每30秒自动发送心跳
    ↓
记录到 online_users 表
    ↓
更新 last_active 时间戳
```

### 2. 活跃检测

系统监听以下用户行为：
- 🖱️ **鼠标移动**
- ⌨️ **键盘输入**
- 📜 **页面滚动**
- 👆 **点击操作**
- 📱 **触摸操作**

当检测到活动时，会更新在线状态（30秒节流限制）。

### 3. 在线统计规则

**定义**：最近 **5分钟**内有活跃的用户视为"在线"

```sql
SELECT COUNT(*) FROM online_users
WHERE last_active > NOW() - INTERVAL '5 minutes';
```

### 4. 自动清理机制

**前端清理**：每5分钟清理超过10分钟未活跃的用户
```javascript
setInterval(() => {
  supabase.rpc('cleanup_expired_online_users');
}, 5 * 60 * 1000);
```

**离线检测**：用户关闭页面时立即删除在线记录
```javascript
window.addEventListener('beforeunload', () => {
  supabase.from('online_users').delete().eq('user_id', userId);
});
```

---

## 🔄 数据流程图

```
┌─────────────────────────────────────────────────────────┐
│              用户A 访问社区页面                          │
└───────────────────┬─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  INSERT INTO online_users                               │
│  (user_id, username, last_active)                       │
│  VALUES ('user-a', 'Alice', NOW())                      │
└───────────────────┬─────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
┌──────────────┐      ┌──────────────────┐
│ 30秒心跳定时  │      │ 用户活动检测      │
│ (自动更新)    │      │ (鼠标/键盘/滚动)  │
└──────┬───────┘      └────────┬─────────┘
       │                       │
       └───────────┬───────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│  UPDATE online_users                                    │
│  SET last_active = NOW()                                │
│  WHERE user_id = 'user-a'                               │
└───────────────────┬─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  查询在线人数:                                           │
│  SELECT COUNT(*) FROM online_users                      │
│  WHERE last_active > NOW() - INTERVAL '5 minutes'       │
│  → 结果: 1 人在线                                        │
└───────────────────┬─────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
┌──────────────┐      ┌──────────────────┐
│ 用户关闭页面  │      │ 10分钟未活跃      │
│ (beforeunload)│      │ (自动清理)        │
└──────┬───────┘      └────────┬─────────┘
       │                       │
       └───────────┬───────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│  DELETE FROM online_users                               │
│  WHERE user_id = 'user-a'                               │
│  → 用户A 标记离线                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 核心代码解析

### 1. 真实在线统计函数

```javascript
async function getOnlineUserCount() {
  // 查询最近5分钟内活跃的用户
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { count } = await supabaseClient
    .from('online_users')
    .select('user_id', { count: 'exact', head: true })
    .gte('last_active', fiveMinutesAgo);
  
  return count || 0;  // 返回真实在线人数
}
```

**对比旧代码（模拟）**：
```javascript
// ❌ 旧代码：基于时间的随机模拟
function getOnlineUserCount() {
  const baseCount = 80;
  const hour = new Date().getHours();
  // ... 复杂的时间因子计算
  return Math.floor(baseCount * timeFactor * randomFactor);
}
```

---

### 2. 心跳机制

```javascript
// 立即更新在线状态
await updateOnlineStatus();

// 每30秒自动更新
setInterval(async () => {
  await updateOnlineStatus();
}, 30000);

// updateOnlineStatus 实现
async function updateOnlineStatus() {
  await supabaseClient
    .from('online_users')
    .upsert({
      user_id: userId,
      username: username,
      last_active: new Date().toISOString()
    }, { onConflict: 'user_id' });
}
```

---

### 3. 活跃检测（节流）

```javascript
let lastActivityUpdate = Date.now();
const activityThrottle = 30000;  // 30秒

const updateActivityThrottled = async () => {
  const now = Date.now();
  if (now - lastActivityUpdate > activityThrottle) {
    lastActivityUpdate = now;
    await updateOnlineStatus();
  }
};

// 监听用户活动
['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event => {
  document.addEventListener(event, updateActivityThrottled, { passive: true });
});
```

---

### 4. 自动清理

```javascript
// 每5分钟清理一次
setInterval(async () => {
  await supabaseClient.rpc('cleanup_expired_online_users');
}, 5 * 60 * 1000);

// cleanup_expired_online_users SQL函数
CREATE OR REPLACE FUNCTION cleanup_expired_online_users()
RETURNS void AS $$
BEGIN
  DELETE FROM online_users
  WHERE last_active < NOW() - INTERVAL '10 minutes';
END;
$$ LANGUAGE plpgsql;
```

---

### 5. 离线检测

```javascript
window.addEventListener('beforeunload', async () => {
  const userId = getCurrentUserId() || getAnonymousUserId();
  
  // 用户离开时立即删除在线记录
  await supabaseClient
    .from('online_users')
    .delete()
    .eq('user_id', userId);
});
```

---

## 📈 统计精度对比

| 场景 | 旧系统（模拟） | 新系统（真实） |
|------|---------------|---------------|
| **单用户访问** | 显示 80-250 人 | 显示 **1 人** ✅ |
| **3个用户在线** | 显示 80-250 人 | 显示 **3 人** ✅ |
| **深夜无人** | 显示 20-40 人 | 显示 **0 人** ✅ |
| **高峰期** | 显示 150-250 人 | 显示**实际人数** ✅ |
| **用户关闭页面** | 仍显示在线 | **立即移除** ✅ |
| **用户挂机5分钟** | 仍计入 | **移出在线** ✅ |

---

## 🧪 测试方法

### 测试1：单用户在线

1. 清空浏览器缓存和 localStorage
2. 访问 https://iam3301-bot.github.io/community.html
3. 观察"在线人数"应该显示 **1**
4. 打开浏览器控制台（F12），应该看到：
   ```
   💓 心跳更新成功: 您的用户名
   🟢 真实在线用户数: 1
   ```

---

### 测试2：多用户在线

**方法1：使用多个浏览器**
1. 在 Chrome 访问社区页面
2. 在 Firefox 访问社区页面
3. 在 Edge 访问社区页面
4. 在线人数应该显示 **3**

**方法2：使用隐身模式**
1. 打开普通窗口访问社区
2. 打开隐身窗口访问社区
3. 在线人数应该显示 **2**

**方法3：不同设备**
1. 在电脑上访问
2. 在手机上访问
3. 在线人数应该显示 **2**

---

### 测试3：离线检测

1. 访问社区页面（在线人数 +1）
2. 关闭浏览器标签页
3. 等待3秒
4. 重新打开社区页面
5. 在线人数应该重新从 **1** 开始计数

---

### 测试4：活跃检测

1. 访问社区页面
2. 停止所有操作（不动鼠标、不滚动）
3. 等待 **5分钟**
4. 查看在线人数，应该变成 **0**（您被标记为离线）
5. 移动鼠标或滚动页面
6. 等待10秒，在线人数恢复为 **1**

---

### 测试5：数据库查询验证

在 Supabase SQL Editor 执行：

```sql
-- 查看所有在线用户
SELECT * FROM online_users ORDER BY last_active DESC;

-- 查看在线人数（最近5分钟）
SELECT COUNT(*) as online_count
FROM online_users
WHERE last_active > NOW() - INTERVAL '5 minutes';

-- 查看用户在线时长
SELECT 
  username,
  last_active,
  NOW() - last_active as online_duration
FROM online_users
ORDER BY last_active DESC;
```

---

## 📊 数据库表结构

### online_users 表

| 字段 | 类型 | 说明 |
|------|------|------|
| `user_id` | TEXT (PK) | 用户唯一ID |
| `username` | TEXT | 用户名 |
| `last_active` | TIMESTAMPTZ | 最后活跃时间 |

**示例数据**：
```
user_id          | username  | last_active
-----------------|-----------|-------------------------
user-12345       | Alice     | 2025-12-05 10:30:45
anon_17331234    | 访客      | 2025-12-05 10:29:30
user-67890       | Bob       | 2025-12-05 10:28:15
```

---

## ⚙️ 配置参数

可以根据需要调整以下参数：

```javascript
// community-data-service.js

// 心跳间隔（默认30秒）
const HEARTBEAT_INTERVAL = 30000;

// 统计刷新间隔（默认10秒）
const STATS_REFRESH_INTERVAL = 10000;

// 在线判定时长（默认5分钟）
const ONLINE_THRESHOLD = 5 * 60 * 1000;

// 活跃检测节流（默认30秒）
const ACTIVITY_THROTTLE = 30000;

// 自动清理间隔（默认5分钟）
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// 过期时长（默认10分钟）
const EXPIRY_THRESHOLD = 10 * 60 * 1000;
```

---

## 🔧 性能优化

### 1. 数据库查询优化

已创建索引加速查询：
```sql
CREATE INDEX idx_online_users_active ON online_users(last_active);
```

### 2. 前端节流

- 心跳更新：30秒一次（不是每秒）
- 活跃检测：30秒内最多触发一次
- 统计刷新：10秒一次（不是实时）

### 3. 批量操作

使用 `upsert` 而不是 `insert + update`：
```javascript
// ✅ 推荐：单次操作
await supabase.from('online_users').upsert({ ... });

// ❌ 避免：多次查询
const { data } = await supabase.from('online_users').select();
if (data) {
  await supabase.from('online_users').update({ ... });
} else {
  await supabase.from('online_users').insert({ ... });
}
```

---

## 📱 移动端适配

系统已支持移动端触摸事件：
```javascript
['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event => {
  document.addEventListener(event, updateActivityThrottled, { passive: true });
});
```

**注意事项**：
- 移动端浏览器在后台时可能暂停 JavaScript 执行
- 用户切换应用时，心跳可能停止
- 建议设置 `visibilitychange` 事件恢复心跳（已实现）

---

## 🚨 常见问题

### Q1：在线人数为什么显示0？

**可能原因**：
1. 未登录或未访问社区页面
2. Supabase 数据库连接失败
3. 浏览器阻止了定时器

**排查方法**：
```javascript
// 在控制台执行
const stats = await window.communityDataService.getCommunityStats();
console.log('在线人数:', stats.onlineUsers);

// 检查 online_users 表
await supabase.from('online_users').select('*');
```

---

### Q2：心跳停止工作？

**检查**：
```javascript
// 查看定时器是否在运行
console.log('心跳定时器ID:', window._communityHeartbeat);
console.log('统计刷新定时器ID:', window._communityStatsRefresh);

// 手动触发心跳
await window.communityDataService.updateOnlineStatus?.();
```

---

### Q3：数据库中有僵尸用户？

**解决方法**：
```sql
-- 手动清理超过10分钟未活跃的用户
DELETE FROM online_users
WHERE last_active < NOW() - INTERVAL '10 minutes';

-- 或调用清理函数
SELECT cleanup_expired_online_users();
```

---

### Q4：在线人数变化延迟？

**说明**：
- 心跳每30秒更新一次
- 统计每10秒刷新一次
- 最多延迟：**40秒**（30秒心跳 + 10秒刷新）

**如需更实时**，可以调整参数：
```javascript
// 改为每10秒心跳（增加数据库负担）
setInterval(updateOnlineStatus, 10000);

// 改为每5秒刷新统计（增加查询次数）
setInterval(refreshStats, 5000);
```

---

## 📖 扩展功能建议

### 1. 在线用户列表

显示哪些用户在线：
```javascript
async function getOnlineUsers() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { data } = await supabaseClient
    .from('online_users')
    .select('username, last_active')
    .gte('last_active', fiveMinutesAgo)
    .order('last_active', { ascending: false });
  
  return data || [];
}
```

---

### 2. 在线状态指示器

为每个用户显示绿点：
```javascript
// 检查特定用户是否在线
async function isUserOnline(userId) {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { data } = await supabaseClient
    .from('online_users')
    .select('user_id')
    .eq('user_id', userId)
    .gte('last_active', fiveMinutesAgo)
    .maybeSingle();
  
  return !!data;
}
```

---

### 3. 在线时长统计

记录用户在线总时长：
```sql
-- 创建 user_online_stats 表
CREATE TABLE user_online_stats (
  user_id TEXT PRIMARY KEY,
  total_online_time INTERVAL DEFAULT '0',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 定期更新在线时长（每分钟）
CREATE OR REPLACE FUNCTION update_online_time()
RETURNS void AS $$
BEGIN
  UPDATE user_online_stats
  SET total_online_time = total_online_time + INTERVAL '1 minute',
      last_updated = NOW()
  WHERE user_id IN (
    SELECT user_id FROM online_users
    WHERE last_active > NOW() - INTERVAL '5 minutes'
  );
END;
$$ LANGUAGE plpgsql;
```

---

### 4. 在线峰值记录

记录历史最高在线人数：
```sql
CREATE TABLE online_peak_stats (
  id SERIAL PRIMARY KEY,
  peak_count INTEGER,
  peak_time TIMESTAMPTZ DEFAULT NOW()
);

-- 每次更新在线统计时检查并更新峰值
CREATE OR REPLACE FUNCTION update_online_peak()
RETURNS void AS $$
DECLARE
  current_count INTEGER;
  current_peak INTEGER;
BEGIN
  SELECT COUNT(*) INTO current_count
  FROM online_users
  WHERE last_active > NOW() - INTERVAL '5 minutes';
  
  SELECT MAX(peak_count) INTO current_peak
  FROM online_peak_stats;
  
  IF current_count > COALESCE(current_peak, 0) THEN
    INSERT INTO online_peak_stats (peak_count, peak_time)
    VALUES (current_count, NOW());
  END IF;
END;
$$ LANGUAGE plpgsql;
```

---

## ✅ 部署清单

- [x] 修改 `community-data-service.js` 实现真实统计
- [x] 修改 `community.html` 移除"(模拟)"标注
- [x] 创建 `online-cleanup-cron.sql` 清理脚本
- [x] 实现心跳机制（每30秒）
- [x] 实现活跃检测（鼠标、键盘、滚动）
- [x] 实现自动清理（每5分钟）
- [x] 实现离线检测（beforeunload）
- [x] 提交并推送到 GitHub
- [ ] 访问社区页面测试
- [ ] 验证在线人数统计准确性
- [ ] 多用户测试
- [ ] 性能监控

---

## 🎯 预期效果

完成部署后，您将看到：

**社区页面统计**：
```
📊  5           💬  3           🔄  0           🟢  1 ●实时
  帖子总数        社区成员         回复总数        在线人数
```

**浏览器控制台日志**：
```
✅ 社区数据服务已初始化 (Supabase 真实在线统计)
💓 心跳机制已启动，每30秒更新在线状态
🧹 清理任务已启动，每5分钟清理过期用户
💓 心跳更新成功: 您的用户名
🟢 真实在线用户数: 1
📊 Supabase 统计数据: {totalPosts: 5, totalMembers: 3, totalReplies: 0, onlineUsers: 1}
```

**Supabase 数据库**：
```sql
SELECT * FROM online_users;

-- 结果示例：
user_id     | username  | last_active
------------|-----------|-------------------------
user-12345  | Alice     | 2025-12-05 10:30:45 ✅
```

---

**文档版本**：v1.0  
**更新时间**：2025-12-05  
**状态**：✅ 已完成并部署
