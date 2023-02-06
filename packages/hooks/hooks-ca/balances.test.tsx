import { useCurrentNetworkBalances, useAccountListNativeBalances } from './balances';
import { renderHookWithProvider } from '../../../test/utils/render';
import { createSlice, combineReducers, configureStore } from '@reduxjs/toolkit';

describe('useCurrentNetworkBalances', () => {
  const balances1 = {
    balances: {
      rpcUrl1: {
        address1: {
          ELF: 'value1',
        },
      },
    },
  };
  const balances2 = {
    balances: undefined,
  };
  const chain1 = {
    currentChain: {
      rpcUrl: 'rpcUrl1',
    },
  };
  const chain2 = {
    currentChain: {
      rpcUrl: 'rpcUrl2',
    },
  };
  const chain3 = {
    currentChain: {
      rpcUrl: undefined,
    },
  };
  const balances1Slice = createSlice({
    name: 'balances1',
    initialState: balances1,
    reducers: {},
  });
  const balances2Slice = createSlice({
    name: 'balances2',
    initialState: balances2,
    reducers: {},
  });
  const chain1Slice = createSlice({
    name: 'chain1',
    initialState: chain1,
    reducers: {},
  });
  const chain2Slice = createSlice({
    name: 'chain2',
    initialState: chain2,
    reducers: {},
  });
  const chain3Slice = createSlice({
    name: 'chain3',
    initialState: chain3,
    reducers: {},
  });
  const reducer1 = combineReducers({
    tokenBalance: balances1Slice.reducer,
    chain: chain3Slice.reducer,
  });
  const reducer2 = combineReducers({
    tokenBalance: balances2Slice.reducer,
    chain: chain1Slice.reducer,
  });
  const reducer3 = combineReducers({
    tokenBalance: balances1Slice.reducer,
    chain: chain1Slice.reducer,
  });
  const reducer4 = combineReducers({
    tokenBalance: balances1Slice.reducer,
    chain: chain2Slice.reducer,
  });
  const store1 = configureStore({
    reducer: reducer1,
  });

  const store2 = configureStore({
    reducer: reducer2,
  });
  const store3 = configureStore({
    reducer: reducer3,
  });

  const store4 = configureStore({
    reducer: reducer4,
  });

  test('rpcUrl undefined, and return undefined', () => {
    const { result } = renderHookWithProvider(useCurrentNetworkBalances, store1);
    expect(result.current).toBeUndefined();
  });
  test('balances undefined, and return undefined', () => {
    const { result } = renderHookWithProvider(useCurrentNetworkBalances, store2);
    expect(result.current).toBeUndefined();
  });
  test('all data defined, and return an object', () => {
    const { result } = renderHookWithProvider(useCurrentNetworkBalances, store3);
    expect(result.current).toHaveProperty('address1', { ELF: 'value1' });
  });
  test('balances[currentNetwork.rpcUrl] undefined, and return undefined', () => {
    const { result } = renderHookWithProvider(useCurrentNetworkBalances, store4);
    expect(result.current).toBeUndefined();
  });
});

describe('useAccountListNativeBalances', () => {
  const balances1 = {
    balances: {
      rpcUrl1: {
        address1: {
          ELF: 'value1',
        },
        address2: {
          ELF: 'value2',
        },
      },
    },
  };
  const balances2 = {
    balances: {
      rpcUrl1: {
        address1: {
          ELF: 'value1',
        },
      },
    },
  };
  const wallet1 = {
    accountList: [
      {
        address: 'address1',
      },
      {
        address: 'address2',
      },
    ],
  };
  const wallet2 = {
    accountList: undefined,
  };
  const chain1 = {
    currentChain: {
      rpcUrl: 'rpcUrl1',
      nativeCurrency: { symbol: 'ELF' },
    },
  };
  const chain2 = {
    currentChain: {
      rpcUrl: undefined,
      nativeCurrency: undefined,
    },
  };
  const chain3 = {
    currentChain: undefined,
  };

  const balances1Slice = createSlice({
    name: 'balances1',
    initialState: balances1,
    reducers: {},
  });
  const balances2Slice = createSlice({
    name: 'balances2',
    initialState: balances2,
    reducers: {},
  });
  const wallet1Slice = createSlice({
    name: 'wallet1',
    initialState: wallet1,
    reducers: {},
  });
  const wallet2Slice = createSlice({
    name: 'wallet2',
    initialState: wallet2,
    reducers: {},
  });
  const chain1Slice = createSlice({
    name: 'chain1',
    initialState: chain1,
    reducers: {},
  });
  const chain2Slice = createSlice({
    name: 'chain2',
    initialState: chain2,
    reducers: {},
  });
  const chain3Slice = createSlice({
    name: 'chain3',
    initialState: chain3,
    reducers: {},
  });

  const reducer1 = combineReducers({
    tokenBalance: balances1Slice.reducer,
    wallet: wallet1Slice.reducer,
    chain: chain1Slice.reducer,
  });
  const reducer2 = combineReducers({
    tokenBalance: balances2Slice.reducer,
    wallet: wallet1Slice.reducer,
    chain: chain3Slice.reducer,
  });
  const reducer3 = combineReducers({
    tokenBalance: balances1Slice.reducer,
    wallet: wallet1Slice.reducer,
    chain: chain2Slice.reducer,
  });
  const reducer4 = combineReducers({
    tokenBalance: balances1Slice.reducer,
    wallet: wallet2Slice.reducer,
    chain: chain1Slice.reducer,
  });
  const reducer5 = combineReducers({
    tokenBalance: balances2Slice.reducer,
    wallet: wallet1Slice.reducer,
    chain: chain1Slice.reducer,
  });

  const store1 = configureStore({
    reducer: reducer1,
  });
  const store2 = configureStore({
    reducer: reducer2,
  });
  const store3 = configureStore({
    reducer: reducer3,
  });
  const store4 = configureStore({
    reducer: reducer4,
  });
  const store5 = configureStore({
    reducer: reducer5,
  });

  test('all data defined, and return an object', () => {
    const { result } = renderHookWithProvider(useAccountListNativeBalances, store1);
    expect(result.current).toHaveProperty('address1', 'value1');
    expect(result.current).toHaveProperty('address2', 'value2');
  });

  test('currentChain and nativeCurrency undefined, return undefined', () => {
    const { result } = renderHookWithProvider(useAccountListNativeBalances, store2);
    expect(result.current).toBeUndefined();
  });

  test('currentNetworkBalances undefined, and return undefined', () => {
    const { result } = renderHookWithProvider(useAccountListNativeBalances, store3);
    expect(result.current).toBeUndefined();
  });

  test('accountList undefined, and return empty object', () => {
    const { result } = renderHookWithProvider(useAccountListNativeBalances, store4);
    expect(result.current).toMatchObject({});
  });

  test('obj[account.address] undefined, and return an object', () => {
    const { result } = renderHookWithProvider(useAccountListNativeBalances, store5);
    expect(result.current).toHaveProperty('address1', 'value1');
    expect(result.current).toHaveProperty('address2', undefined);
  });
});
