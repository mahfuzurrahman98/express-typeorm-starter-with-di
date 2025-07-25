import { UserRole } from '@/app/enums/user.enum';

// ADMIN > USER > GUEST
export const rolePriority: Record<UserRole, number> = {
    [UserRole.ADMIN]: 100,
    [UserRole.USER]: 80,
    [UserRole.GUEST]: 60,
};
