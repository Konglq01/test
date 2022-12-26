import { fetchGuardiansList, fetchVerifierList } from './api';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { GuardiansInfo, VerifyStatus } from '@portkey/types/verifier';
import { UserGuardianItem } from './type';

export const resetVerifierState = createAction('verifier/resetVerifierState');

export const fetchVerifierListAsync = createAsyncThunk('verifier/fetchVerifierListAsync', async () => {
  const response: any = await fetchVerifierList();
  return response;
});

export const fetchGuardianListAsync = createAsyncThunk('verifier/fetchGuardianListAsync', async () => {
  const response: GuardiansInfo = await fetchGuardiansList();
  return response;
});

export const setCurrentGuardianAction = createAction<UserGuardianItem>('verifier/setCurrentGuardian');
export const setUserGuardianItemStatus = createAction<{ key: string; status: VerifyStatus }>(
  'verifier/setUserGuardianItemStatus',
);
