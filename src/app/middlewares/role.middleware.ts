import { NextFunction, Request, Response } from 'express';
import { RequestUser } from '@/app/interfaces/auth.interface';
import { UserRole } from '@/app/enums/user.enums';
import { CustomError } from '@/utils/custom-error';

/**
 * Middleware to require a specific system role
 * @param allowedRoles
 */
export function requireSystemRole(allowedRoles: string | string[]) {
    if (!Array.isArray(allowedRoles)) {
        allowedRoles = [allowedRoles];
    }
    return (request: Request, response: Response, next: NextFunction) => {
        // check for invalid role, allowedRoles should only contain valid user roles from UserRole enum
        const validUserRoles: string[] = Object.values(UserRole);
        allowedRoles.forEach((allowedRole: string) => {
            if (!validUserRoles.includes(allowedRole)) {
                throw new CustomError(400, 'Invalid role');
            }
        });

        const user: RequestUser | undefined = request.user;

        if (!user) {
            throw new CustomError(401, 'Unauthorizedddxxx');
        }

        if (!validUserRoles.includes(user.systemRole)) {
            throw new CustomError(403, 'Forbidden');
        }

        // Todo: check for permissions

        next();
    };
}
