import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalStorageKeys } from '../../constants/localStorageKeys';
import { RootState } from '../../store';
import { IAuthPayload, IUser } from './types';

interface ISliceState {
  user: IUser | null;
  accessToken: string | null;
  userId: string | null;
}

const initialState: ISliceState = {
  accessToken: localStorage.getItem(LocalStorageKeys.TOKEN),
  userId: localStorage.getItem(LocalStorageKeys.USER_ID),
  user: JSON.parse(localStorage.getItem(LocalStorageKeys.USER) as string) as IUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logOut: (state) => {
      state.accessToken = null;
      state.user = null;
      state.userId = null;
      localStorage.clear();
    },
    tokenReceived: (state, { payload }: PayloadAction<IAuthPayload>) => {
      state.userId = payload.id;
      state.accessToken = payload.token;
      localStorage.setItem(LocalStorageKeys.USER_ID, payload.id);
      localStorage.setItem(LocalStorageKeys.TOKEN, payload.token);
    },
    userReceived: (state, { payload }: PayloadAction<IUser>) => {
      localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(payload));
      state.user = payload;
    }
  }
});

export const { tokenReceived, logOut, userReceived } = authSlice.actions;
export default authSlice.reducer;

export const userSelector = (store: RootState) => store.auth.user;
export const tokenSelector = (store: RootState) => store.auth.accessToken;