import { LoginType, TLoginStrType } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { request } from '..';

interface SendVerificationCodeParams {
  baseUrl: string;
  type: TLoginStrType;
  guardianAccount: string;
  // TODO
  verifierName: string;
}
export function sendVerificationCode(params: SendVerificationCodeParams): Promise<any> {
  return request.verify.sendVerificationRequest({
    baseURL: params.baseUrl,
    params: {
      type: params.type,
      guardianAccount: params.guardianAccount,
      verifierName: params.verifierName,
    },
  });
}

interface CheckVerificationCodeProps {
  baseUrl: string;
  endPoint: string;
  verifierSessionId: string;
  verificationCode: string;
}

interface ErrorBack {
  code: null | any;
  message?: string;
}

export async function checkVerificationCode({
  baseUrl,
  endPoint,
  verificationCode,
  verifierSessionId,
}: CheckVerificationCodeProps): Promise<{
  verificationDoc: string;
  signature: string;
  error?: ErrorBack;
}> {
  return await request.verify.checkVerificationCode({
    baseURL: baseUrl,
    params: {
      endPoint,
      verificationCode,
      verifierSessionId,
    },
  });
}

export const getAccountVerifierList = async () => {
  return;
};

interface loginGuardianTypeCheckParams {
  type: LoginType;
  loginGuardianType: string;
  apiUrl?: string;
}
