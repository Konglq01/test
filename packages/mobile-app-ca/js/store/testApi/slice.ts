import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://aelf-test-node.aelf.io/' }),
  endpoints: builder => ({
    getBlockByHeight: builder.query<any, string>({
      query: blockHeight => `api/blockChain/blockByHeight?blockHeight=${blockHeight}&includeTransactions=false`,
    }),
  }),
});
export const { useGetBlockByHeightQuery } = testApi;
