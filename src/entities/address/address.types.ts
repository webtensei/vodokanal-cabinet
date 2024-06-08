import { z } from 'zod';
import { AddressDtoSchema } from '@entities/address/address.contracts';
import { KnownStreetResponse } from '@entities/user/user.contracts';

export type Address = z.infer<typeof AddressDtoSchema>;

export type KnownStreet = z.infer<typeof KnownStreetResponse>;

export type FindAddressDto = z.infer<typeof KnownStreetResponse>;