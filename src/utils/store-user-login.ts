import { configureStore, createSlice } from '@reduxjs/toolkit';
import { isUserLogin } from './local-storage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: isUserLogin(),
  },
  reducers: {
    loginUserFromStore(state) {
      state.isLoggedIn = true;
    },
    logoutUserFromStore(state) {
      state.isLoggedIn = false;
    },
  },
});

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export const { loginUserFromStore, logoutUserFromStore } = authSlice.actions;
