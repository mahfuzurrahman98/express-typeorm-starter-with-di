import { NextFunction, Request, Response } from 'express';
import { TokenService } from '@/app/services/token.service';
import { appDataSource } from '@/app/data-source';
import { RequestUser, TokenPayload } from '@/app/interfaces/auth.interface';
import { User } from '@/app/entities/user.entity';
import { UserService } from '@/app/services/user.service';
import { CustomError } from '@/utils/custom-error';
import { UserStatus } from '@/app/enums/user.enum';

/**
 * Middleware to attach user to request
 * @param request
 * @param response
 * @param next
 */
export async function attachUser(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    const tokenService = new TokenService();

    let token: string =
        (request.headers.authorization as string) ||
        (request.headers.Authorization as string) ||
        '';

    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    if (!token) {
        request.user = undefined;
        next();
    }

    try {
        const decodedTokenPayload: TokenPayload = tokenService.decodeAccessToken(token);

        if (!decodedTokenPayload.user) {
            next(new CustomError(401, 'Unauthorized 11'));
        }

        const userService = new UserService(appDataSource.getRepository<User>(User));
        const user: RequestUser | null = await userService.getUserById(decodedTokenPayload.user.id);

        request.user = user || undefined;
        next();
    } catch (error: any) {
        request.user = undefined;
        next();
    }
}

/**
 * Middleware to require authentication
 * @param request
 * @param response
 * @param next
 */
export async function requireAuth(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    const tokenService = new TokenService();

    let token: string =
        (request.headers.authorization as string) ||
        (request.headers.Authorization as string) ||
        '';

    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    if (!token) {
        next(new CustomError(401, 'Unauthorized22 '));
    }

    try {
        const decodedTokenPayload: TokenPayload = tokenService.decodeAccessToken(token);

        if (!decodedTokenPayload.user) {
            throw new CustomError(401, 'Unauthorized 33');
        }

        const userService = new UserService(appDataSource.getRepository<User>(User));
        const user: RequestUser | null = await userService.getUserById(decodedTokenPayload.user.id);

        if (!user) {
            throw new CustomError(401, 'Unauthorized 55');
        }

        request.user = user;
        next();
    } catch (error: any) {
        next(new CustomError(401, 'Unauthorized 44:' + error.message));
    }
}

/**
 * Middleware to require active user
 * @param request
 * @param response
 * @param next
 */
export async function requireActiveUser(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    const user: RequestUser | undefined = request.user;

    if (!user) {
        next(new CustomError(401, 'Unauthorized'));
    } else if (user.status !== UserStatus.ACTIVE) {
        next(
            new CustomError(
                403,
                `Your account is ${
                    user.status === UserStatus.INACTIVE ? 'deactivated' : 'suspended'
                }`,
            ),
        );
    } else {
        next();
    }
}
