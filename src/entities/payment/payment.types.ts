import { z } from 'zod';
import { PaymentsByAddressResponse } from '@entities/payment/payment.contracts';

export type PaymentsByAddress = z.infer<typeof PaymentsByAddressResponse>;

export type CreatePayment = string;