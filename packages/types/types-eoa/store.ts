import { tokenSlice } from '@portkey/store/token/slice';
import { TokenState } from '@portkey/types/types-eoa/token';
import { tokenBalanceSlice } from '@portkey/store/tokenBalance/slice';
import { tokenBalanceState } from './tokenBalance';
import { RootCommonState } from '../store';
import { walletSlice } from '@portkey/store/wallet/slice';
import { WalletState } from '@portkey/store/wallet/type';
export type EOACommonState = RootCommonState & {
  [tokenSlice.name]: TokenState;
  [tokenBalanceSlice.name]: tokenBalanceState;
  [walletSlice.name]: WalletState;
};
