import { Observable } from 'rxjs';
import { Module } from './module';
export declare class ModulesContainer extends Map<string, Module> {
    private readonly _applicationId;
    private readonly _rpcTargetRegistry$;
    /**
     * Unique identifier of the application instance.
     */
    get applicationId(): string;
    /**
     * Retrieves a module by its identifier.
     * @param id The identifier of the module to retrieve.
     * @returns The module instance if found, otherwise undefined.
     */
    getById(id: string): Module | undefined;
    /**
     * Returns the RPC target registry as an observable.
     * This registry contains all RPC targets registered in the application.
     * @returns An observable that emits the RPC target registry.
     */
    getRpcTargetRegistry<T>(): Observable<T>;
    /**
     * Adds an RPC target to the registry.
     * @param target The RPC target to add.
     */
    addRpcTarget<T>(target: T): void;
}
