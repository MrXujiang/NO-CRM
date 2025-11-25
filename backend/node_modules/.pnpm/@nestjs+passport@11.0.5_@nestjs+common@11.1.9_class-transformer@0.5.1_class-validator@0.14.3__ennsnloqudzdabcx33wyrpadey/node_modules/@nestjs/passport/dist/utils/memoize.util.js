"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = memoize;
const defaultKey = 'default';
function memoize(fn) {
    const cache = {};
    return (...args) => {
        const n = args[0] || defaultKey;
        if (n in cache) {
            return cache[n];
        }
        else {
            const result = fn(n === defaultKey ? undefined : n);
            cache[n] = result;
            return result;
        }
    };
}
