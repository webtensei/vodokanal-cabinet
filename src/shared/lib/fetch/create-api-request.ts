import { authorizationHeader, sessionStore } from '@entities/session/session.model';
import { httpError, invalidDataError, networkError, preparationError } from './fetch.errors';
import { isHttpErrorCode } from './fetch.guards';
import { formatUrl, formatHeaders } from './fetch.lib';
import { HttpMethod, RequestBody, FetchApiRecord, GenericError } from './fetch.types';

interface ApiRequest {
  method: HttpMethod;
  body?: RequestBody;
  headers?: FetchApiRecord;
  query?: FetchApiRecord;
  credentials?: RequestCredentials;
  url: string;
}

interface ApiConfig {
  request: ApiRequest;
  abort?: AbortSignal;
}

export async function createApiRequest(config: ApiConfig) {
  const response = await fetch(formatUrl({ href: config.request.url, query: config.request.query || {} }), {
    method: config.request.method,
    headers: formatHeaders(config.request.headers || {}),
    body: config.request.body,
    signal: config?.abort,
    credentials: config.request.credentials ?? 'include',
  }).catch((error) => {
    throw networkError({
      reason: error?.message ?? null,
      response: error,
    });
  });

  if (!response.ok) {
    const fullResponse = await response.text().catch(() => null);
    const parsedResponse = fullResponse ? JSON.parse(fullResponse) : [];
    if (response.status === 400) {
      throw invalidDataError({ validationErrors: parsedResponse?.errors || [], response: parsedResponse });
    }
    throw httpError({
      status: response.status,
      statusText: response.statusText,
      response: parsedResponse,
    });
  }

  const clonedResponse = response.clone();

  const data = !response.body
    ? null
    : await response.json().catch(async (error) => {
        throw preparationError({
          // мб тут будет баг и надо сначала .text парсить
          response: await clonedResponse.json(),
          reason: error?.message ?? null,
        });
      });

  return data;
}

export async function createApiRequestWithRefresh(config: ApiConfig) {
  try {
    return await createApiRequest(config);
  } catch (error) {
    const unauthorizedCode = isHttpErrorCode(401);
    if (unauthorizedCode(error as GenericError<any>)) {
      return await createApiRequest({
        request: {
          url: `${import.meta.env.VITE_API_SERVER_URL}/auth/refresh`,
          method: 'GET',
          credentials: 'include',
        },
      })
        .then(async (response) => {
          if (response.accessToken) {
            sessionStore.getState().updateToken(response.accessToken);
            const { request, abort } = { ...config };
            return createApiRequest({ request: { ...request, headers: authorizationHeader() }, abort });
          }
        })
        .catch((e) => {
          throw httpError({
            status: e.status,
            statusText: e.statusText,
            response: e.response,
          });
        });
    }
  }
}
