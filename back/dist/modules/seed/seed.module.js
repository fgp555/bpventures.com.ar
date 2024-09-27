"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_seeder_1 = require("./user-seeder");
const invoiceStatus_seeder_1 = require("./invoiceStatus.seeder");
const deliverableType_seeder_1 = require("./deliverableType.seeder");
const user_entity_1 = require("../../entities/user.entity");
const invoiceStatus_entity_1 = require("../../entities/invoiceStatus.entity");
const deliverableType_entity_1 = require("../../entities/deliverableType.entity");
const deliverableCategory_entity_1 = require("../../entities/deliverableCategory.entity");
const deliverableCategory_seeder_1 = require("./deliverableCategory.seeder");
const permissionType_seeder_1 = require("./permissionType.seeder");
const permissionType_entity_1 = require("../../entities/permissionType.entity");
const permission_entity_1 = require("../../entities/permission.entity");
const permission_seeder_1 = require("./permission.seeder");
const deliverable_entity_1 = require("../../entities/deliverable.entity");
const deliverable_seeder_1 = require("./deliverable.seeder");
const company_seeder_1 = require("./company-seeder");
const company_entity_1 = require("../../entities/company.entity");
const invoices_seeder_1 = require("./invoices-seeder");
const invoice_entity_1 = require("../../entities/invoice.entity");
const notificationType_entity_1 = require("../../entities/notificationType.entity");
const notificationType_seeder_1 = require("./notificationType.seeder");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                company_entity_1.Company,
                invoice_entity_1.Invoice,
                invoiceStatus_entity_1.InvoiceStatus,
                deliverable_entity_1.Deliverable,
                deliverableType_entity_1.DeliverableType,
                deliverableCategory_entity_1.DeliverableCategory,
                permissionType_entity_1.PermissionType,
                permission_entity_1.Permission,
                notificationType_entity_1.NotificationType
            ]),
        ],
        providers: [
            user_seeder_1.UserSeeder,
            company_seeder_1.CompanySeeder,
            invoices_seeder_1.InvoiceSeeder,
            invoiceStatus_seeder_1.InvoiceStatusSeeder,
            deliverable_seeder_1.DeliverableSeeder,
            deliverableType_seeder_1.DeliverableTypeSeeder,
            deliverableCategory_seeder_1.DeliverableCategorySeeder,
            permissionType_seeder_1.PermissionTypeSeeder,
            permission_seeder_1.PermissionSeeder,
            notificationType_seeder_1.NotificationTypeSeeder
        ],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map