export declare class CreateActivityDto {
    type: 'call' | 'email' | 'meeting' | 'other';
    date: string;
    notes: string;
    customerId?: string;
    leadId?: string;
    remindDate?: string;
}
export declare class UpdateActivityDto {
    type?: 'call' | 'email' | 'meeting' | 'other';
    date?: string;
    notes?: string;
    customerId?: string;
    leadId?: string;
    remindDate?: string;
}
