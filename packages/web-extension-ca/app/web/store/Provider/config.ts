import {
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
} from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { localStorage } from 'redux-persist-webextension-storage';
import { reduxStorageRoot } from 'constants/index';
import { walletSlice } from '@portkey/store/store-ca/wallet/slice';
import chainSlice from '@portkey/store/network/slice';
import tokenBalanceSlice from '@portkey/store/tokenBalance/slice';
import tradeSlice from '@portkey/store/trade/slice';
import tokenSlice from '@portkey/store/token/slice';
import { loginSlice } from 'store/reducers/loginCache/slice';
import { contactSlice } from '@portkey/store/store-ca/contact/slice';
import { guardiansSlice } from '@portkey/store/store-ca/guardians/slice';
import activitySlice from '@portkey/store/store-ca/activity/slice';

interface ThunkOptions<E = any> {
  extraArgument: E;
}

export interface DefaultMiddlewareOptions {
  thunk?: boolean | ThunkOptions;
  immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
  serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
}

export const tokenPersistConfig = {
  key: tokenSlice.name,
  storage: localStorage,
  blacklist: ['tokenDataShowInMarket'],
};

export const activityPersistConfig = {
  key: activitySlice.name,
  storage: localStorage,
  blacklist: ['MAIN', 'TESTNET'],
};

export const walletPersistConfig = {
  key: walletSlice.name,
  storage: localStorage,
  blacklist: [''],
};

export const loginPersistConfig = {
  key: loginSlice.name,
  storage: localStorage,
  blacklist: ['scanWalletInfo', 'scanCaWalletInfo'],
};

export const contactPersistConfig = {
  key: contactSlice.name,
  storage: localStorage,
  blacklist: [''],
};

export const guardiansPersistConfig = {
  key: guardiansSlice.name,
  storage: localStorage,
};

const reduxPersistConfig = {
  key: reduxStorageRoot,
  storage: localStorage,

  // Reducer keys that you do NOT want stored to persistence here.
  // blacklist: [],

  // Optionally, just specify the keys you DO want stored to persistence.
  // An empty array means 'don't store any reducers' -> infinite-red/ignite#409
  whitelist: [
    chainSlice.name,
    tokenBalanceSlice.name,
    tradeSlice.name,
    // tokenSlice.name,
  ],
  // More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
  // transforms: [SetTokenTransform],
};

const defaultMiddlewareOptions: DefaultMiddlewareOptions = {
  thunk: true,
  serializableCheck: {
    // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
};

export default {
  reduxPersistConfig,
  defaultMiddlewareOptions,
};
