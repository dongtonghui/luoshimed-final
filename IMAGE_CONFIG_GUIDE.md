# 骆氏健康官网 - 图片配置说明文档

> 本文档汇总了全站所有需要配置的图片资源，方便统一准备和替换。
> 对应的配置文件为：`website-config.json`
> 图片统一存放目录：`images/`

---

## 一、通用图片规范

| 项目 | 建议规格 |
|------|---------|
| **格式** | JPG 为主（照片类），PNG（Logo/需透明底），WebP（可选） |
| **命名** | 英文小写 + 连字符 `-`，如 `product-ls1.jpg`、`team-luoshuxin.jpg` |
| **存放** | 统一放入 `images/` 目录下，引用路径写为 `images/xxx.jpg` |
| **单张大小** | 建议 `< 150KB`（大图可放宽至 `< 300KB`） |
| **分辨率** | 按建议尺寸准备，保证在 Retina 屏下清晰即可 |

---

## 二、全局固定图片

以下图片不通过 `website-config.json` 配置，直接写入 HTML 中，修改时需替换物理文件。

| 用途 | 文件路径 | 所在页面位置 | 建议规格 |
|------|---------|-------------|---------|
| **网站 Logo** | `images/logo.png` | 顶部导航栏 + 页脚底部 | 正方形 1:1，建议 **512×512px 以上**，PNG 透明底，`< 300KB` |
| **浏览器图标** | `images/logo.png` | 全站所有页面 `<head>` 标签页 favicon | 同上（已配置完成） |

---

## 三、首页 (`index.html`) 图片配置

配置键：`home`

### 3.1 核心产品系列 (`home.products.items`)
共 **3** 款产品，每款 1 张主图。

| 配置字段 | 当前产品名称 | 显示尺寸 | 建议图片规格 |
|---------|-------------|---------|-------------|
| `home.products.items[0].image` | 坐式牵引治疗机 LS-1 | 卡片横向图 | **600×360px**，比例 5:3，JPG/WebP |
| `home.products.items[1].image` | 颈椎牵引椅 LSQY-1型 | 卡片横向图 | **600×360px**，比例 5:3，JPG/WebP |
| `home.products.items[2].image` | 脊柱保健垫 | 卡片横向图 | **600×360px**，比例 5:3，JPG/WebP |

> ⚠️ 当前状态：全部使用 Unsplash 网络占位图，**需替换为真实产品图**。

### 3.2 合作案例 (`home.cases.items`)
共 **3** 个案例，每款 1 张背景图（带半透明遮罩）。

| 配置字段 | 当前案例名称 | 建议图片规格 |
|---------|-------------|-------------|
| `home.cases.items[0].image` | 四川骆氏正脊康元中医诊所 | **500×240px**，比例 ≈ 2:1，JPG |
| `home.cases.items[1].image` | 河南省中西医结合医院 | **500×240px**，比例 ≈ 2:1，JPG |
| `home.cases.items[2].image` | 上海工程技术大学 | **500×240px**，比例 ≈ 2:1，JPG |

> 💡 建议选用色彩鲜明、主体居中的图片，因为卡片上有 `opacity: 0.45~0.6` 的半透明深色遮罩。

---

## 四、关于我们 (`about.html`) 图片配置

配置键：`about`

### 4.1 品牌故事配图 (`about.story`)

| 配置字段 | 用途 | 当前文件 | 建议规格 |
|---------|------|---------|---------|
| `about.story.section1.image` | 品牌故事左侧大图 | `images/about-story-1.jpg` | **800×600px**，比例 4:3，JPG |
| `about.story.section2.image` | 科技融合左侧大图 | `images/about-story-2.jpg` | **800×600px**，比例 4:3，JPG |

> ✅ 当前状态：图片已存在，如需更新直接替换文件即可。

### 4.2 核心团队头像 (`about.team.members`)
共 **4** 位成员，88×88px 圆形显示。

| 配置字段 | 成员 | 当前文件 | 建议规格 |
|---------|------|---------|---------|
| `about.team.members[0].avatar` | 骆书信 | `images/team-luoshuxin.jpg` | **200×200px**，1:1 正方形，JPG |
| `about.team.members[1].avatar` | 田新宇 | `images/team-tianxinyu.jpg` | **200×200px**，1:1 正方形，JPG |
| `about.team.members[2].avatar` | 骆飞飞 | `images/team-luofeifei.jpg` | **200×200px**，1:1 正方形，JPG |
| `about.team.members[3].avatar` | 骆鹏飞 | `images/team-luopengfei.jpg` | **200×200px**，1:1 正方形，JPG |

> ✅ 当前状态：图片已存在且文件名已修复，可正常显示。如需更新直接替换文件即可。

### 4.3 资质荣誉墙 (`about.certifications.items`)
目前 **4** 张卡片，使用 emoji 图标（📋、✅、🏅、📄），**不需要图片文件**。

---

## 五、产品中心 (`products.html`) 图片配置

配置键：`products`

### 5.1 产品列表主图 (`products.productList`)
共 **5** 款产品，每款 1 张主图。

| 配置字段 | 产品名称 | 建议图片规格 |
|---------|---------|-------------|
| `products.productList[0].image` | 坐式牵引治疗机 LS-1 | **600×360px**，5:3，JPG/WebP |
| `products.productList[1].image` | 颈椎牵引椅 LSQY-1型 | **600×360px**，5:3，JPG/WebP |
| `products.productList[2].image` | 脊柱保健垫 | **600×360px**，5:3，JPG/WebP |
| `products.productList[3].image` | 多功能牵引床 | **600×360px**，5:3，JPG/WebP |
| `products.productList[4].image` | 膝关节牵引器 | **600×360px**，5:3，JPG/WebP |

> ⚠️ 当前状态：全部使用 Unsplash 网络占位图，**需替换为真实产品实拍图或白底图**。

---

## 六、合作案例 (`cases.html`) 图片配置

配置键：`cases`

### 6.1 案例卡片图 (`cases.caseList`)
共 **6** 个案例。

| 配置字段 | 案例名称 | 建议图片规格 |
|---------|---------|-------------|
| `cases.caseList[0].image` | 四川骆氏正脊体验中心 | **500×240px**，2:1，JPG |
| `cases.caseList[1].image` | 上海惠元医院 | **500×240px**，2:1，JPG |
| `cases.caseList[2].image` | 上海工程技术大学 | **500×240px**，2:1，JPG |
| `cases.caseList[3].image` | 西南区域分销合作伙伴 | **500×240px**，2:1，JPG |
| `cases.caseList[4].image` | 河南省中西医结合医院 | **500×240px**，2:1，JPG |
| `cases.caseList[5].image` | 运动康复连锁机构 | **500×240px**，2:1，JPG |

### 6.2 深度案例大图 (`cases.featuredCase.image`)

| 配置字段 | 用途 | 建议图片规格 |
|---------|------|-------------|
| `cases.featuredCase.image` | 左侧详情大图 | **700×460px**，约 3:2，JPG |

### 6.3 合作伙伴 Logo 墙 (`cases.partners.logos`)
当前配置为**文字列表**（12 个机构名称）。

> 如需替换为真实 Logo 图片，需要额外修改 `config-loader.js` 的渲染逻辑。有需求时请联系开发处理。

---

## 七、研发实力 (`research.html`) 图片配置

配置键：`research`

当前页面所有展示均为数据数字 + emoji 图标 + 文字，**没有使用任何真实图片文件**。

---

## 八、诊所业务 (`clinic.html`) 图片配置

配置键：`clinic`

### 8.1 成功案例图 (`clinic.cases.items`)
共 **3** 个诊所案例。

| 配置字段 | 案例名称 | 建议图片规格 |
|---------|---------|-------------|
| `clinic.cases.items[0].image` | 四川骆氏正脊体验中心 | **500×200px**，5:2，JPG |
| `clinic.cases.items[1].image` | 上海骆氏正脊馆 | **500×200px**，5:2，JPG |
| `clinic.cases.items[2].image` | 北京骆氏体验中心 | **500×200px**，5:2，JPG |

> ⚠️ 当前状态：全部使用 Unsplash 占位图，**建议替换为门店实拍图或装修效果图**。

其他区域（赋能模块、流程、支持体系）均使用 emoji 图标，无需图片。

---

## 九、联系我们 (`contact.html`) 图片配置

配置键：`contact`

当前页面无图片配置需求。地图区域为 HTML 占位，如需嵌入真实地图，直接替换 HTML 中的地图 iframe 代码即可。

---

## 十、下载中心 (`downloads.html`) 图片配置

配置键：`downloads`

下载列表使用 emoji 图标（📄、📋、✅ 等）作为文件类型标识，**不需要图片文件**。

---

## 十一、新闻中心 (`news.html`) 图片配置

配置键：`news`

### 11.1 焦点新闻大图 (`news.featured.image`)

| 配置字段 | 用途 | 建议图片规格 |
|---------|------|-------------|
| `news.featured.image` | 顶部焦点新闻横幅图 | **800×400px**，2:1，JPG |

### 11.2 新闻列表封面图 (`news.articles[].image`)
共 **6** 篇新闻，每篇 1 张封面。

| 配置字段 | 新闻标题 | 建议图片规格 |
|---------|---------|-------------|
| `news.articles[0].image` | 荣获国家高新技术企业认定 | **800×400px**，2:1，JPG |
| `news.articles[1].image` | 第三代智能物理治疗系统发布 | **800×400px**，2:1，JPG |
| `news.articles[2].image` | 与北京协和医院联合临床研究 | **800×400px**，2:1，JPG |
| `news.articles[3].image` | 参展 CMEF 博览会 | **800×400px**，2:1，JPG |
| `news.articles[4].image` | 国家药监局发布新版指导原则 | **800×400px**，2:1，JPG |
| `news.articles[5].image` | 华南区域服务中心正式启用 | **800×400px**，2:1，JPG |

> 💡 说明：`news` 配置区由 `build-news.js` 自动生成，但 `image` 字段可以手动修改替换。

---

## 十二、产品详情页 (`product-detail.html`)

当前产品详情页**没有独立的 JSON 配置块**，页面上的产品大图和详情图目前写死在 HTML 中，尚未接入配置系统。

> 如需把产品详情页也接入 `website-config.json` 进行动态配置，需要额外开发支持。

---

## 十三、图片准备优先级清单

### 🔴 高优先级（核心展示，建议优先准备）
1. `images/logo.png` — 全局 Logo（✅ 已存在）
2. `images/team-*.jpg` × 4 — 团队头像（✅ 已存在）
3. `images/about-story-1.jpg` / `about-story-2.jpg` — 品牌故事图（✅ 已存在）
4. `products.productList[].image` × 5 — 产品中心主图（⚠️ 当前为占位图）
5. `home.products.items[].image` × 3 — 首页产品图（⚠️ 当前为占位图）

### 🟡 中优先级
6. `cases.caseList[].image` × 6 + `featuredCase.image` — 案例图（⚠️ 占位图）
7. `clinic.cases.items[].image` × 3 — 诊所案例图（⚠️ 占位图）
8. `news.articles[].image` × 6 + `featured.image` — 新闻封面图（⚠️ 占位图）

---

## 十四、如何修改配置

### 方式一：直接编辑 `website-config.json`
找到对应字段，将 Unsplash 链接替换为本地图片路径：

```json
"image": "images/product-ls1.jpg"
```

### 方式二：直接替换物理文件
对于 `images/logo.png`、`images/about-story-*.jpg`、`images/team-*.jpg`，只需将新图片覆盖同名文件，无需修改配置。

---

## 十五、建议命名对照表

| 内容 | 建议文件名 |
|------|-----------|
| 坐式牵引治疗机 | `product-ls1.jpg` |
| 颈椎牵引椅 | `product-lsqy1.jpg` |
| 脊柱保健垫 | `product-cushion.jpg` |
| 多功能牵引床 | `product-traction-bed.jpg` |
| 膝关节牵引器 | `product-knee.jpg` |
| 首页案例-四川诊所 | `case-home-sichuan.jpg` |
| 首页案例-河南医院 | `case-home-henan.jpg` |
| 首页案例-工程大 | `case-home-uni.jpg` |
| 案例页-四川体验中心 | `case-sichuan.jpg` |
| 案例页-上海惠元医院 | `case-huiyuan.jpg` |
| 诊所页-四川体验中心 | `clinic-sichuan.jpg` |
| 诊所页-上海正脊馆 | `clinic-shanghai.jpg` |
| 新闻-高新技术企业 | `news-hightech.jpg` |
| 新闻-产品发布 | `news-product-launch.jpg` |

---

*文档生成时间：2026-04-03*
