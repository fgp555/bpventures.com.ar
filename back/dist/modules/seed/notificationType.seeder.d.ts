import { Repository } from "typeorm";
import { NotificationType } from "../../entities/notificationType.entity";
export declare class NotificationTypeSeeder {
    private readonly notificationTypeRepository;
    constructor(notificationTypeRepository: Repository<NotificationType>);
    seedNotificationType(): Promise<void>;
}
