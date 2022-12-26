import { combineReducers } from '@reduxjs/toolkit';
import { walletSlice } from '@portkey/store/wallet/slice';
import addressBook from '@portkey/store/addressBook/slice';
import chainSlice from '@portkey/store/network/slice';
import tokenSlice from '@portkey/store/token/slice';
import tokenBalanceSlice from '@portkey/store/tokenBalance/slice';
import settingsSlice from '@portkey/store/settings/slice';
import tradeSlice from '@portkey/store/trade/slice';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer } from 'redux-persist';
import userSlice from './user/slice';
import { counterSlice } from './counter/slice';
import { rateApi } from '@portkey/store/rate/api';

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

const tradePersistConfig = {
  key: tradeSlice.name,
  storage: AsyncStorage,
};

export const userReducer = persistReducer(userPersistConfig, userSlice.reducer);
export const tokenReducer = persistReducer(tokenPersistConfig, tokenSlice.reducer);
export const tokenBalanceReducer = persistReducer(tokenBalancePersistConfig, tokenBalanceSlice.reducer);
export const settingsReducer = persistReducer(settingsPersistConfig, settingsSlice.reducer);
export const tradeReducer = persistReducer(tradePersistConfig, tradeSlice.reducer);

const rootReducer = combineReducers({
  [counterSlice.name]: counterSlice.reducer,
  [userSlice.name]: userReducer,
  [walletSlice.name]: walletSlice.reducer,
  [addressBook.name]: addressBook.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [tokenSlice.name]: tokenReducer,
  [tokenBalanceSlice.name]: tokenBalanceReducer,
  [settingsSlice.name]: settingsReducer,
  [tradeSlice.name]: tradeReducer,
  [rateApi.reducerPath]: rateApi.reducer,
});

export default rootReducer;
