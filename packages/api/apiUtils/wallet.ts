import { customFetch } from '@portkey/utils/fetch';
import { baseUrl, walletApi } from '../index';
import { LoginType } from '@portkey/types/verifier';
interface registerWalletParams {
  type: LoginType;
  loginGuardianType: string; //account
  managerAddress: string;
  deviceString: string;
}
export const registerWalletByFetch = async (
  params: registerWalletParams,
): Promise<{
  caAddress: string;
  caHash: string;
}> => {
  return await customFetch(`${baseUrl}${walletApi.registerWallet}`, {
    method: 'post',
    params,
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
  loginType?: 'register' | 'login';
  type: LoginType; //0: Email，1：Phone
  loginGuardianType: string;
  managerUniqueId: string;
}

export const fetchCreateWalletResult = async (params: FetchCreateWalletParams) => {
  const api = params.loginType === 'register' ? walletApi.queryRegister : walletApi.queryRecovery;
  delete params.loginType;
  return await customFetch(`${baseUrl}${api}`, {
    method: 'post',
    params,
  });
};
