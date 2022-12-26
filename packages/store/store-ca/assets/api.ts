import { mockAssetsData, mockNFTSeriesData, mockNFTsData, mockTokenData } from './data';

import { NetworkType } from '@portkey/types/index';
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
  networkType,
  pageSize,
  pageNo,
}: {
  networkType: NetworkType;
  pageSize: number;
  pageNo: number;
}): Promise<{ data: any }> {
  console.log('fetching....list', networkType, pageSize, pageNo);
  return new Promise(resolve => setTimeout(() => resolve(mockTokenData), 500));
}

export function fetchAssetList({
  // todo maybe remote tokenList change
  networkType,
  pageSize,
  pageNo,
}: {
  networkType: NetworkType;
  pageSize: number;
  pageNo: number;
}): Promise<{ data: any }> {
  console.log('fetching....list', networkType, pageSize, pageNo);

  return new Promise(resolve => setTimeout(() => resolve(mockAssetsData), 500));
}

export function fetchNFTSeriesList({
  networkType,
  pageSize,
  pageNo,
}: {
  networkType: NetworkType;
  pageSize: number;
  pageNo: number;
}): Promise<{ data: any }> {
  console.log('fetching....list', networkType, pageSize, pageNo);

  return new Promise(resolve => setTimeout(() => resolve(mockNFTSeriesData), 500));
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
}): Promise<{ data: any }> {
  console.log('fetching....list', networkType, pageSize, pageNo);

  return new Promise(resolve => setTimeout(() => resolve(mockNFTsData), 500));
}
