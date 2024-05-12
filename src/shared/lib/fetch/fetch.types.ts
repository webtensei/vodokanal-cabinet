import { ZodIssue } from 'zod';

export type HttpMethod = 'HEAD' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'QUERY' | 'OPTIONS';

export type RequestBody = Blob | BufferSource | FormData | string;

export type FetchApiRecord = Record<string, string | string[] | number | boolean | null | undefined>;

export type Json = null | undefined | boolean | string | number | Json[] | { [k: string]: Json };

export type GenericError<T extends string> = {
  errorType: T;
  response: { message: string };
  explanation: string;
};

export const INVALID_DATA = 'INVALID_DATA';
export interface InvalidDataError extends GenericError<typeof INVALID_DATA> {
  validationErrors: ZodIssue[];
}

export const PREPARATION = 'PREPARATION';
export interface PreparationError extends GenericError<typeof PREPARATION> {
  reason: string | null;
}

export const HTTP = 'HTTP';
export interface HttpError<Status extends number = number> extends GenericError<typeof HTTP> {
  status: Status;
  statusText: string;
}

export const NETWORK = 'NETWORK';
export interface NetworkError extends GenericError<typeof NETWORK> {
  reason: string | null;
}
