import { User } from '@/app/entities/user.entity';

export interface PostWithDetails {
    id: string;
    title: string;
    content: string;
    tags: string[];
    categoryId: string;
    userId: string;
    category: {
        id: string;
        name: string;
    };
    user: User;
    createdAt: Date;
    updatedAt: Date;
}