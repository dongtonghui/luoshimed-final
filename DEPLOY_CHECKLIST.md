# 网站内容更新检查清单

## 核心原则

> **配置文件是唯一直接编辑的内容源，HTML 应通过工具生成，不应手动修改硬编码内容。**

---

## 当前架构问题

### 双源数据问题
- `website-config.json` - 配置源（正确）
- `index.html` 硬编码 - 后备显示（容易过时）

当两者不一致时：
1. 用户先看到 HTML 硬编码内容
2. JS 加载后尝试替换为配置内容
3. 替换过程中出现闪烁
4. 如果 JS 失败，用户看到错误内容

---

## 推荐的长期解决方案

### 方案A：构建时渲染（推荐）

使用静态站点生成器（如 11ty、Vite、自定义脚本）在构建时将配置文件渲染到 HTML 模板中。

```javascript
// build.js - 构建脚本示例
const config = require('./website-config.json');
const fs = require('fs');

// 读取模板
let template = fs.readFileSync('./index.template.html', 'utf8');

// 替换占位符
template = template
  .replace('{{hero.title}}', config.home.hero.title.line1)
  .replace('{{hero.subtitle}}', config.home.hero.subtitle);

// 输出最终 HTML
fs.writeFileSync('./index.html', template);
```

优点：
- 部署时内容已确定，无运行时替换
- SEO 友好，首屏加载快
- 无内容闪烁

---

### 方案B：服务端渲染 (SSR)

使用简单的服务端模板引擎（如 Nunjucks、EJS）：

```javascript
// server.js
const express = require('express');
const config = require('./website-config.json');

app.get('/', (req, res) => {
  res.render('index', { config: config.home });
});
```

---

### 方案C：纯配置驱动（当前方案优化）

保留当前架构，但进行以下改进：

#### 1. HTML 初始状态处理
将所有可配置内容区域默认隐藏，配置加载后再显示：

```html
<!-- 添加 data-config-target 标记 -->
<section id="advantages" data-config-target="advantages">
  <!-- 使用加载占位符，不显示具体内容 -->
  <div class="loading-skeleton">加载中...</div>
</section>
```

#### 2. 配置渲染完成后移除骨架屏

```javascript
// config-loader.js
function renderHomePage() {
  const config = getPageConfig('home');
  if (!config) {
    showError('配置加载失败');
    return;
  }
  
  // 渲染内容
  renderSection('advantages', config.advantages);
  
  // 移除骨架屏，显示内容
  document.querySelector('#advantages .loading-skeleton')?.remove();
}
```

#### 3. 增加配置与 HTML 的一致性检查脚本

```javascript
// verify-config.js
const config = require('./website-config.json');
const fs = require('fs');

const html = fs.readFileSync('./index.html', 'utf8');
const mismatches = [];

// 检查关键文本是否一致
if (!html.includes(config.home.hero.title.line1)) {
  mismatches.push(`Hero标题不匹配: ${config.home.hero.title.line1}`);
}

if (mismatches.length > 0) {
  console.error('配置与 HTML 不一致:');
  mismatches.forEach(m => console.error('  - ' + m));
  process.exit(1);
}
```

在 CI/CD 流程中运行此检查，阻止不一致的部署。

---

## 短期改进措施（立即可做）

### 1. 修改 config-loader.js，增加配置加载失败时的回退显示

```javascript
// config-loader.js
async function loadConfig() {
  try {
    const response = await fetch('website-config.json?_t=' + Date.now());
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return await response.json();
  } catch (error) {
    console.error('配置加载失败:', error);
    // 显示错误提示而非错误内容
    document.body.classList.add('config-error');
    return null;
  }
}
```

### 2. HTML 中添加配置未加载警告

```css
/* 配置未加载时的视觉提示 */
.config-not-loaded [data-config-target]::before {
  content: "⚠️ 内容加载中...";
  display: block;
  padding: 20px;
  background: #fff3cd;
  color: #856404;
  text-align: center;
}
```

### 3. 建立配置变更检查流程

每次修改 `website-config.json` 后，必须执行：

```bash
# 1. 检查 HTML 是否需要同步更新
npm run verify-config

# 2. 本地预览
npm run dev

# 3. 确认所有区块内容正确后再提交
```

---

## 推荐的最终架构

```
website-config.json (数据源)
    ↓
build.js (构建脚本读取配置)
    ↓
index.template.html (模板文件，无硬编码内容)
    ↓
dist/index.html (生成的最终文件)
    ↓
部署到服务器/CDN
```

**关键变化：**
- `index.html` 改为 `index.template.html`（模板）
- 构建时生成最终的 `index.html`
- 部署的是生成后的文件，不再直接编辑 HTML

---

## 结论

当前问题的核心：**配置和 HTML 是两个独立维护的数据源**。

最佳解决方案是**引入构建步骤**，让配置文件成为唯一数据源，HTML 通过工具自动生成。这样可以彻底避免不一致问题。

如果暂时无法引入构建步骤，则应该：
1. 建立配置变更检查清单
2. 每次修改配置后手动同步 HTML
3. 添加配置加载失败的错误处理
4. 考虑使用骨架屏避免内容闪烁
