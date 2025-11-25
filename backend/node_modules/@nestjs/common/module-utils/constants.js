"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASYNC_OPTIONS_METADATA_KEYS = exports.CONFIGURABLE_MODULE_ID = exports.ASYNC_METHOD_SUFFIX = exports.DEFAULT_FACTORY_CLASS_METHOD_KEY = exports.DEFAULT_METHOD_KEY = void 0;
exports.DEFAULT_METHOD_KEY = 'register';
exports.DEFAULT_FACTORY_CLASS_METHOD_KEY = 'create';
exports.ASYNC_METHOD_SUFFIX = 'Async';
exports.CONFIGURABLE_MODULE_ID = 'CONFIGURABLE_MODULE_ID';
/**
 * List of keys that are specific to ConfigurableModuleAsyncOptions
 * and should be excluded when extracting user-defined extras.
 */
exports.ASYNC_OPTIONS_METADATA_KEYS = [
    'useFactory',
    'useClass',
    'useExisting',
    'inject',
    'imports',
    'provideInjectionTokensFrom',
];
