import { request } from '@portkey/api/api-did';

export function fetchRecentTransactionUsers({
  CaAddresses = ['TxXSwp2P9mxeFnGA9DARi2qW1p3PskLFXyBix1GDerQFL7VD5'],
  SkipCount = 0,
  MaxResultCount = 10,
}: {
  CaAddresses?: string[];
  SkipCount?: number;
  MaxResultCount?: number;
}): Promise<{ data: any }> {
  // return new Promise(resolve => setTimeout(() => resolve(mockNFTSeriesData), 500));
  return request.recent.fetchRecentTransactionUsers({
    params: {
      CaAddresses,
      SkipCount,
      MaxResultCount,
    },
  });
}
