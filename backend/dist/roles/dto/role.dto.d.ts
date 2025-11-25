export declare class CreateRoleDto {
    name: string;
    code: string;
    description?: string;
    permissionIds?: string[];
}
export declare class UpdateRoleDto {
    name?: string;
    description?: string;
    permissionIds?: string[];
    status?: 'active' | 'inactive';
}
