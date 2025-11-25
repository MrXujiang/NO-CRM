export type Schema = {
    /**
     * Author for the new schematic.
     */
    author?: string;
    /**
     * The package name for the new schematic.
     */
    name: string;
    /**
     * The package manager used to install dependencies.
     */
    packageManager?: PackageManager;
    [property: string]: any;
};
/**
 * The package manager used to install dependencies.
 */
export declare enum PackageManager {
    Bun = "bun",
    Cnpm = "cnpm",
    Npm = "npm",
    Pnpm = "pnpm",
    Yarn = "yarn"
}
