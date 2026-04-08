# 飞书多维表格询盘表单配置指南

## 概述
本方案使用飞书多维表格的 Webhook 自动化功能，将网站询盘表单数据实时同步到飞书表格，无需后端服务器。

---

## 第一步：创建飞书多维表格

### 1.1 新建多维表格
1. 登录飞书 → 点击左侧「多维表格」
2. 点击「新建多维表格」→ 选择「空白表格」
3. 重命名为「网站询盘管理」

### 1.2 设置表格字段
点击「添加字段」，按顺序创建以下字段：

| 字段名称 | 字段类型 | 配置说明 |
|---------|---------|---------|
| 提交时间 | 日期时间 | 默认格式，精确到分钟 |
| 姓名 | 文本 | 必填 |
| 联系电话 | 文本 | 必填 |
| 公司/机构 | 文本 | 可选 |
| 咨询类型 | 单选 | 选项：产品采购咨询、诊所合作开店、分销商合作、售后服务、产学研合作、其他 |
| 留言内容 | 多行文本 | 必填 |
| 处理状态 | 单选 | 选项：待跟进、跟进中、已成交、已关闭（默认：待跟进） |
| 负责人 | 人员 | 可选，用于分配跟进人 |
| 备注 | 多行文本 | 内部备注 |

### 1.3 设置表格视图
建议创建以下视图方便管理：
- **全部询盘**：显示所有记录
- **待跟进**：筛选「处理状态 = 待跟进」
- **跟进中**：筛选「处理状态 = 跟进中」
- **本月新增**：筛选「提交时间 = 本月」

---

## 第二步：配置 Webhook 自动化

### 2.1 创建自动化流程
1. 打开多维表格 → 点击右上角「自动化」按钮
2. 点击「创建自动化」→ 选择「自定义流程」

### 2.2 设置触发条件
1. 触发条件选择：**接收到 webhook 时**
2. 系统会自动生成一个 Webhook URL，格式如下：
   ```
   https://open.feishu.cn/open-apis/bitable/v1/webhooks/xxxxxxxxxx
   ```
3. **复制并保存这个 URL**，后续需要填入网站代码
4. 安全设置（可选）：
   - 开启「凭证校验」增加安全性
   - 设置 IP 白名单限制访问来源

### 2.3 设置执行动作
1. 点击「添加执行操作」
2. 选择「新增记录」
3. 字段映射配置：

| 目标字段 | 数据来源 | 配置方式 |
|---------|---------|---------|
| 提交时间 | 自定义 | 点击「⊕」→ 选择「当前时间」 |
| 姓名 | Webhook 请求体 | `{{webhook.body.姓名}}` |
| 联系电话 | Webhook 请求体 | `{{webhook.body.联系电话}}` |
| 公司/机构 | Webhook 请求体 | `{{webhook.body.公司}}` |
| 咨询类型 | Webhook 请求体 | `{{webhook.body.咨询类型}}` |
| 留言内容 | Webhook 请求体 | `{{webhook.body.留言内容}}` |
| 处理状态 | 自定义 | 默认值「待跟进」 |

### 2.4 保存并启用
1. 点击右上角「保存」
2. 开启自动化流程开关（默认开启）

---

## 第三步：配置飞书机器人通知（可选）

如需在表单提交时自动通知相关人员：

### 3.1 添加群机器人
1. 进入飞书群 → 点击右上角「···」→「设置」
2. 点击「群机器人」→「添加机器人」
3. 选择「自定义机器人」→ 配置名称和头像
4. 复制 Webhook 地址

### 3.2 添加发送消息动作
在自动化流程中：
1. 点击「添加执行操作」
2. 选择「发送 HTTP 请求」
3. 配置：
   - 请求方法：POST
   - 请求 URL：群机器人的 Webhook 地址
   - 请求体（JSON）：
   ```json
   {
     "msg_type": "text",
     "content": {
       "text": "【新询盘】\n姓名：{{webhook.body.姓名}}\n电话：{{webhook.body.联系电话}}\n类型：{{webhook.body.咨询类型}}\n内容：{{webhook.body.留言内容}}"
     }
   }
   ```

---

## 第四步：网站代码配置

### 4.1 修改 contact.html

将以下代码替换到 `contact.html` 中对应位置：

```javascript
// 飞书多维表格 Webhook 配置
const FEISHU_CONFIG = {
  WEBHOOK_URL: 'https://open.feishu.cn/open-apis/bitable/v1/webhooks/你的Webhook地址',
  // 如果开启了凭证校验，需要填写
  TOKEN: ''
};

// 表单提交函数
async function submitContactForm(btn) {
  // 获取表单元素
  const name = document.getElementById('cf-name');
  const tel = document.getElementById('cf-tel');
  const type = document.getElementById('cf-type');
  const msg = document.getElementById('cf-msg');
  const company = document.querySelector('#cf-company') || { value: '' };
  
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
  
  // 显示提交中状态
  const originalText = btn.textContent;
  btn.textContent = '提交中...';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  
  try {
    // 准备提交数据（字段名必须与飞书表格字段名一致）
    const submitData = {
      '姓名': name.value.trim(),
      '联系电话': tel.value.trim(),
      '公司': company.value.trim() || '未填写',
      '咨询类型': type.value,
      '留言内容': msg.value.trim()
    };
    
    // 发送请求到飞书 Webhook
    const response = await fetch(FEISHU_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果开启了凭证校验，添加以下行
        // 'Authorization': `Bearer ${FEISHU_CONFIG.TOKEN}`
      },
      body: JSON.stringify(submitData)
    });
    
    if (response.ok) {
      // 提交成功
      btn.textContent = '✓ 提交成功，我们将尽快联系您！';
      btn.style.background = 'var(--green)';
      btn.style.opacity = '1';
      
      // 清空表单
      name.value = '';
      tel.value = '';
      type.value = '';
      msg.value = '';
      if (company.value) company.value = '';
      
      // 3秒后恢复按钮状态
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
      
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
    
  } catch (error) {
    console.error('表单提交失败:', error);
    
    // 显示错误提示
    btn.textContent = '提交失败，请稍后重试或电话联系';
    btn.style.background = '#ef4444';
    btn.style.opacity = '1';
    
    // 5秒后恢复按钮状态
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 5000);
  }
}

// 手机号验证函数
function isValidPhone(v) {
  const p = v.trim();
  return p.length === 11 && /^1[3-9]\d{9}$/.test(p);
}
```

### 4.2 添加公司字段 ID（可选）

如果你的表单有公司字段，建议添加 ID：

```html
<div class="form-group">
  <label class="form-label">公司 / 机构</label>
  <input type="text" id="cf-company" class="form-control" placeholder="选填"/>
</div>
```

---

## 第五步：测试验证

### 5.1 本地测试
1. 使用本地服务器打开 contact.html
2. 填写测试数据提交表单
3. 检查飞书多维表格是否收到数据

### 5.2 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|-----|---------|---------|
| 提交无响应 | Webhook URL 错误 | 检查 URL 是否完整复制 |
| 400 错误 | 字段名不匹配 | 检查字段名是否与表格一致 |
| 401 错误 | 凭证校验失败 | 检查 Token 配置 |
| 数据未写入 | 自动化未启用 | 检查自动化流程是否开启 |
| 部分字段为空 | 字段映射错误 | 检查 Webhook 请求体字段名 |

### 5.3 调试方法

在浏览器开发者工具中查看：
1. Network 面板 → 找到 Webhook 请求
2. 检查请求体（Request Payload）格式
3. 查看响应状态码和返回信息

---

## 第六步：生产环境优化

### 6.1 添加防重复提交
```javascript
let isSubmitting = false;

async function submitContactForm(btn) {
  if (isSubmitting) return;
  isSubmitting = true;
  
  try {
    // ... 提交逻辑
  } finally {
    isSubmitting = false;
  }
}
```

### 6.2 添加简单的防刷机制
```javascript
// 限制同一IP每分钟最多提交3次
const submitHistory = JSON.parse(localStorage.getItem('formSubmitHistory') || '[]');
const now = Date.now();
const recentSubmits = submitHistory.filter(time => now - time < 60000);

if (recentSubmits.length >= 3) {
  alert('提交过于频繁，请稍后再试');
  return;
}

// 提交成功后记录
recentSubmits.push(now);
localStorage.setItem('formSubmitHistory', JSON.stringify(recentSubmits));
```

### 6.3 备用方案（邮件转发）
如果飞书 Webhook 失败，可以配置备用邮件通知：
```javascript
// 在 catch 块中添加
if (response.status >= 500) {
  // 调用备用邮件 API
  fetch('/api/backup-submit', { method: 'POST', body: formData });
}
```

---

## 附录：数据安全建议

1. **HTTPS 传输**：确保网站使用 HTTPS
2. **凭证保护**：不要将 Token 硬编码在公开代码中
3. **IP 白名单**：在飞书 Webhook 中配置服务器 IP
4. **数据脱敏**：敏感信息（如手机号）在日志中脱敏显示
5. **定期备份**：定期导出多维表格数据

---

## 参考链接

- [飞书多维表格自动化文档](https://www.feishu.cn/hc/zh-CN/articles/612376356355)
- [飞书开放平台 API 文档](https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview)
