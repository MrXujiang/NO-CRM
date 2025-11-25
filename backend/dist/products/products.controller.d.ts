import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createDto: CreateProductDto): import("../common/interfaces").Product;
    findAll(page?: string, pageSize?: string, category?: string, status?: string): {
        data: import("../common/interfaces").Product[];
        total: number;
        page: number;
        pageSize: number;
    };
    getStatistics(): {
        total: number;
        active: number;
        inactive: number;
        totalSales: number;
        totalRevenue: number;
        byCategory: {
            category: string;
            count: number;
            revenue: number;
        }[];
    };
    getActiveProducts(): import("../common/interfaces").Product[];
    findOne(id: string): import("../common/interfaces").Product;
    update(id: string, updateDto: UpdateProductDto): import("../common/interfaces").Product;
    remove(id: string): {
        message: string;
    };
    generateMock(count: number): {
        message: string;
    };
    clearMock(): {
        message: string;
    };
}
