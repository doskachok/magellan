import { api, ApiTag } from 'store/api';
import type { SplitPreview, SplitPreviewRequest } from './split';
import type { CreateTransaction, Receipt, Transaction, TransactionRef, UpdateTransaction } from './types';

/** Everything an expense change can show up in. */
export const expenseTags = (groupId: string, transactionId?: string) => [
  ApiTag.Groups,
  { type: ApiTag.Group, id: groupId },
  { type: ApiTag.Debts, id: groupId },
  { type: ApiTag.Activity, id: groupId },
  ...(transactionId
    ? [
        { type: ApiTag.Transaction, id: transactionId },
        { type: ApiTag.Activity, id: `transaction-${transactionId}` },
      ]
    : []),
];

/** As above, minus the deleted expense itself: refetching it would answer 404 and toast an error. */
export const deletedExpenseTags = (groupId: string, transactionId: string) =>
  expenseTags(groupId, transactionId).filter(tag => !(typeof tag === 'object' && tag.type === ApiTag.Transaction));

interface ReceiptUpload {
  transactionId: string;
  groupId: string;
  file: Blob;
  fileName: string;
}

interface ReceiptRef {
  transactionId: string;
  groupId: string;
  receiptId: string;
}

export const expensesApi = api.injectEndpoints({
  endpoints: build => ({
    getTransaction: build.query<Transaction, string>({
      query: id => `transactions/${id}`,
      providesTags: (_result, _error, id) => [{ type: ApiTag.Transaction, id }],
    }),
    // A POST only because the split goes in the body; nothing is stored, so it's cached like a query.
    previewSplit: build.query<SplitPreview, SplitPreviewRequest>({
      query: body => ({ url: 'transactions/preview', method: 'POST', body }),
    }),
    createTransaction: build.mutation<Transaction, CreateTransaction>({
      query: body => ({ url: 'transactions', method: 'POST', body }),
      invalidatesTags: (_result, _error, { groupId }) => expenseTags(groupId),
    }),
    updateTransaction: build.mutation<Transaction, UpdateTransaction>({
      query: body => ({ url: 'transactions', method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id, groupId }) => expenseTags(groupId, id),
    }),
    deleteTransaction: build.mutation<void, TransactionRef>({
      query: ({ id }) => ({ url: `transactions/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { id, groupId }) => deletedExpenseTags(groupId, id),
    }),
    restoreTransaction: build.mutation<Transaction, TransactionRef>({
      query: ({ id }) => ({ url: `transactions/${id}/restore`, method: 'POST' }),
      invalidatesTags: (_result, _error, { id, groupId }) => expenseTags(groupId, id),
    }),
    uploadReceipt: build.mutation<Receipt, ReceiptUpload>({
      query: ({ transactionId, file, fileName }) => {
        const body = new FormData();
        body.append('file', file, fileName);
        return { url: `transactions/${transactionId}/receipts`, method: 'POST', body };
      },
      invalidatesTags: (_result, _error, { transactionId, groupId }) => expenseTags(groupId, transactionId),
    }),
    deleteReceipt: build.mutation<void, ReceiptRef>({
      query: ({ transactionId, receiptId }) => ({ url: `transactions/${transactionId}/receipts/${receiptId}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, { transactionId, groupId }) => expenseTags(groupId, transactionId),
    }),
    // Receipts need the auth header, so they're fetched as blobs; the cache keeps only the object URL string.
    getReceiptUrl: build.query<string, Omit<ReceiptRef, 'groupId'>>({
      query: ({ transactionId, receiptId }) => ({
        url: `transactions/${transactionId}/receipts/${receiptId}`,
        responseHandler: async response => URL.createObjectURL(await response.blob()),
      }),
      async onCacheEntryAdded(_arg, { cacheDataLoaded, cacheEntryRemoved }) {
        const { data } = await cacheDataLoaded.catch(() => ({ data: undefined }));
        await cacheEntryRemoved;
        if (data) URL.revokeObjectURL(data);
      },
    }),
  }),
});

export const {
  useGetTransactionQuery,
  usePreviewSplitQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useRestoreTransactionMutation,
  useUploadReceiptMutation,
  useDeleteReceiptMutation,
  useGetReceiptUrlQuery,
} = expensesApi;
