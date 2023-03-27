import { useCallback } from 'react';
import { VerifyTokenParams } from '@portkey-wallet/types/types-ca/authentication';
import { getGoogleUserInfo, parseAppleIdentityToken } from '@portkey-wallet/utils/authentication';
import { request } from '@portkey-wallet/api/api-did';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export function useVerifyGoogleToken() {
  return useCallback(async (params: VerifyTokenParams) => {
    let accessToken = params.accessToken;
    let isRequest = !accessToken;
    if (accessToken) {
      try {
        const { id } = await getGoogleUserInfo(accessToken);
        if (!id) isRequest = true;
      } catch (error) {
        isRequest = true;
      }
    }
    if (isRequest) {
      const googleInfo = await socialLoginAction('Google');
      accessToken = googleInfo?.data?.access_token;
      const { id } = await getGoogleUserInfo(accessToken as string);
      console.log(id, params, googleInfo, 'socialVerifyHandler===id');
      if (id !== params.id) throw new Error('Account does not match your guardian');
    }
    return request.verify.verifyGoogleToken({
      params: { ...params, accessToken },
    });
  }, []);
}

export function useVerifyAppleToken() {
  return useCallback(async (params: VerifyTokenParams) => {
    let accessToken = params.accessToken;
    const { isExpired: tokenIsExpired } = parseAppleIdentityToken(accessToken) || {};
    if (!accessToken || tokenIsExpired) {
      const info = await socialLoginAction('Apple');
      accessToken = info?.data?.accessToken || undefined;
    }
    const { userId } = parseAppleIdentityToken(accessToken) || {};
    if (userId !== params.id) throw new Error('Account does not match your guardian');
    delete (params as any).id;
    return request.verify.verifyAppleToken({
      params: { ...params, accessToken },
    });
  }, []);
}

export function useVerifyToken() {
  const verifyGoogleToken = useVerifyGoogleToken();
  const verifyAppleToken = useVerifyAppleToken();
  return useCallback(
    (type: LoginType, params: VerifyTokenParams) => {
      return (type === LoginType.Apple ? verifyAppleToken : verifyGoogleToken)(params);
    },
    [verifyAppleToken, verifyGoogleToken],
  );
}
