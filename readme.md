<div align="center">
  <img src="https://img.shields.io/badge/NO--CRM-轻量级客户管理系统-0052D9?style=for-the-badge&logo=customer&logoColor=white" alt="NO-CRM">

  <h1>NO-CRM</h1>
  <p>🚀 轻量级 CRM 客户关系管理系统</p>

[![GitHub Stars](https://img.shields.io/github/stars/MrXujiang/NO-CRM?style=social)](https://github.com/MrXujiang/NO-CRM)
[![GitHub Forks](https://img.shields.io/github/forks/MrXujiang/NO-CRM?style=social)](https://github.com/MrXujiang/NO-CRM)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js)](https://vuejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-e0234e?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://www.typescriptlang.org/)

  <p>
    <a href="#✨-特性">特性</a> •
    <a href="#🎯-在线体验">在线体验</a> •
    <a href="#📦-技术栈">技术栈</a> •
    <a href="#🚀-快速开始">快速开始</a> •
    <a href="#📸-项目截图">项目截图</a> •
    <a href="#🛠️-功能模块">功能模块</a> •
    <a href="#📖-文档">文档</a>
  </p>
</div>

---

## ✨ 特性

- 🎨 **现代化 UI** - 基于 TDesign Vue Next，提供精美的企业级界面
- 📊 **数据可视化** - ECharts 驱动的数据大屏和图表分析
- 🔐 **完善的权限系统** - RBAC 权限模型，支持角色、部门、用户细粒度权限控制
- 🤖 **AI 智能助手** - 集成 AI 功能，提供智能推荐和辅助决策
- 🔄 **工作流引擎** - 可视化流程设计器，支持复杂业务流程编排
- 📝 **表单设计器** - 拖拽式表单设计，支持多种字段类型和校验规则
- 📱 **移动端适配** - 完美支持各种设备，响应式设计
- 💾 **轻量化存储** - 基于 JSON 文件存储，无需复杂数据库配置
- 🚀 **开箱即用** - 简单配置即可快速部署上线
- 🔧 **高度可定制** - 模块化设计，易于扩展和二次开发

---

## 🎯 在线体验

🌐 **Plus版体验地址**: [http://no-crm.mvtable.com](http://no-crm.mvtable.com)

> 💡 提示：在线体验版本为商业演示环境，数据会定期重置

### 合作产品

1. **协同AI文档**：https://jitword.com
2. **H5零代码平台**：https://dooring.vip
3. **AI知识库平台**：https://know.jitword.com
4. **pxcharts多维表格**：https://pxcharts.turntip.cn

---

## 📦 技术栈

### 前端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | 3.5.13 | 渐进式 JavaScript 框架 |
| TypeScript | 5.7.3 | JavaScript 的超集，提供类型安全 |
| Vite | 6.0.5 | 下一代前端构建工具 |
| TDesign Vue Next | 1.10.6 | 腾讯企业级组件库 |
| Pinia | 2.3.0 | Vue 官方状态管理库 |
| Vue Router | 4.5.0 | Vue 官方路由管理器 |
| ECharts | 6.0.0 | 强大的数据可视化库 |
| Vue Flow | 1.47.0 | 流程图编辑器 |
| Axios | 1.7.9 | HTTP 客户端 |

### 后端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| NestJS | 11.0.1 | 渐进式 Node.js 框架 |
| TypeScript | 5.7.3 | 类型安全的开发体验 |
| Passport JWT | 4.0.1 | JWT 身份验证策略 |
| Bcrypt | 5.1.1 | 密码加密库 |
| Multer | 2.0.2 | 文件上传中间件 |
| Class Validator | 0.14.2 | 基于装饰器的参数验证 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/MrXujiang/NO-CRM.git
cd NO-CRM
```

#### 2. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install
```

#### 3. 初始化数据库

```bash
# mac 或者linux系统
./init-db.sh
```

#### 4. 启动项目`

**生产模式**

```bash
# 启动前端服务
node .server.js "./frontend/dist"
# 启动后端服务
cd backend
npm run start:prod
```

#### 5. 访问应用

- 前端地址: [http://localhost:5173](http://localhost:5173)
- 后端地址: [http://localhost:3005](http://localhost:3005)
- 默认管理员账号: `admin@jitword.com` / `admin111`

---

## 🛠️ 功能模块

### 核心模块

<table>
  <tr>
    <td width="50%">
      <h4>📊 数据大屏</h4>
      <ul>
        <li>业绩统计可视化</li>
        <li>实时数据监控</li>
        <li>多维度图表分析</li>
      </ul>
    </td>
    <td width="50%">
      <h4>👥 客户管理</h4>
      <ul>
        <li>客户信息管理</li>
        <li>线索跟进记录</li>
        <li>销售机会管理</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h4>📦 产品管理</h4>
      <ul>
        <li>产品分类体系</li>
        <li>产品信息维护</li>
        <li>库存状态跟踪</li>
      </ul>
    </td>
    <td>
      <h4>📝 订单管理</h4>
      <ul>
        <li>订单全流程跟踪</li>
        <li>业绩统计分析</li>
        <li>销售数据报表</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h4>📄 合同管理</h4>
      <ul>
        <li>合同模板管理</li>
        <li>合同在线生成</li>
        <li>合同状态跟踪</li>
      </ul>
    </td>
    <td>
      <h4>✅ 任务管理</h4>
      <ul>
        <li>任务创建分配</li>
        <li>进度跟踪提醒</li>
        <li>协作评论功能</li>
      </ul>
    </td>
  </tr>
</table>

### 高级功能

<table>
  <tr>
    <td width="50%">
      <h4>🔄 工作流引擎</h4>
      <ul>
        <li>可视化流程设计器</li>
        <li>流程实例管理</li>
        <li>待办任务中心</li>
        <li>流程数据分析</li>
      </ul>
    </td>
    <td width="50%">
      <h4>📋 表单系统</h4>
      <ul>
        <li>拖拽式表单设计</li>
        <li>表单数据采集</li>
        <li>数据统计分析</li>
        <li>公开表单发布</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h4>🤖 AI 智能助手</h4>
      <ul>
        <li>智能客户推荐</li>
        <li>销售机会分析</li>
        <li>业务数据洞察</li>
      </ul>
    </td>
    <td>
      <h4>✅ 审批流程</h4>
      <ul>
        <li>多级审批配置</li>
        <li>审批流转跟踪</li>
        <li>审批统计分析</li>
      </ul>
    </td>
  </tr>
</table>

### 系统管理

- 🔐 **权限管理** - 角色、权限、用户、部门多维度权限控制
- 📊 **活动记录** - 完整的操作日志和活动追踪
- ⚙️ **系统配置** - 灵活的系统参数配置

---

## 📸 项目截图

> 💡 提示：访问 [在线体验地址](http://no-crm.mvtable.com) 查看完整功能

### 数据大屏
![数据大屏](docs/screenshots/dashboard.png)

### 客户管理
![客户管理](docs/screenshots/customers.png)

### 工作流设计器
![工作流设计器](docs/screenshots/workflow-designer.png)

### 表单设计器
![表单设计器](docs/screenshots/form-designer.png)

---

## 📖 文档

- [快速开始](QUICKSTART.md) - 新手入门指南
- [权限配置指南](PERMISSION_GUIDE.md) - 权限系统配置说明
- [部署指南](docs/deployment.md) - 生产环境部署文档
- [开发指南](docs/development.md) - 开发者文档
- [API 文档](docs/api.md) - 接口文档说明

---

## 🗂️ 项目结构

```
NO-CRM/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── api/          # API 接口
│   │   ├── assets/       # 静态资源
│   │   ├── components/   # 公共组件
│   │   ├── layouts/      # 布局组件
│   │   ├── router/       # 路由配置
│   │   ├── stores/       # 状态管理
│   │   ├── utils/        # 工具函数
│   │   └── views/        # 页面组件
│   └── package.json
├── backend/              # 后端项目
│   ├── src/
│   │   ├── auth/         # 认证模块
│   │   ├── common/       # 公共模块
│   │   ├── modules/      # 业务模块
│   │   │   ├── users/
│   │   │   ├── customers/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── workflows/
│   │   │   └── ...
│   │   └── main.ts       # 入口文件
│   └── package.json
├── data/                 # 数据存储目录
├── uploads/              # 文件上传目录
├── deploy/               # 部署脚本
├── docs/                 # 项目文档
└── README.md
```

---

## 🔧 配置说明

### 环境变量

**后端配置** (`backend/.env`)

```env
# 服务端口
PORT=3005

# JWT 配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# 文件上传
UPLOAD_DIR=../uploads
MAX_FILE_SIZE=10485760

# CORS 配置
CORS_ORIGIN=http://localhost:5173
```

**前端配置** (`frontend/.env`)

```env
# API 地址
VITE_API_BASE_URL=http://localhost:3005
```

---

## 🚢 部署

### Docker 部署

```bash
# 构建镜像
docker build -t no-crm .

# 运行容器
docker run -d -p 3005:3005 -p 5173:5173 no-crm
```

### 手动部署

```bash
# 使用部署脚本
./deploy/deploy.sh

# 或使用快捷脚本
./start.sh    # 启动
./stop.sh     # 停止
```

详细部署说明请参考 [部署指南](docs/deployment.md)

---

## 🤝 贡献

欢迎贡献代码、提出问题和建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源

---

## 💖 支持项目

如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！

---

## 📮 联系方式

- 作者：[MrXujiang](https://github.com/MrXujiang)
- 项目地址：[https://github.com/MrXujiang/NO-CRM](https://github.com/MrXujiang/NO-CRM)
- 在线体验：[http://no-crm.mvtable.com](http://no-crm.mvtable.com)

---

<div align="center">
  <p>Made with ❤️ by MrXujiang</p>
  <p>Copyright © 2025 NO-CRM</p>
</div>
