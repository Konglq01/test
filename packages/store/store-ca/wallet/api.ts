import { baseUrl, walletApi } from '@portkey/api';
import { ChainItemType } from './type';

export const getChainList = async () => {
  try {
    // const data = await customFetch(`${baseUrl}${walletApi.getChainList}`, {
    //   params: {},
    // });
    const response = await new Promise<ChainItemType[]>(resolve => {
      setTimeout(() => {
        resolve([
          {
            chainId: 'AELF',
            name: 'AELF',
            endPoint: 'string',
          },
          {
            chainId: 'tDVV',
            name: 'tDVV',
            endPoint: 'string',
          },
          // {
          //   chainId: 'tDVV2',
          //   name: 'tDVV2',
          //   endPoint: 'string',
          // },
          // {
          //   chainId: 'tDVV3',
          //   name: 'tDVV3',
          //   endPoint: 'string',
          // },
          // {
          //   chainId: 'tDVV4',
          //   name: 'tDVV4',
          //   endPoint: 'string',
          // },
          // {
          //   chainId: 'tDVV5',
          //   name: 'tDVV5',
          //   endPoint: 'string',
          // },
          // {
          //   chainId: 'tDVV6',
          //   name: 'tDVV6',
          //   endPoint: 'string',
          // },
          // {
          //   chainId: 'tDVV7',
          //   name: 'tDVV7',
          //   endPoint: 'string',
          // },
          // {
          //   chainId: 'tDVV8',
          //   name: 'tDVV8',
          //   endPoint: 'string',
          // },
          // {
          //   chainId: 'tDVV9',
          //   name: 'tDVV9',
          //   endPoint: 'string',
          // },
          // {
          //   chainId: 'tDVV10',
          //   name: 'tDVV10',
          //   endPoint: 'string',
          // },
        ]);
      }, 500);
    });

    return response;
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};
