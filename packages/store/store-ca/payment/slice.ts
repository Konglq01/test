import { createSlice } from '@reduxjs/toolkit';
import { fetchFiatListAsync } from './actions';
import { PaymentStateType } from './type';

const initialState: PaymentStateType = {
  fiatList: [],
};
export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFiatListAsync.fulfilled, (state, action) => {
        state.fiatList = action.payload;
      })
      .addCase(fetchFiatListAsync.rejected, (state, action) => {
        console.log('fetchFiatListAsync.rejected: error', action.error.message);
      });
  },
});
