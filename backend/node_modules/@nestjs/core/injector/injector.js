"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("@nestjs/common/constants");
const cli_colors_util_1 = require("@nestjs/common/utils/cli-colors.util");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const iterare_1 = require("iterare");
const perf_hooks_1 = require("perf_hooks");
const exceptions_1 = require("../errors/exceptions");
const runtime_exception_1 = require("../errors/exceptions/runtime.exception");
const undefined_dependency_exception_1 = require("../errors/exceptions/undefined-dependency.exception");
const unknown_dependencies_exception_1 = require("../errors/exceptions/unknown-dependencies.exception");
const barrier_1 = require("../helpers/barrier");
const constants_2 = require("./constants");
const inquirer_1 = require("./inquirer");
const instance_wrapper_1 = require("./instance-wrapper");
const settlement_signal_1 = require("./settlement-signal");
class Injector {
    constructor(options) {
        this.options = options;
        this.logger = new common_1.Logger('InjectorLogger');
        this.instanceDecorator = (target) => target;
        if (options?.instanceDecorator) {
            this.instanceDecorator = options.instanceDecorator;
        }
    }
    loadPrototype({ token }, collection, contextId = constants_2.STATIC_CONTEXT) {
        if (!collection) {
            return;
        }
        const target = collection.get(token);
        const instance = target.createPrototype(contextId);
        if (instance) {
            const wrapper = new instance_wrapper_1.InstanceWrapper({
                ...target,
                instance,
            });
            collection.set(token, wrapper);
        }
    }
    async loadInstance(wrapper, collection, moduleRef, contextId = constants_2.STATIC_CONTEXT, inquirer) {
        const inquirerId = this.getInquirerId(inquirer);
        const instanceHost = wrapper.getInstanceByContextId(this.getContextId(contextId, wrapper), inquirerId);
        if (instanceHost.isPending) {
            const settlementSignal = wrapper.settlementSignal;
            if (inquirer && settlementSignal?.isCycle(inquirer.id)) {
                throw new exceptions_1.CircularDependencyException(`"${wrapper.name}"`);
            }
            return instanceHost.donePromise.then((err) => {
                if (err) {
                    throw err;
                }
            });
        }
        const settlementSignal = this.applySettlementSignal(instanceHost, wrapper);
        const token = wrapper.token || wrapper.name;
        const { inject } = wrapper;
        const targetWrapper = collection.get(token);
        if ((0, shared_utils_1.isUndefined)(targetWrapper)) {
            throw new runtime_exception_1.RuntimeException();
        }
        if (instanceHost.isResolved) {
            return settlementSignal.complete();
        }
        try {
            const t0 = this.getNowTimestamp();
            const callback = async (instances) => {
                const properties = await this.resolveProperties(wrapper, moduleRef, inject, contextId, wrapper, inquirer);
                const instance = await this.instantiateClass(instances, wrapper, targetWrapper, contextId, inquirer);
                this.applyProperties(instance, properties);
                wrapper.initTime = this.getNowTimestamp() - t0;
                settlementSignal.complete();
            };
            await this.resolveConstructorParams(wrapper, moduleRef, inject, callback, contextId, wrapper, inquirer);
        }
        catch (err) {
            wrapper.removeInstanceByContextId(this.getContextId(contextId, wrapper), inquirerId);
            settlementSignal.error(err);
            throw err;
        }
    }
    async loadMiddleware(wrapper, collection, moduleRef, contextId = constants_2.STATIC_CONTEXT, inquirer) {
        const { metatype, token } = wrapper;
        const targetWrapper = collection.get(token);
        if (!(0, shared_utils_1.isUndefined)(targetWrapper.instance)) {
            return;
        }
        targetWrapper.instance = Object.create(metatype.prototype);
        await this.loadInstance(wrapper, collection, moduleRef, contextId, inquirer || wrapper);
    }
    async loadController(wrapper, moduleRef, contextId = constants_2.STATIC_CONTEXT) {
        const controllers = moduleRef.controllers;
        await this.loadInstance(wrapper, controllers, moduleRef, contextId, wrapper);
        await this.loadEnhancersPerContext(wrapper, contextId, wrapper);
    }
    async loadInjectable(wrapper, moduleRef, contextId = constants_2.STATIC_CONTEXT, inquirer) {
        const injectables = moduleRef.injectables;
        await this.loadInstance(wrapper, injectables, moduleRef, contextId, inquirer);
    }
    async loadProvider(wrapper, moduleRef, contextId = constants_2.STATIC_CONTEXT, inquirer) {
        const providers = moduleRef.providers;
        await this.loadInstance(wrapper, providers, moduleRef, contextId, inquirer);
        await this.loadEnhancersPerContext(wrapper, contextId, wrapper);
    }
    applySettlementSignal(instancePerContext, host) {
        const settlementSignal = new settlement_signal_1.SettlementSignal();
        instancePerContext.donePromise = settlementSignal.asPromise();
        instancePerContext.isPending = true;
        host.settlementSignal = settlementSignal;
        return settlementSignal;
    }
    async resolveConstructorParams(wrapper, moduleRef, inject, callback, contextId = constants_2.STATIC_CONTEXT, inquirer, parentInquirer) {
        const metadata = wrapper.getCtorMetadata();
        if (metadata && contextId !== constants_2.STATIC_CONTEXT) {
            const deps = await this.loadCtorMetadata(metadata, contextId, inquirer, parentInquirer);
            return callback(deps);
        }
        const isFactoryProvider = !(0, shared_utils_1.isNil)(inject);
        const [dependencies, optionalDependenciesIds] = isFactoryProvider
            ? this.getFactoryProviderDependencies(wrapper)
            : this.getClassDependencies(wrapper);
        const paramBarrier = new barrier_1.Barrier(dependencies.length);
        let isResolved = true;
        const resolveParam = async (param, index) => {
            try {
                if (this.isInquirer(param, parentInquirer)) {
                    /*
                     * Signal the barrier to make sure other dependencies do not get stuck waiting forever.
                     */
                    paramBarrier.signal();
                    return parentInquirer && parentInquirer.instance;
                }
                if (inquirer?.isTransient && parentInquirer) {
                    // When `inquirer` is transient too, inherit the parent inquirer
                    // This is required to ensure that transient providers are only resolved
                    // when requested
                    inquirer.attachRootInquirer(parentInquirer);
                }
                const paramWrapper = await this.resolveSingleParam(wrapper, param, { index, dependencies }, moduleRef, contextId, inquirer, index);
                /*
                 * Ensure that all instance wrappers are resolved at this point before we continue.
                 * Otherwise the staticity of `wrapper`'s dependency tree may be evaluated incorrectly
                 * and result in undefined / null injection.
                 */
                await paramBarrier.signalAndWait();
                const effectiveInquirer = this.getEffectiveInquirer(paramWrapper, inquirer, parentInquirer, contextId);
                const paramWrapperWithInstance = await this.resolveComponentHost(moduleRef, paramWrapper, contextId, effectiveInquirer);
                const instanceHost = paramWrapperWithInstance.getInstanceByContextId(this.getContextId(contextId, paramWrapperWithInstance), this.getInquirerId(effectiveInquirer));
                if (!instanceHost.isResolved && !paramWrapperWithInstance.forwardRef) {
                    isResolved = false;
                }
                return instanceHost?.instance;
            }
            catch (err) {
                /*
                 * Signal the barrier to make sure other dependencies do not get stuck waiting forever. We
                 * do not care if this occurs after `Barrier.signalAndWait()` is called in the `try` block
                 * because the barrier will always have been resolved by then.
                 */
                paramBarrier.signal();
                const isOptional = optionalDependenciesIds.includes(index);
                if (!isOptional) {
                    throw err;
                }
                return undefined;
            }
        };
        const instances = await Promise.all(dependencies.map(resolveParam));
        isResolved && (await callback(instances));
    }
    getClassDependencies(wrapper) {
        const ctorRef = wrapper.metatype;
        return [
            this.reflectConstructorParams(ctorRef),
            this.reflectOptionalParams(ctorRef),
        ];
    }
    getFactoryProviderDependencies(wrapper) {
        const optionalDependenciesIds = [];
        /**
         * Same as the internal utility function `isOptionalFactoryDependency` from `@nestjs/common`.
         * We are duplicating it here because that one is not supposed to be exported.
         */
        function isOptionalFactoryDependency(value) {
            return (!(0, shared_utils_1.isUndefined)(value.token) &&
                !(0, shared_utils_1.isUndefined)(value.optional) &&
                !value.prototype);
        }
        const mapFactoryProviderInjectArray = (item, index) => {
            if (typeof item !== 'object') {
                return item;
            }
            if (isOptionalFactoryDependency(item)) {
                if (item.optional) {
                    optionalDependenciesIds.push(index);
                }
                return item?.token;
            }
            return item;
        };
        return [
            wrapper.inject?.map?.(mapFactoryProviderInjectArray),
            optionalDependenciesIds,
        ];
    }
    reflectConstructorParams(type) {
        const paramtypes = [
            ...(Reflect.getMetadata(constants_1.PARAMTYPES_METADATA, type) || []),
        ];
        const selfParams = this.reflectSelfParams(type);
        selfParams.forEach(({ index, param }) => (paramtypes[index] = param));
        return paramtypes;
    }
    reflectOptionalParams(type) {
        return Reflect.getMetadata(constants_1.OPTIONAL_DEPS_METADATA, type) || [];
    }
    reflectSelfParams(type) {
        return Reflect.getMetadata(constants_1.SELF_DECLARED_DEPS_METADATA, type) || [];
    }
    async resolveSingleParam(wrapper, param, dependencyContext, moduleRef, contextId = constants_2.STATIC_CONTEXT, inquirer, keyOrIndex) {
        if ((0, shared_utils_1.isUndefined)(param)) {
            this.logger.log('Nest encountered an undefined dependency. This may be due to a circular import or a missing dependency declaration.');
            throw new undefined_dependency_exception_1.UndefinedDependencyException(wrapper.name, dependencyContext, moduleRef);
        }
        const token = this.resolveParamToken(wrapper, param);
        return this.resolveComponentWrapper(moduleRef, token, dependencyContext, wrapper, contextId, inquirer, keyOrIndex);
    }
    resolveParamToken(wrapper, param) {
        if (typeof param === 'object' && 'forwardRef' in param) {
            wrapper.forwardRef = true;
            return param.forwardRef();
        }
        return param;
    }
    async resolveComponentWrapper(moduleRef, token, dependencyContext, wrapper, contextId = constants_2.STATIC_CONTEXT, inquirer, keyOrIndex) {
        this.printResolvingDependenciesLog(token, inquirer);
        this.printLookingForProviderLog(token, moduleRef);
        const providers = moduleRef.providers;
        return this.lookupComponent(providers, moduleRef, { ...dependencyContext, name: token }, wrapper, contextId, inquirer, keyOrIndex);
    }
    async resolveComponentHost(moduleRef, instanceWrapper, contextId = constants_2.STATIC_CONTEXT, inquirer) {
        const inquirerId = this.getInquirerId(inquirer);
        const instanceHost = instanceWrapper.getInstanceByContextId(this.getContextId(contextId, instanceWrapper), inquirerId);
        if (!instanceHost.isResolved && !instanceWrapper.forwardRef) {
            inquirer?.settlementSignal?.insertRef(instanceWrapper.id);
            await this.loadProvider(instanceWrapper, instanceWrapper.host ?? moduleRef, contextId, inquirer);
        }
        else if (!instanceHost.isResolved &&
            instanceWrapper.forwardRef &&
            (contextId !== constants_2.STATIC_CONTEXT || !!inquirerId)) {
            /**
             * When circular dependency has been detected between
             * either request/transient providers, we have to asynchronously
             * resolve instance host for a specific contextId or inquirer, to ensure
             * that eventual lazily created instance will be merged with the prototype
             * instantiated beforehand.
             */
            instanceHost.donePromise &&
                void instanceHost.donePromise.then(() => this.loadProvider(instanceWrapper, moduleRef, contextId, inquirer));
        }
        if (instanceWrapper.async) {
            const host = instanceWrapper.getInstanceByContextId(this.getContextId(contextId, instanceWrapper), inquirerId);
            host.instance = await host.instance;
            instanceWrapper.setInstanceByContextId(contextId, host, inquirerId);
        }
        return instanceWrapper;
    }
    async lookupComponent(providers, moduleRef, dependencyContext, wrapper, contextId = constants_2.STATIC_CONTEXT, inquirer, keyOrIndex) {
        const token = wrapper.token || wrapper.name;
        const { name } = dependencyContext;
        if (wrapper && token === name) {
            throw new unknown_dependencies_exception_1.UnknownDependenciesException(wrapper.name, dependencyContext, moduleRef, { id: wrapper.id });
        }
        if (name && providers.has(name)) {
            const instanceWrapper = providers.get(name);
            this.printFoundInModuleLog(name, moduleRef);
            this.addDependencyMetadata(keyOrIndex, wrapper, instanceWrapper);
            return instanceWrapper;
        }
        return this.lookupComponentInParentModules(dependencyContext, moduleRef, wrapper, contextId, inquirer, keyOrIndex);
    }
    async lookupComponentInParentModules(dependencyContext, moduleRef, wrapper, contextId = constants_2.STATIC_CONTEXT, inquirer, keyOrIndex) {
        const instanceWrapper = await this.lookupComponentInImports(moduleRef, dependencyContext.name, wrapper, [], contextId, inquirer, keyOrIndex);
        if ((0, shared_utils_1.isNil)(instanceWrapper)) {
            throw new unknown_dependencies_exception_1.UnknownDependenciesException(wrapper.name, dependencyContext, moduleRef, { id: wrapper.id });
        }
        return instanceWrapper;
    }
    async lookupComponentInImports(moduleRef, name, wrapper, moduleRegistry = [], contextId = constants_2.STATIC_CONTEXT, inquirer, keyOrIndex, isTraversing) {
        let instanceWrapperRef = null;
        const imports = moduleRef.imports || new Set();
        const identity = (item) => item;
        let children = [...imports.values()].filter(identity);
        if (isTraversing) {
            const contextModuleExports = moduleRef.exports;
            children = children.filter(child => contextModuleExports.has(child.metatype));
        }
        for (const relatedModule of children) {
            if (moduleRegistry.includes(relatedModule.id)) {
                continue;
            }
            this.printLookingForProviderLog(name, relatedModule);
            moduleRegistry.push(relatedModule.id);
            const { providers, exports } = relatedModule;
            if (!exports.has(name) || !providers.has(name)) {
                const instanceRef = await this.lookupComponentInImports(relatedModule, name, wrapper, moduleRegistry, contextId, inquirer, keyOrIndex, true);
                if (instanceRef) {
                    this.addDependencyMetadata(keyOrIndex, wrapper, instanceRef);
                    return instanceRef;
                }
                continue;
            }
            this.printFoundInModuleLog(name, relatedModule);
            instanceWrapperRef = providers.get(name);
            this.addDependencyMetadata(keyOrIndex, wrapper, instanceWrapperRef);
            const inquirerId = this.getInquirerId(inquirer);
            const instanceHost = instanceWrapperRef.getInstanceByContextId(this.getContextId(contextId, instanceWrapperRef), inquirerId);
            if (!instanceHost.isResolved && !instanceWrapperRef.forwardRef) {
                /*
                 * Provider will be loaded shortly in resolveComponentHost() once we pass the current
                 * Barrier. We cannot load it here because doing so could incorrectly evaluate the
                 * staticity of the dependency tree and lead to undefined / null injection.
                 */
                break;
            }
        }
        return instanceWrapperRef;
    }
    async resolveProperties(wrapper, moduleRef, inject, contextId = constants_2.STATIC_CONTEXT, inquirer, parentInquirer) {
        if (!(0, shared_utils_1.isNil)(inject)) {
            return [];
        }
        const metadata = wrapper.getPropertiesMetadata();
        if (metadata && contextId !== constants_2.STATIC_CONTEXT) {
            return this.loadPropertiesMetadata(metadata, contextId, inquirer);
        }
        const properties = this.reflectProperties(wrapper.metatype);
        const propertyBarrier = new barrier_1.Barrier(properties.length);
        const instances = await Promise.all(properties.map(async (item) => {
            try {
                const dependencyContext = {
                    key: item.key,
                    name: item.name,
                };
                if (this.isInquirer(item.name, parentInquirer)) {
                    /*
                     * Signal the barrier to make sure other dependencies do not get stuck waiting forever.
                     */
                    propertyBarrier.signal();
                    return parentInquirer && parentInquirer.instance;
                }
                const paramWrapper = await this.resolveSingleParam(wrapper, item.name, dependencyContext, moduleRef, contextId, inquirer, item.key);
                /*
                 * Ensure that all instance wrappers are resolved at this point before we continue.
                 * Otherwise the staticity of `wrapper`'s dependency tree may be evaluated incorrectly
                 * and result in undefined / null injection.
                 */
                await propertyBarrier.signalAndWait();
                const effectivePropertyInquirer = this.getEffectiveInquirer(paramWrapper, inquirer, parentInquirer, contextId);
                const paramWrapperWithInstance = await this.resolveComponentHost(moduleRef, paramWrapper, contextId, effectivePropertyInquirer);
                if (!paramWrapperWithInstance) {
                    return undefined;
                }
                const instanceHost = paramWrapperWithInstance.getInstanceByContextId(this.getContextId(contextId, paramWrapperWithInstance), this.getInquirerId(effectivePropertyInquirer));
                return instanceHost.instance;
            }
            catch (err) {
                /*
                 * Signal the barrier to make sure other dependencies do not get stuck waiting forever. We
                 * do not care if this occurs after `Barrier.signalAndWait()` is called in the `try` block
                 * because the barrier will always have been resolved by then.
                 */
                propertyBarrier.signal();
                if (!item.isOptional) {
                    throw err;
                }
                return undefined;
            }
        }));
        return properties.map((item, index) => ({
            ...item,
            instance: instances[index],
        }));
    }
    reflectProperties(type) {
        const properties = Reflect.getMetadata(constants_1.PROPERTY_DEPS_METADATA, type) || [];
        const optionalKeys = Reflect.getMetadata(constants_1.OPTIONAL_PROPERTY_DEPS_METADATA, type) || [];
        return properties.map((item) => ({
            ...item,
            name: item.type,
            isOptional: optionalKeys.includes(item.key),
        }));
    }
    applyProperties(instance, properties) {
        if (!(0, shared_utils_1.isObject)(instance)) {
            return undefined;
        }
        (0, iterare_1.iterate)(properties)
            .filter(item => !(0, shared_utils_1.isNil)(item.instance))
            .forEach(item => (instance[item.key] = item.instance));
    }
    async instantiateClass(instances, wrapper, targetMetatype, contextId = constants_2.STATIC_CONTEXT, inquirer) {
        const { metatype, inject } = wrapper;
        const inquirerId = this.getInquirerId(inquirer);
        const instanceHost = targetMetatype.getInstanceByContextId(this.getContextId(contextId, targetMetatype), inquirerId);
        const isInContext = wrapper.isStatic(contextId, inquirer) ||
            wrapper.isInRequestScope(contextId, inquirer) ||
            wrapper.isLazyTransient(contextId, inquirer) ||
            wrapper.isExplicitlyRequested(contextId, inquirer);
        if (this.options?.preview && !wrapper.host?.initOnPreview) {
            instanceHost.isResolved = true;
            return instanceHost.instance;
        }
        if ((0, shared_utils_1.isNil)(inject) && isInContext) {
            instanceHost.instance = wrapper.forwardRef
                ? Object.assign(instanceHost.instance, new metatype(...instances))
                : new metatype(...instances);
            instanceHost.instance = this.instanceDecorator(instanceHost.instance);
            instanceHost.isConstructorCalled = true;
        }
        else if (isInContext) {
            const factoryReturnValue = targetMetatype.metatype(...instances);
            instanceHost.instance = await factoryReturnValue;
            instanceHost.instance = this.instanceDecorator(instanceHost.instance);
            instanceHost.isConstructorCalled = true;
        }
        instanceHost.isResolved = true;
        return instanceHost.instance;
    }
    async loadPerContext(instance, moduleRef, collection, ctx, wrapper) {
        if (!wrapper) {
            const injectionToken = instance.constructor;
            wrapper = collection.get(injectionToken);
        }
        await this.loadInstance(wrapper, collection, moduleRef, ctx, wrapper);
        await this.loadEnhancersPerContext(wrapper, ctx, wrapper);
        const host = wrapper.getInstanceByContextId(this.getContextId(ctx, wrapper), wrapper.id);
        return host && host.instance;
    }
    async loadEnhancersPerContext(wrapper, ctx, inquirer) {
        const enhancers = wrapper.getEnhancersMetadata() || [];
        const loadEnhancer = (item) => {
            const hostModule = item.host;
            return this.loadInstance(item, hostModule.injectables, hostModule, ctx, inquirer);
        };
        await Promise.all(enhancers.map(loadEnhancer));
    }
    async loadCtorMetadata(metadata, contextId, inquirer, parentInquirer) {
        const hosts = await Promise.all(metadata.map(async (item) => this.resolveScopedComponentHost(item, contextId, inquirer, parentInquirer)));
        return hosts.map((item, index) => {
            const dependency = metadata[index];
            const effectiveInquirer = this.getEffectiveInquirer(dependency, inquirer, parentInquirer, contextId);
            return item?.getInstanceByContextId(this.getContextId(contextId, item), this.getInquirerId(effectiveInquirer)).instance;
        });
    }
    async loadPropertiesMetadata(metadata, contextId, inquirer) {
        const dependenciesHosts = await Promise.all(metadata.map(async ({ wrapper: item, key }) => ({
            key,
            host: await this.resolveComponentHost(item.host, item, contextId, inquirer),
        })));
        const inquirerId = this.getInquirerId(inquirer);
        return dependenciesHosts.map(({ key, host }) => ({
            key,
            name: key,
            instance: host.getInstanceByContextId(this.getContextId(contextId, host), inquirerId).instance,
        }));
    }
    getInquirerId(inquirer) {
        return inquirer ? inquirer.id : undefined;
    }
    /**
     * For nested TRANSIENT dependencies (TRANSIENT -> TRANSIENT) in non-static contexts,
     * returns parentInquirer to ensure each parent TRANSIENT gets its own instance.
     * This is necessary because in REQUEST/DURABLE scopes, the same TRANSIENT wrapper
     * can be used by multiple parents, causing nested TRANSIENTs to be shared incorrectly.
     * For non-TRANSIENT -> TRANSIENT, returns inquirer (current wrapper being created).
     */
    getEffectiveInquirer(dependency, inquirer, parentInquirer, contextId) {
        return dependency?.isTransient &&
            inquirer?.isTransient &&
            parentInquirer &&
            contextId !== constants_2.STATIC_CONTEXT
            ? parentInquirer
            : inquirer;
    }
    resolveScopedComponentHost(item, contextId, inquirer, parentInquirer) {
        return this.isInquirerRequest(item, parentInquirer)
            ? parentInquirer
            : this.resolveComponentHost(item.host, item, contextId, this.getEffectiveInquirer(item, inquirer, parentInquirer, contextId));
    }
    isInquirerRequest(item, parentInquirer) {
        return item.isTransient && item.name === inquirer_1.INQUIRER && parentInquirer;
    }
    isInquirer(param, parentInquirer) {
        return param === inquirer_1.INQUIRER && parentInquirer;
    }
    addDependencyMetadata(keyOrIndex, hostWrapper, instanceWrapper) {
        if ((0, shared_utils_1.isSymbol)(keyOrIndex) || (0, shared_utils_1.isString)(keyOrIndex)) {
            hostWrapper.addPropertiesMetadata(keyOrIndex, instanceWrapper);
        }
        else {
            hostWrapper.addCtorMetadata(keyOrIndex, instanceWrapper);
        }
    }
    getTokenName(token) {
        return (0, shared_utils_1.isFunction)(token) ? token.name : token.toString();
    }
    printResolvingDependenciesLog(token, inquirer) {
        if (!this.isDebugMode()) {
            return;
        }
        const tokenName = this.getTokenName(token);
        const dependentName = (inquirer?.name && inquirer.name.toString?.()) ?? 'unknown';
        const isAlias = dependentName === tokenName;
        const messageToPrint = `Resolving dependency ${cli_colors_util_1.clc.cyanBright(tokenName)}${cli_colors_util_1.clc.green(' in the ')}${cli_colors_util_1.clc.yellow(dependentName)}${cli_colors_util_1.clc.green(` provider ${isAlias ? '(alias)' : ''}`)}`;
        this.logger.log(messageToPrint);
    }
    printLookingForProviderLog(token, moduleRef) {
        if (!this.isDebugMode()) {
            return;
        }
        const tokenName = this.getTokenName(token);
        const moduleRefName = moduleRef?.metatype?.name ?? 'unknown';
        this.logger.log(`Looking for ${cli_colors_util_1.clc.cyanBright(tokenName)}${cli_colors_util_1.clc.green(' in ')}${cli_colors_util_1.clc.magentaBright(moduleRefName)}`);
    }
    printFoundInModuleLog(token, moduleRef) {
        if (!this.isDebugMode()) {
            return;
        }
        const tokenName = this.getTokenName(token);
        const moduleRefName = moduleRef?.metatype?.name ?? 'unknown';
        this.logger.log(`Found ${cli_colors_util_1.clc.cyanBright(tokenName)}${cli_colors_util_1.clc.green(' in ')}${cli_colors_util_1.clc.magentaBright(moduleRefName)}`);
    }
    isDebugMode() {
        return !!process.env.NEST_DEBUG;
    }
    getContextId(contextId, instanceWrapper) {
        return contextId.getParent
            ? contextId.getParent({
                token: instanceWrapper.token,
                isTreeDurable: instanceWrapper.isDependencyTreeDurable(),
            })
            : contextId;
    }
    getNowTimestamp() {
        return perf_hooks_1.performance.now();
    }
}
exports.Injector = Injector;
