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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const contract_templates_service_1 = require("../contract-templates/contract-templates.service");
const orders_service_1 = require("../orders/orders.service");
const uuid_1 = require("uuid");
let ContractsService = class ContractsService {
    storageService;
    templatesService;
    ordersService;
    constructor(storageService, templatesService, ordersService) {
        this.storageService = storageService;
        this.templatesService = templatesService;
        this.ordersService = ordersService;
    }
    generateFromOrder(orderId, templateId, userId) {
        const order = this.ordersService.findOne(orderId);
        const template = this.templatesService.findOne(templateId);
        const variables = {
            'order.orderNo': order.orderNo,
            'order.totalAmount': order.totalAmount.toFixed(2),
            'order.totalAmountChinese': this.numberToChinese(order.totalAmount),
            'contract.date': new Date().toISOString().slice(0, 10),
        };
        const previewResult = this.templatesService.preview(templateId, variables);
        const contract = {
            id: (0, uuid_1.v4)(),
            contractNo: this.generateContractNo(),
            orderId: order.id,
            templateId: template.id,
            customerId: order.customerId,
            title: `${order.title} - 合同`,
            type: 'sales',
            content: previewResult.html,
            contentData: variables,
            signType: 'online',
            signStatus: 'not_started',
            signRecords: [],
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            duration: 365,
            amount: order.totalAmount,
            attachments: [],
            status: 'draft',
            ownerId: userId,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('contracts', contract);
        this.templatesService.incrementUsage(templateId);
        return contract;
    }
    create(createDto, userId) {
        return this.generateFromOrder(createDto.orderId, createDto.templateId, userId);
    }
    findAll(userId, userRole, page = 1, pageSize = 10, signStatus) {
        let contracts = this.storageService.read('contracts');
        if (userRole !== 'admin') {
            contracts = contracts.filter(c => c.createdBy === userId);
        }
        if (signStatus) {
            contracts = contracts.filter(c => c.signStatus === signStatus);
        }
        contracts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return this.storageService.paginate(contracts, page, pageSize);
    }
    findOne(id) {
        const contracts = this.storageService.read('contracts');
        const contract = contracts.find(c => c.id === id);
        if (!contract) {
            throw new Error('合同不存在');
        }
        return contract;
    }
    findByOrder(orderId) {
        const contracts = this.storageService.read('contracts');
        return contracts.filter(c => c.orderId === orderId);
    }
    update(id, updateDto) {
        const contract = this.findOne(id);
        const updated = {
            ...contract,
            ...updateDto,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('contracts', id, updated);
        return updated;
    }
    remove(id) {
        const contract = this.findOne(id);
        if (contract.status !== 'draft') {
            throw new Error('只能删除草稿状态的合同');
        }
        this.storageService.delete('contracts', id);
    }
    sign(id, signDto) {
        const contract = this.findOne(id);
        const signRecord = {
            id: (0, uuid_1.v4)(),
            signerId: signDto.signerId,
            signerName: signDto.signerName,
            signerRole: signDto.signerType === 'customer' ? 'party_b' : 'party_a',
            signMethod: signDto.signMethod === 'digital' ? 'online' : 'offline',
            signedAt: new Date().toISOString(),
            ipAddress: '127.0.0.1',
        };
        contract.signRecords.push(signRecord);
        const customerSigned = contract.signRecords.some(r => r.signerRole === 'party_b');
        const companySigned = contract.signRecords.some(r => r.signerRole === 'party_a');
        if (customerSigned && companySigned) {
            contract.signStatus = 'signed';
            contract.signedAt = new Date().toISOString();
        }
        else {
            contract.signStatus = 'partial';
        }
        contract.updatedAt = new Date().toISOString();
        this.storageService.update('contracts', id, contract);
        return contract;
    }
    validate(id) {
        const contract = this.findOne(id);
        const issues = [];
        if (!contract.customerId) {
            issues.push({
                id: (0, uuid_1.v4)(),
                level: 'high',
                category: 'completeness',
                code: 'ERR-001',
                message: '缺少客户信息'
            });
        }
        if (!contract.amount || contract.amount <= 0) {
            issues.push({
                id: (0, uuid_1.v4)(),
                level: 'high',
                category: 'completeness',
                code: 'ERR-002',
                message: '合同金额无效'
            });
        }
        const typoCheck = this.checkTypos(contract.content);
        if (typoCheck.length > 0) {
            typoCheck.forEach(typo => {
                issues.push({
                    id: (0, uuid_1.v4)(),
                    level: 'low',
                    category: 'spelling',
                    code: 'WARN-001',
                    message: `可能的错别字: ${typo}`
                });
            });
        }
        const amountInWords = this.numberToChinese(contract.amount);
        if (!contract.content.includes(amountInWords)) {
            issues.push({
                id: (0, uuid_1.v4)(),
                level: 'medium',
                category: 'logic',
                code: 'WARN-002',
                message: `金额大小写不匹配: 数字 ${contract.amount}, 大写应为 ${amountInWords}`
            });
        }
        if (contract.startDate && contract.endDate) {
            if (new Date(contract.startDate) >= new Date(contract.endDate)) {
                issues.push({
                    id: (0, uuid_1.v4)(),
                    level: 'high',
                    category: 'logic',
                    code: 'ERR-003',
                    message: '合同结束日期应晚于开始日期'
                });
            }
        }
        if (contract.amount > 100000) {
            issues.push({
                id: (0, uuid_1.v4)(),
                level: 'medium',
                category: 'business_rule',
                code: 'WARN-003',
                message: '大额合同，建议法务审核'
            });
        }
        const level = this.calculateValidationLevel(issues);
        const passed = issues.filter(i => i.level === 'high').length === 0;
        const score = Math.max(0, 100 - issues.length * 10);
        const validationResult = {
            passed,
            score,
            level,
            issues,
            checkedAt: new Date().toISOString(),
            checkedBy: 'system',
        };
        contract.validationResult = validationResult;
        contract.validatedAt = new Date().toISOString();
        contract.updatedAt = new Date().toISOString();
        this.storageService.update('contracts', id, contract);
        return validationResult;
    }
    generateContractNo() {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `CTR-${dateStr}-${random}`;
    }
    numberToChinese(num) {
        const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];
        if (num === 0)
            return '零元整';
        const integerPart = Math.floor(num);
        const decimalPart = Math.round((num - integerPart) * 100);
        let result = '';
        const str = integerPart.toString();
        for (let i = 0; i < str.length; i++) {
            const digit = parseInt(str[i]);
            result += digits[digit] + units[str.length - 1 - i];
        }
        result += '元';
        if (decimalPart > 0) {
            const jiao = Math.floor(decimalPart / 10);
            const fen = decimalPart % 10;
            if (jiao > 0)
                result += digits[jiao] + '角';
            if (fen > 0)
                result += digits[fen] + '分';
        }
        else {
            result += '整';
        }
        return result;
    }
    checkTypos(content) {
        const typos = [];
        const commonMistakes = [
            { wrong: '帐户', correct: '账户' },
            { wrong: '做为', correct: '作为' },
            { wrong: '即使', correct: '即时' },
        ];
        commonMistakes.forEach(mistake => {
            if (content.includes(mistake.wrong)) {
                typos.push(`"${mistake.wrong}" 建议改为 "${mistake.correct}"`);
            }
        });
        return typos;
    }
    calculateValidationLevel(issues) {
        const highCount = issues.filter(i => i.level === 'high').length;
        const mediumCount = issues.filter(i => i.level === 'medium').length;
        if (highCount > 0)
            return 'danger';
        if (mediumCount > 2)
            return 'danger';
        if (mediumCount > 0)
            return 'warning';
        return 'safe';
    }
    generateMockData(count, userId) {
        const orders = this.storageService.read('orders');
        const templates = this.storageService.read('contract-templates');
        if (orders.length === 0 || templates.length === 0) {
            throw new Error('请先生成订单和合同模板数据');
        }
        for (let i = 0; i < count; i++) {
            const order = orders[Math.floor(Math.random() * orders.length)];
            const template = templates[Math.floor(Math.random() * templates.length)];
            this.generateFromOrder(order.id, template.id, userId);
        }
        return count;
    }
    clearMockData(userId, userRole) {
        const contracts = this.storageService.read('contracts');
        const beforeCount = contracts.length;
        let filteredContracts;
        if (userRole === 'admin') {
            filteredContracts = [];
        }
        else {
            filteredContracts = contracts.filter(c => c.createdBy !== userId);
        }
        this.storageService.write('contracts', filteredContracts);
        return beforeCount - filteredContracts.length;
    }
    getStatistics(userId, userRole) {
        let contracts = this.storageService.read('contracts');
        if (userRole !== 'admin') {
            contracts = contracts.filter(c => c.createdBy === userId);
        }
        return {
            total: contracts.length,
            byStatus: this.groupByStatus(contracts),
            totalAmount: contracts.reduce((sum, c) => sum + (c.amount || 0), 0),
            avgAmount: contracts.length > 0 ? contracts.reduce((sum, c) => sum + (c.amount || 0), 0) / contracts.length : 0,
        };
    }
    groupByStatus(contracts) {
        const grouped = {};
        contracts.forEach(c => {
            grouped[c.signStatus] = (grouped[c.signStatus] || 0) + 1;
        });
        return Object.keys(grouped).map(status => ({ status, count: grouped[status] }));
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService,
        contract_templates_service_1.ContractTemplatesService,
        orders_service_1.OrdersService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map