import type { PermissionResource, PermissionAction } from '../../common/interfaces';
export declare class CreatePermissionDto {
    name: string;
    code: string;
    resource: PermissionResource;
    action: PermissionAction;
    description?: string;
}
export declare class UpdatePermissionDto {
    name?: string;
    description?: string;
}
