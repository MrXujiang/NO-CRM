"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inPlaceSortByKeys = inPlaceSortByKeys;
function inPlaceSortByKeys(object) {
    const sorted = {};
    const keys = Object.keys(object);
    keys.sort();
    for (const key of keys) {
        sorted[key] = object[key];
        delete object[key];
    }
    return Object.assign(object, sorted);
}
