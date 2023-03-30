export enum TypeEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface LimitType {
  min: number;
  max: number;
}

export interface CryptoInfoType {
  crypto: string;
  network: string;
  networkName: string;
}
