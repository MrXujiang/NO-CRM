import { JsonStorageService } from '../common/json-storage.service';
import type { User } from '../common/interfaces';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto/user.dto';
export declare class UsersService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createDto: CreateUserDto): Promise<Omit<User, 'password'>>;
    findAll(page?: number, pageSize?: number, status?: string, departmentId?: string): {
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
    findOne(id: string): Omit<User, 'password'>;
    findByEmail(email: string): User | undefined;
    update(id: string, updateDto: UpdateUserDto): Omit<User, 'password'>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    resetPassword(id: string, newPassword: string): Promise<void>;
    remove(id: string): void;
}
