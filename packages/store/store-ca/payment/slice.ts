import { createSlice } from '@reduxjs/toolkit';
import { fetchBuyFiatListAsync, fetchSellFiatListAsync } from './actions';
import { PaymentStateType } from './type';

const initialState: PaymentStateType = {
  buyFiatList: [],
  sellFiatList: [],
};
export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBuyFiatListAsync.fulfilled, (state, action) => {
        state.buyFiatList = action.payload;
      })
      .addCase(fetchBuyFiatListAsync.rejected, (state, action) => {
        console.log('fetchBuyFiatListAsync.rejected: error', action.error.message);
      })
      .addCase(fetchSellFiatListAsync.fulfilled, (state, action) => {
        state.sellFiatList = action.payload;
      })
      .addCase(fetchSellFiatListAsync.rejected, (state, action) => {
        console.log('fetchSellFiatListAsync.rejected: error', action.error.message);
      });
  },
});
