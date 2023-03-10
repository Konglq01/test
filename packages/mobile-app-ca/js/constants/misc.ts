import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export const LoginGuardianTypeIcon = {
  [LoginType.Email]: 'email',
  [LoginType.PhoneNumber]: 'email',
  // TODO: google and apple icon
  [LoginType.Google]: 'email',
  [LoginType.Apple]: 'email',
};
