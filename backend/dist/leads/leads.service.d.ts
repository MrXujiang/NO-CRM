import { JsonStorageService } from '../common/json-storage.service';
import { Lead } from '../common/interfaces';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
export declare class LeadsService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createLeadDto: CreateLeadDto, userId: string): Lead;
    findAll(userId: string, userRole: string): Lead[];
    findAllPaginated(userId: string, userRole: string, page?: number, pageSize?: number): {
        data: Lead[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string, userId: string, userRole: string): Lead;
    update(id: string, updateLeadDto: UpdateLeadDto, userId: string, userRole: string): Lead;
    remove(id: string, userId: string, userRole: string): void;
    findByStage(stage: string, userId: string, userRole: string): Lead[];
    findByStagePaginated(stage: string, userId: string, userRole: string, page?: number, pageSize?: number): {
        data: Lead[];
        total: number;
        page: number;
        pageSize: number;
    };
    generateMockData(count: number, userId: string): number;
    clearMockData(userId: string, userRole: string): number;
}
