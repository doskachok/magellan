import mainApi from 'store/api';
import { ICreateTransaction, ITransactionView } from './types';

const API_URL = `transactions`;

export const transactionsApi = mainApi.injectEndpoints({
  endpoints: (build => ({
    createTransaction: build.mutation<ITransactionView, ICreateTransaction>({
      query: (body: ICreateTransaction) => ({
        url: API_URL,
        method: 'POST',
        body,
      }),
    }),
    getTransactionById: build.query<ITransactionView, string>({
      query: (id: string) => ({
        url: `${API_URL}/${id}`,
      })
    }),
  }))
});

export const {
  useCreateTransactionMutation,
  useLazyGetTransactionByIdQuery,
} = transactionsApi;
