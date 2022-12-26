import { ChainId, NetworkType } from '@portkey/types';
import { CAInfo } from '@portkey/types/types-ca/wallet';
import { WalletInfoType } from '@portkey/types/wallet';
import { checkPinInput, formatWalletInfo } from '@portkey/utils/wallet';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import AElf from 'aelf-sdk';
import { getChainList } from './api';

export const createWallet =
  ({
    walletInfo,
    pin,
    sessionId,
    networkType,
  }: {
    walletInfo?: any;
    pin: string;
    sessionId: string;
    networkType?: NetworkType;
  }): any =>
  async (dispatch: any) => {
    // check pin
    const pinMessage = checkPinInput(pin);
    if (pinMessage) throw new Error(pinMessage);

    if (!walletInfo) walletInfo = AElf.wallet.createNewWallet();
    const walletObj = formatWalletInfo(walletInfo, pin, 'walletName');
    if (walletObj) {
      const { walletInfo: newWalletInfo } = walletObj;
      dispatch(createWalletAction({ walletInfo: newWalletInfo, networkType, sessionId }));
      return true;
    }
    throw new Error('createWallet fail');
  };
export const createWalletAction = createAction<{
  walletInfo: WalletInfoType;
  networkType?: NetworkType;
  sessionId: string;
}>('wallet/createWallet');

export const setSessionId = createAction<{
  networkType?: NetworkType;
  pin: string;
  sessionId: string;
}>('wallet/setSessionId');

export const setCAInfo = createAction<{
  caInfo: CAInfo;
  pin: string;
  chainId: ChainId;
  networkType?: NetworkType;
}>('wallet/setCAInfo');

export const resetWallet = createAction('wallet/resetWallet');
export const changePin = createAction<{ pin: string; newPin: string }>('wallet/changePin');

export const updateWalletNameAsync = createAsyncThunk('wallet/updateWalletNameAsync', async (walletName: string) => {
  // TODO: add update api
  const response: string = await new Promise(resolve =>
    setTimeout(() => {
      resolve(walletName);
    }, 500),
  );
  return response;
});

export const changeNetworkType = createAction<NetworkType>('wallet/changeNetworkType');

export const getChainListAsync = createAsyncThunk('wallet/getChainListAsync', async () => {
  const response = await getChainList();
  return response;
});
