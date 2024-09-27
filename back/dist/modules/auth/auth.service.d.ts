import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import * as speakeasy from 'speakeasy';
import { MailService } from '../mail/mail.service';
import { SignUpDto } from 'src/modules/auth/dtos/signup.dto';
import { Company } from 'src/entities/company.entity';
export declare class AuthService {
    private userRepository;
    private companyRepository;
    private mailService;
    constructor(userRepository: Repository<UserEntity>, companyRepository: Repository<Company>, mailService: MailService);
    checkEmailExists(email: string): Promise<boolean>;
    signIn(email: string, password: string): Promise<UserEntity | null>;
    signUpService(body: SignUpDto): Promise<{
        userSave: UserEntity;
        encryptedHexMessage: string;
    }>;
    forgotMyPassword(email: string, domain: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    validateMfa(token: string, secret: string): boolean;
    generateMfaSecret(email: string, userId: string): Promise<any>;
    generateMfaQrCode(secret: speakeasy.GeneratedSecret): Promise<any>;
}
