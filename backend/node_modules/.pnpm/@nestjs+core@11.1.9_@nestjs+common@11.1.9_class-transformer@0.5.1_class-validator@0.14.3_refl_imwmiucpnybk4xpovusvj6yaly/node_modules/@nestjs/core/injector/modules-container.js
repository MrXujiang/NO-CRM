"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesContainer = void 0;
const rxjs_1 = require("rxjs");
const uid_1 = require("uid");
class ModulesContainer extends Map {
    constructor() {
        super(...arguments);
        this._applicationId = (0, uid_1.uid)(21);
        this._rpcTargetRegistry$ = new rxjs_1.ReplaySubject();
    }
    /**
     * Unique identifier of the application instance.
     */
    get applicationId() {
        return this._applicationId;
    }
    /**
     * Retrieves a module by its identifier.
     * @param id The identifier of the module to retrieve.
     * @returns The module instance if found, otherwise undefined.
     */
    getById(id) {
        return Array.from(this.values()).find(moduleRef => moduleRef.id === id);
    }
    /**
     * Returns the RPC target registry as an observable.
     * This registry contains all RPC targets registered in the application.
     * @returns An observable that emits the RPC target registry.
     */
    getRpcTargetRegistry() {
        return this._rpcTargetRegistry$.asObservable();
    }
    /**
     * Adds an RPC target to the registry.
     * @param target The RPC target to add.
     */
    addRpcTarget(target) {
        this._rpcTargetRegistry$.next(target);
    }
}
exports.ModulesContainer = ModulesContainer;
