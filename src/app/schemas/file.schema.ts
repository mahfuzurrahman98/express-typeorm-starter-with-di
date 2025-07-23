import {
    ACCEPTED_IMAGE_TYPES,
    ACCEPTED_FILE_MIME_TYPES,
    TEXT_BASED_MIME_TYPES,
} from '@/lib/data/accepted-file-types';
import { object, string, number, array } from 'zod';

export const fileSchema = object({
    mimetype: string().refine(
        (value) => {
            return (
                ACCEPTED_IMAGE_TYPES.includes(value) ||
                ACCEPTED_FILE_MIME_TYPES.includes(value) ||
                TEXT_BASED_MIME_TYPES.includes(value)
            );
        },
        {
            message: 'Invalid file type.',
        },
    ),
    size: number().max(5 * 1024 * 1024, {
        message: 'File size exceeds the 5MB limit.',
    }),
});

export const filesArraySchema = array(fileSchema)
    .min(1, { message: 'At least one file must be uploaded.' })
    .max(10, { message: 'You can upload up to 10 files at once.' });
