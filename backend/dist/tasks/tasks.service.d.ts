import { JsonStorageService } from '../common/json-storage.service';
import { Task } from '../common/interfaces';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
export declare class TasksService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createTaskDto: CreateTaskDto, userId: string): Task;
    findAll(userId: string, userRole: string): Task[];
    findAllPaginated(userId: string, userRole: string, page?: number, pageSize?: number): {
        data: Task[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): Task;
    update(id: string, updateTaskDto: UpdateTaskDto): Task;
    remove(id: string): void;
    findByStatus(status: string, userId: string, userRole: string): Task[];
    findByStatusPaginated(status: string, userId: string, userRole: string, page?: number, pageSize?: number): {
        data: Task[];
        total: number;
        page: number;
        pageSize: number;
    };
    getDueSoon(userId: string, userRole: string, days?: number): Task[];
    generateMockData(count: number, userId: string): number;
    clearMockData(userId: string, userRole: string): number;
}
