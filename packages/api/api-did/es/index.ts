import { ESBaseConfig } from './type';

const Method = 'GET';
const BaseESUrl = `/api/app/Es/`;

const KeyList = [
  'getUserTokenList',
  'getChainsInfo',
  'getRegisterResult',
  'getRecoverResult',
  'getContactList',
] as const;

const ApiObject: Record<typeof KeyList[number], ESBaseConfig> = {
  getUserTokenList: {
    target: `${BaseESUrl}usertokenindex`,
    config: {
      method: Method,
      params: {
        filter: '(token.symbol:ELF AND token.chainId:AELF) OR token.symbol:READ',
        sort: 'token.symbol.keyword',
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
  getContactList: {
    target: `${BaseESUrl}contactindex`,
    config: {
      method: Method,
    },
  },
};

export default ApiObject;
