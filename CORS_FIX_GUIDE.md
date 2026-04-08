# CORS问题修复指南

## 问题原因

截图显示的错误是CORS跨域问题：
```
Access to fetch at 'https://script.google.com/...' from origin 'https://www.luoshimed.com' 
has been blocked by CORS policy
```

这意味着Google Apps Script没有正确处理**OPTIONS预检请求**。

---

## 修复步骤

### 步骤1: 更新Google Apps Script代码

1. 访问 https://script.google.com
2. 打开你的项目 "网站表单提交服务"
3. **删除所有现有代码**
4. 粘贴以下修复后的代码：

```javascript
/**
 * 骆氏健康官网 - Google Apps Script 表单接收服务
 * CORS修复版本
 */

function doPost(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    if (!e.postData) {
      return createResponse({success: false, error: "No postData"}, headers);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    if (!data.name || !data.phone) {
      return createResponse({success: false, error: "Name and phone required"}, headers);
    }
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.phone || "",
      data.company || "",
      data.type || data.budget || "",
      data.message || "",
      data.city || "",
      data.source || ""
    ]);
    
    return createResponse({
      success: true, 
      message: "提交成功",
      timestamp: new Date().toISOString()
    }, headers);
    
  } catch (error) {
    return createResponse({success: false, error: error.toString()}, headers);
  }
}

function doGet(e) {
  return createResponse({
    status: "ok",
    message: "服务运行正常",
    timestamp: new Date().toISOString()
  }, {"Access-Control-Allow-Origin": "*"});
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    });
}

function createResponse(data, headers) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}
```

### 步骤2: 重新部署

1. 点击 **保存**（Ctrl+S 或 Cmd+S）
2. 点击右上角的 **部署** 按钮
3. 选择 **管理部署**
4. 找到当前部署，点击 **修改**（铅笔图标）
5. **版本**：选择"新版本"
6. **描述**：输入"CORS修复版本"
7. 点击 **部署**
8. 授权访问（如果需要）
9. 复制新的 **Web应用URL**

### 步骤3: 更新网站代码

如果URL发生变化，需要更新到网站代码中：

```javascript
const FORM_CONFIG = {
  SUBMIT_URL: '新的URL地址'
};
```

---

## 关键修复点

### 1. 添加 doOptions 函数
```javascript
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
}
```

这是修复CORS问题的关键！浏览器在发送POST请求前会先发送OPTIONS预检请求，必须正确响应。

### 2. 所有响应都包含CORS头
确保 `doPost`, `doGet`, `doOptions` 都返回正确的CORS头。

---

## 验证修复

### 方法1: 浏览器直接测试
部署后，在浏览器访问：
```
https://script.google.com/macros/s/你的脚本ID/exec
```

应该返回：
```json
{"status":"ok","message":"服务运行正常","timestamp":"..."}
```

### 方法2: 表单提交测试
1. 打开网站 https://www.luoshimed.com
2. 填写表单
3. 按F12打开开发者工具
4. 提交表单
5. 查看Console是否有CORS错误

---

## 如果仍然失败

### 检查1: 部署权限
确保部署时选择的权限是 **"任何人"** 而不是 "仅限我自己"。

### 检查2: 脚本执行权限
1. 在Apps Script编辑器中
2. 点击左侧的 **"执行"** 图标
3. 查看最近的执行记录
4. 检查是否有错误信息

### 检查3: 表格权限
确保Google Sheets表格：
1. 没有被删除或移动
2. Apps Script有编辑权限
3. 表头正确设置（A1:H1）

---

## 备用方案

如果Google Apps Script的CORS问题无法解决，可以考虑：

1. **使用表单代理** - 通过后端服务器转发请求
2. **使用第三方表单服务** - 如Formspree、Getform等
3. **使用iframe嵌入Google表单** - 完全避免CORS问题

联系技术支持获取更多帮助。
