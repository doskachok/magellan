import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreateTransaction, IPartialAssignments, ITransaction} from './types';
import { RootState } from 'store';
import { transactionsApi } from './api';

interface ISliceState {
  list: ITransaction[],
  newTransaction: ICreateTransaction | null;
}

const initialState: ISliceState = {
  list: [],
  newTransaction: null,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: initialState,
  reducers: {
    saveTransaction: (state, { payload }: PayloadAction<ICreateTransaction | null>) => {
      state.newTransaction = payload;
    },
    updateOrAddPartialAssigment: (state, { payload }: PayloadAction<IPartialAssignments | null>) => {
      if (state.newTransaction) {
        const { partialsAssignments } = state.newTransaction;
        const index = partialsAssignments.findIndex((pa) => pa.userId === payload?.userId && pa.splitMethod === payload?.splitMethod);
        if (index === -1) {
          state.newTransaction.partialsAssignments.push(payload as IPartialAssignments);
        } else {
          state.newTransaction.partialsAssignments[index] = payload as IPartialAssignments;
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        transactionsApi.endpoints.getTransactionById.matchFulfilled,
        (state, { payload }: PayloadAction<ITransaction>) => {
          const index = state.list.findIndex((tr) => tr.id === payload?.id);
          if (index === -1) {
            state.list.push(payload);
          } else {
            state.list[index] = payload;
          }
        }
      )
  }
});

export const { saveTransaction, updateOrAddPartialAssigment } = expensesSlice.actions;
export default expensesSlice.reducer;

export const selectTransactionById = (transactionId: string) => (store: RootState) => 
  store.expenses.list.find(tr => tr.id === transactionId);

export const newTransactionSelector = (store: RootState) => store.expenses.newTransaction;
