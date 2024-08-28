import { z } from 'zod';
import { MeterByCitizenAddressEntity } from '@entities/meter/meter.contracts';

export type MeterByCitizenAddress = z.infer<typeof MeterByCitizenAddressEntity>;