export declare const DEFAULT_METHOD_KEY = "register";
export declare const DEFAULT_FACTORY_CLASS_METHOD_KEY = "create";
export declare const ASYNC_METHOD_SUFFIX = "Async";
export declare const CONFIGURABLE_MODULE_ID = "CONFIGURABLE_MODULE_ID";
/**
 * List of keys that are specific to ConfigurableModuleAsyncOptions
 * and should be excluded when extracting user-defined extras.
 */
export declare const ASYNC_OPTIONS_METADATA_KEYS: readonly ["useFactory", "useClass", "useExisting", "inject", "imports", "provideInjectionTokensFrom"];
