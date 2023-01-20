import { WalletInfoType } from '../wallet';
import { ChainId, NetworkType } from '@portkey/types';
import { VerificationType } from '../verifier';

export type ManagerInfo = {
  managerUniqueId: string;
  loginAccount: string;
  type: LoginType;
  verificationType: VerificationType;
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
