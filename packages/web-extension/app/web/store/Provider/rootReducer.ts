import { walletSlice } from '@portkey/store/wallet/slice';
import chainSlice from '@portkey/store/network/slice';
import userReducer, { userSlice } from 'store/reducers/user/slice';
import addressBook from '@portkey/store/addressBook/slice';
import tokenBalanceSlice from '@portkey/store/tokenBalance/slice';
import tradeSlice from '@portkey/store/trade/slice';
import tokenSlice from '@portkey/store/token/slice';
import { rateApi } from '@portkey/store/rate/api';
import ModalSlice from 'store/reducers/modal/slice';
import CommonSlice from 'store/reducers/common/slice';
import { customCombineReducers } from 'store/utils/customCombineReducers';
import { persistReducer } from 'redux-persist';
import { tokenPersistConfig } from './config';

export const tokenReducer = persistReducer(tokenPersistConfig, tokenSlice.reducer);

const rootReducer = customCombineReducers({
  [walletSlice.name]: walletSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [userSlice.name]: userReducer,
  [addressBook.name]: addressBook.reducer,
  [tokenBalanceSlice.name]: tokenBalanceSlice.reducer,
  [tradeSlice.name]: tradeSlice.reducer,
  [tokenSlice.name]: tokenReducer,
  [rateApi.reducerPath]: rateApi.reducer,
  [ModalSlice.name]: ModalSlice.reducer,
  [CommonSlice.name]: CommonSlice.reducer,
});

export default rootReducer;
