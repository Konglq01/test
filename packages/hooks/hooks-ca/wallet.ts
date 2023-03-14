import { useAppCASelector } from '.';
import { useMemo, useCallback } from 'react';
import { WalletInfoType } from '@portkey-wallet/types/wallet';
import { CAInfo, CAInfoType, LoginType, RegisterStatus } from '@portkey-wallet/types/types-ca/wallet';
import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { fetchCreateWalletResult, requestCreateWallet } from '@portkey-wallet/api/api-did/utils/wallet';
import { sleep } from '@portkey-wallet/utils';
import { useCurrentNetworkInfo } from './network';
import { useCurrentChain } from './chainList';
import { useCaHolderManagerInfoQuery } from '@portkey-wallet/graphql/contract/__generated__/hooks/caHolderManagerInfo';
import { getApolloClient } from '@portkey-wallet/graphql/contract/apollo';
import { request } from '@portkey-wallet/api/api-did';
import { useAppCommonDispatch } from '../index';
import { setWalletNameAction } from '@portkey-wallet/store/store-ca/wallet/actions';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/device';
import { extraDataDecode } from '@portkey-wallet/utils/device';

export interface CurrentWalletType extends WalletInfoType, CAInfoType {
  caHash?: string;
  caAddressList?: string[];
  [key: string]: any;
}

function getCurrentWalletInfo(
  walletInfo: WalletState['walletInfo'],
  currentNetwork: WalletState['currentNetwork'],
): CurrentWalletType {
  const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];

  const tmpWalletInfo: any = Object.assign({}, walletInfo, currentCAInfo, {
    caHash: currentCAInfo?.AELF?.caHash,
    caAddressList: Object.values(currentCAInfo || {})
      ?.filter((info: any) => !!info?.caAddress)
      ?.map((i: any) => i?.caAddress),
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

export const useDeviceList = (devicePin: string = '') => {
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
    fetchPolicy: 'cache-and-network',
  });

  return useMemo<DeviceItemType[]>(() => {
    if (error || !data || !data.caHolderManagerInfo || data.caHolderManagerInfo.length < 1) return [];

    const caHolderManagerInfo = data.caHolderManagerInfo[0];
    const managers = caHolderManagerInfo?.managerInfos || [];
    return managers
      .map(item => {
        const extraData = extraDataDecode(item?.extraData || '');
        return {
          ...extraData,
          managerAddress: item?.address,
        };
      })
      .reverse();
  }, [data, error]);
};

export const useSetWalletName = () => {
  const dispatch = useAppCommonDispatch();
  const networkInfo = useCurrentNetworkInfo();
  return useCallback(
    async (nickName: string) => {
      await request.wallet.editWalletName({
        baseURL: networkInfo.apiUrl,
        params: {
          nickName,
        },
      });
      dispatch(setWalletNameAction(nickName));
    },
    [dispatch, networkInfo],
  );
};

export const useCaAddresses = () => {
  const { walletInfo, currentNetwork } = useWallet();

  const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];

  return useMemo(
    () =>
      Object.values(currentCAInfo || {})
        ?.filter((info: any) => !!info?.caAddress)
        ?.map((i: any) => i?.caAddress),
    [currentCAInfo],
  );
};

export const useChainIdList = () => {
  const { walletInfo, currentNetwork } = useWallet();

  const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];

  return useMemo(
    () => Object.keys(currentCAInfo || {})?.filter((info: any) => info !== 'managerInfo'),
    [currentCAInfo],
  );
};
