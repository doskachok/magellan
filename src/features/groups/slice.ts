import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { transactionGroupsApi } from './api';
import { ITransactionGroup, ITransactionGroupListItem } from './types';

interface ISliceState {
  list: ITransactionGroupListItem[],
  selectedGroup?: ITransactionGroup,
}

const initialState: ISliceState = {
  list: []
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState: initialState,
  reducers: {
    saveGroup: (state, { payload }: PayloadAction<ITransactionGroup>) => {
      const index = state.list.findIndex(g => g.id === payload.id);
      if (index === -1) {
        state.list = [...state.list, { ...payload, yourPart: 0 }];
      } else {
        const oldGroup = state.list[index];
        state.list = [...state.list.filter(g => g.id !== payload.id), { ...payload, yourPart: oldGroup.yourPart }];
      }
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        transactionGroupsApi.endpoints.getTransactionGroups.matchFulfilled,
        (state, { payload }: PayloadAction<ITransactionGroupListItem[]>) => {
          state.list = payload;
        }
      )
      .addMatcher(
        transactionGroupsApi.endpoints.getTransactionGroupById.matchFulfilled,
        (state, { payload }: PayloadAction<ITransactionGroup>) => {
          state.selectedGroup = payload;
        }
      )
      .addMatcher(
        transactionGroupsApi.endpoints.getTransactionGroupById.matchPending,
        (state) => {
          state.selectedGroup = undefined;
        }
      )
  }
});

export const { saveGroup } = groupsSlice.actions;
export default groupsSlice.reducer;

export const groupsListSelector = (store: RootState) => store.groups.list;
export const selectGroupById = (groupId: string) => (store: RootState) => 
  store.groups.list.find(g => g.id === groupId);

export const selectedGroupSelector = (store: RootState) => store.groups.selectedGroup ? ({
  ...store.groups.selectedGroup,
  transactions: store.groups.selectedGroup.transactions?.map(t => ({
    ...t,
    paymentDateUtc: new Date(t.paymentDateUtc),
  }))
}) : undefined;
