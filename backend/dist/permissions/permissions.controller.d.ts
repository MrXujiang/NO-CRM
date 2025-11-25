import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(): import("../common/interfaces").Permission[];
    getGrouped(): Record<string, import("../common/interfaces").Permission[]>;
    initPermissions(): {
        message: string;
    };
}
