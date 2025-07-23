import { RequestUser } from '@/app/interfaces/auth.interface';
import { signinSchema } from '@/app/schemas/auth.schema';
import { infer as zInfer } from 'zod';
import { ApiResponseDTO } from '@/app/dtos/common.dto';

export type SigninRequestDTO = zInfer<typeof signinSchema>;

export interface SigninResponseDTO
    extends ApiResponseDTO<{
        accessToken: string;
        user: RequestUser;
    }> {}
