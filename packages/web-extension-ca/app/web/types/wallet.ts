export type CreateType = 'Import' | 'Create';
export type InfoActionType = 'add' | 'update' | 'remove';
export type RegisterType = 'Login' | 'Sign up';

export type isRegisterType = 0 | 1 | 2;

export interface AESEncryptWalletParam {
  AESEncryptPrivateKey?: string;
  AESEncryptMnemonic?: string;
}

export type ValidateHandler = (data?: any) => Promise<any>;
