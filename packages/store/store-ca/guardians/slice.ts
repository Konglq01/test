import { VerifierItem, VerifyStatus } from '@portkey-wallet/types/verifier';
import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import {
  resetGuardiansState,
  setUserGuardianItemStatus,
  setCurrentGuardianAction,
  setVerifierListAction,
  setUserGuardianSessionIdAction,
  setGuardiansAction,
  resetUserGuardianStatus,
  setUserGuardianStatus,
  setPreGuardianAction,
  setOpGuardianAction,
} from './actions';
import { GuardiansState } from './type';
import { GUARDIAN_TYPE_TYPE, LoginNumType } from '@portkey-wallet/constants/constants-ca/guardian';

const initialState: GuardiansState = {};
export const guardiansSlice = createSlice({
  name: 'guardians',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetGuardiansState, state => {
        return { ...initialState, verifierMap: state.verifierMap };
      })
      .addCase(setVerifierListAction, (state, action) => {
        if (!action.payload) {
          state.verifierMap = {};
          return;
        }
        const map: GuardiansState['verifierMap'] = {};
        action.payload.forEach((item: VerifierItem) => {
          map[item.id] = item;
        });
        console.log(map, 'verifierMap==');
        state.verifierMap = map;
      })
      .addCase(setGuardiansAction, (state, action) => {
        console.log(action, 'action===GetHolderInfo');
        const { verifierMap } = state;
        if (!action.payload) {
          state.userGuardiansList = [];
          state.userGuardianStatus = {};
          return;
        }
        const { guardianList } = action.payload;
        const userStatus = state.userGuardianStatus ?? {};

        const _guardianList = guardianList.guardians.map(item => {
          const key = `${item.guardianIdentifier}&${item.verifierId}`;
          const _guardian = {
            ...item,
            guardianAccount: item.guardianIdentifier || item.identifierHash,
            guardianType: LoginNumType[item.type] ?? (GUARDIAN_TYPE_TYPE as any)[item.type],
            key,
            verifier: verifierMap?.[item.verifierId],
            isLoginAccount: item.isLoginGuardian,
          };
          console.log(_guardian, '=======_guardian');

          userStatus[key] = { ..._guardian, status: userStatus?.[key]?.status };
          return _guardian;
        });

        state.userGuardiansList = _guardianList;
        state.userGuardianStatus = userStatus;
        state.guardianExpiredTime = undefined;
      })
      .addCase(setPreGuardianAction, (state, action) => {
        if (!action.payload) {
          state.preGuardian = undefined;
        } else {
          state.preGuardian = {
            ...state.userGuardianStatus?.[action.payload.key],
            ...action.payload,
          };
        }
      })
      .addCase(setOpGuardianAction, (state, action) => {
        if (!action.payload) {
          state.opGuardian = undefined;
        } else {
          state.opGuardian = {
            ...state.userGuardianStatus?.[action.payload.key],
            ...action.payload,
          };
        }
      })
      .addCase(setCurrentGuardianAction, (state, action) => {
        state.currentGuardian = {
          ...state.userGuardianStatus?.[action.payload.key],
          ...action.payload,
        };
        state.userGuardianStatus = {
          ...state.userGuardianStatus,
          [action.payload.key]: state.currentGuardian,
        };
      })
      .addCase(setUserGuardianStatus, (state, action) => {
        const userStatus = action.payload;
        state.userGuardianStatus = userStatus;
      })
      .addCase(setUserGuardianItemStatus, (state, action) => {
        const { key, status, signature, verificationDoc } = action.payload;
        if (!state.userGuardianStatus?.[key]) throw Error("Can't find this item");
        state.userGuardianStatus[key]['status'] = status;
        state.userGuardianStatus[key]['signature'] = signature;
        state.userGuardianStatus[key]['verificationDoc'] = verificationDoc;
        if (!state.guardianExpiredTime && status === VerifyStatus.Verified) {
          state.guardianExpiredTime = moment().add(1, 'h').subtract(2, 'minute').valueOf();
        }
      })
      .addCase(resetUserGuardianStatus, state => {
        state.userGuardianStatus = {};
      })
      .addCase(setUserGuardianSessionIdAction, (state, action) => {
        const { key, verifierInfo } = action.payload;
        if (!state.userGuardianStatus?.[key]) throw Error("Can't find this item");
        state.userGuardianStatus[key]['verifierInfo'] = verifierInfo;
        if (state.currentGuardian?.key === key) state.currentGuardian['verifierInfo'] = verifierInfo;
      });
  },
});
