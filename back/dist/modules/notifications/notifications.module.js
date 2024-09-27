"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_gateway_1 = require("../../websockets/notifications/notifications.gateway");
const notifications_service_1 = require("./notifications.service");
const notifications_controller_1 = require("./notifications.controller");
const typeorm_1 = require("@nestjs/typeorm");
const notification_entity_1 = require("../../entities/notification.entity");
const notificationType_entity_1 = require("../../entities/notificationType.entity");
const user_entity_1 = require("../../entities/user.entity");
const invoice_entity_1 = require("../../entities/invoice.entity");
const deliverable_entity_1 = require("../../entities/deliverable.entity");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                notification_entity_1.Notification, notificationType_entity_1.NotificationType, user_entity_1.UserEntity, invoice_entity_1.Invoice, deliverable_entity_1.Deliverable
            ])],
        providers: [notifications_gateway_1.NotificationsGateway, notifications_service_1.NotificationsService],
        controllers: [notifications_controller_1.NotificationsController],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map