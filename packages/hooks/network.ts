import { fetchChainListAsync } from '@portkey/store/network/actions';
import { ChainItemType } from '@portkey/types/chain';
import { useEffect, useMemo, useCallback } from 'react';
import { useAppCommonSelector, useAppCommonDispatch } from '.';

export function useNetwork() {
  return useAppCommonSelector(state => state.chain);
}

export function useNetworkList() {
  const { chainList } = useNetwork();
  return useMemo(() => {
    const commonList: ChainItemType[] = [];
    const customList: ChainItemType[] = [];
    const cmsList: ChainItemType[] = [];
    Array.isArray(chainList) &&
      chainList.forEach(chain => {
        if (chain.isCommon) commonList.push(chain);
        if (chain.isCustom) customList.push(chain);
        else cmsList.push(chain);
      });
    return { commonList, cmsList, customList };
  }, [chainList]);
}

export function useCurrentNetwork() {
  const { currentChain } = useNetwork();
  return useMemo(() => currentChain, [currentChain]);
}

export function useNetworkInitialization() {
  const dispatch = useAppCommonDispatch();
  useEffect(() => {
    try {
      dispatch(fetchChainListAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
}
