import { customFetch } from '@portkey/utils/fetch';
import { baseUrl, walletApi } from '../index';
import { LoginType, VerificationType } from '@portkey/types/verifier';

interface CreateWalletInfoParams {
  baseUrl: string;
  type: LoginType;
  loginGuardianType: string; //account
  managerUniqueId: string;
  managerAddress: string;
  deviceString: string;
  verificationType: VerificationType;
}

export const createWalletInfo = async ({
  baseUrl,
  type,
  loginGuardianType,
  managerUniqueId,
  managerAddress,
  verificationType,
  deviceString,
}: CreateWalletInfoParams) => {
  let api;
  switch (verificationType) {
    case VerificationType.register:
      api = walletApi.registerWallet;
      break;
    case VerificationType.communityRecovery:
      api = walletApi.recoveryWallet;
      break;
    default:
      throw Error('Unable to find the corresponding api');
  }
  return customFetch(`${baseUrl}${api}`, {
    method: 'post',
    params: {
      type,
      loginGuardianType,
      managerUniqueId,
      managerAddress,
      deviceString,
    },
  });
};

export const setWalletName = async ({ nickname }: { nickname: string }) => {
  return await customFetch(`${baseUrl}${walletApi.setWalletName}`, {
    method: 'post',
    params: {
      nickname,
    },
  });
};

interface FetchCreateWalletParams {
  verificationType?: VerificationType;
  type: LoginType; //0: Email，1：Phone
  loginGuardianType: string;
  managerUniqueId: string;
  baseUrl: string;
  managerAddress: string;
}

export const fetchCreateWalletResult = async ({
  baseUrl,
  type,
  managerUniqueId,
  loginGuardianType,
  verificationType,
  managerAddress,
}: FetchCreateWalletParams) => {
  let api;
  switch (verificationType) {
    case VerificationType.register:
      api = walletApi.queryRegister;
      break;
    case VerificationType.communityRecovery:
      api = walletApi.queryRecovery;
      break;
    default:
      throw Error('Unable to find the corresponding api');
  }
  return await customFetch(`${baseUrl}${api}`, {
    method: 'post',
    params: {
      type,
      managerUniqueId,
      loginGuardianType,
      managerAddress,
    },
  });
};
