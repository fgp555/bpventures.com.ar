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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const typeorm_1 = require("typeorm");
const invoiceStatus_entity_1 = require("./invoiceStatus.entity");
const user_entity_1 = require("./user.entity");
const permission_entity_1 = require("./permission.entity");
const company_entity_1 = require("./company.entity");
const notification_entity_1 = require("./notification.entity");
const vouchers_entity_1 = require("./vouchers.entity");
let Invoice = class Invoice {
};
exports.Invoice = Invoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Invoice.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "issueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Invoice.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', }),
    __metadata("design:type", Date)
], Invoice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.invoices, { nullable: true }),
    __metadata("design:type", user_entity_1.UserEntity)
], Invoice.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invoiceStatus_entity_1.InvoiceStatus, invoiceStatus => invoiceStatus.invoices),
    __metadata("design:type", invoiceStatus_entity_1.InvoiceStatus)
], Invoice.prototype, "invoiceStatus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permission_entity_1.Permission, permission => permission.invoice),
    __metadata("design:type", Array)
], Invoice.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, notification => notification.invoice),
    __metadata("design:type", Array)
], Invoice.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, (company) => company.invoices, { nullable: true }),
    __metadata("design:type", company_entity_1.Company)
], Invoice.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => vouchers_entity_1.Voucher, voucher => voucher.invoiceId, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", vouchers_entity_1.Voucher)
], Invoice.prototype, "voucher", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)()
], Invoice);
//# sourceMappingURL=invoice.entity.js.map