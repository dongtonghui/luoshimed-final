# 静态网站开发经验总结

> 本项目：骆氏健康官网（纯前端静态站点）
> 技术栈：HTML + CSS + JavaScript + Vercel 托管

## 📝 项目复盘

### 问题 1：UI 一致性测试遗漏

**现象**：下载中心（downloads.html）和新闻中心（news.html）使用了绿色主题，与其他页面的蓝色主题不一致；缺少移动端汉堡菜单。

**原因**：
- 这两个页面是独立开发的，没有纳入统一的设计规范检查
- 自动化测试只检查了 HTML 结构，没有检查 CSS 变量和视觉一致性
- 没有建立「新增页面必须遵循现有设计系统」的检查清单

**解决方案**：
1. 统一使用 CSS 变量系统，所有页面引用同一套 `:root` 变量
2. 建立页面模板，新页面必须复制模板结构
3. 视觉回归测试：对比新页面与首页的样式变量

```css
/* 统一主题变量 - 所有页面必须包含 */
:root {
  --blue:        #2563EB;
  --blue-dark:   #1d4ed8;
  --blue-mid:    #3b82f6;
  --blue-light:  #60a5fa;
  --blue-pale:   #eff6ff;
  --text-dark:   #1e3a5f;
  --text-body:   #374151;
  /* ... */
}
```

---

### 问题 2：JavaScript 代码截断

**现象**：7 个页面的移动端汉堡菜单无法点击，JS 代码在 `document.addEventListener('click', function(e) { if (!hamburger.contains(e.ta` 处被截断。

**原因**：
- 文件生成过程中被截断，可能是复制粘贴或文件写入时出错
- 没有进行端到端功能测试，只检查了代码存在性
- 缺少 JS 语法验证

**检测方法**：
```bash
# 检查文件末尾是否完整
for f in *.html; do
  if ! tail -1 "$f" | grep -q "</html>"; then
    echo "❌ $f 可能不完整"
  fi
done

# 检查 JS IIFE 是否闭合
grep -c "})();" "$f" || echo "⚠️ 可能有未闭合的函数"
```

**预防措施**：
1. 使用 `js-beautify` 或类似工具格式化后检查语法
2. 在 CI 中添加 HTML 结构验证
3. 关键功能（如导航菜单）必须有自动化测试

---

### 问题 3：下载按钮硬编码

**现象**：所有下载按钮的 `href` 都是 `#`，没有配置化能力。

**原因**：
- 开发时只考虑了 UI 展示，没有考虑数据驱动
- 配置文件（website-config.json）中没有设计下载链接的字段
- 没有建立「内容可配置」的设计原则

**改进后的配置化方案**：

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
          "url": "/downloads/manual.pdf",
          "size": "3.2 MB"
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

---

### 问题 4：配置文件与 HTML 不同步

**现象**：配置文件存在，但 HTML 页面没有引用配置加载器。

**原因**：
- 配置文件和页面开发是分开的
- 没有强制要求页面使用配置加载
- 缺少「配置驱动开发」的规范

**最佳实践**：
1. 所有页面必须在 `<head>` 中引入 `config-loader.js`
2. 内容必须通过 `siteConfig` 对象渲染，禁止硬编码
3. 建立配置 Schema 验证

---

## ✅ 静态网站开发检查清单

### 页面创建阶段

- [ ] 复制现有页面模板，保持相同结构
- [ ] 统一引入共享 CSS 变量文件
- [ ] 检查导航菜单与其他页面一致
- [ ] 添加 `data-page-id` 标识当前页面
- [ ] 引入 `config-loader.js`

### 视觉一致性检查

- [ ] 主题颜色使用 CSS 变量，不硬编码
- [ ] Header/Footer 结构与首页一致
- [ ] Banner 样式使用统一类名 `.page-banner`
- [ ] 按钮样式统一（`.btn-primary`, `.btn-outline`）
- [ ] 字体、字号、行高与其他页面一致

### 响应式检查

- [ ] 移动端（< 768px）汉堡菜单正常工作
- [ ] 导航链接点击后自动关闭菜单
- [ ] 点击页面外部关闭菜单
- [ ] 表格/网格在小屏幕下正常换行
- [ ] 字体大小在移动端适当缩小

### 功能检查

- [ ] 所有按钮有实际功能或配置入口
- [ ] 表单有提交处理逻辑
- [ ] 链接不指向 `#`（除非配置化填充）
- [ ] 图片有 `alt` 属性
- [ ] 所有页面有完整的 `<title>` 和 `meta description`

### 配置文件检查

- [ ] 新增页面内容在 `website-config.json` 中有配置
- [ ] 配置项包含 `_comment` 说明
- [ ] JSON 格式通过验证（无尾随逗号）
- [ ] 图片 URL 使用 HTTPS

---

## 🔧 自动化测试脚本

```bash
#!/bin/bash
# test.sh - 静态网站测试脚本

echo "=== 1. HTML 结构完整性 ==="
for f in *.html; do
  if tail -1 "$f" | grep -q "</html>"; then
    echo "✅ $f"
  else
    echo "❌ $f - 缺少结束标签"
  fi
done

echo ""
echo "=== 2. 配置加载器引入 ==="
for f in *.html; do
  if grep -q 'config-loader.js' "$f"; then
    echo "✅ $f"
  else
    echo "⚠️  $f - 未引入配置加载器"
  fi
done

echo ""
echo "=== 3. 汉堡菜单 JS 完整性 ==="
for f in *.html; do
  if grep -q "navLinks.classList.toggle('open')" "$f"; then
    echo "✅ $f"
  else
    echo "⚠️  $f - 可能缺少菜单功能"
  fi
done

echo ""
echo "=== 4. 硬编码链接检查 ==="
grep -n 'href="#"' *.html | grep -v 'href="#" class' | head -20

echo ""
echo "=== 5. JSON 配置验证 ==="
python3 -c "import json; json.load(open('website-config.json')); print('✅ 配置格式正确')"
```

---

## 📁 推荐的目录结构

```
project/
├── index.html              # 首页
├── about.html              # 关于我们
├── products.html           # 产品中心
├── product-detail.html     # 产品详情
├── downloads.html          # 下载中心
├── news.html               # 新闻中心
├── cases.html              # 案例
├── research.html           # 研发
├── clinic.html             # 诊所业务
├── contact.html            # 联系我们
│
├── css/
│   └── common.css          # 共享样式（变量、工具类）
├── js/
│   ├── config-loader.js    # 配置加载器
│   └── common.js           # 共享脚本（导航、表单等）
├── config/
│   └── website-config.json # 全站配置
├── downloads/              # 下载文件目录
│   └── *.pdf
└── skills/
    └── static-site-dev/
        └── SKILL.md        # 本文件
```

---

## 💡 关键经验总结

### 1. 配置驱动开发（CDD）
- 所有可变内容必须走配置
- HTML 只负责结构，不负责具体文案
- 配置即文档，降低维护成本

### 2. 单一事实来源
- 文案只在 `website-config.json` 中出现一次
- 多处使用的内容通过 JS 动态渲染
- 避免「改一处漏一处」

### 3. 防御性编程
- 配置加载失败时显示默认内容
- 图片加载失败显示占位图
- JS 报错不影响页面基本展示

### 4. 移动端优先检查
- 汉堡菜单是最容易被遗漏的功能
- 每次新增页面必须测试移动端
- 使用真机测试，不只是浏览器开发者工具

---

## 🚀 快速修复命令

```bash
# 修复所有文件的结束标签
for f in *.html; do
  if ! tail -1 "$f" | grep -q "</html>"; then
    echo "</body></html>" >> "$f"
  fi
done

# 检查并添加配置加载器
for f in *.html; do
  if ! grep -q 'config-loader.js' "$f"; then
    sed -i 's|</head>|<script src="config-loader.js"></script></head>|' "$f"
  fi
done
```

---

*最后更新：2026-03-15*
*维护者：AI Assistant*
