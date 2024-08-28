import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPaymentsByAddress } from '@entities/payment/payment.api';

const keys = {
  root: () => ['payment'],
  paymentsByAddress: (addressId: string, page:number, pageSize:number) => [...keys.root(), 'paymentsByAddress', addressId, page, pageSize] as const,
};

export function usePaymentsByAddressQuery(addressId: string, page:number = 0, pageSize:number = 10) {
  return useQuery({
    queryKey: keys.paymentsByAddress(addressId, page, pageSize),
    queryFn: () => getPaymentsByAddress(addressId, page, pageSize),
    enabled: false,
    placeholderData: keepPreviousData,

  });
}