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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let ProductsService = class ProductsService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createDto) {
        const product = {
            id: (0, uuid_1.v4)(),
            ...createDto,
            status: 'active',
            salesCount: 0,
            revenue: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('products', product);
        return product;
    }
    findAll(page = 1, pageSize = 10, category, status) {
        let products = this.storageService.read('products');
        if (category) {
            products = products.filter(p => p.category === category);
        }
        if (status) {
            products = products.filter(p => p.status === status);
        }
        products.sort((a, b) => b.salesCount - a.salesCount);
        return this.storageService.paginate(products, page, pageSize);
    }
    findOne(id) {
        const products = this.storageService.read('products');
        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error('产品不存在');
        }
        return product;
    }
    findByCode(code) {
        const products = this.storageService.read('products');
        return products.find(p => p.code === code);
    }
    findActiveProducts() {
        return this.storageService.read('products').filter(p => p.status === 'active');
    }
    update(id, updateDto) {
        const product = this.findOne(id);
        const updated = {
            ...product,
            ...updateDto,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('products', id, updated);
        return updated;
    }
    remove(id) {
        this.update(id, { status: 'inactive' });
    }
    incrementSales(productId, quantity, amount) {
        const product = this.findOne(productId);
        product.salesCount += quantity;
        product.revenue += amount;
        this.storageService.update('products', productId, product);
    }
    generateMockData(count) {
        const categories = ['CRM系统', '数据分析', '培训服务', '定制开发', '技术支持'];
        const units = ['年', '月', '次', '套'];
        const productTemplates = [
            { name: '企业版CRM', category: 'CRM系统', price: 9999, unit: '年', desc: '适合中小企业的客户关系管理系统' },
            { name: '旗舰版CRM', category: 'CRM系统', price: 19999, unit: '年', desc: '功能完整的企业级CRM系统' },
            { name: '数据分析模块', category: '数据分析', price: 3999, unit: '年', desc: '强大的数据分析和报表功能' },
            { name: 'BI可视化', category: '数据分析', price: 5999, unit: '年', desc: '商业智能可视化看板' },
            { name: '系统培训', category: '培训服务', price: 1999, unit: '次', desc: '专业的系统使用培训' },
            { name: '定制开发服务', category: '定制开发', price: 50000, unit: '套', desc: '根据需求定制开发功能' },
            { name: '技术支持包', category: '技术支持', price: 2999, unit: '年', desc: '7x24小时技术支持' },
        ];
        for (let i = 0; i < count; i++) {
            const template = productTemplates[i % productTemplates.length];
            const product = {
                id: (0, uuid_1.v4)(),
                name: `${template.name} ${Math.floor(i / productTemplates.length) + 1}`,
                code: `PRD-${template.category.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
                category: template.category,
                description: template.desc,
                price: template.price,
                unit: template.unit,
                minQuantity: 1,
                maxQuantity: i % 3 === 0 ? 10 : undefined,
                status: 'active',
                salesCount: Math.floor(Math.random() * 100),
                revenue: template.price * Math.floor(Math.random() * 100),
                createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.storageService.create('products', product);
        }
        return count;
    }
    clearMockData() {
        const products = this.storageService.read('products');
        const count = products.length;
        this.storageService.write('products', []);
        return count;
    }
    getStatistics() {
        const products = this.storageService.read('products');
        const active = products.filter(p => p.status === 'active');
        return {
            total: products.length,
            active: active.length,
            inactive: products.length - active.length,
            totalSales: products.reduce((sum, p) => sum + p.salesCount, 0),
            totalRevenue: products.reduce((sum, p) => sum + p.revenue, 0),
            byCategory: this.groupByCategory(active),
        };
    }
    groupByCategory(products) {
        const grouped = {};
        products.forEach(p => {
            if (!grouped[p.category]) {
                grouped[p.category] = { count: 0, revenue: 0 };
            }
            grouped[p.category].count += 1;
            grouped[p.category].revenue += p.revenue;
        });
        return Object.keys(grouped).map(category => ({
            category,
            count: grouped[category].count,
            revenue: grouped[category].revenue,
        }));
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], ProductsService);
//# sourceMappingURL=products.service.js.map