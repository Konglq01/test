import { Verification } from '@portkey/api/api-did/verification/utils';
import { IStorage } from '@portkey/types/storage';
import { BaseAsyncStorage } from '../../utils/BaseAsyncStorage';

const store = new BaseAsyncStorage();
export let verification = new Verification(store);

export const configVerification = (store: IStorage) => {
  verification = new Verification(store);
  return verification;
};
