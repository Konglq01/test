import { ChainType, NetworkType } from '..';

export interface QRData {
  type: 'login' | 'token' ;
  netWorkType: NetworkType;
  chainType: ChainType; // eth or nft
  address:String;
  tokenInfo?:{
    symbol:String; 
    address:String; // token address
    chainId:String; // AELF or tDVV
    decimal:String; // elf is "8"
  }
}

export interface LoginQRData extends QRData {
  type: 'login';
  address: string;
}
