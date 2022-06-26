import { configureStore } from '@reduxjs/toolkit';
import {mainApi} from './api';

const apiReducers = {
  [mainApi.reducerPath]: mainApi.reducer
};

const middlewares = [
  mainApi.middleware,
];

const store = configureStore({
  reducer: {
    ...apiReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares)
});

export default store;
