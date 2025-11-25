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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const json_storage_service_1 = require("../common/json-storage.service");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    storageService;
    jwtService;
    constructor(storageService, jwtService) {
        this.storageService = storageService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const users = this.storageService.read('users');
        const existingUser = users.find(u => u.email === registerDto.email);
        if (existingUser) {
            throw new common_1.UnauthorizedException('邮箱已被注册');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = {
            id: (0, uuid_1.v4)(),
            email: registerDto.email,
            password: hashedPassword,
            name: registerDto.name,
            role: registerDto.role,
            status: 'active',
            isAdmin: registerDto.role === 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('users', newUser);
        const token = this.jwtService.sign({
            sub: newUser.id,
            email: newUser.email,
            role: newUser.role
        });
        const { password, ...userWithoutPassword } = newUser;
        return { user: userWithoutPassword, token };
    }
    async login(loginDto) {
        const users = this.storageService.read('users');
        const user = users.find(u => u.email === loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('邮箱或密码错误');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('邮箱或密码错误');
        }
        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role
        });
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async validateUser(userId) {
        const user = this.storageService.findById('users', userId);
        if (!user)
            return null;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map