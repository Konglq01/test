import { ChainId, ChainType, NetworkType } from '..';
import { IToSendAssetParamsType } from './routeParams';
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
  sendType: 'nft' | 'token';
  toInfo: {
    address: string;
    name: string;
    chainId?: ChainId;
    chainType?: ChainType;
  };
  assetInfo: IToSendAssetParamsType;
}
