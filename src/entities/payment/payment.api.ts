import { PaymentsByAddress } from '@entities/payment/payment.types';
import { authorizationHeader } from '@entities/session/session.model';
import { createApiRequestWithRefresh } from '@shared/lib/fetch';

export async function getPaymentsByAddress( addressId:string, page:number, pageSize:number ): Promise<PaymentsByAddress> {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/payment/${addressId}?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      query:{ page, pageSize },
      headers: authorizationHeader(),
    },
  });
}