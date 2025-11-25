"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PassportModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_options_1 = require("./interfaces/auth-module.options");
let PassportModule = PassportModule_1 = class PassportModule {
    static register(options) {
        return {
            module: PassportModule_1,
            providers: [{ provide: auth_module_options_1.AuthModuleOptions, useValue: options }],
            exports: [auth_module_options_1.AuthModuleOptions]
        };
    }
    static registerAsync(options) {
        return {
            module: PassportModule_1,
            imports: options.imports || [],
            providers: this.createAsyncProviders(options),
            exports: [auth_module_options_1.AuthModuleOptions]
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass
            }
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: auth_module_options_1.AuthModuleOptions,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            provide: auth_module_options_1.AuthModuleOptions,
            useFactory: async (optionsFactory) => await optionsFactory.createAuthOptions(),
            inject: [options.useExisting || options.useClass]
        };
    }
};
exports.PassportModule = PassportModule;
exports.PassportModule = PassportModule = PassportModule_1 = __decorate([
    (0, common_1.Module)({})
], PassportModule);
