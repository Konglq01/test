import Socket from '@portkey/socket/socket-did';
import { useCurrentApiUrl } from '@portkey/hooks/hooks-ca/network';
import { CreateWalletResult, RegisterStatus } from '@portkey/types/types-ca/wallet';
import { requestCreateWallet } from '@portkey/api/api-did/apiUtils/wallet';
import { sleep } from '@portkey/utils';
import { useCallback, useState } from 'react';
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
  baseURL?: string;
  verificationType: VerificationType;
  managerUniqueId: string;
}

export const getWalletCAAddressByApi = async (params: FetchCreateWalletParams): Promise<CreateWalletResult> => {
  const result = await requestCreateWallet(params);
  if (result.recoveryStatus === 'pending' || result.registerStatus === 'pending') {
    await sleep(1000);
    return getWalletCAAddressByApi(params);
  } else {
    return {
      ...result,
      status: result.recoveryStatus || result.registerStatus,
      message: result.registerMessage,
    };
  }
};

interface GetSocketResultParams {
  clientId: string;
  requestId: string;
  verificationType: VerificationType;
}

export const useFetchWalletCAAddress = () => {
  const apiUrl = useCurrentApiUrl();

  const fetch = useCallback(
    async (params: GetSocketResultParams & FetchCreateWalletParams): Promise<CreateWalletResult> => {
      return new Promise(resolve => {
        getCreateResultBySocket({
          type: params.verificationType,
          apiUrl,
          clientId: params.clientId,
          requestId: params.requestId,
        }).then(resolve);

        requestCreateWallet({
          verificationType: params.verificationType,
          managerUniqueId: params.managerUniqueId,
        }).then(resolve);
      });
    },
    [],
  );

  return fetch;
};

Promise.allSettled;
