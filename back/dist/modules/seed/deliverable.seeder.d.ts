import { Repository } from 'typeorm';
import { Deliverable } from '../../entities/deliverable.entity';
import { DeliverableType } from '../../entities/deliverableType.entity';
import { DeliverableCategory } from '../../entities/deliverableCategory.entity';
export declare class DeliverableSeeder {
    private readonly deliverableRepository;
    private readonly deliverableTypeRepository;
    private readonly deliverableCategoryRepository;
    constructor(deliverableRepository: Repository<Deliverable>, deliverableTypeRepository: Repository<DeliverableType>, deliverableCategoryRepository: Repository<DeliverableCategory>);
    seedDeliverable(): Promise<void>;
}
