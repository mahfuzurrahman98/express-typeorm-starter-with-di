export enum UserRole {
    GUEST = 'guest',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
}

export enum UserStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

export enum UserInitiator {
    CLIENT = 'client',
    SUPPLIER = 'supplier',
}
