export interface IActivitysApiParams {
  maxResultCount: number;
  skipCount: number;
  caAddresses: string[];
  transactionTypes: string[];
  chainId: string;
  symbol: string;
}
