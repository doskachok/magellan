import { IUpdateUser, IUser } from 'types/userTypes';
import mainApi from './api';

const API_URL = `users`;

export const usersApi = mainApi.injectEndpoints({
  endpoints: (build => ({
    getUsers: build.query<IUser[], string>({
      query: (startsWith?: string) => ({
        url: `${API_URL}?startsWith=${startsWith || ''}`,
      })
    }),
    getKnownsUsers: build.query<IUser[], void>({
      query: () => ({
        url: `${API_URL}/knowns`,
      })
    }),
    updateUser: build.mutation<IUser, IUpdateUser>({
      query: (body: IUpdateUser) => ({
        url: API_URL,
        method: 'PUT',
        body,
      }),
    })
  }))
});

export const {
  useGetKnownsUsersQuery,
  useLazyGetUsersQuery,
  useUpdateUserMutation
} = usersApi;