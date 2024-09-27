import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
export declare class CompanySeeder {
    private readonly companyRepository;
    constructor(companyRepository: Repository<Company>);
    seed(): Promise<void>;
}
