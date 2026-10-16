import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from 'lib/config';
import { credentialsReceived, loggedOut, type Credentials } from './authSlice';

interface StateWithAuth {
  auth: { token: string | null };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as StateWithAuth).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

// Concurrent 401s share one refresh request instead of each firing their own.
let refreshInFlight: ReturnType<typeof rawBaseQuery> | null = null;

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const hadToken = Boolean((api.getState() as StateWithAuth).auth.token);

  if (result.error?.status !== 401 || !hadToken) return result;

  refreshInFlight ??= Promise.resolve(rawBaseQuery('users/refreshed-token', api, extraOptions)).finally(() => {
    refreshInFlight = null;
  });
  const refreshed = await refreshInFlight;

  if (refreshed.data) {
    api.dispatch(credentialsReceived(refreshed.data as Credentials));
    result = await rawBaseQuery(args, api, extraOptions);
  } else {
    api.dispatch(loggedOut());
  }

  return result;
};

export const ApiTag = {
  Groups: 'Groups',
  Group: 'Group',
  Debts: 'Debts',
  Transaction: 'Transaction',
  User: 'User',
  KnownUsers: 'KnownUsers',
} as const;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: Object.values(ApiTag),
  endpoints: () => ({}),
});
