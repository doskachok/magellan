import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalStorageKeys } from '../../constants/localStorageKeys';
import { RootState } from '../../store';
import { authApi } from './api';
import { IAuthPayload, IUser } from './types';

interface ISliceState {
  user: IUser | null;
  accessToken: string | null;
}

const initialState: ISliceState = {
  accessToken: localStorage.getItem(LocalStorageKeys.TOKEN),
  user: JSON.parse(
    localStorage.getItem(LocalStorageKeys.USER) as string
  ) as IUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logOut: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }: PayloadAction<IAuthPayload>) => {
          localStorage.setItem(LocalStorageKeys.TOKEN, payload.token);
          state.accessToken = payload.token;
        }
      )
      .addMatcher(
        authApi.endpoints.user.matchFulfilled,
        (state, { payload }: PayloadAction<IUser>) => {
          localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(payload));
          state.user = payload;
        }
      )
      .addMatcher(
        authApi.endpoints.user.matchFulfilled,
        (state, { payload }: PayloadAction<IUser>) => {
          localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(payload));
          state.user = payload;
        }
      );
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;

export const userSelector = (store: RootState) => store.auth.user;
