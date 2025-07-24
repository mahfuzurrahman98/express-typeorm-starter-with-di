import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    @Column({ type: 'uuid' })
    categoryId: string;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}