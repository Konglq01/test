import { LoginType, VerificationType } from '@portkey/types/verifier';
import { request } from '..';

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
  let tmpFetch;
  switch (verificationType) {
    case VerificationType.register:
      tmpFetch = request.wallet.registerWallet;
      break;
    case VerificationType.communityRecovery:
      tmpFetch = request.wallet.recoveryWallet;
      break;
    default:
      throw Error('Unable to find the corresponding api');
  }
  return tmpFetch({
    baseURL: baseUrl,
    params: {
      type,
      loginGuardianType,
      managerUniqueId,
      managerAddress,
      deviceString,
    },
  });
};
// TODO
export const setWalletName = ({ nickname, baseURL = '' }: { baseURL?: string; nickname: string }) => {
  return request.wallet.setWalletName({
    baseURL,
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
}

export const fetchCreateWalletResult = async ({
  baseUrl,
  type,
  managerUniqueId,
  loginGuardianType,
  verificationType,
}: FetchCreateWalletParams) => {
  let tmpFetch;
  switch (verificationType) {
    case VerificationType.register:
      tmpFetch = request.wallet.queryRegister;
      break;
    case VerificationType.communityRecovery:
      tmpFetch = request.wallet.queryRecovery;
      break;
    default:
      throw Error('Unable to find the corresponding api');
  }
  return await tmpFetch({
    baseURL: baseUrl,
    params: {
      type,
      managerUniqueId,
      loginGuardianType,
    },
  });
};
