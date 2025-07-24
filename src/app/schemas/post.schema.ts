import { object, string, array } from 'zod';

export const createPostSchema = object({
    title: string().trim().min(1, 'Title is required'),
    content: string().min(1, 'Content is required'),
    tags: array(string().trim().min(1, 'Tag is required')).optional(),
    categoryId: string().trim().uuid('Invalid category id'),
});

export const updatePostSchema = createPostSchema.partial();