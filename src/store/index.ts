import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {Middleware} from 'redux';
import {createLogger} from 'redux-logger'
import {mainApi} from './api';
import {errorMiddleware} from './errorMiddleware';
import authReducer from '../features/auth/slice';
import groupsReducer from '../features/groups/slice';
import expensesReducer from '../features/expenses/slice';
import errorReducer from './errorSlice';

const apiCallStatuses = ['pending', 'fulfilled', 'rejected'];
const apiCacheActionsTypes = ['unsubscribeQueryResult', 'removeQueryResult'];

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
    
    if (apiCacheActionsTypes.indexOf(actionType) !== -1)
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

const reducer = combineReducers({
  auth: authReducer,
  groups: groupsReducer,
  expenses: expensesReducer,
  errors: errorReducer,
  ...apiReducers,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['groups'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(middlewares)
});

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
