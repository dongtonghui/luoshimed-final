# 静态网站开发速查表

## 🎨 CSS 变量规范

```css
:root {
  /* 主色调 */
  --blue:        #2563EB;
  --blue-dark:   #1d4ed8;
  --blue-mid:    #3b82f6;
  --blue-light:  #60a5fa;
  --blue-pale:   #eff6ff;
  --blue-pale2:  #dbeafe;
  
  /* 功能色 */
  --green:       #10B981;
  --green-pale:  #f0fdf4;
  --green-mid:   #059669;
  
  /* 文字色 */
  --text-dark:   #1e3a5f;
  --text-body:   #374151;
  --text-muted:  #6b7280;
  --text-light:  #9ca3af;
  
  /* 边框背景 */
  --border:      #e2e8f0;
  --border-blue: #bfdbfe;
  --bg-white:    #ffffff;
  --bg-light:    #f8fafc;
  --bg-blue:     #f0f7ff;
}
```

## 🧩 页面结构模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>页面标题 | 骆氏健康</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* 引入共享 CSS 变量 */
    :root {
      /* 复制上面的变量 */
    }
    /* 页面特定样式 */
  </style>
  <script src="config-loader.js"></script>
</head>
<body>
  <!-- 导航 -->
  <nav id="nav">
    <div class="nav-wrap">
      <!-- Logo + 汉堡菜单 + 导航链接 -->
    </div>
  </nav>
  
  <!-- Banner -->
  <section class="page-banner">
    <!-- 面包屑 + 标题 -->
  </section>
  
  <!-- 主要内容 -->
  <main class="wrap">
    <!-- 动态渲染内容 -->
  </main>
  
  <!-- 页脚 -->
  <footer>...</footer>
  
  <!-- 脚本 -->
  <script>
    // 汉堡菜单逻辑
    // 配置渲染逻辑
  </script>
</body>
</html>
```

## 📱 移动端汉堡菜单

```html
<!-- HTML -->
<button class="nav-hamburger" id="nav-hamburger" aria-label="菜单">
  <span></span><span></span><span></span>
</button>
<nav class="nav-links">...</nav>
```

```css
/* CSS */
.nav-hamburger { display: none; }
@media (max-width: 768px) {
  .nav-hamburger { display: flex; }
  .nav-links { display: none; }
  .nav-links.open { display: flex; }
}
```

```javascript
// JS
(function() {
  var hamburger = document.getElementById('nav-hamburger');
  var navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // 点击外部关闭
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
})();
```

## ⚙️ 配置化渲染

```javascript
// 从配置读取并渲染
document.addEventListener('DOMContentLoaded', function() {
  if (typeof siteConfig !== 'undefined') {
    renderFromConfig(siteConfig);
  }
});

// 默认内容降级
function renderFromConfig(config) {
  var container = document.getElementById('content');
  if (!container) return;
  
  // 清空默认内容，使用配置渲染
  container.innerHTML = config.items.map(function(item) {
    return '<div>' + item.name + '</div>';
  }).join('');
}
```

## 🔍 快速测试命令

```bash
# 检查 HTML 完整性
for f in *.html; do tail -1 "$f" | grep -q "</html>" && echo "✅ $f" || echo "❌ $f"; done

# 检查配置加载器
for f in *.html; do grep -q 'config-loader.js' "$f" && echo "✅ $f" || echo "⚠️ $f"; done

# 检查汉堡菜单
for f in *.html; do grep -q 'nav-hamburger' "$f" && echo "✅ $f" || echo "⚠️ $f"; done

# JSON 验证
python3 -c "import json; json.load(open('website-config.json')); print('✅ JSON OK')"

# 查找硬编码链接
grep -n 'href="#"' *.html | head -10
```

## 🐛 常见问题速查

| 问题 | 原因 | 解决 |
|------|------|------|
| 汉堡菜单无法点击 | JS 截断或缺失 | 检查 `})();` 是否闭合 |
| 页面样式不一致 | CSS 变量不同 | 统一 `:root` 变量 |
| 配置不生效 | 未引入 config-loader | 添加 `<script src="config-loader.js">` |
| 移动端布局错乱 | 缺少 viewport | 添加 `<meta name="viewport"...>` |
| 下载按钮无效 | href="#" 硬编码 | 改为配置化 `href="${config.url}"` |

## 📝 配置文件结构

```json
{
  "_comment": "页面配置",
  "pageName": {
    "seo": { "title": "" },
    "banner": { "title": "", "subtitle": "" },
    "items": [
      { "id": 1, "name": "", "url": "" }
    ]
  }
}
```

## 🚀 发布前检查

- [ ] 所有页面通过 HTML 完整性测试
- [ ] 所有页面引入配置加载器
- [ ] 汉堡菜单在移动端正常工作
- [ ] 配置文件 JSON 格式正确
- [ ] 无硬编码 `#` 链接（或已配置化）
- [ ] 所有图片使用 HTTPS
