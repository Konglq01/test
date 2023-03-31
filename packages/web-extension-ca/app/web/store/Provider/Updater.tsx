import useVerifierList from 'hooks/useVerifierList';
import { useEffect, useMemo } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import useUpdateRedux from './useUpdateRedux';
import { useChainListFetch } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';
import { useCurrentApiUrl } from '@portkey-wallet/hooks/hooks-ca/network';
import { useRefreshTokenConfig } from '@portkey-wallet/hooks/hooks-ca/api';
import { useUserInfo } from './hooks';
import { request } from '@portkey-wallet/api/api-did';
import useLocking from 'hooks/useLocking';
import { useActiveLockStatus } from 'hooks/useActiveLockStatus';
import useLocationChange from 'hooks/useLocationChange';
import useLocalInfo from 'hooks/useLocalInfo';
import { useCheckManagerOnLogout } from 'hooks/useLogout';
import { useCheckManager } from '@portkey-wallet/hooks/hooks-ca/graphql';
import { useCheckUpdate } from 'hooks/useCheckUpdate';

keepAliveOnPages({});

export default function Updater() {
  const onLocking = useLocking();
  const { passwordSeed } = useUserInfo();
  const checkManagerOnLogout = useCheckManagerOnLogout();

  useVerifierList();
  useUpdateRedux();
  useLocationChange();
  useChainListFetch();
  useRefreshTokenConfig(passwordSeed);
  useLocalInfo();
  const checkUpdate = useCheckUpdate();
  const apiUrl = useCurrentApiUrl();

  useCheckManager(checkManagerOnLogout);

  useEffect(() => {
    checkUpdate();
  }, [checkUpdate]);

  useMemo(() => {
    request.set('baseURL', apiUrl);
  }, [apiUrl]);
  // TODO
  // Query the caAddress of each chain by Contract
  useCaInfoOnChain();
  useActiveLockStatus();
  useMemo(() => {
    request.setLockCallBack(onLocking);
  }, [onLocking]);
  return null;
}
