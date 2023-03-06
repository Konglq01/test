import { LoginType, TLoginStrType } from '@portkey-wallet/types/types-ca/wallet';

export const GUARDIAN_TYPE_TYPE = {
  GUARDIAN_TYPE_OF_EMAIL: LoginType.email,
  GUARDIAN_TYPE_OF_PHONE: LoginType.phone,
};

export const LoginStrType: { [x in LoginType]: TLoginStrType } = {
  [LoginType.email]: 'Email',
  [LoginType.phone]: 'PhoneNumber',
};

export const LoginNumType: { [x in TLoginStrType]: LoginType } = {
  Email: LoginType.email,
  PhoneNumber: LoginType.phone,
};
