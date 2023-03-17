import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { LoginGuardianTypeIcon } from 'constants/misc';

export const LOGIN_TYPE_LABEL_MAP: { [key in LoginType]: string } = {
  [LoginType.Email]: 'Email',
  [LoginType.PhoneNumber]: 'Phone',
  [LoginType.Apple]: 'Apple',
  [LoginType.Google]: 'Google',
};

export const LOGIN_TYPE_LIST = [
  {
    value: LoginType.Email,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Email],
    icon: LoginGuardianTypeIcon[LoginType.Email],
  },
  {
    value: LoginType.PhoneNumber,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.PhoneNumber],
    icon: LoginGuardianTypeIcon[LoginType.PhoneNumber],
  },
  {
    value: LoginType.Google,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Google],
    icon: LoginGuardianTypeIcon[LoginType.Google],
  },
  {
    value: LoginType.Apple,
    name: LOGIN_TYPE_LABEL_MAP[LoginType.Apple],
    icon: LoginGuardianTypeIcon[LoginType.Apple],
  },
];
