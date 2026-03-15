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

## 验证清单（发布前检查）

- [ ] 配置文件 JSON 格式正确
- [ ] 所有 HTML 页面引入 config-loader.js
- [ ] 没有重复的 applyConfig 代码
- [ ] 全局配置（公司信息、联系方式）正确加载
- [ ] 各页面 SEO 配置正确加载
- [ ] 各页面 Banner 配置正确加载
- [ ] 修改配置后刷新页面生效
- [ ] 配置加载失败时页面正常显示

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
