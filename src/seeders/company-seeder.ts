import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from the .env file in the project root
const envPath = path.resolve(__dirname, '@/app/enums/.env');
console.log('Loading .env from:', envPath);
config({ path: envPath });

// Log the DATABASE_URL to debug (remove sensitive info before committing)
console.log('Database URL is set:', process.env.DATABASE_URL);

// Import other dependencies after environment variables are loaded
import { appDataSource } from '@/app/data-source';
import { User } from '@/app/entities/user.entity';
import { Company } from '@/app/entities/company.entity';
import { CompanyMembership } from '@/app/entities/company-membership.entity';
import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import { CompanyStatus } from '@/app/enums/company.enums';
import { UserRole, UserStatus } from '@/app/enums/user.enums';
import countries from '@/lib/data/countries.json';

function generateSlug(companyName: string): string {
    const generatedSlug = companyName
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove special characters
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens

    return generatedSlug;
}

const countryNames: string[] = countries.map((country: any) => country.name);
const noOfRecords = 10;

// Generate a date N days ago
const getDateDaysAgo = (daysAgo: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
};

const seedAdminUser = async () => {
    try {
        // Initialize the database connection
        await appDataSource.initialize();
        await appDataSource.query('SET TIME ZONE UTC');
        console.log('Database connection initialized successfully');

        // Create a single query runner for all operations
        const queryRunner = appDataSource.createQueryRunner();
        await queryRunner.connect();

        // Create admin user
        const adminUser = new User();
        adminUser.id = faker.string.uuid();
        adminUser.firstName = 'Towfique';
        adminUser.lastName = 'Chowdhury';
        adminUser.email = 'admin@intoproject.io';
        adminUser.password = await hash('Asdf@123#', 10);
        adminUser.systemRole = UserRole.ADMIN;
        adminUser.status = UserStatus.ACTIVE;
        adminUser.createdAt = new Date();
        adminUser.updatedAt = new Date();
        await queryRunner.manager.save(adminUser);

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

const seedCompanies = async () => {
    try {
        // Initialize the database connection
        await appDataSource.initialize();
        await appDataSource.query('SET TIME ZONE UTC');
        console.log('Database connection initialized successfully');

        // Create a single query runner for all operations
        const queryRunner = appDataSource.createQueryRunner();
        await queryRunner.connect();

        // Seed noOfRecords companies and users
        for (let i = 0; i < noOfRecords; i++) {
            try {
                // Start a new transaction for each company/user pair
                await queryRunner.startTransaction();

                // Generate a creation date for this pair (i days ago)
                const creationDate = getDateDaysAgo(i);

                // Create company
                const newCompany = new Company();
                let name = faker.company.name().slice(0, 50).replace('-', '');
                newCompany.id = faker.string.uuid();
                newCompany.name = name;
                newCompany.location = faker.location.city().slice(0, 50);
                newCompany.country = faker.helpers.arrayElement(countryNames);
                newCompany.status = CompanyStatus.ACTIVE;
                newCompany.slug = generateSlug(name);
                newCompany.createdAt = creationDate;
                newCompany.updatedAt = creationDate;
                await queryRunner.manager.save(newCompany);

                // Create user associated with the company
                const newUser = new User();
                newUser.id = faker.string.uuid();
                newUser.firstName = name;
                newUser.lastName = null;
                newUser.email = faker.internet.email().toLowerCase().slice(0, 50);
                newUser.password = await hash('Asdf@123#', 10);
                newUser.systemRole = UserRole.VENDOR;
                newUser.status = UserStatus.ACTIVE;
                newUser.createdAt = creationDate;
                newUser.updatedAt = creationDate;
                await queryRunner.manager.save(newUser);

                // Create company membership
                const newCompanyMembership = new CompanyMembership();
                newCompanyMembership.id = faker.string.uuid();
                newCompanyMembership.userId = newUser.id;
                newCompanyMembership.companyId = newCompany.id;
                newCompanyMembership.role = UserRole.VENDOR;
                await queryRunner.manager.save(newCompanyMembership);

                // Update user with company membership
                newUser.companyMembershipId = newCompanyMembership.id;
                await queryRunner.manager.save(newUser);

                // Commit the transaction
                await queryRunner.commitTransaction();
                console.log(`✅ Seeded company/user pair ${i + 1} of noOfRecords`);
            } catch (error: any) {
                // Rollback the transaction in case of error
                await queryRunner.rollbackTransaction();
                console.error(`Failed to seed company/user pair ${i + 1}:`, error);
                // Continue with the next iteration instead of throwing
                continue;
            }
        }

        // Release the query runner when all operations are done
        await queryRunner.release();
        console.log('✅ All seeding completed successfully');
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

const deleteCompanies = async () => {
    try {
        // Initialize the database connection
        await appDataSource.initialize();
        await appDataSource.query('SET TIME ZONE UTC');
        console.log('Database connection initialized successfully');

        // Create a single query runner for all operations
        const queryRunner = appDataSource.createQueryRunner();
        await queryRunner.connect();

        // Delete users first, where role is VENDOR
        await queryRunner.manager.delete(User, { role: UserRole.VENDOR });

        // Delete all companies
        await queryRunner.manager.delete(Company, {});

        // Release the query runner when all operations are done
        await queryRunner.release();
        console.log('✅ All companies deleted successfully');
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

const testQuery = async () => {
    // write a query to update all the users firstname as companies name
    // where the user systemRole = 'vendor'.
    // user have companyMembershipId
    // companyMembership have companyId
    // company have name

    const queryRunner = appDataSource.createQueryRunner();
    await queryRunner.connect();

    const users = await queryRunner.manager.find(User, {
        where: { systemRole: UserRole.VENDOR },
        relations: ['companyMembership'],
    });

    for (const user of users) {
        if (user.companyMembership) {
            const company = await queryRunner.manager.findOne(Company, {
                where: { id: user.companyMembership.companyId },
            });
            if (company) {
                user.firstName = company.name;
                await queryRunner.manager.save(user);
            }
        }
    }

    await queryRunner.release();
};

// seedAdminUser().catch((err) => {
//     console.error('❌ Error seeding admin user:', err);
// });

seedCompanies().catch((err) => {
    console.error('❌ Error seeding data:', err);
});

// deleteCompanies().catch((err) => {
//     console.error('❌ Error deleting data:', err);
// });
