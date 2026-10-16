import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

interface ProblemDetails {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error;

/** Field errors from an ASP.NET validation ProblemDetails, keyed by camelCase field name. */
export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!isFetchBaseQueryError(error)) return {};
  const errors = (error.data as ProblemDetails | undefined)?.errors ?? {};
  return Object.fromEntries(
    Object.entries(errors)
      .filter(([, messages]) => messages.length > 0)
      .map(([field, messages]) => [field.charAt(0).toLowerCase() + field.slice(1), messages[0]!]),
  );
};

export const getErrorMessage = (error: unknown): string | null => {
  if (!isFetchBaseQueryError(error)) return null;
  if (error.status === 'FETCH_ERROR') return 'Network error — check your connection and try again.';
  if (error.status === 401) return null; // handled by re-authentication / redirect to sign-in

  const problem = error.data as ProblemDetails | undefined;
  return problem?.detail ?? Object.values(getFieldErrors(error))[0] ?? problem?.title ?? 'Something went wrong.';
};

/** Surfaces failed API calls as toasts so screens only handle the errors they can do something about. */
export const errorToastMiddleware: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const message = getErrorMessage(action.payload);
    if (message) toast.error(message, { id: message });
  }
  return next(action);
};
