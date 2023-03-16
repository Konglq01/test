export type CreateType = 'Import' | 'Create';
export type InfoActionType = 'add' | 'update' | 'remove';
export type RegisterType = 'login' | 'signUp';

export type isRegisterType = 0 | 1 | 2;

export interface AESEncryptWalletParam {
  AESEncryptPrivateKey?: string;
  AESEncryptMnemonic?: string;
}
