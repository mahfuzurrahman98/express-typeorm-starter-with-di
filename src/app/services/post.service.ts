import { autoInjectable } from 'tsyringe';
import { RequestUser } from '@/app/interfaces/auth.interface';
import { PostRepository } from '@/app/repositories/post.repository';
import { CreatePostRequestDTO, UpdatePostRequestDTO } from '@/app/dtos/post.dto';
import { Post } from '@/app/entities/post.entity';
import { CustomError } from '@/utils/custom-error';
import { PostListQueryParams, PostList, PostWithDetails } from '@/app/interfaces/post.interface';
import { CursorPaginationMeta } from '@/app/interfaces/common';

@autoInjectable()
export class PostService {
    constructor(private postRepository: PostRepository) {}

    async createPost({
        user,
        data,
    }: {
        user: RequestUser;
        data: CreatePostRequestDTO;
    }): Promise<Post> {
        try {
            const postEntity: Post = this.postRepository.create({ ...data, userId: user.id });
            await this.postRepository.save(postEntity);

            const post = await this.postRepository.findOne({
                where: { id: postEntity.id },
                relations: ['category'],
            });

            return post!;
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }

    async getPostById({ user, id }: { user: RequestUser; id: string }): Promise<PostWithDetails> {
        try {
            const post: Post | null = await this.postRepository.findOne({
                where: { id },
                relations: ['category'],
            });

            if (!post) {
                throw new CustomError(404, 'Post not found');
            }

            return {
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
            } as PostWithDetails;
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }

    async getAllPosts({
        user,
        queryParams,
    }: {
        user: RequestUser;
        queryParams?: PostListQueryParams;
    }): Promise<{ posts: PostList[]; meta: CursorPaginationMeta }> {
        try {
            const queryBuilder = this.postRepository
                .createQueryBuilder('post')
                .leftJoinAndSelect('post.category', 'category')
                .leftJoinAndSelect('post.user', 'user')
                .orderBy('post.createdAt', 'DESC');

            if (queryParams && queryParams.cursor) {
                const decodedCursor = Buffer.from(queryParams.cursor, 'base64').toString('ascii');
                const [timestamp, postId] = decodedCursor.split('_');

                queryBuilder.andWhere(
                    'post.createdAt < :timestamp OR (post.createdAt = :timestamp AND post.id < :postId)',
                    {
                        timestamp: new Date(parseInt(timestamp)),
                        postId,
                    },
                );
            }

            if (queryParams?.categoryId) {
                queryBuilder.andWhere('post.categoryId = :categoryId', {
                    categoryId: queryParams.categoryId,
                });
            }

            if (queryParams?.q) {
                queryBuilder.andWhere('post.title ILIKE :search OR post.content ILIKE :search', {
                    search: `%${queryParams.q}%`,
                });
            }

            if (queryParams?.userId) {
                queryBuilder.andWhere('post.userId = :userId', {
                    userId: queryParams.userId,
                });
            }

            const limit = queryParams?.limit || 10;

            const [posts, total] = await queryBuilder.take(limit).getManyAndCount();

            const meta: CursorPaginationMeta = {
                total,
                hasMore: total > limit,
                nextCursor:
                    total > limit
                        ? Buffer.from(
                              `${posts[posts.length - 1].createdAt.getTime()}_${
                                  posts[posts.length - 1].id
                              }`,
                          ).toString('base64')
                        : undefined,
            };

            const formattedPosts: PostList[] = posts.map((post) => ({
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
            }));

            return { posts: formattedPosts, meta };
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }

    async updatePost({
        user,
        id,
        data,
    }: {
        user: RequestUser;
        id: string;
        data: UpdatePostRequestDTO;
    }): Promise<PostWithDetails> {
        try {
            const existingPost = await this.postRepository.findOne({
                where: { id, userId: user.id },
            });
            if (!existingPost) {
                throw new CustomError(404, 'Post not found');
            }

            await this.postRepository.update(id, data);

            const post = await this.getPostById({ user, id });
            return post;
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }

    async deletePost({ user, id }: { user: RequestUser; id: string }): Promise<void> {
        try {
            const post = await this.postRepository.findOne({
                where: { id, userId: user.id },
            });

            if (!post) {
                throw new CustomError(404, 'Post not found');
            }

            await this.postRepository.delete(id);
        } catch (error: any) {
            throw new CustomError(500, `[PostService] ${error.message}`);
        }
    }
}
