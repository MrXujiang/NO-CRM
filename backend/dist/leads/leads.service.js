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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let LeadsService = class LeadsService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createLeadDto, userId) {
        const lead = {
            id: (0, uuid_1.v4)(),
            ...createLeadDto,
            ownerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return this.storageService.create('leads', lead);
    }
    findAll(userId, userRole) {
        const leads = this.storageService.read('leads');
        if (userRole === 'admin') {
            return leads;
        }
        return leads.filter(lead => lead.ownerId === userId);
    }
    findAllPaginated(userId, userRole, page = 1, pageSize = 10) {
        const leads = this.findAll(userId, userRole);
        return this.storageService.paginate(leads, page, pageSize);
    }
    findOne(id, userId, userRole) {
        const lead = this.storageService.findById('leads', id);
        if (!lead) {
            throw new common_1.NotFoundException('线索不存在');
        }
        if (userRole !== 'admin' && lead.ownerId !== userId) {
            throw new common_1.ForbiddenException('无权访问此线索');
        }
        return lead;
    }
    update(id, updateLeadDto, userId, userRole) {
        const lead = this.findOne(id, userId, userRole);
        const updated = this.storageService.update('leads', id, {
            ...updateLeadDto,
            updatedAt: new Date().toISOString(),
        });
        if (!updated) {
            throw new common_1.NotFoundException('更新失败');
        }
        return updated;
    }
    remove(id, userId, userRole) {
        const lead = this.findOne(id, userId, userRole);
        const deleted = this.storageService.delete('leads', id);
        if (!deleted) {
            throw new common_1.NotFoundException('删除失败');
        }
    }
    findByStage(stage, userId, userRole) {
        const leads = this.findAll(userId, userRole);
        return leads.filter(lead => lead.stage === stage);
    }
    findByStagePaginated(stage, userId, userRole, page = 1, pageSize = 10) {
        const results = this.findByStage(stage, userId, userRole);
        return this.storageService.paginate(results, page, pageSize);
    }
    generateMockData(count, userId) {
        const names = ['张总', '李经理', '王总监', '赵主管', '刘老板', '陈总', '周经理', '吴总', '郑主任', '孙经理'];
        const stages = ['uncontacted', 'contacted', 'qualified', 'converted', 'invalid'];
        const intentionLevels = ['low', 'medium', 'high'];
        for (let i = 0; i < count; i++) {
            const lead = {
                id: (0, uuid_1.v4)(),
                leadName: names[Math.floor(Math.random() * names.length)] + `的线索${i + 1}`,
                contactInfo: `1${Math.floor(Math.random() * 9) + 3}${Math.floor(Math.random() * 100000000).toString().padStart(9, '0')}`,
                stage: stages[Math.floor(Math.random() * stages.length)],
                intentionLevel: intentionLevels[Math.floor(Math.random() * intentionLevels.length)],
                ownerId: userId,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.storageService.create('leads', lead);
        }
        return count;
    }
    clearMockData(userId, userRole) {
        const leads = this.storageService.read('leads');
        const beforeCount = leads.length;
        let filteredLeads;
        if (userRole === 'admin') {
            filteredLeads = [];
        }
        else {
            filteredLeads = leads.filter(l => l.ownerId !== userId);
        }
        this.storageService.write('leads', filteredLeads);
        return beforeCount - filteredLeads.length;
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map