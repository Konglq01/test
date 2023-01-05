import useInterval from '../useInterval';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { contractQueries } from '@portkey/graphql/index';
import { NetworkType } from '@portkey/types';
import { useState } from 'react';
import { CAInfo } from '@portkey/types/types-ca/wallet';
export function useIntervalQueryManagerInfo(network: NetworkType, address?: string) {
  const [caInfo, setCAInfo] = useState<{ [address: string]: CAInfo }>();
  useInterval(
    async () => {
      if (!address) return;
      try {
        const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(network, {
          chainId: DefaultChainId,
          manager: address,
        });
        console.log(caHolderManagerInfo, '=====caHolderManagerInfo');
        const { caAddress, caHash } = caHolderManagerInfo[0];
        if (caAddress && caHash) setCAInfo({ address: { caAddress, caHash } });
      } catch (error) {
        console.log(error, '=====error');
      }
    },
    2000,
    [],
  );
  return address && caInfo ? caInfo[address] : undefined;
}
