import { customFetch } from '@portkey/utils/fetch';
import { BaseConfig, RequestConfig, UrlObj } from '../types';
import { getRequestConfig, spliceUrl } from '../utils';
import serverConfig from './config';

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
    const { method = 'POST', url, baseURL, ...fetchConfig } = getRequestConfig(base, config) || {};
    const _baseURL = baseURL || serverConfig.config.baseURL || '';
    const _url = url || (typeof base === 'string' ? base : base.target);

    const URL = spliceUrl(_baseURL, _url);
    return customFetch(URL, {
      ...fetchConfig,
      method,
    });
  };
}

const myServer = new ServiceInit();

export default myServer;
