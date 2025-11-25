export declare class CreateProductCategoryDto {
    name: string;
    code: string;
    description?: string;
    icon?: string;
    color?: string;
    sort?: number;
}
export declare class UpdateProductCategoryDto {
    name?: string;
    code?: string;
    description?: string;
    icon?: string;
    color?: string;
    sort?: number;
    status?: 'active' | 'inactive';
}
