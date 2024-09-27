"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesModule = void 0;
const common_1 = require("@nestjs/common");
const invoices_service_1 = require("./invoices.service");
const invoices_controller_1 = require("./invoices.controller");
const typeorm_1 = require("@nestjs/typeorm");
const invoice_entity_1 = require("../../entities/invoice.entity");
const invoiceStatus_entity_1 = require("../../entities/invoiceStatus.entity");
const user_entity_1 = require("../../entities/user.entity");
const permission_entity_1 = require("../../entities/permission.entity");
const permissionType_entity_1 = require("../../entities/permissionType.entity");
const company_entity_1 = require("../../entities/company.entity");
const notifications_gateway_1 = require("../../websockets/notifications/notifications.gateway");
const notifications_module_1 = require("../notifications/notifications.module");
const mail_service_1 = require("../mail/mail.service");
let InvoicesModule = class InvoicesModule {
};
exports.InvoicesModule = InvoicesModule;
exports.InvoicesModule = InvoicesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                invoice_entity_1.Invoice,
                invoiceStatus_entity_1.InvoiceStatus,
                user_entity_1.UserEntity,
                permission_entity_1.Permission,
                permissionType_entity_1.PermissionType,
                company_entity_1.Company,
            ]),
            notifications_module_1.NotificationsModule,
        ],
        providers: [invoices_service_1.InvoicesService, notifications_gateway_1.NotificationsGateway, mail_service_1.MailService],
        controllers: [invoices_controller_1.InvoicesController],
    })
], InvoicesModule);
//# sourceMappingURL=invoices.module.js.map