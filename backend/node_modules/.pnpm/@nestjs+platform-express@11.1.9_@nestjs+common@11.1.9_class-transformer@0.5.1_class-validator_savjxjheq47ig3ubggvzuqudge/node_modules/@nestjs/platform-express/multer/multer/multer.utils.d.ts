import { HttpException } from '@nestjs/common';
export declare function transformException(error: (Error & {
    field?: string;
}) | undefined): HttpException | (Error & {
    field?: string;
}) | undefined;
