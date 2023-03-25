import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ContactItemType, RecentContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { fetchRecentTransactionUsers } from './api';
import { initialRecentData } from '@portkey-wallet/hooks/hooks-ca/useRecent';

import { RECENT_LIST_PAGE_SIZE } from '@portkey-wallet/constants/constants-ca/recent';

export interface RecentStateType {
  [caAddress: string]: {
    isFetching: boolean;
    totalRecordCount: number;
    skipCount: number;
    maxResultCount: number;
    recentContactList: RecentContactItemType[];
  };
}

export const initialState: RecentStateType = {};

export const fetchRecentListAsync = createAsyncThunk(
  'fetchRecentListAsync',
  async ({ caAddress, isFirstTime = true }: { caAddress: string; isFirstTime: boolean }, { getState, dispatch }) => {
    const { recent } = getState() as { recent: RecentStateType };
    const { skipCount = 0 } = recent?.[caAddress];

    const response = await fetchRecentTransactionUsers({
      caAddresses: [caAddress],
      skipCount: isFirstTime ? 0 : skipCount,
      maxResultCount: RECENT_LIST_PAGE_SIZE,
    });

    return { isFirstTime, caAddress, response };
  },
);

export const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    initCurrentChainRecentData: (
      state,
      action: PayloadAction<{
        caAddress: string;
      }>,
    ) => {
      const { caAddress } = action.payload;
      state[caAddress] = initialRecentData;
    },
    clearRecent: state => {
      state = initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchRecentListAsync.pending, (state, action) => {});
    builder.addCase(fetchRecentListAsync.rejected, (state, action) => {});
    builder.addCase(fetchRecentListAsync.fulfilled, (state, action) => {
      const { caAddress, isFirstTime, response } = action.payload;

      const targetData = state?.[caAddress] ?? {};
      targetData.isFetching = false;
      targetData.totalRecordCount = response?.totalRecordCount;
      targetData.skipCount += RECENT_LIST_PAGE_SIZE;

      if (isFirstTime) {
        // first Page
        targetData.skipCount = RECENT_LIST_PAGE_SIZE;
        targetData.recentContactList = response.data;
      } else {
        targetData.recentContactList = [...targetData.recentContactList, ...response.data];
      }

      state[caAddress] = targetData;
    });
  },
});

export const { clearRecent, initCurrentChainRecentData } = recentSlice.actions;

export default recentSlice;
