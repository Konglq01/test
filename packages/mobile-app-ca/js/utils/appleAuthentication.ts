import * as AppleAuthentication from 'expo-apple-authentication';

const DefaultSignInOptions = {
  requestedScopes: [
    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    AppleAuthentication.AppleAuthenticationScope.EMAIL,
  ],
};

async function signInAsync(options: AppleAuthentication.AppleAuthenticationSignInOptions = DefaultSignInOptions) {
  return AppleAuthentication.signInAsync(options);
}

async function signOutAsync(options: AppleAuthentication.AppleAuthenticationSignOutOptions) {
  return AppleAuthentication.signOutAsync(options);
}

export default {
  signInAsync,
  signOutAsync,
};
