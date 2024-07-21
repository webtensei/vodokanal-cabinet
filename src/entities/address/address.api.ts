import { FindAddressResponse } from '@entities/address/address.contracts.ts';
import { FindAddressDto } from '@entities/address/address.types';
import { createApiRequest, createJsonMutation } from '@shared/lib/fetch';
import { zodContract } from '@shared/lib/zod';

export async function fetchKnownStreets() {
  return createApiRequest({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/address/streets`,
      method: 'GET',
    },
  });
}
export async function findAddress(params: { address: FindAddressDto }) {
  return createJsonMutation({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/auth/login`,
      method: 'POST',
      body: JSON.stringify({ ...params.address }),
    },
    response: {
      contract: zodContract(FindAddressResponse),
    },
  });
}