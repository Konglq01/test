import walletApi from './wallet';
import verificationApi from './verification';
import contactApi from './contact';
import chainApi from './chain';
import myServer from './server';
import { API_REQ_FUNCTION } from './types';

export const DEFAULT_METHOD = 'POST';

/**
 * api request configuration directory
 * @example
 *    upload: {
 *      target: '/api/file-management/file-descriptor/upload',
 *      baseConfig: { method: 'POST', },
 *    },
 * or:
 *    upload:'/api/file-management/file-descriptor/upload'
 *
 * @description api configuration default method is from DEFAULT_METHOD
 * @type {UrlObj}  // The type of this object from UrlObj.
 */

export const BASE_APIS = {};

export const EXPAND_APIS = { wallet: walletApi, verify: verificationApi, contact: contactApi, chain: chainApi };

export type BASE_REQ_TYPES = {
  [x in keyof typeof BASE_APIS]: API_REQ_FUNCTION;
};

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof typeof EXPAND_APIS[X]]: API_REQ_FUNCTION;
  };
};

console.log(myServer, 'myServer===ServiceInit');
myServer.parseRouter('base', BASE_APIS);

Object.entries(EXPAND_APIS).forEach(([key, value]) => {
  myServer.parseRouter(key, value as any);
});

const request = myServer as unknown as BASE_REQ_TYPES & EXPAND_REQ_TYPES;

export { request };
