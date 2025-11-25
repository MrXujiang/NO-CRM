import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createDto: CreateUserDto): Promise<Omit<import("../common/interfaces").User, "password">>;
    findAll(page?: string, pageSize?: string, status?: string, departmentId?: string): {
        data: {
            id: string;
            email: string;
            name: string;
            role: "admin" | "sales";
            roleId?: string;
            departmentId?: string;
            phone?: string;
            avatar?: string;
            status: "active" | "inactive";
            isAdmin: boolean;
            createdAt: string;
            updatedAt: string;
        }[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): Omit<import("../common/interfaces").User, "password">;
    update(id: string, updateDto: UpdateUserDto): Omit<import("../common/interfaces").User, "password">;
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    resetPassword(id: string, newPassword: string): Promise<void>;
    remove(id: string): {
        message: string;
    };
}
