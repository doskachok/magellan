import { api } from 'store/api';
import { credentialsReceived, type Credentials } from 'store/authSlice';
import type { User } from 'features/users/types';

export interface SignInRequest {
  login: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const authApi = api.injectEndpoints({
  endpoints: build => ({
    signIn: build.mutation<Credentials, SignInRequest>({
      query: body => ({ url: 'users/authorize', method: 'POST', body }),
      async onQueryStarted(_request, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(credentialsReceived(data));
        } catch {
          // The error toast middleware reports the failure.
        }
      },
    }),
    signUp: build.mutation<User, SignUpRequest>({
      query: body => ({ url: 'users', method: 'POST', body }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
