import useInterval from '../useInterval';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { contractQueries } from '@portkey-wallet/graphql/index';
import { NetworkType } from '@portkey-wallet/types';
import { useState, useMemo } from 'react';
import { CAInfoType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { useAppCommonDispatch } from '../index';
import { useCurrentChain } from './chainList';
import { getChainListAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
export function useIntervalQueryCAInfoByAddress(network: NetworkType, address?: string) {
  const [info, setInfo] = useState<{ [address: string]: CAInfoType }>();
  const dispatch = useAppCommonDispatch();
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
        const { caAddress, caHash, loginGuardianInfo } = caHolderManagerInfo[0];
        if (caAddress && caHash && loginGuardianInfo.length > 0 && loginGuardianInfo[0])
          setInfo({
            [address + network]: {
              managerInfo: {
                managerUniqueId: loginGuardianInfo[0].id,
                // TODO: identifierHash is loginAccount?
                loginAccount: loginGuardianInfo[0].loginGuardian?.identifierHash,
                type: loginGuardianInfo[0].loginGuardian?.type,
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
