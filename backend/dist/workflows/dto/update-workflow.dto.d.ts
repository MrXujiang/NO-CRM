import { CreateWorkflowDto } from './create-workflow.dto';
declare const UpdateWorkflowDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateWorkflowDto>>;
export declare class UpdateWorkflowDto extends UpdateWorkflowDto_base {
    status?: 'draft' | 'published' | 'archived';
}
export {};
