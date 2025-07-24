import { autoInjectable } from 'tsyringe';
import { CategoryRepository } from '@/app/repositories/category.repository';
import { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from '@/app/dtos/category.dto';
import { Category } from '@/app/entities/category.entity';
import { CustomError } from '@/utils/custom-error';

@autoInjectable()
export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    async createCategory(data: CreateCategoryRequestDTO): Promise<Category> {
        try {
            const category = this.categoryRepository.create(data);
            return await this.categoryRepository.save(category);
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }

    async getCategoryById(id: string): Promise<Category> {
        try {
            const category: Category | null = await this.categoryRepository.findOne({
                where: { id },
            });
            if (!category) {
                throw new CustomError(404, 'Category not found');
            }
            return category;
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }

    async getAllCategories(queryParams?: { name?: string }): Promise<Category[]> {
        try {
            const query = this.categoryRepository.createQueryBuilder('category');

            if (queryParams?.name) {
                query.andWhere('category.name ILIKE :name', { name: `%${queryParams.name}%` });
            }

            const categories = await query.orderBy('category.createdAt', 'DESC').getMany();
            return categories;
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }

    async updateCategory({
        id,
        data,
    }: {
        id: string;
        data: UpdateCategoryRequestDTO;
    }): Promise<Category> {
        try {
            const category = await this.getCategoryById(id);
            Object.assign(category, data);
            return await this.categoryRepository.save(category);
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }

    async deleteCategory(id: string): Promise<void> {
        try {
            const category = await this.getCategoryById(id);
            await this.categoryRepository.delete(id);
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }
}
