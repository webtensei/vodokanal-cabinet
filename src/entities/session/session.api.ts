import { LoginResponse } from '@entities/session/session.contracts';
import { mapUser } from '@entities/session/session.lib';
import { authorizationHeader } from '@entities/session/session.model';
import { TLoginUserDto } from '@entities/session/session.types';
import { createApiRequestWithRefresh, createJsonMutation } from '@shared/lib/fetch';
import { zodContract } from '@shared/lib/zod';

export async function loginUserMutation(params: { user: TLoginUserDto }) {
  return createJsonMutation({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/auth/login`,
      method: 'POST',
      body: JSON.stringify({ ...params.user }),
    },
    response: {
      contract: zodContract(LoginResponse),
      mapData: mapUser,
    },
  });
}
export async function loginHistory() {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/auth/login-history`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}
export async function authenticatedDevices() {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/auth/authenticated-devices`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}
export async function logoutUser() {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/auth/logout`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}
