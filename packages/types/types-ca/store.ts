import { RootCommonState } from '../store';
import { tokenBalanceSlice } from '@portkey/store/tokenBalance/slice';
import { tokenManagementSlice } from '@portkey/store/store-ca/tokenManagement/slice';
import { recentSlice, RecentStateType } from '@portkey/store/store-ca/recent/slice';

import { TokenState } from './token';
import { TokenBalanceState } from './tokenBalance';
import { assetsSlice, AssetsStateType } from '@portkey/store/store-ca/assets/slice';
import { activitySlice, ActivityStateType } from '@portkey/store/store-ca/activity/slice';
import { walletSlice } from '@portkey/store/store-ca/wallet/slice';
import { WalletState } from '@portkey/store/store-ca/wallet/type';
import { GuardiansState } from '@portkey/store/store-ca/guardians/type';
import { guardiansSlice } from '@portkey/store/store-ca/guardians/slice';
import { contactSlice, ContactState } from '@portkey/store/store-ca/contact/slice';

export type CACommonState = RootCommonState & {
  [tokenManagementSlice.name]: TokenState;
  [tokenBalanceSlice.name]: TokenBalanceState;
  [recentSlice.name]: RecentStateType;
  [assetsSlice.name]: AssetsStateType;
  [activitySlice.name]: ActivityStateType;
  [walletSlice.name]: WalletState;
  [contactSlice.name]: ContactState;
  [guardiansSlice.name]: GuardiansState;
};
