import { walletSlice } from '@portkey-wallet/store/store-ca/wallet/slice';
import { loginSlice } from 'store/reducers/loginCache/slice';
import { contactSlice } from '@portkey-wallet/store/store-ca/contact/slice';
import userReducer, { userSlice } from 'store/reducers/user/slice';
import tokenBalanceSlice from '@portkey-wallet/store/tokenBalance/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import tokenSlice from '@portkey-wallet/store/store-ca/tokenManagement/slice';
import assetsSlice from '@portkey-wallet/store/store-ca/assets/slice';
import activitySlice from '@portkey-wallet/store/store-ca/activity/slice';
import recentSlice from '@portkey-wallet/store/store-ca/recent/slice';
import ModalSlice from 'store/reducers/modal/slice';
import CommonSlice from 'store/reducers/common/slice';
import { customCombineReducers } from 'store/utils/customCombineReducers';
import { persistReducer } from 'redux-persist';
import {
  loginPersistConfig,
  tokenPersistConfig,
  walletPersistConfig,
  contactPersistConfig,
  guardiansPersistConfig,
  activityPersistConfig,
  recentPersistConfig,
  assetPersistConfig,
} from './config';
import { guardiansSlice } from '@portkey-wallet/store/store-ca/guardians/slice';

export const tokenReducer = persistReducer(tokenPersistConfig, tokenSlice.reducer);
export const assetReducer = persistReducer(assetPersistConfig, assetsSlice.reducer);
export const activityReducer = persistReducer(activityPersistConfig, activitySlice.reducer);
export const recentReducer = persistReducer(recentPersistConfig, recentSlice.reducer);
export const walletReducer = persistReducer(walletPersistConfig, walletSlice.reducer);
export const loginReducer = persistReducer(loginPersistConfig, loginSlice.reducer);
export const guardiansReducer = persistReducer(guardiansPersistConfig, guardiansSlice.reducer);
export const contactReducer = persistReducer(contactPersistConfig, contactSlice.reducer);

const rootReducer = customCombineReducers({
  [walletSlice.name]: walletReducer,
  [loginSlice.name]: loginReducer,
  [guardiansSlice.name]: guardiansReducer,
  [contactSlice.name]: contactReducer,
  [userSlice.name]: userReducer,
  [tokenBalanceSlice.name]: tokenBalanceSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [tokenSlice.name]: tokenReducer,
  [activitySlice.name]: activityReducer,
  [recentSlice.name]: recentReducer,
  [ModalSlice.name]: ModalSlice.reducer,
  [CommonSlice.name]: CommonSlice.reducer,
  [assetsSlice.name]: assetReducer,
});

export default rootReducer;
