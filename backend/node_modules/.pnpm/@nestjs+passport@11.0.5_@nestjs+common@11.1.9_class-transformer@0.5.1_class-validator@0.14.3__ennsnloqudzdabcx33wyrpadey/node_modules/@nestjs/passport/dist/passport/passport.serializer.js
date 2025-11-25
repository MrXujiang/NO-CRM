"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportSerializer = void 0;
const passport = require("passport");
class PassportSerializer {
    constructor() {
        const passportInstance = this.getPassportInstance();
        passportInstance.serializeUser((user, done) => this.serializeUser(user, done));
        passportInstance.deserializeUser((payload, done) => this.deserializeUser(payload, done));
    }
    getPassportInstance() {
        return passport;
    }
}
exports.PassportSerializer = PassportSerializer;
