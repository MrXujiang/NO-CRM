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
exports.ProductCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let ProductCategoriesService = class ProductCategoriesService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createDto) {
        const existing = this.findByCode(createDto.code);
        if (existing) {
            throw new Error('分类编码已存在');
        }
        const category = {
            id: (0, uuid_1.v4)(),
            ...createDto,
            sort: createDto.sort ?? 0,
            status: 'active',
            productCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('product-categories', category);
        return category;
    }
    findAll(page = 1, pageSize = 10, status) {
        let categories = this.storageService.read('product-categories');
        if (status) {
            categories = categories.filter(c => c.status === status);
        }
        categories = categories.map(category => ({
            ...category,
            productCount: this.countProducts(category.name)
        }));
        categories.sort((a, b) => a.sort - b.sort);
        return this.storageService.paginate(categories, page, pageSize);
    }
    findOne(id) {
        const categories = this.storageService.read('product-categories');
        const category = categories.find(c => c.id === id);
        if (!category) {
            throw new Error('分类不存在');
        }
        return {
            ...category,
            productCount: this.countProducts(category.name)
        };
    }
    findByCode(code) {
        const categories = this.storageService.read('product-categories');
        return categories.find(c => c.code === code);
    }
    findByName(name) {
        const categories = this.storageService.read('product-categories');
        return categories.find(c => c.name === name);
    }
    getAllActive() {
        const categories = this.storageService.read('product-categories')
            .filter(c => c.status === 'active');
        return categories
            .map(category => ({
            ...category,
            productCount: this.countProducts(category.name)
        }))
            .sort((a, b) => a.sort - b.sort);
    }
    update(id, updateDto) {
        const category = this.findOne(id);
        if (updateDto.code && updateDto.code !== category.code) {
            const existing = this.findByCode(updateDto.code);
            if (existing) {
                throw new Error('分类编码已存在');
            }
        }
        const oldName = category.name;
        const updated = {
            ...category,
            ...updateDto,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('product-categories', id, updated);
        if (updateDto.name && updateDto.name !== oldName) {
            this.syncProductsCategory(oldName, updateDto.name);
        }
        return updated;
    }
    remove(id) {
        const category = this.findOne(id);
        const productCount = this.countProducts(category.name);
        if (productCount > 0) {
            throw new Error(`该分类下还有 ${productCount} 个产品，无法删除`);
        }
        this.storageService.delete('product-categories', id);
    }
    countProducts(categoryName) {
        const products = this.storageService.read('products');
        return products.filter(p => p.category === categoryName).length;
    }
    syncProductsCategory(oldName, newName) {
        const products = this.storageService.read('products');
        const updatedProducts = products.map(product => {
            if (product.category === oldName) {
                return {
                    ...product,
                    category: newName,
                    updatedAt: new Date().toISOString()
                };
            }
            return product;
        });
        this.storageService.write('products', updatedProducts);
    }
    generateMockData() {
        const mockCategories = [
            { name: 'CRM系统', code: 'CRM', description: '客户关系管理系统相关产品', icon: 'desktop', color: '#0052d9', sort: 1 },
            { name: '数据分析', code: 'DATA', description: '数据分析和BI相关产品', icon: 'chart-bar', color: '#00a870', sort: 2 },
            { name: '培训服务', code: 'TRAIN', description: '专业培训服务', icon: 'user-talk', color: '#e37318', sort: 3 },
            { name: '定制开发', code: 'DEV', description: '定制化开发服务', icon: 'code', color: '#0594fa', sort: 4 },
            { name: '技术支持', code: 'SUPPORT', description: '技术支持服务', icon: 'service', color: '#7356bf', sort: 5 },
        ];
        mockCategories.forEach(data => {
            const existing = this.findByCode(data.code);
            if (!existing) {
                const category = {
                    id: (0, uuid_1.v4)(),
                    ...data,
                    status: 'active',
                    productCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                this.storageService.create('product-categories', category);
            }
        });
        return mockCategories.length;
    }
    clearMockData() {
        const categories = this.storageService.read('product-categories');
        const count = categories.length;
        this.storageService.write('product-categories', []);
        return count;
    }
};
exports.ProductCategoriesService = ProductCategoriesService;
exports.ProductCategoriesService = ProductCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], ProductCategoriesService);
//# sourceMappingURL=product-categories.service.js.map