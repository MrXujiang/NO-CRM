"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Barrier = void 0;
/**
 * A simple barrier to synchronize flow of multiple async operations.
 */
class Barrier {
    constructor(targetCount) {
        this.currentCount = 0;
        this.targetCount = targetCount;
        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
    }
    /**
     * Signal that a participant has reached the barrier.
     *
     * The barrier will be resolved once `targetCount` participants have reached it.
     */
    signal() {
        this.currentCount += 1;
        if (this.currentCount === this.targetCount) {
            this.resolve();
        }
    }
    /**
     * Wait for the barrier to be resolved.
     *
     * @returns A promise that resolves when the barrier is resolved.
     */
    async wait() {
        return this.promise;
    }
    /**
     * Signal that a participant has reached the barrier and wait for the barrier to be resolved.
     *
     * The barrier will be resolved once `targetCount` participants have reached it.
     *
     * @returns A promise that resolves when the barrier is resolved.
     */
    async signalAndWait() {
        this.signal();
        return this.wait();
    }
}
exports.Barrier = Barrier;
