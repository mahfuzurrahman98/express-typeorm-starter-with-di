import { literal, object, string, type infer as zInfer } from 'zod';
import { validUrlSchema } from '@/app/schemas/valid-url.schema';
import { timeZones } from '@/lib/data/timezones';
import countries from '@/lib/data/countries.json';

const timezoneValues = timeZones.map((tz) => tz.value);
const countryNames = countries.map((country: { name: string }) => country.name);

export const baseSchema = object({
    // Basic Info
    firstName: string()
        .trim()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters'),
    lastName: string()
        .trim()
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters')
        .or(literal(''))
        .optional(),

    // Contact
    phone: string()
        .trim()
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number must be less than 20 digits')
        .or(literal(''))
        .optional(),

    // Settings
    settings: object({
        timezone: string()
            .trim()
            .refine((val) => timezoneValues.includes(val), {
                message: 'Please select a valid timezone',
            })
            .or(literal(''))
            .optional(),
    }),
});

export const userProfileSettingsSchema = baseSchema.extend({
    designation: string()
        .trim()
        .min(2, 'Designation must be at least 2 characters')
        .max(50, 'Designation must be less than 50 characters')
        .or(literal(''))
        .optional(),
});

export const vendorProfileSettingsSchema = baseSchema.extend({
    location: string()
        .min(2, 'Location must be at least 2 characters')
        .max(100, 'Location must be less than 100 characters'),
    country: string()
        .trim()
        .refine((val) => countryNames.includes(val), {
            message: 'Please select a valid country from the list',
        }),
    website: validUrlSchema.or(literal('')).optional(),
});
