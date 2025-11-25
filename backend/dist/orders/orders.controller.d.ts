import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto, AddOrderItemDto } from './dto/order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createDto: CreateOrderDto, req: any): import("../common/interfaces").Order;
    findAll(req: any, page?: string, pageSize?: string, status?: string, customerId?: string): {
        data: import("../common/interfaces").Order[];
        total: number;
        page: number;
        pageSize: number;
    };
    getStatistics(req: any): {
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
    findOne(id: string): import("../common/interfaces").Order;
    update(id: string, updateDto: UpdateOrderDto): import("../common/interfaces").Order;
    remove(id: string): {
        message: string;
    };
    addItem(id: string, addItemDto: AddOrderItemDto): import("../common/interfaces").Order;
    removeItem(id: string, itemId: string): import("../common/interfaces").Order;
    submit(id: string): import("../common/interfaces").Order;
    approve(id: string, body: {
        approved: boolean;
        notes?: string;
    }, req: any): import("../common/interfaces").Order;
    complete(id: string): import("../common/interfaces").Order;
    getRecommendations(id: string): any[];
    generateMock(count: number, req: any): {
        message: string;
    };
    clearMock(req: any): {
        message: string;
    };
}
