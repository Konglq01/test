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
  resetUserGuardianItemStatus,
  setUserGuardianStatus,
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
        loginGuardianTypeIndexes.forEach((item, idx) => {
          // TODO: delete test code
          if (idx === 0) _guardians[item].isLoginAccount = true;
        });
        const userStatus = state.userGuardianStatus ?? {};
        const guardiansList = _guardians.map(guardian => {
          const loginGuardianType = guardian.guardianType.guardianType;
          // TODO
          const verifier = verifierMap?.[guardian.verifier.name || 'portkey'];
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
        console.log(JSON.parse(JSON.stringify(state.userGuardianStatus)), action.payload, 'setCurrentGuardianAction');
      })
      .addCase(setUserGuardianItemStatus, (state, action) => {
        const { key, status } = action.payload;
        if (!state.userGuardianStatus?.[key]) throw Error("Can't find this item");
        state.userGuardianStatus[key]['status'] = status;
        if (!state.guardianExpiredTime) {
          // && status === VerifyStatus.Verifying
          state.guardianExpiredTime = moment().add(1, 'h').subtract(2, 'minute').valueOf();
        }
      })
      .addCase(setUserGuardianStatus, (state, action) => {
        const { key, status } = action.payload;
        if (!state.userGuardianStatus) state.userGuardianStatus = {};
        // if (!state.userGuardianStatus?.[key]) state.userGuardianStatus[key] = {};
      })
      .addCase(resetUserGuardianItemStatus, state => {
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
