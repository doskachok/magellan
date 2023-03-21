import { Middleware } from 'redux';
import { addError } from './errorSlice';
import { RootState } from './index';

export const errorMiddleware: Middleware<{}, RootState> = store => next => action => {
  if (action?.error && !action.meta.condition) {

    let messages: Array<string> = Array<string>(0);

    if (action.payload?.data?.detail) {
      messages.push(action.payload?.data?.detail);
    }

    if (action.payload?.data?.errors) {
      let combinedErrors: Array<string> = Array<string>(0);
      Object.keys(action.payload?.data?.errors).forEach(field => {
        combinedErrors.push(...(action.payload?.data?.errors[field] as Array<string>).map(errorMsg => {
          return `${errorMsg}\n`;
        }));
      })
      console.log(JSON.stringify(combinedErrors));
      messages.push(...combinedErrors);
    }

    if (action.payload?.status === 'FETCH_ERROR') {
      messages.push('Network error, please try again');
    }

    store.dispatch(addError(messages.map((message) => ({message}))));
  }
  return next(action);
}
