"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yellow = exports.clc = exports.isColorAllowed = void 0;
const isColorAllowed = () => !process.env.NO_COLOR;
exports.isColorAllowed = isColorAllowed;
const colorIfAllowed = (colorFn) => (text) => (0, exports.isColorAllowed)() ? colorFn(text) : text;
exports.clc = {
    bold: colorIfAllowed((text) => `\x1B[1m${text}\x1B[0m`),
    green: colorIfAllowed((text) => `\x1B[32m${text}\x1B[39m`),
    yellow: colorIfAllowed((text) => `\x1B[33m${text}\x1B[39m`),
    red: colorIfAllowed((text) => `\x1B[31m${text}\x1B[39m`),
    magentaBright: colorIfAllowed((text) => `\x1B[95m${text}\x1B[39m`),
    cyanBright: colorIfAllowed((text) => `\x1B[96m${text}\x1B[39m`),
};
exports.yellow = colorIfAllowed((text) => `\x1B[38;5;3m${text}\x1B[39m`);
