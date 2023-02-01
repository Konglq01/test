import { NetworkItem } from '@portkey/types/types-ca/network';
import { useWallet } from '@portkey/hooks/hooks-ca/wallet';
import { changeNetworkType } from '@portkey/store/store-ca/wallet/actions';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import { useCallback, useMemo } from 'react';
import { useAppDispatch } from 'store/hooks';
import navigationService from 'utils/navigationService';
import { request, RequestType } from 'api';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { service } from 'api/utils';

export function useChangeNetwork(route: RouteProp<ParamListBase>) {
  const dispatch = useAppDispatch();
  const { walletInfo } = useWallet();
  return useCallback(
    (network: NetworkItem) => {
      const { caInfo } = walletInfo || {};
      const tmpCaInfo = caInfo?.[network.networkType];
      let routeName: keyof RootStackParamList = 'LoginPortkey';

      if (tmpCaInfo?.managerInfo && tmpCaInfo.AELF?.caAddress) routeName = 'Tab';

      if (routeName !== route.name) navigationService.reset(routeName);
      dispatch(changeNetworkType(network.networkType));
    },
    [dispatch, route.name, walletInfo],
  );
}

export function useCurrentRequest(): RequestType {
  const { apiUrl } = useCurrentNetworkInfo();
  return useMemo(() => {
    if (service.defaults.baseURL !== apiUrl) service.defaults.baseURL = apiUrl;
    return request;
  }, [apiUrl]);
}
