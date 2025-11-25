import { JsonStorageService } from '../common/json-storage.service';
import type { Order } from '../common/interfaces';
import { CreateOrderDto, UpdateOrderDto, AddOrderItemDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';
import { RecommendationService } from '../recommendation/recommendation.service';
export declare class OrdersService {
    private readonly storageService;
    private readonly productsService;
    private readonly recommendationService;
    constructor(storageService: JsonStorageService, productsService: ProductsService, recommendationService: RecommendationService);
    create(createDto: CreateOrderDto, userId: string): Order;
    findAll(userId: string, userRole: string, page?: number, pageSize?: number, status?: string, customerId?: string): {
        data: Order[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): Order;
    update(id: string, updateDto: UpdateOrderDto): Order;
    remove(id: string): void;
    addItem(orderId: string, addItemDto: AddOrderItemDto): Order;
    removeItem(orderId: string, itemId: string): Order;
    submit(orderId: string): Order;
    approve(orderId: string, approved: boolean, approverId: string, notes?: string): Order;
    complete(orderId: string): Order;
    getRecommendations(orderId: string): any[];
    private generateOrderNo;
    private calculateAmount;
    generateMockData(count: number, userId: string): number;
    clearMockData(userId: string, userRole: string): number;
    getStatistics(userId: string, userRole: string): {
        total: number;
        byStatus: {
            status: string;
            count: number;
        }[];
        byStage: {
            stage: string;
            count: number;
        }[];
        totalAmount: number;
        avgAmount: number;
    };
    private groupByStatus;
    private groupByStage;
}
