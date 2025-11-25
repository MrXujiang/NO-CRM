import { ContractTemplatesService } from './contract-templates.service';
import { CreateContractTemplateDto, UpdateContractTemplateDto } from './dto/contract-template.dto';
export declare class ContractTemplatesController {
    private readonly contractTemplatesService;
    constructor(contractTemplatesService: ContractTemplatesService);
    create(createDto: CreateContractTemplateDto, req: any): import("../common/interfaces").ContractTemplate;
    findAll(req: any, category?: string, page?: string, pageSize?: string): {
        data: import("../common/interfaces").ContractTemplate[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): import("../common/interfaces").ContractTemplate;
    update(id: string, updateDto: UpdateContractTemplateDto): import("../common/interfaces").ContractTemplate;
    remove(id: string): {
        message: string;
    };
    copy(id: string, req: any): import("../common/interfaces").ContractTemplate;
    preview(id: string, body: {
        variables: any;
    }): {
        html: string;
    };
    generateMock(count: number, req: any): {
        message: string;
    };
    clearMock(req: any): {
        message: string;
    };
}
