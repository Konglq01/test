import { CAInfoType } from '@portkey/types/types-ca/wallet';
import { VerifierInfo } from '@portkey/types/verifier';
import { createAction } from '@reduxjs/toolkit';
import { LoginInfo } from './type';

export const setLoginAccountAction = createAction<Omit<LoginInfo, 'managerUniqueId'>>('login/setLoginAccount');
export const setWalletInfoAction = createAction<{
  walletInfo: any;
  caWalletInfo: CAInfoType;
}>('login/setWalletInfo');

export const resetLoginInfoAction = createAction('login/resetLoginInfo');

export const setRegisterVerifierAction = createAction<VerifierInfo>('login/setRegisterVerifier');
