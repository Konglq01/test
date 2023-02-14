import { Verification } from '@portkey/api/api-did/verification/utils';
import { BaseAsyncStorage } from './storage';

const store = new BaseAsyncStorage();
export const verification = new Verification(store);
