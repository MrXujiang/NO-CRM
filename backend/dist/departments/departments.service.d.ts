import { JsonStorageService } from '../common/json-storage.service';
import type { Department } from '../common/interfaces';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
export declare class DepartmentsService {
    private readonly storageService;
    constructor(storageService: JsonStorageService);
    create(createDto: CreateDepartmentDto): Department;
    findAll(page?: number, pageSize?: number, status?: string): {
        data: Department[];
        total: number;
        page: number;
        pageSize: number;
    };
    findOne(id: string): Department;
    findByCode(code: string): Department | undefined;
    findTree(): Department[];
    update(id: string, updateDto: UpdateDepartmentDto): Department;
    remove(id: string): void;
    private countMembers;
    private findChildren;
    generateMockData(): number;
    clearMockData(): number;
}
