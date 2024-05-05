import { ZodIssue, ZodType } from 'zod';
import { INVALID_DATA, InvalidDataError } from '@shared/lib/fetch';

export function addServerErrors<T>(
  errors: ZodIssue[],
  setError: (
    fieldName: keyof T,
    error: ZodIssue
  ) => void,
) {
  return errors.map((issue) => {
    if (Array.isArray(issue.path)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const p of issue.path) {
        const path = p as keyof T;
        setError(path, { ...issue });
      }
    } else {
      const path = issue.path as keyof T;
      setError(path, { ...issue });
    }
    return null;
  });
}
export function isErrorWithValidationErrors(error: any): error is InvalidDataError {
  return error?.errorType === INVALID_DATA;
}
export interface Contract<Raw, Data extends Raw> {
  isData: (prepared: Raw) => prepared is Data;
  getErrorMessages: (prepared: Raw) => ZodIssue[];
}

export function zodContract<D>(data: ZodType<D>): Contract<unknown, D> {
  function isData(prepared: unknown): prepared is D {
    return data.safeParse(prepared).success;
  }

  return {
    isData,
    getErrorMessages(raw): ZodIssue[] {
      const validation = data.safeParse(raw);
      if (validation.success) {
        return [];
      }

      return validation.error.errors;
    },
  };
}
