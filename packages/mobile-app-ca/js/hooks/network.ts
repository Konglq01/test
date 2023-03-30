import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useOriginChainId, useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import navigationService from 'utils/navigationService';

export function useChangeNetwork(route: RouteProp<ParamListBase>) {
  const dispatch = useAppDispatch();
  const originChainId = useOriginChainId();
  const { walletInfo } = useWallet();
  return useCallback(
    (network: NetworkItem) => {
      const { caInfo } = walletInfo || {};
      const tmpCaInfo = caInfo?.[network.networkType];
      let routeName: keyof RootStackParamList = 'LoginPortkey';

      if (tmpCaInfo?.managerInfo && tmpCaInfo[originChainId]?.caAddress) routeName = 'Tab';

      if (routeName !== route.name) navigationService.reset(routeName);
      dispatch(changeNetworkType(network.networkType));
    },
    [dispatch, originChainId, route.name, walletInfo],
  );
}
