export type NFTSeriesBaseItemType = {
  id?: string;
  symbol: string;
  nftType: string;
  chainId: string;
  protocolName: string;
  itemCount: number;

  nftTokenId: string;
  tokenHash: string;
  amount: string;
  isFetching: boolean;
  skipCount: number;
  maxResultCount: number;
  totalRecordCount: string | number;
  children?: NFTBaseItemType[];
};

export type NFTBaseItemType = {
  chainId: string;
  tokenId: string;
  alias: string;
  quantity: string;
  imageUrl: string;

  symbol: string;
  nftType: string;
  totalSupply: string;
  baseUri: string;
  totalRecordCount: string | number;
};

export type AssetsItemType = {
  chainId: string;
  symbol: string;
  address: string;
  nftInfo: {
    imageUrl: string;
    alias: string;
    tokenId: string;
    protocolName: string;
    quantity: string;
    metaData: any;
  };
};

export type RateBaseType = {
  symbol: string;
  priceInUsd: string | number;
};
