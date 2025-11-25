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
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("./permissions.decorator");
const json_storage_service_1 = require("../common/json-storage.service");
let PermissionsGuard = class PermissionsGuard {
    reflector;
    storageService;
    constructor(reflector, storageService) {
        this.reflector = reflector;
        this.storageService = storageService;
    }
    canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        if (user.isAdmin) {
            return true;
        }
        if (!user.roleId) {
            console.log('用户没有分配角色:', user.email);
            return false;
        }
        const role = this.storageService.findById('roles', user.roleId);
        if (!role) {
            console.log('找不到用户的角色:', user.roleId);
            return false;
        }
        const permissions = this.storageService.read('permissions');
        const userPermissionCodes = permissions
            .filter((p) => role.permissionIds.includes(p.id))
            .map((p) => p.code);
        console.log('用户权限:', userPermissionCodes);
        console.log('需要权限:', requiredPermissions);
        const hasPermission = requiredPermissions.every(permission => userPermissionCodes.includes(permission));
        if (!hasPermission) {
            console.log('权限不足，用户:', user.email, '缺少权限:', requiredPermissions);
        }
        return hasPermission;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        json_storage_service_1.JsonStorageService])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map