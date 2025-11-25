import { JsonStorageService } from '../common/json-storage.service';
export interface StatisticsOverview {
    totalCustomers: number;
    totalLeads: number;
    totalActivities: number;
    totalTasks: number;
    leadsByStage: {
        stage: string;
        count: number;
    }[];
    tasksByPriority: {
        priority: string;
        count: number;
    }[];
    tasksByStatus: {
        status: string;
        count: number;
    }[];
    activitiesByType: {
        type: string;
        count: number;
    }[];
    recentTrend: {
        date: string;
        customers: number;
        leads: number;
    }[];
}
export declare class StatisticsService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    getOverview(userId: string, isAdmin: boolean): StatisticsOverview;
    private countByStage;
    private countByPriority;
    private countByStatus;
    private countByType;
    private calculateTrend;
}
