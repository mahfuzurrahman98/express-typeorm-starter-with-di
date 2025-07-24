import { autoInjectable } from 'tsyringe';
import { CategoryRepository } from '@/app/repositories/category.repository';
import { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from '@/app/dtos/category.dto';
import { Category } from '@/app/entities/category.entity';
import { CustomError } from '@/utils/custom-error';
import { RequestUser } from '@/app/interfaces/auth.interface';

@autoInjectable()
export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    async createCategory(userId: string, data: CreateCategoryRequestDTO): Promise<Category> {
        try {
            const category = this.categoryRepository.create({ ...data, userId });
            return await this.categoryRepository.save(category);
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }

    async getCategoryById(id: string): Promise<Category | null> {
        try {
            return await this.categoryRepository.findOne({ where: { id } });
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }

    async getAllCategories(): Promise<Category[]> {
        try {
            return await this.categoryRepository.find();
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }

    async updateCategory(id: string, data: UpdateCategoryRequestDTO): Promise<Category | null> {
        try {
            await this.categoryRepository.update(id, data);
            return await this.getCategoryById(id);
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }

    async deleteCategory(id: string): Promise<void> {
        try {
            await this.categoryRepository.delete(id);
        } catch (error: any) {
            throw new CustomError(500, `[CategoryService] ${error.message}`);
        }
    }
}