import { DeliverableType } from "./deliverableType.entity";
import { Permission } from "./permission.entity";
import { DeliverableCategory } from "./deliverableCategory.entity";
import { Notification } from "./notification.entity";
export declare class Deliverable {
    id: number;
    name: string;
    path: string;
    parentId: number;
    isFolder: boolean;
    createdAt: Date;
    updatedAt: Date;
    statusId: number;
    deliverableType: DeliverableType;
    deliverableCategory: DeliverableCategory;
    permissions: Permission[];
    notifications: Notification[];
}
