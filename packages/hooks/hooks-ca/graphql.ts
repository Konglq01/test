import useInterval from '../useInterval';
import { contractQueries } from '@portkey-wallet/graphql/index';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { useState, useMemo, useEffect } from 'react';
import { CAInfoType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { useCurrentWallet, useOriginChainId } from './wallet';
import useLockCallback from '../useLockCallback';
import { useGetChainInfo } from './chainList';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
export type CAWalletInfo = {
  caInfo: CAInfoType;
  originChainId: ChainId;
};
export function useIntervalQueryCAInfoByAddress(network: NetworkType, address?: string) {
  const [info, setInfo] = useState<{ [address: string]: CAWalletInfo }>();
  const getChainInfo = useGetChainInfo();
  const caInfo = useMemo(() => (address && info ? info?.[address + network] : undefined), [info, address]);
  useInterval(
    async () => {
      if (!address || caInfo) return;
      try {
        const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager(network, {
          manager: address,
        });
        if (caHolderManagerInfo.length === 0) return;
        const { caAddress, caHash, loginGuardianInfo, originChainId = DefaultChainId } = caHolderManagerInfo[0];
        if (caAddress && caHash && loginGuardianInfo.length > 0 && loginGuardianInfo[0] && originChainId) {
          const guardianList = loginGuardianInfo.filter(item => item?.chainId === originChainId);
          if (guardianList.length === 0) return;
          await getChainInfo(originChainId as ChainId);
          setInfo({
            [address + network]: {
              caInfo: {
                managerInfo: {
                  managerUniqueId: loginGuardianInfo[0].id,
                  loginAccount: loginGuardianInfo[0].loginGuardian?.identifierHash,
                  type: loginGuardianInfo[0].loginGuardian?.type,
                  verificationType: VerificationType.addManager,
                } as ManagerInfo,
                [originChainId]: { caAddress, caHash },
              },
              originChainId: originChainId as ChainId,
            },
          });
        }
      } catch (error) {
        console.log(error, '=====error');
      }
    },
    3000,
    [caInfo, network, address],
  );
  return caInfo;
}

export function useCheckManager(callBack: () => void) {
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const { caHash, address } = walletInfo || {};
  const originChainId = useOriginChainId();

  const checkManager = useLockCallback(async () => {
    try {
      if (!caHash) return;
      const info = await contractQueries.getCAHolderManagerInfo(currentNetwork, {
        dto: {
          caHash,
          maxResultCount: 1,
          skipCount: 0,
          chainId: originChainId,
        },
      });
      const { caHolderManagerInfo } = info.data || {};
      if (caHolderManagerInfo) {
        const { managerInfos } = caHolderManagerInfo[0] || {};
        const isManager = managerInfos?.some(manager => manager?.address === address);
        if (!isManager) callBack();
      }
    } catch (error) {
      console.log(error, '=====error');
    }
  }, [caHash, address, originChainId]);

  const interval = useInterval(
    () => {
      checkManager();
    },
    5000,
    [checkManager],
  );
  useEffect(() => {
    if (!caHash || !address) {
      interval.remove();
    } else {
      interval.start();
    }
  }, [caHash, address]);
}
