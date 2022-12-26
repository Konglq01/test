import { WalletInfoType } from '../wallet';
import { ChainId, NetworkType } from '@portkey/types';
export interface CAInfo {
  caAddress: string;
  caHash: string;
  // TODO: id
}
export type CAInfoType = {
  sessionId: string;
} & { [key in ChainId]?: CAInfo };

export interface CAWalletInfoType extends WalletInfoType {
  caInfo: {
    [key in NetworkType]: CAInfoType;
  };
}
