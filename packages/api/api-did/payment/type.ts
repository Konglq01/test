export interface OrderQuoteType {
  crypto: string;
  cryptoPrice: string;
  cryptoQuantity: string;
  fiat: string;
  rampFee: string;
  networkFee: string;
}

export interface CryptoInfoType {
  crypto: string;
  network: string;
  buyEnable: number;
  sellEnable: number;
  minPurchaseAmount: number | null;
  maxPurchaseAmount: number | null;
  address: null;
  icon: string;
  minSellAmount: number | null;
  maxSellAmount: number | null;
}
