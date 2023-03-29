import { useEffect, useMemo, useCallback } from 'react';
import { useAppCommonDispatch } from '../index';
import { getChainListAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCurrentWallet } from './wallet';
import { ChainId } from '@portkey-wallet/types';

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

export function useCurrentChain(chainId: ChainId = 'AELF') {
  const currentChainList = useCurrentChainList();
  return useMemo(() => currentChainList?.find(chain => chain.chainId === chainId), [currentChainList, chainId]);
}

export function useIsValidSuffix() {
  const currentChainList = useCurrentChainList();
  const chainIdArr = currentChainList?.map(chain => chain.chainId as string) || [];
  return useCallback(
    (suffix: string) => {
      return chainIdArr.includes(suffix);
    },
    [chainIdArr],
  );
}
