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

  const filterKeywords =
    keyword?.length < 10 ? `token.symbol: *${keyword.toUpperCase().trim()}*` : `token.address:${keyword}`;

  return request.es.getUserTokenList({
    params: {
      // filter: `${filterKeywords} AND (${chainIdSearchLanguage})`,
      filter: `${filterKeywords}`,

      sort: 'sortWeight desc,token.symbol acs,token.chainId acs',
      skipCount: 0,
      maxResultCount: 1000,
    },
  });
}
