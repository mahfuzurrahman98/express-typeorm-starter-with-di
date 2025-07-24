import { infer as zInfer } from 'zod';
import { createCategorySchema, updateCategorySchema } from '@/app/schemas/category.schema';

export type CreateCategoryRequestDTO = zInfer<typeof createCategorySchema>;
export type UpdateCategoryRequestDTO = zInfer<typeof updateCategorySchema>;
