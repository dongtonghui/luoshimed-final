# 免费开源表单存储方案对比

> 飞书 Webhook 是增值服务，以下方案完全免费

---

## 🏆 推荐方案：Google Apps Script + Sheets

**完全免费，无需服务器，5分钟配置完成**

### 优点
- ✅ 100% 免费（Google 服务）
- ✅ 数据实时同步到 Google Sheets
- ✅ 支持邮件通知
- ✅ 无需维护服务器

### 实现步骤

#### 1. 创建 Google Sheets
1. 访问 [Google Sheets](https://sheets.google.com)
2. 创建新表格，命名为「网站询盘管理」
3. 添加表头：
   - A1: 提交时间
   - B1: 姓名
   - C1: 联系电话
   - D1: 公司
   - E1: 咨询类型
   - F1: 留言内容

#### 2. 创建 Apps Script
1. 点击「扩展」→「Apps Script」
2. 删除默认代码，粘贴以下内容：

```javascript
function doPost(e) {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // 处理预检请求
  if (e.parameter.method === 'OPTIONS') {
    return ContentService.createTextOutput('')
      .setHeaders(headers);
  }
  
  try {
    // 获取数据
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 添加记录
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.phone || '',
      data.company || '',
      data.type || '',
      data.message || ''
    ]);
    
    // 发送邮件通知（可选）
    MailApp.sendEmail({
      to: 'your-email@example.com',
      subject: '【新询盘】' + (data.type || '咨询'),
      body: `姓名: ${data.name}\n电话: ${data.phone}\n公司: ${data.company}\n类型: ${data.type}\n留言: ${data.message}`
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: '提交成功'
    })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  }
}
```

#### 3. 部署 Web 应用
1. 点击「部署」→「新建部署」
2. 类型选择「Web 应用」
3. 执行身份：「我」
4. 访问权限：「任何人」
5. 点击「部署」，复制生成的 URL

#### 4. 修改网站代码

```javascript
// Google Apps Script 配置
const FORM_CONFIG = {
  SUBMIT_URL: 'https://script.google.com/macros/s/你的部署ID/exec'
};

// 表单提交函数
async function submitContactForm(btn) {
  // ... 验证代码保持不变 ...
  
  try {
    btn.textContent = '提交中...';
    btn.disabled = true;
    
    const response = await fetch(FORM_CONFIG.SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        phone: tel.value.trim(),
        company: company?.value?.trim() || '',
        type: type.value,
        message: msg.value.trim()
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      btn.textContent = '✓ 提交成功，我们将尽快联系您！';
      btn.style.background = 'var(--green)';
      // 清空表单...
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    btn.textContent = '提交失败，请直接电话联系';
    btn.style.background = '#ef4444';
  }
}
```

---

## 方案二：Formspree（免费版）

**官网**: https://formspree.io

### 免费额度
- 50 条提交/月
- 1 个表单
- 邮件通知

### 使用方法
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" placeholder="姓名" required>
  <input type="tel" name="phone" placeholder="电话" required>
  <button type="submit">提交</button>
</form>
```

---

## 方案三：Getform（免费版）

**官网**: https://getform.io

### 免费额度
- 1 个表单
- 100 条提交/月
- 文件上传支持

---

## 方案四：自建极简后端（Cloudflare Workers）

**完全免费，100,000 次/天**

### 代码示例
```javascript
// worker.js
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    const data = await request.json();
    
    // 存储到 KV 或发送到邮件
    await env.FORM_DATA.put(Date.now().toString(), JSON.stringify(data));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
```

---

## 方案五：Notion 数据库（免费个人版）

**官网**: https://notion.so

### 优点
- 免费个人版无限页面
- 可视化数据库
- 支持 API 写入

### 实现方式
使用 Notion Integration Token + API 写入数据

---

## 📊 方案对比

| 方案 | 成本 | 技术难度 | 数据存储 | 推荐度 |
|-----|------|---------|---------|--------|
| Google Apps Script | 免费 | 低 | Google Sheets | ⭐⭐⭐⭐⭐ |
| Formspree 免费版 | 免费 | 极低 | 云端 | ⭐⭐⭐⭐ |
| Getform 免费版 | 免费 | 极低 | 云端 | ⭐⭐⭐ |
| Cloudflare Workers | 免费 | 中 | KV/邮件 | ⭐⭐⭐⭐ |
| Notion | 免费 | 中 | Notion DB | ⭐⭐⭐ |

---

## 🎯 我的建议

| 你的情况 | 推荐方案 |
|---------|---------|
| 最快上线，零成本 | **Google Apps Script** |
| 不想写任何代码 | **Formspree** |
| 有技术能力，需要定制 | **Cloudflare Workers** |
| 已经在用 Notion | **Notion API** |

---

## 需要帮助？

告诉我你想用哪个方案，我可以：
1. 提供完整的配置步骤
2. 修改你的网站代码
3. 协助部署和测试
