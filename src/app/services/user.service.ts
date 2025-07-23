import { CustomError } from '@/utils/custom-error';
import { RequestUser } from '@/app/interfaces/auth.interface';
import { appDataSource } from '@/app/data-source';
import { UserProfileSettingsRequestDTO } from '@/app/dtos/user.dto';
import { UserSettings } from '@/app/interfaces/user.interface';
import { autoInjectable } from 'tsyringe';
import { UserRepository } from '@/app/repositories/user.repository';

@autoInjectable()
export class UserService {
    private userRepository: UserRepository;

    /**
     * Constructor for UserService.
     *
     * @param {UserRepository} userRepository - The user repository
     */
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Gets a user by ID.
     *
     * @param {string} id - The user ID
     * @returns {Promise<RequestUser | null>} The user
     */
    async getUserById(id: string): Promise<RequestUser | null> {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
            });
            if (!user) {
                return null;
            }
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName || '',
                lastName: user.lastName || undefined,
                systemRole: user.systemRole,
                status: user.status,
                settings: user.settings || undefined,
            } as RequestUser;
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(500, `[userService_getUserById]: ${error.message}`);
        }
    }

    /**
     * Gets a user by email.
     *
     * @param {string} email - The user email
     * @returns {Promise<RequestUser | null>} The user
     */
    async getUserByEmail(email: string): Promise<RequestUser | null> {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                return null;
            }
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName || '',
                lastName: user.lastName || undefined,
                systemRole: user.systemRole,
                status: user.status,
                settings: user.settings || undefined,
            } as RequestUser;
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(500, `[userService_getUserByEmail]: ${error.message}`);
        }
    }

    /**
     * Gets a user profile.
     *
     * @param {Object} params - The parameters for the getUserProfile operation
     * @param {RequestUser} params.currentUser - The current user
     * @param {string} params.id - The user ID
     * @returns {Promise<UserProfileSettingsRequestDTO>} The user profile
     */
    async getUserProfile({
        currentUser,
        id,
    }: {
        currentUser: RequestUser;
        id: string;
    }): Promise<UserProfileSettingsRequestDTO> {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
            });

            if (!user) {
                throw new CustomError(404, 'User not found');
            }

            let userSettings: UserSettings = {
                timezone: '',
            };
            const dbSettings = user.settings;
            if (dbSettings) {
                userSettings = {
                    timezone: dbSettings.timezone,
                };
            }

            const profile: UserProfileSettingsRequestDTO = {
                firstName: user.firstName || '',
                lastName: user.lastName || undefined,
                settings: userSettings,
            };

            return profile;
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(500, `[userService_getUserProfile]: ${error.message}`);
        }
    }

    /**
     * Updates a user profile.
     *
     * @param {Object} params - The parameters for the updateUserProfile operation
     * @param {RequestUser} params.currentUser - The current user
     * @param {string} params.id - The user ID
     * @param {UserProfileSettingsRequestDTO} params.data - The user profile data
     * @returns {Promise<UserProfileSettingsRequestDTO>} The updated user profile
     */
    async updateUserProfile(
        currentUser: RequestUser,
        id: string,
        data: UserProfileSettingsRequestDTO,
    ): Promise<UserProfileSettingsRequestDTO> {
        const queryRunner = appDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const inputData = data as UserProfileSettingsRequestDTO;
            // Get user with relations
            const user = await this.userRepository.findOne({
                where: { id },
            });

            if (!user) {
                throw new CustomError(404, 'User not found');
            }

            // Update user fields
            user.firstName = inputData.firstName;
            user.lastName = inputData.lastName || null;
            user.settings = inputData.settings;
            await queryRunner.manager.save(user);

            await queryRunner.commitTransaction();

            return data;
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw error instanceof CustomError
                ? error
                : new CustomError(500, `[userService_updateUserProfile]: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }
}
