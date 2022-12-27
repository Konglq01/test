import { customFetch } from '@portkey/utils/fetch';

export const getChainList = ({ baseUrl }: { baseUrl: string }) => {
  try {
    return customFetch(`${baseUrl}/api/app/getChains`);
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};
