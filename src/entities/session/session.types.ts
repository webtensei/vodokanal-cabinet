import { z } from 'zod';
import {
  AuthenticatedDevicesResponse,
  LoginHistoryResponse,
  LoginResponse,
  LoginUserDtoSchema,
  RegisterUserDtoSchema,
} from '@/entities/session/session.contracts';

export type TLoginUserDto = z.infer<typeof LoginUserDtoSchema>;
export type TRegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;

export type TSession = z.infer<typeof LoginResponse>;
export type LoginHistory = z.infer<typeof LoginHistoryResponse>;
export type AuthenticatedDevices = z.infer<typeof AuthenticatedDevicesResponse>;