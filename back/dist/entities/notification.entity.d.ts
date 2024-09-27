import { NotificationType } from "./notificationType.entity";
import { UserEntity } from "./user.entity";
import { Deliverable } from "./deliverable.entity";
import { Invoice } from "./invoice.entity";
export declare class Notification {
    id: number;
    note: string;
    createdAt: Date;
    statusId: number;
    notificationType: NotificationType;
    deliverable: Deliverable;
    invoice: Invoice;
    impactedUser: UserEntity;
    triggerUser: UserEntity;
}
