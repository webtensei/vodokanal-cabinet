import { z } from 'zod';
import {
  AddressDtoSchema,
  FindAddressDtoSchema,
  FindAddressFormSchema,
  FindAddressResponseZ,
  ServiceDtoSchema,
} from '@entities/address/address.contracts';
import { KnownStreetResponse } from '@entities/user/user.contracts';

export type Address = z.infer<typeof AddressDtoSchema>;

export type Service = z.infer<typeof ServiceDtoSchema>;

export type KnownStreet = z.infer<typeof KnownStreetResponse>;

export type FindAddressForm = z.infer<typeof FindAddressFormSchema>;

export type FindAddressDto = z.infer<typeof FindAddressDtoSchema>;

export type FindAddressResponse = z.infer<typeof FindAddressResponseZ>;
