import { infer as zInfer } from 'zod';
import { createCategorySchema, updateCategorySchema } from '@/app/schemas/category.schema';
import { APIResponseDTO } from '@/app/dtos/common.dto';
import { Category } from '@/app/entities/category.entity';

// Request DTOs
export type CreateCategoryRequestDTO = zInfer<typeof createCategorySchema>;
export type UpdateCategoryRequestDTO = zInfer<typeof updateCategorySchema>;

// Response DTOs
export type CreateCategoryResponseDTO = APIResponseDTO<{ category: Category }>;
export type RetrieveCategoryResponseDTO = APIResponseDTO<{ category: Category }>;
export type ListCategoryResponseDTO = APIResponseDTO<{ categories: Category[] }>;
export type UpdateCategoryResponseDTO = APIResponseDTO<{ category: Category }>;
