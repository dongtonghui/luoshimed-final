# 骆氏健康官网 - 配置文件使用说明

## 📁 文件说明

- `website-config.json` - 全站配置文件（核心文件）
- `config-loader.js` - 配置加载器（可选，用于动态加载）
- `CONFIG_README.md` - 本说明文档

## 🚀 快速开始

### 方式一：纯静态修改（推荐）

直接编辑 `website-config.json` 文件，然后手动将修改后的文案同步到对应的 HTML 文件中。

### 方式二：动态加载（高级）

在 HTML 中引入配置加载器：

```html
<script src="config-loader.js"></script>
```

## 📋 配置结构说明

```json
{
  "global": {          // 全局配置 - 影响所有页面
    "company": {},     // 公司信息
    "contact": {},     // 联系方式
    "navigation": {},  // 导航菜单
    "footer": {}       // 页脚配置
  },
  "home": {},          // 首页配置
  "about": {},         // 关于我们页面
  "products": {},      // 产品中心页面
  "cases": {},         // 合作案例页面
  "research": {},      // 研发实力页面
  "clinic": {},        // 诊所业务页面
  "contact": {}        // 联系我们页面
}
```

## ✏️ 常见修改示例

### 1. 修改公司名称

在 `website-config.json` 中找到：

```json
"global": {
  "company": {
    "name": "骆氏健康",           // ← 修改公司名称
    "fullName": "上海骆氏健康科技有限公司",
    "slogan": "科技正脊找骆氏"
  }
}
```

### 2. 修改联系电话

在 `website-config.json` 中找到：

```json
"global": {
  "contact": {
    "phone": "400-XXX-XXXX",      // ← 修改电话
    "email": "info@luoshi-health.com",
    "address": "上海市 XX 区 XX 路 XXX 号"
  }
}
```

### 3. 修改首页主标题

在 `website-config.json` 中找到：

```json
"home": {
  "hero": {
    "title": {
      "line1": "科技正脊",        // ← 修改第一行
      "line2": "找骆氏"           // ← 修改第二行
    }
  }
}
```

### 4. 修改产品信息

在 `website-config.json` 中找到：

```json
"products": {
  "productList": [
    {
      "id": 1,
      "name": "医用脊柱牵引床 LX-T100",  // ← 修改产品名称
      "description": "产品描述...",        // ← 修改产品描述
      "image": "图片URL"                   // ← 修改产品图片
    }
  ]
}
```

### 5. 添加/删除导航菜单项

在 `website-config.json` 中找到：

```json
"global": {
  "navigation": {
    "items": [
      {"id": "about", "label": "关于骆氏", "url": "about.html"},
      {"id": "products", "label": "产品中心", "url": "products.html"}
      // 添加新的菜单项...
    ]
  }
}
```

### 6. 修改资质证书信息

在 `about` 页面的配置中找到：

```json
"about": {
  "certifications": {
    "items": [
      {
        "icon": "📋",
        "name": "医疗器械经营许可证",      // ← 修改证书名称
        "num": "沪药监械经营 XXXX 号",     // ← 修改证书编号
        "badge": "✓ 合规认证"
      }
    ]
  }
}
```

## 📝 各页面配置速查

### 首页 (home)

| 区域 | 配置路径 |
|------|----------|
| SEO信息 | `home.seo` |
| 首屏大图 | `home.hero` |
| 三大优势 | `home.advantages` |
| 产品展示 | `home.products` |
| 合作案例 | `home.cases` |
| 分销商表单 | `home.form` |

### 关于我们 (about)

| 区域 | 配置路径 |
|------|----------|
| 页面标题 | `about.banner` |
| 品牌故事1 | `about.story.section1` |
| 品牌故事2 | `about.story.section2` |
| 发展历程 | `about.timeline` |
| 资质荣誉 | `about.certifications` |
| 核心团队 | `about.team` |

### 产品中心 (products)

| 区域 | 配置路径 |
|------|----------|
| 筛选标签 | `products.filter` |
| 产品列表 | `products.productList` |

### 合作案例 (cases)

| 区域 | 配置路径 |
|------|----------|
| 案例列表 | `cases.caseList` |
| 深度案例 | `cases.featuredCase` |
| 合作伙伴 | `cases.partners` |

### 研发实力 (research)

| 区域 | 配置路径 |
|------|----------|
| 统计数据 | `research.stats` |
| 技术专利 | `research.patents` |
| 研发流程 | `research.process` |
| 合作机构 | `research.collaborations` |

### 诊所业务 (clinic)

| 区域 | 配置路径 |
|------|----------|
| 三大赋能 | `clinic.value` |
| 合作流程 | `clinic.flow` |
| 支持体系 | `clinic.support` |
| 加盟表单 | `clinic.form` |

### 联系我们 (contact)

| 区域 | 配置路径 |
|------|----------|
| 联系卡片 | `contact.contactCards` |
| 联系表单 | `contact.form` |

## 🎨 图片配置

所有图片地址都可以在配置中找到，格式为：

```json
"image": "https://images.unsplash.com/photo-xxxxx"
```

替换为实际图片地址即可。

## ⚠️ 注意事项

1. **JSON格式**: 修改时务必保持 JSON 格式正确，注意逗号、引号等符号
2. **特殊字符**: 如果文案中包含双引号 `"`，需要进行转义 `\"`
3. **数组格式**: 添加/删除列表项时注意保持数组格式 `[{}, {}, {}]`
4. **备份**: 修改前建议备份原配置文件

## 🔧 修改步骤总结

1. 打开 `website-config.json`
2. 找到需要修改的配置项（参考上面的速查表）
3. 修改文案或图片地址
4. 保存文件
5. 同步更新到对应的 HTML 文件（如使用纯静态方式）
6. 刷新页面查看效果

## 💡 提示

- 每个配置项前面都有 `_comment` 注释，说明该区域的作用
- 所有文案都可以通过搜索关键词快速定位
- 建议配合代码编辑器的 JSON 格式化功能使用

---

如有问题，请联系技术支持。
