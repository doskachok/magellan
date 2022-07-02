import { createSlice } from '@reduxjs/toolkit';
import { LocalStorageKeys } from '../../constants/localStorageKeys';
import { RootState } from '../../store';
import { authApi } from './api';

interface ISliceState {
  user: { email: string } | null;
  accessToken: string | null;
}

interface IAuthPayload {
  email: string,
  token: string
}

const initialState: ISliceState = {
  accessToken: localStorage.getItem(LocalStorageKeys.TOKEN),
  user: JSON.parse(localStorage.getItem(LocalStorageKeys.USER) as string),
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logOut: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.clear();
    }
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }: { payload: IAuthPayload }) => {
        localStorage.setItem(LocalStorageKeys.TOKEN, payload.token);
        localStorage.setItem(LocalStorageKeys.USER, JSON.stringify({ email: payload.email }));

        state.accessToken = payload.token;
        state.user = { email: payload.email };
      }
    )
  }
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;

export const userSelector = (store: RootState) => store.auth.user;
