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

type AddErrorPayloadType = Pick<INotification, 'message'>[] | Pick<INotification, 'message'>;

const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    addError: (state, { payload }: PayloadAction<AddErrorPayloadType>) => {
      state.prevCount = state.notifications.length;
      
      const newNotificationsArray = Array.isArray(payload) ?
        payload.map((item) => ({...item, key: `error-${Math.random()}`}))
        : [{...payload, key: `error-${Math.random()}`}];
      
      state.notifications = [...state.notifications, ...newNotificationsArray];
    },
    removeError: (state, { payload }: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(i => i.key !== payload);
      state.prevCount = state.notifications.length;
    }
  }
});

export const { addError, removeError } = errorsSlice.actions
export default errorsSlice.reducer
