import { request } from '@portkey-wallet/api/api-did';

export function fetchRecentTransactionUsers({
  caAddresses = [],
  skipCount = 0,
  maxResultCount = 10,
}: {
  caAddresses?: string[];
  skipCount?: number;
  maxResultCount?: number;
}): Promise<any> {
  return request.recent.fetchRecentTransactionUsers({
    params: {
      caAddresses,
      skipCount,
      maxResultCount,
    },
  });
}
