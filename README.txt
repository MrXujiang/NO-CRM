NO-CRM 轻量级客户管理系统 - 生产版本
=====================================

目录结构：
├── frontend/        # 前端构建产物
│   └── dist/       # 静态文件
├── backend/        # 后端构建产物
│   ├── dist/       # 编译后的 JS 文件
│   └── node_modules/ # 依赖包
├── data/           # 数据存储目录（自动生成）
├── uploads/        # 文件上传目录（自动生成）
├── logs/           # 日志目录（自动生成）
├── start.sh        # 启动脚本
├── stop.sh         # 停止脚本
└── init-db.sh      # 数据库初始化脚本

快速开始：
---------

1. 首次运行，初始化数据库：
   chmod +x init-db.sh
   ./init-db.sh

2. 启动服务：
   chmod +x start.sh
   ./start.sh

3. 访问系统：
   前端地址: http://localhost:5173
   后端地址: http://localhost:3005

4. 默认登录：
   用户名: admin@jitword.com
   密码: admin111

5. 停止服务：
   chmod +x stop.sh
   ./stop.sh

环境要求：
---------
- Node.js >= 18.0.0
- npm >= 9.0.0

生产环境部署：
-------------
建议使用 Nginx 反向代理 + PM2 进程管理

1. 使用 Nginx 代理前端静态文件和后端 API
2. 使用 PM2 管理后端进程：
   npm install -g pm2
   cd backend
   pm2 start dist/main.js --name no-crm-backend
   pm2 save
   pm2 startup

技术栈：
--------
前端：Vue 3 + TypeScript + TDesign + Vite
后端：NestJS + TypeScript + JWT

更多信息：
---------
GitHub: https://github.com/MrXujiang/NO-CRM
在线体验: http://no-crm.flowmix.cn

=====================================
