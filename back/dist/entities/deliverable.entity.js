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
exports.Deliverable = void 0;
const typeorm_1 = require("typeorm");
const deliverableType_entity_1 = require("./deliverableType.entity");
const permission_entity_1 = require("./permission.entity");
const deliverableCategory_entity_1 = require("./deliverableCategory.entity");
const notification_entity_1 = require("./notification.entity");
let Deliverable = class Deliverable {
};
exports.Deliverable = Deliverable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Deliverable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Deliverable.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Deliverable.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Deliverable.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Deliverable.prototype, "isFolder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', }),
    __metadata("design:type", Date)
], Deliverable.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Deliverable.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Deliverable.prototype, "statusId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => deliverableType_entity_1.DeliverableType, deliverableType => deliverableType.deliverables),
    __metadata("design:type", deliverableType_entity_1.DeliverableType)
], Deliverable.prototype, "deliverableType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => deliverableCategory_entity_1.DeliverableCategory, deliverableCategory => deliverableCategory.deliverables),
    __metadata("design:type", deliverableCategory_entity_1.DeliverableCategory)
], Deliverable.prototype, "deliverableCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permission_entity_1.Permission, permission => permission.deliverable),
    __metadata("design:type", Array)
], Deliverable.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, notification => notification.deliverable),
    __metadata("design:type", Array)
], Deliverable.prototype, "notifications", void 0);
exports.Deliverable = Deliverable = __decorate([
    (0, typeorm_1.Entity)()
], Deliverable);
//# sourceMappingURL=deliverable.entity.js.map