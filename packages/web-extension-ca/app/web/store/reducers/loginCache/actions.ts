import { CAInfoType } from '@portkey/types/types-ca/wallet';
import { createAction } from '@reduxjs/toolkit';
import { loginInfo } from './type';

export const setLoginAccountAction = createAction<Omit<loginInfo, 'managerUniqueId'>>('login/setLoginAccount');
export const setWalletInfoAction = createAction<{
  walletInfo: any;
  caWalletInfo: CAInfoType;
}>('login/setWalletInfo');

export const resetLoginInfoAction = createAction('login/resetLoginInfo');

export const setGuardianCountAction = createAction<number>('login/setWalletInfo');
