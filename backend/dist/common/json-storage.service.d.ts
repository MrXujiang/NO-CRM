export declare class JsonStorageService {
    private readonly dataPath;
    constructor();
    private getFilePath;
    read<T>(fileName: string): T[];
    write<T>(fileName: string, data: T[]): void;
    findById<T extends {
        id: string;
    }>(fileName: string, id: string): T | null;
    create<T extends {
        id: string;
    }>(fileName: string, item: T): T;
    update<T extends {
        id: string;
    }>(fileName: string, id: string, updates: Partial<T>): T | null;
    delete<T extends {
        id: string;
    }>(fileName: string, id: string): boolean;
    paginate<T>(items: T[], page?: number, pageSize?: number): {
        data: T[];
        total: number;
        page: number;
        pageSize: number;
    };
}
