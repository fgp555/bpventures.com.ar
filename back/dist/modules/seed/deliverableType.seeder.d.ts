import { Repository } from 'typeorm';
import { DeliverableType } from '../../entities/deliverableType.entity';
export declare class DeliverableTypeSeeder {
    private readonly deliverableTypeRepository;
    constructor(deliverableTypeRepository: Repository<DeliverableType>);
    seedDeliverableType(): Promise<void>;
}
