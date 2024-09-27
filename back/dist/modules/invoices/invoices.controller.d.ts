import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoices.dto';
import { Response } from 'express';
import { Request } from 'express';
import { Permission } from 'src/entities/permission.entity';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    getAllInvoices(): Promise<import("../../entities/invoice.entity").Invoice[]>;
    updateInvoiceStatus(id: number, updateInvoiceStatusDto: UpdateInvoiceStatusDto, req: Request): Promise<import("../../entities/invoice.entity").Invoice>;
    checkInvoiceNumber(invoiceNumber: string): Promise<{
        exists: boolean;
    }>;
    getInvoicesByUser(userId: number, page?: number, limit?: number): Promise<import("../../entities/invoice.entity").Invoice[]>;
    createInvoice(file: Express.Multer.File, createInvoiceDto: CreateInvoiceDto, req: Request): Promise<import("../../entities/invoice.entity").Invoice>;
    updateInvoice(invoiceId: number, file: Express.Multer.File, updateInvoiceDto: CreateInvoiceDto): Promise<import("../../entities/invoice.entity").Invoice>;
    getInvoiceById(id: number): Promise<import("../../entities/invoice.entity").Invoice>;
    getInvoice(id: number): Promise<import("../../entities/invoice.entity").Invoice[]>;
    getDonwloadInvoicesCopy(userId: number, invoiceId: number, res: Response, req: Request): Promise<void>;
    deleteInvoice(invoiceId: number, req: Request): Promise<{
        message: string;
    }>;
    getPermision(invoiceId: number): Promise<{
        userId: string;
        permissionType: import("../../entities/permissionType.entity").PermissionType;
    }[]>;
    createPermision(invoiceId: number, permission: any, req: Request): Promise<Permission[]>;
    notifyDueSoonInvoices(): Promise<void>;
}
