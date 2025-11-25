"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let DepartmentsService = class DepartmentsService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createDto) {
        const existing = this.findByCode(createDto.code);
        if (existing) {
            throw new Error('部门编码已存在');
        }
        const department = {
            id: (0, uuid_1.v4)(),
            ...createDto,
            sort: createDto.sort ?? 0,
            status: 'active',
            memberCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.storageService.create('departments', department);
        return department;
    }
    findAll(page = 1, pageSize = 10, status) {
        let departments = this.storageService.read('departments');
        if (status) {
            departments = departments.filter(d => d.status === status);
        }
        departments = departments.map(dept => ({
            ...dept,
            memberCount: this.countMembers(dept.id)
        }));
        departments.sort((a, b) => a.sort - b.sort);
        return this.storageService.paginate(departments, page, pageSize);
    }
    findOne(id) {
        const departments = this.storageService.read('departments');
        const department = departments.find(d => d.id === id);
        if (!department) {
            throw new Error('部门不存在');
        }
        return {
            ...department,
            memberCount: this.countMembers(department.id)
        };
    }
    findByCode(code) {
        const departments = this.storageService.read('departments');
        return departments.find(d => d.code === code);
    }
    findTree() {
        const departments = this.storageService.read('departments')
            .map(dept => ({
            ...dept,
            memberCount: this.countMembers(dept.id)
        }))
            .sort((a, b) => a.sort - b.sort);
        const tree = [];
        const map = new Map();
        departments.forEach(dept => {
            map.set(dept.id, { ...dept, children: [] });
        });
        departments.forEach(dept => {
            const node = map.get(dept.id);
            if (dept.parentId && map.has(dept.parentId)) {
                map.get(dept.parentId).children.push(node);
            }
            else {
                tree.push(node);
            }
        });
        return tree;
    }
    update(id, updateDto) {
        const department = this.findOne(id);
        const updated = {
            ...department,
            ...updateDto,
            updatedAt: new Date().toISOString(),
        };
        this.storageService.update('departments', id, updated);
        return updated;
    }
    remove(id) {
        const department = this.findOne(id);
        const children = this.findChildren(id);
        if (children.length > 0) {
            throw new Error(`该部门下还有 ${children.length} 个子部门，无法删除`);
        }
        const memberCount = this.countMembers(id);
        if (memberCount > 0) {
            throw new Error(`该部门下还有 ${memberCount} 个成员，无法删除`);
        }
        this.storageService.delete('departments', id);
    }
    countMembers(departmentId) {
        const users = this.storageService.read('users');
        return users.filter(u => u.departmentId === departmentId).length;
    }
    findChildren(parentId) {
        const departments = this.storageService.read('departments');
        return departments.filter(d => d.parentId === parentId);
    }
    generateMockData() {
        const mockDepartments = [
            { name: '销售部', code: 'SALES', description: '销售团队', sort: 1 },
            { name: '市场部', code: 'MARKETING', description: '市场营销团队', sort: 2 },
            { name: '技术部', code: 'TECH', description: '技术研发团队', sort: 3 },
            { name: '客服部', code: 'SERVICE', description: '客户服务团队', sort: 4 },
            { name: '行政部', code: 'ADMIN', description: '行政管理团队', sort: 5 },
        ];
        const parentDept = this.create({
            name: '总公司',
            code: 'HQ',
            description: '总公司',
            sort: 0,
        });
        mockDepartments.forEach(data => {
            const dept = {
                id: (0, uuid_1.v4)(),
                ...data,
                parentId: parentDept.id,
                status: 'active',
                memberCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.storageService.create('departments', dept);
        });
        return mockDepartments.length + 1;
    }
    clearMockData() {
        const departments = this.storageService.read('departments');
        const count = departments.length;
        this.storageService.write('departments', []);
        return count;
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map