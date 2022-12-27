import { VerifierItem, VerifyStatus } from '@portkey/types/verifier';
import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import {
  fetchGuardianListAsync,
  fetchVerifierListAsync,
  resetVerifierState,
  setUserGuardianItemStatus,
  setCurrentGuardianAction,
  setVerifierListAction,
  setUserGuardianSessionIdAction,
} from './actions';
import { GuardiansState } from './type';

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
      .addCase(fetchVerifierListAsync.fulfilled, (state, action) => {
        const map: GuardiansState['verifierMap'] = {};
        action.payload.forEach((item: VerifierItem) => {
          map[item.name] = item;
        });
        state.verifierMap = map;
      })
      .addCase(fetchVerifierListAsync.rejected, (state, action) => {
        throw Error(action.error.message);
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
      .addCase(fetchGuardianListAsync.fulfilled, (state, action) => {
        const { verifierMap } = state;
        // if(!verifierMap) throw '';
        const { loginGuardianTypeIndexes, guardians } = action.payload;
        const _guardians: (typeof guardians[number] & { isLoginAccount?: boolean })[] = [...guardians];
        loginGuardianTypeIndexes.forEach((item, idx) => {
          // TODO: delete test code
          if (idx === 0) _guardians[item].isLoginAccount = true;
        });
        const userStatus = state.userGuardianStatus ?? {};
        const guardiansList = _guardians.map(guardian => {
          const loginGuardianType = guardian.guardianType.guardianType;
          const verifier = verifierMap?.[guardian.verifier.name];
          const _guardian = {
            key: `${loginGuardianType}&${verifier?.name}`,
            isLoginAccount: guardian.isLoginAccount,
            verifier: verifier,
            loginGuardianType,
            guardiansType: guardian.guardianType.type,
          };
          userStatus[_guardian.key] = { ..._guardian, status: userStatus?.[_guardian.key]?.status };
          return _guardian;
        });
        state.userGuardiansList = guardiansList;
        state.userGuardianStatus = userStatus;
      })
      .addCase(fetchGuardianListAsync.rejected, (state, action) => {
        throw Error(action.error.message);
      })
      .addCase(setCurrentGuardianAction, (state, action) => {
        state.currentGuardian = action.payload;
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
      .addCase(setUserGuardianSessionIdAction, (state, action) => {
        const { key, sessionId } = action.payload;
        if (!state.userGuardianStatus?.[key]) throw Error("Can't find this item");
        state.userGuardianStatus[key]['sessionId'] = sessionId;
      });
  },
});
