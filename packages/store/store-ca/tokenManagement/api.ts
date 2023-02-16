import { request } from '@portkey/api/api-did';
import { UserTokenListType } from '@portkey/types/types-ca/token';
import { isAddress } from '@portkey/utils';

export function fetchUserTokenList({
  pageSize,
  pageNo,
  keyword,
  chainIdArray = ['AELF', 'tDVV', 'tDVW'],
}: {
  pageSize: number;
  pageNo: number;
  keyword: string;
  chainIdArray?: string[];
}): Promise<{ items: UserTokenListType }> {
  const chainIdSearchLanguage = chainIdArray.map(chainId => `token.chainId:${chainId}`).join(' OR ');

  const filterKeywords = keyword?.length < 10 ? `token.symbol:*${keyword}*~` : `token.address:${keyword}`;

  return request.es.getUserTokenList({
    params: {
      filter: `${filterKeywords} AND (${chainIdSearchLanguage})`,
      sort: 'sortWeight desc,token.symbol acs',
      skipCount: (pageNo - 1) * pageSize,
      maxResultCount: pageSize,
    },
  });
}
