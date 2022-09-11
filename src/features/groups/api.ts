import { ApiTags } from '../../constants/api-tags';
import mainApi from '../../store/api';
import { ICreateTransactionGroup, ITransactionGroup, ITransactionGroupListItem, IUpdateTransactionGroup } from './types';

const API_URL = `transaction-groups`;

export const transactionGroupsApi = mainApi.injectEndpoints({
  endpoints: (build => ({
    getTransactionGroups: build.query<ITransactionGroupListItem[], void>({
      providesTags: [ApiTags.GROUPS_LIST],
      query: () => ({
        url: API_URL,
      })
    }),
    getTransactionGroupById: build.query<ITransactionGroup, string>({
      query: (id: string) => ({
        url: `${API_URL}/${id}`,
      })
    }),
    createTransactionGroup: build.mutation<ITransactionGroup, ICreateTransactionGroup>({
      invalidatesTags: [ApiTags.GROUPS_LIST],
      query: (body: ICreateTransactionGroup) => ({
        url: API_URL,
        method: 'POST',
        body,
      }),
    }),
    updateTransactionGroup: build.mutation<ITransactionGroup, IUpdateTransactionGroup>({
      invalidatesTags: [ApiTags.GROUPS_LIST],
      query: (body: IUpdateTransactionGroup) => ({
        url: API_URL,
        method: 'PUT',
        body,
      }),
    }),

    addParticipant: build.mutation<void, { groupId: string, userId: string }>({
      query: (data: {groupId: string, userId: string}) => ({
        url: `${API_URL}/${data.groupId}/participants`,
        method: 'POST',
        body: { userId: data.userId },
      }),
    }),
    removeParticipant: build.mutation<void, { groupId: string, userId: string }>({
      query: (data: {groupId: string, userId: string}) => ({
        url: `${API_URL}/${data.groupId}/participants/${data.userId}`,
        method: 'DELETE'
      }),
    }),
  }))
});

export const {
  useLazyGetTransactionGroupsQuery,
  useGetTransactionGroupByIdQuery,
  useLazyGetTransactionGroupByIdQuery,
  useCreateTransactionGroupMutation,
  useUpdateTransactionGroupMutation,
  useAddParticipantMutation,
  useRemoveParticipantMutation
} = transactionGroupsApi;
