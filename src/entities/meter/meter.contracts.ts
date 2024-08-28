import { z } from 'zod';

export const MeterByCitizenAddressEntity = z.object({
  id: z.number(),
  service_id: z.string(),
  allowed: z.string(),
  group: z.string(),
  name: z.string(),
  num: z.string(),
  date: z.string(),
  ind: z.string(),
  outbalance: z.string(),
  capacity: z.string(),
  precision: z.string(),
  rate: z.string(),
  unitname: z.string(),
  limit:z.string(),
  sewerage: z.string(),
  verify_date:z.string(),
  status_id: z.string(),
  status: z.string(),
});
