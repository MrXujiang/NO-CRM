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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
let StatisticsService = class StatisticsService {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    getOverview(userId, isAdmin) {
        const allCustomers = this.storageService.read('customers');
        const allLeads = this.storageService.read('leads');
        const allActivities = this.storageService.read('activities');
        const allTasks = this.storageService.read('tasks');
        const customers = isAdmin
            ? allCustomers
            : allCustomers.filter(c => c.ownerId === userId);
        const leads = isAdmin
            ? allLeads
            : allLeads.filter(l => l.ownerId === userId);
        const activities = isAdmin
            ? allActivities
            : allActivities.filter(a => a.ownerId === userId);
        const tasks = isAdmin
            ? allTasks
            : allTasks.filter(t => t.ownerId === userId);
        return {
            totalCustomers: customers.length,
            totalLeads: leads.length,
            totalActivities: activities.length,
            totalTasks: tasks.length,
            leadsByStage: this.countByStage(leads) || [],
            tasksByPriority: this.countByPriority(tasks) || [],
            tasksByStatus: this.countByStatus(tasks) || [],
            activitiesByType: this.countByType(activities) || [],
            recentTrend: this.calculateTrend(customers, leads) || []
        };
    }
    countByStage(leads) {
        const counts = {};
        leads.forEach(lead => {
            counts[lead.stage] = (counts[lead.stage] || 0) + 1;
        });
        return Object.entries(counts).map(([stage, count]) => ({ stage, count }));
    }
    countByPriority(tasks) {
        const counts = {};
        tasks.forEach(task => {
            counts[task.priority] = (counts[task.priority] || 0) + 1;
        });
        return Object.entries(counts).map(([priority, count]) => ({ priority, count }));
    }
    countByStatus(tasks) {
        const counts = {};
        tasks.forEach(task => {
            counts[task.status] = (counts[task.status] || 0) + 1;
        });
        return Object.entries(counts).map(([status, count]) => ({ status, count }));
    }
    countByType(activities) {
        const counts = {};
        activities.forEach(activity => {
            counts[activity.type] = (counts[activity.type] || 0) + 1;
        });
        return Object.entries(counts).map(([type, count]) => ({ type, count }));
    }
    calculateTrend(customers, leads) {
        const last7Days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const customersCount = customers.filter(c => c.createdAt && c.createdAt.startsWith(dateStr)).length;
            const leadsCount = leads.filter(l => l.createdAt && l.createdAt.startsWith(dateStr)).length;
            last7Days.push({
                date: `${date.getMonth() + 1}/${date.getDate()}`,
                customers: customersCount,
                leads: leadsCount
            });
        }
        return last7Days;
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map