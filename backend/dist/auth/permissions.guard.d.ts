import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonStorageService } from '../common/json-storage.service';
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    private storageService;
    constructor(reflector: Reflector, storageService: JsonStorageService);
    canActivate(context: ExecutionContext): boolean;
}
