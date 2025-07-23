import { UserRole } from '@/app/enums/user.enums';
import { rolePriority } from '@/lib/data/roles';

export const isAllowedToInvite = (systemRole: UserRole, inviteeRole: UserRole): boolean => {
    // systemRole should be higher than inviteeRole
    return rolePriority[systemRole] > rolePriority[inviteeRole];
};
