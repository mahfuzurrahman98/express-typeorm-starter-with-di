import { object, string } from 'zod';

export const signinSchema = object({
    email: string().trim().email('Please enter a valid email'),
    password: string()
        .trim()
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must be less than 50 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%)',
        ),
});
