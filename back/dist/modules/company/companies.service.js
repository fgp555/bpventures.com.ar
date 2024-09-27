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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const company_entity_1 = require("../../entities/company.entity");
const typeorm_2 = require("typeorm");
let CompaniesService = class CompaniesService {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async create(createCompanyDto) {
        const { name, cuit } = createCompanyDto;
        const existingByName = await this.companyRepository.findOne({ where: { name } });
        if (existingByName) {
            throw new common_1.ConflictException('Una empresa con este nombre ya existe.');
        }
        const existingByCuit = await this.companyRepository.findOne({ where: { cuit } });
        if (existingByCuit) {
            throw new common_1.ConflictException('Una empresa con este CUIT ya existe.');
        }
        const company = this.companyRepository.create(createCompanyDto);
        return this.companyRepository.save(company);
    }
    async findAll() {
        return this.companyRepository.find({
            relations: ['users', 'invoices'],
            order: {
                id: 'ASC',
            },
        });
    }
    async findOne(id) {
        const company = await this.companyRepository.findOne({
            where: { id },
            relations: ['users', 'invoices', "invoices.invoiceStatus"],
        });
        if (!company) {
            throw new common_1.NotFoundException(`Company with ID ${id} not found`);
        }
        company.users.sort((a, b) => a.id - b.id);
        company.invoices.sort((a, b) => a.id - b.id);
        return company;
    }
    async update(id, updateCompanyDto) {
        const { name, cuit } = updateCompanyDto;
        const company = await this.findOne(id);
        const existingByName = await this.companyRepository.findOne({
            where: { name, id: (0, typeorm_2.Not)(id) }
        });
        if (existingByName) {
            throw new common_1.ConflictException('Una empresa con este nombre ya existe.');
        }
        const existingByCuit = await this.companyRepository.findOne({
            where: { cuit, id: (0, typeorm_2.Not)(id) }
        });
        if (existingByCuit) {
            throw new common_1.ConflictException('Una empresa con este CUIT ya existe.');
        }
        Object.assign(company, updateCompanyDto);
        return this.companyRepository.save(company);
    }
    async remove(id) {
        const company = await this.companyRepository.findOne({
            where: { id },
            relations: ['users', 'invoices'],
        });
        if (!company) {
            throw new common_1.NotFoundException(`No se encontró una empresa con el ID: ${id}`);
        }
        const hasUsers = company.users && company.users.length > 0;
        const hasInvoices = company.invoices && company.invoices.length > 0;
        if (hasUsers || hasInvoices) {
            let relations = [];
            if (hasUsers)
                relations.push('usuarios');
            if (hasInvoices)
                relations.push('facturas');
            throw new common_1.BadRequestException(`No se puede eliminar la empresa porque está relacionada con los siguientes elementos: ${relations.join(' y ')}.`);
        }
        await this.companyRepository.remove(company);
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map