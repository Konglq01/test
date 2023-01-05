import { randomId } from '@portkey/utils';
import { createSlice } from '@reduxjs/toolkit';
import { setLoginAccountAction, resetLoginInfoAction } from './actions';
import { LoginState } from './type';

const initialState: LoginState = {};
export const loginSlice = createSlice({
  name: 'loginCache',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setLoginAccountAction, (state, action) => {
        state.loginAccount = { ...action.payload, managerUniqueId: randomId() };
      })
      .addCase(resetLoginInfoAction, () => initialState);
  },
});
