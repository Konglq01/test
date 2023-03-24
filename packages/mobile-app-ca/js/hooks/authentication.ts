import * as WebBrowser from 'expo-web-browser';
import { useCallback, useMemo, useState } from 'react';
import appleAuthentication from 'utils/appleAuthentication';
import { AppleAuthenticationCredential } from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { isIos } from '@portkey-wallet/utils/mobile/device';
import * as Google from 'expo-auth-session/providers/google';
import Config from 'react-native-config';
import * as Application from 'expo-application';
import { AccessTokenRequest, makeRedirectUri } from 'expo-auth-session';
import { request } from '@portkey-wallet/api/api-did';
import { ChainId } from '@portkey-wallet/types';
import { AppleUserInfo, getGoogleUserInfo, parseAppleIdentityToken } from '@portkey-wallet/utils/authentication';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useInterface } from 'contexts/useInterface';

if (!isIos) {
  GoogleSignin.configure({
    offlineAccess: true,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });
} else {
  WebBrowser.maybeCompleteAuthSession();
}

export type GoogleAuthentication = {
  accessToken: string;
  idToken?: string;
  user: {
    email: string;
    familyName: string;
    givenName: string;
    id: string;
    name: string;
    photo: string;
  };
};

export type AppleAuthentication = {
  user?: AppleUserInfo & {
    id: string;
    isPrivate: boolean;
  };
} & AppleAuthenticationCredential;

export type GoogleAuthResponse = GoogleAuthentication;
export function useGoogleAuthentication() {
  const [androidResponse, setResponse] = useState<any>();
  const [{ googleRequest, response, promptAsync }] = useInterface();

  const iosPromptAsync: () => Promise<GoogleAuthResponse> = useCallback(async () => {
    const info = await promptAsync();
    if (info.type === 'success') {
      const exchangeRequest = new AccessTokenRequest({
        clientId: Config.GOOGLE_IOS_CLIENT_ID,
        redirectUri: makeRedirectUri({
          native: `${Application.applicationId}:/oauthredirect`,
        }),
        code: info.params.code,
        extraParams: {
          code_verifier: googleRequest?.codeVerifier || '',
        },
      });
      const authentication = await exchangeRequest.performAsync(Google.discovery);

      const userInfo = await getGoogleUserInfo(authentication?.accessToken);
      return {
        user: {
          ...userInfo,
          photo: userInfo.picture,
          familyName: userInfo.family_name,
          givenName: userInfo.given_name,
        },
        ...authentication,
      } as GoogleAuthResponse;
    }
    const message = info.type === 'cancel' ? 'User cancel' : 'Verified failed';
    throw { ...info, message };
  }, [promptAsync, googleRequest?.codeVerifier]);

  const androidPromptAsync = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // google services are available
    } catch (err) {
      throw Error('play services are not available');
    }
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
      await GoogleSignin.signOut();
      const googleResponse = { ...userInfo, ...token } as GoogleAuthResponse;
      setResponse(googleResponse);
      return googleResponse;
    } catch (error: any) {
      const message = error.code === statusCodes.SIGN_IN_CANCELLED ? 'User cancel' : 'Verified failed';
      throw { ...error, message };
    }
  }, []);
  return useMemo(
    () => ({
      googleResponse: isIos ? response : androidResponse,
      googleSign: isIos ? iosPromptAsync : androidPromptAsync,
    }),
    [androidPromptAsync, androidResponse, iosPromptAsync, response],
  );
}

export function useAppleAuthentication() {
  const [response, setResponse] = useState<AppleAuthentication>();
  const promptAsync = useCallback(async () => {
    setResponse(undefined);
    const appleInfo = await appleAuthentication.signInAsync();
    const user = parseAppleIdentityToken(appleInfo.identityToken);
    const userInfo = { ...appleInfo, user: { ...user, id: user?.userId } } as AppleAuthentication;
    setResponse(userInfo);
    return userInfo;
  }, []);
  return { appleResponse: response, appleSign: promptAsync };
}

export type VerifyTokenParams = {
  accessToken?: string;
  verifierId?: string;
  chainId: ChainId;
  id: string;
};

export function useVerifyGoogleToken() {
  const { googleSign } = useGoogleAuthentication();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      let isRequest = !accessToken;
      if (accessToken) {
        try {
          const { id } = await getGoogleUserInfo(accessToken);
          if (!id || id !== params.id) isRequest = true;
        } catch (error) {
          isRequest = true;
        }
      }
      if (isRequest) {
        const userInfo = await googleSign();
        accessToken = userInfo?.accessToken;
        if (userInfo.user.id !== params.id) throw new Error('Account does not match your guardian');
      }
      return request.verify.verifyGoogleToken({
        params: { ...params, accessToken },
      });
    },
    [googleSign],
  );
}

export function useVerifyAppleToken() {
  const { appleSign } = useAppleAuthentication();
  return useCallback(
    async (params: VerifyTokenParams) => {
      let accessToken = params.accessToken;
      const { isExpired: tokenIsExpired } = parseAppleIdentityToken(accessToken) || {};
      if (!accessToken || tokenIsExpired) {
        const info = await appleSign();
        accessToken = info.identityToken || undefined;
      }
      const { userId } = parseAppleIdentityToken(accessToken) || {};
      if (userId !== params.id) throw new Error('Account does not match your guardian');

      return request.verify.verifyAppleToken({
        params: { ...params, accessToken },
      });
    },
    [appleSign],
  );
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
