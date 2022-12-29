import { LoginType, VerificationType } from '@portkey/types/verifier';
import { customFetch } from '@portkey/utils/fetch';
import { request } from '..';

interface SendVerificationCodeProps {
  verificationType: VerificationType;
  guardiansType: LoginType;
  loginGuardianType: string;
  baseUrl: string;
  managerUniqueId: string;
}
export async function sendVerificationCode(params: SendVerificationCodeProps): Promise<any> {
  // sendRegisterVerificationCode
  let tmpFetch;
  switch (params.verificationType) {
    case VerificationType.register:
      tmpFetch = request.verify.sendRegisterVerificationCode;
      break;
    case VerificationType.communityRecovery:
      tmpFetch = request.verify.sendRecoveryVerificationCode;
      break;
    default:
      throw Error('Unable to find the corresponding api');
  }

  return await tmpFetch({
    baseURL: params.baseUrl,
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
  let tmpFetch;
  switch (verificationType) {
    case VerificationType.register:
      tmpFetch = request.verify.checkRegisterVerificationCode;
      break;
    case VerificationType.communityRecovery:
      tmpFetch = request.verify.checkRecoveryVerificationCode;
      break;
    default:
      throw Error('Unable to find the corresponding api');
  }
  return await tmpFetch({
    baseURL: baseUrl,
    params: {
      type,
      code,
      loginGuardianType,
      verifierSessionId,
    },
  });
}

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
