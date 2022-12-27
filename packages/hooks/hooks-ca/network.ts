import { useCurrentWallet } from './wallet';
import { useMemo } from 'react';
import { NetworkList } from '@portkey/constants/constants-ca/network';

export function useNetworkList() {
  return NetworkList;
}

export function useCurrentNetworkInfo() {
  const { currentNetwork } = useCurrentWallet();
  const networkList = useNetworkList();
  return useMemo(
    () => networkList.find(item => item.networkType === currentNetwork) || networkList[0],
    [currentNetwork, networkList],
  );
}
