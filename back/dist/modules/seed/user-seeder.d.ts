import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Company } from 'src/entities/company.entity';
export declare class UserSeeder {
    private readonly userRepository;
    private readonly companyRepository;
    constructor(userRepository: Repository<UserEntity>, companyRepository: Repository<Company>);
    seed(): Promise<void>;
}
