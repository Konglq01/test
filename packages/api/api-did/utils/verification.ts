import { TLoginStrType } from '@portkey/types/types-ca/wallet';
import { request } from '..';

interface CheckVerificationCodeProps {
  baseUrl?: string;
  verifierId: string;
  chainId: string | number;
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
  chainId,
  verifierId,
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
      verifierId,
      verifierSessionId,
      verificationCode,
      guardianAccount,
      chainId,
    },
  });
}
