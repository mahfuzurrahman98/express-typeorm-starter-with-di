import { NextFunction, Request, Response } from 'express';
import { signinSchema } from '@/app/schemas/auth.schema';
import { TokenService } from '@/app/services/token.service';
import { RequestUser } from '@/app/interfaces/auth.interface';
import { CustomError } from '@/utils/custom-error';
import { cookieConfig } from '@/configs/cookie-config';
import { AuthService } from '@/app/services/auth.service';
import { autoInjectable } from 'tsyringe';
import { formatError } from '@/utils/helpers/error-formatter';
import { SigninRequestDTO, SigninResponseDTO } from '@/app/dtos/auth.dto';

@autoInjectable()
export class AuthController {
    private authService: AuthService;
    private tokenService: TokenService;

    /**
     * Constructs the AuthController with required AuthService and TokenService dependencies.
     *
     * @param authService - Service handling authentication logic
     * @param tokenService - Service handling JWT token creation/validation
     */
    constructor(authService: AuthService, tokenService: TokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }

    /**
     * Handles user sign-in.
     * Parses email and password from request, authenticates user, creates access and refresh tokens,
     * sets the refresh token as a cookie, and returns access token and user info in response.
     *
     * @param request - Express request with SigninRequestDTO body
     * @param response - Express response returning SigninResponseDTO
     * @param next - Express next middleware function
     * @returns 200 with tokens and user on success, calls next with error on failure
     */
    signin = async (
        request: Request<{}, {}, SigninRequestDTO>,
        response: Response<SigninResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const { email, password } = signinSchema.parse(request.body);

            const reqUser: RequestUser = await this.authService.signin({ email, password });

            const accessToken = this.tokenService.createAccessToken(reqUser);
            const refreshToken = this.tokenService.createRefreshToken(reqUser);

            response.cookie('refreshToken', refreshToken, cookieConfig);

            response.status(200).json({
                message: 'Signin successful',
                data: { accessToken, user: reqUser },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Issues a new access token using a valid refresh token from cookies.
     * Throws error if no refresh token is provided. Returns new access token and user info in response.
     *
     * @param request - Express request with cookies
     * @param response - Express response returning SigninResponseDTO
     * @param next - Express next middleware function
     * @returns 200 with new token and user on success, calls next with error on failure
     */
    refreshToken = async (
        request: Request,
        response: Response<SigninResponseDTO>,
        next: NextFunction,
    ) => {
        try {
            const refreshToken = request.cookies.refreshToken;

            if (!refreshToken) {
                throw new CustomError(400, 'No refresh token provided');
            }

            const reqUser: RequestUser = await this.authService!.refreshToken(refreshToken);

            const accessToken = this.tokenService.createAccessToken(reqUser);
            response.status(200).json({
                message: 'Refresh token successful',
                data: { accessToken, user: reqUser },
            });
        } catch (error: any) {
            next(formatError(error));
        }
    };

    /**
     * Signs out the user by clearing the refresh token cookie.
     * Returns a success message on completion.
     *
     * @param request - Express request
     * @param response - Express response
     * @param next - Express next middleware function
     * @returns 200 with logout confirmation, calls next with error on failure
     */
    signout = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                path: '/',
            });

            response.status(200).json({ message: 'Logged out successfully' });
        } catch (error: any) {
            next(formatError(error));
        }
    };
}
