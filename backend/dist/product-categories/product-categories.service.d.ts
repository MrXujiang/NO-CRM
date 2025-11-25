import { JsonStorageService } from '../common/json-storage.service';
import type { ProductCategory } from '../common/interfaces';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './dto/product-category.dto';
export declare class ProductCategoriesService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createDto: CreateProductCategoryDto): ProductCategory;
    findAll(page?: number, pageSize?: number, status?: string): {
        data: ProductCategory[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): ProductCategory;
    findByCode(code: string): ProductCategory | undefined;
    findByName(name: string): ProductCategory | undefined;
    getAllActive(): ProductCategory[];
    update(id: string, updateDto: UpdateProductCategoryDto): ProductCategory;
    remove(id: string): void;
    private countProducts;
    private syncProductsCategory;
    generateMockData(): number;
    clearMockData(): number;
}
