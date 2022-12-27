import { useEffect, useMemo } from 'react';
import { useAppCommonDispatch } from '..';
import { getChainListAsync } from '@portkey/store/store-ca/wallet/actions';
import { useCurrentWallet } from './wallet';

export function useChainListFetch() {
  const dispatch = useAppCommonDispatch();
  useEffect(() => {
    dispatch(getChainListAsync());
  }, []);
}

export function useCurrentChainList() {
  const { currentNetwork, chainInfo } = useCurrentWallet();
  return useMemo(() => chainInfo?.[currentNetwork], [chainInfo, currentNetwork]);
}
