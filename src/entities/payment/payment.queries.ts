import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { getPaymentsByAddress, createPayment } from '@entities/payment/payment.api';
import { GenericError } from '@shared/lib/fetch';

const keys = {
  root: () => ['payment'],
  paymentsByAddress: (addressId: string, page:number, pageSize:number) => [...keys.root(), 'paymentsByAddress', addressId, page, pageSize] as const,
  createPayment: () => [...keys.root(), 'createPayment'] as const,
};

export function usePaymentsByAddressQuery(addressId: string, page:number = 0, pageSize:number = 10) {
  return useQuery({
    queryKey: keys.paymentsByAddress(addressId, page, pageSize),
    queryFn: () => getPaymentsByAddress(addressId, page, pageSize),
    enabled: false,
    placeholderData: keepPreviousData,

  });
}

export function useCreatePaymentMutation() {
  return useMutation({
    mutationKey: keys.createPayment(),
    mutationFn: (params: { addressId: string, services: string[], services_amount: string[], amount: string, username:number }) => createPayment(params.addressId, params.services, params.services_amount, params.amount, params.username),
    onError: (error: GenericError<any>) => error,
  });
}
