export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'export' | 'import' | 'approve' | 'manage';
export type PermissionResource = 'customer' | 'lead' | 'activity' | 'task' | 'product' | 'product_category' | 'order' | 'contract' | 'contract_template' | 'user' | 'role' | 'department' | 'permission' | 'statistics' | 'system' | 'form';
export interface Permission {
    id: string;
    name: string;
    code: string;
    resource: PermissionResource;
    action: PermissionAction;
    description?: string;
    createdAt: string;
}
export interface Role {
    id: string;
    name: string;
    code: string;
    description?: string;
    permissionIds: string[];
    isSystem: boolean;
    status: 'active' | 'inactive';
    userCount: number;
    createdAt: string;
    updatedAt: string;
}
export interface Department {
    id: string;
    name: string;
    code: string;
    parentId?: string;
    managerId?: string;
    description?: string;
    sort: number;
    status: 'active' | 'inactive';
    memberCount: number;
    createdAt: string;
    updatedAt: string;
}
export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'sales';
    roleId?: string;
    departmentId?: string;
    phone?: string;
    avatar?: string;
    status: 'active' | 'inactive';
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface Customer {
    id: string;
    name: string;
    phone: string;
    company?: string;
    source?: string;
    tags?: string[];
    remarks?: string;
    attachments?: FileAttachment[];
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}
export interface FileAttachment {
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    url: string;
    uploadedAt: string;
}
export interface Lead {
    id: string;
    leadName: string;
    contactInfo: string;
    stage: 'uncontacted' | 'contacted' | 'qualified' | 'converted' | 'invalid';
    intentionLevel?: 'low' | 'medium' | 'high';
    relatedCustomerId?: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}
export interface Activity {
    id: string;
    type: 'call' | 'email' | 'meeting' | 'other';
    date: string;
    notes: string;
    customerId?: string;
    leadId?: string;
    remindDate?: string;
    ownerId: string;
    createdAt: string;
}
export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'completed';
    relatedCustomerId?: string;
    relatedLeadId?: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}
export interface ProductCategory {
    id: string;
    name: string;
    code: string;
    description?: string;
    icon?: string;
    color?: string;
    sort: number;
    status: 'active' | 'inactive';
    productCount: number;
    createdAt: string;
    updatedAt: string;
}
export interface Product {
    id: string;
    name: string;
    code: string;
    category: string;
    description?: string;
    price: number;
    unit: string;
    minQuantity: number;
    maxQuantity?: number;
    status: 'active' | 'inactive';
    salesCount: number;
    revenue: number;
    createdAt: string;
    updatedAt: string;
}
export type TemplateCategory = 'sales_contract' | 'service_agreement' | 'nda' | 'partnership' | 'other';
export interface TemplateVariable {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    required: boolean;
    defaultValue?: any;
    format?: string;
    dataSource?: string;
}
export interface ContractTemplate {
    id: string;
    name: string;
    code: string;
    category: TemplateCategory;
    description?: string;
    content: string;
    variables: TemplateVariable[];
    clauseIds: string[];
    requiredFields: string[];
    version: number;
    parentId?: string;
    changelog?: string;
    status: 'draft' | 'active' | 'archived';
    usageCount: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
export type ClauseCategory = 'payment' | 'delivery' | 'warranty' | 'liability' | 'termination' | 'dispute' | 'confidential' | 'other';
export interface Clause {
    id: string;
    code: string;
    name: string;
    category: ClauseCategory;
    content: string;
    variables: string[];
    tags: string[];
    version: number;
    parentId?: string;
    usageCount: number;
    lastUsedAt?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
export type OrderStatus = 'draft' | 'pending' | 'approved' | 'signed' | 'executing' | 'completed' | 'cancelled' | 'closed';
export type OrderStage = 'quotation' | 'negotiation' | 'signing' | 'execution' | 'acceptance' | 'maintenance';
export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discount: number;
    amount: number;
    notes?: string;
}
export interface PaymentRecord {
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    transactionNo?: string;
    notes?: string;
    createdAt: string;
}
export interface InvoiceRecord {
    id: string;
    invoiceNo: string;
    amount: number;
    invoiceDate: string;
    type: string;
    status: 'pending' | 'issued' | 'received';
    notes?: string;
    createdAt: string;
}
export interface DeliveryRecord {
    id: string;
    deliveryDate: string;
    deliveryNo?: string;
    items: string[];
    status: 'pending' | 'shipped' | 'delivered';
    notes?: string;
    createdAt: string;
}
export interface Order {
    id: string;
    orderNo: string;
    customerId: string;
    leadId?: string;
    contractId?: string;
    title: string;
    description?: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    discountRate?: number;
    tax?: number;
    totalAmount: number;
    status: OrderStatus;
    stage: OrderStage;
    orderDate: string;
    startDate?: string;
    endDate?: string;
    deliveryDate?: string;
    completedAt?: string;
    paymentTerms: string;
    paymentMethod?: string;
    paymentRecords: PaymentRecord[];
    invoiceRecords: InvoiceRecord[];
    requireApproval: boolean;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    approver?: string;
    approvedAt?: string;
    approvalNotes?: string;
    deliveryStatus?: 'pending' | 'partial' | 'completed';
    deliveryRecords?: DeliveryRecord[];
    notes?: string;
    internalNotes?: string;
    attachments?: FileAttachment[];
    ownerId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
export type ContractType = 'sales' | 'service' | 'procurement' | 'partnership' | 'nda' | 'supplement' | 'termination';
export type SignStatus = 'not_started' | 'pending' | 'partial' | 'signed' | 'rejected' | 'expired';
export interface SignRecord {
    id: string;
    signerId: string;
    signerName: string;
    signerRole: 'party_a' | 'party_b' | 'witness';
    signMethod: 'online' | 'offline';
    signedAt?: string;
    signImage?: string;
    ipAddress?: string;
    deviceInfo?: string;
    notes?: string;
}
export interface ValidationIssue {
    id: string;
    category: 'completeness' | 'format' | 'spelling' | 'logic' | 'amount' | 'date' | 'clause_conflict' | 'business_rule' | 'compliance';
    level: 'high' | 'medium' | 'low';
    code: string;
    message: string;
    location?: string;
    suggestion?: string;
    autoFix?: boolean;
    fixed?: boolean;
}
export interface ValidationResult {
    passed: boolean;
    score: number;
    level: 'safe' | 'warning' | 'danger';
    issues: ValidationIssue[];
    checkedAt: string;
    checkedBy: string;
}
export interface Contract {
    id: string;
    contractNo: string;
    orderId: string;
    templateId: string;
    customerId: string;
    title: string;
    type: ContractType;
    content: string;
    contentData: any;
    signType: 'online' | 'offline';
    signStatus: SignStatus;
    signRecords: SignRecord[];
    startDate: string;
    endDate: string;
    duration: number;
    amount: number;
    validationResult?: ValidationResult;
    validatedAt?: string;
    originalFile?: FileAttachment;
    signedFile?: FileAttachment;
    attachments: FileAttachment[];
    status: 'draft' | 'validating' | 'pending_sign' | 'signed' | 'executing' | 'expired' | 'terminated';
    notes?: string;
    ownerId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    signedAt?: string;
    terminatedAt?: string;
}
export interface ProductRecommendation {
    id: string;
    sourceProductId: string;
    targetProductId: string;
    coOccurrence: number;
    confidence: number;
    support: number;
    lift: number;
    totalOrders: number;
    sourceOrders: number;
    targetOrders: number;
    bothOrders: number;
    calculatedAt: string;
    reason?: string;
}
