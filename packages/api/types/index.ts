import { CustomFetchConfig } from '@portkey/utils/fetch';

export type RequestConfig = CustomFetchConfig & { baseURL: string; url?: string };

export type UrlObj = { [key: string]: RequestConfig };

export type API_REQ_FUNCTION = (config: RequestConfig) => Promise<{ type: 'timeout' } | any>;

export type BaseConfig = string | { target: string; config: CustomFetchConfig };
