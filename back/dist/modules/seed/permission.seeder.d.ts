import { Repository } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
export declare class PermissionSeeder {
    private readonly permissionRepository;
    constructor(permissionRepository: Repository<Permission>);
    seedPermission(): Promise<void>;
}
