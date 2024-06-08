import { z } from 'zod';
import { PhoneVerificationDtoSchema } from '@entities/contacts/contacts.contracts';

export type TSendPhoneVerification = z.infer<typeof PhoneVerificationDtoSchema>;
