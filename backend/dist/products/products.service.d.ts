import { JsonStorageService } from '../common/json-storage.service';
import type { Product } from '../common/interfaces';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createDto: CreateProductDto): Product;
    findAll(page?: number, pageSize?: number, category?: string, status?: string): {
        data: Product[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): Product;
    findByCode(code: string): Product | undefined;
    findActiveProducts(): Product[];
    update(id: string, updateDto: UpdateProductDto): Product;
    remove(id: string): void;
    incrementSales(productId: string, quantity: number, amount: number): void;
    generateMockData(count: number): number;
    clearMockData(): number;
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
    private groupByCategory;
}
