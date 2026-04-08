# 飞书多维表格配置指南

## 方案一：使用飞书表单收集（推荐，最简单）

### 步骤1: 创建飞书表单

1. 打开飞书，在左侧应用栏找到 **"表单"**
2. 点击 **"新建表单"**
3. 选择 **"空白表单"**

### 步骤2: 添加表单字段

添加以下问题：

| 问题类型 | 标题 | 是否必填 |
|---------|------|---------|
| 填空 | 姓名 | ✅ 必填 |
| 填空 | 联系电话 | ✅ 必填 |
| 填空 | 公司/机构 | ❌ 选填 |
| 单选 | 咨询类型 | ✅ 必填 |
| 多行文本 | 留言内容 | ❌ 选填 |

**咨询类型选项：**
- 产品采购咨询
- 诊所合作开店
- 分销商合作
- 售后服务
- 产学研合作
- 其他

### 步骤3: 发布表单

1. 点击右上角 **"发布"**
2. 选择 **"分享链接"**
3. 复制表单链接

### 步骤4: 在网站中使用

#### 方式A：跳转链接
```html
<a href="https://www.feishu.cn/share/base/form/shrcn..." target="_blank">
  填写咨询表单
</a>
```

#### 方式B：iframe嵌入
```html
<iframe 
  src="https://www.feishu.cn/share/base/form/shrcn..." 
  width="100%" 
  height="800" 
  frameborder="0"
  style="border: none;">
</iframe>
```

---

## 方案二：使用多维表格API（高级）

### 步骤1: 创建多维表格

1. 打开飞书，进入 **"多维表格"**
2. 点击 **"新建"** → **"空白表格"**
3. 命名：**网站询盘管理**

### 步骤2: 设置表格字段

创建以下字段：

| 字段名 | 字段类型 | 说明 |
|--------|----------|------|
| 提交时间 | 日期 | 自动填充 |
| 姓名 | 文本 | |
| 电话 | 文本 | |
| 公司 | 文本 | |
| 咨询类型 | 文本 | |
| 留言 | 文本 | |
| 意向城市 | 文本 | |
| 来源页面 | 文本 | |

### 步骤3: 开启Webhook

1. 点击右上角 **"..."** → **"自动化"**
2. 点击 **"创建规则"**
3. 触发条件：**当记录被创建时**
4. 执行操作：**发送Webhook**
5. 复制Webhook URL

### 步骤4: 使用云函数转发（避免CORS）

由于浏览器直接调用飞书API会有CORS问题，建议使用云函数：

#### 腾讯云函数示例

```javascript
// index.js
const axios = require('axios');

exports.main_handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // 处理OPTIONS预检
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }
  
  try {
    const data = JSON.parse(event.body);
    
    // 调用飞书API添加记录
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/bitable/v1/apps/APP_TOKEN/tables/TABLE_ID/records',
      {
        fields: {
          "姓名": data.name,
          "电话": data.phone,
          "公司": data.company || '',
          "咨询类型": data.type || '',
          "留言": data.message || '',
          "意向城市": data.city || '',
          "来源页面": data.source || '',
          "提交时间": new Date().toISOString()
        }
      },
      {
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
```

---

## 方案三：使用飞书机器人（最简单API方式）

### 步骤1: 创建群聊机器人

1. 在飞书中创建一个群聊（可以只有自己）
2. 点击群设置 → **"群机器人"**
3. 点击 **"添加机器人"** → **"自定义机器人"**
4. 命名：**网站询盘通知**
5. 复制 **Webhook地址**

### 步骤2: 前端直接发送（无CORS问题）

```javascript
async function submitToFeishu(data) {
  const webhookUrl = 'https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxx';
  
  const message = {
    msg_type: "text",
    content: {
      text: `新询盘通知\n\n姓名：${data.name}\n电话：${data.phone}\n公司：${data.company || '未填写'}\n类型：${data.type}\n留言：${data.message || '无'}`
    }
  };
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  });
  
  return response.json();
}
```

---

## 推荐方案总结

| 方案 | 难度 | 数据存储 | 实时通知 | 推荐度 |
|-----|------|---------|---------|--------|
| 飞书表单嵌入 | ⭐ 最简单 | 多维表格 | ❌ 无 | ⭐⭐⭐⭐⭐ |
| 飞书机器人 | ⭐⭐ 简单 | 群消息 | ✅ 有 | ⭐⭐⭐⭐ |
| 多维表格API | ⭐⭐⭐⭐ 复杂 | 多维表格 | ❌ 无 | ⭐⭐ |

---

## 下一步

**请选择一个方案：**

1. **飞书表单嵌入**（推荐）- 只需复制表单链接
2. **飞书机器人** - 需要创建机器人和群聊

选择后告诉我，我帮你更新网站代码！
