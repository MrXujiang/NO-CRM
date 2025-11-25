import { AppService } from './app.service';
import { PermissionsService } from './permissions/permissions.service';
import { RolesService } from './roles/roles.service';
import { UsersService } from './users/users.service';
import { JsonStorageService } from './common/json-storage.service';
export declare class AppController {
    private readonly appService;
    private readonly permissionsService;
    private readonly rolesService;
    private readonly usersService;
    private readonly storageService;
    constructor(appService: AppService, permissionsService: PermissionsService, rolesService: RolesService, usersService: UsersService, storageService: JsonStorageService);
    getHello(): string;
    initSystem(): Promise<{
        message: string;
        permissions: number;
        roles: number;
        adminAccount: {
            email: string;
            password: string;
            note: string;
        };
    }>;
}
