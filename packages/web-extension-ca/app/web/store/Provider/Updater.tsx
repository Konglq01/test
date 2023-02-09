import useVerifierList from 'hooks/useVerifierList';
import { useEffect, useMemo } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import useUpdateRedux from './useUpdateRedux';
import { useChainListFetch } from '@portkey/hooks/hooks-ca/chainList';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';
import { useCurrentApiUrl } from '@portkey/hooks/hooks-ca/network';
import myServer from '@portkey/api/server';

export default function Updater() {
  useVerifierList();
  useUpdateRedux();
  useChainListFetch();
  useEffect(() => {
    keepAliveOnPages();
  }, []);

  const apiUrl = useCurrentApiUrl();

  useMemo(() => {
    myServer.set('baseURL', apiUrl);
  }, [apiUrl]);

  // Query the caAddress of each chain by Contract
  useCaInfoOnChain();

  return null;
}
