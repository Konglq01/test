import useInterval from '../useInterval';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { contractQueries } from '@portkey/graphql/index';
import { NetworkType } from '@portkey/types';
import { useState, useMemo } from 'react';
import { CAInfoType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { useAppDispatch } from 'store/hooks';
import { useCurrentChain } from './chainList';
import { getChainListAsync } from '@portkey/store/store-ca/wallet/actions';
export function useIntervalQueryCAInfoByAddress(network: NetworkType, address?: string) {
  const [info, setInfo] = useState<{ [address: string]: CAInfoType }>();
  const dispatch = useAppDispatch();
  const chainInfo = useCurrentChain('AELF');
  const caInfo = useMemo(() => (address && info ? info?.[address + network] : undefined), [info, address]);
  useInterval(
    async () => {
      if (!address || caInfo) return;
      try {
        if (!chainInfo) await dispatch(getChainListAsync());
        const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(network, {
          chainId: DefaultChainId,
          manager: address,
        });
        if (caHolderManagerInfo.length === 0) return;
        const { caAddress, caHash, loginGuardianAccountInfo } = caHolderManagerInfo[0];
        if (caAddress && caHash && loginGuardianAccountInfo.length > 0 && loginGuardianAccountInfo[0])
          setInfo({
            [address + network]: {
              managerInfo: {
                managerUniqueId: loginGuardianAccountInfo[0].id,
                loginAccount: loginGuardianAccountInfo[0].loginGuardianAccount?.value,
                type: loginGuardianAccountInfo[0].loginGuardianAccount?.guardian?.type,
                verificationType: VerificationType.addManager,
              } as ManagerInfo,
              [DefaultChainId]: { caAddress, caHash },
            },
          });
      } catch (error) {
        console.log(error, '=====error');
      }
    },
    3000,
    [caInfo, network, address, chainInfo],
  );
  return caInfo;
}
