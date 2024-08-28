import { AddressDtoSchema, FindAddressResponseZ } from '@entities/address/address.contracts';
import { Address, FindAddressDto, Service } from '@entities/address/address.types';
import { authorizationHeader } from '@entities/session/session.model';
import { createApiRequest, createApiRequestWithRefresh, createJsonMutation } from '@shared/lib/fetch';
import { zodContract } from '@shared/lib/zod';

export async function fetchKnownStreets():Promise<{ name:string, grad_id:string }[]> {
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
      url: `${import.meta.env.VITE_API_SERVER_URL}/address/checkAddress`,
      method: 'POST',
      body: JSON.stringify({ ...params.address }),
    },
    response: {
      contract: zodContract(FindAddressResponseZ),
    },
  });
}

export async function addAddress(params: { address: Omit<Address, 'id'> }) {
  return createJsonMutation({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/address/`,
      method: 'POST',
      body: JSON.stringify({ ...params.address }),
      headers: authorizationHeader(),
    },
    response: {
      contract: zodContract(AddressDtoSchema),
    },
  });
}

export async function getServicesList({ addressId }: { addressId: string }):Promise<Service[]> {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/address/${addressId}/services`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}
