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
exports.DeliverablesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs-extra");
const path = require("path");
const deliverables_service_1 = require("./deliverables.service");
const create_deliverable_dto_1 = require("./dto/create-deliverable.dto");
const auth_guards_1 = require("../../guards/auth.guards");
const swagger_1 = require("@nestjs/swagger");
const process_1 = require("process");
const notifications_service_1 = require("../notifications/notifications.service");
const create_notification_dto_1 = require("../notifications/create-notification.dto");
const notifications_gateway_1 = require("../../websockets/notifications/notifications.gateway");
let DeliverablesController = class DeliverablesController {
    constructor(deliverablesService, notificationsService, notificationsGateway) {
        this.deliverablesService = deliverablesService;
        this.notificationsService = notificationsService;
        this.notificationsGateway = notificationsGateway;
    }
    async createDeliverableFile(file, createDeliverableDto, req) {
        try {
            let userId = req?.user?.id || 1;
            let user = req?.user;
            let isFolder = false;
            const temporalPath = (0, path_1.join)((0, process_1.cwd)(), './uploads/deliverables/temporal/', file.filename);
            const parentFolders = await this.deliverablesService.getParentFolders(createDeliverableDto.parentId);
            const newRelativePath = (0, path_1.join)('uploads/deliverables', parentFolders, file.filename);
            const newPath = (0, path_1.join)((0, process_1.cwd)(), newRelativePath);
            createDeliverableDto.path = newRelativePath;
            await fs.ensureDir((0, path_1.join)((0, process_1.cwd)(), 'uploads/deliverables', parentFolders));
            await fs.rename(temporalPath, newPath)
                .then(() => {
                console.log('File moved successfully!');
            })
                .catch(err => {
                console.error('Error moving file:', err);
            });
            const deliverableResult = await this.deliverablesService.create(createDeliverableDto, userId, isFolder);
            if (deliverableResult) {
                const createNotificationDto = new create_notification_dto_1.CreateNotificationDto();
                createNotificationDto.deliverableId = deliverableResult.deliverableId;
                createNotificationDto.notificationTypeId = 8;
                createNotificationDto.triggerUserId = userId;
                this.notificationsService.createNotification(createNotificationDto);
            }
            const canalAdmin = 'Admin';
            this.notificationsGateway.emitNotificationToUser(canalAdmin, {
                note: '',
                notificationType: { name: 'cargar el entregable' },
                impactedUser: null,
                triggerUser: { Names: user.names, LastName: user.lastName },
                deliverable: {
                    name: createDeliverableDto.name,
                    path: createDeliverableDto.path
                },
            });
            return true;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async updateDeliverableFile(file, createDeliverableDto, deliverableId, req) {
        try {
            let userId = req?.user?.id || 1;
            let user = req?.user;
            createDeliverableDto.path = file ? file.path : null;
            const isFolder = false;
            if (file) {
                const temporalPath = (0, path_1.join)((0, process_1.cwd)(), './uploads/deliverables/temporal/', file.filename);
                const parentFolders = await this.deliverablesService.getParentFolders(createDeliverableDto.parentId);
                const newRelativePath = (0, path_1.join)('uploads/deliverables', parentFolders, file.filename);
                const newPath = (0, path_1.join)((0, process_1.cwd)(), newRelativePath);
                createDeliverableDto.path = newRelativePath;
                await fs.rename(temporalPath, newPath)
                    .then(() => {
                    console.log('File moved successfully!');
                })
                    .catch(err => {
                    console.error('Error moving file:', err);
                });
                const oldFileResult = await this.deliverablesService.getByDeliverableID(deliverableId);
                const oldFileRelativePath = oldFileResult[0]?.path;
                if (oldFileRelativePath) {
                    const oldFilePath = (0, path_1.join)((0, process_1.cwd)(), 'uploads/deliverables', oldFileRelativePath);
                    await fs.unlink(oldFilePath, (err) => {
                        if (err) {
                            console.error('Error deleting old file:', err);
                        }
                        else {
                            console.log('Old file deleted successfully!');
                        }
                    });
                }
            }
            else {
                const existingDeliverable = await this.deliverablesService.getByDeliverableID(deliverableId);
                createDeliverableDto.path = existingDeliverable[0]?.path || null;
            }
            const deliverableResult = this.deliverablesService.updateDeliverable(deliverableId, createDeliverableDto, isFolder);
            if (deliverableResult) {
                const createNotificationDto = new create_notification_dto_1.CreateNotificationDto();
                createNotificationDto.deliverableId = deliverableId;
                createNotificationDto.notificationTypeId = 10;
                createNotificationDto.triggerUserId = userId;
                this.notificationsService.createNotification(createNotificationDto);
            }
            const canalAdmin = 'Admin';
            this.notificationsGateway.emitNotificationToUser(canalAdmin, {
                note: '',
                notificationType: { name: 'editar el entregable' },
                impactedUser: null,
                triggerUser: { Names: user.names, LastName: user.lastName },
                deliverable: {
                    name: createDeliverableDto.name,
                    path: createDeliverableDto.path
                },
            });
            return deliverableResult;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async createFolderDeliverable(createDeliverableDto, req) {
        try {
            let userId = req?.user?.id || 1;
            let user = req?.user;
            if (!userId) {
                throw new common_1.BadRequestException('User ID is missing');
            }
            const folderName = createDeliverableDto.name;
            let relativePath = "";
            if (createDeliverableDto.parentId) {
                relativePath = await this.deliverablesService.getParentFolders(createDeliverableDto.parentId);
                console.log(relativePath);
            }
            const isFolder = true;
            const folderPath = (0, path_1.resolve)(process.cwd(), 'uploads/deliverables', relativePath, folderName);
            console.log("folderPath");
            console.log(folderPath);
            try {
                const folderExists = await fs.stat(folderPath).catch(() => false);
                if (!folderExists) {
                    createDeliverableDto.path = (0, path_1.join)('uploads/deliverables', relativePath, folderName);
                    await fs.mkdir(folderPath, { recursive: true });
                    const deliverableResult = await this.deliverablesService.create(createDeliverableDto, userId, isFolder);
                    if (deliverableResult) {
                        const createNotificationDto = new create_notification_dto_1.CreateNotificationDto();
                        createNotificationDto.deliverableId = deliverableResult.deliverableId;
                        createNotificationDto.notificationTypeId = 8;
                        createNotificationDto.triggerUserId = userId;
                        this.notificationsService.createNotification(createNotificationDto);
                    }
                    const canalAdmin = 'Admin';
                    this.notificationsGateway.emitNotificationToUser(canalAdmin, {
                        note: '',
                        notificationType: { name: 'cargar el entregable' },
                        impactedUser: null,
                        triggerUser: { Names: user.names, LastName: user.lastName },
                        deliverable: {
                            name: createDeliverableDto.name,
                            path: createDeliverableDto.path
                        },
                    });
                    return {
                        message: `Folder ${folderName} created successfully`,
                        folderPath,
                    };
                }
                else {
                    throw new common_1.ConflictException(`Folder ${folderName} already exists`);
                }
            }
            catch (error) {
                throw new common_1.BadRequestException(`Error creating folder: ${error.message}`);
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateFolderDeliverable(createDeliverableDto, deliverableId, req) {
        const isFolder = true;
        try {
            let userId = req?.user?.id || 1;
            let user = req?.user;
            if (!userId) {
                throw new common_1.BadRequestException('User ID is missing');
            }
            const newFolderName = createDeliverableDto.name;
            let relativePath = "";
            if (createDeliverableDto.parentId) {
                relativePath = await this.deliverablesService.getParentFolders(createDeliverableDto.parentId);
                console.log(relativePath);
            }
            const oldFolderNameResult = await this.deliverablesService.getByDeliverableID(deliverableId);
            const oldFolderName = oldFolderNameResult[0].name;
            console.log("oldFolderName");
            console.log(oldFolderName);
            const oldPath = path.join(process.cwd(), 'uploads/deliverables', relativePath, oldFolderName);
            const newFolderPath = (0, path_1.resolve)(process.cwd(), 'uploads/deliverables', relativePath, newFolderName);
            console.log("newFolderPath");
            console.log(newFolderPath);
            createDeliverableDto.path = (0, path_1.join)('uploads/deliverables', relativePath, newFolderName);
            fs.rename(oldPath, newFolderPath, (err) => {
                if (err) {
                    console.error('Error al renombrar la carpeta:', err);
                }
                else {
                    console.log('Carpeta renombrada con éxito');
                }
            });
            const deliverableResult = this.deliverablesService.updateDeliverable(deliverableId, createDeliverableDto, isFolder);
            if (deliverableResult) {
                const createNotificationDto = new create_notification_dto_1.CreateNotificationDto();
                createNotificationDto.deliverableId = deliverableId;
                createNotificationDto.notificationTypeId = 10;
                createNotificationDto.triggerUserId = userId;
                this.notificationsService.createNotification(createNotificationDto);
            }
            const canalAdmin = 'Admin';
            this.notificationsGateway.emitNotificationToUser(canalAdmin, {
                note: '',
                notificationType: { name: 'editar el entregable' },
                impactedUser: null,
                triggerUser: { Names: user.names, LastName: user.lastName },
                deliverable: {
                    name: createDeliverableDto.name,
                    path: createDeliverableDto.path
                },
            });
            return deliverableResult;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async createLinkDeliverable(createDeliverableDto, req) {
        try {
            let userId = req?.user?.id || 1;
            let user = req?.user;
            const isFolder = false;
            const deliverableResult = await this.deliverablesService.create(createDeliverableDto, userId, isFolder);
            if (deliverableResult) {
                const createNotificationDto = new create_notification_dto_1.CreateNotificationDto();
                createNotificationDto.deliverableId = deliverableResult.deliverableId;
                createNotificationDto.notificationTypeId = 8;
                createNotificationDto.triggerUserId = userId;
                this.notificationsService.createNotification(createNotificationDto);
            }
            const canalAdmin = 'Admin';
            this.notificationsGateway.emitNotificationToUser(canalAdmin, {
                note: '',
                notificationType: { name: 'cargar el entregable' },
                impactedUser: null,
                triggerUser: { Names: user.names, LastName: user.lastName },
                deliverable: {
                    name: createDeliverableDto.name,
                    path: createDeliverableDto.path
                },
            });
            return {
                message: `Link created successfully`,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException('Invalid data provided for creating deliverable');
            }
            throw new common_1.InternalServerErrorException('An unexpected error occurred while creating the deliverable');
        }
    }
    async updateLinkDeliverable(createDeliverableDto, deliverableId, req) {
        const isFolder = false;
        try {
            let userId = req?.user?.id || 1;
            let user = req?.user;
            createDeliverableDto.deliverableTypeId = 2;
            if (!userId) {
                throw new common_1.BadRequestException('User ID is missing');
            }
            const deliverableResult = await this.deliverablesService.updateDeliverable(deliverableId, createDeliverableDto, isFolder);
            if (deliverableResult) {
                const createNotificationDto = new create_notification_dto_1.CreateNotificationDto();
                createNotificationDto.deliverableId = deliverableId;
                createNotificationDto.notificationTypeId = 10;
                createNotificationDto.triggerUserId = userId;
                this.notificationsService.createNotification(createNotificationDto);
            }
            const canalAdmin = 'Admin';
            this.notificationsGateway.emitNotificationToUser(canalAdmin, {
                note: '',
                notificationType: { name: 'editar el entregable' },
                impactedUser: null,
                triggerUser: { Names: user.names, LastName: user.lastName },
                deliverable: {
                    name: createDeliverableDto.name,
                    path: createDeliverableDto.path
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async findAll(userId, page = 1, limit = 10, parentId = null, orderBy = 'date', orderOrientation = 'DESC', companyId = null, req) {
        try {
            const isAdmin = req.user.isAdmin;
            let result = null;
            const deliverableResult = await this.deliverablesService.findAll(userId, page, limit, parentId, orderBy, isAdmin, orderOrientation, null, companyId);
            if (parentId) {
                return deliverableResult;
            }
            else {
                const deliverableIds = deliverableResult.map(item => item.id);
                result = await this.deliverablesService.findAll(userId, page, limit, parentId, orderBy, isAdmin, orderOrientation, deliverableIds, companyId);
                return result;
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    getByDeliverableId(deliverableId) {
        try {
            return this.deliverablesService.getByDeliverableID(deliverableId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async downloadFile(deliverableId, res, req) {
        try {
            const userId = req.user.id;
            const user = req.user;
            const data = await this.deliverablesService.getDownloadDeliverableCopy(userId, deliverableId);
            const { filePath, deliverableCopy, contentType, fileExtension } = data;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${deliverableCopy.name}.${fileExtension}"`);
            res.download(filePath);
            const createNotificationDto = new create_notification_dto_1.CreateNotificationDto();
            createNotificationDto.deliverableId = deliverableId;
            createNotificationDto.notificationTypeId = 5;
            createNotificationDto.triggerUserId = userId;
            this.notificationsService.createNotification(createNotificationDto);
            const canalAdmin = 'Admin';
            this.notificationsGateway.emitNotificationToUser(canalAdmin, {
                note: '',
                notificationType: { name: 'editar el entregable' },
                impactedUser: null,
                triggerUser: { Names: user.names, LastName: user.lastName },
                deliverable: {
                    name: deliverableCopy.name,
                    path: filePath
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getByName(name, req) {
        try {
            const userId = req.user.id;
            return this.deliverablesService.getByName(name, userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    remove(id) {
        try {
            return this.deliverablesService.remove(+id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getPreview(fileId) {
        try {
            return this.deliverablesService.getFilePreview(fileId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async getPermision(deliverableId) {
        try {
            return this.deliverablesService.getPermissions(deliverableId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async createPermision(deliverableId, permission, req) {
        try {
            const userId = req.user.id;
            return this.deliverablesService.updatePermissions(deliverableId, permission, userId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async uploadGoogleFile(body, req, res) {
        try {
            const userId = req.user.id;
            const { fileName, deliverableId, parentId } = body;
            return this.deliverablesService.uploadGoogleFile(userId, deliverableId, fileName, res, parentId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.DeliverablesController = DeliverablesController;
__decorate([
    (0, common_1.Post)('file'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/deliverables/temporal';
                await fs.ensureDir(uploadPath);
                callback(null, uploadPath);
            },
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_deliverable_dto_1.CreateDeliverableDto, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "createDeliverableFile", null);
__decorate([
    (0, common_1.Put)('file/:deliverableId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/deliverables/temporal';
                await fs.ensureDir(uploadPath);
                callback(null, uploadPath);
            },
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('deliverableId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_deliverable_dto_1.CreateDeliverableDto, Number, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "updateDeliverableFile", null);
__decorate([
    (0, common_1.Post)('folder'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deliverable_dto_1.CreateDeliverableDto, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "createFolderDeliverable", null);
__decorate([
    (0, common_1.Put)('folder/:deliverableId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('deliverableId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deliverable_dto_1.CreateDeliverableDto, Number, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "updateFolderDeliverable", null);
__decorate([
    (0, common_1.Post)('link'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deliverable_dto_1.CreateDeliverableDto, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "createLinkDeliverable", null);
__decorate([
    (0, common_1.Put)('link/:deliverableId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('deliverableId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deliverable_dto_1.CreateDeliverableDto, Number, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "updateLinkDeliverable", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('parentId')),
    __param(4, (0, common_1.Query)('orderBy')),
    __param(5, (0, common_1.Query)('orderOrientation')),
    __param(6, (0, common_1.Query)('companyId')),
    __param(7, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, String, String, Number, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':deliverableId'),
    __param(0, (0, common_1.Param)('deliverableId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DeliverablesController.prototype, "getByDeliverableId", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.Get)('download/:deliverableId'),
    __param(0, (0, common_1.Param)('deliverableId')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Get)('file/:name'),
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "getByName", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliverablesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('preview/:fileId'),
    __param(0, (0, common_1.Param)('fileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "getPreview", null);
__decorate([
    (0, common_1.Get)('permision/:deliverableId'),
    __param(0, (0, common_1.Param)('deliverableId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "getPermision", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.Put)('permision/:deliverableId'),
    __param(0, (0, common_1.Param)('deliverableId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "createPermision", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthGuard),
    (0, common_1.Post)('uploadGoogleFile'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliverablesController.prototype, "uploadGoogleFile", null);
exports.DeliverablesController = DeliverablesController = __decorate([
    (0, swagger_1.ApiTags)('deliverables'),
    (0, common_1.Controller)('deliverables'),
    __metadata("design:paramtypes", [deliverables_service_1.DeliverablesService,
        notifications_service_1.NotificationsService,
        notifications_gateway_1.NotificationsGateway])
], DeliverablesController);
//# sourceMappingURL=deliverables.controller.js.map