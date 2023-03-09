import { combineReducers } from '@reduxjs/toolkit';
import { walletSlice } from '@portkey-wallet/store/store-ca/wallet/slice';
import { contactSlice } from '@portkey-wallet/store/store-ca/contact/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import tokenSlice from '@portkey-wallet/store/token/slice';
import tokenBalanceSlice from '@portkey-wallet/store/tokenBalance/slice';
import settingsSlice from '@portkey-wallet/store/settings/slice';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer } from 'redux-persist';
import userSlice from './user/slice';
import { rateApi } from '@portkey-wallet/store/rate/api';
import { recentSlice } from '@portkey-wallet/store/store-ca/recent/slice';
import { assetsSlice } from '@portkey-wallet/store/store-ca/assets/slice';
import { tokenManagementSlice } from '@portkey-wallet/store/store-ca/tokenManagement/slice';

import { activitySlice } from '@portkey-wallet/store/store-ca/activity/slice';
import { guardiansSlice } from '@portkey-wallet/store/store-ca/guardians/slice';

const userPersistConfig = {
  key: userSlice.name,
  storage: AsyncStorage,
  blacklist: ['credentials'],
};
const tokenPersistConfig = {
  key: tokenSlice.name,
  storage: AsyncStorage,
  blacklist: ['tokenDataShowInMarket'],
};

const tokenBalancePersistConfig = {
  key: tokenBalanceSlice.name,
  storage: AsyncStorage,
};

const settingsPersistConfig = {
  key: settingsSlice.name,
  storage: AsyncStorage,
};

const recentPersistConfig = {
  key: recentSlice.name,
  storage: AsyncStorage,
};

const activityPersistConfig = {
  key: activitySlice.name,
  storage: AsyncStorage,
};

const assetsPersistConfig = {
  key: assetsSlice.name,
  storage: AsyncStorage,
};

const guardiansPersistConfig = {
  key: guardiansSlice.name,
  storage: AsyncStorage,
};

export const userReducer = persistReducer(userPersistConfig, userSlice.reducer);
export const tokenReducer = persistReducer(tokenPersistConfig, tokenSlice.reducer);
export const tokenBalanceReducer = persistReducer(tokenBalancePersistConfig, tokenBalanceSlice.reducer);
export const settingsReducer = persistReducer(settingsPersistConfig, settingsSlice.reducer);
export const recentReducer = persistReducer(recentPersistConfig, recentSlice.reducer);
export const activityReducer = persistReducer(activityPersistConfig, activitySlice.reducer);
export const assetsReducer = persistReducer(assetsPersistConfig, assetsSlice.reducer);
export const guardiansReducer = persistReducer(guardiansPersistConfig, guardiansSlice.reducer);

const rootReducer = combineReducers({
  [userSlice.name]: userReducer,
  [walletSlice.name]: walletSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [tokenSlice.name]: tokenReducer,
  [contactSlice.name]: contactSlice.reducer,
  [guardiansSlice.name]: guardiansReducer,
  [tokenBalanceSlice.name]: tokenBalanceReducer,
  [settingsSlice.name]: settingsReducer,
  [recentSlice.name]: recentReducer,
  [rateApi.reducerPath]: rateApi.reducer,
  [assetsSlice.name]: assetsReducer,
  [activitySlice.name]: activityReducer,
  [tokenManagementSlice.name]: tokenManagementSlice.reducer,
});

export default rootReducer;
