import z from 'zod';

export const ChangePasswordDtoSchema = z
  .object(
    {
      oldPassword: z.string().min(8, 'Длинна пароля должна быть от 8 символов').max(32, 'Длинна должна быть до 32 символов'),
      password: z.string().min(8, 'Длинна пароля должна быть от 8 символов').max(32, 'Длинна должна быть до 32 символов'),
      confirmPassword: z.string(),
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
      message: 'Пароли должны совпадать',
      path: ['confirmPassword'],
    },
  )
;

export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>;