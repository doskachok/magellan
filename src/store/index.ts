import { configureStore } from '@reduxjs/toolkit';
import {mainApi} from './api';
import authReducer from '../features/auth/slice';
import groupsReducer from '../features/groups/slice';

const apiReducers = {
  [mainApi.reducerPath]: mainApi.reducer
};

const middlewares = [
  mainApi.middleware,
];

const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    ...apiReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares)
});

export default store;
export type RootState = ReturnType<typeof store.getState>;