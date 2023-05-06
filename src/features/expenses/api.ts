import mainApi from 'store/api';
import { ITransaction, ICreateTransaction } from './types';

const API_URL = `transactions`;

export const transactionsApi = mainApi.injectEndpoints({
  endpoints: (build => ({
    createTransaction: build.mutation<ITransaction, ICreateTransaction>({
      query: (body: ICreateTransaction) => ({
        url: API_URL,
        method: 'POST',
        body,
      }),
    }),
  }))
});

export const {
  useCreateTransactionMutation,
} = transactionsApi;
