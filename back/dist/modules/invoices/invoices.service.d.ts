import { Invoice } from '../../entities/invoice.entity';
import { Repository } from 'typeorm';
import { InvoiceStatus } from '../../entities/invoiceStatus.entity';
import { UserEntity } from '../../entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoices.dto';
import { Response } from 'express';
import { Permission } from 'src/entities/permission.entity';
import { PermissionType } from 'src/entities/permissionType.entity';
import { Company } from 'src/entities/company.entity';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { NotificationsGateway } from 'src/websockets/notifications/notifications.gateway';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { MailService } from '../mail/mail.service';
export declare class InvoicesService {
    private invoiceRepository;
    private userRepository;
    private companyRepository;
    private invoiceStatusRepository;
    private permissionsRepository;
    private permissionTypeRepository;
    private readonly notificationsService;
    private readonly notificationsGateway;
    private readonly mailService;
    constructor(invoiceRepository: Repository<Invoice>, userRepository: Repository<UserEntity>, companyRepository: Repository<Company>, invoiceStatusRepository: Repository<InvoiceStatus>, permissionsRepository: Repository<Permission>, permissionTypeRepository: Repository<PermissionType>, notificationsService: NotificationsService, notificationsGateway: NotificationsGateway, mailService: MailService);
    getAllInvoices(): Promise<Invoice[]>;
    checkInvoiceNumberExists(invoiceNumber: string): Promise<boolean>;
    updateInvoiceStatus(id: number, updateInvoiceStatusDto: UpdateInvoiceStatusDto, user: number): Promise<Invoice>;
    createInvoice(createInvoiceDto: CreateInvoiceDto, userId: number): Promise<Invoice>;
    updateInvoice(id: number, updateInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
    getInvoiceById(id: number): Promise<Invoice>;
    getInvoicesByUser(userId: number, idsInvoiceStatus: number[], page?: number, pageSize?: number): Promise<Invoice[]>;
    getInvoicesById(id: number): Promise<Invoice[]>;
    getDonwloadInvoicesCopy(userId: number, invoiceId: number, res: Response): Promise<{
        contentType: string;
        filePath: string;
        invoiceCopy: Invoice;
        fileExtension: string;
    }>;
    deleteInvoice(id: number): Promise<void>;
    getPermissions(invoiceId: number): Promise<{
        userId: string;
        permissionType: PermissionType;
    }[]>;
    updatePermissions(invoiceId: number, newPermission: Permission[], userId: number): Promise<Permission[]>;
    sendDueSoonEmails(): Promise<void>;
    handleCron(): Promise<void>;
}
