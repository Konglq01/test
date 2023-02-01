import { BaseConfig, RequestConfig } from './types';

export function spliceUrl(baseUrl: string, extendArg: string = '') {
  const { [baseUrl.length - 1]: lastStr } = baseUrl;
  const { 0: startUrl } = extendArg ?? '';
  let _baserUrl = baseUrl;
  let _url = extendArg;
  if (lastStr === '/') _baserUrl = baseUrl.slice(0, -1);
  if (startUrl === '/') _url = _url.slice(1);

  return extendArg ? _baserUrl + '/' + _url : _baserUrl;
}

export function getRequestConfig(base: BaseConfig, config?: RequestConfig, defaultConfig?: RequestConfig) {
  console.log(defaultConfig, '====defaultConfig');

  if (typeof base === 'string') {
    if (defaultConfig) {
      return {
        ...defaultConfig,
        ...config,
        params: { ...defaultConfig.params, ...config?.params },
      };
    }
    return config;
  } else {
    const { config: baseConfig } = base || {};
    const { params } = config || {};
    return {
      ...defaultConfig,
      ...baseConfig,
      ...config,
      params: { ...defaultConfig?.params, ...baseConfig.params, ...params },
    };
  }
}
