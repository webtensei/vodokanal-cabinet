import { z } from 'zod';

export const AddressDtoSchema = z.object({
  id: z.string(),
  username: z.string().min(8, 'Длинна логина должна быть от 8 символов'),
  street: z.string().min(4, 'Требуется ввести название улицы'),
  house: z.string().min(1, 'Требуется ввести номер дома'),
  apartment: z.string().optional().or(z.literal('')),
  type: z.enum(['CITIZEN', 'BUSINESS']),
  system_id: z.string().min(1, 'Не получен system_id'),
});


export const FindAddressDtoSchema = z.object({
  street: z.string().min(4, 'Требуется ввести название улицы'),
  house: z.string().min(1, 'Требуется ввести номер дома'),
  apartment: z.string().optional().or(z.literal('')),
  type: z.enum(['CITIZEN', 'BUSINESS']),
});