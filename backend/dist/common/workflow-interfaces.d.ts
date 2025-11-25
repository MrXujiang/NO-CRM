export interface WorkflowDefinition {
    id: string;
    name: string;
    code: string;
    category: WorkflowCategory;
    description?: string;
    icon?: string;
    version: number;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    variables: WorkflowVariable[];
    status: 'draft' | 'published' | 'archived';
    isSystem: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
}
export type WorkflowCategory = 'approval' | 'business' | 'automation' | 'custom';
export type NodeType = 'start' | 'end' | 'approval' | 'condition' | 'parallel' | 'action' | 'timer' | 'subprocess';
export interface WorkflowNode {
    id: string;
    type: NodeType;
    name: string;
    description?: string;
    position: {
        x: number;
        y: number;
    };
    config: NodeConfig;
    style?: {
        width?: number;
        height?: number;
        backgroundColor?: string;
        borderColor?: string;
    };
}
export interface NodeConfig {
    approvers?: ApproverConfig;
    approvalMode?: 'single' | 'multi' | 'sequential' | 'countersign';
    passCondition?: string;
    timeout?: number;
    autoPass?: boolean;
    expression?: string;
    conditionDesc?: string;
    conditions?: ConditionConfig[];
    defaultBranch?: string;
    parallelMode?: 'all' | 'any' | 'ratio';
    passRatio?: number;
    branchCount?: number;
    actionType?: 'create_task' | 'send_notification' | 'update_data' | 'webhook';
    taskConfig?: Record<string, any>;
    notificationConfig?: Record<string, any>;
    updateConfig?: Record<string, any>;
    webhookConfig?: Record<string, any>;
    actions?: ActionConfig[];
    timerType?: 'delay' | 'scheduled';
    delayDuration?: number;
    scheduledTime?: string;
    subWorkflowId?: string;
    allowReject?: boolean;
    rejectTo?: string;
    notifyUsers?: string[];
}
export interface ApproverConfig {
    type: 'user' | 'role' | 'department' | 'variable' | 'initiator_leader';
    userIds?: string[];
    roleIds?: string[];
    departmentIds?: string[];
    variable?: string;
    leaderLevel?: number;
}
export interface ConditionConfig {
    id: string;
    name: string;
    expression: string;
    targetNodeId: string;
    priority: number;
}
export interface ActionConfig {
    type: 'update_status' | 'create_record' | 'send_notification' | 'webhook';
    params: Record<string, any>;
}
export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    condition?: string;
    style?: {
        stroke?: string;
        strokeWidth?: number;
    };
}
export interface WorkflowVariable {
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'object';
    required: boolean;
    defaultValue?: any;
    description?: string;
}
export interface WorkflowInstance {
    id: string;
    workflowId: string;
    workflowName: string;
    workflowVersion: number;
    businessType: string;
    businessId: string;
    businessData: Record<string, any>;
    variables: Record<string, any>;
    currentNodeId: string;
    currentNodeName: string;
    status: InstanceStatus;
    result?: 'approved' | 'rejected' | 'cancelled';
    initiator: string;
    initiatorName: string;
    startedAt: string;
    finishedAt?: string;
    duration?: number;
}
export type InstanceStatus = 'running' | 'pending' | 'completed' | 'rejected' | 'cancelled' | 'timeout' | 'error';
export interface WorkflowTask {
    id: string;
    instanceId: string;
    workflowName: string;
    businessType: string;
    businessId: string;
    businessTitle: string;
    nodeId: string;
    nodeName: string;
    nodeType: NodeType;
    assigneeId: string;
    assigneeName: string;
    status: 'pending' | 'approved' | 'rejected' | 'transferred';
    opinion?: string;
    attachments?: string[];
    processedAt?: string;
    createdAt: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
}
export interface WorkflowLog {
    id: string;
    instanceId: string;
    nodeId: string;
    nodeName: string;
    action: 'start' | 'approve' | 'reject' | 'transfer' | 'cancel' | 'timeout' | 'execute_action';
    operator: string;
    operatorName: string;
    opinion?: string;
    fromNodeId?: string;
    toNodeId?: string;
    duration?: number;
    createdAt: string;
}
export interface ProcessTaskDto {
    action: 'approve' | 'reject' | 'transfer';
    opinion?: string;
    attachments?: string[];
    transferTo?: string;
}
export interface WorkflowStatistics {
    totalInstances: number;
    runningInstances: number;
    completedInstances: number;
    avgDuration: number;
    approvalRate: number;
    myPendingTasks: number;
    byStatus: Array<{
        status: string;
        count: number;
    }>;
    byBusinessType: Array<{
        type: string;
        count: number;
    }>;
    recentInstances: WorkflowInstance[];
}
