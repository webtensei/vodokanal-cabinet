import { useMutation } from '@tanstack/react-query';
import { fetchKnownStreets, findAddress } from '@entities/address/address.api';
import { KnownStreet } from '@entities/address/address.types';
import { GenericError } from '@shared/lib/fetch';
import { queryClient } from '@shared/lib/react-query';

const keys = {
  root: () => ['address'],
  knownStreets: () => [...keys.root(), 'knownStreets'] as const,
  findAddress: () => [...keys.root(), 'findAddress'] as const,
};
export const streetsService = {
  queryKey: () => keys.knownStreets(),

  getCache: () => queryClient.getQueryData<KnownStreet[]>(streetsService.queryKey()),

  setCache: (streets: KnownStreet[] | null) => queryClient.setQueryData(streetsService.queryKey(), streets),

  removeCache: () => queryClient.removeQueries({ queryKey: streetsService.queryKey() }),
};

export const findAddressService = {
  queryKey: () => keys.findAddress(),

  getCache: () => queryClient.getQueryData<KnownStreet[]>(findAddressService.queryKey()),

  setCache: (tenants: KnownStreet[] | null) => queryClient.setQueryData(findAddressService.queryKey(), tenants),

  removeCache: () => queryClient.removeQueries({ queryKey: findAddressService.queryKey() }),
};
export function useFetchKnownStreets() {

  return useMutation({
    mutationKey: keys.knownStreets(),
    mutationFn: fetchKnownStreets,
    onSuccess: async (streets) => {
      streetsService.setCache(streets);
    },
    onError: (error: GenericError<any>) => error,
  });
}

export function useFindAddress() {

  return useMutation({
    mutationKey: keys.findAddress(),
    mutationFn: findAddress,
    onSuccess: async (tenants) => {
      findAddressService.setCache(tenants);
    },
    onError: (error: GenericError<any>) => error,
  });
}