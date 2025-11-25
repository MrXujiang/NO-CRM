"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartAction = void 0;
const ansis_1 = require("ansis");
const child_process_1 = require("child_process");
const fs = require("fs");
const path_1 = require("path");
const killProcess = require("tree-kill");
const get_tsc_config_path_1 = require("../lib/compiler/helpers/get-tsc-config.path");
const get_value_or_default_1 = require("../lib/compiler/helpers/get-value-or-default");
const defaults_1 = require("../lib/configuration/defaults");
const ui_1 = require("../lib/ui");
const tree_kill_1 = require("../lib/utils/tree-kill");
const build_action_1 = require("./build.action");
const type_assertions_1 = require("../lib/utils/type-assertions");
class StartAction extends build_action_1.BuildAction {
    async handle(commandInputs, commandOptions) {
        try {
            const configFileName = commandOptions.find((option) => option.name === 'config').value;
            const configuration = await this.loader.load(configFileName);
            const appName = commandInputs.find((input) => input.name === 'app')
                .value;
            const pathToTsconfig = (0, get_tsc_config_path_1.getTscConfigPath)(configuration, commandOptions, appName);
            const debugModeOption = commandOptions.find((option) => option.name === 'debug');
            const watchModeOption = commandOptions.find((option) => option.name === 'watch');
            const isWatchEnabled = !!(watchModeOption && watchModeOption.value);
            const watchAssetsModeOption = commandOptions.find((option) => option.name === 'watchAssets');
            const isWatchAssetsEnabled = !!(watchAssetsModeOption && watchAssetsModeOption.value);
            const debugFlag = debugModeOption && debugModeOption.value;
            (0, type_assertions_1.assertNonArray)(debugFlag);
            const binaryToRun = (0, get_value_or_default_1.getValueOrDefault)(configuration, 'exec', appName, 'exec', commandOptions, defaults_1.defaultConfiguration.exec);
            const { options: tsOptions } = this.tsConfigProvider.getByConfigFilename(pathToTsconfig);
            const outDir = tsOptions.outDir || defaults_1.defaultOutDir;
            const entryFile = (0, get_value_or_default_1.getValueOrDefault)(configuration, 'entryFile', appName, 'entryFile', commandOptions, defaults_1.defaultConfiguration.entryFile);
            const sourceRoot = (0, get_value_or_default_1.getValueOrDefault)(configuration, 'sourceRoot', appName, 'sourceRoot', commandOptions, defaults_1.defaultConfiguration.sourceRoot);
            const shellOption = commandOptions.find((option) => option.name === 'shell');
            const useShell = !!shellOption?.value;
            const envFileOption = commandOptions.find((option) => option.name === 'envFile');
            const envFile = (envFileOption?.value ?? []);
            const onSuccess = this.createOnSuccessHook(entryFile, sourceRoot, debugFlag, outDir, binaryToRun, {
                shell: useShell,
                envFile,
            });
            await this.runBuild(commandInputs, commandOptions, isWatchEnabled, isWatchAssetsEnabled, !!debugFlag, onSuccess);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(`\n${ui_1.ERROR_PREFIX} ${err.message}\n`);
            }
            else {
                console.error(`\n${(0, ansis_1.red)(err)}\n`);
            }
        }
    }
    createOnSuccessHook(entryFile, sourceRoot, debugFlag, outDirName, binaryToRun, options) {
        let childProcessRef;
        process.on('exit', () => childProcessRef && (0, tree_kill_1.treeKillSync)(childProcessRef.pid));
        return () => {
            if (childProcessRef) {
                childProcessRef.removeAllListeners('exit');
                childProcessRef.on('exit', () => {
                    childProcessRef = this.spawnChildProcess(entryFile, sourceRoot, debugFlag, outDirName, binaryToRun, {
                        shell: options.shell,
                        envFile: options.envFile,
                    });
                    childProcessRef.on('exit', () => (childProcessRef = undefined));
                });
                childProcessRef.stdin && childProcessRef.stdin.pause();
                killProcess(childProcessRef.pid);
            }
            else {
                childProcessRef = this.spawnChildProcess(entryFile, sourceRoot, debugFlag, outDirName, binaryToRun, {
                    shell: options.shell,
                    envFile: options.envFile,
                });
                childProcessRef.on('exit', (code) => {
                    process.exitCode = code;
                    childProcessRef = undefined;
                });
            }
        };
    }
    spawnChildProcess(entryFile, sourceRoot, debug, outDirName, binaryToRun, options) {
        let outputFilePath = (0, path_1.join)(outDirName, sourceRoot, entryFile);
        if (!fs.existsSync(outputFilePath + '.js')) {
            outputFilePath = (0, path_1.join)(outDirName, entryFile);
        }
        let childProcessArgs = [];
        const argsStartIndex = process.argv.indexOf('--');
        if (argsStartIndex >= 0) {
            // Prevents the need for users to double escape strings
            // i.e. I can run the more natural
            //   nest start -- '{"foo": "bar"}'
            // instead of
            //   nest start -- '\'{"foo": "bar"}\''
            childProcessArgs = process.argv
                .slice(argsStartIndex + 1)
                .map((arg) => JSON.stringify(arg));
        }
        outputFilePath =
            outputFilePath.indexOf(' ') >= 0 ? `"${outputFilePath}"` : outputFilePath;
        const processArgs = [outputFilePath, ...childProcessArgs];
        if (debug) {
            const inspectFlag = typeof debug === 'string' ? `--inspect=${debug}` : '--inspect';
            processArgs.unshift(inspectFlag);
        }
        if (options.envFile && options.envFile.length > 0) {
            const envFileNodeArgs = options.envFile.map((envFilePath) => `--env-file=${envFilePath}`);
            processArgs.unshift(envFileNodeArgs.join(' '));
        }
        processArgs.unshift('--enable-source-maps');
        return (0, child_process_1.spawn)(binaryToRun, processArgs, {
            stdio: 'inherit',
            shell: options.shell,
        });
    }
}
exports.StartAction = StartAction;
