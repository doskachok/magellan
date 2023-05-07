import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreateTransaction, IPartialAssignments} from './types';
import { RootState } from 'store';

interface ISliceState {
  newTransaction: ICreateTransaction | null;
}

const initialState: ISliceState = {
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
  }
});

export const { saveTransaction, updateOrAddPartialAssigment } = expensesSlice.actions;
export default expensesSlice.reducer;

export const newTransactionSelector = (store: RootState) => store.expenses.newTransaction;
