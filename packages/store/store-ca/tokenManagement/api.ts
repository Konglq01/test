import { request } from '@portkey/api/api-did';

export function fetchAllTokenList({
  maxResultCount,
  skipCount,
  keyword,
  chainIdArray,
}: {
  maxResultCount?: number;
  skipCount?: number;
  keyword: string;
  chainIdArray: string[];
}): Promise<{ items: any[]; totalRecordCount: number }> {
  const chainIdSearchLanguage = chainIdArray.map(chainId => `token.chainId:${chainId}`).join(' OR ');

  const filterKeywords = keyword?.length < 10 ? `token.symbol:*${keyword}*~` : `token.address:${keyword}`;

  return request.es.getUserTokenList({
    params: {
      filter: `${filterKeywords} OR (${chainIdSearchLanguage})`,
      sort: 'sortWeight desc,token.symbol acs',
      skipCount: 0,
      maxResultCount: 1000,
    },
  });
}
