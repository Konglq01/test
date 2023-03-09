import { request } from '@portkey-wallet/api/api-did';
import { NetworkType } from '@portkey-wallet/types/index';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { IAssetItemType } from './type';

const data = [0, 1, 2, 3, 4, 5, 6, 7].map((ele, index) => {
  return {
    isDefault: false, // boolean,
    symbol: `${index}ELF`, // "ELF"   the name showed
    tokenName: `${index}ELF`, //  "ELF"
    chainId: 1, // string "AELF"
    decimals: 8,
    address: `${index}-ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B`,
  };
});

type ITokenItemResponse = Omit<TokenItemShowType, 'name' | 'address'>;

export function fetchTokenList({
  // todo maybe remote tokenList change
  skipCount = 0,
  maxResultCount = 1000,
  caAddresses,
}: {
  skipCount?: number;
  maxResultCount?: number;
  caAddresses: string[];
}): Promise<{
  data: ITokenItemResponse[];
  totalRecordCount: number;
}> {
  console.log('fetching....list', skipCount, maxResultCount);
  // return new Promise(resolve => setTimeout(() => resolve(mockTokenData), 500));
  return request.assets.fetchAccountTokenList({
    params: {
      caAddresses,
      skipCount,
      maxResultCount,
    },
  });
}

export function fetchAssetList({
  caAddresses,
  maxResultCount,
  skipCount,
  keyword = '',
}: {
  caAddresses: string[];
  maxResultCount: number;
  skipCount: number;
  keyword: string;
}): Promise<{ data: IAssetItemType[]; totalRecordCount: number }> {
  return request.assets.fetchAccountAssetsByKeywords({
    params: {
      CaAddresses: caAddresses,
      SkipCount: skipCount,
      MaxResultCount: maxResultCount,
      Keyword: keyword,
    },
  });
}

export function fetchNFTSeriesList({
  caAddresses = [],
  skipCount = 0,
  maxResultCount = 1000,
}: {
  caAddresses: string[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: any[]; totalRecordCount: number }> {
  return request.assets.fetchAccountNftCollectionList({
    params: {
      caAddresses,
      skipCount,
      maxResultCount,
    },
  });
}

export function fetchNFTList({
  symbol,
  caAddresses,
  skipCount = 0,
  maxResultCount = 1000,
}: {
  symbol: string;
  caAddresses: string[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: any[]; totalRecordCount: number }> {
  return request.assets.fetchAccountNftCollectionItemList({
    params: { caAddresses, symbol, skipCount, maxResultCount },
  });
}

export function fetchTokenPrices({
  symbols,
}: {
  symbols: string[];
}): Promise<{ items: { symbol: string; priceInUsd: number }[]; totalRecordCount: number }> {
  console.log('fetchTokenPrices....');

  return request.token.fetchTokenPrice({
    params: {
      symbols,
    },
  });
}
