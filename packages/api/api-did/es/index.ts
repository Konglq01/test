import { ESBaseConfig } from './type';

const Method = 'GET';
const BaseESUrl = `/api/app/Es/`;

const KeyList = ['getUserTokenList'] as const;

const ApiObject: Record<typeof KeyList[number], ESBaseConfig> = {
  getUserTokenList: {
    target: `${BaseESUrl}usertokenindex`,
    config: {
      method: Method,
      params: {
        filter: '(token.symbol:ELF AND token.chainId:AELF) OR token.symbol:READ',
        fort: 'token.symbol.keyword',
        sortType: 0,
      },
    },
  },
};

export default ApiObject;
