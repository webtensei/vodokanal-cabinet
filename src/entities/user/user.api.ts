import { authorizationHeader } from '@entities/session/session.model';
import { createApiRequestWithRefresh, createJsonMutation } from '@shared/lib/fetch';

export async function fetchCurrentUser(params: { username: number }) {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/user/${params.username}`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}

export async function changePassword(params: { username: number, password:string, newPassword:string }) {
  return createJsonMutation({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/user/${params.username}/change/password`,
      method: 'PATCH',
      body: JSON.stringify({ ...params }),
      headers: authorizationHeader(),
    },
  });
}