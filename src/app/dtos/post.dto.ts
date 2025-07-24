import { infer as zInfer } from 'zod';
import { createPostSchema, updatePostSchema } from '@/app/schemas/post.schema';

export type CreatePostRequestDTO = zInfer<typeof createPostSchema>;
export type UpdatePostRequestDTO = zInfer<typeof updatePostSchema>;
