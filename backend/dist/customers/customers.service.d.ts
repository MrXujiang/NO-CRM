import { JsonStorageService } from '../common/json-storage.service';
import { Customer } from '../common/interfaces';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
export declare class CustomersService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createCustomerDto: CreateCustomerDto, userId: string): Customer;
    findAll(userId: string, userRole: string): Customer[];
    findAllPaginated(userId: string, userRole: string, page?: number, pageSize?: number): {
        data: Customer[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string, userId: string, userRole: string): Customer;
    update(id: string, updateCustomerDto: UpdateCustomerDto, userId: string, userRole: string): Customer;
    remove(id: string, userId: string, userRole: string): void;
    search(keyword: string, userId: string, userRole: string): Customer[];
    searchPaginated(keyword: string, userId: string, userRole: string, page?: number, pageSize?: number): {
        data: Customer[];
        total: number;
        page: number;
        pageSize: number;
    };
    generateMockData(count: number, userId: string): number;
    clearMockData(userId: string, userRole: string): number;
}
