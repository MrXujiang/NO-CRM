import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, StartWorkflowDto, ProcessTaskDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
export declare class WorkflowsController {
    private readonly workflowsService;
    constructor(workflowsService: WorkflowsService);
    create(createDto: CreateWorkflowDto, req: any): import("../common/workflow-interfaces").WorkflowDefinition;
    findAll(req: any, page?: string, pageSize?: string, category?: string, status?: string): {
        data: import("../common/workflow-interfaces").WorkflowDefinition[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): import("../common/workflow-interfaces").WorkflowDefinition;
    update(id: string, updateDto: UpdateWorkflowDto): import("../common/workflow-interfaces").WorkflowDefinition;
    remove(id: string): {
        message: string;
    };
    publish(id: string): import("../common/workflow-interfaces").WorkflowDefinition;
    startWorkflow(startDto: StartWorkflowDto, workflowId: string, req: any): import("../common/workflow-interfaces").WorkflowInstance;
    getInstances(req: any, page?: string, pageSize?: string, status?: string, businessType?: string): {
        data: import("../common/workflow-interfaces").WorkflowInstance[];
        total: number;
        page: number;
        pageSize: number;
    };
    getInstanceDetail(id: string): {
        instance: {
            workflowName: string;
            currentNodeName: string;
            id: string;
            workflowId: string;
            workflowVersion: number;
            businessType: string;
            businessId: string;
            businessData: Record<string, any>;
            variables: Record<string, any>;
            currentNodeId: string;
            status: import("../common/workflow-interfaces").InstanceStatus;
            result?: "approved" | "rejected" | "cancelled";
            initiator: string;
            initiatorName: string;
            startedAt: string;
            finishedAt?: string;
            duration?: number;
        };
        tasks: {
            nodeName: string;
            assigneeName: string;
            id: string;
            instanceId: string;
            workflowName: string;
            businessType: string;
            businessId: string;
            businessTitle: string;
            nodeId: string;
            nodeType: import("../common/workflow-interfaces").NodeType;
            assigneeId: string;
            status: "pending" | "approved" | "rejected" | "transferred";
            opinion?: string;
            attachments?: string[];
            processedAt?: string;
            createdAt: string;
            dueDate?: string;
            priority: "low" | "medium" | "high";
        }[];
        logs: {
            nodeName: string;
            id: string;
            instanceId: string;
            nodeId: string;
            action: "start" | "approve" | "reject" | "transfer" | "cancel" | "timeout" | "execute_action";
            operator: string;
            operatorName: string;
            opinion?: string;
            fromNodeId?: string;
            toNodeId?: string;
            duration?: number;
            createdAt: string;
        }[];
    };
    getMyTasks(req: any, page?: string, pageSize?: string, status?: string): {
        data: import("../common/workflow-interfaces").WorkflowTask[];
        total: number;
        page: number;
        pageSize: number;
    };
    processTask(id: string, processDto: ProcessTaskDto, req: any): import("../common/workflow-interfaces").WorkflowTask;
    getStatistics(req: any): import("../common/workflow-interfaces").WorkflowStatistics;
    generateMock(count: number, req: any): {
        message: string;
    };
    clearMock(req: any): {
        message: string;
    };
}
