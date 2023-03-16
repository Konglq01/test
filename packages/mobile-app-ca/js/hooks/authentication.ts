import Config from 'react-native-config';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useCallback, useState } from 'react';
import appleAuthentication from 'utils/appleAuthentication';
import { AppleAuthenticationCredential } from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { isIos } from '@portkey-wallet/utils/mobile/device';
GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});
WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuthentication() {
  const [androidResponse, setResponse] = useState<any>();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  });
  const androidPromptAsync = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const req = { type: 'success', authentication: userInfo };
      setResponse(req);
      return req;
    } catch (error: any) {
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
    request,
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
