import { NextFunction, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { formatError } from '@/utils/helpers/error-formatter';
import { RequestUser } from '@/app/interfaces/auth.interface';
import { CustomError } from '@/utils/custom-error';
import { UserService } from '@/app/services/user.service';
import { userProfileSettingsSchema } from '@/app/schemas/user.schema';
import { UserProfileResponseDTO, UserProfileSettingsRequestDTO } from '@/app/dtos/user.dto';

@autoInjectable()
export class UserController {
    private userService: UserService;
    /**
     * Constructor for UserController
     *
     * @param userService - The user service instance
     */
    constructor(userService: UserService) {
        this.userService = userService;
    }

    /**
     * Retrieves the profile of a specific user.
     *
     * @param request - Express request with user ID in params
     * @param response - Express response returning UserProfileResponseDTO
     * @param next - Express next middleware function
     * @returns 200 with user profile on success, calls next with error on failure
     */
    retrieve = async (
        request: Request<{ id: string }>,
        response: Response<UserProfileResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const { id } = request.params;

            const currentUser = request.user as RequestUser;

            if (currentUser.id !== id) {
                throw new CustomError(403, 'Forbidden');
            }

            const user = await this.userService.getUserProfile({ currentUser, id });

            response.status(200).json({
                message: 'User profile retrieved successfully',
                data: { user },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Updates the profile of a specific user.
     *
     * @param request - Express request with user ID in params and new profile settings in body
     * @param response - Express response returning UserProfileResponseDTO
     * @param next - Express next middleware function
     * @returns 200 with updated user profile on success, calls next with error on failure
     */
    update = async (
        request: Request<{ id: string }, {}, UserProfileSettingsRequestDTO>,
        response: Response<UserProfileResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const { id } = request.params;

            const currentUser = request.user as RequestUser;

            if (currentUser.id !== id) {
                throw new CustomError(403, 'Forbidden');
            }

            let data: UserProfileSettingsRequestDTO;
            data = userProfileSettingsSchema.parse(request.body);

            const user = await this.userService.updateUserProfile(currentUser, id, data);
            response.status(200).json({
                message: 'User profile updated successfully',
                data: { user },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };
}
