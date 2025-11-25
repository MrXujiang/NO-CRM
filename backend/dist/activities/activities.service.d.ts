import { JsonStorageService } from '../common/json-storage.service';
import { Activity } from '../common/interfaces';
import { CreateActivityDto, UpdateActivityDto } from './dto/activity.dto';
export declare class ActivitiesService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createActivityDto: CreateActivityDto, userId: string): Activity;
    findAll(userId: string, userRole: string): Activity[];
    findAllPaginated(userId: string, userRole: string, page?: number, pageSize?: number): {
        data: Activity[];
        total: number;
        page: number;
        pageSize: number;
    };
    findByCustomer(customerId: string, userId: string, userRole: string): Activity[];
    findByLead(leadId: string, userId: string, userRole: string): Activity[];
    findOne(id: string): Activity;
    update(id: string, updateActivityDto: UpdateActivityDto): Activity;
    remove(id: string): void;
    getUpcomingReminders(userId: string, userRole: string): Activity[];
    generateMockData(count: number, userId: string): number;
    clearMockData(userId: string, userRole: string): number;
}
