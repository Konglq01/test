import useInterval from '../useInterval';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { contractQueries } from '@portkey-wallet/graphql/index';
import { NetworkType } from '@portkey-wallet/types';
import { useState, useMemo, useEffect } from 'react';
import { CAInfoType, ManagerInfo } from '@portkey-wallet/types/types-ca/wallet';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { useAppCommonDispatch } from '../index';
import { useCurrentChain } from './chainList';
import { getChainListAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { useCurrentWallet } from './wallet';
import useLockCallback from '../useLockCallback';
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

export function useCheckManager(callBack: () => void) {
  const { walletInfo, currentNetwork } = useCurrentWallet();
  const { caHash, address } = walletInfo || {};
  const checkManager = useLockCallback(async () => {
    try {
      if (!caHash) return;
      const info = await contractQueries.getCAHolderManagerInfo(currentNetwork, {
        dto: {
          caHash,
          maxResultCount: 1,
          skipCount: 0,
          chainId: DefaultChainId,
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
  }, [caHash, address]);

  const interval = useInterval(
    () => {
      console.log('interval');

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
