export declare class CreateDepartmentDto {
    name: string;
    code: string;
    parentId?: string;
    managerId?: string;
    description?: string;
    sort?: number;
}
export declare class UpdateDepartmentDto {
    name?: string;
    parentId?: string;
    managerId?: string;
    description?: string;
    sort?: number;
    status?: 'active' | 'inactive';
}
