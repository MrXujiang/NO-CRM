/**
 * A simple barrier to synchronize flow of multiple async operations.
 */
export declare class Barrier {
    private currentCount;
    private targetCount;
    private promise;
    private resolve;
    constructor(targetCount: number);
    /**
     * Signal that a participant has reached the barrier.
     *
     * The barrier will be resolved once `targetCount` participants have reached it.
     */
    signal(): void;
    /**
     * Wait for the barrier to be resolved.
     *
     * @returns A promise that resolves when the barrier is resolved.
     */
    wait(): Promise<void>;
    /**
     * Signal that a participant has reached the barrier and wait for the barrier to be resolved.
     *
     * The barrier will be resolved once `targetCount` participants have reached it.
     *
     * @returns A promise that resolves when the barrier is resolved.
     */
    signalAndWait(): Promise<void>;
}
