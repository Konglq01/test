import { BaseConfig, RequestConfig, UrlObj } from '../types';

type PartialRequestConfig = Partial<RequestConfig>;

class ServerConfig {
  config: PartialRequestConfig;
  constructor(_config: PartialRequestConfig) {
    this.config = _config;
  }
  setServerConfig(config: PartialRequestConfig) {
    this.config = Object.assign(this.config, config);
  }

  set(key: keyof PartialRequestConfig, value: any) {
    this.config[key] = value;
  }
}

const serverConfig = new ServerConfig({});

export default serverConfig;
