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
exports.NotificationTypeSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notificationType_entity_1 = require("../../entities/notificationType.entity");
let NotificationTypeSeeder = class NotificationTypeSeeder {
    constructor(notificationTypeRepository) {
        this.notificationTypeRepository = notificationTypeRepository;
    }
    async seedNotificationType() {
        try {
            if (await this.notificationTypeRepository.count() > 0) {
                return;
            }
            const notificationTypeData = [
                { name: "otorgar permisos de lectura a la factura" },
                { name: "otorgar permisos edición a la factura" },
                { name: "otorgar permisos de lectura al entregable" },
                { name: "otorgar permisos edición al entregable" },
                { name: "descargar la factura" },
                { name: "descargar el entregable" },
                { name: "cargar la factura" },
                { name: "cargar el entregable" },
                { name: "editar la factura" },
                { name: "editar el entregable" },
                { name: "se ha cargado un voucher de pago" },
                { name: "la factura ya fue revisada y aprobada" },
            ];
            await this.notificationTypeRepository.save(notificationTypeData);
            console.info('Seeded notification type Data');
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.NotificationTypeSeeder = NotificationTypeSeeder;
exports.NotificationTypeSeeder = NotificationTypeSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notificationType_entity_1.NotificationType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationTypeSeeder);
//# sourceMappingURL=notificationType.seeder.js.map