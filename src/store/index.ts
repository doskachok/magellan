import { configureStore } from '@reduxjs/toolkit';
import {Middleware} from 'redux';
import logger from 'redux-logger'
import {mainApi} from './api';
import {errorMiddleware} from './errorMiddleware';
import authReducer from '../features/auth/slice';
import groupsReducer from '../features/groups/slice';
import errorReducer from './errorSlice';

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
