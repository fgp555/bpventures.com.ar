import { Notification } from "./notification.entity";
export declare class NotificationType {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    statusId: number;
    notifications: Notification[];
}
