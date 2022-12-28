import { fetchGuardiansList, fetchVerifierList } from './api';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { GuardiansInfo, VerifierItem, VerifyStatus } from '@portkey/types/verifier';
import { UserGuardianItem } from './type';

export const resetVerifierState = createAction('verifier/resetVerifierState');

// TODO Will delete
/** @deprecated */
export const fetchVerifierListAsync = createAsyncThunk('verifier/fetchVerifierListAsync', async () => {
  const response: any = await fetchVerifierList();
  return response;
});

// TODO Will delete
/** @deprecated */
export const fetchGuardianListAsync = createAsyncThunk('verifier/fetchGuardianListAsync', async () => {
  const response: GuardiansInfo = await fetchGuardiansList();
  return response;
});

export const setVerifierListAction = createAction<VerifierItem[] | null>('verifier/setVerifierList');

export const setGuardiansAction = createAction<GuardiansInfo | null>('verifier/setGuardians');

export const setCurrentGuardianAction = createAction<UserGuardianItem>('verifier/setCurrentGuardian');
export const setUserGuardianItemStatus = createAction<{ key: string; status: VerifyStatus }>(
  'verifier/setUserGuardianItemStatus',
);

export const setUserGuardianSessionIdAction = createAction<{ key: string; sessionId: string }>(
  'verifier/setCurrentGuardianSessionId',
);
