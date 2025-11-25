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
exports.ContractTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let ContractTemplatesService = class ContractTemplatesService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createDto, userId) {
        const template = {
            id: (0, uuid_1.v4)(),
            ...createDto,
            variables: createDto.variables || [],
            clauseIds: createDto.clauseIds || [],
            requiredFields: createDto.requiredFields || [],
            version: 1,
            status: 'draft',
            usageCount: 0,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('contract-templates', template);
        return template;
    }
    findAll(userId, userRole, page = 1, pageSize = 10) {
        let templates = this.storageService.read('contract-templates');
        if (userRole !== 'admin') {
            templates = templates.filter(t => t.status === 'active');
        }
        return this.storageService.paginate(templates, page, pageSize);
    }
    findOne(id) {
        const templates = this.storageService.read('contract-templates');
        const template = templates.find(t => t.id === id);
        if (!template) {
            throw new Error('合同模板不存在');
        }
        return template;
    }
    findByCategory(category, page = 1, pageSize = 10) {
        const templates = this.storageService
            .read('contract-templates')
            .filter(t => t.category === category && t.status === 'active');
        return this.storageService.paginate(templates, page, pageSize);
    }
    update(id, updateDto) {
        const template = this.findOne(id);
        const updated = {
            ...template,
            ...updateDto,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('contract-templates', id, updated);
        return updated;
    }
    remove(id) {
        const template = this.findOne(id);
        this.update(id, { status: 'archived' });
    }
    copy(id, userId) {
        const source = this.findOne(id);
        const copied = {
            ...source,
            id: (0, uuid_1.v4)(),
            name: `${source.name} (副本)`,
            code: `${source.code}-COPY-${Date.now()}`,
            status: 'draft',
            usageCount: 0,
            version: 1,
            parentId: source.id,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('contract-templates', copied);
        return copied;
    }
    preview(id, variables) {
        const template = this.findOne(id);
        let html = template.content;
        if (variables) {
            Object.keys(variables).forEach(key => {
                const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
                html = html.replace(regex, variables[key] || '');
            });
        }
        return { html };
    }
    incrementUsage(id) {
        const template = this.findOne(id);
        template.usageCount += 1;
        this.storageService.update('contract-templates', id, template);
    }
    generateMockData(count, userId) {
        const categories = [
            'sales_contract',
            'service_agreement',
            'nda',
            'partnership',
        ];
        const templates = [
            {
                name: '标准销售合同',
                code: 'TEMP-SALES-001',
                category: 'sales_contract',
                content: `
          <h1>销售合同</h1>
          <p>甲方（买方）：\${customer.name}</p>
          <p>乙方（卖方）：本公司</p>
          <p>合同金额：\${order.totalAmount}元（大写：\${order.totalAmountChinese}）</p>
          <p>签订日期：\${contract.signDate}</p>
          <h2>一、产品明细</h2>
          <p>\${order.items}</p>
          <h2>二、付款方式</h2>
          <p>\${payment.terms}</p>
        `,
                variables: [
                    { key: 'customer.name', label: '客户名称', type: 'text', required: true, dataSource: 'customer' },
                    { key: 'order.totalAmount', label: '合同金额', type: 'number', required: true, dataSource: 'order' },
                ],
            },
            {
                name: '服务协议模板',
                code: 'TEMP-SERVICE-001',
                category: 'service_agreement',
                content: `
          <h1>服务协议</h1>
          <p>服务提供方：本公司</p>
          <p>服务接受方：\${customer.name}</p>
          <p>服务内容：\${service.description}</p>
          <p>服务期限：\${service.startDate} 至 \${service.endDate}</p>
        `,
                variables: [
                    { key: 'customer.name', label: '客户名称', type: 'text', required: true, dataSource: 'customer' },
                    { key: 'service.description', label: '服务内容', type: 'text', required: true, dataSource: 'custom' },
                ],
            },
        ];
        for (let i = 0; i < count; i++) {
            const base = templates[i % templates.length];
            const template = {
                id: (0, uuid_1.v4)(),
                name: `${base.name} ${i + 1}`,
                code: `${base.code}-${i + 1}`,
                category: base.category,
                description: `这是一个${base.name}的示例模板`,
                content: base.content,
                variables: base.variables,
                clauseIds: [],
                requiredFields: ['customer.name'],
                version: 1,
                status: 'active',
                usageCount: Math.floor(Math.random() * 50),
                createdBy: userId,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.storageService.create('contract-templates', template);
        }
        return count;
    }
    clearMockData(userId, userRole) {
        const templates = this.storageService.read('contract-templates');
        const beforeCount = templates.length;
        let filteredTemplates;
        if (userRole === 'admin') {
            filteredTemplates = [];
        }
        else {
            filteredTemplates = templates.filter(t => t.createdBy !== userId);
        }
        this.storageService.write('contract-templates', filteredTemplates);
        return beforeCount - filteredTemplates.length;
    }
};
exports.ContractTemplatesService = ContractTemplatesService;
exports.ContractTemplatesService = ContractTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], ContractTemplatesService);
//# sourceMappingURL=contract-templates.service.js.map