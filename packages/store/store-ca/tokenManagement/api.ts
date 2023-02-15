import { request } from '@portkey/api/api-did';
import { UserTokenListType } from '@portkey/types/types-ca/token';
import { isAddress } from '@portkey/utils';

export function fetchUserTokenList({
  filter = '',
  pageSize,
  pageNo,
  keyword,
  chainIdArray = ['AELF'],
}: {
  filter?: string;
  pageSize: number;
  pageNo: number;
  keyword: string;
  chainIdArray?: string[];
}): Promise<{ items: UserTokenListType }> {
  const chainIdSearchLanguage = chainIdArray.map(chainId => `token.chainId:${chainId}`).join(' AND ');

  const filterKeyWords = keyword?.length < 10 ? `token.symbol:*${keyword}*~` : `token.address:${keyword}`;

  return request.es.getUserTokenList({
    params: {
      filter: `${filterKeyWords} AND ${chainIdSearchLanguage}`,
      // sort: 'token.chainId',
      sort: 'sortWeight',
      sortType: 1,
      skipCount: (pageNo - 1) * pageSize,
      maxResultCount: pageSize,
    },
  });
}
