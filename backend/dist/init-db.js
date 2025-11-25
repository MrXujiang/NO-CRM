"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const dataPath = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}
async function initDatabase() {
    console.log('开始初始化数据库...');
    const usersFile = path.join(dataPath, 'users.json');
    const usersExist = fs.existsSync(usersFile);
    if (usersExist) {
        try {
            const existingUsers = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
            if (existingUsers.length > 0) {
                console.log('⚠️  用户数据已存在，跳过初始化');
                return;
            }
        }
        catch (error) {
            console.log('用户数据文件损坏，重新初始化...');
        }
    }
    const hashedPassword = await bcrypt.hash('admin111', 10);
    const adminUser = {
        id: (0, uuid_1.v4)(),
        email: 'admin@jitword.com',
        password: hashedPassword,
        name: '系统管理员',
        role: 'admin',
        status: 'active',
        isAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(usersFile, JSON.stringify([adminUser], null, 2), 'utf8');
    console.log('✅ 已创建默认管理员账号:');
    console.log('   邮箱: admin@jitword.com');
    console.log('   密码: admin111');
    const collections = [
        'customers', 'leads', 'activities', 'tasks',
        'permissions', 'roles', 'departments',
        'contract-templates', 'products', 'product-categories',
        'orders', 'contracts', 'forms', 'form-submissions',
        'workflow-definitions', 'workflow-instances', 'workflow-tasks'
    ];
    for (const collection of collections) {
        const filePath = path.join(dataPath, `${collection}.json`);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
        }
    }
    console.log('✅ 数据库初始化完成!');
    console.log('');
    console.log('⚠️  重要提示：');
    console.log('   首次部署后，请访问以下接口初始化权限和角色：');
    console.log('   curl -X POST http://your-domain/api/init-system');
    console.log('');
}
initDatabase().catch(console.error);
//# sourceMappingURL=init-db.js.map