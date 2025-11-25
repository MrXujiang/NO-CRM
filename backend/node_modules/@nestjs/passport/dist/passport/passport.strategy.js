"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportStrategy = PassportStrategy;
const passport = require("passport");
class PassportStrategyMixin {
}
function PassportStrategy(Strategy, name, callbackArity) {
    class StrategyWithMixin extends Strategy {
        constructor(...args) {
            const callback = async (...params) => {
                const done = params[params.length - 1];
                try {
                    const validateResult = await this.validate(...params);
                    if (Array.isArray(validateResult)) {
                        done(null, ...validateResult);
                    }
                    else {
                        done(null, validateResult);
                    }
                }
                catch (err) {
                    done(err, null);
                }
            };
            if (callbackArity !== undefined) {
                const validate = new.target?.prototype?.validate;
                const arity = callbackArity === true ? validate.length + 1 : callbackArity;
                if (validate) {
                    Object.defineProperty(callback, 'length', {
                        value: arity
                    });
                }
            }
            super(...args, callback);
            const passportInstance = this.getPassportInstance();
            if (name) {
                passportInstance.use(name, this);
            }
            else {
                passportInstance.use(this);
            }
        }
        getPassportInstance() {
            return passport;
        }
    }
    return StrategyWithMixin;
}
