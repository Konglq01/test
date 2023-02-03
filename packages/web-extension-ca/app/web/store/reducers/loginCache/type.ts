import { CAInfoType, LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierInfo } from '@portkey/types/verifier';

export interface LoginInfo {
  guardianAccount: string; // account
  loginType: LoginType;
  createType?: 'register' | 'login' | 'scan';
}

export interface LoginState {
  loginAccount?: LoginInfo;
  guardianCount?: number;
  scanWalletInfo?: any;
  scanCaWalletInfo?: CAInfoType;
  registerVerifier?: VerifierInfo;
}
