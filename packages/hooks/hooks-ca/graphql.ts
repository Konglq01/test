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
        if (caHolderManagerInfo.length === 0) return;
        const { caAddress, caHash, loginGuardianAccountInfo } = caHolderManagerInfo[0];
        if (caAddress && caHash && loginGuardianAccountInfo.length > 0 && loginGuardianAccountInfo[0])
          setInfo({
            [address + network]: {
              managerInfo: {
                managerUniqueId: loginGuardianAccountInfo[0].id,
                // TODO type
                // loginAccount: loginGuardianAccountInfo[0].loginAccount,
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
