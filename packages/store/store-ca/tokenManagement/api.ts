import response from './data.json';

console.log(response);

const MOCK_RESPONSE = {
  data: response.data.list.map(ele => {
    return {
      ...ele,
      isDefault: ele.symbol === 'ELF',
    };
  }),
};

export function fetchTokenList({
  // todo maybe remote tokenList change
  chainId,
  pageSize,
  pageNo,
}: {
  chainId: string;
  pageSize: number;
  pageNo: number;
}): Promise<{ data: any[] }> {
  console.log('fetching....list', chainId, pageSize, pageNo);
  return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSE), 1000));
}
