"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomCollection = void 0;
const tools_1 = require("@angular-devkit/schematics/tools");
const abstract_collection_1 = require("./abstract.collection");
class CustomCollection extends abstract_collection_1.AbstractCollection {
    getSchematics() {
        const workflow = new tools_1.NodeWorkflow(process.cwd(), {});
        const collection = workflow.engine.createCollection(this.collection);
        const collectionDescriptions = [
            collection.description,
            ...(collection.baseDescriptions ?? []),
        ];
        const usedNames = new Set();
        const schematics = [];
        for (const collectionDesc of collectionDescriptions) {
            const schematicsDescs = Object.entries(collectionDesc.schematics);
            for (const [name, { description, aliases = [] }] of schematicsDescs) {
                if (usedNames.has(name)) {
                    continue;
                }
                usedNames.add(name);
                const alias = aliases.find((a) => !usedNames.has(a)) ?? name;
                for (const alias of aliases) {
                    usedNames.add(alias);
                }
                schematics.push({ name, alias, description });
            }
        }
        return schematics.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    }
}
exports.CustomCollection = CustomCollection;
