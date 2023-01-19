import { useAllBalances } from './balances';
import { renderHookWithProvider } from '../../../test/utils/render';
import { createSlice, combineReducers, configureStore } from '@reduxjs/toolkit';
import { stateMock } from '../../../test/data/stateMock';

const tokenBalanceSlice = createSlice({
  name: 'tokenBalance',
  initialState: stateMock.tokenBalance,
  reducers: {},
});

const reducer = combineReducers({
  tokenBalance: tokenBalanceSlice.reducer,
});

const store = configureStore({
  reducer,
});

describe('hooks-balance', () => {
  test('useAllBalances', () => {
    const { result } = renderHookWithProvider(useAllBalances, store);
    expect(result.current.RpcUrl1).toBeDefined();
  });
});



// import { useAllBalances } from './balances';
// import { renderHook } from '@testing-library/react';
// import { stateMock } from '../../../test/data/stateMock';
// import { useAppCASelector } from '.';

// jest.mock('.');

// describe('hooks-balance', () => {
//   test('useAllBalances', () => {
//     jest.mocked(useAppCASelector).mockImplementationOnce(() => stateMock.tokenBalance.balances);
    
//     const { result } = renderHook(() => useAllBalances());
    
//     expect(useAppCASelector).toHaveBeenCalled();
//     expect(result.current?.RpcUrl1).toBeDefined();
//   });
// });
