"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModuleNameMapper = createModuleNameMapper;
function createModuleNameMapper(packageKey, packageRoot) {
    const moduleNameMapper = {};
    const packageKeyRegex = '^' + packageKey + '(|/.*)$';
    moduleNameMapper[packageKeyRegex] = packageRoot + '/$1';
    return moduleNameMapper;
}
