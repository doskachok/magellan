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
    })
  }))
});

export const {
  useLazyGetTransactionGroupsQuery,
  useLazyGetTransactionGroupByIdQuery,
  useCreateTransactionGroupMutation,
  useUpdateTransactionGroupMutation
} = transactionGroupsApi;
