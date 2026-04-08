# 表单提交替代方案

Google Apps Script的CORS问题难以解决，以下是可靠的替代方案：

---

## 方案1: Formspree（推荐，最简单）

### 优点
- 免费版每月50条提交
- 无需后端代码
- 支持邮件通知
- 无CORS问题

### 使用步骤

1. 访问 https://formspree.io
2. 注册账号
3. 创建新表单
4. 复制表单URL

### 前端代码

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" placeholder="姓名" required>
  <input type="tel" name="phone" placeholder="电话" required>
  <input type="text" name="company" placeholder="公司">
  <select name="type">
    <option value="产品采购咨询">产品采购咨询</option>
    <option value="诊所合作开店">诊所合作开店</option>
  </select>
  <textarea name="message" placeholder="留言"></textarea>
  <button type="submit">提交</button>
</form>
```

### 或者使用JavaScript提交

```javascript
async function submitForm(data) {
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (response.ok) {
    alert('提交成功！');
  }
}
```

---

## 方案2: Getform

### 优点
- 免费版每月100条提交
- 支持文件上传
- 支持Webhook

### 使用步骤

1. 访问 https://getform.io
2. 注册账号
3. 创建表单端点
4. 复制端点URL

### 前端代码

```html
<form action="https://getform.io/f/YOUR_ENDPOINT" method="POST">
  <input type="text" name="name" placeholder="姓名">
  <input type="tel" name="phone" placeholder="电话">
  <button type="submit">提交</button>
</form>
```

---

## 方案3: 百度统计事件分析

如果只需要收集数据，可以使用百度统计：

```javascript
// 提交表单时发送事件
_hmt.push(['_trackEvent', '表单', '提交', '首页分销商表单']);
```

然后在百度统计后台查看数据。

---

## 方案4: 使用iframe嵌入Google表单

完全避免CORS问题：

1. 创建Google表单 https://forms.google.com
2. 获取嵌入代码
3. 在网页中嵌入

```html
<iframe src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true" 
        width="640" height="800" frameborder="0" marginheight="0" marginwidth="0">
  加载中...
</iframe>
```

### 优点
- 完全免费
- 无数量限制
- 数据自动保存到Google Sheets

### 缺点
- 样式无法自定义
- 用户体验较差

---

## 方案5: 自建后端（Node.js + Express）

如果你有服务器，可以自己搭建：

### 后端代码 (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// 提交表单
app.post('/api/submit-form', async (req, res) => {
  const { name, phone, company, type, message } = req.body;
  
  // 发送邮件通知
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });
  
  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: 'contact@luoshimed.com',
    subject: `新询盘: ${type}`,
    text: `姓名: ${name}\n电话: ${phone}\n公司: ${company}\n类型: ${type}\n留言: ${message}`
  });
  
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 前端代码

```javascript
const response = await fetch('https://your-server.com/api/submit-form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

---

## 方案6: 使用腾讯云/阿里云函数

### 腾讯云云函数示例

```javascript
exports.main = async (event, context) => {
  const { name, phone, company, type, message } = event;
  
  // 发送邮件
  // 或保存到数据库
  
  return {
    success: true,
    message: '提交成功'
  };
};
```

触发器设置为API网关，前端直接调用API地址。

---

## 方案7: 使用飞书多维表格

### 步骤

1. 创建飞书多维表格
2. 开启"收集数据"功能
3. 获取API Token
4. 使用API提交数据

### 前端代码

```javascript
async function submitToFeishu(data) {
  const response = await fetch('https://open.feishu.cn/open-apis/bitable/v1/apps/APP_ID/tables/TABLE_ID/records', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: {
        "姓名": data.name,
        "电话": data.phone,
        "公司": data.company
      }
    })
  });
  
  return response.json();
}
```

---

## 推荐方案总结

| 方案 | 难度 | 成本 | 可靠性 | 推荐度 |
|-----|------|------|--------|--------|
| Formspree | 简单 | 免费(50条/月) | 高 | ⭐⭐⭐⭐⭐ |
| Getform | 简单 | 免费(100条/月) | 高 | ⭐⭐⭐⭐ |
| Google表单嵌入 | 简单 | 免费 | 高 | ⭐⭐⭐ |
| 自建后端 | 复杂 | 有服务器成本 | 高 | ⭐⭐⭐ |
| 云函数 | 中等 | 按量付费 | 高 | ⭐⭐⭐⭐ |
| 飞书多维表格 | 中等 | 免费 | 中 | ⭐⭐⭐ |

---

## 最快速解决方案

### 立即可用：Formspree

1. 5分钟注册配置
2. 复制提供的URL
3. 替换代码中的Google Apps Script URL
4. 完成

需要我帮你配置Formspree吗？
