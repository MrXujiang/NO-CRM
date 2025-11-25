import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto, req: any): import("../common/interfaces").Customer;
    findAll(req: any, keyword?: string, page?: string, pageSize?: string): {
        data: import("../common/interfaces").Customer[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string, req: any): import("../common/interfaces").Customer;
    update(id: string, updateCustomerDto: UpdateCustomerDto, req: any): import("../common/interfaces").Customer;
    remove(id: string, req: any): {
        message: string;
    };
    generateMock(count: number, req: any): {
        message: string;
    };
    clearMock(req: any): {
        message: string;
    };
}
