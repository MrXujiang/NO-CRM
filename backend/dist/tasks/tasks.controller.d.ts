import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, req: any): import("../common/interfaces").Task;
    findAll(req: any, status?: string, page?: string, pageSize?: string): {
        data: import("../common/interfaces").Task[];
        total: number;
        page: number;
        pageSize: number;
    };
    getDueSoon(req: any, days?: string): import("../common/interfaces").Task[];
    findOne(id: string): import("../common/interfaces").Task;
    update(id: string, updateTaskDto: UpdateTaskDto): import("../common/interfaces").Task;
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
