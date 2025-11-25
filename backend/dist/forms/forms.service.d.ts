import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { SubmitFormDto } from './dto/submit-form.dto';
import { Form, FormSubmission } from './entities/form.entity';
import { JsonStorageService } from '../common/json-storage.service';
export declare class FormsService {
    private readonly storageService;
    private readonly formsFile;
    private readonly submissionsFile;
    constructor(storageService: JsonStorageService);
    create(createFormDto: CreateFormDto, userId: string): Form;
    findAll(userId: string, isAdmin: boolean): Form[];
    findOne(id: string): Form;
    findByShareUrl(shareUrl: string): Form;
    update(id: string, updateFormDto: UpdateFormDto, userId: string, isAdmin: boolean): Form;
    remove(id: string, userId: string, isAdmin: boolean): void;
    submit(submitFormDto: SubmitFormDto, ip?: string, userAgent?: string): FormSubmission;
    getSubmissions(formId: string, userId: string, isAdmin: boolean): FormSubmission[];
    getStatistics(formId: string, userId: string, isAdmin: boolean): {
        submitCount: number;
        viewCount: number;
        conversionRate: string;
        dailySubmissions: {
            date: string;
            count: number;
        }[];
        recentSubmissions: FormSubmission[];
    };
    private generateShareUrl;
    generateMock(count: number): number;
    clearMock(userId: string, isAdmin: boolean): number;
}
