export declare class UploadService {
    private readonly uploadPath;
    constructor();
    getUploadPath(): string;
    generateFileName(originalName: string): string;
    getFileUrl(filename: string): string;
    deleteFile(filename: string): boolean;
}
