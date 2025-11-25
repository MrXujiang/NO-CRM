import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { SubmitFormDto } from './dto/submit-form.dto';
export declare class FormsController {
    private readonly formsService;
    constructor(formsService: FormsService);
    create(createFormDto: CreateFormDto, req: any): import("./entities/form.entity").Form;
    findAll(req: any): import("./entities/form.entity").Form[];
    findOne(id: string): import("./entities/form.entity").Form;
    findByShareUrl(shareUrl: string): import("./entities/form.entity").Form;
    update(id: string, updateFormDto: UpdateFormDto, req: any): import("./entities/form.entity").Form;
    remove(id: string, req: any): {
        message: string;
    };
    submit(submitFormDto: SubmitFormDto, ip: string, userAgent: string): import("./entities/form.entity").FormSubmission;
    getSubmissions(id: string, req: any): import("./entities/form.entity").FormSubmission[];
    getStatistics(id: string, req: any): {
        submitCount: number;
        viewCount: number;
        conversionRate: string;
        dailySubmissions: {
            date: string;
            count: number;
        }[];
        recentSubmissions: import("./entities/form.entity").FormSubmission[];
    };
    generateMock(count?: string): {
        message: string;
    };
    clearMock(req: any): {
        message: string;
    };
}
