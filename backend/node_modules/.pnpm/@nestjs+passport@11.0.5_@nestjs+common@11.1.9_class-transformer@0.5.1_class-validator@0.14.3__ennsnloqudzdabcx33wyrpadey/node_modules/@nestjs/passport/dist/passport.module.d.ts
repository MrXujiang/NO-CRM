import { DynamicModule } from '@nestjs/common';
import { AuthModuleAsyncOptions, IAuthModuleOptions } from './interfaces/auth-module.options';
export declare class PassportModule {
    static register(options: IAuthModuleOptions): DynamicModule;
    static registerAsync(options: AuthModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
