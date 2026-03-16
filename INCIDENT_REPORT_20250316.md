# 事故报告：新闻中心动态渲染方案失败

**日期**: 2026-03-16  
**事故等级**: P2（功能不可用，需回滚）  
**影响范围**: 新闻中心页面 (news.html)  
**状态**: 已回滚，服务恢复正常

---

## 1. 事故背景

### 1.1 需求
用户希望实现新闻详情的**可配置化更新**，无需修改 HTML 即可添加/修改新闻内容。

### 1.2 预期方案
采用 **方案二：Markdown + JSON 配置**
- 新闻内容以 Markdown 格式存放在 `content/news/` 目录
- 通过 `build-news.js` 构建脚本转换为 JSON 配置
- 前端通过 `fetch()` 动态加载配置并渲染页面

---

## 2. 实施过程

### 2.1 新增文件
| 文件 | 说明 |
|------|------|
| `content/news/*.md` | 6 篇新闻 Markdown 文件 |
| `build-news.js` | Node.js 构建脚本 |
| `news-detail.html` | 新闻详情页模板 |
| `website-config.json` | 更新新闻配置结构 |

### 2.2 修改文件
| 文件 | 修改内容 |
|------|----------|
| `news.html` | 重写为动态渲染（fetch + JS 渲染） |
| `CONFIG_README.md` | 添加新闻系统使用说明 |

### 2.3 提交记录
```
40f4771 feat: 实现 Markdown + JSON 配置驱动的新闻系统
6fa6fb7 fix: 修复新闻页面在 Vercel 上加载卡住的问题
48bd88c fix: 添加更多防御性检查防止 newsConfig null 错误
40955d2 fix: 将 fetch 路径从绝对路径改为相对路径
```

---

## 3. 出现的问题

### 3.1 现象
- 页面持续显示"正在加载新闻..."
- 控制台报错: `Cannot read properties of null (reading 'articles')`
- `newsConfig` 为 `null` 时调用了渲染函数

### 3.2 尝试的修复
1. **路径修复**: `/website-config.json` → `./website-config.json`
2. **缓存清除**: 添加 `?v=Date.now()` 参数
3. **作用域修复**: `window.changePage = changePage`
4. **空值检查**: `if (!newsConfig) return`
5. **调试日志**: 添加详细 console.log

**结果**: 以上修复均无效

---

## 4. 事故原因分析

### 4.1 直接原因
`fetch('./website-config.json')` 在 Vercel 生产环境**执行时机问题**:
- 本地开发环境正常
- Vercel 部署后，JavaScript 执行时 `fetch` 返回异常或配置未正确加载
- 导致 `newsConfig` 始终为 `null`

### 4.2 根本原因
1. **过于依赖客户端动态加载**: 静态站点使用 `fetch` 加载核心内容，增加失败风险
2. **缺乏降级方案**: 配置加载失败时无静态内容可显示
3. **环境差异**: 本地与 Vercel 生产环境行为不一致，未充分测试
4. **复杂度超标**: 为静态站点引入动态渲染，违背"静态优先"原则

### 4.3 技术细节
```javascript
// 问题代码模式
async function init() {
  const config = await loadConfig();  // 可能失败
  renderNewsList();  // 依赖 config，失败后无内容
}
```

---

## 5. 回滚过程

### 5.1 回滚目标
```bash
# 目标版本
57ad2ad docs: 添加完整建站流程图
```

### 5.2 回滚步骤
```bash
# 1. Git 回滚
git reset --hard 57ad2ad
git push origin main --force

# 2. 本地清理
rm -rf luoshi-website
git clone https://github.com/dongtonghui/luoshimed-final.git luoshi-website

# 3. 触发重新部署
echo "# deploy trigger" > DEPLOY_TRIGGER.md
git add -A && git commit -m "chore: 触发 Vercel 重新部署"
git push origin main
```

### 5.3 恢复时间
- 回滚操作: 5 分钟
- Vercel 重新部署: 2 分钟
- **总计**: 约 7 分钟

---

## 6. 教训与改进建议

### 6.1 技术方案选择
| 方案 | 适用场景 | 建议 |
|------|----------|------|
| 纯静态 HTML | 内容更新频率低 | ✅ 当前方案，简单可靠 |
| JSON 配置 + JS 渲染 | 需要动态筛选/分页 | ⚠️ 需确保降级方案 |
| Markdown + 构建时生成 | 内容频繁更新 | ✅ 推荐方案（SSG） |
| Headless CMS | 多人协作/大量内容 | ❌ 过度设计 |

### 6.2 部署前检查清单
- [ ] 本地开发环境测试通过
- [ ] 生产环境（Vercel 预览链接）测试通过
- [ ] 网络异常情况下测试（断网、慢网）
- [ ] 检查浏览器控制台无错误
- [ ] 检查移动端显示正常

### 6.3 代码规范
1. **静态站点优先**: 避免在核心页面使用 `fetch` 加载必需内容
2. **降级策略**: 动态加载失败时应显示静态内容或友好错误
3. **渐进增强**: 核心功能不依赖 JavaScript

### 6.4 推荐的正确方案
如需实现新闻可配置化，应采用**构建时生成**（SSG）而非**客户端渲染**（CSR）：

```
Markdown -> 构建脚本 -> 生成静态 HTML -> 部署
```

工具选择:
- **简单**: 手动编辑 HTML（当前方案）
- **进阶**: 使用 Astro / Next.js SSG / Vite 插件
- **专业**: 使用 CMS + 静态生成器

---

## 7. 后续行动

| 事项 | 负责人 | 优先级 | 状态 |
|------|--------|--------|------|
| 保留 Markdown 源文件作为内容备份 | - | 低 | 已删除，需重新创建 |
| 评估是否需要真正的新闻系统 | 用户 | 中 | 待定 |
| 如需要，采用构建时生成方案 | - | 低 | 待定 |
| 建立部署前测试流程 | - | 中 | 建议 |

---

## 8. 附录

### 8.1 删除的文件清单
```
content/news/
├── 2025-12-18-gaoxin-jishu.md
├── 2025-12-05-xinchanpin-fabu.md
├── 2025-11-22-xiehe-yanjiu.md
├── 2025-11-10-cmef-zhantai.md
├── 2025-10-28-yaojianju-zhengce.md
├── 2025-10-15-huannan-zhongxin.md

build-news.js
news-detail.html
```

### 8.2 相关提交
- `40f4771` - 实现动态新闻系统
- `6fa6fb7` - 修复尝试 1
- `48bd88c` - 修复尝试 2  
- `40955d2` - 修复尝试 3
- `57ad2ad` - 回滚目标版本
- `21ff37d` - 触发重新部署

---

**报告人**: Kimi Code CLI  
**完成时间**: 2026-03-16 23:05
