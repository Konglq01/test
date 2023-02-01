import Socket from '@portkey/socket/socket-did';
import { useCurrentApiUrl } from '@portkey/hooks/hooks-ca/network';
import { CreateWalletResult, RegisterStatus } from '@portkey/types/types-ca/wallet';
import { requestCreateWallet } from '@portkey/api/api-did/apiUtils/wallet';
import { sleep } from '@portkey/utils';
import { useCallback } from 'react';
import { VerificationType } from '@portkey/types/verifier';

const getCreateResultBySocket = ({
  type,
  apiUrl,
  clientId,
  requestId,
}: {
  apiUrl: string;
  clientId: string;
  requestId: string;
  type: VerificationType;
}): Promise<CreateWalletResult> => {
  return new Promise((resolve, reject) => {
    Socket.doOpen({
      url: `${apiUrl}/ca`,
      clientId: clientId,
    });
    if (type === VerificationType.register) {
      Socket.onCaAccountRegister(
        {
          clientId,
          requestId: requestId,
        },
        data => {
          console.log('onCaAccountRegister', data);
          if (data.body.registerStatus !== 'pass') {
            reject(data.body.registerMessage);
            return;
          }
          resolve({
            ...data.body,
            status: data.body.registerStatus,
            message: data.body.registerMessage,
          });
        },
      );
    } else {
      Socket.onCaAccountRecover(
        {
          clientId,
          requestId: requestId,
        },
        data => {
          console.log('onCaAccountRecover', data);
          if (data.body.recoverStatus !== 'pass') {
            reject(data.body.recoverMessage);
            return;
          }
          resolve({
            ...data.body,
            status: data.body.recoverStatus,
            message: data.body.recoverMessage,
          });
        },
      );
    }
  });
};

interface FetchCreateWalletParams {
  requestId: string;
  clientId: string;
  baseUrl?: string;
}

export const getWalletCAAddressByApi = async (params: FetchCreateWalletParams): Promise<CreateWalletResult> => {
  const res = await requestCreateWallet(params);
  let statusField;
  if ('registerStatus' in res.body) {
    statusField = 'register';
  } else if ('recoveryStatus') {
    statusField = 'recovery';
  } else {
    throw 'Get walletInfo error';
  }
  if (res[`${statusField}Status`] === 'pending') {
    await sleep(1000);
    return getWalletCAAddressByApi(params);
  } else {
    return {
      ...res,
      status: res[`${statusField}Status`],
      message: res[`${statusField}Message`],
    };
  }
};

interface FetchWalletCAAddressParams extends FetchCreateWalletParams {
  type: VerificationType;
}

export const useFetchWalletCAAddress = () => {
  const apiUrl = useCurrentApiUrl();
  const fetch = useCallback(async (params: FetchWalletCAAddressParams): Promise<CreateWalletResult> => {
    return await Promise.race([
      getCreateResultBySocket({
        type: params.type,
        apiUrl,
        clientId: params.clientId,
        requestId: params.requestId,
      }),
      // getWalletCAAddressByApi({
      //   clientId: params.clientId,
      //   requestId: params.requestId,
      // }),
    ]);
  }, []);

  return fetch;
};
