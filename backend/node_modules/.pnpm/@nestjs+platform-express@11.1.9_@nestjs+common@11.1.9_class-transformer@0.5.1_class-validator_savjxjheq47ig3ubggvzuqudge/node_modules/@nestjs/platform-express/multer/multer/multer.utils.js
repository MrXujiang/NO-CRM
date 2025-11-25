"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformException = transformException;
const common_1 = require("@nestjs/common");
const multer_constants_1 = require("./multer.constants");
// Multer may add in a 'field' property to the error
// https://github.com/expressjs/multer/blob/aa42bea6ac7d0cb8fcb279b15a7278cda805dc63/lib/multer-error.js#L19
function transformException(error) {
    if (!error || error instanceof common_1.HttpException) {
        return error;
    }
    switch (error.message) {
        case multer_constants_1.multerExceptions.LIMIT_FILE_SIZE:
            return new common_1.PayloadTooLargeException(error.message);
        case multer_constants_1.multerExceptions.LIMIT_FILE_COUNT:
        case multer_constants_1.multerExceptions.LIMIT_FIELD_KEY:
        case multer_constants_1.multerExceptions.LIMIT_FIELD_VALUE:
        case multer_constants_1.multerExceptions.LIMIT_FIELD_COUNT:
        case multer_constants_1.multerExceptions.LIMIT_UNEXPECTED_FILE:
        case multer_constants_1.multerExceptions.LIMIT_PART_COUNT:
        case multer_constants_1.multerExceptions.MISSING_FIELD_NAME:
            if (error.field) {
                return new common_1.BadRequestException(`${error.message} - ${error.field}`);
            }
            return new common_1.BadRequestException(error.message);
        case multer_constants_1.busboyExceptions.MULTIPART_BOUNDARY_NOT_FOUND:
            return new common_1.BadRequestException(error.message);
        case multer_constants_1.busboyExceptions.MULTIPART_MALFORMED_PART_HEADER:
        case multer_constants_1.busboyExceptions.MULTIPART_UNEXPECTED_END_OF_FORM:
        case multer_constants_1.busboyExceptions.MULTIPART_UNEXPECTED_END_OF_FILE:
            return new common_1.BadRequestException(`Multipart: ${error.message}`);
    }
    return error;
}
