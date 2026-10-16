import { Middleware } from '@reduxjs/toolkit';
import { addError } from './errorSlice';
import { RootState } from './index';

interface IErrorAction {
  error?: unknown;
  meta?: { condition?: boolean };
  payload?: { status?: number | string; data?: { detail?: string } };
}

export const errorMiddleware: Middleware<{}, RootState> = store => next => unknownAction => {
  const action = unknownAction as IErrorAction;
  if (action?.error && !action.meta?.condition) {
    const message = action.payload?.data?.detail ? action.payload.data.detail :
      action.payload?.status === 'FETCH_ERROR' ? 'Network error, please try again' : null;

    if (message) {
      store.dispatch(addError({
        message,
      }));
    }
  }
  return next(unknownAction);
}
