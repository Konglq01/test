const baseESUrl = `/api/app/Es/`;

const apiObject = {
  getUserTokenList: {
    target: `${baseESUrl}usertokenindex`,
    config: {
      params: {
        filter: '(token.symbol:ELF AND token.chainId:AELF) OR token.symbol:READ',
        fort: 'token.symbol.keyword',
        sortType: 0,
      },
    },
  },
} as const;

export default apiObject;
