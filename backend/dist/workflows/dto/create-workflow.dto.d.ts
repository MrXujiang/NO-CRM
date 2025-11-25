import type { WorkflowCategory, WorkflowNode, WorkflowEdge, WorkflowVariable } from '../../common/workflow-interfaces';
export declare class CreateWorkflowDto {
    name: string;
    code?: string;
    category: WorkflowCategory;
    description?: string;
    icon?: string;
    nodes?: WorkflowNode[];
    edges?: WorkflowEdge[];
    variables?: WorkflowVariable[];
}
export declare class StartWorkflowDto {
    businessType: string;
    businessId: string;
    businessTitle: string;
    businessData?: Record<string, any>;
    variables?: Record<string, any>;
}
export declare class ProcessTaskDto {
    action: 'approve' | 'reject' | 'transfer';
    opinion?: string;
    attachments?: string[];
    transferTo?: string;
}
