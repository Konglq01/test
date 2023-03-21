import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import appleAuthentication from 'utils/appleAuthentication';
import { AppleAuthenticationCredential } from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { isIos } from '@portkey-wallet/utils/mobile/device';
import * as Google from 'expo-auth-session/providers/google';
import Config from 'react-native-config';
if (!isIos) {
  GoogleSignin.configure({
    offlineAccess: true,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  });
} else {
  WebBrowser.maybeCompleteAuthSession();
}
export function useGoogleAuthentication() {
  const [androidResponse, setResponse] = useState<any>();
  const [, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
  });
  const androidPromptAsync = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
      console.log(userInfo, token, '========userInfo');

      const req = { type: 'success', authentication: userInfo };
      setResponse(req);
      return req;
    } catch (error: any) {
      console.log(error, '======error');

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return { type: 'cancel' };
      } else if (error.code === statusCodes.IN_PROGRESS) {
        return { type: 'locked' };
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return { type: 'dismiss' };
      } else {
        return error;
      }
    }
  }, []);
  return {
    googleResponse: isIos ? response : androidResponse,
    googleSign: isIos ? promptAsync : androidPromptAsync,
  };
}

export function useAppleAuthentication() {
  const [response, setResponse] = useState<AppleAuthenticationCredential>();
  const promptAsync = useCallback(async () => {
    setResponse(undefined);
    const req = await appleAuthentication.signInAsync();
    setResponse(req);
    return req;
  }, []);
  return { appleResponse: response, appleSign: promptAsync };
}
