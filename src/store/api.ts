import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
  createApi, 
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/dist/query/react';
import { ApiTags } from '../constants/api-tags';
import { RootState } from './index';
import { addError } from './errorSlice';
import { tokenReceived, logOut, userReceived } from '../features/auth/slice'
import { IAuthPayload } from '../features/auth/types';
import { IUser } from '../types/user-types';

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

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs, 
  unknown, 
  FetchBaseQueryError> 
  = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}
) => {
  let result = await baseQuery(args, api, extraOptions);
  const loggedUserId = (api.getState() as RootState).auth.userId;

  if ((args as FetchArgs).url === 'users/authorize') 
    api.dispatch(tokenReceived(result.data as IAuthPayload));

  if ((args as FetchArgs).url === `users/${loggedUserId}`)
    api.dispatch(userReceived(result.data as IUser));

  if (result.error && result.error.status === 401) {
      const refreshed = await baseQuery({ url: 'users/refreshed-token'}, api, extraOptions);

      if (refreshed.data) {
        api.dispatch(tokenReceived(refreshed.data as IAuthPayload));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logOut());
        api.dispatch(addError({ message: 'Please log in again'}));
      }
  }

  return result;
};

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: Object.values(ApiTags.GROUPS_LIST),
  endpoints: () => ({ })
});

export default mainApi;
