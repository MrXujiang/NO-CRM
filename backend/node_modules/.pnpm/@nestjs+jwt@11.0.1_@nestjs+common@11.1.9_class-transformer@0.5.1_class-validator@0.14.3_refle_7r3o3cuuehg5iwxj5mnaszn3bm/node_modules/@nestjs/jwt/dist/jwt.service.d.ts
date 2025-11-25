import * as jwt from 'jsonwebtoken';
import { JwtModuleOptions, JwtSignOptions, JwtVerifyOptions } from './interfaces';
export declare class JwtService {
    private readonly options;
    private readonly logger;
    constructor(options?: JwtModuleOptions);
    sign(payload: string, options?: Omit<JwtSignOptions, keyof jwt.SignOptions>): string;
    sign(payload: Buffer, options?: JwtSignOptions): string;
    sign<T extends object = any>(payload: T, options?: JwtSignOptions): string;
    signAsync(payload: string, options?: Omit<JwtSignOptions, keyof jwt.SignOptions>): Promise<string>;
    signAsync(payload: Buffer, options?: JwtSignOptions): Promise<string>;
    signAsync<T extends object = any>(payload: T, options?: JwtSignOptions): Promise<string>;
    verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T;
    verifyAsync<T extends object = any>(token: string, options?: JwtVerifyOptions): Promise<T>;
    decode<T = any>(token: string, options?: jwt.DecodeOptions): T;
    private mergeJwtOptions;
    private overrideSecretFromOptions;
    private getSecretKey;
}
