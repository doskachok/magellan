import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface INotification {
  message: string;
  key: string;
}

interface ISliceState {
  notifications: INotification[];
  prevCount: number;
}

const initialState: ISliceState = {
  notifications: [],
  prevCount: 0,
};

const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    addError: (state, { payload }: PayloadAction<Pick<INotification, 'message'>>) => {
      state.prevCount = state.notifications.length;
      state.notifications = [...state.notifications, {
        ...payload,
        key: `error-${Math.random()}`
      }];
    },
    removeError: (state, { payload }: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(i => i.key !== payload);
      state.prevCount = state.notifications.length;
    }
  }
});

export const { addError, removeError } = errorsSlice.actions
export default errorsSlice.reducer
