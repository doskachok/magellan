import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import { RootState } from './index';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, {getState}) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
});

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: baseQuery,
  endpoints: (build) => ({
  })
});

export default mainApi;
