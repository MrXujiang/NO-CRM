import { ContractsService } from './contracts.service';
import { CreateContractDto, UpdateContractDto, SignContractDto } from './dto/contract.dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(createDto: CreateContractDto, req: any): import("../common/interfaces").Contract;
    findAll(req: any, page?: string, pageSize?: string, signStatus?: string): {
        data: import("../common/interfaces").Contract[];
        total: number;
        page: number;
        pageSize: number;
    };
    getStatistics(req: any): {
        total: number;
        byStatus: {
            status: string;
            count: number;
        }[];
        totalAmount: number;
        avgAmount: number;
    };
    findByOrder(orderId: string): import("../common/interfaces").Contract[];
    findOne(id: string): import("../common/interfaces").Contract;
    update(id: string, updateDto: UpdateContractDto): import("../common/interfaces").Contract;
    remove(id: string): {
        message: string;
    };
    sign(id: string, signDto: SignContractDto): import("../common/interfaces").Contract;
    validate(id: string): import("../common/interfaces").ValidationResult;
    generateMock(count: number, req: any): {
        message: string;
    };
    clearMock(req: any): {
        message: string;
    };
}
