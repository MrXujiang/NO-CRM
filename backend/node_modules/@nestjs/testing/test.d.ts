import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { TestingModuleBuilder, TestingModuleOptions } from './testing-module.builder';
export declare class Test {
    private static readonly metadataScanner;
    static createTestingModule(metadata: ModuleMetadata, options?: TestingModuleOptions): TestingModuleBuilder;
}
