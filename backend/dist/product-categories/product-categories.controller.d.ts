import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './dto/product-category.dto';
export declare class ProductCategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: ProductCategoriesService);
    create(createDto: CreateProductCategoryDto): import("../common/interfaces").ProductCategory;
    findAll(page?: string, pageSize?: string, status?: string): {
        data: import("../common/interfaces").ProductCategory[];
        total: number;
        page: number;
        pageSize: number;
    };
    findActive(): import("../common/interfaces").ProductCategory[];
    findOne(id: string): import("../common/interfaces").ProductCategory;
    update(id: string, updateDto: UpdateProductCategoryDto): import("../common/interfaces").ProductCategory;
    remove(id: string): {
        message: string;
    };
    generateMock(): {
        message: string;
    };
    clearMock(): {
        message: string;
    };
}
