"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INFO_PREFIX = exports.ERROR_PREFIX = void 0;
const ansis_1 = require("ansis");
exports.ERROR_PREFIX = (0, ansis_1.bgRgb)(210, 0, 75).bold.rgb(0, 0, 0)(' Error ');
exports.INFO_PREFIX = (0, ansis_1.bgRgb)(60, 190, 100).bold.rgb(0, 0, 0)(' Info ');
