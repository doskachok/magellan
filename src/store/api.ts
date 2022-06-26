import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, {getState}) => {
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
