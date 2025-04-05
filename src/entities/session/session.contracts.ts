import { z } from 'zod';
import { addressContracts } from '@/entities/address';

export const LoginUserDtoSchema = z.object({
  username: z
    .string()
    .refine((value) => (value.length === 8 || value.length === 12) && Number(value), {
      message: 'Длинна должна быть 8 или 12 цифр',
    })
    .transform(Number),
  password: z.string().min(8, 'Длинна пароля должна быть от 8 символов').max(32, 'Длинна должна быть до 32 символов'),
});

export const RegisterUserDtoSchema = z
  .object({
    username: z.string().min(8, 'Длинна логина должна быть от 8 символов'),
    phone: z.string().regex(/^\+7\d{10}$/, 'Введите корректный номер телефона'),
    email: z.string().email('Введите корректную почту'),
    name: z.string().min(3, 'Требуется ввести имя').max(50, 'Слишком длинное имя, обратитесь в поддержку'),
    surname: z.string().min(3, 'Требуется ввести фамилию').max(50, 'Слишком длинная фамилия, обратитесь в поддержку'),
    patronymic: z.string().max(50, 'Слишком длинное отчество, обратитесь в поддержку').optional().or(z.literal('')),
    password: z.string().min(8, 'Длинна пароля должна быть от 8 символов').max(32, 'Длинна должна быть до 32 символов'),
    confirmPassword: z.string(),
    address: addressContracts.AddressDtoSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли должны совпадать',
    path: ['confirmPassword'],
  });

export const LoginResponse = z.object({
  accessToken: z.string(),
});

export const LoginHistoryResponse = z.object({
  id: z.string(),
  login_time: z.date(),
  user_agent: z.string(),
  ip_address: z.string(),
});

export const AuthenticatedDevicesResponse = z.object({
  id: z.string(),
  user_agent: z.string(),
  expired_in: z.date(),
});
