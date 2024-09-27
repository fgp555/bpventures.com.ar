import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Voucher } from 'src/entities/vouchers.entity';
export declare class VouchersController {
    private readonly vouchersService;
    constructor(vouchersService: VouchersService);
    createVoucher(createVoucherDto: CreateVoucherDto, file: Express.Multer.File): Promise<Voucher>;
    getAllVouchers(): Promise<Voucher[]>;
    getVoucherById(id: number): Promise<Voucher>;
    getVouchersByInvoiceId(invoiceId: number): Promise<Voucher[]>;
    updateVoucher(id: number, updateVoucherDto: UpdateVoucherDto): Promise<Voucher>;
    deleteVoucher(id: number): Promise<Voucher>;
}
