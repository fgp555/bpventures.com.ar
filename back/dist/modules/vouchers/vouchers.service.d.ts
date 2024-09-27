import { Repository } from 'typeorm';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Invoice } from '../../entities/invoice.entity';
import { Voucher } from 'src/entities/vouchers.entity';
export declare class VouchersService {
    private voucherRepository;
    private invoiceRepository;
    constructor(voucherRepository: Repository<Voucher>, invoiceRepository: Repository<Invoice>);
    createVoucher(createVoucherDto: CreateVoucherDto): Promise<Voucher>;
    getAllVouchers(): Promise<Voucher[]>;
    getVoucherById(id: number): Promise<Voucher>;
    getVouchersByInvoiceId(invoiceId: number): Promise<Voucher[]>;
    updateVoucher(id: number, updateVoucherDto: UpdateVoucherDto): Promise<Voucher>;
    deleteVoucher(id: number): Promise<Voucher>;
}
