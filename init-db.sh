#!/bin/bash

echo "================================"
echo "NO-CRM 数据库初始化"
echo "================================"

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PROJECT_DIR/backend"
node dist/init-db.js

echo ""
echo "================================"
echo "✓ 数据库初始化完成"
echo "================================"
echo "默认管理员账号: admin@jitword.com"
echo "默认密码: admin111"
echo "================================"
