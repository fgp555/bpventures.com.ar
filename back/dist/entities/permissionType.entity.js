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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionType = void 0;
const typeorm_1 = require("typeorm");
const permission_entity_1 = require("./permission.entity");
let PermissionType = class PermissionType {
};
exports.PermissionType = PermissionType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PermissionType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PermissionType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permission_entity_1.Permission, permission => permission.permissionType),
    __metadata("design:type", Array)
], PermissionType.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', }),
    __metadata("design:type", Date)
], PermissionType.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PermissionType.prototype, "updatedAt", void 0);
exports.PermissionType = PermissionType = __decorate([
    (0, typeorm_1.Entity)()
], PermissionType);
//# sourceMappingURL=permissionType.entity.js.map