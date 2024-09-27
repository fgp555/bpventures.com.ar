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
exports.DeliverableType = void 0;
const typeorm_1 = require("typeorm");
const deliverable_entity_1 = require("./deliverable.entity");
let DeliverableType = class DeliverableType {
};
exports.DeliverableType = DeliverableType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeliverableType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeliverableType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => deliverable_entity_1.Deliverable, deliverable => deliverable.deliverableType),
    __metadata("design:type", Array)
], DeliverableType.prototype, "deliverables", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', }),
    __metadata("design:type", Date)
], DeliverableType.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], DeliverableType.prototype, "updatedAt", void 0);
exports.DeliverableType = DeliverableType = __decorate([
    (0, typeorm_1.Entity)()
], DeliverableType);
//# sourceMappingURL=deliverableType.entity.js.map