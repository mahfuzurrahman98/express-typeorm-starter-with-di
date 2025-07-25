import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '@/app/entities/user.entity';
import { Category } from '@/app/entities/category.entity';
import { Post } from '@/app/entities/post.entity';

config();

export class AppDataSource {
    private static instance: DataSource;

    private constructor() {}

    public static getInstance(): DataSource {
        if (!AppDataSource.instance) {
            AppDataSource.instance = new DataSource({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                synchronize: false,
                logging: false,
                entities: [User, Category, Post],
                migrations: ['src/migrations/*.ts'],
                subscribers: [],
            });
        }
        return AppDataSource.instance;
    }
}
