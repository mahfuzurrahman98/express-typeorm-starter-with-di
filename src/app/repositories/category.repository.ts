import { Repository } from 'typeorm';
import { AppDataSource } from '@/app/data-source';
import { Category } from '@/app/entities/category.entity';

export class CategoryRepository extends Repository<Category> {
    constructor() {
        super(Category, AppDataSource.getInstance().manager);
    }
}
