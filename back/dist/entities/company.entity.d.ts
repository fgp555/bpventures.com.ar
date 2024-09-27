import { UserEntity } from './user.entity';
import { Invoice } from './invoice.entity';
export declare class Company {
    id: number;
    name: string;
    cuit: number;
    address: string;
    users: UserEntity[];
    invoices: Invoice[];
}
