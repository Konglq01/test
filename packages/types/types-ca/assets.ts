// nft collection types
export type NFTCollectionItemBaseType = {
  chainId: string;
  collectionName: string;
  imageUrl: string;
  itemCount: number;
  symbol: string;
};

export interface NFTCollectionItemShowType extends NFTCollectionItemBaseType {
  isFetching: boolean;
  skipCount: number;
  maxResultCount: number;
  totalRecordCount: string | number;
  children: NFTItemBaseType[];
}

// nft item types
export type NFTItemBaseType = {
  chainId: string;
  symbol: string;
  tokenId: string;
  alias: string;
  quantity: string;
  imageUrl: string;
};

// assets types
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
