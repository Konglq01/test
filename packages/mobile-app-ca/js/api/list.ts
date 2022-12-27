// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { API_REQ_FUNCTION, UrlObj } from './types';

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

const RecoveryApiList = {
  managerAddress: '/api/app/account/recovery/managerAddress',
  result: '/api/app/account/recovery/query',
};

const RegisterApiList = {
  managerAddress: '/api/app/account/register/managerAddress',
  result: '/api/app/account/register/query',
};

const VerifyApiList = {
  sendCode: '/api/app/account/register/sendVerificationRequest',
  verifyCode: '/api/app/account/register/verifyCode',
};
/**
 * api request extension configuration directory
 * @description object.key // The type of this object key comes from from @type {UrlObj}
 */
export const EXPAND_APIS = { register: RegisterApiList, verify: VerifyApiList, recovery: RecoveryApiList };

export type BASE_REQ_TYPES = {
  [x in keyof typeof BASE_APIS]: API_REQ_FUNCTION;
};

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof typeof EXPAND_APIS[X]]: API_REQ_FUNCTION;
  };
};
