import { authorizationHeader } from '@entities/session/session.model';
import { createApiRequestWithRefresh } from '@shared/lib/fetch';

export async function createVerification({ type }: { type: 'phone' | 'email' }) {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/contacts/verify/${type}`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}

export async function sendVerificationCode({
  username,
  type,
  code,
}: {
  username: number;
  type: 'phone' | 'email';
  code: string;
}) {
  return createApiRequestWithRefresh({
    request: {
      url: `${import.meta.env.VITE_API_SERVER_URL}/contacts/verify/${username}?type=${type}&code=${code}`,
      method: 'GET',
      headers: authorizationHeader(),
    },
  });
}
