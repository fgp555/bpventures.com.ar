import { Repository } from 'typeorm';
import { InvoiceStatus } from '../../entities/invoiceStatus.entity';
export declare class InvoiceStatusSeeder {
    private readonly invoiceStatusRepository;
    constructor(invoiceStatusRepository: Repository<InvoiceStatus>);
    seedInvoiceStatus(): Promise<void>;
}
