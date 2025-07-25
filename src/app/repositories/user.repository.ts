import { Repository } from 'typeorm';
import { AppDataSource } from '@/app/data-source';
import { User } from '@/app/entities/user.entity';

export class UserRepository extends Repository<User> {
    constructor() {
        super(User, AppDataSource.getInstance().manager);
    }
}
