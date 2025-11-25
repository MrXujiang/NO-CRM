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
exports.RecommendationService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let RecommendationService = class RecommendationService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    calculateRecommendations(minSupport = 0.1, minConfidence = 0.5) {
        const orders = this.storageService.read('orders');
        const products = this.storageService.read('products');
        if (orders.length === 0 || products.length === 0) {
            return 0;
        }
        const recommendations = [];
        const totalOrders = orders.length;
        for (let i = 0; i < products.length; i++) {
            for (let j = i + 1; j < products.length; j++) {
                const productA = products[i];
                const productB = products[j];
                const ordersWithA = orders.filter(o => o.items.some(item => item.productId === productA.id));
                const ordersWithB = orders.filter(o => o.items.some(item => item.productId === productB.id));
                const ordersWithBoth = orders.filter(o => o.items.some(item => item.productId === productA.id) &&
                    o.items.some(item => item.productId === productB.id));
                const countA = ordersWithA.length;
                const countB = ordersWithB.length;
                const countBoth = ordersWithBoth.length;
                if (countBoth === 0)
                    continue;
                const support = countBoth / totalOrders;
                const confidenceAtoB = countBoth / countA;
                const confidenceBtoA = countBoth / countB;
                const lift = (countBoth / totalOrders) / ((countA / totalOrders) * (countB / totalOrders));
                if (support >= minSupport) {
                    if (confidenceAtoB >= minConfidence) {
                        recommendations.push({
                            id: (0, uuid_1.v4)(),
                            sourceProductId: productA.id,
                            targetProductId: productB.id,
                            coOccurrence: countBoth,
                            confidence: confidenceAtoB,
                            support,
                            lift,
                            totalOrders,
                            sourceOrders: countA,
                            targetOrders: countB,
                            bothOrders: countBoth,
                            calculatedAt: new Date().toISOString(),
                            reason: `购买 ${productA.name} 的客户中，${(confidenceAtoB * 100).toFixed(1)}% 也购买了 ${productB.name}`,
                        });
                    }
                    if (confidenceBtoA >= minConfidence) {
                        recommendations.push({
                            id: (0, uuid_1.v4)(),
                            sourceProductId: productB.id,
                            targetProductId: productA.id,
                            coOccurrence: countBoth,
                            confidence: confidenceBtoA,
                            support,
                            lift,
                            totalOrders,
                            sourceOrders: countB,
                            targetOrders: countA,
                            bothOrders: countBoth,
                            calculatedAt: new Date().toISOString(),
                            reason: `购买 ${productB.name} 的客户中，${(confidenceBtoA * 100).toFixed(1)}% 也购买了 ${productA.name}`,
                        });
                    }
                }
            }
        }
        this.storageService.write('recommendations', []);
        recommendations.forEach(rec => {
            this.storageService.create('recommendations', rec);
        });
        return recommendations.length;
    }
    getRecommendationsForProduct(productId, limit = 5) {
        const recommendations = this.storageService.read('recommendations');
        return recommendations
            .filter(rec => rec.sourceProductId === productId)
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, limit);
    }
    getRecommendationsForOrder(orderId, limit = 5) {
        const orders = this.storageService.read('orders');
        const order = orders.find(o => o.id === orderId);
        if (!order || order.items.length === 0) {
            return [];
        }
        const products = this.storageService.read('products');
        const recommendations = this.storageService.read('recommendations');
        const orderProductIds = order.items.map(item => item.productId);
        const recommendedProductMap = new Map();
        orderProductIds.forEach(productId => {
            const recs = recommendations.filter(rec => rec.sourceProductId === productId);
            recs.forEach(rec => {
                if (!orderProductIds.includes(rec.targetProductId)) {
                    const existing = recommendedProductMap.get(rec.targetProductId);
                    if (!existing || rec.confidence > existing.confidence) {
                        recommendedProductMap.set(rec.targetProductId, rec);
                    }
                }
            });
        });
        const result = Array.from(recommendedProductMap.entries())
            .map(([productId, recommendation]) => {
            const product = products.find(p => p.id === productId);
            return product ? { product, recommendation } : null;
        })
            .filter(item => item !== null)
            .sort((a, b) => b.recommendation.confidence - a.recommendation.confidence)
            .slice(0, limit);
        return result;
    }
    getAllRecommendations(page = 1, pageSize = 20) {
        const recommendations = this.storageService.read('recommendations');
        recommendations.sort((a, b) => b.confidence - a.confidence);
        return this.storageService.paginate(recommendations, page, pageSize);
    }
    getStatistics() {
        const recommendations = this.storageService.read('recommendations');
        return {
            total: recommendations.length,
            avgConfidence: recommendations.length > 0
                ? recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length
                : 0,
            avgSupport: recommendations.length > 0
                ? recommendations.reduce((sum, r) => sum + r.support, 0) / recommendations.length
                : 0,
            avgLift: recommendations.length > 0
                ? recommendations.reduce((sum, r) => sum + r.lift, 0) / recommendations.length
                : 0,
            topRecommendations: recommendations
                .sort((a, b) => b.confidence - a.confidence)
                .slice(0, 10),
        };
    }
    clearRecommendations() {
        const recommendations = this.storageService.read('recommendations');
        const count = recommendations.length;
        this.storageService.write('recommendations', []);
        return count;
    }
};
exports.RecommendationService = RecommendationService;
exports.RecommendationService = RecommendationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], RecommendationService);
//# sourceMappingURL=recommendation.service.js.map