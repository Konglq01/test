import { Password } from '@portkey/types/wallet';

export type Credentials = {
  password: Password;
};
export interface UserStoreState {
  credentials?: Credentials;
  biometrics?: boolean;
}
