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
exports.UserSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../entities/user.entity");
const company_entity_1 = require("../../entities/company.entity");
let UserSeeder = class UserSeeder {
    constructor(userRepository, companyRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }
    async seed() {
        if (await this.userRepository.count() > 0) {
            return;
        }
        const companies = await this.companyRepository.find();
        const users = [];
        console.log("process.env.USER_ADMIN", process.env.USER_ADMIN);
        const fedeAdmin = new user_entity_1.UserEntity();
        fedeAdmin.email = process.env.USER_ADMIN;
        fedeAdmin.password = await bcrypt.hash(process.env.PASS_ADMIN, 10);
        fedeAdmin.Names = 'Federico';
        fedeAdmin.LastName = 'Giusti';
        fedeAdmin.Position = 'Admin';
        fedeAdmin.verifiedEmail = true;
        fedeAdmin.mfaEnabled = false;
        fedeAdmin.mfaBackupCodes = '';
        fedeAdmin.mfaSecret = '';
        fedeAdmin.mfaVerified = null;
        fedeAdmin.createdAt = new Date();
        fedeAdmin.modifiedAt = new Date();
        fedeAdmin.isAdmin = true;
        fedeAdmin.company = companies[6];
        fedeAdmin.imgProfile = "https://i.postimg.cc/Qx312GfY/fede.jpg";
        users.push(fedeAdmin);
        await this.userRepository.save(users);
        console.info('Seeded user');
    }
};
exports.UserSeeder = UserSeeder;
exports.UserSeeder = UserSeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserSeeder);
//# sourceMappingURL=user-seeder.js.map