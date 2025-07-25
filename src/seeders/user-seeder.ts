import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from the .env file in the project root
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
config({ path: envPath });

// Log the DATABASE_URL to debug (remove sensitive info before committing)
console.log('Database URL is set:', process.env.DATABASE_URL);

// Import other dependencies after environment variables are loaded
import { AppDataSource } from '@/app/data-source';
import { User } from '@/app/entities/user.entity';
import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import { UserRole, UserStatus } from '@/app/enums/user.enum';

const seedUser = async () => {
    const appDataSource = AppDataSource.getInstance();
    try {
        // Initialize the database connection
        await appDataSource.initialize();
        await appDataSource.query('SET TIME ZONE UTC');
        console.log('Database connection initialized successfully');

        // Create a single query runner for all operations
        const queryRunner = appDataSource.createQueryRunner();
        await queryRunner.connect();

        // Create user
        const user = new User();
        user.id = faker.string.uuid();
        user.firstName = 'Towfique';
        user.lastName = 'Chowdhury';
        user.email = 'user@test.io';
        user.password = await hash('Asdf@123#', 10);
        user.systemRole = UserRole.USER;
        user.status = UserStatus.ACTIVE;
        user.createdAt = new Date();
        user.updatedAt = new Date();
        await queryRunner.manager.save(user);

        // Release the query runner when all operations are done
        await queryRunner.release();
        console.log('✅ Admin user seeded successfully');
    } catch (error: any) {
        // Handle any errors that occur during initialization
        console.error('Failed to initialize database connection:', error);
        throw error;
    } finally {
        // Close the database connection when everything is done
        if (appDataSource.isInitialized) {
            await appDataSource.destroy();
            console.log('Database connection closed');
        }
    }
};

// seedAdminUser().catch((err) => {
//     console.error('❌ Error seeding admin user:', err);
// });
