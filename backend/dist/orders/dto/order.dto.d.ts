import type { OrderItem, OrderStatus, OrderStage } from '../../common/interfaces';
export declare class CreateOrderDto {
    customerId: string;
    leadId?: string;
    title: string;
    description?: string;
    items: OrderItem[];
    discount: number;
    paymentTerms: string;
    requireApproval: boolean;
    notes?: string;
}
export declare class UpdateOrderDto {
    title?: string;
    description?: string;
    items?: OrderItem[];
    discount?: number;
    paymentTerms?: string;
    status?: OrderStatus;
    stage?: OrderStage;
    notes?: string;
}
export declare class AddOrderItemDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    notes?: string;
}
