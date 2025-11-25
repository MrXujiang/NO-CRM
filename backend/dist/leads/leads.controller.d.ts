import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(createLeadDto: CreateLeadDto, req: any): import("../common/interfaces").Lead;
    findAll(req: any, stage?: string, page?: string, pageSize?: string): {
        data: import("../common/interfaces").Lead[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string, req: any): import("../common/interfaces").Lead;
    update(id: string, updateLeadDto: UpdateLeadDto, req: any): import("../common/interfaces").Lead;
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
