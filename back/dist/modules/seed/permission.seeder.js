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
exports.PermissionSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("../../entities/permission.entity");
let PermissionSeeder = class PermissionSeeder {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async seedPermission() {
        const permissionData = [];
        if (await this.permissionRepository.count() > 0) {
            return;
        }
        let permission = new permission_entity_1.Permission();
        permission.userId = "1";
        permission.deliverableId = "1";
        permission.permissionTypeId = 1;
        permissionData.push(permission);
        permission = new permission_entity_1.Permission();
        permission.userId = "1";
        permission.deliverableId = "1";
        permission.permissionTypeId = 2;
        permissionData.push(permission);
        permission = new permission_entity_1.Permission();
        permission.userId = "1";
        permission.deliverableId = "1";
        permission.permissionTypeId = 3;
        permissionData.push(permission);
        await this.permissionRepository.save(permissionData);
        console.info('Seeded Permission Type Data');
    }
};
exports.PermissionSeeder = PermissionSeeder;
exports.PermissionSeeder = PermissionSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PermissionSeeder);
//# sourceMappingURL=permission.seeder.js.map