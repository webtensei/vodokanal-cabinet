import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { getMetersList, sendIndications } from '@entities/meter/meter.api';
import { GenericError } from '@shared/lib/fetch';


export const keys = {
  root: () => ['meter'],
  addressMetersList: (addressId:string) => [...keys.root(), 'addressMetersList', addressId] as const,
  sendIndications: () => [...keys.root(), 'sendIndications'] as const,
};

export function useAddressMetersList(addressId:string) {

  return useQuery({
    queryKey: keys.addressMetersList(addressId),
    queryFn: ()=>getMetersList({ addressId }),
    enabled: false,
    placeholderData: keepPreviousData,

  });
}

export function useSendIndicationsMutation() {

  return useMutation({
    mutationKey: keys.sendIndications(),
    mutationFn: sendIndications,
    onError: (error: GenericError<any>) => error, 
  });
}
