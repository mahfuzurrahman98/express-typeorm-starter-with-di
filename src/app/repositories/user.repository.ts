import { Repository } from 'typeorm';
import { appDataSource } from '@/app/data-source';
import { User } from '@/app/entities/user.entity';

export class UserRepository extends Repository<User> {
    constructor() {
        super(User, appDataSource.manager);
    }
}
