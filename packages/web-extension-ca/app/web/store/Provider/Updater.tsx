import useVerifierList from 'hooks/useVerifierList';
import { useEffect } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import useUpdateRedux from './useUpdateRedux';
import { useChainListFetch } from '@portkey/hooks/hooks-ca/chainList';
import { useCaInfoOnChain } from 'hooks/useCaInfoOnChain';

export default function Updater() {
  useVerifierList();
  useUpdateRedux();
  useChainListFetch();
  useEffect(() => {
    keepAliveOnPages();
  }, []);

  // Query the caAddress of each chain by Contract
  useCaInfoOnChain();

  return null;
}
