import { customFetch } from '@portkey/utils/fetch';
import { DEFAULT_METHOD } from '..';
import { BaseConfig, UrlObj } from '../types';
import { spliceUrl } from '../utils';

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
      obj[key] = this.send.bind(this, urlObj[key]);
    });
  };
  /**
   * @method send
   * @param  {BaseConfig} config
   * @return {Promise<any>}
   */

  send = (config: BaseConfig) => {
    //TODO networkType
    const { method = DEFAULT_METHOD, url, baseURL, ...fetchConfig } = config || {};
    const _baseURL = baseURL;
    const _url = url;
    const URL = spliceUrl(_baseURL, _url);
    return customFetch(URL, {
      ...fetchConfig,
      method,
    });
  };
}
const myServer = new ServiceInit();
export default myServer;
