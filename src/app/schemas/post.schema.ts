import { object, string, array, nativeEnum } from 'zod';
import { PostSortBy, PostSortOrder } from '@/app/enums/post.enum';

export const createPostSchema = object({
    title: string().trim().min(1, 'Title is required'),
    content: string().min(1, 'Content is required'),
    tags: array(string().trim().min(1, 'Tag is required')).optional(),
    categoryId: string().trim().uuid('Invalid category id'),
});

export const postListQueryParamsSchema = object({
    q: string().trim().optional(),
    categoryId: string().trim().uuid('Invalid category id').optional(),
    userId: string().trim().uuid('Invalid user id').optional(),
    tags: array(string().trim()).optional(),
    myPosts: string().optional(),
    sortBy: nativeEnum(PostSortOrder).optional(),
    sortOrder: nativeEnum(PostSortBy).optional(),
    cursor: string().optional(),
    limit: string()
        .transform((val) => parseInt(val, 10))
        .optional(),
});

export const updatePostSchema = createPostSchema.partial();
