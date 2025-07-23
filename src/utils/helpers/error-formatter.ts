import { ZodError } from 'zod';
import { CustomError } from '@/utils/custom-error';

export type ZodErrorType = {
    [key: string]: string;
};

export const formatZodErrors = (error: ZodError): ZodErrorType | string => {
    let errorObj: ZodErrorType = {};
    let errorString: string = 'Invalid input format';
    let isObject = false;

    if (!error.errors) {
        return errorString;
    }
    for (const err of error.errors) {
        if (err.path && err.path.length) {
            isObject = true;
            const key = err.path.join('.');
            errorObj[key] = err.message;

            errorObj = {
                ...errorObj,
                [key]: err.message,
            };
        }
    }

    return isObject ? errorObj : errorString;
};

export function formatError(error: any): CustomError {
    let statusCode: number;
    let message: string | object | ZodErrorType;

    if (error instanceof ZodError) {
        statusCode = 422;
        message = formatZodErrors(error);
    } else if (error instanceof CustomError) {
        statusCode = error.getStatusCode();
        message = error.getMessage();
    } else {
        statusCode = error.statusCode || 500;
        if (error.message && typeof error.message == 'string' && error.message.length > 0) {
            message = error.message;
        } else {
            message = 'Something went wrong';
        }
    }

    return new CustomError(statusCode, message);
}
