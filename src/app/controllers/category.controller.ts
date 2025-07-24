import { NextFunction, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { CategoryService } from '@/app/services/category.service';
import { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from '@/app/dtos/category.dto';
import { APIResponseDTO } from '@/app/dtos/common.dto';
import { Category } from '@/app/entities/category.entity';

type CreateCategoryResponseDTO = APIResponseDTO<{ category: Category }>;
type RetrieveCategoryResponseDTO = APIResponseDTO<{ category: Category }>;
type ListCategoryResponseDTO = APIResponseDTO<{ categories: Category[] }>;
type UpdateCategoryResponseDTO = APIResponseDTO<{ category: Category }>;
type DeleteCategoryResponseDTO = APIResponseDTO<null>;
import { createCategorySchema, updateCategorySchema } from '@/app/schemas/category.schema';
import { formatError } from '@/utils/helpers/error-formatter';
import { RequestUser } from '@/app/interfaces/auth.interface';

@autoInjectable()
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    create = async (
        request: Request<{}, {}, CreateCategoryRequestDTO>,
        response: Response<CreateCategoryResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const { id } = request.user as RequestUser;
            const data: CreateCategoryRequestDTO = createCategorySchema.parse(request.body);
            const category = await this.categoryService.createCategory(id, data);
            response
                .status(201)
                .json({ message: 'Category created successfully', data: { category } });
        } catch (error) {
            next(formatError(error));
        }
    };

    retrieve = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const category = await this.categoryService.getCategoryById(id);
            response.status(200).json({ data: category });
        } catch (error) {
            next(formatError(error));
        }
    };

    list = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            response.status(200).json({ data: categories });
        } catch (error) {
            next(formatError(error));
        }
    };

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const data: UpdateCategoryRequestDTO = updateCategorySchema.parse(request.body);
            const category = await this.categoryService.updateCategory(id, data);
            response.status(200).json({ message: 'Category updated successfully', data: category });
        } catch (error) {
            next(formatError(error));
        }
    };

    delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            await this.categoryService.deleteCategory(id);
            response.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            next(formatError(error));
        }
    };
}
