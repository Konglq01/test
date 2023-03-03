import { Verification } from '@portkey-wallet/api/api-did/verification/utils';
import { BaseAsyncStorage } from './storage';

const store = new BaseAsyncStorage();
export const verification = new Verification(store);
