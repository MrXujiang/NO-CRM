"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNonArray = assertNonArray;
function assertNonArray(value) {
    if (Array.isArray(value)) {
        throw new TypeError('Expected a non-array value');
    }
}
