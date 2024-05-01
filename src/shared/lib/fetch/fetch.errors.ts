import { ZodIssue } from 'zod';
import {
  InvalidDataError,
  INVALID_DATA,
  PreparationError,
  PREPARATION,
  HttpError,
  HTTP,
  NetworkError,
  NETWORK,
} from './fetch.types';

export function invalidDataError(config: {
  validationErrors: ZodIssue[];
  response: { message: string };
}): InvalidDataError {
  return {
    ...config,
    errorType: INVALID_DATA,
    explanation: 'Ответ был признан недействительным в отношении данного контракта',
  };
}

export function preparationError(config: {
  response: { message: string };
  reason: string | null;
}): PreparationError {
  return {
    ...config,
    errorType: PREPARATION,
    explanation: 'Не удалось извлечь данные из ответа',
  };
}

export function httpError(config: {
  status: number;
  statusText: string;
  response: { message: string };
}): HttpError {
  return {
    ...config,
    errorType: HTTP,
    explanation: 'Запрос завершен с неудачным HTTP-кодом',
  };
}

export function networkError(config: {
  reason: string | null;
  response: { message: string };
}): NetworkError {
  return {
    ...config,
    errorType: NETWORK,
    explanation: 'Запрос не выполнен из-за проблем с сетью',
  };
}
