import { UserRole, UserStatus } from '@/app/enums/user.enum';
import { UserSettings } from '@/app/interfaces/user.interface';

export interface ReqUserCompany {
    id: string;
    name: string;
    slug: string;
}

export interface RequestUser {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    systemRole: UserRole;
    designation?: string;
    avatar?: string;
    company?: ReqUserCompany;
    status: UserStatus;
    settings?: UserSettings;
}

export interface UserWithCompany {
    id: string;
    email: string;
    company: ReqUserCompany;
}

export interface TokenPayload {
    user: RequestUser;
    iat: number;
    exp: number;
}
