import { request } from '@portkey-wallet/api/api-did';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { FiatType } from './type';

export const fetchBuyFiatListAsync = createAsyncThunk<FiatType[]>('payment/fetchBuyFiatListAsync', async () => {
  const rst: { data: FiatType[] } = await request.payment.getFiatList({
    params: {
      type: 'BUY',
    },
  });
  const { data } = rst;
  const fiatMap: Record<string, FiatType> = {};
  data.forEach(item => {
    const { currency, country } = item;
    const key = `${currency}-${country}`;
    if (!fiatMap[key]) {
      fiatMap[key] = item;
    }
  });

  return Object.values(fiatMap);
});

export const fetchSellFiatListAsync = createAsyncThunk<FiatType[]>('payment/fetchSellFiatListAsync', async () => {
  const rst: { data: FiatType[] } = await request.payment.getFiatList({
    params: {
      type: 'SELL',
    },
  });
  const { data } = rst;
  const fiatMap: Record<string, FiatType> = {};
  data.forEach(item => {
    const { currency, country } = item;
    const key = `${currency}-${country}`;
    if (!fiatMap[key]) {
      fiatMap[key] = item;
    }
  });

  return Object.values(fiatMap);
});
