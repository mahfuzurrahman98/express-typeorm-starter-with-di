import { object, string } from 'zod';

export const createCategorySchema = object({
    name: string().trim().min(1, 'Name is required'),
});

export const updateCategorySchema = createCategorySchema.partial();
