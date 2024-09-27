"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const invoice_entity_1 = require("../../entities/invoice.entity");
const typeorm_2 = require("typeorm");
const invoiceStatus_entity_1 = require("../../entities/invoiceStatus.entity");
const user_entity_1 = require("../../entities/user.entity");
const path_1 = require("path");
const fs_1 = require("fs");
const permission_entity_1 = require("../../entities/permission.entity");
const permissionType_entity_1 = require("../../entities/permissionType.entity");
const company_entity_1 = require("../../entities/company.entity");
const notifications_gateway_1 = require("../../websockets/notifications/notifications.gateway");
const notifications_service_1 = require("../notifications/notifications.service");
const mail_service_1 = require("../mail/mail.service");
const schedule_1 = require("@nestjs/schedule");
let InvoicesService = class InvoicesService {
    constructor(invoiceRepository, userRepository, companyRepository, invoiceStatusRepository, permissionsRepository, permissionTypeRepository, notificationsService, notificationsGateway, mailService) {
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.invoiceStatusRepository = invoiceStatusRepository;
        this.permissionsRepository = permissionsRepository;
        this.permissionTypeRepository = permissionTypeRepository;
        this.notificationsService = notificationsService;
        this.notificationsGateway = notificationsGateway;
        this.mailService = mailService;
    }
    async getAllInvoices() {
        const invoices = await this.invoiceRepository.find({
            relations: {
                user: true,
                company: true,
                invoiceStatus: true,
                permissions: { permissionType: true },
                voucher: true,
            },
            order: {
                id: 'ASC',
            },
        });
        if (!invoices || invoices.length === 0) {
            throw new common_1.NotFoundException('No se encontraron facturas');
        }
        return invoices;
    }
    async checkInvoiceNumberExists(invoiceNumber) {
        const existingInvoice = await this.invoiceRepository.findOneBy({
            number: invoiceNumber,
        });
        return !!existingInvoice;
    }
    async updateInvoiceStatus(id, updateInvoiceStatusDto, user) {
        const { invoiceStatusId } = updateInvoiceStatusDto;
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: { invoiceStatus: true, permissions: { user: true } },
        });
        const userTrigger = await this.userRepository.findOneBy({ id: user });
        if (!invoice) {
            throw new common_1.NotFoundException(`No se encontró la factura con el ID ${id}`);
        }
        const invoiceStatus = await this.invoiceStatusRepository.findOne({
            where: { id: invoiceStatusId },
        });
        if (!invoiceStatus) {
            throw new common_1.NotFoundException(`No se encontró el estado de factura con el ID ${invoiceStatusId}`);
        }
        invoice.invoiceStatus = invoiceStatus;
        console.log(invoice);
        invoice.permissions.map((item) => item.user.Names);
        await this.invoiceRepository.save(invoice);
        console.log(invoiceStatus.name);
        if (invoiceStatus.name === 'Revisión' || invoiceStatus.name === 'Pagado') {
            const impactedUser = invoice.permissions.map((permission) => permission.user);
            const salaAdmin = 'Admin';
            this.notificationsGateway.emitNotificationToUser(salaAdmin, {
                notificationType: invoiceStatus.name === 'Revisión'
                    ? 'se ha cargado un voucher de pago'
                    : 'la factura ya fue revisada y aprobada',
                impactedUser: null,
                triggerUser: userTrigger.Names,
                invoice: { number: invoice.number },
            });
            await this.notificationsService.createNotification({
                invoiceId: id,
                impactedUserId: null,
                notificationTypeId: invoiceStatus.name === 'Revisión' ? 11 : 12,
                triggerUserId: userTrigger.id,
            });
            impactedUser.forEach(async (user) => {
                const userId = user.id;
                const userRoom = `${userId}`;
                this.notificationsGateway.emitNotificationToUser(userRoom, {
                    notificationType: invoiceStatus.name === 'Revisión'
                        ? 'se ha cargado un voucher de pago'
                        : 'la factura ya fue revisada y aprobada',
                    impactedUser: { Names: user.Names, LastName: user.LastName },
                    triggerUser: { Names: userTrigger.Names, LastName: userTrigger.LastName },
                    invoice: { number: invoice.number },
                });
                await this.notificationsService.createNotification({
                    invoiceId: id,
                    impactedUserId: userId,
                    notificationTypeId: invoiceStatus.name === 'Revisión' ? 11 : 12,
                    triggerUserId: userTrigger.id,
                });
            });
        }
        return invoice;
    }
    async createInvoice(createInvoiceDto, userId) {
        const { invoiceNumber, path, issueDate, dueDate, amount, invoiceStatusId, companyId, } = createInvoiceDto;
        const existingInvoice = await this.invoiceRepository.findOneBy({
            number: invoiceNumber,
        });
        if (existingInvoice) {
            throw new common_1.BadRequestException('Ya existe una factura con este número');
        }
        const invoiceStatus = await this.invoiceStatusRepository.findOneBy({
            id: invoiceStatusId,
        });
        const userTrigger = await this.userRepository.findOneBy({ id: userId });
        const company = companyId
            ? await this.companyRepository.findOneBy({ id: companyId })
            : null;
        if (!invoiceStatus) {
            throw new common_1.BadRequestException('invoiceStatus o user no encontrado');
        }
        const invoice = this.invoiceRepository.create({
            number: invoiceNumber,
            path,
            issueDate,
            dueDate,
            amount,
            invoiceStatus,
            company,
        });
        const result = await this.invoiceRepository.save(invoice);
        const salaAdmin = 'Admin';
        this.notificationsGateway.emitNotificationToUser(salaAdmin, {
            notificationType: { name: 'cargar la factura' },
            impactedUser: null,
            triggerUser: { Names: userTrigger.Names, LastName: userTrigger.LastName },
            invoice: { number: result.number },
        });
        await this.notificationsService.createNotification({
            invoiceId: result.id,
            impactedUserId: null,
            notificationTypeId: 6,
            triggerUserId: userTrigger.id,
        });
        return result;
    }
    async updateInvoice(id, updateInvoiceDto) {
        const { invoiceNumber, path, issueDate, dueDate, amount, userId, invoiceStatusId, companyId, } = updateInvoiceDto;
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: { user: true, invoiceStatus: true, permissions: true },
        });
        if (!invoice) {
            throw new common_1.BadRequestException('Invoice not found');
        }
        if (invoiceNumber && invoiceNumber !== invoice.number) {
            const existingInvoice = await this.invoiceRepository.findOneBy({
                number: invoiceNumber,
            });
            if (existingInvoice) {
                throw new common_1.BadRequestException('Ya existe una factura con este número');
            }
        }
        const invoiceStatus = await this.invoiceStatusRepository.findOneBy({
            id: invoiceStatusId,
        });
        const user = await this.userRepository.findOneBy({ id: userId });
        const company = companyId
            ? await this.companyRepository.findOneBy({ id: companyId })
            : null;
        if (!invoiceStatus || !user) {
            throw new common_1.BadRequestException('invoiceStatus o user no encontrado');
        }
        invoice.number = invoiceNumber || invoice.number;
        invoice.path = path || invoice.path;
        invoice.issueDate = issueDate || invoice.issueDate;
        invoice.dueDate = dueDate || invoice.dueDate;
        invoice.amount = amount || invoice.amount;
        invoice.user = user;
        invoice.invoiceStatus = invoiceStatus;
        invoice.company = company;
        const data = invoice.permissions.map((permission) => permission.user);
        console.log(data);
        const salaAdmin = 'Admin';
        this.notificationsGateway.emitNotificationToUser(salaAdmin, {
            notificationType: { name: 'editar la factura' },
            impactedUser: null,
            triggerUser: { Names: user.Names, LastName: user.LastName },
            invoice: { number: invoice.number },
        });
        await this.notificationsService.createNotification({
            invoiceId: invoice.id,
            impactedUserId: null,
            notificationTypeId: 8,
            triggerUserId: user.id,
        });
        return this.invoiceRepository.save(invoice);
    }
    async getInvoiceById(id) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['user', 'invoiceStatus', 'company', 'voucher', "permissions"],
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async getInvoicesByUser(userId = null, idsInvoiceStatus, page = 1, pageSize = 10) {
        const offset = (page - 1) * pageSize;
        const queryBuilder = this.invoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.invoiceStatus', 'invoiceStatus')
            .leftJoinAndSelect('invoice.user', 'users')
            .leftJoinAndSelect('invoice.company', 'company')
            .select([
            'invoice.id AS "id"',
            'invoice.path AS "invoicePath"',
            'invoice.number AS "invoiceNumber"',
            `TO_CHAR(invoice.issueDate, 'DD-MM-YYYY') AS "invoiceIssueDate"`,
            `TO_CHAR(invoice.dueDate, 'DD-MM-YYYY') AS "invoiceDueDate"`,
            'invoice.amount AS "invoiceAmount"',
            'invoiceStatus.name AS "invoiceStatus"',
            `CASE 
                WHEN invoice.dueDate < CURRENT_DATE THEN true 
                ELSE false 
             END AS "overdueIndicator"`,
        ])
            .orderBy('"invoiceDueDate"', 'DESC')
            .limit(pageSize)
            .offset(offset);
        if (idsInvoiceStatus) {
            queryBuilder.where('invoiceStatus.id IN (:...statusIds)', {
                statusIds: idsInvoiceStatus,
            });
        }
        if (userId) {
            queryBuilder.where('users.id = :userId', { userId });
        }
        const result = await queryBuilder.getRawMany();
        return result;
    }
    async getInvoicesById(id) {
        const invoice = await this.invoiceRepository.find({
            where: { permissions: { user: { id: id } } },
            relations: {
                invoiceStatus: true,
                permissions: { permissionType: true },
                company: true,
                user: true,
                voucher: true,
            },
            order: {
                dueDate: 'DESC',
            },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async getDonwloadInvoicesCopy(userId, invoiceId, res) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new Error('User does not exist');
        const invoiceCopy = await this.invoiceRepository.findOne({
            where: { id: invoiceId },
        });
        console.log(invoiceCopy.path);
        if (!invoiceCopy)
            throw new common_1.NotFoundException('Invoice does not exist');
        const filePath = (0, path_1.join)(process.cwd(), invoiceCopy.path);
        console.log(filePath);
        if (!(0, fs_1.existsSync)(invoiceCopy.path)) {
            throw new common_1.NotFoundException('Invoice file not found');
        }
        const fileExtension = filePath.split('.').pop();
        let contentType;
        switch (fileExtension) {
            case 'pdf':
                contentType = 'application/pdf';
                break;
            case 'jpg':
            case 'jpeg':
                contentType = 'image/jpeg';
                break;
            case 'png':
                contentType = 'image/png';
                break;
            case 'txt':
                contentType = 'text/plain';
                break;
            default:
                contentType = 'application/octet-stream';
        }
        return { contentType, filePath, invoiceCopy, fileExtension };
    }
    async deleteInvoice(id) {
        const invoice = await this.invoiceRepository.findOneBy({ id: id });
        await this.invoiceRepository.remove(invoice);
    }
    async getPermissions(invoiceId) {
        const data = await this.permissionsRepository.find({
            where: { invoice: { id: invoiceId } },
            relations: { user: true, permissionType: true },
            select: { permissionType: { name: true, id: true } },
        });
        const permissions = data.map((item) => {
            return {
                userId: item.userId,
                permissionType: item.permissionType,
            };
        });
        return permissions;
    }
    async updatePermissions(invoiceId, newPermission, userId) {
        const permissions = await this.permissionsRepository.find({
            relations: { user: true, permissionType: true, invoice: true },
            where: { invoice: { id: invoiceId } },
        });
        if (!permissions) {
            return await this.permissionsRepository.save(newPermission);
        }
        console.log(permissions);
        const currentPermissionsSet = new Set(permissions.map((p) => `${p.userId}-${p.permissionTypeId}`));
        const newPermissionsSet = new Set(newPermission.map((p) => `${p.userId}-${p.permissionTypeId}`));
        const addedPermissions = newPermission.filter((p) => !currentPermissionsSet.has(`${p.userId}-${p.permissionTypeId}`));
        const removedPermissions = permissions.filter((p) => !newPermissionsSet.has(`${p.userId}-${p.permissionTypeId}`));
        const user = await this.userRepository.findOneBy({ id: userId });
        const salaAdmin = 'Admin';
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId },
        });
        addedPermissions.map(async (perm) => {
            console.log(perm.userId);
            const impactedUser = await this.userRepository.findOneBy({
                id: Number(perm.userId),
            });
            this.notificationsGateway.emitNotificationToUser(salaAdmin, {
                note: null,
                notificationType: { name: 'otorgar permisos de lectura a la factura' },
                impactedUser: { Names: impactedUser.Names, LastName: impactedUser.LastName },
                triggerUser: { Names: user.Names, LastName: user.LastName },
                invoice: { number: invoice.number },
            });
            this.notificationsGateway.emitNotificationToUser(perm?.userId, {
                note: null,
                notificationType: { name: 'otorgar permisos de lectura a la factura' },
                impactedUser: { Names: impactedUser.Names, LastName: impactedUser.LastName },
                triggerUser: { Names: user.Names, LastName: user.LastName },
                invoice: { number: invoice.number },
            });
            await this.notificationsService.createNotification({
                invoiceId: invoiceId,
                impactedUserId: Number(perm.userId),
                notificationTypeId: 1,
                triggerUserId: user.id,
            });
            const htmlContent = `
        <p>Hola ${impactedUser.Names},</p>
        <p>Se te ha otorgado acceso a la factura con el número <strong>${invoice.number}</strong>.</p>
        <p>Puedes acceder a la factura en la plataforma.</p>
        <p>Saludos,<br>Equipo de BP Ventures</p>
      `;
            const textContent = `
        Hola ${impactedUser.Names},
        
        Se te ha otorgado acceso a la factura con el número ${invoice.number}.
        Puedes acceder a la factura en la plataforma.
        
        Saludos,
        Equipo de BP Ventures
      `;
            await this.mailService.sendMail(impactedUser.email, 'Se te ha otorgado acceso a una factura', textContent, htmlContent);
        });
        await this.permissionsRepository.remove(permissions);
        const result = newPermission.map(async (item) => {
            const permissionObject = this.permissionsRepository.create({
                userId: item.userId,
                permissionTypeId: item.permissionTypeId,
                user: await this.userRepository.findOneBy({ id: Number(item.userId) }),
                permissionType: await this.permissionTypeRepository.findOneBy({
                    id: Number(item.permissionTypeId),
                }),
                invoice: await this.invoiceRepository.findOneBy({ id: invoiceId }),
            });
            return await this.permissionsRepository.save(permissionObject);
        });
        return await Promise.all(result);
    }
    async sendDueSoonEmails() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const dueSoonInvoices = await this.invoiceRepository.find({
            where: {
                dueDate: (0, typeorm_2.Between)(now, tomorrow),
            },
            relations: ['permissions', 'permissions.user', 'user'],
        });
        for (const invoice of dueSoonInvoices) {
            const usersWithPermissions = await this.permissionsRepository.find({
                where: { invoice: { id: invoice.id } },
                relations: ['user'],
            });
            for (const permission of usersWithPermissions) {
                const user = permission.user;
                if (user?.email) {
                    const htmlContent = `
            <p>Hola ${user.Names},</p>
            <p>La factura con el número <strong>${invoice.number}</strong> se vence en las próximas 24 horas.</p>
            <p>Por favor, asegúrate de tomar las medidas necesarias.</p>
            <p>Saludos,<br>Equipo de BP Ventures</p>
          `;
                    const textContent = `
            Hola ${user.Names},
            
            La factura con el número ${invoice.number} se vence en las próximas 24 horas.
            Por favor, asegúrate de tomar las medidas necesarias.
            
            Saludos,
            Equipo de BP Ventures
          `;
                    await this.mailService.sendMail(user.email, 'Factura próxima a vencerse', textContent, htmlContent);
                }
            }
        }
    }
    async handleCron() {
        const currentTime = new Date().toLocaleTimeString();
        console.log(`[${currentTime}] Ejecutando tarea programada: Envío de notificaciones de facturas próximas a vencer`);
        const currentDateTime = new Date().toLocaleString();
        console.log(`[${currentDateTime}] Ejecutando tarea programada: Envío de notificaciones de facturas próximas a vencer`);
    }
};
exports.InvoicesService = InvoicesService;
__decorate([
    (0, schedule_1.Cron)('0 12 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoicesService.prototype, "sendDueSoonEmails", null);
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(3, (0, typeorm_1.InjectRepository)(invoiceStatus_entity_1.InvoiceStatus)),
    __param(4, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(5, (0, typeorm_1.InjectRepository)(permissionType_entity_1.PermissionType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService,
        notifications_gateway_1.NotificationsGateway,
        mail_service_1.MailService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map