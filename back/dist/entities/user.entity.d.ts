import { Permission } from './permission.entity';
import { Invoice } from './invoice.entity';
import { Company } from './company.entity';
import { Notification } from './notification.entity';
export declare class UserEntity {
    id: number;
    email: string;
    password: string;
    Names: string;
    LastName: string;
    Position: string;
    empresa: string;
    cuit: number;
    domicilio: string;
    verifiedEmail: boolean;
    mfaEnabled: boolean;
    mfaBackupCodes: string;
    mfaSecret: string;
    mfaVerified: Date;
    createdAt: Date;
    modifiedAt: Date;
    statusId: number;
    permissions: Permission[];
    invoices: Invoice[];
    impactedNotifications: Notification[];
    triggeredNotifications: Notification[];
    isAdmin: boolean;
    company: Company;
    imgProfile: string;
}
