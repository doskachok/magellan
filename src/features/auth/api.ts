import mainApi from '../../store/api';

export const authApi = mainApi.injectEndpoints({
  endpoints: (build => ({
    register: build.mutation({
      query: (body) => ({
        url: `users`,
        method: 'POST',
        body,
      }),
    }),
  }))
});

export const {
  useRegisterMutation,
} = authApi;
