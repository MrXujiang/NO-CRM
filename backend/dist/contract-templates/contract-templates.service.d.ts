import { JsonStorageService } from '../common/json-storage.service';
import type { ContractTemplate } from '../common/interfaces';
import { CreateContractTemplateDto, UpdateContractTemplateDto } from './dto/contract-template.dto';
export declare class ContractTemplatesService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createDto: CreateContractTemplateDto, userId: string): ContractTemplate;
    findAll(userId: string, userRole: string, page?: number, pageSize?: number): {
        data: ContractTemplate[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): ContractTemplate;
    findByCategory(category: string, page?: number, pageSize?: number): {
        data: ContractTemplate[];
        total: number;
        page: number;
        pageSize: number;
    };
    update(id: string, updateDto: UpdateContractTemplateDto): ContractTemplate;
    remove(id: string): void;
    copy(id: string, userId: string): ContractTemplate;
    preview(id: string, variables: any): {
        html: string;
    };
    incrementUsage(id: string): void;
    generateMockData(count: number, userId: string): number;
    clearMockData(userId: string, userRole: string): number;
}
