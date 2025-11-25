import { JwtService } from '@nestjs/jwt';
import { JsonStorageService } from '../common/json-storage.service';
import { User } from '../common/interfaces';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly storageService;
    private readonly jwtService;
    constructor(storageService: JsonStorageService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: Omit<User, 'password'>;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Omit<User, 'password'>;
        token: string;
    }>;
    validateUser(userId: string): Promise<Omit<User, 'password'> | null>;
}
