import {Middleware} from 'redux';
import {addError} from './errorSlice';
import {RootState} from './index';

export const errorMiddleware: Middleware<{}, RootState> = store => next => action => {
  if (action?.error && !action.meta.condition) {
    const message = action.payload?.data?.detail ? action.payload.data.detail :
      action.payload?.status === 'FETCH_ERROR' ? 'Network error, please try again' : null;

    if (message) {
      store.dispatch(addError({
        message,
      }));
    }
  }
  return next(action);
}
