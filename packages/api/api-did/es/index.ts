import { ESBaseConfig } from './type';

const Method = 'GET';
const BaseESUrl = `/api/app/search/`;

const KeyList = ['getUserTokenList', 'getChainsInfo', 'getRegisterResult', 'getRecoverResult'] as const;

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
  getChainsInfo: {
    target: `${BaseESUrl}chainsinfoindex`,
    config: { method: Method },
  },
  getRegisterResult: {
    target: `${BaseESUrl}accountregisterindex`,
    config: { method: Method },
  },
  getRecoverResult: {
    target: `${BaseESUrl}accountrecoverindex`,
    config: { method: Method },
  },
};

export default ApiObject;
