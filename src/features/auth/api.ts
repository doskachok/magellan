import mainApi from '../../store/api';
import { IAuthPayload, ILoginForm, IUser } from './types';

export const authApi = mainApi.injectEndpoints({
  endpoints: (build => ({
    register: build.mutation({
      query: (body) => ({
        url: `users`,
        method: 'POST',
        body,
      }),
    }),
    user: build.query<IUser, string>({
      query: (id) => ({
        url: `users/${id}`,
      })
    }),
    login: build.mutation<IAuthPayload, ILoginForm>({
      query: (body) => ({
        url: `users/authorize`,
        method: 'POST',
        body,
      })
    }),
  }))
});

export const {
  useLazyUserQuery,
  useLoginMutation,
  useRegisterMutation,
} = authApi;
