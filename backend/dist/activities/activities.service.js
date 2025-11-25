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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let ActivitiesService = class ActivitiesService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createActivityDto, userId) {
        const activity = {
            id: (0, uuid_1.v4)(),
            ...createActivityDto,
            ownerId: userId,
            createdAt: new Date().toISOString(),
        };
        return this.storageService.create('activities', activity);
    }
    findAll(userId, userRole) {
        const activities = this.storageService.read('activities');
        if (userRole === 'admin') {
            return activities;
        }
        return activities.filter(activity => activity.ownerId === userId);
    }
    findAllPaginated(userId, userRole, page = 1, pageSize = 10) {
        const activities = this.findAll(userId, userRole);
        return this.storageService.paginate(activities, page, pageSize);
    }
    findByCustomer(customerId, userId, userRole) {
        const activities = this.findAll(userId, userRole);
        return activities
            .filter(activity => activity.customerId === customerId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    findByLead(leadId, userId, userRole) {
        const activities = this.findAll(userId, userRole);
        return activities
            .filter(activity => activity.leadId === leadId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    findOne(id) {
        const activity = this.storageService.findById('activities', id);
        if (!activity) {
            throw new common_1.NotFoundException('跟进记录不存在');
        }
        return activity;
    }
    update(id, updateActivityDto) {
        const updated = this.storageService.update('activities', id, updateActivityDto);
        if (!updated) {
            throw new common_1.NotFoundException('更新失败');
        }
        return updated;
    }
    remove(id) {
        const deleted = this.storageService.delete('activities', id);
        if (!deleted) {
            throw new common_1.NotFoundException('删除失败');
        }
    }
    getUpcomingReminders(userId, userRole) {
        const activities = this.findAll(userId, userRole);
        const now = new Date();
        return activities
            .filter(activity => {
            if (!activity.remindDate)
                return false;
            const remindDate = new Date(activity.remindDate);
            return remindDate > now;
        })
            .sort((a, b) => new Date(a.remindDate).getTime() - new Date(b.remindDate).getTime());
    }
    generateMockData(count, userId) {
        const types = ['call', 'email', 'meeting', 'other'];
        const typeLabels = { call: '电话沟通', email: '邮件联系', meeting: '会议洽谈', other: '其他联系' };
        const noteTemplates = [
            '与客户进行了深入沟通，了解了具体需求',
            '讨论了合作的可能性，客户表现出浓厚兴趣',
            '跟进项目进展，客户反馈良好',
            '解答了客户的一些疑问，建立了信任',
            '预约了下次见面时间，继续深入交流'
        ];
        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const activity = {
                id: (0, uuid_1.v4)(),
                type,
                date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
                notes: `${typeLabels[type]}: ${noteTemplates[Math.floor(Math.random() * noteTemplates.length)]}（Mock数据 ${i + 1}）`,
                remindDate: Math.random() > 0.5
                    ? new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
                    : undefined,
                ownerId: userId,
                createdAt: new Date().toISOString(),
            };
            this.storageService.create('activities', activity);
        }
        return count;
    }
    clearMockData(userId, userRole) {
        const activities = this.storageService.read('activities');
        const beforeCount = activities.length;
        let filteredActivities;
        if (userRole === 'admin') {
            filteredActivities = [];
        }
        else {
            filteredActivities = activities.filter(a => a.ownerId !== userId);
        }
        this.storageService.write('activities', filteredActivities);
        return beforeCount - filteredActivities.length;
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map