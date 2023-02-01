import useVerifierList from 'hooks/useVerifierList';
import { useEffect } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import useUpdateRedux from './useUpdateRedux';
import { useChainListFetch } from '@portkey/hooks/hooks-ca/chainList';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';
import { useCurrentApiUrl } from '@portkey/hooks/hooks-ca/network';
import serverConfig from '@portkey/api/server/config';

export default function Updater() {
  useVerifierList();
  useUpdateRedux();
  useChainListFetch();
  useEffect(() => {
    keepAliveOnPages();
  }, []);

  const apiUrl = useCurrentApiUrl();

  useEffect(() => {
    serverConfig.set('baseURL', apiUrl);
  }, [apiUrl]);

  // Query the caAddress of each chain by Contract
  useCaInfoOnChain();

  return null;
}
