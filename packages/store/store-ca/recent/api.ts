import { request } from '@portkey-wallet/api/api-did';
import { mockRecentData } from './data';

export function fetchRecentTransactionUsers({
  caAddresses = [],
  skipCount = 0,
  maxResultCount = 10,
}: {
  caAddresses?: string[];
  skipCount?: number;
  maxResultCount?: number;
}): Promise<any> {
  return new Promise(resolve => setTimeout(() => resolve(mockRecentData), 500));
  // return request.recent.fetchRecentTransactionUsers({
  //   params: {
  //     caAddresses,
  //     skipCount,
  //     maxResultCount,
  //   },
  // });
}
