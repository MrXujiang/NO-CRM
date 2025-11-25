import { JsonStorageService } from '../common/json-storage.service';
import type { Role } from '../common/interfaces';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
export declare class RolesService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createDto: CreateRoleDto): Role;
    findAll(page?: number, pageSize?: number, status?: string): {
        data: Role[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): Role;
    findByCode(code: string): Role | undefined;
    update(id: string, updateDto: UpdateRoleDto): Role;
    remove(id: string): void;
    private countUsers;
    initSystemRoles(allPermissionIds: string[]): number;
}
