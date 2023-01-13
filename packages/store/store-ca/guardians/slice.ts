import { VerifierItem, VerifyStatus } from '@portkey/types/verifier';
import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import {
  resetVerifierState,
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
import { GUARDIAN_TYPE_TYPE } from './utils';

const initialState: GuardiansState = {};
export const guardiansSlice = createSlice({
  name: 'guardians',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(resetVerifierState, state => {
        return { ...initialState, verifierMap: state.verifierMap };
      })
      .addCase(setVerifierListAction, (state, action) => {
        if (!action.payload) {
          state.verifierMap = {};
          return;
        }
        const map: GuardiansState['verifierMap'] = {};
        action.payload.forEach((item: VerifierItem) => {
          map[item.name] = item;
        });
        state.verifierMap = map;
      })
      .addCase(setGuardiansAction, (state, action) => {
        const { verifierMap } = state;
        if (!action.payload) {
          state.userGuardiansList = [];
          state.userGuardianStatus = {};
          return;
        }
        const { loginGuardianTypeIndexes, guardians } = action.payload;
        const _guardians: (typeof guardians[number] & { isLoginAccount?: boolean })[] = [...guardians];
        loginGuardianTypeIndexes.forEach(item => {
          _guardians[item].isLoginAccount = true;
        });

        const userStatus = state.userGuardianStatus ?? {};
        const guardiansList = _guardians.map(guardian => {
          const loginGuardianType = guardian.guardianType.guardianType;
          const verifier = verifierMap?.[guardian.verifier.name];
          const guardiansType =
            typeof guardian.guardianType.type === 'string'
              ? GUARDIAN_TYPE_TYPE[guardian.guardianType.type]
              : guardian.guardianType.type;
          const _guardian = {
            key: `${loginGuardianType}&${verifier?.name}`,
            isLoginAccount: guardian.isLoginAccount,
            verifier: verifier,
            loginGuardianType,
            guardiansType,
          };

          userStatus[_guardian.key] = { ..._guardian, status: userStatus?.[_guardian.key]?.status };
          return _guardian;
        });
        state.userGuardiansList = guardiansList;
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
        if (!state.guardianExpiredTime) {
          // && status === VerifyStatus.Verifying
          // TODO
          state.guardianExpiredTime = moment().add(3, 'minute').subtract(2, 'minute').valueOf();
        }
      })
      .addCase(resetUserGuardianStatus, state => {
        state.userGuardianStatus = {};
      })
      .addCase(setUserGuardianSessionIdAction, (state, action) => {
        const { key, sessionId } = action.payload;
        if (!state.userGuardianStatus?.[key]) throw Error("Can't find this item");
        state.userGuardianStatus[key]['sessionId'] = sessionId;
        if (state.currentGuardian?.key === key) state.currentGuardian['sessionId'] = sessionId;
      });
  },
});
