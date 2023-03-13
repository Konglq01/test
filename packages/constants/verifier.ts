import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

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
  },
  // {
  //   value: LoginType.PhoneNumber,
  //   name: LOGIN_TYPE_LABEL_MAP[LoginType.PhoneNumber],
  // },
];
