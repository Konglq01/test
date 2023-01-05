import { LoginType } from '@portkey/types/types-ca/wallet';

export interface loginInfo {
  loginGuardianType: string; // account
  accountLoginType: LoginType;
  createType?: 'register' | 'login' | 'scan';
  managerUniqueId: string;
  walletInfo?: any;
}

export interface LoginState {
  loginAccount?: loginInfo;
}
