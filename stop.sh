#!/bin/bash

echo "================================"
echo "NO-CRM 停止脚本"
echo "================================"

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 停止后端
if [ -f "$PROJECT_DIR/.backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_DIR/.backend.pid")
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✓ 后端服务已停止 (PID: $BACKEND_PID)"
    else
        echo "! 后端服务未运行"
    fi
    rm "$PROJECT_DIR/.backend.pid"
else
    echo "! 未找到后端进程ID"
fi

# 停止前端
if [ -f "$PROJECT_DIR/.frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PROJECT_DIR/.frontend.pid")
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✓ 前端服务已停止 (PID: $FRONTEND_PID)"
    else
        echo "! 前端服务未运行"
    fi
    rm "$PROJECT_DIR/.frontend.pid"
else
    echo "! 未找到前端进程ID"
fi

echo ""
echo "================================"
echo "✓ 服务已全部停止"
echo "================================"
