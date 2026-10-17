import { api, ApiTag } from 'store/api';
import type { User } from 'features/users/types';
import type { CreateSettlement, CurrencyStatistics, Debt, Group, GroupListItem, SaveGroup } from './types';

const URL = 'transaction-groups';

interface ParticipantRequest {
  groupId: string;
  userId: string;
}

const groupTags = (groupId: string) => [
  ApiTag.Groups,
  { type: ApiTag.Group, id: groupId },
  { type: ApiTag.Debts, id: groupId },
  { type: ApiTag.Activity, id: groupId },
];

/** After leaving or deleting a group its own queries would answer 404, so only the list is refreshed. */
export const goneGroupTags = () => [ApiTag.Groups];

export const groupsApi = api.injectEndpoints({
  endpoints: build => ({
    getGroups: build.query<GroupListItem[], { archived: boolean }>({
      query: ({ archived }) => ({ url: URL, params: { archived } }),
      providesTags: [ApiTag.Groups],
    }),
    getGroup: build.query<Group, string>({
      query: id => `${URL}/${id}`,
      providesTags: (_result, _error, id) => [{ type: ApiTag.Group, id }],
    }),
    getGroupDebts: build.query<Debt[], string>({
      query: id => `${URL}/${id}/optimized-debts`,
      providesTags: (_result, _error, id) => [{ type: ApiTag.Debts, id }],
    }),
    // Tagged as the group itself, so adding, editing or deleting an expense refreshes the statistics too.
    getGroupStatistics: build.query<CurrencyStatistics[], string>({
      query: id => `${URL}/${id}/statistics`,
      providesTags: (_result, _error, id) => [{ type: ApiTag.Group, id }],
    }),
    saveGroup: build.mutation<Group, SaveGroup>({
      query: ({ id, ...body }) => ({ url: URL, method: id ? 'PUT' : 'POST', body: id ? { id, ...body } : body }),
      invalidatesTags: result => (result ? groupTags(result.id) : [ApiTag.Groups]),
    }),
    addParticipant: build.mutation<void, ParticipantRequest>({
      query: ({ groupId, userId }) => ({ url: `${URL}/${groupId}/participants`, method: 'POST', body: { userId } }),
      invalidatesTags: (_result, _error, { groupId }) => [...groupTags(groupId), ApiTag.KnownUsers],
    }),
    removeParticipant: build.mutation<void, ParticipantRequest>({
      query: ({ groupId, userId }) => ({ url: `${URL}/${groupId}/participants/${userId}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { groupId }) => groupTags(groupId),
    }),
    settleDebt: build.mutation<void, CreateSettlement & { groupId: string }>({
      query: ({ groupId, ...body }) => ({ url: `${URL}/${groupId}/settlements`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { groupId }) => groupTags(groupId),
    }),
    addPlaceholder: build.mutation<User, { groupId: string; name: string }>({
      query: ({ groupId, name }) => ({ url: `${URL}/${groupId}/placeholders`, method: 'POST', body: { name } }),
      invalidatesTags: (_result, _error, { groupId }) => groupTags(groupId),
    }),
    replacePlaceholder: build.mutation<void, { groupId: string; placeholderId: string; userId: string }>({
      query: ({ groupId, placeholderId, userId }) => ({
        url: `${URL}/${groupId}/placeholders/${placeholderId}/replace`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (_result, _error, { groupId }) => [...groupTags(groupId), ApiTag.KnownUsers, ApiTag.Transaction],
    }),
    leaveGroup: build.mutation<void, { groupId: string; newOwnerId?: string }>({
      query: ({ groupId, newOwnerId }) => ({ url: `${URL}/${groupId}/leave`, method: 'POST', body: { newOwnerId } }),
      invalidatesTags: goneGroupTags,
    }),
    deleteGroup: build.mutation<void, string>({
      query: groupId => ({ url: `${URL}/${groupId}`, method: 'DELETE' }),
      invalidatesTags: goneGroupTags,
    }),
    setArchived: build.mutation<void, { groupId: string; archived: boolean }>({
      query: ({ groupId, archived }) => ({ url: `${URL}/${groupId}/archive`, method: archived ? 'POST' : 'DELETE' }),
      invalidatesTags: [ApiTag.Groups],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useGetGroupDebtsQuery,
  useGetGroupStatisticsQuery,
  useSaveGroupMutation,
  useAddParticipantMutation,
  useRemoveParticipantMutation,
  useSettleDebtMutation,
  useAddPlaceholderMutation,
  useReplacePlaceholderMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
  useSetArchivedMutation,
} = groupsApi;
