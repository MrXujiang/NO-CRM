export declare class CreateProductDto {
    name: string;
    code: string;
    category: string;
    description?: string;
    price: number;
    unit: string;
    minQuantity: number;
    maxQuantity?: number;
}
export declare class UpdateProductDto {
    name?: string;
    category?: string;
    description?: string;
    price?: number;
    unit?: string;
    minQuantity?: number;
    maxQuantity?: number;
    status?: 'active' | 'inactive';
}
