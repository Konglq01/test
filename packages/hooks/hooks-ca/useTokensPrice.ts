import { fetchTokensPriceAsync } from '@portkey/store/store-ca/assets/slice';
import { useMemo, useCallback, useEffect } from 'react';
import { useAppCASelector, useAppCommonDispatch } from '../index';

export function useTokenPrice(symbols: string[]) {
  const { tokenPrices } = useAppCASelector(state => state.assets);
  const dispatch = useAppCommonDispatch();
  const getTokenPrice = useCallback(async () => {
    if (!symbols) return;
    dispatch(fetchTokensPriceAsync({ symbols }));
  }, [dispatch, symbols]);

  useEffect(() => {
    getTokenPrice();
  }, [getTokenPrice]);

  const chainTokenPrices = useMemo(
    // TODO
    () => symbols.map(symbol => tokenPrices.tokenPriceObject?.[symbol.toLocaleLowerCase()] || 0),
    [tokenPrices, symbols],
  );

  return useMemo(() => chainTokenPrices, [chainTokenPrices]);
}
