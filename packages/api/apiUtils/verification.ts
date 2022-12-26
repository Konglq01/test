import { LoginType, VerificationType } from '@portkey/types/verifier';
import { customFetch } from '@portkey/utils/fetch';
import { baseUrl, verificationApi } from '../index';

interface SendVerificationCodeProps {
  verificationType: VerificationType;
  guardiansType: LoginType;
  loginGuardianType: string;
  baseUrl: string;
}
export async function sendVerificationCode(params: SendVerificationCodeProps): Promise<any> {
  // sendRegisterVerificationCode

  let api;
  switch (params.verificationType) {
    case VerificationType.register:
      api = verificationApi.sendRegisterVerificationCode;
      break;
    case VerificationType.communityRecovery:
      api = verificationApi.sendRegisterVerificationCode;
      break;
    // TODO
  }

  // const responses: any = await customFetch(`${params.baseUrl}${api}`, {
  //   method: 'post',
  //   params: {
  //     type: params.type,
  //     loginGuardianType: params.loginGuardianType,
  //   },
  // });
  //   return responses;
  //   TODO
  return {
    result: 0,
  };
}

interface CheckVerificationCodeProps {
  loginGuardianType: string;
  code: string; // Captcha Verification
  verificationType: VerificationType;
  type: LoginType;
  baseUrl: string;
}

export async function checkVerificationCode({
  verificationType,
  type,
  baseUrl,
  code,
  loginGuardianType,
}: CheckVerificationCodeProps): Promise<{
  result: 0 | 1 | 2; // 0: success, 1:failure, 2: The verification code has expired
}> {
  // let api;
  // switch (verificationType) {
  //   case VerificationType.register:
  //     api = verificationApi.checkRegisterVerificationCode;
  //     break;
  //   // case VerificationType.communityRecovery:
  //   //   api = verificationApi.sendRegisterVerificationCode;
  //   //   break;
  //   // TODO
  // }
  // const responses: any = await customFetch(`${baseUrl}${api}`, {
  //   method: 'post',
  //   params: {
  //     type,
  //     code,
  //     loginGuardianType,
  //   },
  // });
  //   return responses;
  //   TODO
  return {
    result: 0,
  };
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
}

export const loginGuardianTypeCheck = async (params: loginGuardianTypeCheckParams): Promise<{ result: boolean }> => {
  // return await customFetch(`${baseUrl}${verificationApi.loginGuardianTypeCheck}`, {
  //   method: 'post',
  //   params,
  // });
  return {
    result: true,
  };
};
