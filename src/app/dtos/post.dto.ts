import { infer as zInfer } from 'zod';
import { createPostSchema, updatePostSchema } from '@/app/schemas/post.schema';
import { APIResponseDTO } from '@/app/dtos/common.dto';
import { PostList } from '@/app/interfaces/post.interface';
import { PostWithDetails } from '@/app/interfaces/post.interface';
import { CursorPaginationMeta } from '@/app/interfaces/common';

// Request DTOs
export type CreatePostRequestDTO = zInfer<typeof createPostSchema>;
export type UpdatePostRequestDTO = zInfer<typeof updatePostSchema>;

// Response DTOs
export type CreatePostResponseDTO = APIResponseDTO<{ post: PostWithDetails }>;
export type RetrievePostResponseDTO = APIResponseDTO<{ post: PostWithDetails }>;
export type ListPostResponseDTO = APIResponseDTO<{ posts: PostList[]; meta: CursorPaginationMeta }>;
export type UpdatePostResponseDTO = APIResponseDTO<{ post: PostWithDetails }>;
export type DeletePostResponseDTO = APIResponseDTO<undefined>;
