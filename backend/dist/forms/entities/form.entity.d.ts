export interface Form {
    id: string;
    title: string;
    description?: string;
    config: any;
    status: 'draft' | 'published' | 'archived';
    shareUrl: string;
    viewCount: number;
    submitCount: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface FormSubmission {
    id: string;
    formId: string;
    data: Record<string, any>;
    ip?: string;
    userAgent?: string;
    submittedAt: Date;
}
