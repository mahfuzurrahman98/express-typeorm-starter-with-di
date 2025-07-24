import { NextFunction, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { CategoryService } from '@/app/services/category.service';
import {
    CreateCategoryRequestDTO,
    CreateCategoryResponseDTO,
    ListCategoryResponseDTO,
    RetrieveCategoryResponseDTO,
    UpdateCategoryRequestDTO,
    UpdateCategoryResponseDTO,
} from '@/app/dtos/category.dto';
import { createCategorySchema, updateCategorySchema } from '@/app/schemas/category.schema';
import { formatError } from '@/utils/helpers/error-formatter';

@autoInjectable()
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    create = async (
        request: Request<{}, {}, CreateCategoryRequestDTO>,
        response: Response<CreateCategoryResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const data: CreateCategoryRequestDTO = createCategorySchema.parse(request.body);
            const category = await this.categoryService.createCategory(data);
            response
                .status(201)
                .json({ message: 'Category created successfully', data: { category } });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    retrieve = async (
        request: Request<{ id: string }>,
        response: Response<RetrieveCategoryResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const { id } = request.params;
            const category = await this.categoryService.getCategoryById(id);
            response
                .status(200)
                .json({ message: 'Category retrieved successfully', data: { category } });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    list = async (
        request: Request<{}, {}, {}, { name?: string }>,
        response: Response<ListCategoryResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const queryParams = request.query;
            const categories = await this.categoryService.getAllCategories(queryParams);
            response
                .status(200)
                .json({ message: 'Categories retrieved successfully', data: { categories } });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    update = async (
        request: Request<{ id: string }, {}, UpdateCategoryRequestDTO>,
        response: Response<UpdateCategoryResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const { id } = request.params;
            const data: UpdateCategoryRequestDTO = updateCategorySchema.parse(request.body);
            const category = await this.categoryService.updateCategory({ id, data });
            response
                .status(200)
                .json({ message: 'Category updated successfully', data: { category } });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    delete = async (
        request: Request<{ id: string }>,
        response: Response<{ message: string }>,
        next: NextFunction,
    ) => {
        try {
            const { id } = request.params;
            await this.categoryService.deleteCategory(id);
            response.status(200).json({ message: 'Category deleted successfully' });
        } catch (error: any) {
            next(formatError(error));
        }
    };
}
