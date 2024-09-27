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
exports.CompanySeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("../../entities/company.entity");
let CompanySeeder = class CompanySeeder {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async seed() {
        if (await this.companyRepository.count() > 0) {
            return;
        }
        const companies = [];
        for (let i = 1; i <= 4; i++) {
            const company = new company_entity_1.Company();
            company.name = `Company${i}`;
            company.address = `Address${i}`;
            company.cuit = 11200000000 + i;
            companies.push(company);
        }
        const additionalCompany = new company_entity_1.Company();
        additionalCompany.name = 'Tech Innovations';
        additionalCompany.address = '123 Innovation Blvd';
        additionalCompany.cuit = 11300000000;
        companies.push(additionalCompany);
        const additionalCompany2 = new company_entity_1.Company();
        additionalCompany2.name = 'Creative Solutions';
        additionalCompany2.address = '456 Creativity Lane';
        additionalCompany2.cuit = 11400000000;
        companies.push(additionalCompany2);
        const additionalCompany3 = new company_entity_1.Company();
        additionalCompany3.name = 'Henry Company';
        additionalCompany3.address = 'Calle Falsa 123';
        additionalCompany3.cuit = 11500000000;
        companies.push(additionalCompany3);
        await this.companyRepository.save(companies);
        console.info('Seeded 6 companies');
    }
};
exports.CompanySeeder = CompanySeeder;
exports.CompanySeeder = CompanySeeder = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompanySeeder);
//# sourceMappingURL=company-seeder.js.map