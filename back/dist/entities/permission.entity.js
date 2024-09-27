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
exports.Permission = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const permissionType_entity_1 = require("./permissionType.entity");
const deliverable_entity_1 = require("./deliverable.entity");
const invoice_entity_1 = require("./invoice.entity");
let Permission = class Permission {
};
exports.Permission = Permission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Permission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', }),
    __metadata("design:type", Date)
], Permission.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Permission.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.permissions),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.UserEntity)
], Permission.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Permission.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => deliverable_entity_1.Deliverable, deliverable => deliverable.permissions, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'deliverableId' }),
    __metadata("design:type", deliverable_entity_1.Deliverable)
], Permission.prototype, "deliverable", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Permission.prototype, "deliverableId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permissionType_entity_1.PermissionType, permissionType => permissionType.permissions),
    (0, typeorm_1.JoinColumn)({ name: 'permissionTypeId' }),
    __metadata("design:type", permissionType_entity_1.PermissionType)
], Permission.prototype, "permissionType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Permission.prototype, "permissionTypeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invoice_entity_1.Invoice, invoice => invoice.permissions),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", invoice_entity_1.Invoice)
], Permission.prototype, "invoice", void 0);
exports.Permission = Permission = __decorate([
    (0, typeorm_1.Entity)()
], Permission);
//# sourceMappingURL=permission.entity.js.map