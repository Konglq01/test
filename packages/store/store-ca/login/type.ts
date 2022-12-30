import { LoginType } from '@portkey/types/verifier';

export interface loginInfo {
  loginGuardianType: string; // account
  accountLoginType: LoginType;
  createType?: 'register' | 'login';
  managerUniqueId: string;
  caHash?: string;
}

export interface LoginState {
  loginAccount?: loginInfo;
}
