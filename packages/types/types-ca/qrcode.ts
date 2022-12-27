import { ChainType, NetworkType } from '..';

export interface QRData {
  type: 'login' | 'send' ;
  netWorkType: NetworkType;
  chainType: ChainType; // eth or nft
  address: string;
}

export interface LoginQRData extends QRData {
  type: 'login';
}

export interface SendTokenQRData extends QRData {
  type:"send"
  tokenInfo?:{
    symbol:String; 
    address:String; // token address
    chainId:String; // AELF or tDVV
    decimal:String; // elf is "8"
  }
}
