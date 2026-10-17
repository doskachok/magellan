import { api, ApiTag } from 'store/api';
import { useAppSelector } from 'store';
import { selectUserId } from 'store/authSlice';
import type { UpdateUser, User } from './types';

export const usersApi = api.injectEndpoints({
  endpoints: build => ({
    getUser: build.query<User, string>({
      query: id => `users/${id}`,
      providesTags: (_result, _error, id) => [{ type: ApiTag.User, id }],
    }),
    searchUsers: build.query<User[], string>({
      query: startsWith => ({ url: 'users', params: { startsWith } }),
    }),
    getKnownUsers: build.query<User[], void>({
      query: () => 'users/knowns',
      providesTags: [ApiTag.KnownUsers],
    }),
    updateUser: build.mutation<User, UpdateUser>({
      query: body => ({ url: 'users', method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: ApiTag.User, id }, ApiTag.Group],
    }),
    uploadFile: build.mutation<{ id: string }, File>({
      query: file => {
        const body = new FormData();
        body.append('file', file, file.name);
        return { url: 'storage', method: 'POST', body };
      },
    }),
  }),
});

export const {
  useGetUserQuery,
  useSearchUsersQuery,
  useGetKnownUsersQuery,
  useUpdateUserMutation,
  useUploadFileMutation,
} = usersApi;

/** The signed-in user's id; only call inside authenticated routes. */
export const useCurrentUserId = () => useAppSelector(selectUserId) ?? '';

export const useCurrentUser = () => {
  const userId = useCurrentUserId();
  return useGetUserQuery(userId, { skip: !userId });
};
