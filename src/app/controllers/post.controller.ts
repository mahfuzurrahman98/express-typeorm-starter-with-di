import { NextFunction, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { PostService } from '@/app/services/post.service';
import {
    CreatePostRequestDTO,
    CreatePostResponseDTO,
    ListPostResponseDTO,
    RetrievePostResponseDTO,
    UpdatePostRequestDTO,
    UpdatePostResponseDTO,
} from '@/app/dtos/post.dto';

import { createPostSchema, updatePostSchema } from '@/app/schemas/post.schema';
import { formatError } from '@/utils/helpers/error-formatter';
import { RequestUser } from '@/app/interfaces/auth.interface';
import { PostListQueryParams, PostWithDetails } from '@/app/interfaces/post.interface';

@autoInjectable()
export class PostController {
    constructor(private postService: PostService) {}

    create = async (
        request: Request<{}, {}, CreatePostRequestDTO>,
        response: Response<CreatePostResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const user = request.user as RequestUser;
            const data: CreatePostRequestDTO = createPostSchema.parse(request.body);
            const post = await this.postService.createPost({ user, data });
            const formattedPost: PostWithDetails = {
                id: post.id,
                title: post.title,
                content: post.content,
                tags: post.tags,
                category: {
                    id: post.category.id,
                    name: post.category.name,
                },
                user: {
                    id: post.user.id,
                    email: post.user.email,
                    firstName: post.user.firstName,
                    lastName: post.user.lastName || undefined,
                },
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
            response
                .status(201)
                .json({ message: 'Post created successfully', data: { post: formattedPost } });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    retrieve = async (
        request: Request<{ id: string }>,
        response: Response<RetrievePostResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const user = request.user as RequestUser;
            const { id } = request.params;
            const post = await this.postService.getPostById({ user, id });
            response.status(200).json({ message: 'Post retrieved successfully', data: { post } });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    list = async (
        request: Request<{}, {}, {}, PostListQueryParams>,
        response: Response<ListPostResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const user = request.user as RequestUser;
            const { posts, meta } = await this.postService.getAllPosts({
                user,
                queryParams: request.query,
            });

            response
                .status(200)
                .json({ message: 'Posts retrieved successfully', data: { posts, meta } });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    update = async (
        request: Request<{ id: string }, {}, UpdatePostRequestDTO>,
        response: Response<UpdatePostResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const user = request.user as RequestUser;
            const { id } = request.params;
            const data: UpdatePostRequestDTO = updatePostSchema.parse(request.body);
            const post = await this.postService.updatePost({ user, id, data });
            response.status(200).json({ message: 'Post updated successfully', data: { post } });
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
            const user = request.user as RequestUser;
            const { id } = request.params;
            await this.postService.deletePost({ user, id });
            response.status(200).json({ message: 'Post deleted successfully' });
        } catch (error: any) {
            next(formatError(error));
        }
    };
}
