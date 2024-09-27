import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './create-notification.dto';
import { Request } from 'express';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: Request, limit?: number): Promise<import("../../entities/notification.entity").Notification[]>;
    createNotification(createNotificationDto: CreateNotificationDto): Promise<{
        message: string;
        type: string;
    }>;
}
