import { z } from 'zod';

export const AddressDtoSchema = z.object({
  street: z.string().min(4, 'Требуется ввести название улицы'),
  house: z.string().min(1, 'Требуется ввести номер дома'),
  apartment: z.string().optional().or(z.literal('')),
});
