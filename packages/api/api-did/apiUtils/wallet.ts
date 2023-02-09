import { TLoginStrType } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { request } from '..';
import { IContext } from '../types';

interface RegisterDIDWalletParams extends IContext {
  baseUrl?: string;
  type: TLoginStrType;
  loginGuardianAccount: string; //account
  managerAddress: string;
  deviceString: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
  chainId: string;
}

export const registerDIDWallet = async (
  params: RegisterDIDWalletParams,
): Promise<{
  sessionId: string;
}> => {
  const baseUrl = params.baseUrl;
  delete params.baseUrl;
  return request.wallet.requestRegister({
    baseURL: baseUrl,
    params,
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
  baseURL?: string;
  loginGuardianAccount: string;
  managerAddress: string;
  deviceString: string;
  chainId: string;
  guardiansApproved: GuardiansApprovedType[];
}

export const recoveryDIDWallet = async (
  params: RecoveryDIDWalletParams,
): Promise<{
  sessionId: string;
}> => {
  const baseURL = params.baseURL;
  delete params.baseURL;
  return request.wallet.recoveryWallet({
    baseURL,
    params,
  });
};

interface RequestCreateWalletParams {
  baseURL?: string;
  verificationType: VerificationType;
  managerUniqueId: string;
}

export const requestCreateWallet = async ({
  baseURL,
  verificationType,
  managerUniqueId,
}: RequestCreateWalletParams) => {
  let fetch = request.es.getRegisterResult;
  if (verificationType !== VerificationType.register) fetch = request.es.getRecoverResult;
  const req = await fetch({
    baseURL,
    params: { filter: `_id:${managerUniqueId}` },
  });
  const result = req.items[0];
  return result;
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
  baseUrl?: string;
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
