import { httpError, invalidDataError, networkError, preparationError } from './fetch.errors';
import { formatUrl, formatHeaders } from './fetch.lib';
import { HttpMethod, RequestBody, FetchApiRecord } from './fetch.types';

interface ApiRequest {
  method: HttpMethod;
  body?: RequestBody;
  headers?: FetchApiRecord;
  query?: FetchApiRecord;
  url: string;
}

interface ApiConfig {
  request: ApiRequest;
  abort?: AbortSignal;
}

export async function createApiRequest(config: ApiConfig) {
  const response = await fetch(
    formatUrl({ href: config.request.url, query: config.request.query || {} }),
    {
      method: config.request.method,
      headers: formatHeaders(config.request.headers || {}),
      body: config.request.body,
      signal: config?.abort,
    },
  ).catch((error) => {
    throw networkError({
      reason: error?.message ?? null,
      response: error,
    });
  });

  if (!response.ok) {
    const fullResponse = await response.text().catch(() => null);
    const parsedResponse = fullResponse ? JSON.parse(fullResponse) : [];
    if (response.status === 400) {
      // TODO: ВЕРНУТЬ В JSON МУТАТИОН И В ZOD правильные валидаторы
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
        response: await clonedResponse.text(),
        reason: error?.message ?? null,
      });
    });

  return data;
}
