import { NetworkType } from '@portkey/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { checkPassword } from './utils';
import {
  changePin,
  createWalletAction,
  getChainListAsync,
  resetWallet,
  setCAInfo,
  setSessionId,
  updateWalletNameAsync,
} from './actions';
import { WalletError, WalletState } from './type';
import { changeEncryptStr } from '../../wallet/utils';

const initialState: WalletState = {
  walletAvatar: `master${(Math.floor(Math.random() * 10000) % 6) + 1}`,
  walletType: 'aelf',
  walletName: 'Wallet 01',
  currentNetwork: 'TESTNET',
  chainList: [],
};
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    changeNetworkType: (state, action: PayloadAction<NetworkType>) => {
      state.currentNetwork = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(resetWallet, () => initialState)
      .addCase(createWalletAction, (state, action) => {
        if (state.walletInfo?.AESEncryptMnemonic) throw new Error(WalletError.walletExists);
        const currentNetwork = action.payload.networkType || state.currentNetwork || initialState.currentNetwork;

        state.walletInfo = {
          ...action.payload.walletInfo,
          caInfo: { [currentNetwork]: { sessionId: action.payload.sessionId } } as any,
        };
      })
      .addCase(setCAInfo, (state, action) => {
        const { pin, caInfo, chainId } = action.payload;
        // check pin
        checkPassword(state.walletInfo?.AESEncryptMnemonic, pin);
        const currentNetwork = action.payload.networkType || state.currentNetwork || initialState.currentNetwork;
        if (!state.walletInfo?.AESEncryptMnemonic) throw new Error(WalletError.noCreateWallet);
        state.walletInfo.caInfo[currentNetwork] = {
          ...state.walletInfo.caInfo[currentNetwork],
          [chainId]: caInfo,
        } as any;
      })
      .addCase(setSessionId, (state, action) => {
        const { pin, sessionId } = action.payload;
        // check pin
        checkPassword(state.walletInfo?.AESEncryptMnemonic, pin);
        const currentNetwork = action.payload.networkType || state.currentNetwork || initialState.currentNetwork;
        if (!state.walletInfo?.AESEncryptMnemonic) throw new Error(WalletError.noCreateWallet);
        if (state.walletInfo.caInfo[currentNetwork]) throw new Error(WalletError.caAccountExists);
        state.walletInfo.caInfo[currentNetwork] = { sessionId };
      })
      .addCase(changePin, (state, action) => {
        const { pin, newPin } = action.payload;
        // check pin
        checkPassword(state.walletInfo?.AESEncryptMnemonic, pin);
        if (!state.walletInfo) throw new Error(WalletError.noCreateWallet);
        state.walletInfo.AESEncryptMnemonic = changeEncryptStr(state.walletInfo.AESEncryptMnemonic, pin, newPin);
        state.walletInfo.AESEncryptPrivateKey = changeEncryptStr(state.walletInfo.AESEncryptPrivateKey, pin, newPin);
      })
      .addCase(updateWalletNameAsync.fulfilled, (state, action) => {
        state.walletName = action.payload;
        // TODO: add success tips
      })
      .addCase(updateWalletNameAsync.rejected, (state, action) => {
        // TODO: add error tips
      })
      .addCase(getChainListAsync.fulfilled, (state, action) => {
        state.chainList = action.payload;
      })
      .addCase(getChainListAsync.rejected, (state, action) => {});
  },
});
