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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../../entities/notification.entity");
const user_entity_1 = require("../../entities/user.entity");
const deliverable_entity_1 = require("../../entities/deliverable.entity");
const invoice_entity_1 = require("../../entities/invoice.entity");
const notificationType_entity_1 = require("../../entities/notificationType.entity");
let NotificationsService = class NotificationsService {
    constructor(notificationsRepository, userRepository, deliverableRepository, invoiceRepository, notificationsTypeRepository) {
        this.notificationsRepository = notificationsRepository;
        this.userRepository = userRepository;
        this.deliverableRepository = deliverableRepository;
        this.invoiceRepository = invoiceRepository;
        this.notificationsTypeRepository = notificationsTypeRepository;
    }
    async getNotifications(impactedUserId, limit) {
        const whereConditions = {};
        if (impactedUserId) {
            whereConditions.impactedUser = { id: impactedUserId };
        }
        const results = await this.notificationsRepository.find({
            relations: ['notificationType',
                'impactedUser',
                'triggerUser',
                'deliverable',
                'invoice'],
            select: {
                notificationType: { name: true },
                impactedUser: { Names: true, LastName: true },
                triggerUser: { Names: true, LastName: true },
                deliverable: { name: true, path: true },
                invoice: { number: true },
                note: true,
                createdAt: true
            },
            where: whereConditions,
            order: {
                createdAt: "DESC"
            },
        });
        return limit !== undefined && limit !== null ? results.slice(0, limit) : results;
    }
    async createNotification(createNotificationDto) {
        const { notificationTypeId, triggerUserId, impactedUserId, deliverableId, invoiceId, note } = createNotificationDto;
        const notification = new notification_entity_1.Notification();
        if (impactedUserId) {
            notification.impactedUser = await this.userRepository.findOne({ where: { id: impactedUserId } });
        }
        notification.triggerUser = await this.userRepository.findOne({ where: { id: triggerUserId } });
        notification.notificationType = await this.notificationsTypeRepository.findOne({ where: { id: notificationTypeId } });
        if (deliverableId) {
            notification.deliverable = await this.deliverableRepository.findOne({ where: { id: deliverableId } });
        }
        if (invoiceId) {
            notification.invoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
        }
        notification.note = note;
        await this.notificationsRepository.save(notification);
        return {
            "message": "notification created",
            "type": deliverableId ? "deliverable" : invoiceId ? "invoice" : "Undefined"
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(deliverable_entity_1.Deliverable)),
    __param(3, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(4, (0, typeorm_1.InjectRepository)(notificationType_entity_1.NotificationType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map