import { BaseConfig } from './types';

export function spliceUrl(baseUrl: string, extendArg: string = '') {
  const { [baseUrl.length - 1]: lastStr } = baseUrl;
  const { 0: startUrl } = extendArg ?? '';
  let _baserUrl = baseUrl;
  let _url = extendArg;
  if (lastStr === '/') _baserUrl = baseUrl.slice(0, -1);
  if (startUrl === '/') _url = _url.slice(1);

  return extendArg ? _baserUrl + '/' + _url : _baserUrl;
}
