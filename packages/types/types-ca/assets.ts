export type TokenBaseItemType = {
  chainId: string;
  token: {
    id: string;
    chainId: string;
    symbol: string;
    address: string;
  };
  amount: string | number;
  amountUsd: string | number;
};

export type NFTSeriesBaseItemType = {
  id?: string;
  chainId: string;
  nftTokenId: string;
  tokenHash: string;
  amount: string;
  isFetching: boolean;
  SkipCount: number;
  MaxResultCount: number;
  totalCount: string | number;
  children?: NFTBaseItemType[];
};

export type NFTBaseItemType = {
  symbol: string;
  nftType: string;
  totalSupply: string;
  baseUri: string;
  totalCount: string | number;
};

export type RateBaseType = {
  symbol: string;
  usdPrice: string | number;
};
