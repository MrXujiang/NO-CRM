import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    create(createDto: CreateDepartmentDto): import("../common/interfaces").Department;
    findAll(page?: string, pageSize?: string, status?: string): {
        data: import("../common/interfaces").Department[];
        total: number;
        page: number;
        pageSize: number;
    };
    getTree(): import("../common/interfaces").Department[];
    findOne(id: string): import("../common/interfaces").Department;
    update(id: string, updateDto: UpdateDepartmentDto): import("../common/interfaces").Department;
    remove(id: string): {
        message: string;
    };
    generateMock(): {
        message: string;
    };
    clearMock(): {
        message: string;
    };
}
