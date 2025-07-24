import { NextFunction, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { PostService } from '@/app/services/post.service';
import { CreatePostRequestDTO, UpdatePostRequestDTO } from '@/app/dtos/post.dto';
import { APIResponseDTO } from '@/app/dtos/common.dto';
import { Post } from '@/app/entities/post.entity';

type CreatePostResponseDTO = APIResponseDTO<{ post: Post }>;
type RetrievePostResponseDTO = APIResponseDTO<{ post: Post }>;
type ListPostResponseDTO = APIResponseDTO<{ posts: Post[] }>;
type UpdatePostResponseDTO = APIResponseDTO<{ post: Post }>;
type DeletePostResponseDTO = APIResponseDTO<undefined>;
import { createPostSchema, updatePostSchema } from '@/app/schemas/post.schema';
import { formatError } from '@/utils/helpers/error-formatter';
import { RequestUser } from '@/app/interfaces/auth.interface';

@autoInjectable()
export class PostController {
    constructor(private postService: PostService) {}

    create = async (
        request: Request<{}, {}, CreatePostRequestDTO>,
        response: Response<CreatePostResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const { id } = request.user as RequestUser;
            const data: CreatePostRequestDTO = createPostSchema.parse(request.body);
            const post = await this.postService.createPost(id, data);
            response.status(201).json({ message: 'Post created successfully', data: { post } });
        } catch (error) {
            next(formatError(error));
        }
    };

    retrieve = async (
        request: Request<{ id: string }>,
        response: Response<RetrievePostResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const { id } = request.params;
            const post = await this.postService.getPostById(id);
            response.status(200).json({ message: 'Post retrieved successfully', data: { post } });
        } catch (error) {
            next(formatError(error));
        }
    };

    list = async (
        request: Request,
        response: Response<ListPostResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const posts = await this.postService.getAllPosts();
            response.status(200).json({ message: 'Posts retrieved successfully', data: { posts } });
        } catch (error) {
            next(formatError(error));
        }
    };

    update = async (
        request: Request<{ id: string }, {}, UpdatePostRequestDTO>,
        response: Response<UpdatePostResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const { id } = request.params;
            const data: UpdatePostRequestDTO = updatePostSchema.parse(request.body);
            const post = await this.postService.updatePost(id, data);
            response.status(200).json({ message: 'Post updated successfully', data: { post } });
        } catch (error) {
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
            await this.postService.deletePost(id);
            response.status(200).json({ message: 'Post deleted successfully' });
        } catch (error) {
            next(formatError(error));
        }
    };
}
