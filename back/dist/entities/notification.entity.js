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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const notificationType_entity_1 = require("./notificationType.entity");
const user_entity_1 = require("./user.entity");
const deliverable_entity_1 = require("./deliverable.entity");
const invoice_entity_1 = require("./invoice.entity");
let Notification = class Notification {
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', }),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Notification.prototype, "statusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => notificationType_entity_1.NotificationType, notificationType => notificationType.notifications),
    __metadata("design:type", notificationType_entity_1.NotificationType)
], Notification.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => deliverable_entity_1.Deliverable, deliverable => deliverable.notifications, { nullable: true }),
    __metadata("design:type", deliverable_entity_1.Deliverable)
], Notification.prototype, "deliverable", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invoice_entity_1.Invoice, invoice => invoice.notifications, { nullable: true }),
    __metadata("design:type", invoice_entity_1.Invoice)
], Notification.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.impactedNotifications),
    __metadata("design:type", user_entity_1.UserEntity)
], Notification.prototype, "impactedUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.triggeredNotifications),
    __metadata("design:type", user_entity_1.UserEntity)
], Notification.prototype, "triggerUser", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)()
], Notification);
//# sourceMappingURL=notification.entity.js.map