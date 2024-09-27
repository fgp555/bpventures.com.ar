import { DeliverablesService } from './deliverables.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { Permission } from '../../entities/permission.entity';
import { Request } from 'express';
import { Response } from 'express';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../../websockets/notifications/notifications.gateway';
export declare class DeliverablesController {
    private readonly deliverablesService;
    private readonly notificationsService;
    private readonly notificationsGateway;
    constructor(deliverablesService: DeliverablesService, notificationsService: NotificationsService, notificationsGateway: NotificationsGateway);
    createDeliverableFile(file: Express.Multer.File, createDeliverableDto: CreateDeliverableDto, req: Request): Promise<boolean>;
    updateDeliverableFile(file: Express.Multer.File, createDeliverableDto: CreateDeliverableDto, deliverableId: number, req: Request): Promise<import("typeorm").UpdateResult>;
    createFolderDeliverable(createDeliverableDto: CreateDeliverableDto, req: Request): Promise<{
        message: string;
        folderPath: string;
    }>;
    updateFolderDeliverable(createDeliverableDto: CreateDeliverableDto, deliverableId: number, req: Request): Promise<import("typeorm").UpdateResult>;
    createLinkDeliverable(createDeliverableDto: CreateDeliverableDto, req: Request): Promise<{
        message: string;
    }>;
    updateLinkDeliverable(createDeliverableDto: CreateDeliverableDto, deliverableId: number, req: Request): Promise<void>;
    findAll(userId: number, page: number, limit: number, parentId: number, orderBy: 'name' | 'date' | 'category', orderOrientation: 'ASC' | 'DESC', companyId: number, req: Request): Promise<any>;
    getByDeliverableId(deliverableId: number): Promise<import("../../entities/deliverable.entity").Deliverable[]>;
    downloadFile(deliverableId: number, res: Response, req: Request): Promise<void>;
    getByName(name: string, req: Request): Promise<import("../../entities/deliverable.entity").Deliverable[]>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getPreview(fileId: string): Promise<string>;
    getPermision(deliverableId: number): Promise<Partial<Permission>[]>;
    createPermision(deliverableId: number, permission: any, req: Request): Promise<Permission[]>;
    uploadGoogleFile(body: any, req: Request, res: Response): Promise<void>;
}
