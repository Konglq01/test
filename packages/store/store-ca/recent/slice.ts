import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ContactItemType, RecentContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { fetchRecentTransactionUsers } from './api';

export interface RecentStateType {
  [caAddress: string]: {
    recentContactList: RecentContactItemType[];
    isFetching: boolean;
    totalRecordCount: number;
    skipCount: number;
    maxResultCount: number;
  };
}
export const initialState: RecentStateType = {};

export const fetchRecentListAsync = createAsyncThunk(
  'fetchTokenListAsync',
  async (
    {
      caAddresses = [],
      skipCount = 0,
      maxResultCount = 10,
    }: { caAddresses: string[]; skipCount?: number; maxResultCount?: number },
    { getState, dispatch },
  ) => {
    // const {  } = getState();

    console.log(getState, dispatch);

    // if (totalRecordCount === 0 || totalRecordCount > accountTokenList.length) {
    const response = await fetchRecentTransactionUsers({ caAddresses, skipCount, maxResultCount });

    return { list: response.data, totalRecordCount: 0 };
  },
);

export const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    upDateContact: (
      state,
      action: PayloadAction<{
        contact: ContactItemType;
      }>,
    ) => {},
    clearRecent: state => {
      state = initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchRecentListAsync.pending, (state, action) => {});
    builder.addCase(fetchRecentListAsync.rejected, (state, action) => {});
    builder.addCase(fetchRecentListAsync.fulfilled, (state, action) => {
      const { list } = action.payload;
    });
  },
});

export const { clearRecent } = recentSlice.actions;

export default recentSlice;
