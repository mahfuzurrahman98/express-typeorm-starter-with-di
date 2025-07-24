import { autoInjectable } from 'tsyringe';
import { PostRepository } from '@/app/repositories/post.repository';
import { CreatePostRequestDTO, UpdatePostRequestDTO } from '@/app/dtos/post.dto';
import { Post } from '@/app/entities/post.entity';
import { CustomError } from '@/utils/custom-error';
import { RequestUser } from '@/app/interfaces/auth.interface';

@autoInjectable()
export class PostService {
    constructor(private postRepository: PostRepository) {}

    async createPost(userId: string, data: CreatePostRequestDTO): Promise<Post> {
        try {
            const post = this.postRepository.create({ ...data, userId });
            return await this.postRepository.save(post);
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }

    async getPostById(id: string): Promise<Post> {
        try {
            const post: Post | null = await this.postRepository.findOne({
                where: { id },
                relations: ['category'],
            });
            if (!post) {
                throw new CustomError(404, 'Post not found');
            }
            return post;
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }

    async getAllPosts(): Promise<Post[]> {
        try {
            return await this.postRepository.find({ relations: ['category'] });
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }

    async updatePost(id: string, data: UpdatePostRequestDTO): Promise<Post> {
        try {
            const post = await this.getPostById(id);
            if (!post) {
                throw new CustomError(404, 'Post not found');
            }
            await this.postRepository.update(id, data);
            return await this.getPostById(id);
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }

    async deletePost(id: string): Promise<void> {
        try {
            const post = await this.getPostById(id);
            if (!post) {
                throw new CustomError(404, 'Post not found');
            }
            await this.postRepository.delete(id);
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }
}
