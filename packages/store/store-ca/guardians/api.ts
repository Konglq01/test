import { customFetch } from '@portkey/utils/fetch';
import { baseUrl, walletApi } from '@portkey/api';

export const fetchVerifierList = async () => {
  try {
    // const data = await getVerifierList();
    // TODO
    // return data?.items;

    return [
      {
        name: 'Portkey',
        imageUrl: 'PortKey',
        url: 'string',
        id: '1',
      },
      {
        name: 'Huobi',
        imageUrl: 'Down',
        url: 'string',
        id: '2',
      },
      {
        name: 'Binance',
        imageUrl: 'Expand',
        url: 'string',
        id: '3',
      },
    ];
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};

export const fetchGuardiansList = async () => {
  try {
    // const data = await getAccountVerifierList({
    //     isPopular: false,
    // });
    // TODO wait api
    // return data?.items;

    const res = {
      guardiansInfo: {
        guardians: [
          {
            guardianType: {
              type: 0,
              guardianType: '111@163.com',
            },
            verifier: {
              name: 'Portkey',
              signature: '',
            },
          },
          {
            guardianType: {
              type: 0,
              guardianType: '111@163.com',
            },
            verifier: {
              name: 'Huobi',
              signature: '',
            },
          },
          {
            guardianType: {
              type: 0,
              guardianType: '1123331@Binance.com',
            },
            verifier: {
              name: 'Binance',
              signature: '',
            },
          },
          {
            guardianType: {
              type: 0,
              guardianType: '1123331@Binance.com',
            },
            verifier: {
              name: 'Binance',
              signature: '',
            },
          },
          {
            guardianType: {
              type: 0,
              guardianType: '1123331@huobi.com',
            },
            verifier: {
              name: 'Huobi',
              signature: '',
            },
          },
        ],
        loginGuardianTypeIndexes: [0, 1, 3],
      },
    };

    return res.guardiansInfo;
  } catch (error: any) {
    if (error?.type) throw Error(error.type);
    if (error?.error?.message) throw Error(error.error.message);
    throw Error(JSON.stringify(error));
  }
};
