import { useAppCASelector } from '.';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { WalletInfoType } from '@portkey-wallet/types/wallet';
import { CAInfoType } from '@portkey-wallet/types/types-ca/wallet';
import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';
import { useCurrentNetworkInfo } from './network';
import { useCurrentChain } from './chainList';
import { useCaHolderManagerInfoQuery } from '@portkey-wallet/graphql/contract/__generated__/hooks/caHolderManagerInfo';
import { getApolloClient } from '@portkey-wallet/graphql/contract/apollo';
import { request } from '@portkey-wallet/api/api-did';
import { useAppCommonDispatch } from '../index';
import { setWalletNameAction } from '@portkey-wallet/store/store-ca/wallet/actions';
import { DeviceInfoType, DeviceItemType } from '@portkey-wallet/types/types-ca/device';
import { extraDataDecode, extraDataListDecode } from '@portkey-wallet/utils/device';
import { ChainId } from '@portkey-wallet/types';

export interface CurrentWalletType extends WalletInfoType, CAInfoType {
  caHash?: string;
  caAddressList?: string[];
  [key: string]: any;
}

function getCurrentWalletInfo(
  walletInfo: WalletState['walletInfo'],
  currentNetwork: WalletState['currentNetwork'],
  originChainId: ChainId,
): CurrentWalletType {
  const currentCAInfo = walletInfo?.caInfo?.[currentNetwork];

  const tmpWalletInfo: any = Object.assign({}, walletInfo, currentCAInfo, {
    caHash: currentCAInfo?.[originChainId]?.caHash,
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
  const originChainId = useOriginChainId();
  return useMemo(() => getCurrentWalletInfo(walletInfo, currentNetwork, originChainId), [walletInfo, currentNetwork]);
};

export const useCurrentWallet = () => {
  const wallet = useWallet();
  const originChainId = useOriginChainId();

  return useMemo(() => {
    const { walletInfo, currentNetwork, chainInfo } = wallet;
    return {
      ...wallet,
      walletInfo: getCurrentWalletInfo(walletInfo, currentNetwork, originChainId),
      chainList: chainInfo?.[currentNetwork],
    };
  }, [wallet]);
};

export const useCurrentWalletDetails = () => {
  const { walletInfo, currentNetwork } = useWallet() || {};
  const originChainId = useOriginChainId();

  return useMemo(() => {
    return getCurrentWalletInfo(walletInfo, currentNetwork, originChainId);
  }, [walletInfo, currentNetwork]);
};

export const useDeviceList = () => {
  const networkInfo = useCurrentNetworkInfo();
  const walletInfo = useCurrentWalletInfo();
  const originChainId = useOriginChainId();
  const chainInfo = useCurrentChain(originChainId);
  const { data, error, refetch } = useCaHolderManagerInfoQuery({
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

  const [deviceList, setDeviceList] = useState<
    {
      managerAddress: string | null | undefined;
      deviceInfo: DeviceInfoType;
      transactionTime: number;
      version: string;
    }[]
  >([]);

  const getDeviceList = useCallback(async () => {
    if (error || !data || !data.caHolderManagerInfo || data.caHolderManagerInfo.length < 1) {
      setDeviceList([]);
      return;
    }

    const caHolderManagerInfo = data.caHolderManagerInfo[0];
    const managers = caHolderManagerInfo?.managerInfos || [];
    console.log('managers===', managers);

    const extraDataList = await extraDataListDecode(managers.map(item => item?.extraData || ''));
    const _deviceList = managers
      .map((item, idx) => {
        return {
          ...extraDataList[idx],
          managerAddress: item?.address,
        };
      })
      .reverse();

    setDeviceList(_deviceList);
  }, [error, data]);

  useEffect(() => {
    getDeviceList();
  }, [getDeviceList]);

  return { deviceList, refetch };
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

export const useOriginChainId = () => {
  const { originChainId } = useWallet();
  return useMemo(() => originChainId || 'tDVV', []);
};
