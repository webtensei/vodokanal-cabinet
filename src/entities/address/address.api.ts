import { createApiRequest } from '@shared/lib/fetch';

export async function fetchKnownStreets() {
  return createApiRequest({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/address/streets`,
      method: 'GET',
    },
  });
}