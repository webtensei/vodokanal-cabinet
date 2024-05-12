import { authorizationHeader } from '@entities/session/session.model';
import { createApiRequest } from '@shared/lib/fetch/';

export async function fetchCurrentUser(params: { username: number }) {
  return createApiRequest({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/user/${params.username}`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}
