import { WalletInfoType } from '../wallet';
import { ChainId, NetworkType } from '@portkey/types';
import { VerificationType } from '../verifier';

export type ManagerInfo = {
  managerUniqueId: string;
  loginAccount: string;
  type: LoginType;
  verificationType: VerificationType;
  requestId?: string;
};

export enum LoginType {
  email,
  phone,
}

export type TLoginStrType = 'Email' | 'PhoneNumber';

export interface CAInfo {
  caAddress: string;
  caHash: string;
  // TODO: id
}
export type CAInfoType = {
  managerInfo?: ManagerInfo;
} & { [key in ChainId]?: CAInfo };

export interface CAWalletInfoType extends WalletInfoType {
  caInfo: {
    [key in NetworkType]: CAInfoType;
  };
}

export type RegisterStatus = 'pass' | 'pending' | 'fail' | null;

export interface CreateWalletResult {
  caAddress: string;
  caHash: string;
  message: null | string;
  status: Omit<RegisterStatus, 'pending'>;
}

export interface RegisterBody {
  caAddress: string;
  caHash: string;
  registerMessage: null | string;
  registerStatus: RegisterStatus;
}

export interface RecoverBody {
  caAddress: string;
  caHash: string;
  recoverMessage: null | string;
  recoverStatus: RegisterStatus;
}

export interface CaAccountRegisterResult {
  requestId: string;
  body: RegisterBody;
}

export interface CaAccountRecoverResult {
  requestId: string;
  body: RecoverBody;
}
