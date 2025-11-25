"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let WorkflowsService = class WorkflowsService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createDto, userId) {
        const workflow = {
            id: (0, uuid_1.v4)(),
            name: createDto.name,
            code: createDto.code || `WF_${Date.now()}`,
            category: createDto.category,
            description: createDto.description,
            icon: createDto.icon,
            version: 1,
            nodes: createDto.nodes || this.getDefaultNodes(),
            edges: createDto.edges || [],
            variables: createDto.variables || [],
            status: 'draft',
            isSystem: false,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return this.storageService.create('workflow-definitions', workflow);
    }
    getDefaultNodes() {
        return [
            {
                id: 'start',
                type: 'start',
                name: '开始',
                position: { x: 250, y: 50 },
                config: {},
            },
            {
                id: 'end',
                type: 'end',
                name: '结束',
                position: { x: 250, y: 400 },
                config: {},
            },
        ];
    }
    findAll(userId, isAdmin, page = 1, pageSize = 10, category, status) {
        let definitions = this.storageService.read('workflow-definitions');
        if (category) {
            definitions = definitions.filter(d => d.category === category);
        }
        if (status) {
            definitions = definitions.filter(d => d.status === status);
        }
        if (!isAdmin) {
            definitions = definitions.filter(d => d.createdBy === userId || d.isSystem);
        }
        return this.storageService.paginate(definitions, page, pageSize);
    }
    findOne(id) {
        const workflow = this.storageService.findById('workflow-definitions', id);
        if (!workflow) {
            throw new Error('工作流不存在');
        }
        return workflow;
    }
    update(id, updateDto) {
        const workflow = this.findOne(id);
        if (workflow.status === 'published' && updateDto.status !== 'archived') {
            workflow.version += 1;
        }
        const updated = {
            ...workflow,
            ...updateDto,
            updatedAt: new Date().toISOString(),
            publishedAt: updateDto.status === 'published' ? new Date().toISOString() : workflow.publishedAt,
        };
        return this.storageService.update('workflow-definitions', id, updated);
    }
    remove(id) {
        const workflow = this.findOne(id);
        if (workflow.isSystem) {
            throw new Error('系统预置工作流不能删除');
        }
        if (workflow.status === 'published') {
            throw new Error('已发布的工作流不能删除，请先归档');
        }
        this.storageService.delete('workflow-definitions', id);
    }
    publish(id) {
        const workflow = this.findOne(id);
        this.validateWorkflow(workflow);
        return this.update(id, { status: 'published' });
    }
    validateWorkflow(workflow) {
        const hasStart = workflow.nodes.some(n => n.type === 'start');
        const hasEnd = workflow.nodes.some(n => n.type === 'end');
        if (!hasStart) {
            throw new Error('工作流必须有开始节点');
        }
        if (!hasEnd) {
            throw new Error('工作流必须有结束节点');
        }
        if (workflow.nodes.length < 3) {
            throw new Error('工作流至少需要包含开始、业务节点和结束节点');
        }
    }
    startWorkflow(workflowId, startDto, userId, userName) {
        const workflow = this.findOne(workflowId);
        if (workflow.status !== 'published') {
            throw new Error('只能启动已发布的工作流');
        }
        const instance = {
            id: (0, uuid_1.v4)(),
            workflowId: workflow.id,
            workflowName: workflow.name,
            workflowVersion: workflow.version,
            businessType: startDto.businessType,
            businessId: startDto.businessId,
            businessData: { ...startDto.businessData, title: startDto.businessTitle },
            variables: startDto.variables || {},
            currentNodeId: 'start',
            currentNodeName: '开始',
            status: 'running',
            initiator: userId,
            initiatorName: userName,
            startedAt: new Date().toISOString(),
        };
        const createdInstance = this.storageService.create('workflow-instances', instance);
        this.createLog({
            instanceId: instance.id,
            nodeId: 'start',
            nodeName: '开始',
            action: 'start',
            operator: userId,
            operatorName: userName,
        });
        this.moveToNextNode(createdInstance, workflow, userId, userName);
        return createdInstance;
    }
    moveToNextNode(instance, workflow, userId, userName) {
        const currentNode = workflow.nodes.find(n => n.id === instance.currentNodeId);
        const nextEdges = workflow.edges.filter(e => e.source === instance.currentNodeId);
        if (nextEdges.length === 0) {
            return;
        }
        let targetEdge = nextEdges[0];
        if (currentNode?.type === 'condition') {
            targetEdge = this.evaluateCondition(currentNode, instance, workflow, nextEdges);
        }
        const nextNode = workflow.nodes.find(n => n.id === targetEdge.target);
        if (!nextNode) {
            return;
        }
        instance.currentNodeId = nextNode.id;
        instance.currentNodeName = nextNode.name;
        this.handleNodeType(nextNode, instance, workflow, userId, userName);
    }
    handleNodeType(node, instance, workflow, userId, userName) {
        switch (node.type) {
            case 'end':
                instance.status = 'completed';
                instance.result = 'approved';
                instance.finishedAt = new Date().toISOString();
                instance.duration = Math.round((new Date(instance.finishedAt).getTime() - new Date(instance.startedAt).getTime()) / 60000);
                this.storageService.update('workflow-instances', instance.id, instance);
                break;
            case 'approval':
                this.createTasks(instance, node, userId, userName);
                this.storageService.update('workflow-instances', instance.id, instance);
                break;
            case 'condition':
                instance.status = 'running';
                this.storageService.update('workflow-instances', instance.id, instance);
                this.moveToNextNode(instance, workflow, userId, userName);
                break;
            case 'parallel':
                this.createParallelTasks(instance, node, workflow, userId, userName);
                this.storageService.update('workflow-instances', instance.id, instance);
                break;
            case 'action':
                this.executeAction(instance, node, workflow, userId, userName);
                break;
            default:
                this.storageService.update('workflow-instances', instance.id, instance);
        }
    }
    evaluateCondition(node, instance, workflow, edges) {
        const expression = node.config?.expression || '';
        if (!expression) {
            return edges[0];
        }
        try {
            const context = {
                amount: instance.businessData?.amount || 0,
                totalAmount: instance.businessData?.totalAmount || 0,
                status: instance.businessData?.status || '',
                customerId: instance.businessData?.customerId || '',
                ...instance.variables,
            };
            const result = this.evaluateExpression(expression, context);
            return result ? edges[0] : (edges[1] || edges[0]);
        }
        catch (error) {
            console.error('条件表达式求值失败:', error);
            return edges[0];
        }
    }
    evaluateExpression(expression, context) {
        let expr = expression;
        Object.keys(context).forEach(key => {
            expr = expr.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), context[key]);
        });
        try {
            if (/[^0-9+\-*/<>=!&|()\s.]/.test(expr)) {
                throw new Error('表达式包含非法字符');
            }
            return eval(expr);
        }
        catch (error) {
            console.error('表达式求值错误:', error);
            return false;
        }
    }
    createParallelTasks(instance, node, workflow, userId, userName) {
        const parallelMode = node.config?.parallelMode || 'all';
        const nextEdges = workflow.edges.filter(e => e.source === node.id);
        nextEdges.forEach(edge => {
            const targetNode = workflow.nodes.find(n => n.id === edge.target);
            if (targetNode && targetNode.type === 'approval') {
                this.createTasks(instance, targetNode, userId, userName);
            }
        });
        instance.variables = instance.variables || {};
        instance.variables[`parallel_${node.id}_mode`] = parallelMode;
        instance.variables[`parallel_${node.id}_branches`] = nextEdges.length;
        instance.status = 'pending';
    }
    executeAction(instance, node, workflow, userId, userName) {
        const actionType = node.config?.actionType || 'none';
        try {
            switch (actionType) {
                case 'create_task':
                    this.autoCreateTask(instance, node);
                    break;
                case 'send_notification':
                    this.sendNotification(instance, node);
                    break;
                case 'update_data':
                    this.updateBusinessData(instance, node);
                    break;
                case 'webhook':
                    this.callWebhook(instance, node);
                    break;
                default:
                    console.log(`未知动作类型: ${actionType}`);
            }
            this.createLog({
                instanceId: instance.id,
                nodeId: node.id,
                nodeName: node.name,
                action: 'execute_action',
                operator: 'system',
                operatorName: '系统',
                opinion: `执行动作: ${actionType}`,
            });
            instance.status = 'running';
            this.storageService.update('workflow-instances', instance.id, instance);
            this.moveToNextNode(instance, workflow, userId, userName);
        }
        catch (error) {
            console.error('动作执行失败:', error);
            instance.status = 'error';
            this.storageService.update('workflow-instances', instance.id, instance);
        }
    }
    autoCreateTask(instance, node) {
        const taskConfig = node.config?.taskConfig || {};
        console.log('自动创建任务:', taskConfig);
    }
    sendNotification(instance, node) {
        const notificationConfig = node.config?.notificationConfig || {};
        console.log('发送通知:', notificationConfig);
    }
    updateBusinessData(instance, node) {
        const updateConfig = node.config?.updateConfig || {};
        console.log('更新业务数据:', updateConfig);
    }
    callWebhook(instance, node) {
        const webhookConfig = node.config?.webhookConfig || {};
        console.log('调用Webhook:', webhookConfig);
    }
    createTasks(instance, node, userId, userName) {
        const approvers = this.resolveApprovers(node, instance, userId);
        approvers.forEach(approver => {
            const task = {
                id: (0, uuid_1.v4)(),
                instanceId: instance.id,
                workflowName: instance.workflowName,
                businessType: instance.businessType,
                businessId: instance.businessId,
                businessTitle: instance.businessData.title || '',
                nodeId: node.id,
                nodeName: node.name,
                nodeType: node.type,
                assigneeId: approver.userId,
                assigneeName: approver.userName,
                status: 'pending',
                createdAt: new Date().toISOString(),
                priority: 'medium',
            };
            this.storageService.create('workflow-tasks', task);
        });
        instance.status = 'pending';
        this.storageService.update('workflow-instances', instance.id, instance);
    }
    resolveApprovers(node, instance, userId) {
        const users = this.storageService.read('users');
        const user = users.find(u => u.id === userId);
        return user ? [{ userId: user.id, userName: user.name }] : [];
    }
    processTask(taskId, processDto, userId, userName) {
        const tasks = this.storageService.read('workflow-tasks');
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            throw new Error('任务不存在');
        }
        if (task.status !== 'pending') {
            throw new Error('任务已处理');
        }
        if (task.assigneeId !== userId) {
            throw new Error('无权处理此任务');
        }
        task.status = processDto.action === 'approve' ? 'approved' : 'rejected';
        task.opinion = processDto.opinion;
        task.attachments = processDto.attachments;
        task.processedAt = new Date().toISOString();
        this.storageService.update('workflow-tasks', taskId, task);
        this.createLog({
            instanceId: task.instanceId,
            nodeId: task.nodeId,
            nodeName: task.nodeName,
            action: processDto.action,
            operator: userId,
            operatorName: userName,
            opinion: processDto.opinion,
        });
        this.processInstance(task.instanceId, processDto.action, userId, userName);
        return task;
    }
    processInstance(instanceId, action, userId, userName) {
        const instances = this.storageService.read('workflow-instances');
        const instance = instances.find(i => i.id === instanceId);
        if (!instance) {
            return;
        }
        const workflow = this.findOne(instance.workflowId);
        if (action === 'approve') {
            const tasks = this.storageService.read('workflow-tasks');
            const nodeTasks = tasks.filter(t => t.instanceId === instanceId && t.nodeId === instance.currentNodeId);
            const allProcessed = nodeTasks.every(t => t.status !== 'pending');
            if (allProcessed) {
                instance.status = 'running';
                this.storageService.update('workflow-instances', instance.id, instance);
                this.moveToNextNode(instance, workflow, userId, userName);
            }
        }
        else if (action === 'reject') {
            instance.status = 'rejected';
            instance.result = 'rejected';
            instance.finishedAt = new Date().toISOString();
            instance.duration = Math.round((new Date(instance.finishedAt).getTime() - new Date(instance.startedAt).getTime()) / 60000);
            this.storageService.update('workflow-instances', instance.id, instance);
        }
    }
    createLog(logData) {
        const log = {
            id: (0, uuid_1.v4)(),
            instanceId: logData.instanceId,
            nodeId: logData.nodeId,
            nodeName: logData.nodeName,
            action: logData.action,
            operator: logData.operator,
            operatorName: logData.operatorName,
            opinion: logData.opinion,
            createdAt: new Date().toISOString(),
        };
        return this.storageService.create('workflow-logs', log);
    }
    getInstances(userId, isAdmin, page = 1, pageSize = 10, status, businessType) {
        let instances = this.storageService.read('workflow-instances');
        if (!isAdmin) {
            instances = instances.filter(i => i.initiator === userId);
        }
        if (status) {
            instances = instances.filter(i => i.status === status);
        }
        if (businessType) {
            instances = instances.filter(i => i.businessType === businessType);
        }
        instances.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
        return this.storageService.paginate(instances, page, pageSize);
    }
    getMyTasks(userId, page = 1, pageSize = 10, status) {
        let tasks = this.storageService.read('workflow-tasks');
        tasks = tasks.filter(t => t.assigneeId === userId);
        if (status) {
            tasks = tasks.filter(t => t.status === status);
        }
        tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return this.storageService.paginate(tasks, page, pageSize);
    }
    getInstanceDetail(instanceId, userId, isAdmin) {
        const instance = this.storageService.read('workflow-instances')
            .find(i => i.id === instanceId);
        if (!instance) {
            throw new common_1.NotFoundException(`实例 ${instanceId} 不存在`);
        }
        if (userId && !isAdmin && instance.initiator !== userId) {
            const tasks = this.storageService.read('workflow-tasks');
            const hasTask = tasks.some(t => t.instanceId === instanceId && t.assigneeId === userId);
            if (!hasTask) {
                throw new common_1.ForbiddenException('无权查看此实例');
            }
        }
        const tasks = this.storageService.read('workflow-tasks')
            .filter(t => t.instanceId === instanceId);
        const logs = this.storageService.read('workflow-logs')
            .filter(l => l.instanceId === instanceId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const workflow = this.findOne(instance.workflowId);
        return {
            instance: {
                ...instance,
                workflowName: workflow.name,
                currentNodeName: workflow.nodes.find(n => n.id === instance.currentNodeId)?.name || '',
            },
            tasks: tasks.map(t => ({
                ...t,
                nodeName: workflow.nodes.find(n => n.id === t.nodeId)?.name || '',
                assigneeName: t.assigneeName || 'Unknown',
            })),
            logs: logs.map(l => ({
                ...l,
                nodeName: workflow.nodes.find(n => n.id === l.nodeId)?.name || '',
            })),
        };
    }
    getStatistics(userId, isAdmin) {
        let instances = this.storageService.read('workflow-instances');
        if (!isAdmin) {
            instances = instances.filter(i => i.initiator === userId);
        }
        const tasks = this.storageService.read('workflow-tasks');
        const myPendingTasks = tasks.filter(t => t.assigneeId === userId && t.status === 'pending').length;
        const completedInstances = instances.filter(i => i.status === 'completed');
        const avgDuration = completedInstances.length > 0
            ? completedInstances.reduce((sum, i) => sum + (i.duration || 0), 0) / completedInstances.length
            : 0;
        const approvedCount = instances.filter(i => i.result === 'approved').length;
        const approvalRate = instances.length > 0 ? (approvedCount / instances.length) * 100 : 0;
        const byStatus = this.groupByStatus(instances);
        const byBusinessType = this.groupByBusinessType(instances);
        return {
            totalInstances: instances.length,
            runningInstances: instances.filter(i => i.status === 'running' || i.status === 'pending').length,
            completedInstances: completedInstances.length,
            avgDuration: Math.round(avgDuration),
            approvalRate: Math.round(approvalRate),
            myPendingTasks,
            byStatus,
            byBusinessType,
            recentInstances: instances.slice(0, 10),
        };
    }
    groupByStatus(instances) {
        const grouped = {};
        instances.forEach(item => {
            const value = item.status || 'unknown';
            grouped[value] = (grouped[value] || 0) + 1;
        });
        return Object.keys(grouped).map(k => ({ status: k, count: grouped[k] }));
    }
    groupByBusinessType(instances) {
        const grouped = {};
        instances.forEach(item => {
            const value = item.businessType || 'unknown';
            grouped[value] = (grouped[value] || 0) + 1;
        });
        return Object.keys(grouped).map(k => ({ type: k, count: grouped[k] }));
    }
    generateMockData(count, userId, userName) {
        const orderApprovalWorkflow = this.createDefaultOrderApprovalWorkflow(userId);
        const conditionalWorkflow = this.createConditionalWorkflow(userId);
        const parallelWorkflow = this.createParallelWorkflow(userId);
        for (let i = 0; i < count; i++) {
            const amount = Math.random() * 100000;
            const businessId = `ORDER_${Date.now()}_${i}`;
            let workflowId = orderApprovalWorkflow.id;
            if (amount > 50000) {
                workflowId = conditionalWorkflow.id;
            }
            else if (i % 3 === 0) {
                workflowId = parallelWorkflow.id;
            }
            this.startWorkflow(workflowId, {
                businessType: 'order',
                businessId,
                businessTitle: `测试订单 #${i + 1}`,
                businessData: { amount, totalAmount: amount },
                variables: {},
            }, userId, userName);
        }
        return count;
    }
    createDefaultOrderApprovalWorkflow(userId) {
        const workflows = this.storageService.read('workflow-definitions');
        const existing = workflows.find(w => w.code === 'ORDER_APPROVAL');
        if (existing) {
            return existing;
        }
        const workflow = {
            id: (0, uuid_1.v4)(),
            name: '订单审批流程',
            code: 'ORDER_APPROVAL',
            category: 'approval',
            description: '订单金额>10000需审批',
            version: 1,
            nodes: [
                { id: 'start', type: 'start', name: '开始', position: { x: 250, y: 50 }, config: {} },
                { id: 'approval1', type: 'approval', name: '主管审批', position: { x: 250, y: 150 }, config: { approvalMode: 'single' } },
                { id: 'approval2', type: 'approval', name: '总监审批', position: { x: 250, y: 250 }, config: { approvalMode: 'single' } },
                { id: 'end', type: 'end', name: '结束', position: { x: 250, y: 350 }, config: {} },
            ],
            edges: [
                { id: 'e1', source: 'start', target: 'approval1' },
                { id: 'e2', source: 'approval1', target: 'approval2' },
                { id: 'e3', source: 'approval2', target: 'end' },
            ],
            variables: [],
            status: 'published',
            isSystem: true,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        };
        return this.storageService.create('workflow-definitions', workflow);
    }
    createConditionalWorkflow(userId) {
        const workflows = this.storageService.read('workflow-definitions');
        const existing = workflows.find(w => w.code === 'CONDITIONAL_APPROVAL');
        if (existing) {
            return existing;
        }
        const workflow = {
            id: (0, uuid_1.v4)(),
            name: '条件分支审批流程',
            code: 'CONDITIONAL_APPROVAL',
            category: 'approval',
            description: '根据金额自动选择审批路径',
            icon: 'fork',
            version: 1,
            nodes: [
                { id: 'start', type: 'start', name: '开始', position: { x: 250, y: 50 }, config: {} },
                {
                    id: 'condition1',
                    type: 'condition',
                    name: '金额判断',
                    position: { x: 250, y: 150 },
                    config: {
                        expression: '${amount} > 50000',
                        conditionDesc: '大于5万需VP审批'
                    }
                },
                { id: 'approval_normal', type: 'approval', name: '主管审批', position: { x: 150, y: 250 }, config: { approvalMode: 'single' } },
                { id: 'approval_vp', type: 'approval', name: 'VP审批', position: { x: 350, y: 250 }, config: { approvalMode: 'single' } },
                { id: 'end', type: 'end', name: '结束', position: { x: 250, y: 350 }, config: {} },
            ],
            edges: [
                { id: 'e1', source: 'start', target: 'condition1' },
                { id: 'e2', source: 'condition1', target: 'approval_normal', label: '小于5万' },
                { id: 'e3', source: 'condition1', target: 'approval_vp', label: '大于5万' },
                { id: 'e4', source: 'approval_normal', target: 'end' },
                { id: 'e5', source: 'approval_vp', target: 'end' },
            ],
            variables: [],
            status: 'published',
            isSystem: true,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        };
        return this.storageService.create('workflow-definitions', workflow);
    }
    createParallelWorkflow(userId) {
        const workflows = this.storageService.read('workflow-definitions');
        const existing = workflows.find(w => w.code === 'PARALLEL_APPROVAL');
        if (existing) {
            return existing;
        }
        const workflow = {
            id: (0, uuid_1.v4)(),
            name: '并行审批流程',
            code: 'PARALLEL_APPROVAL',
            category: 'approval',
            description: '多部门并行会签',
            icon: 'fork',
            version: 1,
            nodes: [
                { id: 'start', type: 'start', name: '开始', position: { x: 250, y: 50 }, config: {} },
                {
                    id: 'parallel1',
                    type: 'parallel',
                    name: '并行审批',
                    position: { x: 250, y: 150 },
                    config: {
                        parallelMode: 'all',
                        branchCount: 3
                    }
                },
                { id: 'approval_finance', type: 'approval', name: '财务审批', position: { x: 100, y: 250 }, config: { approvalMode: 'single' } },
                { id: 'approval_legal', type: 'approval', name: '法务审批', position: { x: 250, y: 250 }, config: { approvalMode: 'single' } },
                { id: 'approval_tech', type: 'approval', name: '技术审批', position: { x: 400, y: 250 }, config: { approvalMode: 'single' } },
                { id: 'end', type: 'end', name: '结束', position: { x: 250, y: 350 }, config: {} },
            ],
            edges: [
                { id: 'e1', source: 'start', target: 'parallel1' },
                { id: 'e2', source: 'parallel1', target: 'approval_finance' },
                { id: 'e3', source: 'parallel1', target: 'approval_legal' },
                { id: 'e4', source: 'parallel1', target: 'approval_tech' },
                { id: 'e5', source: 'approval_finance', target: 'end' },
                { id: 'e6', source: 'approval_legal', target: 'end' },
                { id: 'e7', source: 'approval_tech', target: 'end' },
            ],
            variables: [],
            status: 'published',
            isSystem: true,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
        };
        return this.storageService.create('workflow-definitions', workflow);
    }
    clearMockData(userId, isAdmin) {
        let count = 0;
        if (isAdmin) {
            const definitions = this.storageService.read('workflow-definitions').filter(w => !w.isSystem);
            count += definitions.length;
            this.storageService.write('workflow-definitions', this.storageService.read('workflow-definitions').filter(w => w.isSystem));
        }
        const instances = this.storageService.read('workflow-instances');
        const toDelete = isAdmin ? instances : instances.filter(i => i.initiator === userId);
        count += toDelete.length;
        this.storageService.write('workflow-instances', instances.filter(i => !toDelete.includes(i)));
        return count;
    }
};
exports.WorkflowsService = WorkflowsService;
exports.WorkflowsService = WorkflowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], WorkflowsService);
//# sourceMappingURL=workflows.service.js.map