import { api, ApiTag } from 'store/api';
import { ACTIVITY_PAGE_SIZE, type ActivityItem } from './types';

export const activityApi = api.injectEndpoints({
  endpoints: build => ({
    // Pages are cursored by the id of the last entry of the previous page; '' asks for the first page.
    getGroupActivity: build.infiniteQuery<ActivityItem[], string, string>({
      infiniteQueryOptions: {
        initialPageParam: '',
        getNextPageParam: lastPage => (lastPage.length < ACTIVITY_PAGE_SIZE ? undefined : lastPage.at(-1)?.id),
      },
      query: ({ queryArg: groupId, pageParam: before }) => ({
        url: `transaction-groups/${groupId}/activity`,
        params: before ? { before, limit: ACTIVITY_PAGE_SIZE } : { limit: ACTIVITY_PAGE_SIZE },
      }),
      providesTags: (_result, _error, groupId) => [{ type: ApiTag.Activity, id: groupId }],
    }),
    getTransactionHistory: build.query<ActivityItem[], string>({
      query: id => `transactions/${id}/history`,
      providesTags: (_result, _error, id) => [{ type: ApiTag.Activity, id: `transaction-${id}` }],
    }),
  }),
});

export const { useGetGroupActivityInfiniteQuery, useGetTransactionHistoryQuery } = activityApi;
