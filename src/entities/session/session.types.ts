import { z } from 'zod';
import { LoginResponse, LoginUserDtoSchema, RegisterUserDtoSchema } from '@/entities/session/session.contracts';

export type TLoginUserDto = z.infer<typeof LoginUserDtoSchema>;
export type TRegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;

export type TSession = z.infer<typeof LoginResponse>;
