export interface ITokenInfoType {
  balance: string;
  decimals: string;
  balanceInUsd: string;
}

export interface INftInfoType {
  imageUrl: string;
  alias: string;
  tokenId: string;
  collectionName: string;
  quantity: string;
}

export interface IAssetItemType {
  chainId: string;
  symbol: string;
  address: string;
  tokenInfo?: ITokenInfoType;
  nftInfo?: INftInfoType;
}
