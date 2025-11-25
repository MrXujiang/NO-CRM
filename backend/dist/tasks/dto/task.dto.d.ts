export declare class CreateTaskDto {
    title: string;
    description?: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    relatedCustomerId?: string;
    relatedLeadId?: string;
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
    status?: 'todo' | 'completed';
    relatedCustomerId?: string;
    relatedLeadId?: string;
}
