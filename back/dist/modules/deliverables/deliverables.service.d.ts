import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { UpdateDeliverableDto } from './dto/update-deliverable.dto';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { Deliverable } from '../../entities/deliverable.entity';
import { DeliverableType } from '../../entities/deliverableType.entity';
import { PermissionType } from '../../entities/permissionType.entity';
import { Permission } from '../../entities/permission.entity';
import { UserEntity } from '../../entities/user.entity';
import { Response } from 'express';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../../websockets/notifications/notifications.gateway';
export declare class DeliverablesService {
    private dataSource;
    private deliverableRepository;
    private deliverableTypeRepository;
    private permissionTypeRepository;
    private permissionsRepository;
    private userRepository;
    private readonly notificationsService;
    private readonly notificationsGateway;
    constructor(dataSource: DataSource, deliverableRepository: Repository<Deliverable>, deliverableTypeRepository: Repository<DeliverableType>, permissionTypeRepository: Repository<PermissionType>, permissionsRepository: Repository<Permission>, userRepository: Repository<UserEntity>, notificationsService: NotificationsService, notificationsGateway: NotificationsGateway);
    private drive;
    getFilePreview(fileId: string): Promise<string>;
    create(createDeliverableDto: CreateDeliverableDto, userId: number, isFolder: boolean): Promise<{
        deliverableId: any;
        permissionResult: Permission;
    }>;
    findAll(userId: number, page: number, pageSize: number, parentId: number, orderBy: 'name' | 'date' | 'category', isAdmin: boolean, orderOrientation?: 'ASC' | 'DESC', deliverableIds?: number[], companyId?: number): Promise<Deliverable[]>;
    getParentFolders(deliverableId: number): Promise<string>;
    updateDeliverable(id: number, updateDeliverableDto: UpdateDeliverableDto, isFolder: boolean): Promise<import("typeorm").UpdateResult>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getPermissions(deliverableId: number): Promise<{
        userId: string;
        permissionType: PermissionType;
    }[]>;
    updatePermissions(deliverableId: number, newPermission: Permission[], userId: number): Promise<Permission[]>;
    getByDeliverableID(deliverableId: any): Promise<Deliverable[]>;
    getByName(name: string, userId: string): Promise<Deliverable[]>;
    getDownloadDeliverableCopy(userId: number, deliverableId: number): Promise<{
        contentType: string;
        filePath: string;
        deliverableCopy: Deliverable;
        fileExtension: string;
    }>;
    uploadGoogleFile(userId: number, deliverableId: number, fileName: string, res: Response, parentId?: string): Promise<void>;
}
