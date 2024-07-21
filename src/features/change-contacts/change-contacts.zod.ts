import z from 'zod';

export const ChangeContactsDtoSchema = z
  .object(
    {
      username: z.number(),
      phone: z.string().min(8, 'Длинна должна быть от 11 символов').max(12, 'Длинна должна быть до 12 символов'),
      email: z.string().min(4, 'Длинна должна быть от 4 символов').max(32, 'Длинна должна быть до 32 символов').email('Невалидная почта'),
    },
  );

export type ChangeContactsDto = z.infer<typeof ChangeContactsDtoSchema>;