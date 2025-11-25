import { FileAttachment } from '../../common/interfaces';
export declare class CreateCustomerDto {
    name: string;
    phone: string;
    company?: string;
    source?: string;
    tags?: string[];
    remarks?: string;
    attachments?: FileAttachment[];
}
export declare class UpdateCustomerDto {
    name?: string;
    phone?: string;
    company?: string;
    source?: string;
    tags?: string[];
    remarks?: string;
    attachments?: FileAttachment[];
}
