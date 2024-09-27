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
exports.DeliverableSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deliverable_entity_1 = require("../../entities/deliverable.entity");
const deliverableType_entity_1 = require("../../entities/deliverableType.entity");
const deliverableCategory_entity_1 = require("../../entities/deliverableCategory.entity");
let DeliverableSeeder = class DeliverableSeeder {
    constructor(deliverableRepository, deliverableTypeRepository, deliverableCategoryRepository) {
        this.deliverableRepository = deliverableRepository;
        this.deliverableTypeRepository = deliverableTypeRepository;
        this.deliverableCategoryRepository = deliverableCategoryRepository;
    }
    async seedDeliverable() {
        const deliverableData = [
            { id: 1, name: "Folder A", parentId: 2, isFolder: true, deliverableTypeId: 1, deliverableCategoryId: 2 },
            { id: 2, name: "Folder B", parentId: 3, isFolder: true, deliverableTypeId: 1, deliverableCategoryId: 1 },
            { id: 3, name: "Folder C", parentId: 4, isFolder: true, deliverableTypeId: 1, deliverableCategoryId: 3 },
            { id: 4, name: "Folder D", parentId: null, isFolder: true, deliverableTypeId: 1, deliverableCategoryId: 3 },
            { id: 5, name: "File X", parentId: 1, isFolder: false, deliverableTypeId: 3, deliverableCategoryId: 1 },
            { id: 6, name: "File 1", parentId: 1, isFolder: false, deliverableTypeId: 3, deliverableCategoryId: 2 },
            { id: 7, name: "File 2", parentId: 2, isFolder: false, deliverableTypeId: 3, deliverableCategoryId: 2 },
            { id: 8, name: "File 3", parentId: 3, isFolder: false, deliverableTypeId: 3, deliverableCategoryId: 3 },
            { id: 9, name: "Folder F", parentId: 4, isFolder: true, deliverableTypeId: 1, deliverableCategoryId: 1 }
        ];
        if (await this.deliverableRepository.count() > 0) {
            console.log('Deliverables already has data.');
            return;
        }
        for (const item of deliverableData) {
            const deliverable = this.deliverableRepository.create({
                ...item,
                path: item.name.toLowerCase().replace(/\s+/g, '_'),
                createdAt: new Date(),
                updatedAt: new Date(),
                statusId: 1,
                deliverableType: await this.deliverableTypeRepository.findOne({ where: { id: item.deliverableTypeId } }),
                deliverableCategory: await this.deliverableCategoryRepository.findOne({ where: { id: item.deliverableCategoryId } }),
            });
            await this.deliverableRepository.save(deliverable);
        }
        console.log('Deliverables seeded successfully.');
    }
};
exports.DeliverableSeeder = DeliverableSeeder;
exports.DeliverableSeeder = DeliverableSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deliverable_entity_1.Deliverable)),
    __param(1, (0, typeorm_1.InjectRepository)(deliverableType_entity_1.DeliverableType)),
    __param(2, (0, typeorm_1.InjectRepository)(deliverableCategory_entity_1.DeliverableCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DeliverableSeeder);
//# sourceMappingURL=deliverable.seeder.js.map