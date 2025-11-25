import type { SignStatus } from '../../common/interfaces';
export declare class CreateContractDto {
    orderId: string;
    templateId: string;
    content?: string;
    notes?: string;
}
export declare class UpdateContractDto {
    content?: string;
    signStatus?: SignStatus;
    notes?: string;
}
export declare class GenerateContractDto {
    orderId: string;
    templateId: string;
}
export declare class SignContractDto {
    signerId: string;
    signerName: string;
    signerType: string;
    signMethod: string;
}
