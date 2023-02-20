import { ChainId, ChainType } from '..';

export interface IToSendHomeAssetParamsBaseType {
  chainId: ChainId;
  balance: string;
  imageUrl: string;
  tokenContractAddress: string;
  [key: string]: any;
}

export interface IToSendTokenParamsType extends IToSendHomeAssetParamsBaseType {
  balanceInUsd: string;
  decimals: string;
}

export interface IToSendNftParamsType extends IToSendHomeAssetParamsBaseType {
  alias: string;
  tokenId: string;
}

export type IToSendAssetParamsType = IToSendTokenParamsType & IToSendNftParamsType;

export interface IToSendHomeParamsType {
  sendType: 'nft' | 'token';
  toInfo: {
    address: string;
    name: string;
    chainId?: ChainId;
    chainType?: ChainType;
  };
  assetInfo: IToSendAssetParamsType;
}

export interface IToSendPreviewParamsType extends IToSendHomeParamsType {
  transactionFee: string | number;
  sendNumber: string | number;
}
