"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport = require("passport");
const auth_module_options_1 = require("./interfaces/auth-module.options");
const options_1 = require("./options");
const memoize_util_1 = require("./utils/memoize.util");
exports.AuthGuard = (0, memoize_util_1.memoize)(createAuthGuard);
const NO_STRATEGY_ERROR = `In order to use "defaultStrategy", please, ensure to import PassportModule in each place where AuthGuard() is being used. Otherwise, passport won't work correctly.`;
const authLogger = new common_1.Logger('AuthGuard');
function createAuthGuard(type) {
    let MixinAuthGuard = class MixinAuthGuard {
        constructor(options) {
            this.options = {};
            this.options = options ?? this.options;
            if (!type && !this.options.defaultStrategy) {
                authLogger.error(NO_STRATEGY_ERROR);
            }
        }
        async canActivate(context) {
            const options = {
                ...options_1.defaultOptions,
                ...this.options,
                ...(await this.getAuthenticateOptions(context))
            };
            const [request, response] = [
                this.getRequest(context),
                this.getResponse(context)
            ];
            const passportFn = createPassportContext(request, response);
            const user = await passportFn(type || this.options.defaultStrategy, options, (err, user, info, status) => this.handleRequest(err, user, info, context, status));
            request[options.property || options_1.defaultOptions.property] = user;
            return true;
        }
        getRequest(context) {
            return context.switchToHttp().getRequest();
        }
        getResponse(context) {
            return context.switchToHttp().getResponse();
        }
        async logIn(request) {
            const user = request[this.options.property || options_1.defaultOptions.property];
            await new Promise((resolve, reject) => request.logIn(user, this.options, (err) => err ? reject(err) : resolve()));
        }
        handleRequest(err, user, info, context, status) {
            if (err || !user) {
                throw err || new common_1.UnauthorizedException();
            }
            return user;
        }
        getAuthenticateOptions(context) {
            return undefined;
        }
    };
    __decorate([
        (0, common_1.Optional)(),
        (0, common_1.Inject)(auth_module_options_1.AuthModuleOptions),
        __metadata("design:type", auth_module_options_1.AuthModuleOptions)
    ], MixinAuthGuard.prototype, "options", void 0);
    MixinAuthGuard = __decorate([
        __param(0, (0, common_1.Optional)()),
        __metadata("design:paramtypes", [auth_module_options_1.AuthModuleOptions])
    ], MixinAuthGuard);
    const guard = (0, common_1.mixin)(MixinAuthGuard);
    return guard;
}
const createPassportContext = (request, response) => (type, options, callback) => new Promise((resolve, reject) => passport.authenticate(type, options, (err, user, info, status) => {
    try {
        request.authInfo = info;
        return resolve(callback(err, user, info, status));
    }
    catch (err) {
        reject(err);
    }
})(request, response, (err) => (err ? reject(err) : resolve())));
