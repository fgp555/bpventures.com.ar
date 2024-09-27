import { Invoice } from './invoice.entity';
export declare class Voucher {
    id: number;
    number?: string;
    path: string;
    paymentDate?: Date;
    amount?: number;
    invoiceId: Invoice;
    createdAt: Date;
    updatedAt: Date;
}
