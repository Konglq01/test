import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { FiatType } from './type';

export const fetchFiatListAsync = createAsyncThunk<FiatType[]>('contact/fetchContactListAsync', async () => {
  return [
    {
      currency: 'USD',
      country: 'US',
      payWayCode: '10001',
      payWayName: 'Credit Card',
      fixedFee: 0.3,
      rateFee: 0.051,
      payMin: 30.0,
      payMax: 2000.0,
    },
    {
      currency: 'EUR',
      country: 'US',
      payWayCode: '10001',
      payWayName: 'Credit Card',
      fixedFee: 0.3,
      rateFee: 0.051,
      payMin: 30.0,
      payMax: 2000.0,
    },
    {
      currency: 'GBP',
      country: 'GB',
      payWayCode: '10001',
      payWayName: 'Credit Card',
      fixedFee: 0.3,
      rateFee: 0.051,
      payMin: 30.0,
      payMax: 2000.0,
    },
  ];
});
