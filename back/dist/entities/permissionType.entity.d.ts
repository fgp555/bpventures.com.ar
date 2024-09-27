import { Permission } from "./permission.entity";
export declare class PermissionType {
    id: number;
    name: string;
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
}
