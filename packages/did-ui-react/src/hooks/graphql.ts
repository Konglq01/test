import useInterval from '@portkey/hooks/useInterval';
import { contractQueries } from '@portkey/graphql/index';
import { useState, useMemo } from 'react';
import { CAInfoType, LoginType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
export function useIntervalQueryCAInfoByAddress({
  uri,
  address,
  chainId,
}: {
  uri?: string;
  address?: string;
  chainId?: string;
}) {
  const [info, setInfo] = useState<CAInfoType>();
  const caInfo = useMemo(() => (address && info ? info : undefined), [info, address]);
  useInterval(
    async () => {
      console.log(address, caInfo, uri, chainId, 'caWallet===');
      if (!address || caInfo || !uri || !chainId) return;
      try {
        const { caHolderManagerInfo } = await contractQueries.getCAHolderByManagerByUrl(uri, {
          chainId,
          manager: address,
        });
        const { caAddress, caHash, loginGuardianAccountInfo } = caHolderManagerInfo[0];
        if (caAddress && caHash && loginGuardianAccountInfo[0])
          setInfo({
            managerInfo: {
              managerUniqueId: loginGuardianAccountInfo[0].id,
              loginAccount: loginGuardianAccountInfo[0].loginGuardianAccount,
              type: LoginType.email,
              verificationType: VerificationType.addManager,
            } as ManagerInfo,
            [chainId]: { caAddress, caHash },
          });
      } catch (error) {
        console.log(error, '=====error');
      }
    },
    3000,
    [caInfo, uri, address],
  );
  return caInfo;
}
