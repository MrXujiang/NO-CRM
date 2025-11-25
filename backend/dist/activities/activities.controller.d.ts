import { ActivitiesService } from './activities.service';
import { CreateActivityDto, UpdateActivityDto } from './dto/activity.dto';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    create(createActivityDto: CreateActivityDto, req: any): import("../common/interfaces").Activity;
    findAll(req: any, customerId?: string, leadId?: string, page?: string, pageSize?: string): import("../common/interfaces").Activity[] | {
        data: import("../common/interfaces").Activity[];
        total: number;
        page: number;
        pageSize: number;
    };
    getReminders(req: any): import("../common/interfaces").Activity[];
    findOne(id: string): import("../common/interfaces").Activity;
    update(id: string, updateActivityDto: UpdateActivityDto): import("../common/interfaces").Activity;
    remove(id: string): {
        message: string;
    };
    generateMock(count: number, req: any): {
        message: string;
    };
    clearMock(req: any): {
        message: string;
    };
}
