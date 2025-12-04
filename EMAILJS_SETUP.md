# EmailJS 详细配置指南

## 🔍 问题诊断

如果收不到验证码邮件，请按以下步骤排查：

---

## ✅ 步骤 1: 检查 EmailJS Service 配置

1. 登录 https://www.emailjs.com
2. 进入左侧菜单 **Email Services**
3. 确认已创建并连接邮箱服务（QQ邮箱/Gmail等）

### QQ 邮箱配置要点：
- 需要在 QQ 邮箱开启 SMTP 服务
- 获取授权码（不是QQ密码）
- QQ邮箱授权码获取：
  - 登录 QQ 邮箱网页版
  - 设置 → 账户
  - 开启 POP3/SMTP 服务
  - 生成授权码

---

## ✅ 步骤 2: 检查 Email Template 配置

### 2.1 模板变量设置

在 EmailJS 模板中必须正确配置以下内容：

**1. Template Settings (设置标签)**
- **To Email**: 填写 `{{to_email}}`（必须）
- **From Name**: GameBox 游盒
- **Reply To**: 你的邮箱地址（可选）

**2. Subject (邮件主题)**
```
GameBox 游盒 - 邮箱验证码
```

**3. Content (邮件内容)**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #38bdf8; margin-bottom: 20px;">🎮 GameBox 游盒</h2>
            
            <p>您好，</p>
            
            <p>您正在进行邮箱验证，您的验证码是：</p>
            
            <div style="background-color: #f0f9ff; border: 2px solid #38bdf8; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <h1 style="color: #0ea5e9; font-size: 36px; letter-spacing: 8px; margin: 0;">{{verification_code}}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px;">该验证码有效期为 <strong>5 分钟</strong>，请尽快使用。</p>
            
            <p style="color: #666; font-size: 14px;">如果这不是您的操作，请忽略此邮件。</p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
                GameBox 游盒 - 轻量级游戏中心
            </p>
        </div>
    </div>
</body>
</html>
```

### 2.2 必需的模板变量

确保模板中使用了以下变量：
- `{{to_email}}` - 收件人邮箱（在 Settings 中配置）
- `{{verification_code}}` - 验证码（在内容中使用）

---

## ✅ 步骤 3: 测试邮件发送

### 方法 1: 使用测试页面
访问: https://3000-iyral45aw52h01impzz49-cbeee0f9.sandbox.novita.ai/test-email.html

1. 输入邮箱地址
2. 点击"发送测试邮件"
3. 查看执行日志，确认是否有错误

### 方法 2: 在 EmailJS 后台测试
1. 进入模板编辑页面
2. 点击右上角 **"Test it"** 按钮
3. 填写测试数据：
   - `to_email`: 2784422912@qq.com
   - `verification_code`: 123456
   - `app_name`: GameBox 游盒
4. 点击 Send Test
5. 查收邮件（检查垃圾邮件文件夹）

---

## ✅ 步骤 4: 常见问题排查

### 问题 1: Service 未连接
**症状**: 发送时报错 "Service not found"
**解决**: 
- 检查 Service ID 是否正确: `service_mjvb7y5`
- 确认 Service 状态为 Active
- 重新保存 Service 配置

### 问题 2: 模板变量错误
**症状**: 邮件发送成功但收不到
**解决**:
- 检查模板 Settings 中 "To Email" 是否填写 `{{to_email}}`
- 不要写死邮箱地址

### 问题 3: 授权码问题（QQ邮箱）
**症状**: Service 连接失败
**解决**:
- 使用授权码而非 QQ 密码
- 重新生成授权码
- 确认 SMTP 服务已开启

### 问题 4: 邮件进入垃圾箱
**症状**: 发送成功但收件箱没有
**解决**:
- 检查垃圾邮件/spam 文件夹
- 将 noreply@emailjs.com 加入白名单
- QQ 邮箱可能会拦截，建议使用 Gmail 测试

---

## 🔧 当前配置信息

```javascript
Service ID: service_mjvb7y5
Template ID: template_df6t50r
Public Key: Z6VWjqql5Idf6t027
状态: ✅ 已启用
```

---

## 📞 需要帮助？

如果按照以上步骤仍然无法解决问题，请提供：

1. EmailJS 后台的截图（Service 和 Template 配置）
2. 浏览器控制台的错误信息
3. test-email.html 页面的执行日志

---

## 🎯 快速验证配置

在浏览器控制台运行以下代码测试配置：

```javascript
// 测试 EmailJS 配置
emailjs.init('Z6VWjqql5Idf6t027');
emailjs.send('service_mjvb7y5', 'template_df6t50r', {
  to_email: '2784422912@qq.com',
  verification_code: '123456',
  app_name: 'GameBox 游盒'
}).then(
  (response) => console.log('成功!', response),
  (error) => console.error('失败!', error)
);
```
