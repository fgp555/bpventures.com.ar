import { InvoiceStatus } from "./invoiceStatus.entity";
import { UserEntity } from "./user.entity";
import { Permission } from "./permission.entity";
import { Company } from "./company.entity";
import { Notification } from "./notification.entity";
import { Voucher } from "./vouchers.entity";
export declare class Invoice {
    id: number;
    number: string;
    path: string;
    issueDate: Date;
    dueDate: Date;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    user: UserEntity;
    invoiceStatus: InvoiceStatus;
    permissions: Permission[];
    notifications: Notification[];
    company: Company;
    voucher: Voucher;
}
