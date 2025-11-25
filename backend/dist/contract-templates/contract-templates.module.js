"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const contract_templates_service_1 = require("./contract-templates.service");
const contract_templates_controller_1 = require("./contract-templates.controller");
const json_storage_service_1 = require("../common/json-storage.service");
let ContractTemplatesModule = class ContractTemplatesModule {
};
exports.ContractTemplatesModule = ContractTemplatesModule;
exports.ContractTemplatesModule = ContractTemplatesModule = __decorate([
    (0, common_1.Module)({
        controllers: [contract_templates_controller_1.ContractTemplatesController],
        providers: [contract_templates_service_1.ContractTemplatesService, json_storage_service_1.JsonStorageService],
        exports: [contract_templates_service_1.ContractTemplatesService],
    })
], ContractTemplatesModule);
//# sourceMappingURL=contract-templates.module.js.map