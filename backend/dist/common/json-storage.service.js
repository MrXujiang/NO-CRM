"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonStorageService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let JsonStorageService = class JsonStorageService {
    dataPath = path.join(process.cwd(), 'data');
    constructor() {
        if (!fs.existsSync(this.dataPath)) {
            fs.mkdirSync(this.dataPath, { recursive: true });
        }
    }
    getFilePath(fileName) {
        return path.join(this.dataPath, `${fileName}.json`);
    }
    read(fileName) {
        const filePath = this.getFilePath(fileName);
        try {
            if (!fs.existsSync(filePath)) {
                return [];
            }
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error(`Error reading ${fileName}:`, error);
            return [];
        }
    }
    write(fileName, data) {
        const filePath = this.getFilePath(fileName);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        }
        catch (error) {
            console.error(`Error writing ${fileName}:`, error);
            throw error;
        }
    }
    findById(fileName, id) {
        const items = this.read(fileName);
        return items.find((item) => item.id === id) || null;
    }
    create(fileName, item) {
        const items = this.read(fileName);
        items.push(item);
        this.write(fileName, items);
        return item;
    }
    update(fileName, id, updates) {
        const items = this.read(fileName);
        const index = items.findIndex((item) => item.id === id);
        if (index === -1)
            return null;
        items[index] = { ...items[index], ...updates };
        this.write(fileName, items);
        return items[index];
    }
    delete(fileName, id) {
        const items = this.read(fileName);
        const filteredItems = items.filter((item) => item.id !== id);
        if (filteredItems.length === items.length)
            return false;
        this.write(fileName, filteredItems);
        return true;
    }
    paginate(items, page = 1, pageSize = 10) {
        const total = items.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const data = items.slice(startIndex, endIndex);
        return {
            data,
            total,
            page,
            pageSize
        };
    }
};
exports.JsonStorageService = JsonStorageService;
exports.JsonStorageService = JsonStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JsonStorageService);
//# sourceMappingURL=json-storage.service.js.map