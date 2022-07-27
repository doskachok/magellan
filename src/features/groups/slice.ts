import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { transactionGroupsApi } from './api';
import { ITransactionGroup, ITransactionGroupListItem } from './types';

interface ISliceState {
  list: ITransactionGroupListItem[]
}

const initialState: ISliceState = {
  list: []
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState: initialState,
  reducers: {
    saveGroup: (state, { payload }: { payload: ITransactionGroup }) => {
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
        (state, { payload }: { payload: ITransactionGroupListItem[] }) => {
          state.list = payload;
        }
      )
  }
});

export const { saveGroup } = groupsSlice.actions;
export default groupsSlice.reducer;

export const groupsListSelector = (store: RootState) => store.groups.list;
