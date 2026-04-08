# 产品规格参数配置说明

## 概述

产品详情页中的「产品规格参数」表格用于展示产品的详细技术规格和参数信息。

## 当前实现方式

目前产品规格参数是**静态 HTML** 直接写在 `product-detail.html` 文件中，位置大约在第 743-746 行：

```html
<table class="spec-table">
  <thead><tr><th>参数项目</th><th>规格值</th></tr></thead>
  <tbody>
    <tr><td>产品名称</td><td>坐式牵引治疗机</td></tr>
    <tr><td>型号</td><td>LS-1</td></tr>
    <tr><td>注册证号</td><td>豫械注准20212090151</td></tr>
    ...
  </tbody>
</table>
```

## 如何修改规格参数

### 方法 1：直接修改 HTML（推荐）

1. 打开 `product-detail.html` 文件
2. 找到 `<table class="spec-table">` 部分
3. 直接修改 `<tbody>` 内的表格行

**格式示例：**
```html
<tr><td>参数名称</td><td>参数值</td></tr>
```

### 方法 2：通过 website-config.json 配置（需修改代码）

如需通过配置文件管理规格参数，可按以下步骤操作：

#### 步骤 1：在 website-config.json 中添加规格配置

在产品配置对象中添加 `specifications` 数组：

```json
{
  "id": 1,
  "category": "medical",
  "name": "坐式牵引治疗机 LS-1",
  ...
  "specifications": [
    {
      "label": "产品名称",
      "value": "坐式牵引治疗机"
    },
    {
      "label": "型号",
      "value": "LS-1"
    },
    {
      "label": "注册证号",
      "value": "豫械注准20212090151"
    },
    {
      "label": "最大牵引力",
      "value": ">800N"
    },
    {
      "label": "动态牵引",
      "value": "支持"
    },
    {
      "label": "立式结构",
      "value": "支持"
    },
    {
      "label": "全脊柱",
      "value": "支持"
    },
    {
      "label": "供电方式",
      "value": "AC 220V / 50Hz"
    },
    {
      "label": "噪音指标",
      "value": "≤ 40 dB"
    },
    {
      "label": "安全保护",
      "value": "过载保护 + 急停开关"
    },
    {
      "label": "适用场景",
      "value": "医疗机构骨科 / 康复科"
    }
  ]
}
```

#### 步骤 2：修改 config-loader.js 渲染逻辑

在 `renderProductDetailPage()` 函数中添加规格参数渲染：

```javascript
// 渲染规格参数表
if (product.specifications && Array.isArray(product.specifications)) {
  const specTableBody = document.querySelector('.spec-table tbody');
  if (specTableBody) {
    specTableBody.innerHTML = product.specifications.map(spec => 
      `<tr><td>${spec.label}</td><td>${spec.value}</td></tr>`
    ).join('');
  }
}
```

#### 步骤 3：修改 product-detail.html

将静态表格替换为动态容器：

```html
<table class="spec-table">
  <thead><tr><th>参数项目</th><th>规格值</th></tr></thead>
  <tbody>
    <!-- 动态渲染 -->
  </tbody>
</table>
```

## 产品规格参数字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| label | string | 参数项目名称 | "产品名称" |
| value | string | 参数规格值 | "坐式牵引治疗机" |

## 当前各产品规格参数位置

| 产品 | 所在文件 | 行号范围 |
|------|---------|---------|
| 坐式牵引治疗机 LS-1 | product-detail.html | ~745 |
| 颈椎牵引椅 LSQY-1型 | product-detail.html | ~750 |
| 多功能牵引床 LZT-100 | product-detail.html | ~755 |
| 智能关节康复仪 LZT-400 | product-detail.html | ~760 |
| 便携式膝关节牵引器 LZT-500 | product-detail.html | ~765 |

## 样式说明

规格参数表格样式定义在 `product-detail.html` 的 `<style>` 标签中：

```css
.spec-section { padding: 72px 0; background: var(--bg-light); }
.spec-table { 
  width: 100%; 
  border-collapse: collapse; 
  background: #fff; 
  border-radius: 14px; 
  overflow: hidden; 
  box-shadow: 0 2px 16px rgba(0,0,0,0.04); 
}
.spec-table th, .spec-table td { 
  padding: 14px 20px; 
  text-align: left; 
  font-size: 14px; 
  border-bottom: 1px solid var(--border); 
}
.spec-table th { 
  background: var(--blue); 
  color: #fff; 
  font-weight: 600; 
}
```

## 注意事项

1. 如需添加新产品，需要手动在 HTML 中添加对应的规格参数表格
2. 建议保持参数项的命名一致性
3. 对于无具体数值的参数，可使用 "—" 表示
4. 表格支持响应式布局，移动端会自动调整列宽

## 示例：完整的规格参数配置

```json
{
  "specifications": [
    { "label": "产品名称", "value": "坐式牵引治疗机" },
    { "label": "型号", "value": "LS-1" },
    { "label": "注册证号", "value": "豫械注准20212090151" },
    { "label": "最大牵引力", "value": ">800N" },
    { "label": "动态牵引", "value": "支持" },
    { "label": "立式结构", "value": "支持" },
    { "label": "全脊柱", "value": "支持" },
    { "label": "供电方式", "value": "AC 220V / 50Hz" },
    { "label": "噪音指标", "value": "≤ 40 dB" },
    { "label": "安全保护", "value": "过载保护 + 急停开关" },
    { "label": "适用场景", "value": "医疗机构骨科 / 康复科" }
  ]
}
```
