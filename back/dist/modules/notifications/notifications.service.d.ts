import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
import { CreateNotificationDto } from './create-notification.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Deliverable } from 'src/entities/deliverable.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { NotificationType } from 'src/entities/notificationType.entity';
export declare class NotificationsService {
    private notificationsRepository;
    private userRepository;
    private deliverableRepository;
    private invoiceRepository;
    private notificationsTypeRepository;
    constructor(notificationsRepository: Repository<Notification>, userRepository: Repository<UserEntity>, deliverableRepository: Repository<Deliverable>, invoiceRepository: Repository<Invoice>, notificationsTypeRepository: Repository<NotificationType>);
    getNotifications(impactedUserId?: number, limit?: number): Promise<Notification[]>;
    createNotification(createNotificationDto: CreateNotificationDto): Promise<{
        message: string;
        type: string;
    }>;
}
