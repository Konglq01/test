import { GuardianAccount } from '@portkey-wallet/types/guardian';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
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
import { GuardiansState, UserGuardianStatus } from './type';
import { GUARDIAN_TYPE_TYPE } from '@portkey-wallet/constants/constants-ca/guardian';

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
        const { loginGuardianAccountIndexes, guardianAccounts } = action.payload;
        const _guardianAccounts: (GuardianAccount & { isLoginAccount?: boolean })[] = [...guardianAccounts];
        loginGuardianAccountIndexes.forEach(item => {
          _guardianAccounts[item].isLoginAccount = true;
        });

        const userStatus = state.userGuardianStatus ?? {};
        const guardiansList = _guardianAccounts.map(_guardianAccount => {
          const guardianAccount = _guardianAccount.value;
          const verifier = verifierMap?.[_guardianAccount.guardian.verifier.id];
          const guardianType: LoginType = (
            typeof _guardianAccount.guardian.type === 'string'
              ? GUARDIAN_TYPE_TYPE[_guardianAccount.guardian.type]
              : _guardianAccount.guardian.type
          ) as any;

          const _guardian: UserGuardianStatus = {
            key: `${guardianAccount}&${verifier?.name}`,
            isLoginAccount: _guardianAccount.isLoginAccount,
            verifier: verifier,
            guardianAccount,
            guardianType,
          };
          console.log(verifier, _guardianAccounts, verifierMap, 'verifier===');

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
