import { mockAssetsData, mockNFTSeriesData, mockNFTsData, mockTokenData } from './data';
import { request } from '@portkey/api/api-did';
import { NetworkType } from '@portkey/types/index';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
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
  data: TokenItemShowType[];
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

export function fetchAssetList(
  baseURL: string,
  {
    caAddresses,
    maxResultCount,
    skipCount,
    keyword = '',
  }: {
    caAddresses: string[];
    maxResultCount: number;
    skipCount: number;
    keyword: string;
  },
): Promise<{ data: IAssetItemType[]; totalRecordCount: number }> {
  return request.assets.fetchAccountAssetsByKeywords({
    baseURL,
    params: {
      CaAddresses: caAddresses,
      SkipCount: skipCount,
      MaxResultCount: maxResultCount,
      Keyword: keyword,
    },
  });
}

const mockData: any[] = [
  {
    chainId: 'AELF',
    symbol: '1',
    imageUrl: '',
    collectionName: 'Mini Kove 1',
    itemCount: 12,
  },
  {
    chainId: 'AELF',
    symbol: '2',
    imageUrl: '',
    collectionName: 'Mini Kove 2',
    itemCount: 12,
  },
];

export function fetchNFTSeriesList({
  caAddresses = ['TxXSwp2P9mxeFnGA9DARi2qW1p3PskLFXyBix1GDerQFL7VD5'],
  skipCount = 0,
  maxResultCount = 100,
}: {
  caAddresses: string[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: any[]; totalRecordCount: number }> {
  // return new Promise(resolve => setTimeout(() => resolve({ data: mockData, totalRecordCount: 2 }), 500));
  console.log('-----------test');

  return request.assets.fetchAccountNftProtocolList({
    params: {
      caAddresses,
      skipCount,
      maxResultCount,
    },
  });
}

const mockNftItem: any[] = [
  {
    chainId: 'AELF',
    symbol: '1',
    tokenId: '#0001',
    alias: 'Knight of Swords 123123',
    quantity: '1',
    imageUrl: '',
  },
  {
    chainId: 'AELF',
    symbol: '2',
    tokenId: '#0002',
    alias: 'Knight of Swords 123123',
    quantity: '1',
    imageUrl: '',
  },
  {
    chainId: 'AELF',
    symbol: '3',
    tokenId: '#0003',
    alias: 'Knight of Swords 123123',
    quantity: '1',
    imageUrl: '',
  },
  {
    chainId: 'AELF',
    symbol: '4',
    tokenId: '#0004',
    alias: 'Knight of Swords 123123',
    quantity: '1',
    imageUrl: '',
  },
  {
    chainId: 'AELF',
    symbol: '5',
    tokenId: '#0005',
    alias: 'Knight of Swords 123123',
    quantity: '1',
    imageUrl: '',
  },
  {
    chainId: 'AELF',
    symbol: '6',
    tokenId: '#0006',
    alias: 'Knight of Swords 123123',
    quantity: '1',
    imageUrl: '',
  },
  {
    chainId: 'AELF',
    symbol: '7',
    tokenId: '#0007',
    alias: 'Knight of Swords 123123',
    quantity: '1',
    imageUrl: '',
  },
  {
    chainId: 'AELF',
    symbol: '8',
    tokenId: '#0008',
    alias: 'Knight of Swords 123123',
    quantity: '1',
    imageUrl: '',
  },
  {
    chainId: 'AELF',
    symbol: '9',
    tokenId: '#0009',
    alias: 'Knight of Swords 123123',
    quantity: '1',
    imageUrl: '',
  },
];

export function fetchNFTList({
  // todo maybe remote tokenList change
  symbol,
  caAddresses,
  skipCount,
  maxResultCount,
}: {
  symbol: string;
  caAddresses: string[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: any[]; totalRecordCount: number }> {
  return request.assets.fetchAccountNftProtocolItemList({ params: { symbol, caAddresses, skipCount, maxResultCount } });
  // return new Promise(resolve => setTimeout(() => resolve({ data: mockNftItem, totalRecordCount: 18 }), 500));
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
