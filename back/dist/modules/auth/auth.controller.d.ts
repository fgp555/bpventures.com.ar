import { SingInDto } from './dtos/singIn.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/signup.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    checkEmailExists(email: string): Promise<{
        exists: boolean;
    }>;
    signIn(Crendential: SingInDto): Promise<{
        message: string;
        token: string;
        userPayload: {
            id: number;
            sub: number;
            email: string;
            isAdmin: boolean;
            names: string;
            lastName: string;
        };
    }>;
    signUp(body: SignUpDto): Promise<{
        userSave: import("../../entities/user.entity").UserEntity;
        encryptedHexMessage: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    verifyToken(req: Request): Promise<{
        message: string;
        user: any;
    }>;
    enableMfa(req: Request): Promise<{
        message: string;
        qrCode: any;
        secret: any;
    }>;
    forgotPassword(body: {
        email: string;
        domain: string;
    }): Promise<{
        message: string;
    }>;
}
