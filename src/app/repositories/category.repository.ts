import { Repository } from 'typeorm';
import { appDataSource } from '@/app/data-source';
import { Category } from '@/app/entities/category.entity';

export class CategoryRepository extends Repository<Category> {
    constructor() {
        super(Category, appDataSource.manager);
    }
}