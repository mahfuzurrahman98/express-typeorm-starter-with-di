import { infer as zInfer } from 'zod';
import { ApiResponseDTO } from '@/app/dtos/common.dto';
import { userProfileSettingsSchema } from '@/app/schemas/user.schema';

export type UserProfileSettingsRequestDTO = zInfer<typeof userProfileSettingsSchema>;

export interface UserProfileResponseDTO
    extends ApiResponseDTO<{
        user: UserProfileSettingsRequestDTO;
    }> {}
