# Google Apps Script 部署问题排查指南

## 当前问题

GET请求仍然失败，说明脚本部署有问题。

---

## 必须检查的配置

### 1. 部署类型检查（最常见错误）

**必须选择 "Web应用"，不是其他类型！**

正确步骤：
1. 打开 https://script.google.com
2. 点击你的项目
3. 点击右上角 **部署** → **新建部署**
4. **⚠️ 关键：类型选择 "Web应用"**
   - ❌ 不要选 "开发环境"
   - ❌ 不要选 "API可执行文件"
   - ✅ 必须选 "Web应用"
5. **执行身份**：选择 **我**
6. **访问权限**：选择 **任何人**
7. 点击 **部署**

### 2. 脚本代码检查

确保代码包含这三个函数：

```javascript
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "服务运行正常"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var headers = {"Access-Control-Allow-Origin": "*"};
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([new Date(), data.name || "", data.phone || "", data.company || "", data.type || "", data.message || "", data.city || "", data.source || ""]);
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()})).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("").setHeaders({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
}
```

### 3. 授权检查

首次部署必须授权：
1. 点击 **部署** 后出现授权提示
2. 点击 **授权访问**
3. 选择你的 Google 账号
4. 点击 **高级** → **前往 [项目名称]（不安全）**
5. 点击 **允许**

**如果没有看到授权提示，说明部署失败！**

### 4. 验证部署

部署完成后，URL格式应该是：
```
https://script.google.com/macros/s/AKfycb.../exec
```

**注意：**
- 必须以 `/exec` 结尾
- 不能是 `/dev`

在浏览器直接访问URL，应该返回：
```json
{"status":"ok","message":"服务运行正常"}
```

---

## 常见问题

### Q1: 部署后URL无法访问？

检查清单：
- [ ] 部署类型是 "Web应用"
- [ ] 访问权限是 "任何人"
- [ ] 已完成授权步骤
- [ ] 代码已保存

### Q2: 如何重新部署？

1. 点击 **部署** → **管理部署**
2. 点击当前部署的 **修改**（铅笔图标）
3. 选择 **版本** → **新版本**
4. 点击 **部署**

### Q3: 如何检查部署是否成功？

查看执行日志：
1. 在Apps Script编辑器左侧
2. 点击 **执行** 图标（▶️）
3. 查看最近的执行记录
4. 如果有错误会显示在这里

### Q4: 表格权限问题？

确保：
1. Google Sheets没有被删除
2. 脚本有编辑表格的权限
3. 表格和脚本在同一个账号下

---

## 最简单的测试方法

创建一个最简单的脚本测试：

```javascript
function doGet(e) {
  return ContentService.createTextOutput("Hello World");
}
```

部署后访问URL，应该显示 "Hello World"。

如果这都不行，说明部署过程有问题。

---

## 如果还是不行

考虑使用替代方案：

### 方案1: 使用 Formspree
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name">
  <input type="email" name="email">
  <button type="submit">提交</button>
</form>
```

### 方案2: 使用 Getform
类似Formspree的免费表单服务。

### 方案3: 后端转发
通过你自己的服务器转发请求。

---

## 需要帮助？

请提供以下信息：
1. 部署时选择的类型是什么？
2. 是否完成了授权步骤？
3. 脚本代码是否包含doGet/doPost/doOptions？
4. 在Apps Script执行日志中看到了什么？
