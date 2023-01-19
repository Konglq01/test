import { customFetch } from '@portkey/utils/fetch';
import { DEFAULT_METHOD } from '..';
import { BaseConfig, RequestConfig, UrlObj } from '../types';
import { getRequestConfig, spliceUrl } from '../utils';

class ServiceInit {
  [x: string]: any;
  /**
   * @method parseRouter
   * @param  {string} name
   * @param  {UrlObj} urlObj
   */

  parseRouter = (name: string, urlObj: UrlObj) => {
    const obj: any = (this[name] = {});
    Object.keys(urlObj).forEach(key => {
      obj[key] = this.send.bind(this, urlObj[key] as any);
    });
  };
  /**
   * @method send
   * @param  {RequestConfig} config
   * @return {Promise<any>}
   */

  send = (base: BaseConfig, config?: RequestConfig) => {
    const { method = DEFAULT_METHOD, url, baseURL, ...fetchConfig } = getRequestConfig(base, config) || {};
    const _baseURL = baseURL ?? '';
    const _url = typeof base === 'string' ? base : base.target;

    const URL = spliceUrl(_baseURL, _url);
    return customFetch(URL, {
      ...fetchConfig,
      method,
    });
  };
}

const myServer = new ServiceInit();

export default myServer;
