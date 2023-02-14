import { request } from '@portkey/api/api-did';
import { UserTokenListType } from '@portkey/types/types-ca/token';

export function fetchUserTokenList({
  pageSize,
  pageNo,
}: {
  pageSize: number;
  pageNo: number;
}): Promise<{ items: UserTokenListType }> {
  return request.es.getUserTokenList({
    params: {
      filter: 'token.symbol:*CP*',
      // filter: 'token.chainId:AELF AND token.chainId:tDVV',
      // sort: 'token.chainId',
      sort: 'sortWeight',
      sortType: 1,
      skipCount: (pageNo - 1) * pageSize,
      maxResultCount: pageSize,
    },
  });
}
