import { Password } from '@portkey/types/wallet';

export type Credentials = {
  pin: Password;
};
export interface UserStoreState {
  credentials?: Credentials;
  biometrics?: boolean;
}
