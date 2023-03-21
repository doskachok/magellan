import { configureStore } from '@reduxjs/toolkit';
import {Middleware} from 'redux';
import {createLogger} from 'redux-logger'
import {mainApi} from './api';
import {errorMiddleware} from './errorMiddleware';
import authReducer from '../features/auth/slice';
import groupsReducer from '../features/groups/slice';
import errorReducer from './errorSlice';

const apiCallStatuses = ['pending', 'fulfilled', 'rejected'];
const unsubscribeQueryResult = 'unsubscribeQueryResult';

const buildActionLog = (action: Record<string, unknown>, typePrefix: string): Record<string, unknown> => {
  return ({
    ...action,
    type: `[${typePrefix}] ${action.type}`
  });
}

const logger = createLogger({
  actionTransformer: (action) => {
    if (!action.type.startsWith('mainApi'))
      return action;
    
    const actionType = action.type.split('/').at(-1);
    
    if (apiCallStatuses.indexOf(actionType) !== -1)
      return buildActionLog(action, action?.meta?.arg?.endpointName);
    
    if (actionType === unsubscribeQueryResult)
      return buildActionLog(action, action?.payload?.queryCacheKey);
    
    return action;
  }
});

const apiReducers = {
  [mainApi.reducerPath]: mainApi.reducer
};

const middlewares: Middleware[] = [
  mainApi.middleware,
  errorMiddleware,
  logger,
];

const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    errors: errorReducer,
    ...apiReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares)
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
