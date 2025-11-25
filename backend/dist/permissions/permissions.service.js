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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let PermissionsService = class PermissionsService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    initSystemPermissions() {
        const permissions = this.storageService.read('permissions');
        if (permissions.length > 0) {
            return 0;
        }
        const resources = [
            'customer', 'lead', 'activity', 'task', 'product', 'product_category',
            'order', 'contract', 'contract_template', 'user', 'role',
            'department', 'permission', 'statistics', 'system', 'form'
        ];
        const actions = [
            { action: 'read', name: '查看' },
            { action: 'create', name: '创建' },
            { action: 'update', name: '编辑' },
            { action: 'delete', name: '删除' },
            { action: 'export', name: '导出' },
            { action: 'import', name: '导入' },
            { action: 'approve', name: '审批' },
            { action: 'manage', name: '管理' },
        ];
        const resourceNames = {
            customer: '客户',
            lead: '线索',
            activity: '跟进记录',
            task: '任务',
            product: '产品',
            product_category: '产品分类',
            order: '订单',
            contract: '合同',
            contract_template: '合同模板',
            user: '用户',
            role: '角色',
            department: '部门',
            permission: '权限',
            statistics: '统计报表',
            system: '系统设置',
            form: '表单营销',
        };
        let count = 0;
        resources.forEach(resource => {
            actions.forEach(({ action, name: actionName }) => {
                const permission = {
                    id: (0, uuid_1.v4)(),
                    name: `${resourceNames[resource]}${actionName}`,
                    code: `${resource}:${action}`,
                    resource,
                    action,
                    description: `${actionName}${resourceNames[resource]}的权限`,
                    createdAt: new Date().toISOString(),
                };
                this.storageService.create('permissions', permission);
                count++;
            });
        });
        return count;
    }
    findAll() {
        return this.storageService.read('permissions');
    }
    findByResource(resource) {
        return this.findAll().filter(p => p.resource === resource);
    }
    findByCode(code) {
        return this.findAll().find(p => p.code === code);
    }
    findByIds(ids) {
        const allPermissions = this.findAll();
        return allPermissions.filter(p => ids.includes(p.id));
    }
    groupByResource() {
        const permissions = this.findAll();
        const grouped = {};
        permissions.forEach(permission => {
            if (!grouped[permission.resource]) {
                grouped[permission.resource] = [];
            }
            grouped[permission.resource].push(permission);
        });
        return grouped;
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map