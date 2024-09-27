"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliverablesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const deliverable_entity_1 = require("../../entities/deliverable.entity");
const deliverableType_entity_1 = require("../../entities/deliverableType.entity");
const googleapis_1 = require("googleapis");
const permissionType_entity_1 = require("../../entities/permissionType.entity");
const permission_entity_1 = require("../../entities/permission.entity");
const user_entity_1 = require("../../entities/user.entity");
const path_1 = require("path");
const fs_1 = require("fs");
const stream_1 = require("stream");
const util_1 = require("util");
const notifications_service_1 = require("../notifications/notifications.service");
const notifications_gateway_1 = require("../../websockets/notifications/notifications.gateway");
let DeliverablesService = class DeliverablesService {
    constructor(dataSource, deliverableRepository, deliverableTypeRepository, permissionTypeRepository, permissionsRepository, userRepository, notificationsService, notificationsGateway) {
        this.dataSource = dataSource;
        this.deliverableRepository = deliverableRepository;
        this.deliverableTypeRepository = deliverableTypeRepository;
        this.permissionTypeRepository = permissionTypeRepository;
        this.permissionsRepository = permissionsRepository;
        this.userRepository = userRepository;
        this.notificationsService = notificationsService;
        this.notificationsGateway = notificationsGateway;
        this.drive = googleapis_1.google.drive({
            version: 'v3',
            auth: process.env.GOOGLE_DRIVE_TOKEN,
        });
    }
    async getFilePreview(fileId) {
        const response = await this.drive.files.get({
            fileId,
            fields: 'webViewLink, webContentLink',
            supportsTeamDrives: true,
        });
        console.log(response);
        return response.data.webViewLink;
    }
    async create(createDeliverableDto, userId, isFolder) {
        const { name, path, deliverableTypeId, deliverableCategoryId, parentId } = createDeliverableDto;
        const deliverableType = await this.deliverableTypeRepository.findOneBy({
            id: deliverableTypeId,
        });
        if (!deliverableType) {
            throw new Error('Deliverable Type not found');
        }
        const deliverableCategory = await this.deliverableTypeRepository.findOneBy({
            id: deliverableCategoryId,
        });
        if (!deliverableType) {
            throw new Error('Deliverable Categpry not found');
        }
        const deliverableData = {
            name,
            path,
            deliverableType,
            deliverableCategory,
            isFolder,
        };
        if (parentId != null && parentId.toString() != "" && parentId != undefined) {
            deliverableData.parentId = parentId;
        }
        const deliveryResult = await this.deliverableRepository.save(deliverableData);
        let ownerPermissionTypeId = 1;
        let deliverableId = deliveryResult.id;
        const permissionObject = this.permissionsRepository.create({
            userId: userId.toString(),
            user: await this.userRepository.findOneBy({ id: Number(userId) }),
            permissionTypeId: ownerPermissionTypeId,
            permissionType: await this.permissionTypeRepository.findOneBy({
                id: Number(ownerPermissionTypeId),
            }),
            deliverable: await this.deliverableRepository.findOneBy({
                id: deliverableId,
            }),
            deliverableId: deliverableId.toString(),
        });
        const permissionResult = await this.permissionsRepository.save(permissionObject);
        return { deliverableId, permissionResult };
    }
    async findAll(userId = null, page = 1, pageSize = 10, parentId = null, orderBy, isAdmin, orderOrientation = 'DESC', deliverableIds = null, companyId = null) {
        const offset = (page - 1) * pageSize;
        const queryBuilder = this.deliverableRepository
            .createQueryBuilder('deliverable')
            .leftJoin('deliverable.deliverableType', 'deliverableType')
            .leftJoin('deliverable.permissions', 'permission')
            .leftJoin('permission.permissionType', 'permissionType')
            .leftJoin('permission.user', 'user')
            .leftJoin('user.company', 'company')
            .leftJoin('deliverable.deliverableCategory', 'deliverableCategory')
            .select([
            'deliverable.id AS "id"',
            'deliverable.parentId AS "parentId"',
            'deliverable.name AS "deliverableName"',
            'deliverable.isFolder AS "deliverableIsFolder"',
            'deliverable.path AS "deliverablePath"',
            'deliverableType.name AS "deliverableType"',
            'deliverableCategory.name AS "deliverableCategory"',
            `ARRAY_AGG(permissionType.name) AS "permissionTypes"`,
            `TO_CHAR(COALESCE(deliverable.updatedAt, deliverable.createdAt), 'DD-MM-YYYY') AS "lastDate"`,
        ])
            .groupBy('deliverable.id, deliverable.parentId, deliverable.name, deliverable.isFolder, deliverable.path, deliverableType.name, deliverableCategory.name');
        queryBuilder.where('deliverable.statusId = 1');
        if (!isAdmin && userId) {
            queryBuilder.andWhere('permission.userId = :userId', { userId });
        }
        if (companyId) {
            queryBuilder.andWhere('company.id = :companyId', { companyId });
        }
        if (parentId) {
            queryBuilder.andWhere('deliverable.parentId = :parentId', { parentId });
        }
        else {
            if (deliverableIds) {
                queryBuilder.andWhere('(deliverable.parentId IS NULL OR deliverable.parentId NOT IN (:...deliverableIds) )', { deliverableIds });
            }
        }
        const queryBuilder2 = this.dataSource
            .createQueryBuilder()
            .select('*')
            .from('(' + queryBuilder.getQuery() + ')', 'subquery')
            .setParameters(queryBuilder.getParameters());
        if (orderBy) {
            switch (orderBy) {
                case 'date':
                    queryBuilder2.orderBy('"lastDate"', orderOrientation);
                    break;
                case 'name':
                    queryBuilder2.orderBy('"deliverableName"', orderOrientation);
                    break;
                case 'category':
                    queryBuilder2.orderBy('"deliverableCategory"', orderOrientation);
                    break;
                default:
                    queryBuilder2.orderBy('"lastDate"', orderOrientation);
                    break;
            }
        }
        if (parentId) {
            queryBuilder2.limit(pageSize);
            queryBuilder2.offset(offset);
        }
        else {
            if (deliverableIds) {
                queryBuilder2.limit(pageSize);
                queryBuilder2.offset(offset);
            }
        }
        const result = await queryBuilder2.getRawMany();
        return result;
    }
    async getParentFolders(deliverableId) {
        const deliverable = await this.deliverableRepository.findOneBy({
            id: deliverableId,
        });
        if (!deliverable) {
            throw new Error(`Deliverable with ID ${deliverableId} not found`);
        }
        let currentPath = deliverable.name;
        if (deliverable.parentId) {
            const parentPath = await this.getParentFolders(deliverable.parentId);
            currentPath = parentPath + '/' + currentPath;
        }
        return currentPath;
    }
    async updateDeliverable(id, updateDeliverableDto, isFolder) {
        const { name, path, deliverableTypeId, deliverableCategoryId, parentId } = updateDeliverableDto;
        const deliverableType = await this.deliverableTypeRepository.findOneBy({
            id: deliverableTypeId,
        });
        if (!deliverableType) {
            throw new Error('Deliverable Type not found');
        }
        const deliverableCategory = await this.deliverableTypeRepository.findOneBy({
            id: deliverableCategoryId,
        });
        if (!deliverableType) {
            throw new Error('Deliverable Categpry not found');
        }
        const deliverableData = {
            name,
            path,
            deliverableType,
            deliverableCategory,
            isFolder,
        };
        if (parentId != null && parentId.toString() != "" && parentId != undefined) {
            deliverableData.parentId = parentId;
        }
        const result = await this.deliverableRepository.update(id, deliverableData);
        return result;
    }
    async remove(id) {
        const result = await this.deliverableRepository.update(id, { statusId: 2 });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Deliverable with ID ${id} not found`);
        }
        return { message: 'Deliverable status updated' };
    }
    async getPermissions(deliverableId) {
        const data = await this.permissionsRepository.find({
            relations: { user: true, permissionType: true },
            where: { deliverable: { id: deliverableId } },
            select: { permissionType: { name: true, id: true } },
        });
        const permissions = data.map((item) => {
            return {
                userId: item.userId,
                permissionType: item.permissionType,
            };
        });
        return permissions;
    }
    async updatePermissions(deliverableId, newPermission, userId) {
        const permissions = await this.permissionsRepository.find({
            relations: { user: true, permissionType: true, deliverable: true },
            where: { deliverable: { id: deliverableId } },
        });
        if (!permissions) {
            return await this.permissionsRepository.save(newPermission);
        }
        console.log(permissions);
        const currentPermissionsSet = new Set(permissions.map((p) => `${p.userId}-${p.permissionTypeId}`));
        const newPermissionsSet = new Set(newPermission.map((p) => `${p.userId}-${p.permissionTypeId}`));
        const addedPermissions = newPermission.filter((p) => !currentPermissionsSet.has(`${p.userId}-${p.permissionTypeId}`));
        const removedPermissions = permissions.filter((p) => !newPermissionsSet.has(`${p.userId}-${p.permissionTypeId}`));
        const triggerUser = await this.userRepository.findOneBy({ id: userId });
        const salaAdmin = 'Admin';
        const deliverable = await this.deliverableRepository.findOne({
            where: { id: deliverableId }
        });
        addedPermissions.map(async (perm) => {
            let impactedUserData = await this.userRepository.findOneBy({ id: Number(perm.userId) });
            this.notificationsGateway.emitNotificationToUser(salaAdmin, {
                notificationType: {
                    name: `otorgar permisos de ${perm.permissionTypeId == 2 ? "lectura" : perm.permissionTypeId == 3 ? "edición" : "indefinido"} al entregable`
                },
                impactedUser: { Names: impactedUserData.Names, LastName: impactedUserData.LastName },
                triggerUser: { Names: triggerUser.Names, LastName: triggerUser.LastName },
                deliverable: { name: deliverable.name, path: deliverable.path },
            });
            this.notificationsGateway.emitNotificationToUser(perm.userId, {
                notificationType: {
                    name: `otorgar permisos de ${perm.permissionTypeId == 2 ? "lectura" : perm.permissionTypeId == 3 ? "edición" : "indefinido"} al entregable`
                },
                impactedUser: { Names: impactedUserData.Names, LastName: impactedUserData.LastName },
                triggerUser: { Names: triggerUser.Names, LastName: triggerUser.LastName },
                deliverable: { name: deliverable.name, path: deliverable.path },
            });
            await this.notificationsService.createNotification({
                deliverableId: deliverableId,
                impactedUserId: Number(perm.userId),
                notificationTypeId: perm.permissionTypeId == 2 ? 3 : perm.permissionTypeId == 3 ? 4 : undefined,
                triggerUserId: triggerUser.id,
            });
        });
        console.log(addedPermissions, removedPermissions);
        await this.permissionsRepository.remove(permissions);
        const result = newPermission.map(async (item) => {
            const permissionObject = this.permissionsRepository.create({
                userId: item.userId,
                permissionTypeId: item.permissionTypeId,
                user: await this.userRepository.findOneBy({ id: Number(item.userId) }),
                permissionType: await this.permissionTypeRepository.findOneBy({
                    id: Number(item.permissionTypeId),
                }),
                deliverable: await this.deliverableRepository.findOneBy({
                    id: deliverableId,
                }),
                deliverableId: deliverableId.toString(),
            });
            return await this.permissionsRepository.save(permissionObject);
        });
        return await Promise.all(result);
    }
    async getByDeliverableID(deliverableId) {
        return await this.deliverableRepository.find({
            relations: {
                permissions: true,
                deliverableType: true,
                deliverableCategory: true,
            },
            where: { id: deliverableId },
        });
    }
    async getByName(name, userId) {
        const user = await this.userRepository.findOneBy({ id: Number(userId) });
        if (user.isAdmin) {
            const result = await this.deliverableRepository.find({
                where: { name: (0, typeorm_3.ILike)(`%${name}%`) },
                relations: {
                    permissions: { permissionType: true },
                    deliverableType: true,
                    deliverableCategory: true,
                },
                select: {
                    id: true,
                    parentId: true,
                    name: true,
                    isFolder: true,
                    path: true,
                    deliverableType: { name: true },
                    deliverableCategory: { name: true },
                    permissions: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            console.log(result);
            if (!result || result.length === 0) {
                throw new common_1.NotFoundException('No deliverables found');
            }
            return result;
        }
        else {
            const data = await this.deliverableRepository.find({
                where: {
                    name: (0, typeorm_3.ILike)(`%${name}%`),
                    permissions: { user: { id: Number(userId) } },
                },
                relations: {
                    permissions: { permissionType: true },
                    deliverableType: true,
                    deliverableCategory: true,
                },
                select: {
                    id: true,
                    parentId: true,
                    name: true,
                    isFolder: true,
                    path: true,
                    deliverableType: { name: true },
                    deliverableCategory: { name: true },
                    permissions: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            console.log(data);
            if (!data)
                throw new common_1.NotFoundException(`Deliverable with name ${name} not found`);
            return data;
        }
    }
    async getDownloadDeliverableCopy(userId, deliverableId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new Error('User does not exist');
        const deliverableCopy = await this.deliverableRepository.findOne({
            where: { id: deliverableId },
        });
        console.log(deliverableCopy.path);
        if (!deliverableCopy)
            throw new common_1.NotFoundException('Deliverable not found');
        const filePath = (0, path_1.join)(process.cwd(), deliverableCopy.path);
        console.log(filePath);
        if (!(0, fs_1.existsSync)(deliverableCopy.path)) {
            throw new common_1.NotFoundException('Invoice file not found');
        }
        const fileExtension = filePath.split('.').pop();
        let contentType;
        switch (fileExtension) {
            case 'pdf':
                contentType = 'application/pdf';
                break;
            case 'jpg':
            case 'jpeg':
                contentType = 'image/jpeg';
                break;
            case 'png':
                contentType = 'image/png';
                break;
            case 'txt':
                contentType = 'text/plain';
                break;
            default:
                contentType = 'application/octet-stream';
        }
        return { contentType, filePath, deliverableCopy, fileExtension };
    }
    async uploadGoogleFile(userId, deliverableId, fileName, res, parentId) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException('User does not exist');
        const fileUrl = `https://drive.google.com/uc?export=download&id=${deliverableId}`;
        const filePath = (0, path_1.join)(process.cwd(), 'uploads/deliverables', fileName);
        try {
            const response = await fetch(fileUrl, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new common_1.BadRequestException('Error al descargar el archivo');
            }
            const fileStream = (0, fs_1.createWriteStream)(filePath);
            const streamPipeline = (0, util_1.promisify)(stream_1.pipeline);
            await streamPipeline(response.body, fileStream);
            console.log(`Archivo guardado en: ${filePath}`);
            const deliverableObject = {
                name: fileName,
                path: filePath,
                deliverableCategoryId: 1,
                deliverableTypeId: 3,
                parentId: Number(parentId) || null
            };
            await this.create(deliverableObject, userId, false);
            res.status(200).json({ message: 'Archivo guardado exitosamente.', filePath });
        }
        catch (error) {
            console.error('Error al descargar o guardar el archivo:', error);
            throw new common_1.BadRequestException('Error al descargar o guardar el archivo');
        }
    }
};
exports.DeliverablesService = DeliverablesService;
exports.DeliverablesService = DeliverablesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(deliverable_entity_1.Deliverable)),
    __param(2, (0, typeorm_1.InjectRepository)(deliverableType_entity_1.DeliverableType)),
    __param(3, (0, typeorm_1.InjectRepository)(permissionType_entity_1.PermissionType)),
    __param(4, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.Repository,
        notifications_service_1.NotificationsService,
        notifications_gateway_1.NotificationsGateway])
], DeliverablesService);
//# sourceMappingURL=deliverables.service.js.map