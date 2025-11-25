export declare class CreateLeadDto {
    leadName: string;
    contactInfo: string;
    stage: 'uncontacted' | 'contacted' | 'qualified' | 'converted' | 'invalid';
    intentionLevel?: 'low' | 'medium' | 'high';
    relatedCustomerId?: string;
}
export declare class UpdateLeadDto {
    leadName?: string;
    contactInfo?: string;
    stage?: 'uncontacted' | 'contacted' | 'qualified' | 'converted' | 'invalid';
    intentionLevel?: 'low' | 'medium' | 'high';
    relatedCustomerId?: string;
}
