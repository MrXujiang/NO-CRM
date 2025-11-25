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
exports.WorkflowsController = void 0;
const common_1 = require("@nestjs/common");
const workflows_service_1 = require("./workflows.service");
const create_workflow_dto_1 = require("./dto/create-workflow.dto");
const update_workflow_dto_1 = require("./dto/update-workflow.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_guard_1 = require("../auth/permissions.guard");
const permissions_decorator_1 = require("../auth/permissions.decorator");
let WorkflowsController = class WorkflowsController {
    workflowsService;
    constructor(workflowsService) {
        this.workflowsService = workflowsService;
    }
    create(createDto, req) {
        return this.workflowsService.create(createDto, req.user.id);
    }
    findAll(req, page, pageSize, category, status) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;
        return this.workflowsService.findAll(req.user.id, req.user.isAdmin, pageNum, pageSizeNum, category, status);
    }
    findOne(id) {
        return this.workflowsService.findOne(id);
    }
    update(id, updateDto) {
        return this.workflowsService.update(id, updateDto);
    }
    remove(id) {
        this.workflowsService.remove(id);
        return { message: '工作流已删除' };
    }
    publish(id) {
        return this.workflowsService.publish(id);
    }
    startWorkflow(startDto, workflowId, req) {
        return this.workflowsService.startWorkflow(workflowId, startDto, req.user.id, req.user.name);
    }
    getInstances(req, page, pageSize, status, businessType) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;
        return this.workflowsService.getInstances(req.user.id, req.user.isAdmin, pageNum, pageSizeNum, status, businessType);
    }
    getInstanceDetail(id) {
        return this.workflowsService.getInstanceDetail(id);
    }
    getMyTasks(req, page, pageSize, status) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 10;
        return this.workflowsService.getMyTasks(req.user.id, pageNum, pageSizeNum, status);
    }
    processTask(id, processDto, req) {
        return this.workflowsService.processTask(id, processDto, req.user.id, req.user.name);
    }
    getStatistics(req) {
        return this.workflowsService.getStatistics(req.user.id, req.user.isAdmin);
    }
    generateMock(count, req) {
        const generated = this.workflowsService.generateMockData(count || 10, req.user.id, req.user.name);
        return { message: `成功生成 ${generated} 条工作流数据` };
    }
    clearMock(req) {
        const cleared = this.workflowsService.clearMockData(req.user.id, req.user.isAdmin);
        return { message: `成功清空 ${cleared} 条工作流数据` };
    }
};
exports.WorkflowsController = WorkflowsController;
__decorate([
    (0, common_1.Post)('definitions'),
    (0, permissions_decorator_1.RequirePermissions)('system:manage'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workflow_dto_1.CreateWorkflowDto, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('definitions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('definitions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('definitions/:id'),
    (0, permissions_decorator_1.RequirePermissions)('system:manage'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_workflow_dto_1.UpdateWorkflowDto]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('definitions/:id'),
    (0, permissions_decorator_1.RequirePermissions)('system:manage'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('definitions/:id/publish'),
    (0, permissions_decorator_1.RequirePermissions)('system:manage'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)('instances/start'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)('workflowId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workflow_dto_1.StartWorkflowDto, String, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "startWorkflow", null);
__decorate([
    (0, common_1.Get)('instances'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('businessType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "getInstances", null);
__decorate([
    (0, common_1.Get)('instances/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "getInstanceDetail", null);
__decorate([
    (0, common_1.Get)('tasks/my'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "getMyTasks", null);
__decorate([
    (0, common_1.Post)('tasks/:id/process'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_workflow_dto_1.ProcessTaskDto, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "processTask", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Post)('mock/generate'),
    __param(0, (0, common_1.Body)('count')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "generateMock", null);
__decorate([
    (0, common_1.Delete)('mock/clear'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkflowsController.prototype, "clearMock", null);
exports.WorkflowsController = WorkflowsController = __decorate([
    (0, common_1.Controller)('workflows'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [workflows_service_1.WorkflowsService])
], WorkflowsController);
//# sourceMappingURL=workflows.controller.js.map