# GameBox 第三方登录配置指南

## 📋 概述

GameBox 支持以下第三方登录方式：
- ✅ **Google OAuth 2.0** - 最流行的OAuth提供商
- ✅ **GitHub OAuth** - 开发者友好的OAuth服务
- ✅ **微信开放平台** - 中国用户首选
- ✅ **QQ互联** - 腾讯QQ登录集成

---

## 🔵 Google OAuth 配置

### 步骤 1: 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **Google+ API**

### 步骤 2: 配置 OAuth 同意屏幕

1. 在左侧菜单选择 **APIs & Services** → **OAuth consent screen**
2. 选择用户类型（建议选择"外部"）
3. 填写应用信息：
   - 应用名称: `GameBox 游盒`
   - 用户支持电子邮件: 您的邮箱
   - 授权域名: 您的域名（例如: `gamebox.com`）
4. 添加授权范围:
   - `openid`
   - `profile`
   - `email`

### 步骤 3: 创建 OAuth 客户端 ID

1. 选择 **Credentials** → **Create Credentials** → **OAuth client ID**
2. 应用类型: **Web application**
3. 名称: `GameBox Web App`
4. 授权重定向 URI:
   ```
   http://localhost:3000/oauth-callback.html
   https://yourdomain.com/oauth-callback.html
   ```
5. 点击创建，获取 **Client ID**

### 步骤 4: 更新配置文件

编辑 `oauth-providers.js`:
```javascript
google: {
  enabled: true,
  clientId: '您的_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  // ... 其他配置保持不变
}
```

---

## ⚫ GitHub OAuth 配置

### 步骤 1: 注册 OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **New OAuth App**
3. 填写应用信息：
   - **Application name**: `GameBox 游盒`
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: 
     ```
     http://localhost:3000/oauth-callback.html
     https://yourdomain.com/oauth-callback.html
     ```
4. 点击 **Register application**

### 步骤 2: 获取凭据

1. 记录 **Client ID**
2. 生成 **Client Secret**（保密！仅用于后端）

### 步骤 3: 更新配置文件

编辑 `oauth-providers.js`:
```javascript
github: {
  enabled: true,
  clientId: '您的_GITHUB_CLIENT_ID',
  // ... 其他配置保持不变
}
```

---

## 💚 微信开放平台配置

### 步骤 1: 注册微信开放平台账号

1. 访问 [微信开放平台](https://open.weixin.qq.com/)
2. 注册并完成开发者资质认证（需企业资质）
3. 创建**网站应用**

### 步骤 2: 配置应用信息

1. 填写应用基本信息
2. 设置授权回调域:
   ```
   yourdomain.com
   ```
   **注意**: 微信不支持 localhost，需要使用真实域名

### 步骤 3: 获取凭据

1. 审核通过后，获取 **AppID**
2. 获取 **AppSecret**（保密！仅用于后端）

### 步骤 4: 更新配置文件

编辑 `oauth-providers.js`:
```javascript
wechat: {
  enabled: true,
  appId: '您的_WECHAT_APP_ID',
  // ... 其他配置保持不变
}
```

### 微信登录特点

- ✅ 使用**二维码扫码登录**
- ✅ 移动端可直接唤起微信 App
- ⚠️ 需要企业认证（个人开发者无法使用）
- ⚠️ 不提供用户邮箱（建议后续绑定）

---

## 🔷 QQ互联配置

### 步骤 1: 注册QQ互联账号

1. 访问 [QQ互联管理中心](https://connect.qq.com/)
2. 登录QQ账号并完成开发者认证
3. 创建**网站应用**

### 步骤 2: 填写应用信息

1. 应用名称: `GameBox 游盒`
2. 应用类型: **网站**
3. 网站地址: `https://yourdomain.com`
4. 网站回调域:
   ```
   https://yourdomain.com/oauth-callback.html
   ```

### 步骤 3: 获取凭据

1. 审核通过后，获取 **APP ID**
2. 获取 **APP Key**（保密！仅用于后端）

### 步骤 4: 更新配置文件

编辑 `oauth-providers.js`:
```javascript
qq: {
  enabled: true,
  appId: '您的_QQ_APP_ID',
  // ... 其他配置保持不变
}
```

### QQ登录特点

- ✅ 支持 QQ 扫码登录
- ✅ 中国用户覆盖率高
- ⚠️ 可能不提供用户邮箱（建议后续绑定）
- ⚠️ 需要通过应用审核

---

## 🚀 快速开始（开发测试）

如果您只想快速测试第三方登录功能，可以暂时启用**模拟模式**：

### 方式 1: 使用演示配置

保持默认配置，系统会返回模拟用户数据用于测试：

```javascript
// oauth-providers.js 默认配置即可
google: { enabled: true, clientId: 'YOUR_GOOGLE_CLIENT_ID' ... }
```

点击登录按钮后，会打开OAuth授权窗口（虽然会失败），但回调处理会返回模拟数据。

### 方式 2: 完整配置（推荐生产环境）

1. 按照上述指南配置每个OAuth提供商
2. 更新 `oauth-providers.js` 中的真实凭据
3. **重要**: 生产环境需要配置后端代理处理 `client_secret`

---

## 🔒 安全注意事项

### ⚠️ 客户端密钥安全

**禁止**在前端代码中暴露以下敏感信息：
- ❌ Google Client Secret
- ❌ GitHub Client Secret
- ❌ 微信 AppSecret
- ❌ QQ APP Key

### ✅ 正确的处理方式

1. **仅在前端使用**: `Client ID` / `App ID`
2. **后端处理令牌交换**:
   ```
   前端获取 code → 发送到后端 → 后端使用 secret 交换 token → 返回用户信息
   ```

### 建议架构

```
┌─────────────┐       ┌──────────────┐       ┌─────────────────┐
│   前端页面   │──────>│ OAuth服务商   │──────>│  回调页面 (code) │
└─────────────┘       └──────────────┘       └─────────────────┘
                                                        │
                                                        v
                                              ┌─────────────────┐
                                              │   后端 API       │
                                              │ (使用 secret)    │
                                              └─────────────────┘
                                                        │
                                                        v
                                              ┌─────────────────┐
                                              │ 返回 token/用户  │
                                              └─────────────────┘
```

---

## 🧪 测试流程

### 1. 启动本地服务器

```bash
cd /home/user/webapp
python -m http.server 3000
```

或使用 `npm` / `pnpm`:
```bash
npx serve -p 3000
```

### 2. 测试登录流程

1. 访问 `http://localhost:3000/login.html`
2. 点击对应的第三方登录按钮
3. 在弹出窗口中完成授权
4. 观察回调处理和用户数据

### 3. 调试工具

- **浏览器控制台**: 查看 `[OAuth]` 日志
- **Network 面板**: 检查API请求
- **Application → LocalStorage**: 查看 `oauth_state`

---

## 📝 状态参数 (State) 说明

`state` 参数用于防止 CSRF 攻击：

1. **生成**: 前端生成随机字符串并保存到 `localStorage`
2. **传递**: 在 OAuth URL 中包含 `state` 参数
3. **验证**: 回调时验证 `state` 是否匹配
4. **过期**: 10分钟后自动过期

---

## 🐛 常见问题

### Q1: 点击登录按钮没有反应？

**解决方案**:
1. 检查浏览器控制台是否有错误
2. 确认 `oauth-providers.js` 已正确加载
3. 检查弹窗是否被浏览器拦截

### Q2: 回调后报错 "State 不匹配"？

**解决方案**:
1. 清除浏览器 `localStorage`
2. 检查 OAuth 回调 URL 是否配置正确
3. 确保没有使用多个浏览器标签页

### Q3: 微信/QQ登录显示"未启用"？

**解决方案**:
1. 这些服务需要企业资质认证
2. 开发环境可以使用模拟数据
3. 或暂时禁用这些按钮

### Q4: 收不到用户邮箱？

**解决方案**:
- **微信/QQ**: 这些平台可能不提供邮箱
- **处理方式**: 登录后引导用户绑定邮箱
- **代码中已包含**: `needsEmail: true` 标记

---

## 📚 相关文档

- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [Google OAuth文档](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [微信开放平台文档](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)
- [QQ互联文档](https://wiki.connect.qq.com/)

---

## ✅ 配置完成检查清单

- [ ] Google OAuth: Client ID 已配置
- [ ] GitHub OAuth: Client ID 已配置
- [ ] 微信开放平台: App ID 已配置（可选）
- [ ] QQ互联: App ID 已配置（可选）
- [ ] 所有重定向 URI 已在各平台配置
- [ ] 本地测试服务器已启动
- [ ] 浏览器控制台无错误
- [ ] 成功完成一次登录测试

---

**需要帮助?** 请查看 `emailjs-debug.html` 中的调试工具或检查浏览器控制台日志。
