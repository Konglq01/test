import response from './data.json';
import { request } from '@portkey/api/api-did';

console.log(response);

const MOCK_RESPONSE = {
  data: response.data.list.map(ele => {
    return {
      ...ele,
      isDefault: ele.symbol === 'ELF',
    };
  }),
};

export function fetchUserTokenList({
  pageSize,
  pageNo,
}: {
  pageSize: number;
  pageNo: number;
}): Promise<{ items: any[] }> {
  return request.es.getUserTokenList({
    params: { skipCount: (pageNo - 1) * pageSize, maxResultCount: pageSize },
  });
}
