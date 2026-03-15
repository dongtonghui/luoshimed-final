# 静态网站动态配置化 - 建站思路 Skill

> 基于骆氏健康官网项目的实践经验沉淀

---

## 核心思想

**"配置驱动内容，代码负责呈现"**

将网站内容（文案、图片、数据）与表现层（HTML/CSS/JS）分离，实现：
- ✅ 非技术人员也能修改网站内容
- ✅ 批量修改一处生效，全站同步
- ✅ 降低维护成本，提高迭代效率

---

## 架构模式

### 1. 三层架构

```
┌─────────────────────────────────────────┐
│  Layer 1: 配置层 (Configuration)         │
│  - website-config.json                  │
│  - 集中管理所有内容数据                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Layer 2: 加载层 (Loader)                │
│  - config-loader.js                     │
│  - 配置解析、校验、缓存                  │
│  - DOM 操作与渲染                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Layer 3: 表现层 (Presentation)          │
│  - *.html 页面文件                       │
│  - 只负责引入 loader，无业务逻辑         │
└─────────────────────────────────────────┘
```

### 2. 配置结构设计原则

```json
{
  "_comment": "配置说明注释",
  
  "global": {
    "_comment": "全局配置 - 影响所有页面",
    "company": {},      
    "contact": {},      
    "navigation": {},   
    "footer": {}        
  },
  
  "home": {
    "_comment": "首页特定配置",
    "seo": {},          
    "hero": {},         
    "sections": {}      
  },
  
  "pageName": {
    "_comment": "其他页面配置",
    "seo": {},
    "banner": {},       
    "content": {}       
  }
}
```

---

## 实施步骤（标准工作流程）

### Step 1: 现状分析

```bash
# 1.1 梳理现有页面
ls *.html | wc -l                    
grep -l "config-loader" *.html       

# 1.2 识别重复代码
grep -c "async function applyConfig" *.html  

# 1.3 提取可配置内容
# - 公司名称、联系方式（全局）
# - 各页面标题、副标题（页面级）
# - 产品/案例/新闻列表（数据级）
```

### Step 2: 设计配置 Schema

**原则：**
- 先设计全局配置，再设计页面配置
- 相同结构的数据使用数组（如产品列表）
- 配置项命名与 DOM 选择器对应

### Step 3: 开发配置加载器

**核心功能模块：**

```javascript
// 1. 配置加载
async function loadConfig() {
  const response = await fetch('website-config.json');
  return await response.json();
}

// 2. 配置获取器
function getGlobalConfig() { }
function getPageConfig(pageName) { }

// 3. DOM 操作工具
function setText(selector, content) { }
function setHTML(selector, html) { }
function updateSEO(seoConfig) { }
function updateBanner(bannerConfig) { }

// 4. 页面渲染器（每个页面一个）
function renderHomePage() { }
function renderAboutPage() { }

// 5. 自动初始化
function autoInit() { }

// 6. 导出 API
window.ConfigLoader = { };
```

### Step 4: 页面接入改造

**标准接入方式（每个页面只需添加一行）：**

```html
<script src="config-loader.js"></script>
```

**清理工作：**
- 删除页面内嵌的重复配置代码
- 删除硬编码的文案（保留 DOM 结构）

### Step 5: 验证测试

```bash
# 启动本地服务器
python3 -m http.server 8000

# 验证要点：
# 1. 配置加载是否成功
# 2. 全局配置是否生效
# 3. 页面配置是否生效
# 4. 修改配置后刷新是否生效
```

### Step 6: 文档与交付

- `CONFIG_README.md` - 配置修改指南
- `STATIC_SITE_SKILL.md` - 技术沉淀文档

---

## 设计模式与最佳实践

### 1. 配置命名规范

```
global.company.name          -> .nav-logo-name, .footer-logo-name
global.company.description   -> .footer-brand-desc
global.contact.phone         -> .footer-phone
page.banner.title            -> .page-banner-title
page.banner.subtitle         -> .page-banner-sub
```

### 2. 错误处理机制

```javascript
// 配置加载失败时回退到默认值
function setText(selector, content) {
  if (!content) return;
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (el) el.textContent = content;
  });
}

// 配置加载失败捕获
async function loadConfig() {
  try {
    const response = await fetch('website-config.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('配置加载失败:', error);
    return null;
  }
}
```

### 3. SEO 动态更新

```javascript
function updateSEO(seoConfig) {
  if (seoConfig.title) {
    document.title = seoConfig.title;
  }
  if (seoConfig.description) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = seoConfig.description;
  }
}
```

### 4. 页面自动识别

```javascript
function autoInit() {
  const path = window.location.pathname;
  const pageName = path.includes('index') ? 'home' :
                   path.includes('about') ? 'about' :
                   path.includes('products') ? 'products' : 'home';
  
  const renderers = {
    'home': renderHomePage,
    'about': renderAboutPage
  };
  
  if (renderers[pageName]) renderers[pageName]();
}
```

---

## 常见场景解决方案

### 场景 1: 批量修改公司联系方式

**传统方式：** 修改 10 个 HTML 文件  
**配置化方式：** 修改 1 处配置

```json
"global": {
  "contact": {
    "phone": "400-888-8888"
  }
}
```

### 场景 2: 新增产品

**传统方式：** 修改 HTML 结构  
**配置化方式：** 在 JSON 数组中添加对象

```json
"products": {
  "items": [
    { "id": 1, "name": "产品1" },
    { "id": 2, "name": "产品2" },
    { "id": 3, "name": "新产品" }
  ]
}
```

### 场景 3: 修改页面标题

```json
"pageName": {
  "seo": {
    "title": "新的页面标题"
  }
}
```

---

## 项目文件结构

```
project/
├── website-config.json      # 核心配置文件
├── config-loader.js         # 配置加载引擎
├── CONFIG_README.md         # 用户使用文档
├── STATIC_SITE_SKILL.md     # 技术沉淀文档
├── index.html               # 首页
├── about.html               # 关于页
├── products.html            # 产品页
└── ...                      # 其他页面
```

---

## 工具函数库

```javascript
// 模板渲染
function renderTemplate(template, variables) {
  return template.replace(/\{(\w+)\}/g, (match, key) => 
    variables[key] !== undefined ? variables[key] : match
  );
}

// 批量设置文本
function setText(selector, content) {
  if (!content) return;
  document.querySelectorAll(selector).forEach(el => {
    if (el) el.textContent = content;
  });
}

// 配置测试
window.testConfig = function() {
  console.log('配置测试:', {
    global: ConfigLoader.getGlobal(),
    page: ConfigLoader.getPage('current')
  });
};
```

---

## 经验教训与踩坑记录

> 基于骆氏健康官网项目的真实踩坑经历，每次完成项目后应更新此章节

### 🔴 问题 1：UI 一致性测试遗漏

**现象**：下载中心（downloads.html）和新闻中心（news.html）使用了绿色主题（`--primary: #1a4a3a`），与其他页面的蓝色主题（`--blue: #2563EB`）不一致；且缺少移动端汉堡菜单。

**根本原因**：
- 这两个页面是独立开发的，没有纳入统一的设计规范检查
- 自动化测试只检查了 HTML 结构，没有检查 CSS 变量和视觉一致性
- 没有建立「新增页面必须遵循现有设计系统」的检查清单

**检测方法**：
```bash
# 检查所有页面是否使用统一的 CSS 变量
grep -l "var(--blue)" *.html | wc -l  # 应该等于 HTML 文件总数
grep -l "var(--primary)" *.html       # 应该为 0（或统一使用）
```

**解决方案**：
1. 建立页面模板，新页面必须复制模板结构
2. 统一使用 CSS 变量系统，禁止硬编码颜色
3. 视觉回归测试：对比新页面与首页的样式变量

```css
/* ✅ 正确：使用 CSS 变量 */
.btn-primary { background: var(--blue); }

/* ❌ 错误：硬编码颜色 */
.btn-primary { background: #1a4a3a; }
```

---

### 🔴 问题 2：JavaScript 代码截断

**现象**：7 个页面的移动端汉堡菜单无法点击，JS 代码在 `if (!hamburger.contains(e.ta` 处被截断，导致语法错误。

**根本原因**：
- 文件生成过程中被截断（可能是复制粘贴或批量替换时出错）
- 没有进行端到端功能测试，只检查了代码存在性
- 缺少 JS 语法验证和 HTML 完整性检查

**检测方法**：
```bash
# 检查文件末尾是否完整（必须以 </html> 结尾）
for f in *.html; do
  if ! tail -1 "$f" | grep -q "</html>"; then
    echo "❌ $f 文件不完整"
  fi
done

# 检查 JS IIFE 是否正确闭合
grep -c "})();" "$f" || echo "⚠️ 可能有未闭合的函数"

# 检查 script 标签是否平衡
opens=$(grep -o '<script' "$f" | wc -l)
closes=$(grep -o '</script>' "$f" | wc -l)
[ "$opens" -eq "$closes" ] && echo "✅ 标签平衡" || echo "❌ 标签不平衡"
```

**预防措施**：
1. 关键功能（如导航菜单）必须有自动化测试
2. 使用 `js-beautify` 格式化后检查语法
3. 在 CI 中添加 HTML 结构验证

---

### 🔴 问题 3：下载按钮硬编码（无配置化能力）

**现象**：产品详情页和下载中心的所有下载按钮 `href` 都是 `#`，没有实际的下载链接，也没有配置化的能力。

**根本原因**：
- 开发时只考虑了 UI 展示，没有考虑数据驱动
- 配置文件（website-config.json）中没有设计下载链接的字段
- 没有建立「按钮必须有实际功能或可配置」的设计原则

**解决方案 - 配置化改造**：

```json
// website-config.json
{
  "products": {
    "productList": [{
      "id": 1,
      "name": "产品名称",
      "downloads": [
        {
          "type": "manual",
          "name": "产品手册",
          "desc": "产品介绍、规格参数（PDF）",
          "url": "/downloads/manual.pdf",
          "size": "3.2 MB"
        },
        {
          "type": "cert",
          "name": "医疗器械注册证",
          "desc": "合规资质证书（PDF）",
          "url": "/downloads/cert.pdf",
          "size": "1.5 MB",
          "requireAuth": true
        }
      ]
    }]
  },
  "downloads": {
    "files": [{
      "id": 1,
      "name": "使用说明书",
      "fileUrl": "/downloads/file.pdf",
      "requireAuth": false
    }]
  }
}
```

**原则**：所有按钮必须有实际功能，如果暂时没有链接，也要设计成可配置的。

---

### 🔴 问题 4：配置文件与页面不同步

**现象**：配置文件（website-config.json）已存在，但部分 HTML 页面没有引入 `config-loader.js`，导致配置成了摆设。

**根本原因**：
- 配置文件和页面开发是分离的
- 没有强制要求页面使用配置加载
- 缺少「配置驱动开发」的规范约束

**检测方法**：
```bash
# 检查所有页面是否引入配置加载器
for f in *.html; do
  if ! grep -q 'config-loader.js' "$f"; then
    echo "❌ $f 未引入配置加载器"
  fi
done
```

**最佳实践**：
1. 页面模板中强制包含 `<script src="config-loader.js"></script>`
2. 内容必须通过 `siteConfig` 对象渲染，禁止硬编码
3. 建立配置 Schema 验证

---

### 🟡 其他注意事项

| 问题 | 检测方法 | 解决方案 |
|------|---------|---------|
| 图片使用 HTTP | `grep "http://" *.html` | 强制使用 HTTPS |
| 缺少 viewport | `grep -L "viewport" *.html` | 添加 meta viewport |
| 链接指向空页面 | `grep 'href="#"' *.html \| wc -l` | 配置化或添加占位提示 |
| 移动端布局错乱 | 真机测试 | 使用响应式断点 |

---

## 自动化测试脚本

```bash
#!/bin/bash
# test.sh - 静态网站发布前自动化测试

echo "=== 测试 1: HTML 结构完整性 ==="
for f in *.html; do
  if tail -1 "$f" | grep -q "</html>"; then
    echo "✅ $f"
  else
    echo "❌ $f - 缺少结束标签"
  fi
done

echo ""
echo "=== 测试 2: 配置加载器引入 ==="
for f in *.html; do
  if grep -q 'config-loader.js' "$f"; then
    echo "✅ $f"
  else
    echo "⚠️  $f - 未引入配置加载器"
  fi
done

echo ""
echo "=== 测试 3: 汉堡菜单 JS 完整性 ==="
for f in *.html; do
  if grep -q "navLinks.classList.toggle('open')" "$f"; then
    echo "✅ $f"
  else
    echo "⚠️  $f - 可能缺少菜单功能"
  fi
done

echo ""
echo "=== 测试 4: 硬编码链接检查 ==="
count=$(grep -c 'href="#"' *.html 2>/dev/null || echo "0")
echo "发现 $count 个 href=\"#\" 链接（建议配置化）"
grep -n 'href="#"' *.html 2>/dev/null | head -10

echo ""
echo "=== 测试 5: JSON 配置验证 ==="
python3 -c "import json; json.load(open('website-config.json')); print('✅ 配置格式正确')" 2>&1 || echo "❌ JSON 格式错误"

echo ""
echo "=== 测试 6: CSS 变量一致性 ==="
blue_count=$(grep -l "var(--blue)" *.html 2>/dev/null | wc -l)
total=$(ls *.html 2>/dev/null | wc -l)
echo "使用蓝色主题的页面: $blue_count / $total"

echo ""
echo "测试完成"
```

---

## 验证清单（发布前检查）

### 基础结构
- [ ] 配置文件 JSON 格式正确（通过 Python/Node 验证）
- [ ] 所有 HTML 页面以 `</html>` 结尾
- [ ] 所有 HTML 页面引入 `config-loader.js`
- [ ] `<head>` 中包含 `<meta name="viewport">`
- [ ] `<head>` 中包含 `<meta charset="UTF-8">`

### 功能完整性
- [ ] 没有重复的 `applyConfig` 代码
- [ ] 全局配置（公司信息、联系方式）正确加载
- [ ] 各页面 SEO 配置正确加载
- [ ] 各页面 Banner 配置正确加载
- [ ] 修改配置后刷新页面生效
- [ ] 配置加载失败时页面正常显示（降级方案）

### 移动端适配
- [ ] 所有页面有汉堡菜单按钮（`#nav-hamburger`）
- [ ] 点击汉堡菜单展开/收起导航
- [ ] 点击导航链接后自动关闭菜单
- [ ] 点击页面外部区域关闭菜单
- [ ] 导航滚动时添加阴影效果（`#nav.scrolled`）

### UI 一致性
- [ ] 所有页面使用统一的 CSS 变量（`--blue`, `--text-dark` 等）
- [ ] 主题颜色一致（无绿色/红色等突兀配色）
- [ ] Header 结构一致（Logo + 导航 + CTA）
- [ ] Footer 结构一致
- [ ] Banner 样式一致（`.page-banner`）

### 内容配置化
- [ ] 无硬编码的公司名称、联系方式
- [ ] 所有按钮有实际功能或可配置链接
- [ ] 下载链接已配置（非 `href="#"`）
- [ ] 图片 URL 使用 HTTPS
- [ ] 所有 `<img>` 有 `alt` 属性

### 代码质量
- [ ] 无 `console.log` 调试代码（或已注释）
- [ ] JS 语法无错误（通过浏览器控制台检查）
- [ ] 无死链接（通过工具检查）
- [ ] 文件编码统一为 UTF-8

---

## 优势总结

| 维度 | 传统静态网站 | 配置化静态网站 |
|------|-------------|---------------|
| 内容修改 | 改代码，风险高 | 改配置，零风险 |
| 批量更新 | 多文件修改 | 一处修改，全站生效 |
| 维护成本 | 高（需懂 HTML） | 低（只需改 JSON） |
| 迭代速度 | 慢 | 快（分钟级） |
| 可扩展性 | 差 | 好 |

---

## 适用场景

**推荐使用：**
- 企业官网（内容相对稳定）
- 产品展示站点
- 营销落地页集合
- 需要频繁更新文案的网站

**不适用：**
- 大型电商平台（需要数据库）
- 用户生成内容站点
- 实时数据展示站点

---

## 后续演进方向

1. **可视化配置编辑器** - 界面化修改配置
2. **配置版本管理** - 变更历史记录
3. **多语言支持** - 配置文件中增加多语言字段
4. **配置热更新** - 不刷新页面实时更新
5. **配置校验工具** - 提交前自动检查

---

> 本 Skill 基于骆氏健康官网项目实践总结，可作为后续同类项目的标准工作流程。
