import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: Omit<import("../common/interfaces").User, "password">;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Omit<import("../common/interfaces").User, "password">;
        token: string;
    }>;
}
