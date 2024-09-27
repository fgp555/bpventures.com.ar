import { Repository } from 'typeorm';
import { PermissionType } from '../../entities/permissionType.entity';
export declare class PermissionTypeSeeder {
    private readonly permissionTypeRepository;
    constructor(permissionTypeRepository: Repository<PermissionType>);
    seedPermissionType(): Promise<void>;
}
