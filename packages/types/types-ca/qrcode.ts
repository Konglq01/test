import { ChainType, NetworkType } from '..';

export interface QRData {
  type: 'login' | 'token' | 'nft';
  netWorkType: NetworkType;
  chainType: ChainType;
}

export interface LoginQRData extends QRData {
  type: 'login';
  address: string;
}
