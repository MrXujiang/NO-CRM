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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    async create(createDto) {
        const users = this.storageService.read('users');
        const existing = users.find(u => u.email === createDto.email);
        if (existing) {
            throw new Error('邮箱已被使用');
        }
        const hashedPassword = await bcrypt.hash(createDto.password, 10);
        const user = {
            id: (0, uuid_1.v4)(),
            ...createDto,
            password: hashedPassword,
            role: 'sales',
            status: 'active',
            isAdmin: createDto.isAdmin || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('users', user);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    findAll(page = 1, pageSize = 10, status, departmentId) {
        let users = this.storageService.read('users');
        if (status) {
            users = users.filter(u => u.status === status);
        }
        if (departmentId) {
            users = users.filter(u => u.departmentId === departmentId);
        }
        const usersWithoutPassword = users.map(({ password, ...user }) => user);
        return this.storageService.paginate(usersWithoutPassword, page, pageSize);
    }
    findOne(id) {
        const users = this.storageService.read('users');
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new Error('用户不存在');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    findByEmail(email) {
        const users = this.storageService.read('users');
        return users.find(u => u.email === email);
    }
    update(id, updateDto) {
        const users = this.storageService.read('users');
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new Error('用户不存在');
        }
        const updated = {
            ...user,
            ...updateDto,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('users', id, updated);
        const { password, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }
    async changePassword(id, changePasswordDto) {
        const users = this.storageService.read('users');
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new Error('用户不存在');
        }
        const isValid = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
        if (!isValid) {
            throw new Error('原密码错误');
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        const updated = {
            ...user,
            password: hashedPassword,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('users', id, updated);
    }
    async resetPassword(id, newPassword) {
        const users = this.storageService.read('users');
        const user = users.find(u => u.id === id);
        if (!user) {
            throw new Error('用户不存在');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updated = {
            ...user,
            password: hashedPassword,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('users', id, updated);
    }
    remove(id) {
        this.update(id, { status: 'inactive' });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], UsersService);
//# sourceMappingURL=users.service.js.map