import { CustomFetchConfig } from '@portkey/utils/fetch';

export type BaseConfig = CustomFetchConfig & { baseURL: string; url?: string };

export type UrlObj = { [key: string]: BaseConfig };

export type API_REQ_FUNCTION = (config: BaseConfig) => Promise<{ type: 'timeout' } | any>;
