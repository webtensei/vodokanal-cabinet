import { ZodIssue, ZodType } from 'zod';

export function addServerErrors<T>(
  errors: ZodIssue[],
  setError: (
    fieldName: keyof T,
    error: ZodIssue
  ) => void,
) {
  return errors.map((issue) => {
    if (Array.isArray(issue.path)) {
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

export interface Contract<Raw, Data extends Raw> {
  isData: (prepared: Raw) => prepared is Data;
  getErrorMessages: (prepared: Raw) => string[];
}

export function zodContract<D>(data: ZodType<D>): Contract<unknown, D> {
  function isData(prepared: unknown): prepared is D {
    return data.safeParse(prepared).success;
  }

  return {
    isData,
    getErrorMessages(raw) {
      const validation = data.safeParse(raw);
      if (validation.success) {
        return [];
      }

      return validation.error.errors.map((e) => {
        const path = e.path.join('.');
        return path !== '' ? `${e.message}, path: ${path}` : e.message;
      });
    },
  };
}
