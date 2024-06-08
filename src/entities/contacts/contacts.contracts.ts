import { z } from 'zod';

export const PhoneVerificationDtoSchema = z.object({
  username: z
    .string()
    .refine((value) => (value.length === 8 || value.length === 12) && Number(value), {
      message: 'Длинна должна быть 8 или 12 цифр',
    })
    .transform(Number),
  type: z.enum(['phone', 'email']),
  code: z.string().min(4).max(4),
});
