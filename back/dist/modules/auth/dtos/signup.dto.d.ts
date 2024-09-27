export declare class SignUpDto {
    email: string;
    password: string;
    Names: string;
    LastName: string;
    Position: string;
    verifiedEmail?: boolean;
    mfaEnabled?: boolean;
    mfaBackupCodes?: string;
    mfaSecret?: string;
    mfaVerified?: Date;
    active?: boolean;
    isAdmin?: boolean;
    domain: string;
    companyId?: number;
}
