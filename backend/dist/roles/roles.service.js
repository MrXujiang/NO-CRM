"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let RolesService = class RolesService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createDto) {
        const existing = this.findByCode(createDto.code);
        if (existing) {
            throw new Error('角色编码已存在');
        }
        const role = {
            id: (0, uuid_1.v4)(),
            ...createDto,
            permissionIds: createDto.permissionIds || [],
            isSystem: false,
            status: 'active',
            userCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('roles', role);
        return role;
    }
    findAll(page = 1, pageSize = 10, status) {
        let roles = this.storageService.read('roles');
        if (status) {
            roles = roles.filter(r => r.status === status);
        }
        roles = roles.map(role => ({
            ...role,
            userCount: this.countUsers(role.id)
        }));
        return this.storageService.paginate(roles, page, pageSize);
    }
    findOne(id) {
        const roles = this.storageService.read('roles');
        const role = roles.find(r => r.id === id);
        if (!role) {
            throw new Error('角色不存在');
        }
        return {
            ...role,
            userCount: this.countUsers(role.id)
        };
    }
    findByCode(code) {
        const roles = this.storageService.read('roles');
        return roles.find(r => r.code === code);
    }
    update(id, updateDto) {
        const role = this.findOne(id);
        if (role.isSystem) {
            const updated = {
                ...role,
                permissionIds: updateDto.permissionIds ?? role.permissionIds,
                status: updateDto.status ?? role.status,
                updatedAt: new Date().toISOString(),
            };
            this.storageService.update('roles', id, updated);
            return updated;
        }
        const updated = {
            ...role,
            ...updateDto,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('roles', id, updated);
        return updated;
    }
    remove(id) {
        const role = this.findOne(id);
        if (role.isSystem) {
            throw new Error('系统角色不可删除');
        }
        const userCount = this.countUsers(role.id);
        if (userCount > 0) {
            throw new Error(`该角色下还有 ${userCount} 个用户，无法删除`);
        }
        this.storageService.delete('roles', id);
    }
    countUsers(roleId) {
        const users = this.storageService.read('users');
        return users.filter(u => u.roleId === roleId).length;
    }
    initSystemRoles(allPermissionIds) {
        const roles = this.storageService.read('roles');
        if (roles.length > 0) {
            return 0;
        }
        const systemRoles = [
            {
                name: '超级管理员',
                code: 'super_admin',
                description: '拥有所有权限的超级管理员',
                permissionIds: allPermissionIds,
            },
            {
                name: '销售经理',
                code: 'sales_manager',
                description: '销售团队管理员，可管理客户、线索、订单等',
                permissionIds: allPermissionIds.filter(id => {
                    return true;
                }),
            },
            {
                name: '普通销售',
                code: 'sales',
                description: '普通销售人员，可查看和编辑自己的客户',
                permissionIds: [],
            },
        ];
        systemRoles.forEach(roleData => {
            const role = {
                id: (0, uuid_1.v4)(),
                ...roleData,
                isSystem: true,
                status: 'active',
                userCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.storageService.create('roles', role);
        });
        return systemRoles.length;
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], RolesService);
//# sourceMappingURL=roles.service.js.map