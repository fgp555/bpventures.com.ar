import { Repository } from 'typeorm';
import { Invoice } from '../../entities/invoice.entity';
import { InvoiceStatus } from '../../entities/invoiceStatus.entity';
import { UserEntity } from '../../entities/user.entity';
import { Company } from '../../entities/company.entity';
export declare class InvoiceSeeder {
    private readonly invoiceRepository;
    private readonly invoiceStatusRepository;
    private readonly userRepository;
    private readonly companyRepository;
    private readonly logger;
    constructor(invoiceRepository: Repository<Invoice>, invoiceStatusRepository: Repository<InvoiceStatus>, userRepository: Repository<UserEntity>, companyRepository: Repository<Company>);
    seed(): Promise<void>;
}
