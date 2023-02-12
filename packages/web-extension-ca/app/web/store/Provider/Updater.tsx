import useVerifierList from 'hooks/useVerifierList';
import { useEffect, useMemo } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import useUpdateRedux from './useUpdateRedux';
import { useChainListFetch } from '@portkey/hooks/hooks-ca/chainList';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';
import { useCurrentApiUrl } from '@portkey/hooks/hooks-ca/network';
import { useRefreshTokenConfig } from '@portkey/hooks/hooks-ca/api';
import { useUserInfo } from './hooks';
import { request } from '@portkey/api/api-did';
import useLocking from 'hooks/useLocking';

export default function Updater() {
  const onLocking = useLocking();
  const { passwordSeed } = useUserInfo();
  useVerifierList();
  useUpdateRedux();
  useChainListFetch();
  useRefreshTokenConfig(passwordSeed);
  useEffect(() => {
    keepAliveOnPages();
  }, []);

  const apiUrl = useCurrentApiUrl();

  useMemo(() => {
    request.set('baseURL', apiUrl);
  }, [apiUrl]);

  // Query the caAddress of each chain by Contract
  useCaInfoOnChain();

  useMemo(() => {
    request.setLockCallBack(onLocking);
  }, [onLocking]);
  return null;
}
