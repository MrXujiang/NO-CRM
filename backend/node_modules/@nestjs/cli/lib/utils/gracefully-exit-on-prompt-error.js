"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gracefullyExitOnPromptError = gracefullyExitOnPromptError;
function gracefullyExitOnPromptError(err) {
    if (err.name === 'ExitPromptError') {
        process.exit(1);
    }
    else {
        throw err;
    }
}
