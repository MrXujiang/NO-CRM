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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let TasksService = class TasksService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createTaskDto, userId) {
        const task = {
            id: (0, uuid_1.v4)(),
            ...createTaskDto,
            status: 'todo',
            ownerId: userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return this.storageService.create('tasks', task);
    }
    findAll(userId, userRole) {
        const tasks = this.storageService.read('tasks');
        if (userRole === 'admin') {
            return tasks;
        }
        return tasks.filter(task => task.ownerId === userId);
    }
    findAllPaginated(userId, userRole, page = 1, pageSize = 10) {
        const tasks = this.findAll(userId, userRole);
        return this.storageService.paginate(tasks, page, pageSize);
    }
    findOne(id) {
        const task = this.storageService.findById('tasks', id);
        if (!task) {
            throw new common_1.NotFoundException('任务不存在');
        }
        return task;
    }
    update(id, updateTaskDto) {
        const updated = this.storageService.update('tasks', id, {
            ...updateTaskDto,
            updatedAt: new Date().toISOString(),
        });
        if (!updated) {
            throw new common_1.NotFoundException('更新失败');
        }
        return updated;
    }
    remove(id) {
        const deleted = this.storageService.delete('tasks', id);
        if (!deleted) {
            throw new common_1.NotFoundException('删除失败');
        }
    }
    findByStatus(status, userId, userRole) {
        const tasks = this.findAll(userId, userRole);
        return tasks.filter(task => task.status === status);
    }
    findByStatusPaginated(status, userId, userRole, page = 1, pageSize = 10) {
        const results = this.findByStatus(status, userId, userRole);
        return this.storageService.paginate(results, page, pageSize);
    }
    getDueSoon(userId, userRole, days = 3) {
        const tasks = this.findAll(userId, userRole);
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + days);
        return tasks
            .filter(task => {
            if (task.status === 'completed')
                return false;
            const dueDate = new Date(task.dueDate);
            return dueDate >= now && dueDate <= futureDate;
        })
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    generateMockData(count, userId) {
        const priorities = ['low', 'medium', 'high'];
        const taskTitles = [
            '跟进客户需求',
            '准备报价方案',
            '约见客户洽谈',
            '整理客户资料',
            '签署合作协议',
            '提交项目方案',
            '回访老客户',
            '整理销售报表',
            '参加行业会议',
            '学习产品知识'
        ];
        const descriptions = [
            '需要及时完成，注意沟通方式',
            '准备相关材料，提前联系客户',
            '重要任务，请优先处理',
            '按照标准流程执行',
            '注意时间节点，不要遗漏'
        ];
        for (let i = 0; i < count; i++) {
            const task = {
                id: (0, uuid_1.v4)(),
                title: taskTitles[Math.floor(Math.random() * taskTitles.length)] + ` #${i + 1}`,
                description: descriptions[Math.floor(Math.random() * descriptions.length)] + `（Mock数据）`,
                dueDate: new Date(Date.now() + Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(),
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                status: Math.random() > 0.7 ? 'completed' : 'todo',
                ownerId: userId,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString(),
                updatedAt: new Date().toISOString(),
            };
            this.storageService.create('tasks', task);
        }
        return count;
    }
    clearMockData(userId, userRole) {
        const tasks = this.storageService.read('tasks');
        const beforeCount = tasks.length;
        let filteredTasks;
        if (userRole === 'admin') {
            filteredTasks = [];
        }
        else {
            filteredTasks = tasks.filter(t => t.ownerId !== userId);
        }
        this.storageService.write('tasks', filteredTasks);
        return beforeCount - filteredTasks.length;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map