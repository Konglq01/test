import { TLoginStrType } from '@portkey/types/types-ca/wallet';
import { request } from '..';

interface SendVerificationCodeParams {
  baseUrl: string;
  type: TLoginStrType;
  guardianAccount: string;
  id: string;
}
export function sendVerificationCode(params: SendVerificationCodeParams): Promise<any> {
  return request.verify.sendVerificationRequest({
    baseURL: params.baseUrl,
    params: {
      type: params.type,
      guardianAccount: params.guardianAccount,
      id: params.id,
    },
  });
}

interface CheckVerificationCodeProps {
  baseUrl: string;
  endPoint: string;
  guardianAccount: string;
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
  guardianAccount,
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
      guardianAccount,
    },
  });
}
