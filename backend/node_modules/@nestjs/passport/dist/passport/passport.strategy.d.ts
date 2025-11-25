import { Type, WithoutCallback } from '../interfaces';
export type AllConstructorParameters<T> = T extends {
    new (...o: infer U): void;
    new (...o: infer U2): void;
    new (...o: infer U3): void;
    new (...o: infer U4): void;
    new (...o: infer U5): void;
    new (...o: infer U6): void;
    new (...o: infer U7): void;
} ? U | U2 | U3 | U4 | U5 | U6 | U7 : T extends {
    new (...o: infer U): void;
    new (...o: infer U2): void;
    new (...o: infer U3): void;
    new (...o: infer U4): void;
    new (...o: infer U5): void;
    new (...o: infer U6): void;
} ? U | U2 | U3 | U4 | U5 | U6 : T extends {
    new (...o: infer U): void;
    new (...o: infer U2): void;
    new (...o: infer U3): void;
    new (...o: infer U4): void;
    new (...o: infer U5): void;
} ? U | U2 | U3 | U4 | U5 : T extends {
    new (...o: infer U): void;
    new (...o: infer U2): void;
    new (...o: infer U3): void;
    new (...o: infer U4): void;
} ? U | U2 | U3 | U4 : T extends {
    new (...o: infer U): void;
    new (...o: infer U2): void;
    new (...o: infer U3): void;
} ? U | U2 | U3 : T extends {
    new (...o: infer U): void;
    new (...o: infer U2): void;
} ? U | U2 : T extends {
    new (...o: infer U): void;
} ? U : never;
declare abstract class PassportStrategyMixin<TValidationResult> {
    abstract validate(...args: any[]): TValidationResult | Promise<TValidationResult>;
}
export declare function PassportStrategy<T extends Type<any> = any, TUser = unknown, TValidationResult = TUser | false | null>(Strategy: T, name?: string, callbackArity?: true | number): {
    new (...args: WithoutCallback<AllConstructorParameters<T>>): InstanceType<T> & PassportStrategyMixin<TValidationResult>;
};
export {};
