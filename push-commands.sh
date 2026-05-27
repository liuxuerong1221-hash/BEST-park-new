#!/bin/bash

echo "=== 推送代码到新仓库 ==="
echo ""
echo "1. 添加远程仓库..."
git remote add origin https://github.com/liuxuerong1221-hash/BEST-park-new.git

echo ""
echo "2. 推送代码..."
git push -u origin main

echo ""
echo "=== 推送完成！==="
echo ""
echo "接下来请访问以下地址配置 GitHub Pages："
echo "https://github.com/liuxuerong1221-hash/BEST-park-new/settings/pages"
echo ""
echo "在 Pages 设置中："
echo "1. Source 选择 'GitHub Actions'"
echo "2. 等待几分钟后，您的新地址将是："
echo "   https://liuxuerong1221-hash.github.io/BEST-park-new/"
