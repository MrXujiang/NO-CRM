import { JsonStorageService } from '../common/json-storage.service';
import type { ProductRecommendation, Product } from '../common/interfaces';
export declare class RecommendationService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    calculateRecommendations(minSupport?: number, minConfidence?: number): number;
    getRecommendationsForProduct(productId: string, limit?: number): ProductRecommendation[];
    getRecommendationsForOrder(orderId: string, limit?: number): Array<{
        product: Product;
        recommendation: ProductRecommendation;
    }>;
    getAllRecommendations(page?: number, pageSize?: number): {
        data: ProductRecommendation[];
        total: number;
        page: number;
        pageSize: number;
    };
    getStatistics(): {
        total: number;
        avgConfidence: number;
        avgSupport: number;
        avgLift: number;
        topRecommendations: ProductRecommendation[];
    };
    clearRecommendations(): number;
}
