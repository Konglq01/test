import { LoginType, VerificationType } from '@portkey/types/verifier';
import { randomId } from '@portkey/utils';
import { customFetch } from '@portkey/utils/fetch';
import { baseUrl, verificationApi } from '../index';

interface SendVerificationCodeProps {
  verificationType: VerificationType;
  guardiansType: LoginType;
  loginGuardianType: string;
  baseUrl: string;
  managerUniqueId: string;
}
export async function sendVerificationCode(params: SendVerificationCodeProps): Promise<any> {
  // sendRegisterVerificationCode
  let api;
  switch (params.verificationType) {
    case VerificationType.register:
      api = verificationApi.sendRegisterVerificationCode;
      break;
    case VerificationType.communityRecovery:
      api = verificationApi.sendRecoveryVerificationCode;
      break;
    default:
      throw Error('Unable to find the corresponding api');
  }

  return await customFetch(`${params.baseUrl}${api}`, {
    method: 'post',
    params: {
      type: params.guardiansType,
      loginGuardianType: params.loginGuardianType,
      managerUniqueId: params.managerUniqueId,
    },
  });
}

interface CheckVerificationCodeProps {
  loginGuardianType: string;
  code: string; // Captcha Verification
  verificationType: VerificationType;
  type: LoginType;
  baseUrl: string;
  verifierSessionId: string;
}

interface ErrorBack {
  code: null | any;
  message?: string;
}

export async function checkVerificationCode({
  verificationType,
  type,
  baseUrl,
  code,
  loginGuardianType,
  verifierSessionId,
}: CheckVerificationCodeProps): Promise<{
  verifierSessionId?: string;
  error?: ErrorBack;
}> {
  let api;
  switch (verificationType) {
    case VerificationType.register:
      api = verificationApi.checkRegisterVerificationCode;
      break;
    case VerificationType.communityRecovery:
      api = verificationApi.checkRecoveryVerificationCode;
      break;
    default:
      throw Error('Unable to find the corresponding api');
  }
  return await customFetch(`${baseUrl}${api}`, {
    method: 'post',
    params: {
      type,
      code,
      loginGuardianType,
      verifierSessionId,
    },
  });
}

export const getVerifierList = async () => {
  return await customFetch(`${baseUrl}${verificationApi.getVerifierList}`);
};

export const getAccountVerifierList = async () => {
  // return await customFetch(`${baseUrl}${walletApi.getAccountVerifierList}`, {
  //   params: {
  //     isPopular: false,
  //   },
  // });
  return;
};

interface loginGuardianTypeCheckParams {
  type: LoginType;
  loginGuardianType: string;
  apiUrl?: string;
}

export const loginGuardianTypeCheck = async (params: loginGuardianTypeCheckParams): Promise<{ result: boolean }> => {
  const apiUrl = params.apiUrl;
  delete params.apiUrl;
  // return await customFetch(`${apiUrl}${verificationApi.loginGuardianTypeCheck}`, {
  //   method: 'post',
  //   params,
  // });
  return {
    result: true,
  };
};
