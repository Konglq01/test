import { request } from '@portkey/api/api-did';

export function fetchRecentTransactionUsers({
  caAddresses = ['TxXSwp2P9mxeFnGA9DARi2qW1p3PskLFXyBix1GDerQFL7VD5'],
  skipCount = 0,
  maxResultCount = 10,
}: {
  caAddresses?: string[];
  skipCount?: number;
  maxResultCount?: number;
}): Promise<{ data: any }> {
  // return new Promise(resolve => setTimeout(() => resolve(mockNFTSeriesData), 500));
  return request.recent.fetchRecentTransactionUsers({
    params: {
      caAddresses,
      skipCount,
      maxResultCount,
    },
  });
}
