import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { HandleTokenArgTypes, TokenState } from '@portkey/types/types-ca/token';
import { fetchAllTokenList } from './api';
import { request } from '@portkey/api/api-did';

export const addTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/addTokenInCurrentAccount');

export const deleteTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/deleteTokenInCurrentAccount');

export const fetchAllTokenListAsync = createAsyncThunk(
  'tokenManagement/fetchAllTokenListAsync',
  async ({ keyword = '', chainIdArray }: { keyword?: string; chainIdArray?: string[] }, { getState, dispatch }) => {
    const { totalRecordCount, skipCount, maxResultCount } = getState() as TokenState;

    // if (totalRecordCount === 0 || totalRecordCount > accountTokenList.length) {
    const response = await fetchAllTokenList({ skipCount, maxResultCount, keyword, chainIdArray: chainIdArray || [] });
    return { list: response.items, totalRecordCount: response.totalRecordCount };
  },

  // return { list: [], totalRecordCount };
  // },
);

export const getSymbolImagesAsync = createAsyncThunk('tokenManagement/getSymbolImagesAsync', async () => {
  const response = await request.assets.getSymbolImages({});
  return response.symbolImages;
});
