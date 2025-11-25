#!/bin/bash

echo "================================"
echo "NO-CRM 启动脚本"
echo "================================"

# 项目目录
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 启动后端
echo ""
echo "启动后端服务..."
cd "$PROJECT_DIR/backend"
npm install
nohup node dist/main.js > "$PROJECT_DIR/logs/backend.log" 2>&1 &
echo $! > "$PROJECT_DIR/.backend.pid"
echo "✓ 后端服务已启动 (PID: $(cat $PROJECT_DIR/.backend.pid))"
echo "  端口: 3005"
echo "  日志: logs/backend.log"

# 启动前端（使用简单的 HTTP 服务器）
echo ""
echo "启动前端服务..."
cd "$PROJECT_DIR/frontend/dist"
nohup npx http-server -p 5173 > "$PROJECT_DIR/logs/frontend.log" 2>&1 &
echo $! > "$PROJECT_DIR/.frontend.pid"
echo "✓ 前端服务已启动 (PID: $(cat $PROJECT_DIR/.frontend.pid))"
echo "  端口: 5173"
echo "  日志: logs/frontend.log"

echo ""
echo "================================"
echo "✓ 服务启动成功！"
echo "================================"
echo "前端访问地址: http://localhost:5173"
echo "后端API地址:  http://localhost:3005"
echo ""
echo "停止服务请运行: ./stop.sh"
echo "================================"
