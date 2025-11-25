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
exports.RecommendationController = void 0;
const common_1 = require("@nestjs/common");
const recommendation_service_1 = require("./recommendation.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RecommendationController = class RecommendationController {
    recommendationService;
    constructor(recommendationService) {
        this.recommendationService = recommendationService;
    }
    calculate(minSupport, minConfidence) {
        const count = this.recommendationService.calculateRecommendations(minSupport || 0.1, minConfidence || 0.5);
        return { message: `成功计算 ${count} 条推荐规则`, count };
    }
    getAll(page, pageSize) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 20;
        return this.recommendationService.getAllRecommendations(pageNum, pageSizeNum);
    }
    getStatistics() {
        return this.recommendationService.getStatistics();
    }
    getForProduct(productId, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.recommendationService.getRecommendationsForProduct(productId, limitNum);
    }
    getForOrder(orderId, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.recommendationService.getRecommendationsForOrder(orderId, limitNum);
    }
    clear() {
        const count = this.recommendationService.clearRecommendations();
        return { message: `成功清空 ${count} 条推荐规则` };
    }
};
exports.RecommendationController = RecommendationController;
__decorate([
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)('minSupport')),
    __param(1, (0, common_1.Body)('minConfidence')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], RecommendationController.prototype, "calculate", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RecommendationController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RecommendationController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RecommendationController.prototype, "getForProduct", null);
__decorate([
    (0, common_1.Get)('order/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RecommendationController.prototype, "getForOrder", null);
__decorate([
    (0, common_1.Delete)('clear'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RecommendationController.prototype, "clear", null);
exports.RecommendationController = RecommendationController = __decorate([
    (0, common_1.Controller)('recommendations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [recommendation_service_1.RecommendationService])
], RecommendationController);
//# sourceMappingURL=recommendation.controller.js.map