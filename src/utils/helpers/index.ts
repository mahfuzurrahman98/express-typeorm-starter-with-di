import { string as zString } from 'zod';

export const isValidUUID = (uuid: string): boolean => zString().uuid().safeParse(uuid).success;
export const isValidEmail = (email: string): boolean => zString().email().safeParse(email).success;
export const generateName = (
    firstName: string | null | undefined,
    lastName: string | null | undefined,
) => {
    if (firstName == null || firstName === '') {
        firstName = '';
    }
    if (lastName == null || lastName === '') {
        lastName = '';
    }
    return (firstName + ' ' + lastName).trim();
};

export const limitString = (str: string, maxLength: number, suffix: string = '...'): string => {
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength - suffix.length).trimEnd() + suffix;
};
