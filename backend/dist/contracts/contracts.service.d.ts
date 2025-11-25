import { JsonStorageService } from '../common/json-storage.service';
import type { Contract, ValidationResult } from '../common/interfaces';
import { CreateContractDto, UpdateContractDto, SignContractDto } from './dto/contract.dto';
import { ContractTemplatesService } from '../contract-templates/contract-templates.service';
import { OrdersService } from '../orders/orders.service';
export declare class ContractsService {
    private readonly storageService;
    private readonly templatesService;
    private readonly ordersService;
    constructor(storageService: JsonStorageService, templatesService: ContractTemplatesService, ordersService: OrdersService);
    generateFromOrder(orderId: string, templateId: string, userId: string): Contract;
    create(createDto: CreateContractDto, userId: string): Contract;
    findAll(userId: string, userRole: string, page?: number, pageSize?: number, signStatus?: string): {
        data: Contract[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): Contract;
    findByOrder(orderId: string): Contract[];
    update(id: string, updateDto: UpdateContractDto): Contract;
    remove(id: string): void;
    sign(id: string, signDto: SignContractDto): Contract;
    validate(id: string): ValidationResult;
    private generateContractNo;
    private numberToChinese;
    private checkTypos;
    private calculateValidationLevel;
    generateMockData(count: number, userId: string): number;
    clearMockData(userId: string, userRole: string): number;
    getStatistics(userId: string, userRole: string): {
        total: number;
        byStatus: {
            status: string;
            count: number;
        }[];
        totalAmount: number;
        avgAmount: number;
    };
    private groupByStatus;
}
