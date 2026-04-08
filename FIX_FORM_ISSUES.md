# 表单提交问题诊断与修复指南

## 问题描述
表单提交失败，可能的原因：

1. Google Apps Script URL 无法访问
2. CORS 跨域问题
3. 脚本部署配置问题
4. 数据格式问题

---

## 诊断步骤

### 步骤 1: 测试 Google Apps Script URL

在浏览器中直接访问：
```
https://script.google.com/macros/s/AKfycbw2uyzefC-I2GUjo-91idfJZbb9xsbfMa75msvt7GIaO1M_yZJqeNVQoaBAjbL7aaIz6A/exec
```

**预期结果**: 应该返回JSON格式的状态信息
```json
{"status":"ok","message":"表单服务运行正常","timestamp":"..."}
```

**如果无法访问或超时**，说明脚本部署有问题，需要重新部署。

---

### 步骤 2: 检查浏览器控制台

1. 打开网站首页
2. 按 F12 打开开发者工具
3. 切换到 Console (控制台) 标签
4. 填写表单并提交
5. 查看控制台输出的错误信息

常见错误：
- `Failed to fetch` - 网络或CORS问题
- `404 Not Found` - URL错误
- `500 Internal Server Error` - 脚本代码错误

---

### 步骤 3: 验证 Google Apps Script 代码

登录 Google Apps Script 检查：

1. 访问 https://script.google.com
2. 找到你的项目 "网站表单提交服务"
3. 检查代码是否为最新版本
4. 查看执行日志（点击左侧的 "执行" 图标）

---

## 修复方案

### 方案 A: 重新部署 Google Apps Script

如果URL无法访问，需要重新部署：

1. 打开 Google Apps Script 编辑器
2. 点击右上角的 "部署" → "管理部署"
3. 找到当前部署，点击 "修改" → "版本"
4. 选择 "新版本"
5. 点击 "部署"
6. 复制新的 Web 应用 URL
7. 更新到网站代码中

### 方案 B: 使用新的脚本代码

使用 `google-script-fixed.js` 中的修复版本：

1. 打开 Google Apps Script 编辑器
2. 删除原有代码
3. 复制 `google-script-fixed.js` 的内容
4. 修改通知邮箱地址
5. 保存并重新部署

### 方案 C: 检查 Google Sheets 权限

确保表格权限正确：

1. 打开 Google Sheets
2. 点击右上角的 "共享"
3. 确保 Apps Script 有编辑权限
4. 检查表格是否被移动或删除

---

## 备用方案：使用表单提交测试工具

创建一个测试HTML文件来验证脚本：

```html
<!DOCTYPE html>
<html>
<head>
  <title>表单提交测试</title>
</head>
<body>
  <h1>Google Apps Script 测试</h1>
  <button onclick="testSubmit()">测试提交</button>
  <div id="result"></div>
  
  <script>
    async function testSubmit() {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '提交中...';
      
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbw2uyzefC-I2GUjo-91idfJZbb9xsbfMa75msvt7GIaO1M_yZJqeNVQoaBAjbL7aaIz6A/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: '测试用户',
            phone: '13800138000',
            company: '测试公司',
            type: '产品咨询',
            message: '这是一条测试消息',
            source: '测试页面'
          })
        });
        
        const result = await response.json();
        resultDiv.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
      } catch (error) {
        resultDiv.innerHTML = '<pre style="color:red">错误: ' + error.message + '</pre>';
      }
    }
  </script>
</body>
</html>
```

保存为 `test-form.html`，用浏览器打开测试。

---

## 常见问题

### Q1: 为什么脚本URL无法访问？
可能原因：
- 脚本部署被删除
- Google账号权限问题
- 脚本执行权限设置为"仅限我自己"

### Q2: CORS错误怎么解决？
确保脚本中有正确的CORS头：
```javascript
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};
```

### Q3: 数据写入成功但页面显示失败？
检查脚本返回的JSON格式：
```javascript
return ContentService.createTextOutput(JSON.stringify({
  success: true,
  message: '提交成功'
}))
.setMimeType(ContentService.MimeType.JSON)
.setHeaders(headers);
```

---

## 需要检查的配置

1. ✅ 前端表单字段有正确的id属性
2. ✅ JavaScript使用document.getElementById获取元素
3. ✅ Google Apps Script URL正确
4. ✅ 脚本已部署且有执行权限
5. ✅ Google Sheets表头正确设置
6. ✅ 脚本有写入表格的权限

---

## 联系支持

如果以上步骤都无法解决问题：
1. 检查 Google Apps Script 执行日志
2. 确认 Google Sheets 没有被移动或删除
3. 尝试创建新的 Spreadsheet 和 Script
