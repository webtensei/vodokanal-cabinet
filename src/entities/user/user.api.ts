import { authorizationHeader } from '@entities/session/session.model';
import { createApiRequestWithRefresh } from '@shared/lib/fetch';

export async function fetchCurrentUser(params: { username: number }) {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/user/${params.username}`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}
