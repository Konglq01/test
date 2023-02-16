import { mockAssetsData, mockNFTSeriesData, mockNFTsData, mockTokenData } from './data';
import { request } from '@portkey/api/api-did';
import { NetworkType } from '@portkey/types/index';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { TokenItemShowType } from '@portkey/types/types-ca/token';

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

export function fetchAssetList({
  caAddresses,
  pageSize,
  pageNo,
  keyWord,
}: {
  caAddresses: string[];
  pageSize: number;
  pageNo: number;
  keyWord: string;
}): Promise<{ data: any[]; totalRecordCount: number }> {
  console.log('fetching....list', caAddresses, pageSize, pageNo);
  return request.assets.fetchAccountAssetsByKeywords({
    params: {
      caAddresses,
      skipCount: (pageNo - 1) * pageSize,
      maxResultCount: pageSize,
      keyWord,
    },
  });
}

export function fetchNFTSeriesList({
  caAddresses = ['TxXSwp2P9mxeFnGA9DARi2qW1p3PskLFXyBix1GDerQFL7VD5'],
  skipCount = 0,
  maxResultCount = 100,
}: {
  caAddresses: string[];
  skipCount: number;
  maxResultCount: number;
}): Promise<{ data: any[]; totalRecordCount: number }> {
  // return new Promise(resolve => setTimeout(() => resolve(mockNFTSeriesData), 500));
  return request.assets.fetchAccountNftProtocolList({
    params: {
      caAddresses,
      skipCount,
      maxResultCount,
    },
  });
}

export function fetchNFTList({
  // todo maybe remote tokenList change
  networkType,
  pageSize,
  pageNo,
  id,
}: {
  networkType: NetworkType;
  pageSize: number;
  pageNo: number;
  id: string;
}): Promise<{ data: any[]; totalRecordCount: number }> {
  console.log('fetching....list', networkType, pageSize, pageNo);

  return new Promise(resolve => setTimeout(() => resolve([] as any), 500));
}
