import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const TOKEN_KEY = 'ACCESS_TOKEN';
const USER_ID_KEY = 'USER_ID';

export interface Credentials {
  id: string;
  token: string;
}

interface AuthState {
  token: string | null;
  userId: string | null;
}

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const persistCredentials = (credentials: Credentials | null) => {
  try {
    if (credentials) {
      localStorage.setItem(TOKEN_KEY, credentials.token);
      localStorage.setItem(USER_ID_KEY, credentials.id);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode); the session then lives in memory only.
  }
};

const initialState: AuthState = {
  token: readStorage(TOKEN_KEY),
  userId: readStorage(USER_ID_KEY),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credentialsReceived: (state, { payload }: PayloadAction<Credentials>) => {
      state.token = payload.token;
      state.userId = payload.id;
    },
    loggedOut: state => {
      state.token = null;
      state.userId = null;
    },
  },
  selectors: {
    selectToken: state => state.token,
    selectUserId: state => state.userId,
  },
});

export const { credentialsReceived, loggedOut } = authSlice.actions;
export const { selectToken, selectUserId } = authSlice.selectors;
export default authSlice;
