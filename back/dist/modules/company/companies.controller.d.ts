import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(createCompanyDto: CreateCompanyDto): Promise<import("../../entities/company.entity").Company>;
    findAll(): Promise<import("../../entities/company.entity").Company[]>;
    findOne(id: number): Promise<import("../../entities/company.entity").Company>;
    update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<import("../../entities/company.entity").Company>;
    remove(id: number): Promise<void>;
}
