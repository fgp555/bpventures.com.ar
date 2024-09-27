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
exports.DeliverableCategorySeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deliverableCategory_entity_1 = require("../../entities/deliverableCategory.entity");
let DeliverableCategorySeeder = class DeliverableCategorySeeder {
    constructor(deliverableCategoryRepository) {
        this.deliverableCategoryRepository = deliverableCategoryRepository;
    }
    async seedDeliverableCategory() {
        const deliverableCategoryData = [];
        if (await this.deliverableCategoryRepository.count() > 0) {
            return;
        }
        let deliverableType = new deliverableCategory_entity_1.DeliverableCategory();
        deliverableType.name = "Final";
        deliverableCategoryData.push(deliverableType);
        deliverableType = new deliverableCategory_entity_1.DeliverableCategory();
        deliverableType.name = "Parcial";
        deliverableCategoryData.push(deliverableType);
        deliverableType = new deliverableCategory_entity_1.DeliverableCategory();
        deliverableType.name = "Borrador";
        deliverableCategoryData.push(deliverableType);
        await this.deliverableCategoryRepository.save(deliverableCategoryData);
        console.info('Seeded deliverable type Data');
    }
};
exports.DeliverableCategorySeeder = DeliverableCategorySeeder;
exports.DeliverableCategorySeeder = DeliverableCategorySeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deliverableCategory_entity_1.DeliverableCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeliverableCategorySeeder);
//# sourceMappingURL=deliverableCategory.seeder.js.map