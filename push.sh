#!/bin/bash
echo "📦 正在提交并推送到 GitHub..."
git add .
git commit -m "${1:-更新网站内容 $(date '+%Y-%m-%d %H:%M')}"
git push origin main
echo "✅ 推送完成！"
