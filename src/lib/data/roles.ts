import { UserRole } from '@/app/enums/user.enum';

// ADMIN > VENDOR > MANAGER > MEMBER
export const rolePriority: Record<UserRole, number> = {
    [UserRole.ADMIN]: 100,
    [UserRole.VENDOR]: 90,
    [UserRole.MANAGER]: 80,
    [UserRole.MEMBER]: 70,
    [UserRole.GUEST]: 60,
};
