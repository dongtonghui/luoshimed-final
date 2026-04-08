# Google Apps Script 表单存储配置指南

## 概述
使用 Google Apps Script + Google Sheets 完全免费地存储网站询盘表单数据，支持邮件通知。

---

## 第一步：创建 Google Sheets

### 1.1 新建表格
1. 访问 https://sheets.google.com
2. 登录你的 Google 账号
3. 点击「+ 空白」创建新表格
4. 重命名为：**网站询盘管理**

### 1.2 设置表头
在第一行（A1:H1）输入以下表头：

| 列 | 表头名称 | 说明 |
|---|---------|------|
| A | 提交时间 | 自动记录 |
| B | 姓名 | 客户姓名 |
| C | 联系电话 | 手机号 |
| D | 公司 | 公司/机构 |
| E | 咨询类型 | 咨询分类 |
| F | 留言内容 | 详细需求 |
| G | 城市 | 意向城市（诊所加盟表单）|
| H | 来源 | 表单来源页面 |

**操作步骤：**
1. 点击 A1 单元格，输入「提交时间」
2. 点击 B1 单元格，输入「姓名」
3. 依次完成 C1-H1
4. 可选：选中第一行，点击工具栏「填充颜色」设为浅灰色，作为表头样式

---

## 第二步：创建 Apps Script

### 2.1 打开脚本编辑器
1. 在 Google Sheets 中，点击顶部菜单「扩展」
2. 选择「Apps Script」
3. 会打开新的脚本编辑器标签页

### 2.2 粘贴代码
删除默认的 `function myFunction() {}` 代码，完整粘贴以下内容：

```javascript
/**
 * 处理表单提交的 POST 请求
 */
function doPost(e) {
  // 设置 CORS 响应头，允许跨域请求
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // 处理预检请求 (OPTIONS)
  if (e.parameter.method === 'OPTIONS' || e.postData === undefined) {
    return ContentService.createTextOutput('')
      .setHeaders(headers);
  }
  
  try {
    // 解析请求数据
    const data = JSON.parse(e.postData.contents);
    
    // 获取当前活动的表格
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 添加数据行
    sheet.appendRow([
      new Date(),           // A: 提交时间
      data.name || '',      // B: 姓名
      data.phone || '',     // C: 联系电话
      data.company || '',   // D: 公司
      data.type || data.budget || '',  // E: 咨询类型/预算
      data.message || '',   // F: 留言内容
      data.city || '',      // G: 意向城市
      data.source || ''     // H: 表单来源
    ]);
    
    // 发送邮件通知（可选）
    // 修改下面的邮箱地址为你接收通知的邮箱
    const notificationEmail = 'your-email@example.com';
    
    try {
      const typeLabel = data.type || data.budget || '咨询';
      MailApp.sendEmail({
        to: notificationEmail,
        subject: '【骆氏健康官网 - 新询盘】' + typeLabel + (data.source ? ` [${data.source}]` : ''),
        body: `您收到一条新的网站询盘：\n\n` +
              `提交时间：${new Date().toLocaleString('zh-CN')}\n` +
              `姓名：${data.name || '未填写'}\n` +
              `联系电话：${data.phone || '未填写'}\n` +
              `公司/机构：${data.company || '未填写'}\n` +
              (data.city ? `意向城市：${data.city}\n` : '') +
              (data.type ? `咨询类型：${data.type}\n` : '') +
              (data.budget ? `可投入资金：${data.budget}\n` : '') +
              `留言内容：\n${data.message || '无'}\n\n` +
              (data.source ? `来源页面：${data.source}\n` : '') +
              `---\n` +
              `此邮件由系统自动发送，请勿回复。`
      });
    } catch (emailError) {
      // 邮件发送失败不影响主流程
      console.log('邮件发送失败:', emailError);
    }
    
    // 返回成功响应
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: '提交成功',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
    
  } catch (error) {
    // 返回错误响应
    console.error('处理请求时出错:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

/**
 * 处理 GET 请求（用于测试）
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: '表单服务运行正常',
    timestamp: new Date().toISOString()
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders({
    'Access-Control-Allow-Origin': '*'
  });
}
```

### 2.3 修改通知邮箱
在代码中找到这一行：
```javascript
const notificationEmail = 'your-email@example.com';
```
将 `'your-email@example.com'` 替换为你实际接收通知的邮箱地址。

---

## 第三步：部署 Web 应用

### 3.1 保存项目
1. 点击脚本编辑器顶部的「项目设置」⚙️（齿轮图标）
2. 修改项目名称为：**网站表单提交服务**
3. 点击「保存」

### 3.2 部署应用
1. 点击脚本编辑器右上角的「部署」按钮
2. 选择「新建部署」
3. 在弹出的对话框中：
   - 类型：**Web 应用**
   - 描述：**网站询盘表单接口**
   - 执行身份：**我**
   - 访问权限：**任何人**
4. 点击「部署」
5. 首次部署需要授权：
   - 点击「授权访问」
   - 选择你的 Google 账号
   - 点击「高级」→「前往 网站表单提交服务（不安全）」
   - 点击「允许」授予权限
6. 部署完成后，**复制生成的 Web 应用 URL**
   - 格式类似：`https://script.google.com/macros/s/AKfycbx.../exec`

### 3.3 记录 URL
将复制的 URL 保存好，下一步需要填入网站代码。

---

## 第四步：修改网站代码

### 4.1 更新 contact.html

打开 `contact.html` 文件，找到 `<script>` 标签中的 JavaScript 代码，替换为以下内容：

```javascript
// ============================================
// Google Apps Script 表单提交配置
// ============================================
const FORM_CONFIG = {
  // ⚠️ 重要：将此 URL 替换为你部署的 Google Apps Script Web 应用 URL
  SUBMIT_URL: 'https://script.google.com/macros/s/你的脚本ID/exec'
};

// 防重复提交锁
let isSubmitting = false;

// 手机号验证函数
function isValidPhone(v) {
  const p = v.trim();
  return p.length === 11 && /^1[3-9]\d{9}$/.test(p);
}

// 表单提交函数
async function submitContactForm(btn) {
  // 防重复提交
  if (isSubmitting) return;
  
  // 获取表单元素
  const name = document.getElementById('cf-name');
  const tel = document.getElementById('cf-tel');
  const type = document.getElementById('cf-type');
  const msg = document.getElementById('cf-msg');
  const company = document.getElementById('cf-company');
  
  // 表单验证
  let valid = true;
  
  if (!name.value.trim()) {
    name.classList.add('invalid');
    valid = false;
  } else {
    name.classList.remove('invalid');
  }
  
  if (!isValidPhone(tel.value)) {
    tel.classList.add('invalid');
    valid = false;
  } else {
    tel.classList.remove('invalid');
  }
  
  if (!type.value) {
    type.classList.add('invalid');
    valid = false;
  } else {
    type.classList.remove('invalid');
  }
  
  if (!msg.value.trim()) {
    msg.classList.add('invalid');
    valid = false;
  } else {
    msg.classList.remove('invalid');
  }
  
  if (!valid) return;
  
  // 检查是否已配置 URL
  if (FORM_CONFIG.SUBMIT_URL.includes('你的脚本ID')) {
    alert('请先配置 Google Apps Script URL！\n\n配置方法：\n1. 按照 GOOGLE_SCRIPT_SETUP.md 部署 Apps Script\n2. 将生成的 Web 应用 URL 填入 FORM_CONFIG.SUBMIT_URL');
    return;
  }
  
  // 显示提交中状态
  isSubmitting = true;
  const originalText = btn.textContent;
  btn.textContent = '提交中...';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  
  try {
    // 准备提交数据
    const submitData = {
      name: name.value.trim(),
      phone: tel.value.trim(),
      company: company?.value?.trim() || '',
      type: type.value,
      message: msg.value.trim()
    };
    
    console.log('正在提交数据:', submitData);
    
    // 发送请求到 Google Apps Script
    const response = await fetch(FORM_CONFIG.SUBMIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submitData)
    });
    
    const result = await response.json();
    console.log('服务器返回:', result);
    
    if (result.success) {
      // 提交成功
      btn.textContent = '✓ 提交成功，我们将尽快联系您！';
      btn.style.background = 'var(--green)';
      btn.style.opacity = '1';
      
      // 清空表单
      name.value = '';
      tel.value = '';
      type.value = '';
      msg.value = '';
      if (company) company.value = '';
      
      // 移除所有验证错误样式
      [name, tel, type, msg].forEach(el => el.classList.remove('invalid'));
      
      // 3秒后恢复按钮状态
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        isSubmitting = false;
      }, 3000);
      
    } else {
      throw new Error(result.error || '提交失败');
    }
    
  } catch (error) {
    console.error('表单提交失败:', error);
    
    // 显示错误提示
    btn.textContent = '提交失败，请直接电话联系 186-1277-9998';
    btn.style.background = '#ef4444';
    btn.style.opacity = '1';
    
    // 5秒后恢复按钮状态
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      isSubmitting = false;
    }, 5000);
  }
}
```

### 4.2 替换 URL
将代码中的：
```javascript
SUBMIT_URL: 'https://script.google.com/macros/s/你的脚本ID/exec'
```
替换为你实际部署的 URL：
```javascript
SUBMIT_URL: 'https://script.google.com/macros/s/AKfycbx.../exec'
```

---

## 第五步：测试验证

### 5.1 本地测试
1. 在浏览器中打开 `contact.html`
2. 填写测试数据：
   - 姓名：测试用户
   - 电话：13800138000
   - 公司：测试公司
   - 咨询类型：产品采购咨询
   - 留言内容：这是一条测试消息
3. 点击提交

### 5.2 验证结果
1. **检查 Google Sheets**：
   - 打开你的「网站询盘管理」表格
   - 查看是否有新记录添加
   
2. **检查邮件通知**：
   - 查看你配置的邮箱是否收到通知邮件

3. **检查浏览器控制台**：
   - 按 F12 打开开发者工具
   - 查看 Console 面板是否有错误信息
   - 查看 Network 面板中的请求状态

### 5.3 常见问题

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| 跨域错误 (CORS) | 部署时未设置访问权限 | 重新部署，确保「访问权限」设为「任何人」 |
| 404 错误 | URL 错误 | 检查 URL 是否完整复制 |
| 500 错误 | 代码执行错误 | 查看 Apps Script 的「执行」日志 |
| 数据未写入 | 字段名不匹配 | 检查代码中的字段名与请求数据是否一致 |
| 邮件未收到 | 邮箱地址错误或配额限制 | 检查邮箱地址；Google 免费账户有每日邮件配额 |

---

## 第六步：生产环境优化

### 6.1 添加防刷机制
在 Apps Script 代码中添加：

```javascript
// 在 doPost 函数开头添加
const lock = LockService.getScriptLock();
try {
  lock.waitLock(30000); // 等待最多30秒获取锁
} catch (e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: '系统繁忙，请稍后再试'
  })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
}

// 在函数结尾释放锁
lock.releaseLock();
```

### 6.2 数据验证
在 Apps Script 中添加服务端验证：

```javascript
// 验证必填字段
if (!data.name || !data.phone) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: '姓名和电话为必填项'
  })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
}

// 验证手机号格式
const phoneRegex = /^1[3-9]\d{9}$/;
if (!phoneRegex.test(data.phone)) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: '手机号格式不正确'
  })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
}
```

### 6.3 更新部署
修改代码后需要重新部署：
1. 保存代码（Ctrl+S 或 ⌘+S）
2. 点击「部署」→「管理部署」
3. 点击「修改」→「版本」选择「新版本」
4. 点击「部署」
5. URL 不会改变，无需修改网站代码

---

## 附录

### Google Apps Script 限制
- 每日执行次数：无明确限制（但受 Google 配额管理）
- 每次执行时间：6 分钟
- 邮件发送配额：免费账户每日 100 封

### 数据安全建议
1. 定期检查表格访问权限
2. 敏感数据（如手机号）在分享时脱敏
3. 定期导出备份数据

### 参考链接
- [Google Apps Script 文档](https://developers.google.com/apps-script)
- [SpreadsheetApp API](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)
