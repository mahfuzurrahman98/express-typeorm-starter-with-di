import { Repository } from 'typeorm';
import { AppDataSource } from '@/app/data-source';
import { Post } from '@/app/entities/post.entity';

export class PostRepository extends Repository<Post> {
    constructor() {
        super(Post, AppDataSource.getInstance().manager);
    }
}
