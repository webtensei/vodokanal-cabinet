import { LoginResponse } from '@entities/session/session.contracts';
import { mapUser } from '@entities/session/session.lib';
import { TLoginUserDto } from '@entities/session/session.types';
import { createJsonMutation } from '@shared/lib/fetch';
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
