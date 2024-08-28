import { MeterByCitizenAddress } from '@entities/meter/meter.types';
import { authorizationHeader } from '@entities/session/session.model';
import { createApiRequestWithRefresh, createJsonMutation } from '@shared/lib/fetch';

export async function getMetersList({ addressId }: { addressId: string }):Promise<MeterByCitizenAddress[]> {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/address/${addressId}/meters`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}

export async function sendIndications(params:{ addressId:string, metersList:number[], chargesList:number[] }) {
  return createJsonMutation({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/address/send-indications`,
      method: 'POST',
      body: JSON.stringify({ ...params }),
      headers: authorizationHeader(),
    },
  });
}
