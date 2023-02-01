import { CustomFetchConfig } from '@portkey/utils/fetch';
import { BaseConfig, RequestConfig } from '../../types';

export interface ESConfig extends CustomFetchConfig {
  params?: {
    filter?: string;
    fort?: string;
    sortType?: 0 | 1;
    skipCount?: number;
    maxResultCount?: number;
  };
}

export type ESBaseConfig = BaseConfig & {
  config: ESConfig;
};

export type ES_API_REQ_FUNCTION = (config?: RequestConfig & ESConfig) => Promise<{ type: 'timeout' } | any>;
