import { api, ApiTag } from 'store/api';
import type { Debt, Group, GroupListItem, SaveGroup } from './types';

const URL = 'transaction-groups';

interface ParticipantRequest {
  groupId: string;
  userId: string;
}

const groupTags = (groupId: string) => [
  ApiTag.Groups,
  { type: ApiTag.Group, id: groupId },
  { type: ApiTag.Debts, id: groupId },
];

export const groupsApi = api.injectEndpoints({
  endpoints: build => ({
    getGroups: build.query<GroupListItem[], void>({
      query: () => URL,
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
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useGetGroupDebtsQuery,
  useSaveGroupMutation,
  useAddParticipantMutation,
  useRemoveParticipantMutation,
} = groupsApi;
