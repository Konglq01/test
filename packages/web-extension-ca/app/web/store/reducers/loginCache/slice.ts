import { randomId } from '@portkey/utils';
import { createSlice } from '@reduxjs/toolkit';
import { setLoginAccountAction, resetLoginInfoAction, setWalletInfoAction, setGuardianCountAction } from './actions';
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
      .addCase(setWalletInfoAction, (state, action) => {
        const { walletInfo, caWalletInfo } = action.payload;
        state.scanWalletInfo = walletInfo;
        state.scanCaWalletInfo = caWalletInfo;
      })
      .addCase(setGuardianCountAction, (state, action) => {
        state.guardianCount = action.payload;
      })
      .addCase(resetLoginInfoAction, () => initialState);
  },
});
