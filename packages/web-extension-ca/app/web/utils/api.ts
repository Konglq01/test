import { Verification } from '@portkey/api/api-did/verification/utils';
import { localStorage } from 'redux-persist-webextension-storage';

export const verification = new Verification(localStorage);
