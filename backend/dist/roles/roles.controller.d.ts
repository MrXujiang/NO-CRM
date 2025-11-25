import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createDto: CreateRoleDto): import("../common/interfaces").Role;
    findAll(page?: string, pageSize?: string, status?: string): {
        data: import("../common/interfaces").Role[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): import("../common/interfaces").Role;
    update(id: string, updateDto: UpdateRoleDto): import("../common/interfaces").Role;
    remove(id: string): {
        message: string;
    };
}
