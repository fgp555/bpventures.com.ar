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
var InvoiceSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../../entities/invoice.entity");
const invoiceStatus_entity_1 = require("../../entities/invoiceStatus.entity");
const user_entity_1 = require("../../entities/user.entity");
const company_entity_1 = require("../../entities/company.entity");
let InvoiceSeeder = InvoiceSeeder_1 = class InvoiceSeeder {
    constructor(invoiceRepository, invoiceStatusRepository, userRepository, companyRepository) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceStatusRepository = invoiceStatusRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.logger = new common_1.Logger(InvoiceSeeder_1.name);
    }
    async seed() {
        try {
            const invoiceStatuses = await this.invoiceStatusRepository.find();
            const users = await this.userRepository.find();
            const companies = await this.companyRepository.find();
            if (invoiceStatuses.length === 0 || users.length === 0 || companies.length === 0) {
                this.logger.warn('Faltan datos necesarios para el seeder.');
                return;
            }
            const invoices = [
                {
                    number: 'INV-0001',
                    path: 'uploads/demo/factura-plantilla.pdf',
                    issueDate: new Date('2024-01-01'),
                    dueDate: new Date('2024-02-01'),
                    amount: 100.00,
                    user: users[0],
                    invoiceStatus: invoiceStatuses[0],
                    company: companies[0],
                },
                {
                    number: 'INV-0002',
                    path: 'uploads/demo/factura-plantilla.pdf',
                    issueDate: new Date('2024-02-01'),
                    dueDate: new Date('2024-03-01'),
                    amount: 150.00,
                    user: users[1],
                    invoiceStatus: invoiceStatuses[0],
                    company: companies[1],
                },
                {
                    number: 'INV-0003',
                    path: 'uploads/demo/factura-plantilla.pdf',
                    issueDate: new Date('2024-03-01'),
                    dueDate: new Date('2024-04-01'),
                    amount: 200.00,
                    user: users[2],
                    invoiceStatus: invoiceStatuses[0],
                    company: companies[2],
                },
                {
                    number: 'INV-0004',
                    path: 'uploads/demo/factura-plantilla.pdf',
                    issueDate: new Date('2024-04-01'),
                    dueDate: new Date('2024-05-01'),
                    amount: 250.00,
                    user: users[0],
                    invoiceStatus: invoiceStatuses[0],
                    company: companies[0],
                },
                {
                    number: 'INV-0005',
                    path: 'uploads/demo/factura-plantilla.pdf',
                    issueDate: new Date('2024-05-01'),
                    dueDate: new Date('2024-06-01'),
                    amount: 300.00,
                    user: users[1],
                    invoiceStatus: invoiceStatuses[0],
                    company: companies[1],
                },
                {
                    number: 'INV-0006',
                    path: 'uploads/demo/factura-plantilla.pdf',
                    issueDate: new Date('2024-06-01'),
                    dueDate: new Date('2024-07-01'),
                    amount: 350.00,
                    user: users[18],
                    invoiceStatus: invoiceStatuses[0],
                    company: companies[2],
                },
                {
                    number: 'INV-0007',
                    path: 'uploads/demo/factura-plantilla.pdf',
                    issueDate: new Date('2024-07-01'),
                    dueDate: new Date('2024-08-01'),
                    amount: 400.00,
                    user: users[19],
                    invoiceStatus: invoiceStatuses[0],
                    company: companies[0],
                },
                {
                    number: 'INV-0008',
                    path: 'uploads/demo/factura-plantilla.pdf',
                    issueDate: new Date('2024-08-01'),
                    dueDate: new Date('2024-09-01'),
                    amount: 450.00,
                    user: users[20],
                    invoiceStatus: invoiceStatuses[0],
                    company: companies[1],
                },
            ];
            await this.invoiceRepository.save(invoices);
            this.logger.log('Facturas seeding completo');
            console.info("Facturas seeding completo");
        }
        catch (error) {
            this.logger.error('Error al ejecutar el seeder de facturas', error.stack);
        }
    }
};
exports.InvoiceSeeder = InvoiceSeeder;
exports.InvoiceSeeder = InvoiceSeeder = InvoiceSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_1.InjectRepository)(invoiceStatus_entity_1.InvoiceStatus)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InvoiceSeeder);
//# sourceMappingURL=invoices-seeder.js.map