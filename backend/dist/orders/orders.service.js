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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const products_service_1 = require("../products/products.service");
const recommendation_service_1 = require("../recommendation/recommendation.service");
const uuid_1 = require("uuid");
let OrdersService = class OrdersService {
    storageService;
    productsService;
    recommendationService;
    constructor(storageService, productsService, recommendationService) {
        this.storageService = storageService;
        this.productsService = productsService;
        this.recommendationService = recommendationService;
    }
    create(createDto, userId) {
        const { subtotal, totalAmount } = this.calculateAmount(createDto.items, createDto.discount);
        const order = {
            id: (0, uuid_1.v4)(),
            orderNo: this.generateOrderNo(),
            customerId: createDto.customerId,
            leadId: createDto.leadId,
            title: createDto.title,
            description: createDto.description,
            items: createDto.items,
            subtotal,
            discount: createDto.discount,
            totalAmount,
            status: 'draft',
            stage: 'quotation',
            orderDate: new Date().toISOString(),
            paymentTerms: createDto.paymentTerms,
            paymentRecords: [],
            invoiceRecords: [],
            requireApproval: createDto.requireApproval,
            notes: createDto.notes,
            ownerId: userId,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('orders', order);
        return order;
    }
    findAll(userId, userRole, page = 1, pageSize = 10, status, customerId) {
        let orders = this.storageService.read('orders');
        if (userRole !== 'admin') {
            orders = orders.filter(o => o.ownerId === userId);
        }
        if (status) {
            orders = orders.filter(o => o.status === status);
        }
        if (customerId) {
            orders = orders.filter(o => o.customerId === customerId);
        }
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return this.storageService.paginate(orders, page, pageSize);
    }
    findOne(id) {
        const orders = this.storageService.read('orders');
        const order = orders.find(o => o.id === id);
        if (!order) {
            throw new Error('订单不存在');
        }
        return order;
    }
    update(id, updateDto) {
        const order = this.findOne(id);
        let subtotal = order.subtotal;
        let totalAmount = order.totalAmount;
        if (updateDto.items) {
            const calculated = this.calculateAmount(updateDto.items, updateDto.discount || order.discount);
            subtotal = calculated.subtotal;
            totalAmount = calculated.totalAmount;
        }
        const updated = {
            ...order,
            ...updateDto,
            subtotal,
            totalAmount,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('orders', id, updated);
        return updated;
    }
    remove(id) {
        const order = this.findOne(id);
        if (order.status !== 'draft') {
            throw new Error('只能删除草稿状态的订单');
        }
        this.storageService.delete('orders', id);
    }
    addItem(orderId, addItemDto) {
        const order = this.findOne(orderId);
        const product = this.productsService.findOne(addItemDto.productId);
        const item = {
            id: (0, uuid_1.v4)(),
            productId: product.id,
            productName: product.name,
            productCode: product.code,
            quantity: addItemDto.quantity,
            unit: product.unit,
            unitPrice: addItemDto.unitPrice,
            discount: addItemDto.discount,
            amount: addItemDto.quantity * addItemDto.unitPrice - addItemDto.discount,
            notes: addItemDto.notes,
        };
        order.items.push(item);
        const { subtotal, totalAmount } = this.calculateAmount(order.items, order.discount);
        order.subtotal = subtotal;
        order.totalAmount = totalAmount;
        order.updatedAt = new Date().toISOString();
        this.storageService.update('orders', orderId, order);
        return order;
    }
    removeItem(orderId, itemId) {
        const order = this.findOne(orderId);
        order.items = order.items.filter(item => item.id !== itemId);
        const { subtotal, totalAmount } = this.calculateAmount(order.items, order.discount);
        order.subtotal = subtotal;
        order.totalAmount = totalAmount;
        order.updatedAt = new Date().toISOString();
        this.storageService.update('orders', orderId, order);
        return order;
    }
    submit(orderId) {
        const order = this.findOne(orderId);
        if (order.status !== 'draft') {
            throw new Error('只能提交草稿状态的订单');
        }
        order.status = order.requireApproval ? 'pending' : 'approved';
        order.stage = 'negotiation';
        order.updatedAt = new Date().toISOString();
        this.storageService.update('orders', orderId, order);
        return order;
    }
    approve(orderId, approved, approverId, notes) {
        const order = this.findOne(orderId);
        if (order.status !== 'pending') {
            throw new Error('订单状态不正确');
        }
        order.approvalStatus = approved ? 'approved' : 'rejected';
        order.status = approved ? 'approved' : 'draft';
        order.approver = approverId;
        order.approvedAt = new Date().toISOString();
        order.approvalNotes = notes;
        order.updatedAt = new Date().toISOString();
        this.storageService.update('orders', orderId, order);
        return order;
    }
    complete(orderId) {
        const order = this.findOne(orderId);
        order.status = 'completed';
        order.completedAt = new Date().toISOString();
        order.updatedAt = new Date().toISOString();
        order.items.forEach(item => {
            this.productsService.incrementSales(item.productId, item.quantity, item.amount);
        });
        this.storageService.update('orders', orderId, order);
        return order;
    }
    getRecommendations(orderId) {
        return this.recommendationService.getRecommendationsForOrder(orderId, 5);
    }
    generateOrderNo() {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORD-${dateStr}-${random}`;
    }
    calculateAmount(items, discount) {
        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const totalAmount = subtotal - discount;
        return { subtotal, totalAmount: Math.max(0, totalAmount) };
    }
    generateMockData(count, userId) {
        const customers = this.storageService.read('customers');
        const products = this.storageService.read('products');
        if (customers.length === 0 || products.length === 0) {
            throw new Error('请先生成客户和产品数据');
        }
        const statuses = ['draft', 'pending', 'approved', 'signed', 'executing', 'completed'];
        const stages = ['quotation', 'negotiation', 'signing', 'execution', 'acceptance'];
        for (let i = 0; i < count; i++) {
            const customer = customers[Math.floor(Math.random() * customers.length)];
            const productCount = Math.floor(Math.random() * 3) + 1;
            const items = [];
            for (let j = 0; j < productCount; j++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 5) + 1;
                const unitPrice = product.price;
                const itemDiscount = Math.random() > 0.7 ? Math.floor(product.price * 0.1) : 0;
                items.push({
                    id: (0, uuid_1.v4)(),
                    productId: product.id,
                    productName: product.name,
                    productCode: product.code,
                    quantity,
                    unit: product.unit,
                    unitPrice,
                    discount: itemDiscount,
                    amount: quantity * unitPrice - itemDiscount,
                });
            }
            const { subtotal, totalAmount } = this.calculateAmount(items, 0);
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const order = {
                id: (0, uuid_1.v4)(),
                orderNo: this.generateOrderNo(),
                customerId: customer.id,
                title: `${customer.name} - ${items[0].productName}等`,
                items,
                subtotal,
                discount: 0,
                totalAmount,
                status,
                stage: stages[Math.floor(Math.random() * stages.length)],
                orderDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
                paymentTerms: '30天内付款',
                paymentRecords: [],
                invoiceRecords: [],
                requireApproval: totalAmount > 10000,
                approvalStatus: status === 'approved' ? 'approved' : undefined,
                ownerId: userId,
                createdBy: userId,
                createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.storageService.create('orders', order);
        }
        return count;
    }
    clearMockData(userId, userRole) {
        const orders = this.storageService.read('orders');
        const beforeCount = orders.length;
        let filteredOrders;
        if (userRole === 'admin') {
            filteredOrders = [];
        }
        else {
            filteredOrders = orders.filter(o => o.createdBy !== userId);
        }
        this.storageService.write('orders', filteredOrders);
        return beforeCount - filteredOrders.length;
    }
    getStatistics(userId, userRole) {
        let orders = this.storageService.read('orders');
        if (userRole !== 'admin') {
            orders = orders.filter(o => o.ownerId === userId);
        }
        return {
            total: orders.length,
            byStatus: this.groupByStatus(orders),
            byStage: this.groupByStage(orders),
            totalAmount: orders.reduce((sum, o) => sum + o.totalAmount, 0),
            avgAmount: orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length : 0,
        };
    }
    groupByStatus(orders) {
        const grouped = {};
        orders.forEach(o => {
            grouped[o.status] = (grouped[o.status] || 0) + 1;
        });
        return Object.keys(grouped).map(status => ({ status, count: grouped[status] }));
    }
    groupByStage(orders) {
        const grouped = {};
        orders.forEach(o => {
            grouped[o.stage] = (grouped[o.stage] || 0) + 1;
        });
        return Object.keys(grouped).map(stage => ({ stage, count: grouped[stage] }));
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService,
        products_service_1.ProductsService,
        recommendation_service_1.RecommendationService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map