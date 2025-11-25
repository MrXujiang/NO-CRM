import { JsonStorageService } from '../common/json-storage.service';
import type { Permission, PermissionResource } from '../common/interfaces';
export declare class PermissionsService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    initSystemPermissions(): number;
    findAll(): Permission[];
    findByResource(resource: PermissionResource): Permission[];
    findByCode(code: string): Permission | undefined;
    findByIds(ids: string[]): Permission[];
    groupByResource(): Record<string, Permission[]>;
}
