import { Repository } from 'typeorm';
import { DeliverableCategory } from '../../entities/deliverableCategory.entity';
export declare class DeliverableCategorySeeder {
    private readonly deliverableCategoryRepository;
    constructor(deliverableCategoryRepository: Repository<DeliverableCategory>);
    seedDeliverableCategory(): Promise<void>;
}
