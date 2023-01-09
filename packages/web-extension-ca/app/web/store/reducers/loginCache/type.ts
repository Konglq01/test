import { CAInfoType, LoginType } from '@portkey/types/types-ca/wallet';

export interface loginInfo {
  loginGuardianType: string; // account
  accountLoginType: LoginType;
  createType?: 'register' | 'login' | 'scan';
  managerUniqueId: string;
}

export interface LoginState {
  loginAccount?: loginInfo;
  guardianCount?: number;
  scanWalletInfo?: any;
  scanCaWalletInfo?: CAInfoType;
}
