import { UserEntity as User } from "./user.entity";
import { PermissionType } from "./permissionType.entity";
import { Deliverable } from "./deliverable.entity";
import { Invoice } from "./invoice.entity";
export declare class Permission {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
    deliverable: Deliverable;
    deliverableId: string;
    permissionType: PermissionType;
    permissionTypeId: number;
    invoice: Invoice;
}
