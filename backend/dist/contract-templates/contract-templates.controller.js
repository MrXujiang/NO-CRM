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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractTemplatesController = void 0;
const common_1 = require("@nestjs/common");
const contract_templates_service_1 = require("./contract-templates.service");
const contract_template_dto_1 = require("./dto/contract-template.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_guard_1 = require("../auth/permissions.guard");
const permissions_decorator_1 = require("../auth/permissions.decorator");
let ContractTemplatesController = class ContractTemplatesController {
    contractTemplatesService;
    constructor(contractTemplatesService) {
        this.contractTemplatesService = contractTemplatesService;
    }
    create(createDto, req) {
        return this.contractTemplatesService.create(createDto, req.user.id);
    }
    findAll(req, category, page, pageSize) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;
        if (category) {
            return this.contractTemplatesService.findByCategory(category, pageNum, pageSizeNum);
        }
        return this.contractTemplatesService.findAll(req.user.id, req.user.role, pageNum, pageSizeNum);
    }
    findOne(id) {
        return this.contractTemplatesService.findOne(id);
    }
    update(id, updateDto) {
        return this.contractTemplatesService.update(id, updateDto);
    }
    remove(id) {
        this.contractTemplatesService.remove(id);
        return { message: '模板已删除' };
    }
    copy(id, req) {
        return this.contractTemplatesService.copy(id, req.user.id);
    }
    preview(id, body) {
        return this.contractTemplatesService.preview(id, body.variables);
    }
    generateMock(count, req) {
        const generated = this.contractTemplatesService.generateMockData(count || 10, req.user.id);
        return { message: `成功生成 ${generated} 条模板数据` };
    }
    clearMock(req) {
        const cleared = this.contractTemplatesService.clearMockData(req.user.id, req.user.role);
        return { message: `成功清空 ${cleared} 条模板数据` };
    }
};
exports.ContractTemplatesController = ContractTemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('contract_template:create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contract_template_dto_1.CreateContractTemplateDto, Object]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('contract_template:read'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('contract_template:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('contract_template:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contract_template_dto_1.UpdateContractTemplateDto]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('contract_template:delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/copy'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "copy", null);
__decorate([
    (0, common_1.Post)(':id/preview'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('mock/generate'),
    __param(0, (0, common_1.Body)('count')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "generateMock", null);
__decorate([
    (0, common_1.Delete)('mock/clear'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContractTemplatesController.prototype, "clearMock", null);
exports.ContractTemplatesController = ContractTemplatesController = __decorate([
    (0, common_1.Controller)('contract-templates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [contract_templates_service_1.ContractTemplatesService])
], ContractTemplatesController);
//# sourceMappingURL=contract-templates.controller.js.map