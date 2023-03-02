import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Button } from 'react-native';
import ActionSheet from 'components/ActionSheet';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId: '57532195783-5s6hl8ac22jt8m3790ce3hohcm0bq074.apps.googleusercontent.com',
});
// WebBrowser.maybeCompleteAuthSession();

export default function GoogleTest() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '57532195783-66mios3b9fglgub9jut5fsr39mitasqu.apps.googleusercontent.com',
    androidClientId: '57532195783-5s6hl8ac22jt8m3790ce3hohcm0bq074.apps.googleusercontent.com',
    // webClientId: '57532195783-kvl2qfsfu11o5aab35tgnauoqokv6mpv.apps.googleusercontent.com',
  });
  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   clientId: '57532195783-kvl2qfsfu11o5aab35tgnauoqokv6mpv.apps.googleusercontent.com',
  // });
  console.log(response, '=====response');
  React.useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      ActionSheet.alert({ title: '111', message: JSON.stringify(authentication) });
    }
  }, [response]);
  return (
    <>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync({ useProxy: false, showInRecents: true });
        }}
      />
      <Button
        disabled={!request}
        title="Login react-native"
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo, '====userInfo');
          } catch (error: any) {
            console.log(error, '=====error');

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
        }}
      />
    </>
  );
}
