import { request } from '@portkey/api';

export const getChainList = ({ baseUrl }: { baseUrl: string }) => {
  try {
    return request.chain.getChains({
      baseURL: baseUrl,
      method: 'get',
    });
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};
