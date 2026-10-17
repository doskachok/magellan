import { api, ApiTag } from 'store/api';
import type { CreateTransaction, Transaction } from './types';

export const expensesApi = api.injectEndpoints({
  endpoints: build => ({
    getTransaction: build.query<Transaction, string>({
      query: id => `transactions/${id}`,
      providesTags: (_result, _error, id) => [{ type: ApiTag.Transaction, id }],
    }),
    createTransaction: build.mutation<Transaction, CreateTransaction>({
      query: body => ({ url: 'transactions', method: 'POST', body }),
      invalidatesTags: (_result, _error, { groupId }) => [
        ApiTag.Groups,
        { type: ApiTag.Group, id: groupId },
        { type: ApiTag.Debts, id: groupId },
      ],
    }),
  }),
});

export const { useGetTransactionQuery, useCreateTransactionMutation } = expensesApi;
