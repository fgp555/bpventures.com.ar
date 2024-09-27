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
exports.VouchersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../../entities/invoice.entity");
const vouchers_entity_1 = require("../../entities/vouchers.entity");
let VouchersService = class VouchersService {
    constructor(voucherRepository, invoiceRepository) {
        this.voucherRepository = voucherRepository;
        this.invoiceRepository = invoiceRepository;
    }
    async createVoucher(createVoucherDto) {
        const { invoiceId, ...rest } = createVoucherDto;
        const invoice = await this.invoiceRepository.findOne({
            where: { id: invoiceId },
        });
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${invoiceId} not found`);
        }
        const voucher = this.voucherRepository.create({
            ...rest,
            invoiceId: invoice,
        });
        return this.voucherRepository.save(voucher);
    }
    async getAllVouchers() {
        return this.voucherRepository.find({ relations: ['invoiceId'] });
    }
    async getVoucherById(id) {
        const voucher = await this.voucherRepository.findOne({
            where: { id },
            relations: ['invoiceId'],
        });
        if (!voucher) {
            throw new common_1.NotFoundException(`Voucher with ID ${id} not found`);
        }
        return voucher;
    }
    async getVouchersByInvoiceId(invoiceId) {
        return this.voucherRepository.find({
            where: { invoiceId: (0, typeorm_2.Equal)(invoiceId) },
        });
    }
    async updateVoucher(id, updateVoucherDto) {
        const voucher = await this.getVoucherById(id);
        Object.assign(voucher, updateVoucherDto);
        return this.voucherRepository.save(voucher);
    }
    async deleteVoucher(id) {
        const voucher = await this.getVoucherById(id);
        return await this.voucherRepository.remove(voucher);
    }
};
exports.VouchersService = VouchersService;
exports.VouchersService = VouchersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vouchers_entity_1.Voucher)),
    __param(1, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VouchersService);
//# sourceMappingURL=vouchers.service.js.map