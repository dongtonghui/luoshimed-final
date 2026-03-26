# 网站图标资源

本文件夹包含从骆氏健康官网提取的所有图标，已转换为 **SVG** 和 **PNG** 两种格式。

## 📁 文件夹结构

```
website_icons/
├── svg/          # SVG 格式图标（矢量，可无损缩放）
├── png/          # PNG 格式图标（位图，128x128 像素）
├── extract_icons.py        # 图标提取脚本
├── convert_svg_to_png.py   # SVG转PNG脚本
└── README.md     # 本说明文件
```

## 📊 图标统计

- **SVG 文件**: 73 个
- **PNG 文件**: 73 个

## 🎨 图标类型

### 1. Emoji 图标（25个）
用于页面中的装饰性图标：

| 文件名 | 图标 | 用途 |
|--------|------|------|
| trophy.svg/png | 🏆 | 优势/成就 |
| scroll.svg/png | 📜 | 证书/文档 |
| hospital.svg/png | 🏥 | 医院/医疗机构 |
| medal.svg/png | 🏅 | 奖项/专利 |
| chart.svg/png | 📊 | 数据/统计 |
| calendar.svg/png | 📅 | 时间/历史 |
| school.svg/png | 🏫 | 高校/教育 |
| microscope.svg/png | 🔬 | 研究/实验室 |
| phone.svg/png | 📞 | 联系电话 |
| email.svg/png | ✉️ | 邮件 |
| location.svg/png | 📍 | 地址/位置 |
| map.svg/png | 🗺️ | 地图 |
| store.svg/png | 🏪 | 门店/诊所 |
| handshake.svg/png | 🤝 | 合作/分销 |
| wrench.svg/png | 🔧 | 工具/售后 |
| package.svg/png | 📦 | 产品/配送 |
| tools.svg/png | 🛠 | 技术支持 |
| chart_up.svg/png | 📈 | 增长/趋势 |
| lock.svg/png | 🔒 | 安全/保护 |
| clipboard.svg/png | 📋 | 资质证书 |
| check.svg/png | ✅ | 认证/完成 |
| document.svg/png | 📄 | 文档/文件 |
| shield.svg/png | 🛡 | 保障/防护 |
| info.svg/png | ℹ️ | 信息/提示 |

### 2. SVG 内联图标（48个）
从 HTML 文件中提取的内联 SVG 图标：

| 文件名 | 说明 |
|--------|------|
| logo_*.svg/png | 各页面的 Logo 图标（首页、关于我们、产品中心等） |
| arrow_right.svg/png | 箭头图标（阅读更多按钮） |
| icon_downloads_*.svg/png | 下载中心的各类文件图标 |
| icon_case-detail_*.svg/png | 案例详情页图标 |

## 🔧 使用方法

### 在网页中使用 SVG
```html
<!-- 直接嵌入 SVG 代码 -->
<img src="website_icons/svg/medal.svg" alt="奖项">

<!-- 或作为背景图 -->
<div style="background-image: url('website_icons/svg/trophy.svg')"></div>
```

### 在网页中使用 PNG
```html
<img src="website_icons/png/medal.png" alt="奖项" width="32" height="32">
```

### 在设计软件中使用
- **SVG**: 可直接导入 Figma、Sketch、Adobe Illustrator 等
- **PNG**: 适用于任何设计软件，推荐尺寸 128x128

## ⚠️ 注意事项

1. **前端网页未受影响**: 这些图标是额外提取的副本，原网站继续正常使用
2. **图标尺寸**: PNG 图标统一为 128x128 像素
3. **颜色**: SVG 图标保持原有颜色，可在 CSS 中修改 `fill` 或 `stroke`

## 📝 生成时间

2026-03-26 自动生成
