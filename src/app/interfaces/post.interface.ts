import { infer as zInfer } from 'zod';
import { postListQueryParamsSchema } from '@/app/schemas/post.schema';

export interface PostList {
    id: string;
    title: string;
    tags: string[];
    category: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
    };
}

export interface PostWithDetails {
    id: string;
    title: string;
    content: string;
    tags: string[];
    category: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface PostListQueryParams extends zInfer<typeof postListQueryParamsSchema> {}