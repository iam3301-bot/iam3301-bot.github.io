#!/bin/bash

# GameBox 全局主题系统注入脚本
# 为所有HTML页面自动注入主题系统

SCRIPT_TAG='<script src="global-theme-system.js"></script>'
INJECT_MARKER='</body>'

echo "🎨 开始注入全局主题系统..."
echo ""

# 查找所有HTML文件（排除测试文件）
HTML_FILES=$(find . -maxdepth 1 -name "*.html" -type f ! -name "test-*.html" ! -name "*-debug.html" | sort)

TOTAL=0
SUCCESS=0
SKIPPED=0

for file in $HTML_FILES; do
  TOTAL=$((TOTAL + 1))
  filename=$(basename "$file")
  
  # 检查是否已经注入
  if grep -q "global-theme-system.js" "$file"; then
    echo "⏭️  跳过 $filename (已存在)"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  
  # 检查是否有</body>标签
  if ! grep -q "</body>" "$file"; then
    echo "⚠️  跳过 $filename (没有</body>标签)"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  
  # 创建备份
  cp "$file" "$file.backup"
  
  # 在</body>前注入脚本
  sed -i "s|</body>|<!-- 全局主题系统 -->\n$SCRIPT_TAG\n</body>|" "$file"
  
  if [ $? -eq 0 ]; then
    echo "✅ 注入成功: $filename"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "❌ 注入失败: $filename"
    # 恢复备份
    mv "$file.backup" "$file"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 注入统计:"
echo "   总计: $TOTAL 个文件"
echo "   成功: $SUCCESS 个"
echo "   跳过: $SKIPPED 个"
echo "━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ 全局主题系统注入完成！"
