import { createAsyncThunk } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { HandleTokenArgTypes } from '@portkey/types/types-ca/token';
import { fetchUserTokenList } from './api';

export const addTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/addTokenInCurrentAccount');

export const deleteTokenInCurrentAccount = createAction<HandleTokenArgTypes>('token/deleteTokenInCurrentAccount');

export const fetchTokenListAsync = createAsyncThunk(
  'tokenManagement/fetchTokenList',
  async ({ pageNo, pageSize, filter }: { pageNo: number; pageSize: number; filter?: string }) => {
    const response = await fetchUserTokenList({ pageNo, pageSize, filter });
    return { list: response.items };
  },
);
