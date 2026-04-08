# 骆氏健康官网 - 项目目录结构

## 建议的目录结构

```
luoshi-website/
├── 📄 index.html                 # 首页
├── 📄 about.html                 # 关于我们
├── 📄 products.html              # 产品中心
├── 📄 product-detail.html        # 产品详情
├── 📄 cases.html                 # 合作案例
├── 📄 cases-medical.html         # 医疗案例
├── 📄 case-detail.html           # 案例详情
├── 📄 clinic.html                # 诊所业务
├── 📄 research.html              # 研发实力
├── 📄 news.html                  # 新闻中心
├── 📄 downloads.html             # 下载中心
├── 📄 contact.html               # 联系我们
│
├── 📁 css/                       # 样式文件
│   └── nav-dropdown.css
│
├── 📁 js/                        # JavaScript文件
│   └── config-loader.js          # 配置加载器
│
├── 📁 images/                    # 图片资源
│   └── ...
│
├── 📁 data/                      # 数据文件
│   └── cases.json
│
├── 📁 downloads/                 # 下载文件
│   └── ...
│
├── 📁 website_icons/             # 网站图标
│   └── ...
│
├── 📁 docs/                      # 文档
│   └── ...
│
├── ⚙️ website-config.json        # 网站配置文件
├── 📋 README.md                  # 项目说明
└── 🚀 push.sh                    # 部署脚本
```

## 文件分类说明

### 页面文件 (*.html)
- 所有HTML页面放在根目录
- 便于直接访问，URL更简洁

### 资源文件
- `css/` - 所有样式表
- `js/` - 所有JavaScript文件
- `images/` - 所有图片
- `data/` - JSON数据文件
- `downloads/` - 可下载文件

### 配置文件
- `website-config.json` - 网站内容配置
- `README.md` - 项目文档

## 需要移动的文件

1. `config-loader.js` → `js/config-loader.js`

## 需要更新的引用

移动 `config-loader.js` 后，需要更新以下文件中的引用：
- `index.html`
- `about.html`
- `products.html`
- `product-detail.html`
- `cases.html`
- `cases-medical.html`
- `case-detail.html`
- `clinic.html`
- `research.html`
- `news.html`
- `downloads.html`
- `contact.html`

将：
```html
<script src="config-loader.js"></script>
```

改为：
```html
<script src="js/config-loader.js"></script>
```
