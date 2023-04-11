import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreateTransaction} from './types';
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
  }
});

export const { saveTransaction } = expensesSlice.actions;
export default expensesSlice.reducer;

export const newTransactionSelector = (store: RootState) => store.expenses.newTransaction;
