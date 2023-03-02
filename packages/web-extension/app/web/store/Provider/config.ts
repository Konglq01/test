import {
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
} from '@reduxjs/toolkit';
import { createTransform, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { localStorage } from 'redux-persist-webextension-storage';
import { reduxStorageRoot } from 'constants/index';
import { walletSlice } from '@portkey-wallet/store/wallet/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import addressBook from '@portkey-wallet/store/addressBook/slice';
import tokenBalanceSlice from '@portkey-wallet/store/tokenBalance/slice';
import tradeSlice from '@portkey-wallet/store/trade/slice';
import tokenSlice from '@portkey-wallet/store/token/slice';
import { TokenState } from '@portkey-wallet/types/types-eoa/token';

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

const reduxPersistConfig = {
  key: reduxStorageRoot,
  storage: localStorage,

  // Reducer keys that you do NOT want stored to persistence here.
  // blacklist: [],

  // Optionally, just specify the keys you DO want stored to persistence.
  // An empty array means 'don't store any reducers' -> infinite-red/ignite#409
  whitelist: [
    walletSlice.name,
    chainSlice.name,
    addressBook.name,
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
