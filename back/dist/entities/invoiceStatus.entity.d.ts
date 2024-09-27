import { Invoice } from "./invoice.entity";
export declare class InvoiceStatus {
    id: number;
    name: string;
    invoices: Invoice[];
    createdAt: Date;
    updatedAt: Date;
}
