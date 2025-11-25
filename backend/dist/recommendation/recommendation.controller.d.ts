import { RecommendationService } from './recommendation.service';
export declare class RecommendationController {
    private readonly recommendationService;
    constructor(recommendationService: RecommendationService);
    calculate(minSupport?: number, minConfidence?: number): {
        message: string;
        count: number;
    };
    getAll(page?: string, pageSize?: string): {
        data: import("../common/interfaces").ProductRecommendation[];
        total: number;
        page: number;
        pageSize: number;
    };
    getStatistics(): {
        total: number;
        avgConfidence: number;
        avgSupport: number;
        avgLift: number;
        topRecommendations: import("../common/interfaces").ProductRecommendation[];
    };
    getForProduct(productId: string, limit?: string): import("../common/interfaces").ProductRecommendation[];
    getForOrder(orderId: string, limit?: string): {
        product: import("../common/interfaces").Product;
        recommendation: import("../common/interfaces").ProductRecommendation;
    }[];
    clear(): {
        message: string;
    };
}
