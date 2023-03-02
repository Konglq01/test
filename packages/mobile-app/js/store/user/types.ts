import { Password } from '@portkey-wallet/types/wallet';

export type Credentials = {
  password: Password;
};
export interface UserStoreState {
  credentials?: Credentials;
  biometrics?: boolean;
}
