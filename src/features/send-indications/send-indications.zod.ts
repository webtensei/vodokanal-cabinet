import z from 'zod';

export const SendIndicationsDtoSchema = z
  .object(
    {
      addressId: z.string().min(1, 'Не установлен адрес'),
      meter: z.string().min(1, 'Счетчик должен существовать'),
      charge: z.string().min(1, 'Показания должны быть указаны'),
    },
  )
;

export type SendIndicationsDto = z.infer<typeof SendIndicationsDtoSchema>;