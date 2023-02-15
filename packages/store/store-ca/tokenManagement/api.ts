import { request } from '@portkey/api/api-did';
import { UserTokenListType } from '@portkey/types/types-ca/token';
import { isAddress } from '@portkey/utils';

export function fetchUserTokenList({
  filter = '',
  pageSize,
  pageNo,
}: {
  filter?: string;
  pageSize: number;
  pageNo: number;
}): Promise<{ items: UserTokenListType }> {
  const filterWords = isAddress(filter) ? `token.address:'${filter}'` : `token.symbol:*${filter}~*`;
  return request.es.getUserTokenList({
    params: {
      filter: filterWords,
      // sort: 'token.symbol.keyword',
      sort: 'sortWeight',
      sortType: 1,
      skipCount: (pageNo - 1) * pageSize,
      maxResultCount: pageSize,
    },
  });
}
