import { request } from '@portkey/api/api-did';

export function fetchAllTokenList({
  maxResultCount,
  skipCount,
  keyword,
  chainIdArray = ['AELF'],
}: {
  maxResultCount: number;
  skipCount: number;
  keyword: string;
  chainIdArray?: string[];
}): Promise<{ items: any[]; totalRecordCount: number }> {
  const chainIdSearchLanguage = chainIdArray.map(chainId => `token.chainId:${chainId}`).join(' AND ');

  const filterKeyWords = keyword?.length < 10 ? `token.symbol:*${keyword}*~` : `token.address:${keyword}`;

  return request.es.getUserTokenList({
    params: {
      filter: `${filterKeyWords} AND ${chainIdSearchLanguage}`,
      sort: 'sortWeight desc,token.symbol acs',
      skipCount,
      maxResultCount,
    },
  });
}
