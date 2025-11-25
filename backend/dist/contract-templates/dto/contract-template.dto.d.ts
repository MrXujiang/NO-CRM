import type { TemplateCategory, TemplateVariable } from '../../common/interfaces';
export declare class CreateContractTemplateDto {
    name: string;
    code: string;
    category: TemplateCategory;
    description?: string;
    content: string;
    variables?: TemplateVariable[];
    clauseIds?: string[];
    requiredFields?: string[];
}
export declare class UpdateContractTemplateDto {
    name?: string;
    description?: string;
    content?: string;
    variables?: TemplateVariable[];
    clauseIds?: string[];
    requiredFields?: string[];
    status?: 'draft' | 'active' | 'archived';
}
