"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterLogLevels = filterLogLevels;
const logger_service_1 = require("../logger.service");
const is_log_level_util_1 = require("./is-log-level.util");
/**
 * @publicApi
 */
function filterLogLevels(parseableString = '') {
    const sanitizedString = parseableString.replaceAll(' ', '').toLowerCase();
    if (sanitizedString[0] === '>') {
        const orEqual = sanitizedString[1] === '=';
        const logLevelIndex = logger_service_1.LOG_LEVELS.indexOf(sanitizedString.substring(orEqual ? 2 : 1));
        if (logLevelIndex === -1) {
            throw new Error(`parse error (unknown log level): ${sanitizedString}`);
        }
        return logger_service_1.LOG_LEVELS.slice(orEqual ? logLevelIndex : logLevelIndex + 1);
    }
    else if (sanitizedString.includes(',')) {
        return sanitizedString.split(',').filter(is_log_level_util_1.isLogLevel);
    }
    return (0, is_log_level_util_1.isLogLevel)(sanitizedString) ? [sanitizedString] : logger_service_1.LOG_LEVELS;
}
