import { DefaultChainId, NetworkList } from '@portkey/constants/constants-ca/network';
import { ChainId, NetworkType } from '@portkey/types';
import { CAInfo, CAInfoType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { WalletInfoType } from '@portkey/types/wallet';
import { checkPinInput, formatWalletInfo } from '@portkey/utils/wallet';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import AElf from 'aelf-sdk';
import { getChainList } from './api';
import { ChainItemType, WalletState } from './type';

export const createWallet =
  ({
    walletInfo,
    pin,
    networkType,
    caInfo,
  }: {
    walletInfo?: any;
    pin: string;
    networkType?: NetworkType;
    caInfo?: CAInfoType;
  }): any =>
  async (dispatch: any) => {
    // check pin
    const pinMessage = checkPinInput(pin);
    if (pinMessage) throw new Error(pinMessage);

    if (!walletInfo) walletInfo = AElf.wallet.createNewWallet();
    const walletObj = formatWalletInfo(walletInfo, pin, 'walletName');
    if (walletObj) {
      const { walletInfo: newWalletInfo } = walletObj;
      dispatch(createWalletAction({ walletInfo: newWalletInfo, networkType, caInfo }));
      return true;
    }
    throw new Error('createWallet fail');
  };
export const createWalletAction = createAction<{
  walletInfo: WalletInfoType;
  networkType?: NetworkType;
  caInfo?: CAInfoType;
}>('wallet/createWallet');

export const setManagerInfo = createAction<{
  networkType?: NetworkType;
  pin: string;
  managerInfo: ManagerInfo;
}>('wallet/setManagerInfo');

export const setCAInfo = createAction<{
  caInfo: CAInfo;
  pin: string;
  chainId: ChainId;
  networkType?: NetworkType;
}>('wallet/setCAInfo');

export const setCAInfoType = createAction<{
  caInfo: CAInfoType;
  pin: string;
  networkType?: NetworkType;
}>('wallet/setCAInfoType');

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
export const setChainListAction = createAction<{ chainList: ChainItemType[]; networkType: NetworkType }>(
  'wallet/setChainListAction',
);

export const getChainListAsync = createAsyncThunk(
  'wallet/getChainList',
  async (type: NetworkType | undefined, { getState, dispatch }) => {
    const {
      wallet: { currentNetwork },
    } = getState() as { wallet: WalletState };
    const _networkType = type ? type : currentNetwork;
    const baseUrl = NetworkList.find(item => item.networkType === _networkType)?.apiUrl;
    if (!baseUrl) throw Error('Unable to obtain the corresponding network');
    const response = await getChainList({ baseUrl });
    if (!response?.items) throw Error('No data');
    dispatch(setChainListAction({ chainList: response.items, networkType: _networkType }));
    return [response.items, response.items.find((item: any) => item.chainId === DefaultChainId)];
  },
);
