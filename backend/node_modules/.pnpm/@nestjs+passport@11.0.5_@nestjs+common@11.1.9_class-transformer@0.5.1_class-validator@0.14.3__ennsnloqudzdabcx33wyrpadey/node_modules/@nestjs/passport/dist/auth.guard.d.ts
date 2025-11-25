import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Type } from './interfaces';
import { IAuthModuleOptions } from './interfaces/auth-module.options';
export type IAuthGuard = CanActivate & {
    logIn<TRequest extends {
        logIn: Function;
    } = any>(request: TRequest): Promise<void>;
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser;
    getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions | undefined;
    getRequest(context: ExecutionContext): any;
};
export declare const AuthGuard: (type?: string | string[]) => Type<IAuthGuard>;
