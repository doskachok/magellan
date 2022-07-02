import { configureStore } from '@reduxjs/toolkit';
import {mainApi} from './api';
import authReducer from '../features/auth/slice';

const apiReducers = {
  [mainApi.reducerPath]: mainApi.reducer
};

const middlewares = [
  mainApi.middleware,
];

const store = configureStore({
  reducer: {
    auth: authReducer,
    ...apiReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares)
});

export default store;
export type RootState = ReturnType<typeof store.getState>;