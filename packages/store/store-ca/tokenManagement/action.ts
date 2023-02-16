import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { HandleTokenArgTypes, TokenState } from '@portkey/types/types-ca/token';
import { fetchAllTokenList } from './api';

export const addTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/addTokenInCurrentAccount');

export const deleteTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/deleteTokenInCurrentAccount');

export const fetchAllTokenListAsync = createAsyncThunk(
  'tokenManagement/fetchAllTokenListAsync',
  async ({ keyword = '' }: { keyword?: string }, { getState, dispatch }) => {
    const { totalRecordCount, skipCount, maxResultCount } = getState() as TokenState;

    // if (totalRecordCount === 0 || totalRecordCount > accountTokenList.length) {
    const response = await fetchAllTokenList({ skipCount, maxResultCount, keyword });
    return { list: response.items, totalRecordCount: response.totalRecordCount };
    // }

    // return { list: [], totalRecordCount };
  },
);
