import { WalletInfoType } from '../wallet';
import { ChainId, NetworkType } from '@portkey/types';

export type ManagerInfo = {
  managerUniqueId: string;
  loginGuardianType: string;
  type: LoginType;
};

export enum LoginType {
  email,
  phone,
}

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
