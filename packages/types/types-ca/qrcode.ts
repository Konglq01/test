import { ChainId, ChainType, NetworkType } from '..';
import { DeviceInfoType } from './device';
import { IToSendAssetParamsType } from './routeParams';
import { TokenItemShowType } from './token';

export interface QRData {
  type: 'login' | 'send';
  netWorkType: NetworkType;
  chainType: ChainType; // eth or nft
  address: string;
}

export interface LoginQRData extends QRData {
  type: 'login';
  deviceInfo: DeviceInfoType;
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
