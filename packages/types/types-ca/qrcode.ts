import { ChainType, NetworkType } from '..';
import { TokenItemShowType } from './token';
import { DeviceType } from './wallet';

export interface QRData {
  type: 'login' | 'send';
  netWorkType: NetworkType;
  chainType: ChainType; // eth or nft
  address: string;
}

export interface LoginQRData extends QRData {
  type: 'login';
  deviceType: DeviceType;
}

export interface SendTokenQRDataType extends QRData {
  type: 'send';
  tokenInfo: TokenItemShowType;
  toCaAddress: string;
}
