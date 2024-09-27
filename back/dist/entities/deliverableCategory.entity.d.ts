import { Deliverable } from "./deliverable.entity";
export declare class DeliverableCategory {
    id: number;
    name: string;
    deliverables: Deliverable[];
    createdAt: Date;
    updatedAt: Date;
}
