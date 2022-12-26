import { createSlice } from '@reduxjs/toolkit';
import { setLoginAccountAction } from './actions';
import { LoginState } from './type';

const initialState: LoginState = {};
export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(setLoginAccountAction, (state, action) => {
      state.loginAccount = action.payload;
    });
  },
});
