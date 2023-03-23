import { customFetch } from './fetch';

export type AppleUserInfo = {
  isExpired: boolean;
  userId: string;
  email: string;
  expirationTime: Date;
};

export function parseAppleIdentityToken(identityToken?: string | null) {
  if (!identityToken) return;
  const parts = identityToken.split('.');
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  const expirationTime = new Date(payload.exp * 1000);
  const isExpired = expirationTime < new Date();
  const userId = payload.sub;
  const email = payload.email;
  return { isExpired, userId, email, expirationTime };
}

type GoogleUserInfo = {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
};

const TmpUserInfo: { [key: string]: GoogleUserInfo } = {};

export async function getGoogleUserInfo(accessToken = ''): Promise<GoogleUserInfo> {
  if (!TmpUserInfo[accessToken])
    TmpUserInfo[accessToken] = await customFetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  return TmpUserInfo[accessToken];
}
