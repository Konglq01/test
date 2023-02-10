import { useAppCASelector } from '.';
import { useMemo, useCallback } from 'react';
import { WalletInfoType } from '@portkey/types/wallet';
import {
  CAInfo,
  CAInfoType,
  DeviceItemType,
  DeviceType,
  LoginType,
  RegisterStatus,
  TLoginStrType,
} from '@portkey/types/types-ca/wallet';
import { WalletState } from '@portkey/store/store-ca/wallet/type';
import { VerificationType } from '@portkey/types/verifier';
import { fetchCreateWalletResult, requestCreateWallet } from '@portkey/api/api-did/apiUtils/wallet';
import { sleep } from '@portkey/utils';
import { useCurrentNetworkInfo } from './network';
import { useCurrentChain } from './chainList';
import { useCaHolderManagerInfoQuery } from '@portkey/graphql/contract/hooks/caHolderManagerInfo';
import { getApolloClient } from '@portkey/graphql/contract/apollo';
import { DEVICE_TYPE_INFO } from '@portkey/constants/constants-ca/wallet';

export interface CurrentWalletType extends WalletInfoType, CAInfoType {
  caHash?: string;
}

function getCurrentWalletInfo(
  walletInfo: WalletState['walletInfo'],
  currentNetwork: WalletState['currentNetwork'],
): CurrentWalletType {
  const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];
  const tmpWalletInfo: any = Object.assign({}, walletInfo, currentCAInfo, {
    caHash: currentCAInfo?.AELF?.caHash,
  });
  if (tmpWalletInfo.caInfo) delete tmpWalletInfo.caInfo;
  return tmpWalletInfo;
}

export const useWallet = () => useAppCASelector(state => state.wallet);

export const useCurrentWalletInfo = () => {
  const { currentNetwork, walletInfo } = useWallet();
  return useMemo(() => getCurrentWalletInfo(walletInfo, currentNetwork), [walletInfo, currentNetwork]);
};

export const useCurrentWallet = () => {
  const wallet = useWallet();
  return useMemo(() => {
    const { walletInfo, currentNetwork, chainInfo } = wallet;
    return {
      ...wallet,
      walletInfo: getCurrentWalletInfo(walletInfo, currentNetwork),
      chainList: chainInfo?.[currentNetwork],
    };
  }, [wallet]);
};

export const useDeviceList = () => {
  const networkInfo = useCurrentNetworkInfo();
  const walletInfo = useCurrentWalletInfo();
  const chainInfo = useCurrentChain();
  const { data, error } = useCaHolderManagerInfoQuery({
    client: getApolloClient(networkInfo.networkType),
    variables: {
      dto: {
        chainId: chainInfo?.chainId,
        caHash: walletInfo.caHash,
        skipCount: 0,
        maxResultCount: 100,
      },
    },
    fetchPolicy: 'cache-first',
  });

  return useMemo<DeviceItemType[]>(() => {
    if (error || !data || !data.caHolderManagerInfo || data.caHolderManagerInfo.length < 1) return [];

    const caHolderManagerInfo = data.caHolderManagerInfo[0];
    const managers = caHolderManagerInfo?.managers || [];
    return managers
      .map(item => {
        const deviceStringArray = (item?.deviceString || '').split(',').map(item => Number(item));
        let deviceType: DeviceType = 0,
          loginTime = undefined;
        const firstNum = deviceStringArray[0];
        if (firstNum !== undefined && !isNaN(firstNum)) {
          if (DeviceType[firstNum] !== undefined) {
            deviceType = firstNum;
          } else if (!isNaN(new Date(firstNum).getTime())) {
            loginTime = firstNum;
          }
        }
        const secondNum = deviceStringArray[1];
        if (
          loginTime === undefined &&
          secondNum !== undefined &&
          !isNaN(secondNum) &&
          !isNaN(new Date(firstNum).getTime())
        ) {
          loginTime = secondNum;
        }
        return {
          deviceType,
          loginTime,
          deviceTypeInfo: DEVICE_TYPE_INFO[deviceType],
          managerAddress: item?.manager,
        };
      })
      .reverse();
  }, [data, error]);
};
