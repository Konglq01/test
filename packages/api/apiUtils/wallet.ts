import { TLoginStrType } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { request } from '..';
import { IContext } from '../types';

interface RegisterDIDWalletParams extends IContext {
  baseUrl: string;
  type: TLoginStrType;
  loginGuardianAccount: string; //account
  managerAddress: string;
  deviceString: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
  chainId: string;
}

export const registerDIDWallet = async (params: RegisterDIDWalletParams) => {
  const _params: any = { ...params };
  const baseUrl = _params.baseUrl;
  delete _params.baseUrl;
  return request.wallet.requestRegister({
    baseURL: baseUrl,
    params: _params,
  });
};

interface GuardiansApprovedType {
  type: TLoginStrType;
  value: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
}
interface RecoveryDIDWalletParams extends IContext {
  baseURL: string;
  loginGuardianAccount: string;
  managerAddress: string;
  deviceString: string;
  chainId: string;
  guardiansApproved: GuardiansApprovedType[];
}

export const recoveryDIDWallet = async (params: RecoveryDIDWalletParams) => {
  const _params: any = { ...params };
  const baseURL = _params.baseURL;
  delete _params.baseURL;
  return request.wallet.recoveryWallet({
    baseURL,
    params,
  });
};

interface RequestCreateWalletParams {
  type: string;
  baseUrl: string;
  loginGuardianType: string;
  managerAddress: string;
  deviceString: string;
  chainId: string;
  verifierName: string;
  verificationDoc: string;
  signature: string;
  verificationType: VerificationType;
}

export const requestCreateWallet = async ({
  baseUrl,
  type,
  loginGuardianType,
  managerAddress,
  verificationType,
  deviceString,
  chainId,
  verifierName,
  verificationDoc,
  signature,
}: RequestCreateWalletParams) => {
  let tmpFetch;
  let params = {
    type,
    loginGuardianType,
    managerAddress,
    deviceString,
    chainId,
    verifierName,
    verificationDoc,
    signature,
  };
  switch (verificationType) {
    case VerificationType.register:
      tmpFetch = request.wallet.requestRegister;
      break;
    case VerificationType.communityRecovery:
      tmpFetch = request.wallet.recoveryWallet;

      break;
    default:
      throw Error('Unable to find the corresponding api');
  }
  return tmpFetch({
    baseURL: baseUrl,
    params,
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
  type: TLoginStrType;
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
