import { CAInfoType, LoginType } from '@portkey/types/types-ca/wallet';

export interface LoginInfo {
  loginGuardianType: string; // account
  accountLoginType: LoginType;
  createType?: 'register' | 'login' | 'scan';
  managerUniqueId: string;
}

export interface LoginState {
  loginAccount?: LoginInfo;
  guardianCount?: number;
  scanWalletInfo?: any;
  scanCaWalletInfo?: CAInfoType;
}
