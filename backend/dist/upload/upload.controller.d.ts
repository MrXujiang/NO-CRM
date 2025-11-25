import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadSingleFile(file: Express.Multer.File): {
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
        url: string;
    };
    uploadMultipleFiles(files: Express.Multer.File[]): {
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
        url: string;
    }[];
    deleteFile(filename: string): {
        message: string;
    };
}
