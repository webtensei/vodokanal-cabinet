import { z } from 'zod';

export const Payment = z.object({
  id: z.string(),
  username: z.number(),
  address: z.string(),
  services_list: z.array(z.string()),
  payments_list: z.array(z.string()),
  total_amount: z.string(),
  comission: z.string(),
  status: z.enum(['pending', 'canceled', 'waiting_for_capture', 'succeeded']),
  created_at: z.date(),
});
export const PaymentsByAddressResponse = z.object({
  data: z.array(Payment || z.any()),
  meta: z.object({
    total: z.number(),
    lastPage:  z.number(),
    currentPage:  z.number(),
    perPage:  z.number(),
    prev:  z.number().nullable(),
    next:  z.number().nullable(),
  }),
});