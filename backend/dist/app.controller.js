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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const permissions_service_1 = require("./permissions/permissions.service");
const roles_service_1 = require("./roles/roles.service");
const users_service_1 = require("./users/users.service");
const json_storage_service_1 = require("./common/json-storage.service");
let AppController = class AppController {
    appService;
    permissionsService;
    rolesService;
    usersService;
    storageService;
    constructor(appService, permissionsService, rolesService, usersService, storageService) {
        this.appService = appService;
        this.permissionsService = permissionsService;
        this.rolesService = rolesService;
        this.usersService = usersService;
        this.storageService = storageService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async initSystem() {
        this.storageService.write('permissions', []);
        const permissionCount = this.permissionsService.initSystemPermissions();
        const allPermissions = this.permissionsService.findAll();
        const allPermissionIds = allPermissions.map(p => p.id);
        this.storageService.write('roles', []);
        const roleCount = this.rolesService.initSystemRoles(allPermissionIds);
        const superAdminRole = this.rolesService.findByCode('super_admin');
        let adminUser = null;
        try {
            adminUser = this.usersService.findByEmail('admin@nocrm.com');
        }
        catch (error) {
        }
        if (!adminUser) {
            adminUser = await this.usersService.create({
                email: 'admin@nocrm.com',
                password: 'admin123456',
                name: '超级管理员',
                roleId: superAdminRole?.id,
                isAdmin: true,
            });
        }
        return {
            message: '系统初始化成功',
            permissions: permissionCount,
            roles: roleCount,
            adminAccount: {
                email: 'admin@nocrm.com',
                password: 'admin123456',
                note: '请登录后立即修改密码',
            },
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('init-system'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "initSystem", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        permissions_service_1.PermissionsService,
        roles_service_1.RolesService,
        users_service_1.UsersService,
        json_storage_service_1.JsonStorageService])
], AppController);
//# sourceMappingURL=app.controller.js.map