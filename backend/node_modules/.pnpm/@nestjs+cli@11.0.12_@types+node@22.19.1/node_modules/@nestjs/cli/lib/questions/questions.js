"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSelect = exports.generateInput = void 0;
const generateInput = (name, message) => {
    return (defaultAnswer) => ({
        name,
        message,
        default: defaultAnswer,
    });
};
exports.generateInput = generateInput;
const generateSelect = (name) => {
    return (message) => {
        return (choices) => {
            const choicesFormatted = choices.map((choice) => ({
                name: choice,
                value: choice,
            }));
            return {
                name,
                message,
                choices: choicesFormatted,
            };
        };
    };
};
exports.generateSelect = generateSelect;
