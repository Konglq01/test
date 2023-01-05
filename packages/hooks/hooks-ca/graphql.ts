import useInterval from '../useInterval';
import { DefaultChainId } from '@portkey/constants/constants-ca/network';
import { contractQueries } from '@portkey/graphql/index';
import { NetworkType } from '@portkey/types';
import { useState, useMemo } from 'react';
import { CAInfoType, LoginType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
export function useIntervalQueryCAInfoByAddress(network: NetworkType, address?: string) {
  const [info, setInfo] = useState<{ [address: string]: CAInfoType }>();
  const caInfo = useMemo(() => (address && info ? info?.[address + network] : undefined), [info, address]);
  useInterval(
    async () => {
      if (!address || caInfo) return;
      try {
        const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(network, {
          chainId: DefaultChainId,
          manager: address,
        });
        const { caAddress, caHash, loginGuardianTypeInfo } = caHolderManagerInfo[0];
        if (caAddress && caHash)
          setInfo({
            [address + network]: {
              managerInfo: {
                managerUniqueId: loginGuardianTypeInfo[0].id,
                loginGuardianType: loginGuardianTypeInfo[0].loginGuardianType,
                //TODO: dynamic type
                type: LoginType.email,
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
    [caInfo, network, address],
  );
  return caInfo;
}
