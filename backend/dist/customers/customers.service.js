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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let CustomersService = class CustomersService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createCustomerDto, userId) {
        const customer = {
            id: (0, uuid_1.v4)(),
            ...createCustomerDto,
            ownerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return this.storageService.create('customers', customer);
    }
    findAll(userId, userRole) {
        const customers = this.storageService.read('customers');
        if (userRole === 'admin') {
            return customers;
        }
        return customers.filter(customer => customer.ownerId === userId);
    }
    findAllPaginated(userId, userRole, page = 1, pageSize = 10) {
        const customers = this.findAll(userId, userRole);
        return this.storageService.paginate(customers, page, pageSize);
    }
    findOne(id, userId, userRole) {
        const customer = this.storageService.findById('customers', id);
        if (!customer) {
            throw new common_1.NotFoundException('客户不存在');
        }
        if (userRole !== 'admin' && customer.ownerId !== userId) {
            throw new common_1.ForbiddenException('无权访问此客户');
        }
        return customer;
    }
    update(id, updateCustomerDto, userId, userRole) {
        const customer = this.findOne(id, userId, userRole);
        const updated = this.storageService.update('customers', id, {
            ...updateCustomerDto,
            updatedAt: new Date().toISOString(),
        });
        if (!updated) {
            throw new common_1.NotFoundException('更新失败');
        }
        return updated;
    }
    remove(id, userId, userRole) {
        const customer = this.findOne(id, userId, userRole);
        const deleted = this.storageService.delete('customers', id);
        if (!deleted) {
            throw new common_1.NotFoundException('删除失败');
        }
    }
    search(keyword, userId, userRole) {
        const customers = this.findAll(userId, userRole);
        if (!keyword)
            return customers;
        const lowerKeyword = keyword.toLowerCase();
        return customers.filter(customer => customer.name.toLowerCase().includes(lowerKeyword) ||
            customer.phone.includes(keyword) ||
            customer.company?.toLowerCase().includes(lowerKeyword));
    }
    searchPaginated(keyword, userId, userRole, page = 1, pageSize = 10) {
        const results = this.search(keyword, userId, userRole);
        return this.storageService.paginate(results, page, pageSize);
    }
    generateMockData(count, userId) {
        const names = ['张三', '李四', '王五', '赵六', '刘七', '陈八', '周九', '吴十', '郑十一', '孙十二'];
        const companies = ['阿里巴巴', '腾讯科技', '百度公司', '字节跳动', '京东集团', '美团', '小米科技', '华为技术', '滴滴出行', '网易公司'];
        const sources = ['网络推广', '朋友介绍', '线下活动', '电话联系', '官网咨询'];
        const tagOptions = ['重点客户', '意向客户', '老客户', '高价值', '需要跟进'];
        for (let i = 0; i < count; i++) {
            const customer = {
                id: (0, uuid_1.v4)(),
                name: names[Math.floor(Math.random() * names.length)] + (i + 1),
                phone: `1${Math.floor(Math.random() * 9) + 3}${Math.floor(Math.random() * 100000000).toString().padStart(9, '0')}`,
                company: companies[Math.floor(Math.random() * companies.length)],
                source: sources[Math.floor(Math.random() * sources.length)],
                tags: [tagOptions[Math.floor(Math.random() * tagOptions.length)]],
                remarks: `这是一条Mock数据，用于测试。编号: ${i + 1}`,
                ownerId: userId,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.storageService.create('customers', customer);
        }
        return count;
    }
    clearMockData(userId, userRole) {
        const customers = this.storageService.read('customers');
        const beforeCount = customers.length;
        let filteredCustomers;
        if (userRole === 'admin') {
            filteredCustomers = [];
        }
        else {
            filteredCustomers = customers.filter(c => c.ownerId !== userId);
        }
        this.storageService.write('customers', filteredCustomers);
        return beforeCount - filteredCustomers.length;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map