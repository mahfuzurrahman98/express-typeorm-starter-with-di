import { string } from 'zod';

export const validUrlSchema = string()
    .trim()
    .url('Link must be a valid URL')
    .startsWith('https://', 'Link must start with https://');
