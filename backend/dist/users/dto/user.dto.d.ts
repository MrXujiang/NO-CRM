export declare class CreateUserDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
    roleId?: string;
    departmentId?: string;
    avatar?: string;
    isAdmin?: boolean;
}
export declare class UpdateUserDto {
    name?: string;
    phone?: string;
    roleId?: string;
    departmentId?: string;
    avatar?: string;
    status?: 'active' | 'inactive';
    isAdmin?: boolean;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
