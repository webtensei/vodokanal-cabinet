import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { addAddress, fetchKnownStreets, findAddress, getServicesList } from '@entities/address/address.api';
import { KnownStreet } from '@entities/address/address.types';
import { GenericError } from '@shared/lib/fetch';
import { queryClient } from '@shared/lib/react-query';

const keys = {
  root: () => ['address'],
  cityStreets: () => [...keys.root(), 'cityStreets'] as const,
  findAddress: () => [...keys.root(), 'findAddress'] as const,
  addAddress: () => [...keys.root(), 'addAddress'] as const,
  servicesList: (addressId:string) => [...keys.root(), 'servicesList', addressId] as const,
};
export const streetsService = {
  queryKey: () => keys.cityStreets(),

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
export function useCityStreets() {

  return useQuery({
    queryKey: keys.cityStreets(),
    queryFn: fetchKnownStreets,
  });
}



export function useFindAddress() {

  return useMutation({
    mutationKey: keys.findAddress(),
    mutationFn: findAddress,
    onError: (error: GenericError<any>) => error,
  });
}

export function useAddAddress() {

  return useMutation({
    mutationKey: keys.addAddress(),
    mutationFn: addAddress,
    onError: (error: GenericError<any>) => error,
  });
}

export function useServices(addressId:string) {

  return useQuery({
    queryKey: keys.servicesList(addressId),
    queryFn: ()=>getServicesList({ addressId }),
    enabled: false,
    placeholderData: keepPreviousData,

  });
}
