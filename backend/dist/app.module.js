"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const common_module_1 = require("./common/common.module");
const permissions_module_1 = require("./permissions/permissions.module");
const permissions_service_1 = require("./permissions/permissions.service");
const roles_module_1 = require("./roles/roles.module");
const roles_service_1 = require("./roles/roles.service");
const departments_module_1 = require("./departments/departments.module");
const users_module_1 = require("./users/users.module");
const users_service_1 = require("./users/users.service");
const auth_module_1 = require("./auth/auth.module");
const customers_module_1 = require("./customers/customers.module");
const leads_module_1 = require("./leads/leads.module");
const activities_module_1 = require("./activities/activities.module");
const tasks_module_1 = require("./tasks/tasks.module");
const statistics_module_1 = require("./statistics/statistics.module");
const upload_module_1 = require("./upload/upload.module");
const contract_templates_module_1 = require("./contract-templates/contract-templates.module");
const products_module_1 = require("./products/products.module");
const product_categories_module_1 = require("./product-categories/product-categories.module");
const orders_module_1 = require("./orders/orders.module");
const contracts_module_1 = require("./contracts/contracts.module");
const recommendation_module_1 = require("./recommendation/recommendation.module");
const forms_module_1 = require("./forms/forms.module");
const workflows_module_1 = require("./workflows/workflows.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_module_1.CommonModule,
            permissions_module_1.PermissionsModule,
            roles_module_1.RolesModule,
            departments_module_1.DepartmentsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            customers_module_1.CustomersModule,
            leads_module_1.LeadsModule,
            activities_module_1.ActivitiesModule,
            tasks_module_1.TasksModule,
            statistics_module_1.StatisticsModule,
            upload_module_1.UploadModule,
            contract_templates_module_1.ContractTemplatesModule,
            products_module_1.ProductsModule,
            product_categories_module_1.ProductCategoriesModule,
            orders_module_1.OrdersModule,
            contracts_module_1.ContractsModule,
            recommendation_module_1.RecommendationModule,
            forms_module_1.FormsModule,
            workflows_module_1.WorkflowsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, permissions_service_1.PermissionsService, roles_service_1.RolesService, users_service_1.UsersService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map