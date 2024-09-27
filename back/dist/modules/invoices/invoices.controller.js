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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs-extra");
const invoices_service_1 = require("./invoices.service");
const create_invoices_dto_1 = require("./dto/create-invoices.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guards_1 = require("../../guards/auth.guards");
const update_invoice_status_dto_1 = require("./dto/update-invoice-status.dto");
let InvoicesController = class InvoicesController {
    constructor(invoicesService) {
        this.invoicesService = invoicesService;
    }
    async getAllInvoices() {
        return this.invoicesService.getAllInvoices();
    }
    async updateInvoiceStatus(id, updateInvoiceStatusDto, req) {
        try {
            const user = req.user.id;
            console.log(updateInvoiceStatusDto);
            return this.invoicesService.updateInvoiceStatus(id, updateInvoiceStatusDto, user);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async checkInvoiceNumber(invoiceNumber) {
        try {
            const exists = await this.invoicesService.checkInvoiceNumberExists(invoiceNumber);
            return { exists };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getInvoicesByUser(userId, page = 1, limit = 10) {
        try {
            const idsInvoiceStatus = [1, 2, 3];
            return this.invoicesService.getInvoicesByUser(userId, idsInvoiceStatus, page, limit);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async createInvoice(file, createInvoiceDto, req) {
        try {
            const userId = req.user.id;
            createInvoiceDto.path = file ? file.path : null;
            return this.invoicesService.createInvoice(createInvoiceDto, userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async updateInvoice(invoiceId, file, updateInvoiceDto) {
        try {
            updateInvoiceDto.path = file ? file.path : undefined;
            return this.invoicesService.updateInvoice(invoiceId, updateInvoiceDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getInvoiceById(id) {
        try {
            return await this.invoicesService.getInvoiceById(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getInvoice(id) {
        try {
            return await this.invoicesService.getInvoicesById(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getDonwloadInvoicesCopy(userId, invoiceId, res, req) {
        try {
            const userId = req.user.id;
            const data = await this.invoicesService.getDonwloadInvoicesCopy(userId, invoiceId, res);
            const { filePath, invoiceCopy, contentType, fileExtension } = data;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${invoiceCopy.number}.${fileExtension}"`);
            res.download(filePath);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async deleteInvoice(invoiceId, req) {
        try {
            const isAdmin = req.user.isAdmin;
            if (!isAdmin) {
                throw new common_1.ForbiddenException('No tiene permisos para realizar esta acción');
            }
            await this.invoicesService.deleteInvoice(invoiceId);
            return { message: 'deleted' };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getPermision(invoiceId) {
        try {
            return this.invoicesService.getPermissions(invoiceId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async createPermision(invoiceId, permission, req) {
        try {
            const userId = req.user.id;
            return this.invoicesService.updatePermissions(invoiceId, permission, userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async notifyDueSoonInvoices() {
        await this.invoicesService.sendDueSoonEmails();
    }
};
exports.InvoicesController = InvoicesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getAllInvoices", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.Patch)('status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_invoice_status_dto_1.UpdateInvoiceStatusDto, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "updateInvoiceStatus", null);
__decorate([
    (0, common_1.Get)('check-invoice-number'),
    __param(0, (0, common_1.Query)('invoiceNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "checkInvoiceNumber", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getInvoicesByUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/invoices';
                await fs.ensureDir(uploadPath);
                callback(null, uploadPath);
            },
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_invoices_dto_1.CreateInvoiceDto, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Patch)(':invoiceId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/invoices';
                await fs.ensureDir(uploadPath);
                callback(null, uploadPath);
            },
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('invoiceId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, create_invoices_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "updateInvoice", null);
__decorate([
    (0, common_1.Get)('getbyid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getInvoiceById", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getInvoice", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.Get)('download/:invoiceId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('invoiceId')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getDonwloadInvoicesCopy", null);
__decorate([
    (0, common_1.Delete)(':invoiceId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Param)('invoiceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "deleteInvoice", null);
__decorate([
    (0, common_1.Get)('permision/:invoiceId'),
    __param(0, (0, common_1.Param)('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "getPermision", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.Put)('permision/:invoiceId'),
    __param(0, (0, common_1.Param)('invoiceId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "createPermision", null);
__decorate([
    (0, common_1.Post)('notify-due-soon'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "notifyDueSoonInvoices", null);
exports.InvoicesController = InvoicesController = __decorate([
    (0, swagger_1.ApiTags)('invoices'),
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map