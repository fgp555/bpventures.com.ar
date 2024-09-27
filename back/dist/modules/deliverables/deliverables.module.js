"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliverablesModule = void 0;
const common_1 = require("@nestjs/common");
const deliverables_service_1 = require("./deliverables.service");
const deliverables_controller_1 = require("./deliverables.controller");
const typeorm_1 = require("@nestjs/typeorm");
const deliverable_entity_1 = require("../../entities/deliverable.entity");
const deliverableType_entity_1 = require("../../entities/deliverableType.entity");
const permission_entity_1 = require("../../entities/permission.entity");
const permissionType_entity_1 = require("../../entities/permissionType.entity");
const user_entity_1 = require("../../entities/user.entity");
const notifications_module_1 = require("../notifications/notifications.module");
const notifications_gateway_1 = require("../../websockets/notifications/notifications.gateway");
let DeliverablesModule = class DeliverablesModule {
};
exports.DeliverablesModule = DeliverablesModule;
exports.DeliverablesModule = DeliverablesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([deliverable_entity_1.Deliverable, deliverableType_entity_1.DeliverableType, permission_entity_1.Permission, permissionType_entity_1.PermissionType, user_entity_1.UserEntity]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [deliverables_controller_1.DeliverablesController],
        providers: [deliverables_service_1.DeliverablesService, notifications_gateway_1.NotificationsGateway],
    })
], DeliverablesModule);
//# sourceMappingURL=deliverables.module.js.map