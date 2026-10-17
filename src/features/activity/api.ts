import { api, ApiTag } from 'store/api';
import { ACTIVITY_PAGE_SIZE, type ActivityItem } from './types';

interface ActivityPage {
  groupId: string;
  /** Id of the last entry of the previous page. */
  before?: string;
}

export const activityApi = api.injectEndpoints({
  endpoints: build => ({
    getGroupActivity: build.query<ActivityItem[], ActivityPage>({
      query: ({ groupId, before }) => ({
        url: `transaction-groups/${groupId}/activity`,
        params: before ? { before, limit: ACTIVITY_PAGE_SIZE } : { limit: ACTIVITY_PAGE_SIZE },
      }),
      providesTags: (_result, _error, { groupId }) => [{ type: ApiTag.Activity, id: groupId }],
    }),
    getTransactionHistory: build.query<ActivityItem[], string>({
      query: id => `transactions/${id}/history`,
      providesTags: (_result, _error, id) => [{ type: ApiTag.Activity, id: `transaction-${id}` }],
    }),
  }),
});

export const { useGetGroupActivityQuery, useGetTransactionHistoryQuery } = activityApi;
