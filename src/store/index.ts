import { combineSlices, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { api } from './api';
import authSlice, { credentialsReceived, loggedOut, persistCredentials } from './authSlice';
import { errorToastMiddleware } from './errors';

const rootReducer = combineSlices(authSlice, api);

const listener = createListenerMiddleware();

listener.startListening({
  actionCreator: credentialsReceived,
  effect: ({ payload }) => persistCredentials(payload),
});

listener.startListening({
  actionCreator: loggedOut,
  effect: (_, { dispatch }) => {
    persistCredentials(null);
    dispatch(api.util.resetApiState());
  },
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(listener.middleware).concat(api.middleware, errorToastMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
