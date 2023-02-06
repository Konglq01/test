import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { VerifierItem, VerifyStatus } from '@portkey/types/verifier';
import { GuardiansInfo } from '@portkey/types/guardian';

import { IVerifierInfo, UserGuardianItem, UserGuardianStatus } from './type';

export const resetGuardiansState = createAction('verifier/resetGuardiansState');

export const setVerifierListAction = createAction<VerifierItem[] | null>('verifier/setVerifierList');

export const setGuardiansAction = createAction<GuardiansInfo | null>('verifier/setGuardians');

export const setCurrentGuardianAction = createAction<UserGuardianItem>('verifier/setCurrentGuardian');

export const setUserGuardianItemStatus = createAction<{
  key: string;
  status: VerifyStatus;
  signature?: string;
  verificationDoc?: string;
}>('verifier/setUserGuardianItemStatus');

export const setUserGuardianStatus = createAction<{ [x: string]: UserGuardianStatus }>(
  'verifier/setUserGuardianStatus',
);
export const resetUserGuardianStatus = createAction('verifier/resetUserGuardianStatus');

export const setUserGuardianSessionIdAction = createAction<{ key: string; verifierInfo: IVerifierInfo }>(
  'verifier/setUserGuardianSessionId',
);
export const setOpGuardianAction = createAction<UserGuardianItem | undefined>('verifier/setOpGuardian');
export const setPreGuardianAction = createAction<UserGuardianItem | undefined>('verifier/setPreGuardian');
