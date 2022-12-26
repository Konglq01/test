import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const getCMS = createApi({
  reducerPath: 'getCMS',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:1337/' }),
  endpoints: builder => ({
    getChainList: builder.query<any, void>({
      query: () => `/api/networks?populate=network`,
    }),
  }),
});

export const { useGetChainListQuery } = getCMS;
